import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Database,
  FileCheck2,
  GitBranch,
  Play,
  Fingerprint,
  Orbit as OrbitIcon,
  Sparkles,
} from "lucide-react";
import { Counters } from "@/components/counters";
import { Orbit } from "@/components/orbit";
import { product, totals } from "@/lib/data";
import { Badge } from "@/components/ui";
export default function Home() {
  const run = product();
  return (
    <>
      <section className="hero">
        <div className="hero-horizon" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="hero-pill">
              <Sparkles size={12} /> PUBLIC SCIENCE, NEW PERSPECTIVES
            </span>
          </p>
          <h1>
            <span className="hero-first-line">Space biology.</span>
            <br />
            <em>
              In a <span className="luminous-word">new light.</span>
            </em>
          </h1>
          <p className="hero-description">
            Follow a research lead all the way back to the evidence. Explore
            public NASA OSDR data through a saved Helix critic run.
          </p>
          <div className="actions">
            <Link className="button primary" href="/corpus">
              Explore the corpus <ArrowUpRight size={17} />
            </Link>
            <Link className="button" href="/run">
              <Play size={14} fill="currentColor" /> Play saved run
            </Link>
          </div>
          <div className="hero-proof">
            <Fingerprint size={16} />
            <span>Real tables. Saved judgments. Every source attached.</span>
          </div>
        </div>
        <div className="hero-observatory">
          <span className="observatory-label" aria-hidden="true">
            EXPLORE / QUESTION / DISCOVER
          </span>
          <Orbit />
        </div>
        <div className="hero-coordinate" aria-hidden="true">
          <span>EXPLORATION BEGINS WITH A QUESTION</span>
          <span>SCROLL TO DISCOVER ↓</span>
        </div>
      </section>
      <Counters />
      <section className="home-section reveal-section">
        <div className="section-label">
          <div>
            <p className="eyebrow">THE EVIDENCE CHAIN</p>
            <h2 className="section-title">From signal to scrutiny.</h2>
          </div>
          <span>Three perspectives. One traceable lead.</span>
        </div>
        <div className="feature-grid">
          {[
            {
              icon: Database,
              title: "Start with the table",
              text: "Browse the saved catalog. Local tables and metadata-only records are clearly distinguished.",
              href: "/corpus",
              label: "Browse data",
            },
            {
              icon: FileCheck2,
              title: "Read the critic",
              text: "See the original lead, code-attached statistics, and the separate reason it passed or failed.",
              href: "/corpus/OSD-421",
              label: "Inspect OSD-421",
            },
            {
              icon: GitBranch,
              title: "Challenge the result",
              text: "Compare rule versions on held-out leads. Explore literature and cross-study links without calling them validation.",
              href: "/loop",
              label: "Open the loop",
            },
          ].map((f, i) => (
            <Link
              className="feature-card"
              key={f.title}
              href={f.href}
              data-spotlight
            >
              <div className="feature-symbol">
                <f.icon size={23} />
                <span className="feature-index">0{i + 1}</span>
              </div>
              <h2>{f.title}</h2>
              <p>{f.text}</p>
              <span>
                {f.label}
                <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="home-section reveal-section">
        <div className="section-label">
          <div>
            <p className="eyebrow">INSIDE THE SAVED RUN / OSD-421</p>
            <h2 className="section-title">
              The interesting part is the evidence.
            </h2>
          </div>
          <Link href="/corpus/OSD-421">
            Inspect all {run.leads.length} leads →
          </Link>
        </div>
        {run.survivors.slice(0, 3).map((l) => (
          <Link
            href={`/corpus/OSD-421#${l.id}`}
            className="lead-preview"
            key={l.id}
          >
            <Badge tone="good">{l.label}</Badge>
            <div>
              <h3>{l.claim}</h3>
              <p>
                {l.rows.join(" · ")} / Mouse thymus / Saved model interpretation
              </p>
            </div>
            <ArrowRight size={18} />
          </Link>
        ))}
      </section>
      <section className="mission-banner reveal-section" data-spotlight>
        <div className="mission-orbit" aria-hidden="true">
          <OrbitIcon size={96} strokeWidth={0.7} />
        </div>
        <div>
          <p className="eyebrow">HUMAN SPACEFLIGHT / THE NEXT ADAPTER</p>
          <h2>
            A human chapter.
            <br />
            <span className="accent">Inspiration4.</span>
          </h2>
          <p>
            Explore the mission’s public study directory. Listed only in this
            demo; human-data access and assay mapping need review before
            analysis.
          </p>
        </div>
        <Link className="button" href="/corpus#inspiration4">
          View mission directory ↗
        </Link>
      </section>
      <div className="bottom-note">
        <span>ZEX / ZEROg</span>
        <span>
          {totals().findings} saved findings. Every lead stays a lead.
        </span>
      </div>
    </>
  );
}
