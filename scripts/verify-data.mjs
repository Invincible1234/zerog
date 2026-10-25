import fs from "node:fs";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { parse } from "csv-parse/sync";
import { parseSavedJSON } from "../lib/saved-json.mjs";
const load = (file) => parseSavedJSON(fs.readFileSync(`data/${file}`, "utf8"));
assert.deepEqual(
  parseSavedJSON(
    '{"a":NaN,"b":Infinity,"c":-Infinity,"note":"NaN and Infinity"}',
  ),
  { a: null, b: null, c: null, note: "NaN and Infinity" },
);
const manifest = load("provenance.json");
for (const file of manifest.files) {
  const bytes = fs.readFileSync(`data/${file.path}`);
  assert.equal(
    crypto.createHash("sha256").update(bytes).digest("hex"),
    file.sha256,
    `Source changed: ${file.path}`,
  );
  if (file.rows !== undefined)
    assert.equal(
      parse(bytes, { skip_empty_lines: true }).length - 1,
      file.rows,
    );
}
const catalog = parse(fs.readFileSync("data/osdr_catalog.csv"), {
  columns: true,
  skip_empty_lines: true,
});
const product = load("results/product_OSD-421.json"),
  graph = load("results/graph.json");
assert.equal(catalog.length, 243);
assert.equal(
  manifest.files.reduce((sum, f) => sum + (f.rows ?? 0), 0),
  92959,
);
assert.equal(product.survivors.length, 38);
assert.equal(
  product.leads.length,
  product.survivors.length + product.killed.length,
);
assert.equal(graph.nodes.filter((n) => n.type === "finding").length, 294);
const ids = new Set(graph.nodes.map((n) => n.id));
for (const edge of graph.edges) {
  assert(ids.has(edge.src), `Missing graph source ${edge.src}`);
  assert(ids.has(edge.dst), `Missing graph target ${edge.dst}`);
}
assert.equal(product.rules.split("/").at(-1), "rules_v2.md");
assert.equal(load("inspiration4.json").status, "listed_only");
for (const study of load("inspiration4.json").studies)
  assert(
    !manifest.files.some(
      (f) => f.path.startsWith("raw/") && f.path.includes(study.osd_id + "_"),
    ),
  );
console.log(
  "PASS: checksums, CSV row counts, saved totals, graph references, v2 product pin, and Inspiration4 directory isolation.",
);
