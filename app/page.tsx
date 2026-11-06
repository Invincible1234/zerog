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
import { product, replication, totals } from "@/lib/data";
import { EvidenceConsole } from "@/components/evidence-console";
export default function Home() {
  const run = product();
  const preview = [...run.survivors.slice(0, 2), ...run.killed.slice(0, 1)];
  return (
    <>
      <section className="hero">
        <div className="hero-horizon" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="hero-pill">
              <Sparkles size={12} /> THE OPEN SCIENCE OBSERVATORY
            </span>
          </p>
          <h1>
            <span className="hero-first-line">A new orbit</span>
            <br />
            <em>
              for <span className="luminous-word">discovery.</span>
            </em>
          </h1>
          <p className="hero-description">
            The next question is out there. Follow the evidence in public NASA
            OSDR data, from the first signal to the scrutiny it deserves.
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
          <a className="hero-text-link" href="#evidence-console">
            Inspect a saved lead <ArrowRight size={13} />
          </a>
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
      <div className="observatory-strip">
        <span>
          <i /> PUBLIC ARCHIVES. OPEN QUESTIONS.
        </span>
        <span>
          NASA OSDR <span aria-hidden="true">/</span> HELIX{" "}
          <span aria-hidden="true">/</span> SAVED EVIDENCE
        </span>
        <Link href="/method">
          Inside the method <ArrowUpRight size={12} />
        </Link>
      </div>
      <Counters />
      <section className="home-section reveal-section" id="evidence-console">
        <div className="section-label">
          <div>
            <p className="eyebrow">THE DISCOVERY DESK / OSD-421</p>
            <h2 className="section-title">A signal is just the beginning.</h2>
          </div>
          <span>Select a lead. Pull its evidence apart.</span>
        </div>
        <EvidenceConsole
          leads={preview}
          replications={replication().leads.filter((r) =>
            preview.some((lead) => lead.id === r.id),
          )}
        />
      </section>
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
