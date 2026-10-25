"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const links = [
  ["/corpus", "Corpus"],
  ["/run", "Saved run"],
  ["/loop", "Loop"],
  ["/graph", "Graph"],
];
export function Navigation() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main navigation">
      {links.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          className={pathname.startsWith(href) ? "active" : ""}
          aria-current={pathname.startsWith(href) ? "page" : undefined}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
