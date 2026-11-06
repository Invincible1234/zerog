"use client";
import { useEffect, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import type { Lead, Replication } from "@/lib/types";
import { Badge } from "./ui";
import { Facts } from "./lead-explorer";
export function Playback({
  leads,
  replications,
  initialLeadId,
}: {
  leads: Lead[];
  replications: Replication[];
  initialLeadId?: string;
}) {
  const [index, setIndex] = useState(() =>
    Math.max(
      0,
      leads.findIndex((l) => l.id === initialLeadId),
    ),
  );
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [copyState, setCopyState] = useState("");
  const [shareUrl, setShareUrl] = useState("");
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
    }, 2200 / speed);
    return () => clearTimeout(timer);
  }, [playing, leads.length, index, phase, speed]);
  const lead = leads[index],
    rep = replications.find((r) => r.id === lead.id);
  function move(i: number) {
    setIndex(Math.max(0, Math.min(leads.length - 1, i)));
    setPhase(0);
    setPlaying(false);
    setCopyState("");
    setShareUrl("");
  }
  async function share() {
    const url = new URL("/run", window.location.origin);
    url.searchParams.set("lead", lead.id);
    setShareUrl(url.toString());
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopyState("Link copied");
    } catch {
      setCopyState("Copy the link below");
    }
  }
  return (
    <div className="playback">
      <div className="playback-banner">
        <span>
          <i className="status-dot" />{" "}
          {playing ? "PLAYING SAVED RECORDS" : "SAVED EVIDENCE PLAYER"}
        </span>
        <span>OSD-421 / NO LIVE INFERENCE</span>
      </div>
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
        <select
          aria-label="Playback speed"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        >
          <option value={0.5}>0.5× speed</option>
          <option value={1}>1× speed</option>
          <option value={2}>2× speed</option>
        </select>
        <button
          className="button"
          aria-label="Restart playback"
          onClick={() => move(0)}
        >
          <RotateCcw size={15} />
        </button>
      </div>
      <div className="lead-timeline" aria-label="Choose a saved lead">
        {leads.map((item, i) => (
          <button
            key={item.id}
            aria-label={`Jump to saved lead ${i + 1}`}
            aria-pressed={i === index}
            title={`${i + 1}. ${item.claim}`}
            className={i === index ? "selected" : i < index ? "visited" : ""}
            onClick={() => move(i)}
          />
        ))}
      </div>
      <div className="playback-body">
        <div className="phase-line">
          {["TABLE NUMBERS", "CRITIC LABEL", "REPLICATION CHECK"].map(
            (p, i) => (
              <button
                key={p}
                className={phase === i ? "current" : ""}
                aria-pressed={phase === i}
                onClick={() => {
                  setPhase(i);
                  setPlaying(false);
                }}
              >
                {i > 0 ? "→ " : ""}
                {p}
              </button>
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
        <div className="playback-links">
          <Link className="button" href={`/corpus/OSD-421#${lead.id}`}>
            Inspect full evidence →
          </Link>
          <button className="button" onClick={share}>
            {copyState === "Link copied" ? (
              <Check size={13} />
            ) : (
              <Copy size={13} />
            )}{" "}
            Share this lead
          </button>
          <span role="status">{copyState}</span>
        </div>
        {shareUrl && (
          <input
            className="share-url"
            aria-label="Saved lead link"
            readOnly
            value={shareUrl}
            onFocus={(e) => e.target.select()}
          />
        )}
      </div>
    </div>
  );
}
