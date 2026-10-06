import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground mt-24 font-sans-ui">
      <div className="mx-auto max-w-5xl px-6 py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs leading-relaxed">
        <p className="text-navy-foreground/60 max-w-xl">
          Independent research for personal and educational purposes. Not
          investment advice, not affiliated with any fund or employer, and
          not an offer to buy or sell securities.
        </p>
        <div className="flex gap-5 shrink-0 uppercase tracking-[0.1em]">
          <a
            href={`mailto:${siteConfig.email}`}
            className="hover:text-bronze-soft transition-colors"
          >
            Email
          </a>
          <a
            href={siteConfig.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-bronze-soft transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={siteConfig.personalSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-bronze-soft transition-colors"
          >
            Personal Site
          </a>
        </div>
      </div>
    </footer>
  );
}
