"use client";

import { useState } from "react";
import type { SheetData } from "@/lib/case-studies";

const NUMERIC_PATTERN = /^\(?-?\$?\d[\d,]*\.?\d*\)?\s?(%|x|k|mm?|bn?|t)?$/i;

function isNumericish(cell: string) {
  const trimmed = cell.trim();
  if (!trimmed) return false;
  return NUMERIC_PATTERN.test(trimmed);
}

function ExhibitTable({ rows }: { rows: string[][] }) {
  if (rows.length === 0) {
    return <p className="text-ink-muted text-sm py-8">This sheet is empty.</p>;
  }

  const [headerRow, ...bodyRows] = rows;
  const width = headerRow.length;

  return (
    <div className="overflow-x-auto border border-hairline font-sans-ui">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="bg-navy text-navy-foreground">
            {headerRow.map((cell, i) => (
              <th
                key={i}
                scope="col"
                className={`whitespace-nowrap px-4 py-3 text-[12px] font-medium uppercase tracking-wide ${
                  isNumericish(cell) || i > 0 ? "text-right" : "text-left"
                }`}
              >
                {cell || " "}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, ri) => {
            const filled = row.filter((cell) => cell.trim() !== "");
            const isNote = filled.length === 1 && row[0].trim() !== "";

            if (isNote) {
              return (
                <tr
                  key={ri}
                  className={`border-t border-hairline ${
                    ri % 2 === 1 ? "bg-paper" : "bg-paper-raised"
                  }`}
                >
                  <td
                    colSpan={width}
                    className="px-4 py-2.5 text-left text-ink-muted leading-relaxed"
                  >
                    {row[0]}
                  </td>
                </tr>
              );
            }

            return (
              <tr
                key={ri}
                className={`border-t border-hairline ${
                  ri % 2 === 1 ? "bg-paper" : "bg-paper-raised"
                }`}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`tabular whitespace-nowrap px-4 py-2.5 ${
                      ci === 0
                        ? "text-ink font-medium"
                        : isNumericish(cell)
                          ? "text-right text-ink"
                          : "text-left text-ink-muted"
                    }`}
                  >
                    {cell || "–"}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

type OverviewBlock =
  | { kind: "fact"; label: string; value: string }
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string };

function parseOverview(rows: string[][]): { title: string; blocks: OverviewBlock[] } {
  const title = rows[0]?.[0] ?? "Overview";
  const blocks: OverviewBlock[] = [];

  for (const row of rows.slice(1)) {
    const [a, b] = row;
    if (!a?.trim()) continue;
    if (b?.trim()) {
      blocks.push({ kind: "fact", label: a.trim(), value: b.trim() });
    } else if (a.startsWith("## ")) {
      blocks.push({ kind: "heading", text: a.slice(3).trim() });
    } else {
      blocks.push({ kind: "paragraph", text: a.trim() });
    }
  }

  return { title, blocks };
}

function OverviewSheet({ rows }: { rows: string[][] }) {
  if (rows.length === 0) {
    return <p className="text-ink-muted text-sm py-8">This sheet is empty.</p>;
  }

  const { title, blocks } = parseOverview(rows);
  const facts = blocks.filter(
    (b): b is { kind: "fact"; label: string; value: string } => b.kind === "fact"
  );
  const rest = blocks.filter((b) => b.kind !== "fact");

  return (
    <div className="border border-hairline bg-paper-raised">
      <h3 className="font-serif text-xl text-ink px-6 pt-6">{title}</h3>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 px-6 py-6 font-sans-ui border-b border-hairline">
        {facts.map((f) => (
          <div
            key={f.label}
            className="flex items-baseline justify-between gap-4 border-b border-hairline pb-2"
          >
            <dt className="text-[11px] uppercase tracking-wide text-ink-faint whitespace-nowrap">
              {f.label}
            </dt>
            <dd className="text-right text-[14px] text-ink leading-snug">{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="px-6 py-6 space-y-4">
        {rest.map((block, i) =>
          block.kind === "heading" ? (
            <h4
              key={i}
              className="font-sans-ui text-xs uppercase tracking-[0.12em] text-bronze font-medium pt-2"
            >
              {block.text}
            </h4>
          ) : (
            <p key={i} className="text-[15px] leading-relaxed text-ink-muted">
              {block.text}
            </p>
          )
        )}
      </div>
    </div>
  );
}

export default function SheetTabs({ sheets }: { sheets: SheetData[] }) {
  const [active, setActive] = useState(0);

  if (sheets.length === 0) {
    return <p className="text-ink-muted">No sheets found in this workbook.</p>;
  }

  const activeSheet = sheets[active];
  const isOverview = activeSheet.name.trim().toLowerCase() === "overview";

  return (
    <div>
      <div className="flex flex-wrap gap-1 border-b border-hairline mb-6 font-sans-ui">
        {sheets.map((sheet, i) => (
          <button
            key={sheet.name}
            onClick={() => setActive(i)}
            className={`px-4 py-2.5 text-sm transition-colors border-b-2 -mb-px ${
              i === active
                ? "border-bronze text-ink font-medium"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {sheet.name}
          </button>
        ))}
      </div>
      {isOverview ? (
        <OverviewSheet rows={activeSheet.rows} />
      ) : (
        <ExhibitTable rows={activeSheet.rows} />
      )}
    </div>
  );
}
