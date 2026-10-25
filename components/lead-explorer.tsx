"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import type { Lead, Fact, Replication } from "@/lib/types";
import { Badge, SourceLink } from "./ui";
const tone = (label: string) =>
  label === "ok" ? "good" : label === "contradicted" ? "bad" : "warn";
export function Facts({ facts }: { facts: Record<string, Fact> }) {
  return Object.keys(facts).length ? (
    <div className="table-wrap">
      <table className="fact-table">
        <thead>
          <tr>
            <th>FEATURE</th>
            <th>LOG₂ FC</th>
            <th>ADJ. P</th>
            <th>CARRIERS</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(facts).map(([gene, f]) => (
            <tr key={gene}>
              <td>
                {gene}
                <small>Higher: {f.higher_group ?? "Not supplied"}</small>
              </td>
              <td className="mono">
                {typeof f.log2fc === "number" ? f.log2fc.toFixed(2) : "—"}
              </td>
              <td className="mono">
                {typeof f.padj === "number" ? f.padj.toExponential(3) : "—"}
              </td>
              <td className="mono">{f.carriers ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p>No feature-level statistics are attached to this lead.</p>
  );
}
export function LeadExplorer({
  leads,
  replications,
}: {
  leads: Lead[];
  replications: Replication[];
}) {
  const [query, setQuery] = useState("");
  const [label, setLabel] = useState("all");
  const labels = ["all", ...new Set(leads.map((l) => l.label))];
  const shown = leads.filter(
    (l) =>
      (label === "all" || l.label === label) &&
      [l.id, l.claim, ...l.rows]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <section>
      <label className="search-box">
        <Search size={17} />
        <input
          aria-label="Search saved leads"
          placeholder="Search genes or claims…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div className="filter-tabs">
        {labels.map((x) => (
          <button
            key={x}
            aria-pressed={label === x}
            onClick={() => setLabel(x)}
          >
            {x} ·{" "}
            {x === "all"
              ? leads.length
              : leads.filter((l) => l.label === x).length}
          </button>
        ))}
      </div>
      <p className="table-meta" aria-live="polite">
        {shown.length} saved leads. Expand to keep the evidence layers separate.
      </p>
      {shown.map((l) => {
        const rep = replications.find((r) => r.id === l.id);
        return (
          <details className="lead-card" id={l.id} key={l.id}>
            <summary>
              <Badge tone={tone(l.label)}>{l.label}</Badge>
              <h2>{l.claim}</h2>
            </summary>
            <div className="detail-content">
              <section className="evidence-block">
                <h3>01 / Table numbers</h3>
                <Facts facts={l.table_facts} />
                <p>
                  Saved code-attached values; see the source CSV for full
                  precision. Carriers are the saved payload’s count definition,
                  not a measure of biological replication.
                </p>
              </section>
              <section className="evidence-block">
                <h3>02 / Critic label</h3>
                <Badge tone={tone(l.label)}>{l.label}</Badge>
                <p>{l.reason}</p>
                <p>Proposed next step: {l.next_step}</p>
              </section>
              <section className="evidence-block">
                <h3>03 / Separate replication check</h3>
                {rep ? (
                  <>
                    <p>Upstream saved verdict: {rep.verdict}</p>
                    {rep.numeric.map((r) => (
                      <details key={r.osd_id}>
                        <summary className="rep-row">
                          <span>
                            {r.osd_id} / {r.material}
                          </span>
                          <Badge
                            tone={
                              r.verdict === "replicated" ? "good" : "neutral"
                            }
                          >
                            {r.verdict}
                          </Badge>
                        </summary>
                        <Facts facts={r.facts} />
                      </details>
                    ))}
                    <p>
                      Saved cross-study concordance is not experimental
                      validation and does not change the original critic label.
                    </p>
                  </>
                ) : (
                  <p>
                    No replication record is attached. An absent check is not a
                    failed replication.
                  </p>
                )}
              </section>
              <SourceLink href="/evidence/product">
                Original saved product JSON
              </SourceLink>
            </div>
          </details>
        );
      })}
      {!shown.length && (
        <div className="notice">No saved leads match this filter.</div>
      )}
    </section>
  );
}
