import Link from "next/link";
export default function NotFound() {
  return (
    <div className="empty-state">
      <p className="eyebrow">404 / OUTSIDE THE ORBIT</p>
      <h1>This page is not in the demo.</h1>
      <p>The saved evidence is still here.</p>
      <Link className="button primary" href="/corpus">
        Explore the corpus →
      </Link>
    </div>
  );
}
