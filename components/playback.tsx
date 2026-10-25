"use client";
import { useEffect, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Lead, Replication } from "@/lib/types";
import { Badge } from "./ui";
import { Facts } from "./lead-explorer";
export function Playback({
  leads,
  replications,
}: {
  leads: Lead[];
  replications: Replication[];
}) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      if (phase < 2) {
        setPhase(phase + 1);
      } else if (index < leads.length - 1) {
        setIndex(index + 1);
        setPhase(0);
      } else {
        setPlaying(false);
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [playing, leads.length, index, phase]);
  const lead = leads[index],
    rep = replications.find((r) => r.id === lead.id);
  function move(i: number) {
    setIndex(Math.max(0, Math.min(leads.length - 1, i)));
    setPhase(0);
    setPlaying(false);
  }
  return (
    <div className="playback">
      <div className="playback-controls">
        <button
          className="button primary"
          onClick={() => {
            if (index === leads.length - 1 && phase === 2) {
              setIndex(0);
              setPhase(0);
            }
            setPlaying(!playing);
          }}
        >
          {playing ? <Pause size={15} /> : <Play size={15} />}{" "}
          {playing ? "Pause" : "Play"}
        </button>
        <button
          className="button"
          aria-label="Previous lead"
          disabled={index === 0}
          onClick={() => move(index - 1)}
        >
          <ChevronLeft size={15} />
        </button>
        <button
          className="button"
          aria-label="Next lead"
          disabled={index === leads.length - 1}
          onClick={() => move(index + 1)}
        >
          <ChevronRight size={15} />
        </button>
        <input
          type="range"
          min="0"
          max={leads.length - 1}
          value={index}
          aria-label="Saved lead position"
          onChange={(e) => move(Number(e.target.value))}
        />
        <output>
          {index + 1} / {leads.length}
        </output>
        <button
          className="button"
          aria-label="Restart playback"
          onClick={() => move(0)}
        >
          <RotateCcw size={15} />
        </button>
      </div>
      <div className="playback-body">
        <div className="phase-line">
          {["TABLE NUMBERS", "CRITIC LABEL", "REPLICATION CHECK"].map(
            (p, i) => (
              <span key={p} className={phase === i ? "current" : ""}>
                {i > 0 ? "→ " : ""}
                {p}
              </span>
            ),
          )}
        </div>
        <h2>{lead.claim}</h2>
        <p className="table-meta">{lead.id} / Original saved model proposal</p>
        <section className="evidence-block">
          <span className="small-label">Table numbers / always visible</span>
          <Facts facts={lead.table_facts} />
        </section>
        {phase >= 1 && (
          <section className="evidence-block">
            <span className="small-label">
              Critic label / separate interpretation
            </span>
            <Badge tone={lead.label === "ok" ? "good" : "warn"}>
              {lead.label}
            </Badge>
            <p>{lead.reason}</p>
          </section>
        )}
        {phase >= 2 && (
          <section className="evidence-block">
            <span className="small-label">
              Replication / separate saved check
            </span>
            <p>
              {rep
                ? rep.verdict
                : "No replication record attached to this lead."}
            </p>
            <p>Cross-study concordance is not experimental validation.</p>
          </section>
        )}
      </div>
    </div>
  );
}
