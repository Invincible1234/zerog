import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { parseExpression, queryExpression } from "../lib/expression.mjs";

const sample = `ENSEMBL,SYMBOL,GENENAME,Log2fc_(Flight)v(Ground),Adj.p.value_(Flight)v(Ground),Log2fc_(Ground)v(Flight),Adj.p.value_(Ground)v(Flight)
EN1,Alpha,"Annotation, with comma",-2.1,0.001,2.1,0.001
EN2,Beta,NA,NA,NA,NA,NA
EN3,Gamma,Zero effect,0,0.04,0,0.04
EN4,Delta,Missing adjusted p,3,,-3,
EN5,Epsilon,High adjusted p,1.2,0.8,-1.2,0.8
EN6,Zeta,Nonfinite,Infinity,NaN,-Infinity,NaN
`;
const parsed = parseExpression(sample);
test("missing and non-finite statistics stay unavailable, while true zero stays zero", () => {
  const data = queryExpression(parsed, { sort: "symbol" });
  assert.equal(data.rows.find((r) => r.symbol === "Beta").adjustedP, null);
  assert.equal(data.rows.find((r) => r.symbol === "Delta").adjustedP, null);
  assert.equal(data.rows.find((r) => r.symbol === "Zeta").effect, null);
  assert.equal(data.rows.find((r) => r.symbol === "Gamma").effect, 0);
  assert.equal(data.withStatistics, 3);
  assert.equal(data.significant, 2);
});
test("contrast reversal preserves meaning and statistical significance", () => {
  const flight = queryExpression(parsed, {
    query: "Alpha",
    contrast: "(Flight)v(Ground)",
  });
  const ground = queryExpression(parsed, {
    query: "Alpha",
    contrast: "(Ground)v(Flight)",
  });
  assert.equal(flight.rows[0].effect, -ground.rows[0].effect);
  assert.equal(flight.rows[0].adjustedP, ground.rows[0].adjustedP);
  assert.equal(flight.contrast.positive, "Flight");
});
test("annotation search respects quoted CSV, with pagination and no missing-value false positives", () => {
  assert.equal(
    queryExpression(parsed, { query: "with comma" }).rows[0].symbol,
    "Alpha",
  );
  assert.equal(queryExpression(parsed, { significant: true }).matched, 2);
  assert.equal(queryExpression(parsed, { query: "no such gene" }).matched, 0);
  const paged = queryExpression(parsed, {
    pageSize: 2,
    page: 3,
    sort: "symbol",
  });
  assert.equal(paged.rows.length, 2);
  assert.equal(paged.pages, 3);
  assert.throws(
    () => queryExpression(parsed, { contrast: "invented" }),
    RangeError,
  );
  assert.throws(
    () => queryExpression(parsed, { sort: "invented" }),
    RangeError,
  );
});
test("original OSD-421 table reproduces the H2bc12 lookup without the saved critic payload", () => {
  const table = parseExpression(
    fs.readFileSync("data/raw/OSD-421_differential_expression.csv", "utf8"),
  );
  const result = queryExpression(table, { query: "H2bc12" });
  assert.equal(result.total, 22978);
  assert.equal(result.matched, 1);
  assert.equal(result.contrast.positive, "Space Flight");
  assert(result.rows[0].effect < -6.5 && result.rows[0].effect > -6.6);
  assert(result.rows[0].adjustedP < 0.000000001);
  assert.equal(result.rows[0].symbol, "H2bc12");
});
