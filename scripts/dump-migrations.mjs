// Rebuilds supabase/migrations/*.sql from what is actually recorded in
// supabase_migrations.schema_migrations, so local filenames and contents match
// the applied versions exactly. Input is a persisted MCP tool result file.
import { readFileSync, writeFileSync } from "node:fs";

const src = process.argv[2];
const outDir = "supabase/migrations";

const text = JSON.parse(readFileSync(src, "utf8")).result;

// The payload is a JSON array embedded in a prose wrapper; anchor on the array
// itself rather than the delimiter, which also appears in the preamble text.
const start = text.indexOf('[{"version"');
const end = text.lastIndexOf("]") + 1;
if (start < 0 || end <= start) throw new Error("could not locate result array");

const rows = JSON.parse(text.slice(start, end));

let n = 0;
for (const row of rows) {
  const file = `${outDir}/${row.version}_${row.name}.sql`;
  let sql = String(row.sql).trimEnd();
  if (!sql.endsWith(";")) sql += ";";
  writeFileSync(file, sql + "\n", "utf8");
  console.log(`  ${row.version}_${row.name}.sql  (${sql.length.toLocaleString()} chars)`);
  n++;
}
console.log(`\nwrote ${n} migration files`);
