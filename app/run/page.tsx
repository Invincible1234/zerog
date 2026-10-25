import Link from "next/link";
import { product, replication } from "@/lib/data";
import { PageHeading, SourceLink } from "@/components/ui";
import { Playback } from "@/components/playback";
export const metadata = { title: "Saved run" };
export default function Run() {
  return (
    <>
      <PageHeading
        eyebrow="02 / SAVED RUN PLAYBACK"
        title="Watch the evidence unfold."
      >
        <p>
          Replay the saved OSD-421 mouse-thymus run. The controls reveal
          existing records; they do not launch an analysis, call a model, or
          rerun the critic.
        </p>
      </PageHeading>
      <Playback leads={product().leads} replications={replication().leads} />
      <div className="section-label">
        <Link href="/corpus/OSD-421">
          Inspect all leads and their evidence →
        </Link>
        <SourceLink href="/evidence/product">Download saved run</SourceLink>
      </div>
    </>
  );
}
