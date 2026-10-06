import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function Nav() {
  return (
    <header className="font-sans-ui">
      <div className="mx-auto max-w-5xl px-6 pt-6 text-center text-[11px] uppercase tracking-[0.15em] text-ink-faint">
        {siteConfig.title}
      </div>

      <Link href="/" className="group block text-center pt-3 pb-4">
        <div className="font-serif text-5xl sm:text-6xl tracking-tight text-ink group-hover:text-bronze transition-colors">
          {siteConfig.name}
        </div>
      </Link>

      <div className="rule-double mx-6" />

      <nav className="mx-auto max-w-5xl px-6 py-2.5 flex items-center justify-center gap-6 text-xs uppercase tracking-[0.1em] text-ink-muted border-b border-hairline">
        <a
          href={siteConfig.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-bronze transition-colors"
        >
          LinkedIn
        </a>
        <span className="text-hairline-strong">|</span>
        <a
          href={siteConfig.personalSiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-bronze transition-colors"
        >
          Personal Site
        </a>
      </nav>
    </header>
  );
}
