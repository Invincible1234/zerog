import Link from "next/link";
import { catalog, inspiration, manifest, osdr } from "@/lib/data";
import { PageHeading, Badge, SourceLink } from "@/components/ui";
import { CorpusSearch } from "@/components/corpus-search";
export const metadata = { title: "Corpus" };
export default function Corpus() {
  const i4 = inspiration();
  const local = manifest()
    .files.filter((f) => f.path.startsWith("raw/"))
    .map((f) => f.path.match(/OSD-\d+/)![0]);
  return (
    <>
      <PageHeading
        eyebrow="01 / PUBLIC DATA DIRECTORY"
        title="Choose your starting point."
      >
        <p>
          A frozen catalog from Helix. Only bundled tables are on disk; only
          OSD-421 has the saved product run shown here.
        </p>
      </PageHeading>
      <CorpusSearch studies={catalog()} local={local} />
      <section className="directory" id="inspiration4">
        <p className="eyebrow">HUMAN SPACEFLIGHT / LISTED ONLY</p>
        <h2>Inspiration4 study directory</h2>
        <p>{i4.note}</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ACCESSION</th>
                <th>SAMPLE / ASSAY</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {i4.studies.map((s) => (
                <tr key={s.osd_id}>
                  <td className="mono">
                    <Link href={`/corpus/${s.osd_id}`}>{s.osd_id} ↗</Link>
                  </td>
                  <td>
                    {s.title}
                    <small>{s.assay}</small>
                  </td>
                  <td>
                    <Badge tone="warn">Listed only</Badge>
                    <br />
                    <SourceLink href={osdr(s.osd_id)}>OSDR record</SourceLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <SourceLink href={i4.source}>
            Published mission data directory
          </SourceLink>
        </p>
      </section>
    </>
  );
}
