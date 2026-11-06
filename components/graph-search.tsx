"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
// Interactive evidence neighborhood.
import type { GraphNode, GraphEdge } from "@/lib/types";
import { Badge, SourceLink } from "./ui";
import { Facts } from "./lead-explorer";
import { GraphNeighborhood } from "./graph-neighborhood";
export function GraphSearch({
  nodes,
  edges,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const findings = useMemo(
    () => nodes.filter((n) => n.type === "finding"),
    [nodes],
  );
  const shown = findings.filter((n) =>
    [n.id, n.claim, n.dataset, ...(n.genes ?? [])]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase().trim()),
  );
  const active = shown.find((n) => n.id === selected) ?? shown[0];
  const lookup = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const connections = active
    ? edges
        .filter((e) => e.src === active.id || e.dst === active.id)
        .filter((e) =>
          ["finding-passage", "finding-finding", "finding-dataset"].includes(
            e.type,
          ),
        )
    : [];
  return (
    <>
      <label className="search-box">
        <Search size={17} />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null);
          }}
          aria-label="Search graph"
          placeholder="Search genes, claims or accessions — try Drd4"
        />
      </label>
      <p className="table-meta" aria-live="polite">
        {shown.length} of {findings.length} saved findings / relations are
        model-assigned evidence links
      </p>
      <div className="graph-layout">
        <div className="finding-list">
          {shown.map((n) => (
            <button
              className="finding-button"
              key={n.id}
              aria-pressed={active?.id === n.id}
              onClick={() => setSelected(n.id)}
            >
              <span className="small-label">
                {n.dataset} / {n.kind ?? "saved claim"}
              </span>
              <Badge tone={n.status === "ok" ? "good" : "neutral"}>
                {n.status ?? "unlabelled"}
              </Badge>
              <p>{n.claim ?? n.label}</p>
            </button>
          ))}
          {!shown.length && (
            <p className="notice">
              No findings match. Try Drd4, thymus, or OSD-421.
            </p>
          )}
        </div>
        {active && (
          <article className="graph-detail">
            <GraphNeighborhood
              key={active.id}
              active={active}
              nodes={nodes}
              edges={edges}
              onFinding={(id) => {
                setQuery("");
                setSelected(id);
              }}
            />
            <p className="eyebrow">SELECTED FINDING / ORIGINAL CLAIM</p>
            <h2>{active.claim ?? active.label}</h2>
            <p className="mono">{active.id}</p>
            {active.kind?.toLowerCase().includes("paper") && (
              <div className="notice">
                Published-claim test fixture. Not training data.
              </div>
            )}
            <h3 className="small-label">Saved table numbers</h3>
            <Facts facts={active.numbers ?? {}} />
            <p>
              Source kinds and labels are preserved. A model relation is not
              experimental validation.
            </p>
            {active.dataset && (
              <Link href={`/corpus/${active.dataset}`} className="source-link">
                Study record →
              </Link>
            )}
            <h3 className="small-label" style={{ marginTop: 28 }}>
              Connected evidence / {connections.length} links
            </h3>
            {connections.map((e) => {
              const other = lookup.get(e.src === active.id ? e.dst : e.src);
              return (
                <section className="edge-card" key={e.id}>
                  <Badge
                    tone={
                      e.relation === "contradicts" ||
                      e.relation === "contradicted"
                        ? "bad"
                        : "neutral"
                    }
                  >
                    {e.relation}
                  </Badge>
                  <p>
                    {e.type} / {other?.id ?? e.dst}
                  </p>
                  <blockquote>
                    {other?.text ??
                      other?.claim ??
                      other?.title ??
                      other?.label ??
                      "Linked node not included in this snapshot."}
                  </blockquote>
                  {other?.type === "dataset" && (
                    <SourceLink
                      href={`https://osdr.nasa.gov/bio/repo/data/studies/${encodeURIComponent(other.id)}`}
                    >
                      OSDR record
                    </SourceLink>
                  )}
                  {other?.type === "passage" && (
                    <>
                      {other.pmid && /^\d+$/.test(other.pmid) && (
                        <SourceLink
                          href={`https://pubmed.ncbi.nlm.nih.gov/${other.pmid}/`}
                        >
                          Read source paper
                        </SourceLink>
                      )}
                      <p>
                        Original graph JSON retains relation probabilities and
                        retrieval provenance.
                      </p>
                    </>
                  )}
                </section>
              );
            })}
            {!connections.length && (
              <p>
                No passage, finding, or replication edges attached in this
                snapshot.
              </p>
            )}
          </article>
        )}
      </div>
    </>
  );
}
