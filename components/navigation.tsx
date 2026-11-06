"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const links = [
  ["/", "Overview"],
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
          className={
            (href === "/" ? pathname === "/" : pathname.startsWith(href))
              ? "active"
              : ""
          }
          aria-current={
            (href === "/" ? pathname === "/" : pathname.startsWith(href))
              ? "page"
              : undefined
          }
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
