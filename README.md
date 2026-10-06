# Case Study Notebook

A personal portfolio of PE-style investment case studies. Each write-up is
backed by a real Excel workbook — the site renders it in the browser as
formatted exhibit tables, and visitors can download the original file.

## How it works

- `content/case-studies/<slug>/` — one folder per case study
  - `meta.json` — title, sector, deal type, thesis, optional headline metrics
  - `<anything>.xlsx` — the underwriting workbook (any filename, must be the
    only `.xlsx` file in the folder)
- The site reads these folders **at build time** and statically generates a
  page per case study — no database, no CMS, no server-side upload flow.
- Each sheet in the workbook becomes a tab on the case study page. Cell
  values are pulled from Excel's own formatted display text (so `$184.2M`,
  `17.2%`, `7.8x` etc. render exactly as they appear in the spreadsheet).
- A hidden "notes" sheet can be excluded from the site by naming it with a
  leading underscore, e.g. `_scratch`.

## Adding a new case study

1. Create a folder: `content/case-studies/my-company/`
2. Drop your `.xlsx` file into it (any filename).
3. Add a `meta.json` next to it:

   ```json
   {
     "company": "My Company",
     "sector": "Consumer — Direct to Consumer",
     "dealType": "Growth Equity",
     "date": "2026-08",
     "status": "published",
     "thesis": "One or two sentences on why this business is interesting.",
     "tags": ["Optional", "Tags"],
     "metrics": [
       { "label": "LTM Revenue", "value": "$42.0M" },
       { "label": "Entry Multiple", "value": "5.5x" }
     ]
   }
   ```

   - `status: "draft"` generates the page (useful for previewing/sharing a
     link) but hides it from the homepage listing.
   - `metrics` and `tags` are both optional.

4. Run `npm run dev` locally to preview, then commit and deploy.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run start
```

## Deployment

This is a standard Next.js app — deploys cleanly to
[Vercel](https://vercel.com/new) (recommended: `vercel --prod` or connect the
GitHub repo for auto-deploys on push) or any host that runs Next.js
(Netlify, Render, a Node server, etc.).

Once deployed, link to the site from your personal site/resume — e.g.
`<a href="https://your-deployed-url.vercel.app">Case Studies</a>`.

Before deploying, update `lib/site-config.ts` with your real name, LinkedIn,
personal site URL, and email.

## Editing the look

- Colors, fonts: `app/globals.css` (paper/navy/bronze palette) and
  `app/layout.tsx` (fonts — Source Serif 4 for headings, Inter for body).
- Site name/tagline/links: `lib/site-config.ts`.
- Card layout: `components/CaseStudyCard.tsx`.
- Exhibit table rendering + numeric alignment heuristic:
  `components/SheetTabs.tsx`.
