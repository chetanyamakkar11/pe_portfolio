import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { findWorkbookFile, getCaseStudySlugs } from "@/lib/case-studies";

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/case-studies/[slug]/download">
) {
  const { slug } = await ctx.params;

  let fileName: string;
  try {
    fileName = findWorkbookFile(slug);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  const file = fs.readFileSync(
    path.join(process.cwd(), "content", "case-studies", slug, fileName)
  );

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
