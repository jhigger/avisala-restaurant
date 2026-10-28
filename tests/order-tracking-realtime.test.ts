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

describe("Customer Order Tracking Realtime Stepper Seam (Issue #10)", () => {
  const pageSourcePath = path.resolve(
    process.cwd(),
    "src/app/orders/[id]/page.tsx",
  );
  const pageSource = fs.readFileSync(pageSourcePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    pageSourcePath,
    pageSource,
    ts.ScriptTarget.Latest,
    true,
  );

  test("1. refetchInterval is completely removed from api.order.getById.useQuery", () => {
    assert.equal(
      pageSource.includes("refetchInterval"),
      false,
      "src/app/orders/[id]/page.tsx must not contain any refetchInterval polling configuration",
    );
    assert.equal(
      pageSource.includes("Auto-refreshes every 3 seconds"),
      false,
      "Obsolete polling text 'Auto-refreshes every 3 seconds' must be removed",
    );

    // Verify AST does not have refetchInterval in api.order.getById.useQuery options
    let foundGetByIdCall = false;
    let foundRefetchInterval = false;

    function visit(node: ts.Node) {
      if (
        ts.isCallExpression(node) &&
        node.expression.getText(sourceFile).includes("api.order.getById.useQuery")
      ) {
        foundGetByIdCall = true;
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
    assert.ok(foundGetByIdCall, "Must find api.order.getById.useQuery call");
    assert.equal(
      foundRefetchInterval,
      false,
      "api.order.getById.useQuery must not have refetchInterval property",
    );
  });

  test("2. useOrderRealtime is imported and invoked with route id in src/app/orders/[id]/page.tsx", () => {
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
            if (el.name.getText(sourceFile) === "useOrderRealtime") {
              hasImport = true;
            }
          }
        }
      }
    }
    assert.ok(
      hasImport,
      "src/app/orders/[id]/page.tsx must import useOrderRealtime from ~/hooks/use-order-realtime",
    );

    // Check invocation
    let hasCallWithId = false;
    function visit(node: ts.Node) {
      if (
        ts.isCallExpression(node) &&
        node.expression.getText(sourceFile) === "useOrderRealtime"
      ) {
        const firstArg = node.arguments[0]?.getText(sourceFile);
        if (firstArg === "id") {
          hasCallWithId = true;
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(sourceFile);
    assert.ok(
      hasCallWithId,
      "Must invoke useOrderRealtime(id) with the unwrapped route param id",
    );
  });

  test("3. Header renders subtle 'Live Updates' badge with active green indicator dot when connected", () => {
    assert.ok(
      pageSource.includes("Live Updates"),
      "Must render a 'Live Updates' badge in header",
    );
    // Green indicator dot check
    assert.ok(
      pageSource.includes("bg-emerald-500"),
      "Must include an active green indicator dot with bg-emerald-500",
    );
    assert.ok(
      pageSource.includes("animate-ping") || pageSource.includes("animate-pulse"),
      "Must animate the green indicator dot",
    );

    // Badge should be conditioned on isLive or isConnected
    const badgeConditioned =
      pageSource.includes("isLive &&") ||
      pageSource.includes("isLive ?") ||
      pageSource.includes("isConnected &&") ||
      pageSource.includes("isConnected ?");

    assert.ok(
      badgeConditioned,
      "Live Updates badge must be conditionally rendered based on isLive / isConnected",
    );
  });
});
