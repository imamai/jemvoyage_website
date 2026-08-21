import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.trim() && !l.trim().startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const anon = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const pass = (m) => console.log("  PASS  " + m);
const fail = (m) => { console.log("  FAIL  " + m); process.exitCode = 1; };

console.log("\n--- anon key against edos_websites ---");

let r = await anon.from("jemvoyage_media").select("id").limit(1);
r.error ? fail("read jemvoyage_media: " + r.error.message)
        : pass(`read jemvoyage_media (public policy) -> ${r.data.length} rows`);

r = await anon.from("jemvoyage_roles").select("id").limit(1);
(!r.error && r.data.length === 0) ? pass("jemvoyage_roles hidden from anon (staff-only policy)")
  : r.error ? pass("jemvoyage_roles denied to anon: " + r.error.code)
  : fail("LEAK: anon read " + r.data.length + " role rows");

r = await anon.from("jemvoyage_users").select("id").limit(1);
(!r.error && r.data.length === 0) ? pass("jemvoyage_users hidden from anon")
  : r.error ? pass("jemvoyage_users denied to anon: " + r.error.code)
  : fail("LEAK: anon read " + r.data.length + " user rows");

r = await anon.rpc("jemvoyage_is_staff");
r.error ? pass("jemvoyage_is_staff RPC denied to anon (grant hardening works)")
        : fail("jemvoyage_is_staff is still anon-callable, returned: " + JSON.stringify(r.data));

r = await anon.from("margaret_profiles").select("id").limit(1);
console.log(`  INFO  cross-app probe margaret_profiles -> ${r.error ? "denied (" + r.error.code + ")" : r.data.length + " rows"}`);

const { data: buckets, error: bErr } = await anon.storage.listBuckets();
if (bErr) console.log("  INFO  listBuckets denied to anon (expected)");
else {
  const jem = (buckets ?? []).filter((b) => b.name.startsWith("jemvoyage-"));
  pass(`storage reachable; ${jem.length} jemvoyage-* buckets visible`);
}
console.log("");
