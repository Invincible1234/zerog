"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronRight,
  Database,
  FileCheck2,
  GitBranch,
  ScanLine,
} from "lucide-react";
import type { Lead, Replication } from "@/lib/types";
import { Facts } from "./lead-explorer";
import { Badge } from "./ui";

const layers = [
  { id: "table", label: "Table numbers", icon: Database },
  { id: "critic", label: "Critic label", icon: FileCheck2 },
  { id: "replication", label: "Replication check", icon: GitBranch },
] as const;

export function EvidenceConsole({
  leads,
  replications,
}: {
  leads: Lead[];
  replications: Replication[];
}) {
  const [selected, setSelected] = useState(leads[0]?.id);
  const [layer, setLayer] = useState<(typeof layers)[number]["id"]>("table");
  const lead = leads.find((item) => item.id === selected) ?? leads[0];
  if (!lead) return null;
  const rep = replications.find((item) => item.id === lead.id);
  return (
    <div className="evidence-console">
      <aside className="desk-leads" aria-label="Featured saved leads">
        <div className="desk-heading">
          <ScanLine size={14} />
          <span>SAVED SIGNALS</span>
          <span>OSD-421</span>
        </div>
        {leads.map((item) => (
          <button
            type="button"
            className="desk-lead"
            key={item.id}
            aria-pressed={lead.id === item.id}
            aria-controls="desk-evidence"
            onClick={() => setSelected(item.id)}
          >
            <span className="desk-lead-meta">
              <span>{item.rows.join(" · ") || item.shape}</span>
              <Badge tone={item.label === "ok" ? "good" : "warn"}>
                {item.label}
              </Badge>
            </span>
            <strong>{item.claim}</strong>
            <span className="desk-lead-open">
              Examine this lead <ChevronRight size={13} />
            </span>
          </button>
        ))}
        <Link className="desk-all" href="/corpus/OSD-421">
          Open the complete saved run <ArrowUpRight size={14} />
        </Link>
      </aside>
      <section
        className="desk-evidence"
        id="desk-evidence"
        aria-label="Selected lead evidence"
      >
        <div className="desk-inspector-top">
          <span>
            <i /> EVIDENCE INSPECTOR
          </span>
          <span>MOUSE / THYMUS</span>
        </div>
        <div className="desk-current" aria-live="polite">
          <p>{lead.id}</p>
          <h3>{lead.claim}</h3>
        </div>
        <div className="desk-layers" aria-label="Evidence layers">
          {layers.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              aria-pressed={layer === id}
              aria-controls="desk-layer-content"
              onClick={() => setLayer(id)}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
        <div
          className="desk-layer-content"
          id="desk-layer-content"
          aria-live="polite"
        >
          {layer === "table" && (
            <>
              <p className="desk-layer-label">CODE-ATTACHED STATISTICS</p>
              <Facts facts={lead.table_facts} />
              <p className="desk-fineprint">
                Saved values, displayed with rounding. Inspect the original CSV
                for full precision. Carriers are the source payload’s count
                definition.
              </p>
            </>
          )}
          {layer === "critic" && (
            <>
              <p className="desk-layer-label">SAVED CRITIC JUDGMENT</p>
              <Badge tone={lead.label === "ok" ? "good" : "warn"}>
                {lead.label}
              </Badge>
              <p>{lead.reason}</p>
              <div className="desk-next">
                <span>PROPOSED NEXT STEP</span>
                <p>{lead.next_step}</p>
              </div>
            </>
          )}
          {layer === "replication" && (
            <>
              <p className="desk-layer-label">SEPARATE CROSS-STUDY CHECK</p>
              {rep ? (
                <>
                  <p>
                    Upstream saved verdict: <strong>{rep.verdict}</strong>
                  </p>
                  <div className="desk-replications">
                    {rep.numeric.map((entry) => (
                      <details key={entry.osd_id}>
                        <summary>
                          <span>
                            {entry.osd_id} / {entry.material}
                          </span>
                          <Badge>{entry.verdict}</Badge>
                        </summary>
                        <Facts facts={entry.facts} />
                      </details>
                    ))}
                  </div>
                </>
              ) : (
                <p>
                  No replication record is attached. An absent check is not a
                  failed replication.
                </p>
              )}
              <p className="desk-fineprint">
                Saved cross-study concordance is not experimental validation and
                does not change the critic label.
              </p>
            </>
          )}
        </div>
        <div className="desk-bottom">
          <span>A lead stays a lead.</span>
          <Link href={`/corpus/OSD-421#${lead.id}`}>
            Inspect full evidence <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>
    </div>
  );
}
