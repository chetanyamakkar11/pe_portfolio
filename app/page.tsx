import CaseStudyCard from "@/components/CaseStudyCard";
import { getAllCaseStudies } from "@/lib/case-studies";
import { siteConfig } from "@/lib/site-config";

export default function Home() {
  const caseStudies = getAllCaseStudies();

  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="pt-14 pb-10 border-b-2 border-hairline-strong">
        <div className="text-xs font-sans-ui uppercase tracking-[0.2em] text-bronze font-medium">
          Case Study Portfolio
        </div>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl text-ink leading-[1.15] max-w-2xl">
          {siteConfig.tagline}
        </h1>
        <p className="mt-5 text-ink-muted max-w-xl text-[17px] leading-relaxed">
          Each write-up below includes the full underwriting model:
          sources &amp; uses, operating build, and return sensitivities,
          rendered directly from the underlying spreadsheet.
        </p>
      </section>

      <section className="py-4">
        {caseStudies.length === 0 ? (
          <p className="text-ink-muted py-10">
            No case studies published yet. Drop a folder into{" "}
            <code className="text-sm bg-paper-raised border border-hairline px-1.5 py-0.5">
              content/case-studies/
            </code>{" "}
            to get started.
          </p>
        ) : (
          <div className="divide-y divide-hairline">
            {caseStudies.map((cs) => (
              <CaseStudyCard key={cs.slug} slug={cs.slug} meta={cs.meta} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
