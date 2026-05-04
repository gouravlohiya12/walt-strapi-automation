---
description: Generate multiple landing pages from an Excel or CSV file and deploy them all to the client's subdomain
---

# /bulk-pages

Create dozens of landing pages at once from a spreadsheet. Each row becomes one published page. All pages deploy to the client's subdomain automatically.

## Your job

Read the spreadsheet, validate the data, generate AI copy for each row, preview a sample, then batch-publish everything in one push.

---

## The flow

### Step 0 — Explain what you need

Before asking for anything, tell the user:

> "Great — let's create pages in bulk. I need two things from you:
>
> 1. **The spreadsheet** — either:
>    - Share the file path (e.g. `/Users/you/Desktop/pages.xlsx`)
>    - Export it as CSV and paste the contents directly in this chat
>    - Copy-paste the rows from Excel (columns separated by tabs)
>
> 2. **The client** — which brand are these pages for?
>
> Your spreadsheet needs at minimum a **keyword** column. Optional columns (I'll fill in defaults for anything missing):
>
> | Column | Required | Example |
> |--------|----------|---------|
> | `keyword` | ✅ Yes | `small business tax software` |
> | `target_audience` | No | `solopreneurs filing quarterly` |
> | `cta_url` | No | `https://checkout.acme.com` |
> | `custom_h1` | No | `STOP LOSING MONEY ON TAXES` |
> | `template` | No | `raising-kids` |
>
> If you share a file path, I'll parse it. If you paste the data, I'll read it directly."

### Step 1 — Pick the client

Ask which client, or infer from context. Read `clients/{slug}/config.json`.

If no client exists yet, stop and say: *"This client isn't set up yet. Run `/new-client` first, then come back to `/bulk-pages`."*

### Step 2 — Get the spreadsheet data

**If they share a file path** (`.xlsx`, `.csv`, `.xls`):

Run the parser script:
```bash
node scripts/parse-excel.js --file "/path/to/file.xlsx" --out /tmp/bulk-pages.json
```

This outputs a JSON array of rows. Read `/tmp/bulk-pages.json`.

**If they paste CSV or tab-separated data directly**:

Parse it yourself. The first row is headers. Map columns to these fields:
- `keyword` / `Keyword` / `Topic` / `Page Topic` → `keyword`
- `target_audience` / `Audience` / `Who` → `target_audience`
- `cta_url` / `CTA` / `Checkout URL` / `Link` → `cta_url`
- `custom_h1` / `Headline` / `H1` → `custom_h1`
- `template` / `Template` / `Design` → `template`

Be flexible with header names — the user won't know the exact column names.

### Step 3 — Validate and preview the data

Show a clean table of what you found:

```
📊 Found 12 rows in the spreadsheet

| # | Keyword | Audience | CTA | Template |
|---|---------|----------|-----|----------|
| 1 | small business tax software | (client default) | (client default) | raising-kids |
| 2 | self-employed tax prep | solopreneurs | (client default) | raising-kids |
| 3 | quarterly tax filing | freelancers | https://custom-link.com | raising-kids |
...

⚠️  Row 7 is missing a keyword — I'll skip it.
⚠️  Row 11 has a duplicate keyword as row 3 — I'll append "-2" to the slug.

Proceed with 11 pages? (Type "yes" or tell me what to fix)
```

### Step 4 — Confirm subdomain

Check if the client has `domain` set in their config.json.

If yes:
> *"All 11 pages will deploy to `{client.domain}/{slug}` — e.g. `pages.acme.com/small-business-tax-software`. Good?"*

If no domain configured:
> *"You don't have a custom domain set up for this client yet. Pages will go live at `https://ai-auto-landing-pages-system.vercel.app/{slug}` for now. Want to connect a domain after? (I can walk you through it with `/connect-domain`)"*

### Step 5 — Generate content for all pages

For each valid row, generate full page content using the same process as `/new-page`:
- Read `templates/{template}/content-schema.json`
- Use client config + row data (keyword, audience, custom_h1 if provided)
- Apply prompts from `docs/knowledge/ai-copywriting-prompts.md`
- If `custom_h1` is provided, use it directly — don't regenerate

Show progress as you go:
```
Generating page 1/11: small-business-tax-software... ✅
Generating page 2/11: self-employed-tax-prep... ✅
Generating page 3/11: quarterly-tax-filing... ✅
...
```

Do NOT wait for approval on each page — generate all in one pass. The user will review a sample in the next step.

### Step 6 — Sample preview

After generating, pick the first 2-3 pages and show a human-readable summary:

```
Here are the first 3 pages — review before I save everything:

--- Page 1: small-business-tax-software ---
H1: STOP PAYING MORE TAXES THAN YOU HAVE TO
Sub: (Without the Late Fees, Confusion, or Missed Deductions)
CTA: FILE SMARTER TODAY ($97 $49)

--- Page 2: self-employed-tax-prep ---
H1: THE SELF-EMPLOYED TAX SYSTEM THAT ACTUALLY MAKES SENSE
Sub: (Without the Accountant, Anxiety, or Surprises at Tax Time)
CTA: GET CONTROL OF YOUR TAXES

--- Page 3: quarterly-tax-filing ---
H1: NEVER MISS A QUARTERLY PAYMENT AGAIN
Sub: (Without the Penalties, Calculator Dread, or IRS Letters)
CTA: START FILING ON TIME

Happy with the style? Type "yes" to save all 11 pages, or tell me what to adjust before I generate the rest.
```

### Step 7 — Save all page files

On approval, write every page to:
```
clients/{client-slug}/pages/{slug}.json
```

Each file gets `"status": "draft"` initially.

Show a final count:
```
✅ Saved 11 page files to clients/{client}/pages/
```

### Step 8 — Set status to published

Ask: *"Ready to go live with all 11? I'll set them to 'published' and push to GitHub — Vercel will deploy everything in about 60 seconds."*

On yes: update each file's `"status"` to `"published"`, then proceed to push.

### Step 9 — Commit and push

```bash
git add clients/{client-slug}/pages/
git commit -m "Bulk add {N} pages for {client-name}: {first-keyword}, {second-keyword}..."
git push origin main
```

### Step 10 — Wait for Vercel and verify

Wait ~60 seconds, then verify 3-4 sample URLs with curl:
```bash
curl -sIo /dev/null -w "%{http_code}" https://ai-auto-landing-pages-system.vercel.app/{slug}
```

### Step 11 — Report all live URLs

```
🚀 All 11 pages are live:

https://pages.acme.com/small-business-tax-software
https://pages.acme.com/self-employed-tax-prep
https://pages.acme.com/quarterly-tax-filing
...

Sitemap updated automatically. Want me to submit all pages to Google for indexing?
```

If yes, run:
```bash
node scripts/submit-sitemap.js
node scripts/request-indexing.js
```

---

## Excel/CSV template to share with the user

If they ask what format to use, give them this template they can copy into Excel or Google Sheets:

```
keyword	target_audience	cta_url	custom_h1	template
small business tax software	small business owners	https://checkout.example.com		raising-kids
self-employed tax prep	freelancers			raising-kids
quarterly tax filing	solopreneurs	https://checkout.example.com/quarterly		raising-kids
```

First column is required. All others are optional — leave blank to use client defaults.

---

## Edge cases

- **File won't parse** → ask them to export as CSV and paste directly
- **50+ rows** → warn it'll take a few minutes; ask if they want to do a 10-page test batch first
- **Duplicate slugs within batch** → append `-2`, `-3` etc; flag them
- **No ANTHROPIC_API_KEY** → stop immediately, explain they need the key configured in Claude Code settings
- **Template doesn't exist** → default to `raising-kids`; list available templates
- **Missing keyword on a row** → skip that row; report which rows were skipped
- **Vercel deploy fails** → show build log summary; most common cause is a missing `views/404.ejs` or EJS syntax error
