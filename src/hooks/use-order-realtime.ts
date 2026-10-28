"use client";

import { useEffect, useState } from "react";
import {
  REALTIME_SUBSCRIBE_STATES,
  type RealtimeChannel,
  type SupabaseClient,
} from "@supabase/supabase-js";
import { supabaseBrowser } from "~/lib/supabase/client";
import { api } from "~/trpc/react";

export interface RealtimeHookResult {
  /** True when the Supabase Realtime channel is successfully connected and listening */
  isLive: boolean;
  /** Backwards-compatible alias for isLive */
  isConnected: boolean;
}

export interface RealtimeHookOptions {
  supabase?: SupabaseClient;
  utils?: ReturnType<typeof api.useUtils>;
}

export type UseOrderRealtimeOptions = RealtimeHookOptions;
export type UseKDSOrdersRealtimeOptions = RealtimeHookOptions;

/**
 * Safely access tRPC utils without throwing if invoked outside of TRPCReactProvider (e.g. in test runners)
 */
function useSafeTRPCUtils(): ReturnType<typeof api.useUtils> | undefined {
  try {
    return api.useUtils();
  } catch {
    return undefined;
  }
}

/**
 * React hook that subscribes to Supabase Realtime UPDATE events for a specific order.
 * Reactively invalidates tRPC getById cache and manages channel lifecycle.
 */
export function useOrderRealtime(
  orderId: string | undefined | null,
  options?: UseOrderRealtimeOptions,
): RealtimeHookResult {
  const contextUtils = useSafeTRPCUtils();
  const utils = options?.utils ?? contextUtils;
  const supabase = options?.supabase ?? supabaseBrowser;

  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setIsLive(false);
      return;
    }

    const channelName = `order:${orderId}`;
    const channel: RealtimeChannel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Order",
          filter: `id=eq.${orderId}`,
        },
        () => {
          void utils?.order.getById.invalidate({ id: orderId });
        },
      )
      .subscribe((status) => {
        setIsLive(status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
      });

    return () => {
      void supabase.removeChannel(channel);
      setIsLive(false);
    };
  }, [orderId, supabase, utils]);

  return { isLive, isConnected: isLive };
}

/**
 * React hook that subscribes to Supabase Realtime INSERT and UPDATE events for all orders.
 * Used by the Kitchen Display System (KDS) to reactively invalidate the getAll order query.
 */
export function useKDSOrdersRealtime(
  options?: UseKDSOrdersRealtimeOptions,
): RealtimeHookResult {
  const contextUtils = useSafeTRPCUtils();
  const utils = options?.utils ?? contextUtils;
  const supabase = options?.supabase ?? supabaseBrowser;

  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const handleOrderChange = () => {
      void utils?.order.getAll.invalidate();
    };

    const channel: RealtimeChannel = supabase
      .channel("kds:orders")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Order",
        },
        handleOrderChange,
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Order",
        },
        handleOrderChange,
      )
      .subscribe((status) => {
        setIsLive(status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
      });

    return () => {
      void supabase.removeChannel(channel);
      setIsLive(false);
    };
  }, [supabase, utils]);

  return { isLive, isConnected: isLive };
}
