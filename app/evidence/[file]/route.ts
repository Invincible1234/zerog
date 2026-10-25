import { read } from "@/lib/data";
const files: Record<string, string> = {
  product: "results/product_OSD-421.json",
  replication: "results/replicate_OSD-421.json",
  graph: "results/graph.json",
  provenance: "provenance.json",
  "table-421": "raw/OSD-421_differential_expression.csv",
  ...Object.fromEntries(
    [0, 2, 4].flatMap((v) => [
      [`holdout-v${v}`, `results/holdout_rules_v${v}.json`],
      [`rules-v${v}`, `rules/rules_v${v}.md`],
    ]),
  ),
};
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  const target = Object.hasOwn(files, file) ? files[file] : undefined;
  if (!target) return new Response("Evidence file not found", { status: 404 });
  return new Response(read(target), {
    headers: {
      "Content-Type": target.endsWith("json")
        ? "application/json; charset=utf-8"
        : target.endsWith("csv")
          ? "text/csv; charset=utf-8"
          : "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${target.split("/").at(-1)}"`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
