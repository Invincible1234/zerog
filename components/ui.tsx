import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export function PageHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children && <div className="intro">{children}</div>}
    </header>
  );
}
export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: string;
}) {
  return <span className={`badge ${tone}`}>{children}</span>;
}
export function SourceLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="source-link">
      {children}
      <ArrowUpRight size={13} />
    </a>
  );
}
export function UnknownStudy() {
  return (
    <div className="empty-state">
      <p className="eyebrow">Outside the saved catalog</p>
      <h1>That study is not in this demo</h1>
      <p>
        Use a listed accession to inspect its metadata. Only OSD-421 has a saved
        critic run.
      </p>
      <Link className="button primary" href="/corpus">
        Back to Corpus →
      </Link>
    </div>
  );
}
