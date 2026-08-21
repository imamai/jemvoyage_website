/**
 * Builds src/lib/db/database.types.ts from Supabase's generated types, keeping
 * ONLY the jemvoyage_ tables and functions.
 *
 * Why filter: `edos_websites` is shared with four other applications. Emitting
 * the full generated file would hand the type checker permission to query
 * margaret_*, kida_*, mejasan_* and emiwama_* data — including through the
 * service-role client, which bypasses RLS. Narrowing the surface turns that
 * class of mistake into a compile error.
 *
 * Usage: node scripts/filter-database-types.mjs <persisted-mcp-result.txt>
 */
import { readFileSync, writeFileSync } from "node:fs";

const PREFIX = "jemvoyage_";
const OUT = "src/lib/db/database.types.ts";

const raw = readFileSync(process.argv[2], "utf8");
let src;
try {
  const parsed = JSON.parse(raw);
  src = parsed.types ?? parsed.result ?? raw;
} catch {
  src = raw;
}

/** Return the [start, end) span of the object literal that begins at `openIdx`. */
function matchBraces(text, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < text.length; i++) {
    const ch = text[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return [openIdx, i + 1];
    }
  }
  throw new Error("unbalanced braces");
}

/**
 * Split a `Name: { ... }` object literal into its direct children.
 * Returns [{ name, text }] where text is the full `name: {...}` source.
 */
function splitEntries(blockText) {
  const inner = blockText.slice(
    blockText.indexOf("{") + 1,
    blockText.lastIndexOf("}"),
  );

  const entries = [];
  let i = 0;
  while (i < inner.length) {
    const match = /(^|\n)(\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:\s*\{/.exec(
      inner.slice(i),
    );
    if (!match) break;

    const nameStart = i + match.index + match[1].length;
    const braceIdx = i + match.index + match[0].length - 1;
    const [, end] = matchBraces(inner, braceIdx);

    entries.push({ name: match[3], text: inner.slice(nameStart, end) });
    i = end;
  }
  return entries;
}

function blockAt(text, label) {
  const idx = text.indexOf(label);
  if (idx < 0) throw new Error(`missing block: ${label}`);
  const braceIdx = text.indexOf("{", idx);
  const [start, end] = matchBraces(text, braceIdx);
  return text.slice(start, end);
}

const tablesBlock = blockAt(src, "Tables: {");
const functionsBlock = blockAt(src, "Functions: {");

const tables = splitEntries(tablesBlock).filter((e) => e.name.startsWith(PREFIX));
const functions = splitEntries(functionsBlock).filter((e) =>
  e.name.startsWith(PREFIX),
);

if (tables.length === 0) throw new Error("no jemvoyage_ tables matched");

const indent = (text, spaces) =>
  text
    .split("\n")
    .map((line, i) => (i === 0 ? line : line ? " ".repeat(spaces) + line : line))
    .join("\n");

const header = `// GENERATED FILE — do not edit by hand.
//
// Rebuilt with:
//   node scripts/filter-database-types.mjs <supabase-generated-types.txt>
//
// Contains ONLY the ${tables.length} jemvoyage_ tables and ${functions.length} jemvoyage_ functions from the
// shared \`edos_websites\` project. The other applications living in that
// database (margaret_*, kida_*, mejasan_*, emiwama_*) are deliberately absent,
// so querying them fails to typecheck — including via the service-role client.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
`;

const body =
  tables.map((t) => "      " + indent(t.text, 6)).join("\n") +
  `
    }
    Views: Record<never, never>
    Functions: {
` +
  functions.map((f) => "      " + indent(f.text, 6)).join("\n") +
  `
    }
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
export type InsertDto<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]
export type UpdateDto<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
`;

writeFileSync(OUT, header + body, "utf8");

console.log(`wrote ${OUT}`);
console.log(`  tables:    ${tables.length}`);
console.log(`  functions: ${functions.length}`);
console.log(
  `  excluded:  ${splitEntries(tablesBlock).length - tables.length} tables belonging to other apps`,
);
