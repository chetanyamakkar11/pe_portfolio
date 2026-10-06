import Link from "next/link";
import type { CaseStudySummary } from "@/lib/case-studies";

function formatDate(value: string) {
  const [year, month] = value.split("-");
  if (!month) return year;
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function CaseStudyCard({ slug, meta }: CaseStudySummary) {
  return (
    <Link href={`/case-studies/${slug}`} className="group block py-8">
      <div className="flex items-start justify-between gap-4 font-sans-ui">
        <div className="text-xs uppercase tracking-[0.15em] text-bronze font-medium">
          {meta.dealType} &middot; {meta.sector}
        </div>
        <time className="text-xs text-ink-faint whitespace-nowrap pt-0.5 uppercase tracking-wide">
          {formatDate(meta.date)}
        </time>
      </div>

      <h2 className="mt-2 font-serif text-3xl text-ink group-hover:text-bronze transition-colors leading-tight">
        {meta.company}
      </h2>

      <p className="mt-3 text-[16px] leading-relaxed text-ink-muted max-w-3xl">
        {meta.thesis}
      </p>

      {meta.metrics && meta.metrics.length > 0 && (
        <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-hairline pt-5 font-sans-ui">
          {meta.metrics.map((metric) => (
            <div key={metric.label}>
              <dt className="text-[11px] uppercase tracking-wide text-ink-faint">
                {metric.label}
              </dt>
              <dd className="tabular font-serif text-lg text-ink mt-0.5">
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {meta.tags && meta.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2 font-sans-ui">
          {meta.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-ink-muted border border-hairline px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 text-sm font-sans-ui font-medium text-ink group-hover:text-bronze transition-colors">
        Read case study →
      </div>
    </Link>
  );
}
