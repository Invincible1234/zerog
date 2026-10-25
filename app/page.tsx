import Link from "next/link";
import { ArrowRight, Database, FileCheck2, GitBranch } from "lucide-react";
import { Counters } from "@/components/counters";
import { Orbit } from "@/components/orbit";
import { product, totals } from "@/lib/data";
import { Badge } from "@/components/ui";
export default function Home() {
  const run = product();
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">
            <span className="status-dot" /> OPEN SCIENCE / TRACEABLE EVIDENCE
          </p>
          <h1>
            Research leads.
            <br />
            With the evidence
            <br />
            <em>still attached.</em>
          </h1>
          <p className="hero-description">
            Explore spaceflight biology through a saved Helix critic run. Follow
            the table, inspect the verdict, and see what holds up elsewhere.
          </p>
          <div className="actions">
            <Link className="button primary" href="/corpus">
              Explore the corpus <ArrowRight size={16} />
            </Link>
            <Link className="button" href="/run">
              Play saved run <span>↗</span>
            </Link>
          </div>
          <p className="fineprint">
            Public NASA OSDR data. Saved results. No model calls.
          </p>
        </div>
        <Orbit />
      </section>
      <Counters />
      <section className="home-section">
        <div className="section-label">
          <p className="eyebrow">THE EVIDENCE CHAIN</p>
          <span>Inspect the seams, not just the conclusion.</span>
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
          ].map((f) => (
            <Link className="feature-card" key={f.title} href={f.href}>
              <f.icon size={22} />
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
      <section className="home-section">
        <div className="section-label">
          <p className="eyebrow">FROM THE SAVED RUN / OSD-421</p>
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
      <section className="mission-banner">
        <div>
          <p className="eyebrow">HUMAN SPACEFLIGHT / THE NEXT ADAPTER</p>
          <h2>Inspiration4 is listed. Not analysed here.</h2>
          <p>
            Discover the public study directory. Human-data access and assay
            mapping need review before any critic run.
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
