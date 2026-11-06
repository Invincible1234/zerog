import type { Metadata } from "next";
import Link from "next/link";
import { ThemeFrame } from "@/components/theme-frame";
import { ThemeToggle } from "@/components/theme-toggle";
import { Navigation } from "@/components/navigation";
import { CommandMenu } from "@/components/command-menu";
import { Experience } from "@/components/experience";
import { catalog } from "@/lib/data";
import "./globals.css";
import "./experience.css";
export const metadata: Metadata = {
  title: { default: "Zex / ZEROg — Evidence in orbit", template: "%s · ZEROg" },
  icons: { icon: "/icon.svg" },
  description:
    "Explore a saved Helix critic run over public NASA OSDR tables. Trace every lead to its evidence. No live model calls.",
};
const themeScript = `try{var t=localStorage.getItem('zerog-theme');t=t==='light'||t==='dark'?t:'dark';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){document.documentElement.dataset.theme='dark'}`;
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeFrame>
          <Experience />
          <div className="ambient-light" aria-hidden="true" />
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <header className="site-header">
            <Link className="wordmark" href="/" aria-label="ZEROg home">
              ZERO<span>g</span>
              <small>BY ZEX</small>
            </Link>
            <Navigation />
            <div className="header-tools">
              <CommandMenu
                studies={catalog().map((s) => ({
                  id: s.osd_id,
                  title: s.title,
                  tissue: s.material,
                }))}
              />
              <ThemeToggle />
            </div>
          </header>
          <main id="main">{children}</main>
          <footer className="site-footer">
            <div className="footer-brand">
              <Link href="/" className="wordmark">
                ZERO<span>g</span>
              </Link>
              <span>Open data. Open questions. Traceable evidence.</span>
              <span className="status">
                <i /> SAVED RESEARCH DEMO
              </span>
            </div>
            <p>
              <span className="accent">↳</span> Leads are not experimental
              validation. Table numbers, the critic label, and the replication
              check stay separate.
            </p>
            <div>
              <span>
                Independent research demo. No SpaceX affiliation or endorsement.
              </span>
              <Link href="/method">Methods & sources ↗</Link>
            </div>
          </footer>
        </ThemeFrame>
      </body>
    </html>
  );
}
