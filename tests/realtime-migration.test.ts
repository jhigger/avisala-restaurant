import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Database Realtime Publication Migration", () => {
  const migrationsDir = path.resolve(process.cwd(), "prisma/migrations");
  let migrationDir: string | undefined;
  let migrationFilePath: string;

  before(() => {
    assert.ok(
      fs.existsSync(migrationsDir),
      "prisma/migrations directory should exist",
    );

    const entries = fs.readdirSync(migrationsDir);
    migrationDir = entries.find((dir) =>
      dir.endsWith("_enable_order_realtime"),
    );
    if (migrationDir) {
      migrationFilePath = path.join(migrationsDir, migrationDir, "migration.sql");
    }
  });

  test("1. A migration directory matching *_enable_order_realtime exists", () => {
    assert.ok(
      migrationDir,
      "Expected a directory ending with '_enable_order_realtime' in prisma/migrations",
    );

    const fullDirPath = path.join(migrationsDir, migrationDir);
    assert.ok(
      fs.statSync(fullDirPath).isDirectory(),
      "Migration path must be a directory",
    );
  });

  test("2. Migration file contains ALTER PUBLICATION supabase_realtime ADD TABLE \"Order\";", () => {
    assert.ok(migrationDir, "Migration directory must exist");
    assert.ok(
      fs.existsSync(migrationFilePath),
      "migration.sql must exist inside the migration directory",
    );

    const sqlContent = fs.readFileSync(migrationFilePath, "utf8");
    const expectedStatement = 'ALTER PUBLICATION supabase_realtime ADD TABLE "Order";';

    assert.ok(
      sqlContent.includes(expectedStatement),
      `migration.sql must include: ${expectedStatement}`,
    );
  });
});
