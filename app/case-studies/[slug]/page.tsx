import Link from "next/link";
import { notFound } from "next/navigation";
import SheetTabs from "@/components/SheetTabs";
import { getAllCaseStudies, getCaseStudy, getCaseStudySlugs } from "@/lib/case-studies";

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

function formatDate(value: string) {
  const [year, month] = value.split("-");
  if (!month) return year;
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;

  let caseStudy;
  try {
    caseStudy = getCaseStudy(slug);
  } catch {
    notFound();
  }

  const { meta, sheets, fileName } = caseStudy;
  const all = getAllCaseStudies({ includeDrafts: true });
  const index = all.findIndex((cs) => cs.slug === slug);
  const prev = index >= 0 ? all[index + 1] : undefined;
  const next = index > 0 ? all[index - 1] : undefined;

  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="pt-10 font-sans-ui">
        <Link href="/" className="text-sm text-ink-muted hover:text-bronze transition-colors">
          ← All case studies
        </Link>
      </div>

      <header className="pt-6 pb-10 border-b-2 border-hairline-strong">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-sans-ui uppercase tracking-[0.15em] text-bronze font-medium">
          <span>{meta.dealType}</span>
          <span className="text-hairline-strong">&middot;</span>
          <span>{meta.sector}</span>
          {meta.status === "draft" && (
            <span className="ml-2 text-negative border border-negative/40 px-1.5 py-0.5 tracking-normal normal-case">
              Draft, unlisted
            </span>
          )}
        </div>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl text-ink">
          {meta.company}
        </h1>
        <p className="mt-2 text-sm font-sans-ui text-ink-faint">{formatDate(meta.date)}</p>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-muted">
          {meta.thesis}
        </p>

        {meta.metrics && meta.metrics.length > 0 && (
          <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 font-sans-ui">
            {meta.metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="text-[11px] uppercase tracking-wide text-ink-faint">
                  {metric.label}
                </dt>
                <dd className="tabular font-serif text-2xl text-ink mt-1">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-4 font-sans-ui">
          <a
            href={`/case-studies/${slug}/download`}
            className="inline-flex items-center gap-2 bg-navy text-navy-foreground text-sm px-4 py-2.5 hover:bg-bronze transition-colors"
          >
            Download original model (.xlsx)
          </a>
          <span className="text-xs text-ink-faint">{fileName}</span>
        </div>
      </header>

      <section className="py-10">
        <h2 className="font-serif text-lg text-ink mb-1">Exhibits</h2>
        <p className="text-sm font-sans-ui text-ink-faint mb-6">
          Rendered directly from the underwriting workbook. Select a tab to
          switch sheets.
        </p>
        <SheetTabs sheets={sheets} />
      </section>

      {(prev || next) && (
        <nav className="py-10 border-t border-hairline flex items-center justify-between text-sm font-sans-ui">
          {prev ? (
            <Link
              href={`/case-studies/${prev.slug}`}
              className="text-ink-muted hover:text-bronze transition-colors"
            >
              ← {prev.meta.company}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/case-studies/${next.slug}`}
              className="text-ink-muted hover:text-bronze transition-colors"
            >
              {next.meta.company} →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
