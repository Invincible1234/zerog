import "server-only";
import { manifest, read } from "./data";
import { parseExpression, queryExpression } from "./expression.mjs";
import type { TablePage } from "./types";
export type { TablePage } from "./types";

const tables = new Map<string, ReturnType<typeof parseExpression>>();
export function localTablePath(osd: string) {
  return manifest().files.find(
    (f) =>
      f.path.startsWith("raw/") &&
      f.path.match(/^raw\/(OSD-\d+)_/)?.[1] === osd,
  )?.path;
}
export function tablePage(
  osd: string,
  options: Parameters<typeof queryExpression>[1] = {},
): TablePage | null {
  const sourceFile = localTablePath(osd);
  if (!sourceFile) return null;
  let table = tables.get(osd);
  if (!table) {
    table = parseExpression(read(sourceFile));
    if (tables.size >= 2) tables.delete(tables.keys().next().value!);
    tables.set(osd, table);
  }
  return { osd, sourceFile, ...queryExpression(table, options) };
}
