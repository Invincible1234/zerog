import Link from "next/link";
import {
  catalog,
  inspiration,
  manifest,
  product,
  replication,
  osdr,
} from "@/lib/data";
import { PageHeading, Badge, SourceLink, UnknownStudy } from "@/components/ui";
import { LeadExplorer } from "@/components/lead-explorer";
export default async function StudyPage({
  params,
}: {
  params: Promise<{ osd: string }>;
}) {
  const { osd } = await params;
  const study = catalog().find((s) => s.osd_id === osd);
  const i4 = inspiration().studies.find((s) => s.osd_id === osd);
  if (!study && !i4) return <UnknownStudy />;
  if (i4)
    return (
      <>
        <PageHeading eyebrow={`${osd} / INSPIRATION4`} title={i4.title}>
          <Badge tone="warn">Listed only · no critic run</Badge>
          <p>{i4.assay}</p>
        </PageHeading>
        <div className="notice">
          This is a human-mission directory entry, not a differential-expression
          table. It cannot be played or passed to the critic in this demo.
          Verify public file access and participant / timepoint mapping before
          analysis.
        </div>
        <SourceLink href={osdr(osd)}>Open the NASA OSDR record</SourceLink>
        <div className="actions">
          <Link className="button" href="/corpus#inspiration4">
            Back to mission directory
          </Link>
        </div>
      </>
    );
  const local = manifest().files.find(
    (f) => f.path.startsWith("raw/") && f.path.includes(`${osd}_`),
  );
  return (
    <>
      <PageHeading
        eyebrow={`${osd} / ${osd === "OSD-421" ? "SAVED CRITIC RUN" : "CATALOG RECORD"}`}
        title={study!.title}
      >
        <p>
          {study!.organism} / {study!.material}
        </p>
      </PageHeading>
      <div className="study-summary">
        <div>
          <span className="small-label">Assay</span>
          <strong>{study!.assay}</strong>
        </div>
        <div>
          <span className="small-label">Catalog samples</span>
          <strong>{study!.n_samples}</strong>
        </div>
        <div>
          <span className="small-label">Availability</span>
          <strong>
            {local
              ? `${local.rows?.toLocaleString("en-US")} local gene rows`
              : "Metadata only"}
          </strong>
        </div>
      </div>
      <SourceLink href={osdr(osd)}>NASA OSDR record</SourceLink>
      {osd === "OSD-421" ? (
        <>
          <div className="notice">
            Mouse thymus, not Inspiration4. Positive saved log₂ fold change
            means higher in Space Flight. The upstream summary reports different
            group sizes from the CSV sample columns; that discrepancy is
            preserved and disclosed in Methods.
          </div>
          <div className="actions">
            <Link href="/run" className="button primary">
              Play saved run →
            </Link>
            <SourceLink href="/evidence/table-421">
              Download original table
            </SourceLink>
          </div>
          <div className="stat-grid">
            <div>
              <span className="small-label">Proposed leads</span>
              <strong>{product().leads.length}</strong>
            </div>
            <div>
              <span className="small-label">Passed saved critic</span>
              <strong>{product().survivors.length}</strong>
            </div>
            <div>
              <span className="small-label">Rejected by saved critic</span>
              <strong>{product().killed.length}</strong>
            </div>
          </div>
          <LeadExplorer
            leads={product().leads}
            replications={replication().leads}
          />
          <details className="rules">
            <summary>Original saved summary (upstream claims)</summary>
            <pre className="raw-summary">{product().summary}</pre>
          </details>
        </>
      ) : (
        <div className="notice">
          {local
            ? "This table is bundled, but there is no saved product critic run for it in this demo."
            : "This record is in the saved catalog. Its table has not been bundled or analysed here."}{" "}
          <Link href="/corpus/OSD-421" className="accent">
            Inspect the OSD-421 saved run →
          </Link>
        </div>
      )}
    </>
  );
}
