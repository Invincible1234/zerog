import { parse } from "csv-parse/sync";

const finite = (value) => {
  if (value === undefined || value === null || String(value).trim() === "")
    return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

/** Normalize original CSV values for browsing; never alter the saved artifact. */
export function parseExpression(text) {
  const records = parse(text, { columns: true, skip_empty_lines: true });
  const headers = Object.keys(records[0] ?? {});
  const contrasts = headers
    .filter((h) => h.startsWith("Log2fc_"))
    .map((effectColumn) => {
      const key = effectColumn.slice("Log2fc_".length);
      const match = key.match(/^\((.+)\)v\((.+)\)$/);
      return {
        key,
        label: match ? `${match[1]} vs ${match[2]}` : key,
        positive: match?.[1] ?? "the first condition",
        effectColumn,
        adjustedColumn: `Adj.p.value_${key}`,
      };
    })
    .filter((c) => headers.includes(c.adjustedColumn));
  const rows = records.map((r, index) => ({
    id: r.ENSEMBL || `row-${index + 1}`,
    symbol: r.SYMBOL === "NA" ? "" : r.SYMBOL || "",
    name: r.GENENAME === "NA" ? "" : r.GENENAME || "",
    values: Object.fromEntries(
      contrasts.map((c) => [
        c.key,
        {
          effect: finite(r[c.effectColumn]),
          adjustedP: (() => {
            const p = finite(r[c.adjustedColumn]);
            return p !== null && p >= 0 && p <= 1 ? p : null;
          })(),
        },
      ]),
    ),
  }));
  return { contrasts, rows };
}

export function queryExpression(table, options = {}) {
  const contrast =
    options.contrast ||
    table.contrasts.find((c) => c.positive === "Space Flight")?.key ||
    table.contrasts[0]?.key;
  const selected = table.contrasts.find((c) => c.key === contrast);
  if (!selected)
    throw new RangeError("That contrast is not in the bundled table.");
  const query = (options.query || "").trim().toLowerCase();
  const significant = options.significant === true;
  const sort = options.sort || "adjustedP";
  if (!["adjustedP", "magnitude", "symbol"].includes(sort))
    throw new RangeError("Unknown table sort.");
  const page = Math.max(1, Math.floor(Number(options.page) || 1));
  const pageSize = Math.max(
    1,
    Math.min(100, Math.floor(Number(options.pageSize) || 30)),
  );
  let significantCount = 0,
    withStatistics = 0;
  const matches = [];
  for (const row of table.rows) {
    const stats = row.values[contrast];
    const usable = stats.effect !== null && stats.adjustedP !== null;
    if (usable) withStatistics++;
    const meetsThreshold = usable && stats.adjustedP < 0.05;
    if (meetsThreshold) significantCount++;
    if (significant && !meetsThreshold) continue;
    if (
      query &&
      !`${row.id} ${row.symbol} ${row.name}`.toLowerCase().includes(query)
    )
      continue;
    matches.push({ id: row.id, symbol: row.symbol, name: row.name, ...stats });
  }
  matches.sort((a, b) => {
    if (sort === "symbol")
      return (
        (a.symbol || a.id).localeCompare(b.symbol || b.id) ||
        a.id.localeCompare(b.id)
      );
    if (sort === "magnitude")
      return (
        (b.effect === null ? -Infinity : Math.abs(b.effect)) -
          (a.effect === null ? -Infinity : Math.abs(a.effect)) ||
        a.id.localeCompare(b.id)
      );
    return (
      (a.adjustedP ?? Infinity) - (b.adjustedP ?? Infinity) ||
      a.id.localeCompare(b.id)
    );
  });
  const pages = Math.max(1, Math.ceil(matches.length / pageSize));
  const currentPage = Math.min(page, pages);
  return {
    contrast: selected,
    contrasts: table.contrasts,
    total: table.rows.length,
    withStatistics,
    significant: significantCount,
    matched: matches.length,
    page: currentPage,
    pages,
    pageSize,
    rows: matches.slice((currentPage - 1) * pageSize, currentPage * pageSize),
  };
}
