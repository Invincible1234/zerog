import { totals, number } from "@/lib/data";
export function Counters() {
  const t = totals();
  return (
    <dl className="counters">
      {[
        [
          t.studies,
          "Studies in saved catalog",
          "Metadata, not downloaded tables",
        ],
        [t.rows, "Gene rows on disk", "Across the bundled expression tables"],
        [
          t.survivors,
          "OSD-421 survivors",
          "Passed the saved critic · not validation",
        ],
      ].map(([value, label, note]) => (
        <div key={String(label)}>
          <dt>{label}</dt>
          <dd>{number(Number(value))}</dd>
          <p>{note}</p>
        </div>
      ))}
    </dl>
  );
}
