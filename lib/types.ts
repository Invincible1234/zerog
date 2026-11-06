export type Study = {
  osd_id: string;
  title: string;
  organism: string;
  material: string;
  assay: string;
  n_samples: string;
  groups: string;
  dge_url: string;
};
export type Fact = {
  log2fc?: number;
  padj?: number;
  carriers?: string;
  higher_group?: string;
  mean_count?: Record<string, number>;
};
export type Lead = {
  id: string;
  claim: string;
  label: string;
  reason: string;
  rows: string[];
  shape: string;
  next_step: string;
  table_facts: Record<string, Fact>;
};
export type Product = {
  dataset: string;
  summary: string;
  rules: string;
  leads: Lead[];
  survivors: Lead[];
  killed: Lead[];
};
export type Replication = {
  id: string;
  verdict: string;
  numeric: {
    osd_id: string;
    material: string;
    verdict: string;
    facts: Record<string, Fact>;
  }[];
};
export type GraphNode = {
  id: string;
  type: string;
  label: string;
  claim?: string;
  text?: string;
  title?: string;
  dataset?: string;
  genes?: string[];
  status?: string;
  kind?: string;
  doi?: string;
  pmid?: string;
  url?: string;
  numbers?: Record<string, Fact>;
};
export type GraphEdge = {
  id: string;
  type: string;
  src: string;
  dst: string;
  relation: string;
};
export type Graph = { built: string; nodes: GraphNode[]; edges: GraphEdge[] };
export type ExpressionContrast = {
  key: string;
  label: string;
  positive: string;
  effectColumn: string;
  adjustedColumn: string;
};
export type ExpressionRow = {
  id: string;
  symbol: string;
  name: string;
  effect: number | null;
  adjustedP: number | null;
};
export type TablePage = {
  osd: string;
  sourceFile: string;
  contrast: ExpressionContrast;
  contrasts: ExpressionContrast[];
  total: number;
  withStatistics: number;
  significant: number;
  matched: number;
  page: number;
  pages: number;
  pageSize: number;
  rows: ExpressionRow[];
};
