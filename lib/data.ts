import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { parse } from "csv-parse/sync";
import { parseSavedJSON } from "./saved-json.mjs";
import type { Graph, Product, Replication, Study } from "./types";

export const read = (file: string) =>
  fs.readFileSync(path.join(process.cwd(), "data", file), "utf8");
export const catalog = cache((): Study[] =>
  parse(read("osdr_catalog.csv"), { columns: true, skip_empty_lines: true }),
);
export const product = cache(
  (): Product => parseSavedJSON(read("results/product_OSD-421.json")),
);
export const replication = cache((): { leads: Replication[] } =>
  parseSavedJSON(read("results/replicate_OSD-421.json")),
);
export const graph = cache(
  (): Graph => parseSavedJSON(read("results/graph.json")),
);
export const inspiration = cache(
  () =>
    JSON.parse(read("inspiration4.json")) as {
      mission: string;
      source: string;
      note: string;
      studies: { osd_id: string; title: string; assay: string }[];
    },
);
export const manifest = cache(
  () =>
    JSON.parse(read("provenance.json")) as {
      commit: string;
      source: string;
      files: { path: string; sha256: string; rows?: number }[];
    },
);
export const totals = cache(() => ({
  studies: catalog().length,
  rows: manifest()
    .files.filter((f) => f.path.startsWith("raw/"))
    .reduce((n, f) => n + (f.rows ?? 0), 0),
  survivors: product().survivors.length,
  findings: graph().nodes.filter((n) => n.type === "finding").length,
}));
export const versions = cache(() => {
  const train = parse(read("results/metrics.csv"), {
    columns: true,
    skip_empty_lines: true,
  }) as { rules_version: string; reason_accuracy: string }[];
  return [0, 2, 4].map((v) => {
    const holdout = JSON.parse(read(`results/holdout_rules_v${v}.json`));
    return {
      version: v,
      train: Number(
        train.find((t) => Number(t.rules_version) === v)?.reason_accuracy,
      ),
      holdout: Number(holdout.metrics["screening/reason_accuracy"]),
      falseKills: Number(holdout.metrics["screening/false_kills"]),
      n: Number(holdout.n),
      rules: read(`rules/rules_v${v}.md`),
    };
  });
});
export const osdr = (id: string) =>
  `https://osdr.nasa.gov/bio/repo/data/studies/${encodeURIComponent(id)}`;
export const number = (value: number) => value.toLocaleString("en-US");
