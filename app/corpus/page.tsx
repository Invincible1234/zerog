import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Database,
  FlaskConical,
  Orbit,
  ShieldCheck,
} from "lucide-react";
import { catalog, inspiration, manifest, osdr, product } from "@/lib/data";
import { Badge, SourceLink } from "@/components/ui";
import { CorpusSearch } from "@/components/corpus-search";
import styles from "@/components/corpus.module.css";

export const metadata = { title: "Corpus" };
export default function Corpus() {
  const studies = catalog();
  const run = product();
  const i4 = inspiration();
  const local = manifest()
    .files.filter((f) => f.path.startsWith("raw/"))
    .map((f) => f.path.match(/OSD-\d+/)![0]);
  const featured = studies.find((s) => s.osd_id === run.dataset);
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <p className={styles.microLabel}>
          <span className={styles.signalDot} /> THE OPEN SCIENCE ARCHIVE
        </p>
        <div className={styles.headerLine}>
          <h1>
            A universe of data.
            <br />
            <span>A place to begin.</span>
          </h1>
          <p>
            Follow a question into the archive. Explore public spaceflight
            studies, inspect the saved evidence, and keep every source within
            reach.
          </p>
        </div>
        <div className={styles.headerTags}>
          <span>
            <Database size={12} />
            {studies.length} catalog studies
          </span>
          <span>
            <ShieldCheck size={13} />
            {local.length} local tables
          </span>
          <span>
            <Orbit size={13} />
            Public NASA OSDR data
          </span>
        </div>
      </header>
      {featured && (
        <section className={styles.featured} aria-label="Featured saved study">
          <div className={styles.featureContent}>
            <p className={styles.microLabel}>
              <FlaskConical size={12} /> FEATURED / SAVED CRITIC RUN
            </p>
            <div className={styles.featureTitle}>
              <span>{featured.osd_id}</span>
              <Badge tone="good">Saved critic run</Badge>
            </div>
            <h2>{featured.title}</h2>
            <p>
              {featured.organism} · {featured.material} · {featured.assay}
            </p>
            <div className={styles.featureActions}>
              <Link href={`/corpus/${featured.osd_id}`}>
                Inspect the evidence <ArrowRight size={16} />
              </Link>
              <Link href="/run">
                Play saved run <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
          <div className={styles.featureEvidence}>
            <div className={styles.evidencePath} aria-hidden="true">
              <span>TABLE</span>
              <i />
              <span>CRITIC</span>
              <i />
              <span>FIELD</span>
            </div>
            <div className={styles.featureStats}>
              <div>
                <strong>{run.leads.length}</strong>
                <span>proposed leads</span>
              </div>
              <div>
                <strong>{run.survivors.length}</strong>
                <span>passed the critic</span>
              </div>
            </div>
            <p>
              Saved screening results.
              <br />
              Leads are not experimental validation.
            </p>
          </div>
        </section>
      )}
      <CorpusSearch studies={studies} local={local} savedId={run.dataset} />
      <section className={styles.mission} id="inspiration4">
        <details>
          <summary className={styles.missionSummary}>
            <span className={styles.missionIcon}>
              <Orbit size={28} />
            </span>
            <span className={styles.missionTitle}>
              <span className={styles.microLabel}>
                HUMAN SPACEFLIGHT / NEXT ADAPTER
              </span>
              <strong>Inspiration4 study directory</strong>
              <span className={styles.missionSubtitle}>
                Explore {i4.studies.length} source-linked records. Directory
                only; no critic runs.
              </span>
            </span>
            <Badge tone="warn">Listed only</Badge>
            <ChevronDown className={styles.missionChevron} size={19} />
          </summary>
          <div className={styles.missionBody}>
            <p>{i4.note}</p>
            <div className={styles.missionGrid}>
              {i4.studies.map((s) => (
                <article key={s.osd_id}>
                  <Link
                    href={`/corpus/${s.osd_id}`}
                    className={styles.missionCardLink}
                  >
                    <span className={styles.accession}>
                      {s.osd_id}
                      <ArrowUpRight size={13} />
                    </span>
                    <h3>{s.title}</h3>
                    <p>{s.assay}</p>
                  </Link>
                  <SourceLink href={osdr(s.osd_id)}>OSDR record</SourceLink>
                </article>
              ))}
            </div>
            <SourceLink href={i4.source}>
              Published mission data directory
            </SourceLink>
          </div>
        </details>
      </section>
    </div>
  );
}
