import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

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

describe("Kitchen Display System Realtime Feed Seam (Issue #11)", () => {
  const pageSourcePath = path.resolve(
    process.cwd(),
    "src/app/admin/kds/page.tsx",
  );
  const pageSource = fs.readFileSync(pageSourcePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    pageSourcePath,
    pageSource,
    ts.ScriptTarget.Latest,
    true,
  );

  test("1. refetchInterval is completely removed from api.order.getAll.useQuery", () => {
    assert.equal(
      pageSource.includes("refetchInterval"),
      false,
      "src/app/admin/kds/page.tsx must not contain any refetchInterval polling configuration",
    );
    assert.equal(
      pageSource.includes("Live Synced (3s)"),
      false,
      "Obsolete polling text 'Live Synced (3s)' must be removed",
    );

    // Verify AST does not pass refetchInterval into api.order.getAll.useQuery
    let foundGetAllCall = false;
    let foundRefetchInterval = false;

    function visit(node: ts.Node) {
      if (
        ts.isCallExpression(node) &&
        node.expression.getText(sourceFile).includes("api.order.getAll.useQuery")
      ) {
        foundGetAllCall = true;
        const optionsArg = node.arguments[1];
        if (optionsArg && ts.isObjectLiteralExpression(optionsArg)) {
          for (const prop of optionsArg.properties) {
            if (
              ts.isPropertyAssignment(prop) &&
              prop.name.getText(sourceFile) === "refetchInterval"
            ) {
              foundRefetchInterval = true;
            }
          }
        }
      }
      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    assert.ok(foundGetAllCall, "Must find api.order.getAll.useQuery call");
    assert.equal(
      foundRefetchInterval,
      false,
      "api.order.getAll.useQuery must not have refetchInterval property",
    );
  });

  test("2. useKDSOrdersRealtime is imported and invoked in src/app/admin/kds/page.tsx", () => {
    // Check import declaration
    let hasImport = false;
    for (const stmt of sourceFile.statements) {
      if (
        ts.isImportDeclaration(stmt) &&
        stmt.moduleSpecifier.getText(sourceFile).includes("use-order-realtime")
      ) {
        const namedBindings = stmt.importClause?.namedBindings;
        if (namedBindings && ts.isNamedImports(namedBindings)) {
          for (const el of namedBindings.elements) {
            if (el.name.getText(sourceFile) === "useKDSOrdersRealtime") {
              hasImport = true;
            }
          }
        }
      }
    }
    assert.ok(
      hasImport,
      "src/app/admin/kds/page.tsx must import useKDSOrdersRealtime from ~/hooks/use-order-realtime",
    );

    // Check invocation
    let hasCall = false;
    function visit(node: ts.Node) {
      if (
        ts.isCallExpression(node) &&
        node.expression.getText(sourceFile) === "useKDSOrdersRealtime"
      ) {
        hasCall = true;
      }
      ts.forEachChild(node, visit);
    }
    visit(sourceFile);
    assert.ok(
      hasCall,
      "Must invoke useKDSOrdersRealtime() in KDSPage component lifecycle",
    );
  });

  test("3. Header renders subtle 'Live Feed' badge with active emerald dot alongside clock", () => {
    assert.ok(
      pageSource.includes("Live Feed"),
      "Must render a 'Live Feed' badge in header",
    );
    assert.ok(
      pageSource.includes("bg-emerald-500"),
      "Must include active green indicator dot with bg-emerald-500",
    );
    assert.ok(
      pageSource.includes("animate-ping") || pageSource.includes("animate-pulse"),
      "Must animate the green indicator dot",
    );

    // Check clock representation next to Live Feed
    assert.ok(
      pageSource.includes("<Clock") || pageSource.includes("Clock className"),
      "Must render clock icon in header alongside status badge",
    );
    assert.ok(
      pageSource.includes("toLocaleTimeString"),
      "Must format time for the auto-updating clock",
    );

    // Badge should be conditioned on isLive
    const badgeConditioned =
      pageSource.includes("isLive ?") ||
      pageSource.includes("isLive &&") ||
      pageSource.includes("isConnected ?") ||
      pageSource.includes("isConnected &&");

    assert.ok(
      badgeConditioned,
      "Live Feed badge must be conditionally rendered based on isLive / isConnected",
    );
  });

  test("4. Existing optimistic status mutations are preserved with cache invalidation", () => {
    assert.ok(
      pageSource.includes("updateStatusMutation = api.order.updateStatus.useMutation"),
      "Must retain updateStatusMutation",
    );
    assert.ok(
      pageSource.includes("utils.order.getAll.cancel()"),
      "Must cancel queries on optimistic update",
    );
    assert.ok(
      pageSource.includes("utils.order.getAll.setData"),
      "Must set optimistic query data",
    );
    assert.ok(
      pageSource.includes("void utils.order.getAll.invalidate()"),
      "Must invalidate queries on settled mutation",
    );
  });
});
