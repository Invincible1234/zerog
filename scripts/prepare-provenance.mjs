// Run only when importing an intentional new upstream snapshot. Does not edit source artifacts.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { parse } from "csv-parse/sync";
const root = path.resolve("data");
const paths = [
  "osdr_catalog.csv",
  "studies.json",
  ...fs.readdirSync("data/raw").map((f) => `raw/${f}`),
  ...fs.readdirSync("data/results").map((f) => `results/${f}`),
  ...fs.readdirSync("data/rules").map((f) => `rules/${f}`),
  ...fs.readdirSync("data/golden").map((f) => `golden/${f}`),
];
const files = paths.map((file) => {
  const content = fs.readFileSync(path.join(root, file));
  return {
    path: file,
    sha256: crypto.createHash("sha256").update(content).digest("hex"),
    ...(file.startsWith("raw/")
      ? { rows: parse(content, { skip_empty_lines: true }).length - 1 }
      : {}),
  };
});
fs.writeFileSync(
  "data/provenance.json",
  JSON.stringify(
    {
      source: "https://github.com/Invincible1234/Coreweave_LangChain",
      commit: "fae8e9f09a9d50f9892afed1b8537028aa4e1a54",
      rowDefinition:
        "CSV records excluding header, summed across the four bundled tables. Not unique genes.",
      files,
    },
    null,
    2,
  ) + "\n",
);
console.log(`Recorded checksums for ${files.length} unchanged source files.`);
