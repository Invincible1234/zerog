"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Maximize2 } from "lucide-react";
import type { GraphEdge, GraphNode } from "@/lib/types";
import { Badge, SourceLink } from "./ui";
import styles from "./neighborhood.module.css";

const groups = ["all", "passage", "finding", "dataset"];
const colors: Record<string, string> = {
  passage: "var(--accent)",
  finding: "var(--amber)",
  dataset: "#94aef0",
};

export function GraphNeighborhood({
  active,
  nodes,
  edges,
  onFinding,
}: {
  active: GraphNode;
  nodes: GraphNode[];
  edges: GraphEdge[];
  onFinding: (id: string) => void;
}) {
  const [filter, setFilter] = useState("all");
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const lookup = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const links = edges
    .filter((e) => e.src === active.id || e.dst === active.id)
    .filter((e) =>
      ["finding-passage", "finding-finding", "finding-dataset"].includes(
        e.type,
      ),
    );
  const neighbors = [
    ...new Set(links.map((e) => (e.src === active.id ? e.dst : e.src))),
  ]
    .map((id) => lookup.get(id))
    .filter((n): n is GraphNode => !!n);
  const filtered = neighbors.filter(
    (n) => filter === "all" || n.type === filter,
  );
  const visible = filtered.slice(0, expanded ? 24 : 12);
  const focused = filtered.find((n) => n.id === focusedId);
  const focusLinks = focused
    ? links.filter((e) => e.src === focused.id || e.dst === focused.id)
    : [];
  return (
    <section
      className={styles.neighborhood}
      aria-label="Saved evidence neighborhood"
    >
      <header>
        <div>
          <span className="eyebrow">CONNECTED EVIDENCE</span>
          <h3>Explore this lead’s orbit.</h3>
        </div>
        <span className={styles.diagramIcon}>
          <Maximize2 size={17} />
        </span>
      </header>
      <p className={styles.note}>
        Every line is an actual saved relation. The layout illustrates
        connections, not scientific distance or confidence.
      </p>
      <div className={styles.tabs}>
        {groups.map((group) => (
          <button
            key={group}
            aria-pressed={filter === group}
            onClick={() => {
              setFilter(group);
              setFocusedId(null);
            }}
          >
            {group === "all"
              ? "All evidence"
              : group === "passage"
                ? "Passages"
                : group === "finding"
                  ? "Findings"
                  : "Studies"}
            <span>
              {group === "all"
                ? neighbors.length
                : neighbors.filter((n) => n.type === group).length}
            </span>
          </button>
        ))}
      </div>
      <select
        className={styles.picker}
        aria-label="Inspect connected evidence"
        value={focusedId || ""}
        onChange={(e) => setFocusedId(e.target.value || null)}
      >
        <option value="">Choose a connected record…</option>
        {filtered.map((n) => (
          <option key={n.id} value={n.id}>
            {n.type}: {(n.label || n.id).slice(0, 110)}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 680 410"
        role="group"
        aria-label={`Evidence map showing ${visible.length} of ${filtered.length} connected records`}
        className={styles.map}
      >
        <circle
          cx="340"
          cy="205"
          r="153"
          fill="none"
          stroke="var(--line)"
          strokeDasharray="2 8"
        />
        <circle
          cx="340"
          cy="205"
          r="90"
          fill="none"
          stroke="var(--line)"
          opacity=".4"
        />
        {visible.map((n, i) => {
          const angle = (i / visible.length) * Math.PI * 2 - Math.PI / 2;
          // Stable SVG attributes across Node and browser math implementations.
          const x = (340 + Math.cos(angle) * 245).toFixed(3),
            y = (205 + Math.sin(angle) * 148).toFixed(3);
          const selected = focused?.id === n.id;
          const relation =
            links.find((e) => e.src === n.id || e.dst === n.id)?.relation ?? "";
          return (
            <g key={n.id}>
              <line
                x1="340"
                y1="205"
                x2={x}
                y2={y}
                stroke={selected ? colors[n.type] : "var(--line)"}
                strokeWidth={selected ? 1.8 : 1}
                strokeDasharray={
                  relation.includes("contradict") ? "4 5" : undefined
                }
              />
              <g
                role="button"
                tabIndex={0}
                aria-label={`Inspect ${n.type}: ${n.label || n.id}`}
                aria-pressed={selected}
                onClick={() => setFocusedId(n.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setFocusedId(n.id);
                  }
                }}
                className={styles.node}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={selected ? 20 : 16}
                  fill="var(--surface)"
                  stroke={colors[n.type]}
                  strokeWidth={selected ? 2 : 1}
                />
                <circle cx={x} cy={y} r="4" fill={colors[n.type]} />
                <text
                  x={x}
                  y={(Number(y) + 31).toFixed(3)}
                  textAnchor="middle"
                  fill="var(--muted)"
                  fontSize="9"
                  fontFamily="var(--font-mono,monospace)"
                >
                  {n.type === "dataset"
                    ? n.id
                    : `${n.type.toUpperCase()} ${i + 1}`}
                </text>
              </g>
            </g>
          );
        })}
        <circle
          cx="340"
          cy="205"
          r="46"
          fill="var(--surface)"
          stroke="var(--accent)"
          strokeWidth="1.5"
        />
        <circle
          cx="340"
          cy="205"
          r="53"
          fill="none"
          stroke="var(--accent)"
          opacity=".15"
        />
        <text
          x="340"
          y="202"
          textAnchor="middle"
          fill="var(--accent)"
          fontSize="10"
          fontFamily="var(--font-mono,monospace)"
        >
          SELECTED
        </text>
        <text
          x="340"
          y="220"
          textAnchor="middle"
          fill="var(--ink)"
          fontSize="10"
          fontFamily="var(--font-mono,monospace)"
        >
          {active.dataset || "FINDING"}
        </text>
      </svg>
      <div className={styles.mapFooter}>
        <span>
          {visible.length} shown / {filtered.length} connected records
        </span>
        {filtered.length > 12 && (
          <button onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Compact view" : "Expand map"}
          </button>
        )}
      </div>
      {!filtered.length && (
        <p className={styles.note}>
          No connected records of this type exist in this snapshot.
        </p>
      )}
      {focused ? (
        <article className={styles.inspector}>
          <div className={styles.inspectorHeading}>
            <span>
              {focused.type} / {focused.id}
            </span>
            <button
              aria-label="Close connected record"
              onClick={() => setFocusedId(null)}
            >
              ×
            </button>
          </div>
          <p>
            {focused.text || focused.claim || focused.title || focused.label}
          </p>
          <div className={styles.relations}>
            {focusLinks.map((e) => (
              <Badge
                key={e.id}
                tone={e.relation.includes("contradict") ? "bad" : "neutral"}
              >
                {e.relation} · {e.src === active.id ? "outgoing" : "incoming"}
              </Badge>
            ))}
          </div>
          {focused.type === "finding" && (
            <button
              className="button"
              onClick={() => {
                onFinding(focused.id);
                setFocusedId(null);
              }}
            >
              Explore this finding <ArrowUpRight size={13} />
            </button>
          )}
          {focused.type === "dataset" && (
            <SourceLink
              href={`https://osdr.nasa.gov/bio/repo/data/studies/${encodeURIComponent(focused.id)}`}
            >
              NASA OSDR record
            </SourceLink>
          )}
          {focused.pmid && /^\d+$/.test(focused.pmid) && (
            <SourceLink
              href={`https://pubmed.ncbi.nlm.nih.gov/${focused.pmid}/`}
            >
              Read source paper
            </SourceLink>
          )}
        </article>
      ) : (
        <p className={styles.hint}>
          Select a connected node to inspect its source and relation.
        </p>
      )}
    </section>
  );
}
