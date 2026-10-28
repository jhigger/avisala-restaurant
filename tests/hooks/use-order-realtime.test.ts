import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { createRoot } from "react-dom/client";
import {
  useOrderRealtime,
  useKDSOrdersRealtime,
} from "~/hooks/use-order-realtime";
import { supabaseBrowser } from "~/lib/supabase/client";

// Setup minimal browser DOM environment for React 19 testing in Node
before(() => {
  (global as any).IS_REACT_ACT_ENVIRONMENT = true;
  class FakeElement {}
  (global as any).Element = FakeElement;
  (global as any).HTMLIFrameElement = class FakeIFrame extends FakeElement {};
  (global as any).window = global;
  (global as any).document = {
    nodeType: 9,
    documentElement: { nodeType: 1 },
    activeElement: null,
    createElement: (tag: string) => ({
      nodeType: 1,
      tagName: tag.toUpperCase(),
      ownerDocument: (global as any).document,
      setAttribute: () => {},
      removeAttribute: () => {},
      appendChild: () => {},
      removeChild: () => {},
      insertBefore: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      childNodes: [],
      style: {},
    }),
    createTextNode: () => ({ nodeType: 3 }),
    addEventListener: () => {},
    removeEventListener: () => {},
  };
});

interface MockChannelHandler {
  type: string;
  filter: {
    event: string;
    schema: string;
    table: string;
    filter?: string;
  };
  callback: (payload: any) => void;
}

interface MockChannel {
  name: string;
  handlers: MockChannelHandler[];
  subscriptionCallback?: (status: string) => void;
  on: (type: string, filter: any, callback: any) => MockChannel;
  subscribe: (cb?: (status: string) => void) => MockChannel;
  simulateEvent: (event: string, payload?: any) => void;
  simulateStatus: (status: string) => void;
}

function createMockSupabase() {
  const channels = new Map<string, MockChannel>();
  const removedChannels: MockChannel[] = [];

  const client = {
    channels,
    removedChannels,
    channel(name: string) {
      const handlers: MockChannelHandler[] = [];
      let subCallback: ((status: string) => void) | undefined;

      const ch: MockChannel = {
        name,
        handlers,
        subscriptionCallback: undefined,
        on(type: string, filter: any, callback: any) {
          handlers.push({ type, filter, callback });
          return ch;
        },
        subscribe(cb?: (status: string) => void) {
          this.subscriptionCallback = cb;
          if (cb) {
            cb("SUBSCRIBED");
          }
          return ch;
        },
        simulateEvent(event: string, payload: any = {}) {
          for (const h of handlers) {
            if (h.filter.event === event || h.filter.event === "*") {
              h.callback(payload);
            }
          }
        },
        simulateStatus(status: string) {
          this.subscriptionCallback?.(status);
        },
      };

      channels.set(name, ch);
      return ch as any;
    },
    async removeChannel(channel: any) {
      removedChannels.push(channel);
      channels.delete(channel.name);
      return "ok";
    },
  };

  return client;
}

function createMockUtils() {
  const invalidatedOrderById: Array<{ id: string }> = [];
  const invalidatedOrderAll: number[] = [];

  return {
    invalidatedOrderById,
    invalidatedOrderAll,
    order: {
      getById: {
        invalidate: async (input: { id: string }) => {
          invalidatedOrderById.push(input);
        },
      },
      getAll: {
        invalidate: async () => {
          invalidatedOrderAll.push(Date.now());
        },
      },
    },
  };
}

function renderHook<TProps, TResult>(
  hookFn: (props: TProps) => TResult,
  initialProps: TProps,
) {
  let result!: TResult;

  function TestHookComponent({ props }: { props: TProps }) {
    result = hookFn(props);
    return null;
  }

  const el = (global as any).document.createElement("div");
  const root = createRoot(el);

  React.act(() => {
    root.render(
      React.createElement(TestHookComponent, { props: initialProps }),
    );
  });

  return {
    get current() {
      return result;
    },
    rerender(newProps: TProps) {
      React.act(() => {
        root.render(
          React.createElement(TestHookComponent, { props: newProps }),
        );
      });
    },
    unmount() {
      React.act(() => {
        root.unmount();
      });
    },
  };
}

describe("Realtime Domain Hooks Seam (use-order-realtime)", () => {
  test("1. useOrderRealtime(orderId) creates scoped channel on public:Order with id=eq filter listening to UPDATE", () => {
    const mockSupabase = createMockSupabase();
    const mockUtils = createMockUtils();
    const orderId = "order-lireo-123";

    const hook = renderHook(
      (props: { orderId: string }) =>
        useOrderRealtime(props.orderId, {
          supabase: mockSupabase as any,
          utils: mockUtils as any,
        }),
      { orderId },
    );

    assert.equal(mockSupabase.channels.size, 1);
    const channel = mockSupabase.channels.get(`order:${orderId}`);
    assert.ok(channel, `Expected channel order:${orderId} to be created`);

    const updateHandler = channel.handlers.find(
      (h) =>
        h.type === "postgres_changes" &&
        h.filter.table === "Order" &&
        h.filter.schema === "public" &&
        h.filter.event === "UPDATE" &&
        h.filter.filter === `id=eq.${orderId}`,
    );
    assert.ok(
      updateHandler,
      "Channel must register postgres_changes listener for UPDATE on public:Order with id=eq filter",
    );

    assert.equal(
      hook.current.isLive,
      true,
      "isLive must be true when subscribed",
    );
    hook.unmount();
  });

  test("2. on order update event, utils.order.getById.invalidate({ id: orderId }) is called", () => {
    const mockSupabase = createMockSupabase();
    const mockUtils = createMockUtils();
    const orderId = "order-hathoria-456";

    const hook = renderHook(
      (props: { orderId: string }) =>
        useOrderRealtime(props.orderId, {
          supabase: mockSupabase as any,
          utils: mockUtils as any,
        }),
      { orderId },
    );

    const channel = mockSupabase.channels.get(`order:${orderId}`);
    assert.ok(channel);

    assert.equal(mockUtils.invalidatedOrderById.length, 0);

    // Simulate realtime UPDATE event for this order
    channel.simulateEvent("UPDATE", {
      new: { id: orderId, status: "PREPARING" },
    });

    assert.equal(
      mockUtils.invalidatedOrderById.length,
      1,
      "Expected exactly 1 getById cache invalidation",
    );
    assert.deepEqual(
      mockUtils.invalidatedOrderById[0],
      { id: orderId },
      "Must invalidate getById with the scoped orderId",
    );

    hook.unmount();
  });

  test("3. useOrderRealtime cleanly calls removeChannel on unmount and when orderId changes", () => {
    const mockSupabase = createMockSupabase();
    const mockUtils = createMockUtils();

    const hook = renderHook(
      (props: { orderId: string }) =>
        useOrderRealtime(props.orderId, {
          supabase: mockSupabase as any,
          utils: mockUtils as any,
        }),
      { orderId: "order-1" },
    );

    assert.equal(mockSupabase.channels.size, 1);
    assert.equal(mockSupabase.removedChannels.length, 0);

    // Change orderId
    hook.rerender({ orderId: "order-2" });

    assert.equal(
      mockSupabase.removedChannels.length,
      1,
      "Previous channel must be removed when orderId changes",
    );
    assert.equal(mockSupabase.removedChannels[0]?.name, "order:order-1");
    assert.ok(
      mockSupabase.channels.has("order:order-2"),
      "New channel must be established for order-2",
    );

    // Unmount
    hook.unmount();
    assert.equal(
      mockSupabase.removedChannels.length,
      2,
      "Channel must be removed on unmount",
    );
    assert.equal(mockSupabase.removedChannels[1]?.name, "order:order-2");
    assert.equal(mockSupabase.channels.size, 0);
  });

  test("4. useOrderRealtime does not create channel if orderId is missing", () => {
    const mockSupabase = createMockSupabase();
    const mockUtils = createMockUtils();

    const hook = renderHook(
      (props: { orderId?: string }) =>
        useOrderRealtime(props.orderId, {
          supabase: mockSupabase as any,
          utils: mockUtils as any,
        }),
      { orderId: undefined },
    );

    assert.equal(mockSupabase.channels.size, 0);
    assert.equal(hook.current.isLive, false);

    hook.unmount();
  });

  test("5. useKDSOrdersRealtime() creates channel listening to INSERT and UPDATE events on public:Order", () => {
    const mockSupabase = createMockSupabase();
    const mockUtils = createMockUtils();

    const hook = renderHook(
      () =>
        useKDSOrdersRealtime({
          supabase: mockSupabase as any,
          utils: mockUtils as any,
        }),
      {},
    );

    const channel = mockSupabase.channels.get("kds:orders");
    assert.ok(channel, "Expected channel kds:orders to be created");

    const hasInsertListener = channel.handlers.some(
      (h) =>
        h.type === "postgres_changes" &&
        h.filter.table === "Order" &&
        h.filter.schema === "public" &&
        (h.filter.event === "INSERT" || h.filter.event === "*"),
    );

    const hasUpdateListener = channel.handlers.some(
      (h) =>
        h.type === "postgres_changes" &&
        h.filter.table === "Order" &&
        h.filter.schema === "public" &&
        (h.filter.event === "UPDATE" || h.filter.event === "*"),
    );

    assert.ok(
      hasInsertListener,
      "Must listen to INSERT events on public:Order",
    );
    assert.ok(
      hasUpdateListener,
      "Must listen to UPDATE events on public:Order",
    );
    assert.equal(hook.current.isLive, true);

    hook.unmount();
  });

  test("6. on any order event in KDS, utils.order.getAll.invalidate() is called", () => {
    const mockSupabase = createMockSupabase();
    const mockUtils = createMockUtils();

    const hook = renderHook(
      () =>
        useKDSOrdersRealtime({
          supabase: mockSupabase as any,
          utils: mockUtils as any,
        }),
      {},
    );

    const channel = mockSupabase.channels.get("kds:orders");
    assert.ok(channel);

    assert.equal(mockUtils.invalidatedOrderAll.length, 0);

    // Simulate INSERT
    channel.simulateEvent("INSERT", {
      new: { id: "new-order-1", status: "PENDING" },
    });
    assert.equal(
      mockUtils.invalidatedOrderAll.length,
      1,
      "Expected getAll invalidation on INSERT",
    );

    // Simulate UPDATE
    channel.simulateEvent("UPDATE", {
      new: { id: "new-order-1", status: "READY" },
    });
    assert.equal(
      mockUtils.invalidatedOrderAll.length,
      2,
      "Expected getAll invalidation on UPDATE",
    );

    hook.unmount();
  });

  test("7. useKDSOrdersRealtime cleanly calls removeChannel on unmount", () => {
    const mockSupabase = createMockSupabase();
    const mockUtils = createMockUtils();

    const hook = renderHook(
      () =>
        useKDSOrdersRealtime({
          supabase: mockSupabase as any,
          utils: mockUtils as any,
        }),
      {},
    );

    assert.equal(mockSupabase.channels.size, 1);
    assert.equal(mockSupabase.removedChannels.length, 0);

    hook.unmount();

    assert.equal(
      mockSupabase.removedChannels.length,
      1,
      "KDS channel must be removed on unmount",
    );
    assert.equal(mockSupabase.removedChannels[0]?.name, "kds:orders");
    assert.equal(mockSupabase.channels.size, 0);
  });

  test("8. both hooks expose subscription status (isLive) and react to status transitions", () => {
    const mockSupabase = createMockSupabase();
    const mockUtils = createMockUtils();

    let channelRef: MockChannel | undefined;
    // Override channel subscribe to capture without auto-SUBSCRIBED
    const origChannel = mockSupabase.channel.bind(mockSupabase);
    mockSupabase.channel = (name: string) => {
      const ch = origChannel(name);
      channelRef = ch;
      ch.subscribe = (cb?: (status: string) => void) => {
        (ch as any).subscriptionCallback = cb;
        // Do not auto-call here; we test manual transition
        return ch;
      };
      return ch;
    };

    const hook = renderHook(
      () =>
        useKDSOrdersRealtime({
          supabase: mockSupabase as any,
          utils: mockUtils as any,
        }),
      {},
    );

    assert.ok(channelRef);
    assert.equal(
      hook.current.isLive,
      false,
      "Initial isLive should be false before subscription completes",
    );

    // Transition to SUBSCRIBED
    React.act(() => {
      channelRef!.simulateStatus("SUBSCRIBED");
    });
    assert.equal(
      hook.current.isLive,
      true,
      "isLive should be true after SUBSCRIBED",
    );
    assert.equal(
      hook.current.isConnected,
      true,
      "isConnected should mirror isLive",
    );

    // Transition to CHANNEL_ERROR
    React.act(() => {
      channelRef!.simulateStatus("CHANNEL_ERROR");
    });
    assert.equal(
      hook.current.isLive,
      false,
      "isLive should be false on CHANNEL_ERROR",
    );

    hook.unmount();
  });

  test("9. default invocation without options binds to supabaseBrowser", () => {
    let capturedChannelName = "";
    let capturedRemoved = false;
    const origChannel = supabaseBrowser.channel.bind(supabaseBrowser);
    const origRemoveChannel =
      supabaseBrowser.removeChannel.bind(supabaseBrowser);

    (supabaseBrowser as any).channel = (name: string) => {
      capturedChannelName = name;
      return origChannel(name);
    };
    (supabaseBrowser as any).removeChannel = async (channel: any) => {
      capturedRemoved = true;
      return origRemoveChannel(channel);
    };

    try {
      const hook = renderHook(
        (props: { orderId: string }) => useOrderRealtime(props.orderId),
        { orderId: "order-default-seam" },
      );

      assert.equal(capturedChannelName, "order:order-default-seam");
      hook.unmount();
      assert.equal(capturedRemoved, true);
    } finally {
      (supabaseBrowser as any).channel = origChannel;
      (supabaseBrowser as any).removeChannel = origRemoveChannel;
    }
  });
});
