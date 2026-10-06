import fs from "node:fs";
import path from "node:path";
import * as XLSX from "xlsx";

const CONTENT_DIR = path.join(process.cwd(), "content", "case-studies");

export type CaseStudyMetric = {
  label: string;
  value: string;
};

export type CaseStudyMeta = {
  company: string;
  sector: string;
  dealType: string;
  date: string; // "YYYY-MM" or "YYYY-MM-DD"
  status?: "draft" | "published";
  thesis: string;
  tags?: string[];
  metrics?: CaseStudyMetric[];
};

export type SheetData = {
  name: string;
  rows: string[][];
};

export type CaseStudySummary = {
  slug: string;
  meta: CaseStudyMeta;
};

export type CaseStudy = CaseStudySummary & {
  sheets: SheetData[];
  fileName: string;
};

function readMeta(slug: string): CaseStudyMeta {
  const metaPath = path.join(CONTENT_DIR, slug, "meta.json");
  const raw = fs.readFileSync(metaPath, "utf-8");
  return JSON.parse(raw) as CaseStudyMeta;
}

export function findWorkbookFile(slug: string): string {
  const dir = path.join(CONTENT_DIR, slug);
  const file = fs.readdirSync(dir).find((f) => f.toLowerCase().endsWith(".xlsx"));
  if (!file) {
    throw new Error(`No .xlsx file found in content/case-studies/${slug}`);
  }
  return file;
}

export function getCaseStudySlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => fs.existsSync(path.join(CONTENT_DIR, entry.name, "meta.json")))
    .map((entry) => entry.name);
}

export function getAllCaseStudies({ includeDrafts = false } = {}): CaseStudySummary[] {
  return getCaseStudySlugs()
    .map((slug) => ({ slug, meta: readMeta(slug) }))
    .filter((cs) => includeDrafts || cs.meta.status !== "draft")
    .sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1));
}

export function getCaseStudyMeta(slug: string): CaseStudyMeta {
  return readMeta(slug);
}

export function getCaseStudy(slug: string): CaseStudy {
  const meta = readMeta(slug);
  const fileName = findWorkbookFile(slug);

  const buffer = fs.readFileSync(
    path.join(process.cwd(), "content", "case-studies", slug, fileName)
  );
  const workbook = XLSX.read(buffer, { type: "buffer", cellText: true });

  const sheets: SheetData[] = workbook.SheetNames.filter(
    (name) => !name.startsWith("_")
  ).map((name) => {
    const worksheet = workbook.Sheets[name];
    const rows = XLSX.utils.sheet_to_json<string[]>(worksheet, {
      header: 1,
      raw: false,
      defval: "",
      blankrows: false,
    });
    const width = rows.reduce((max, row) => Math.max(max, row.length), 0);
    const paddedRows = rows
      .map((row) => {
        const padded = [...row];
        while (padded.length < width) padded.push("");
        return padded.map((cell) => (cell ?? "").toString().trim());
      })
      .filter((row, i) => i === 0 || row.some((cell) => cell !== ""));
    return { name, rows: paddedRows };
  });

  return { slug, meta, sheets, fileName };
}
