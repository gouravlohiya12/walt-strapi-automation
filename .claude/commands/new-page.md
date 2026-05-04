---
description: Creates a new landing page for an existing client; AI generates the copy
---

# /new-page

Create a single landing page tied to an existing client + template. You generate the copy, they review, you save.

## Your job

Interview them, generate page copy, preview, iterate, save. Don't publish — that's `/publish`.

## The flow

### Step 0 — Scratch or duplicate?

**Always ask this first, before anything else:**

> "Do you want to:
> **A) Build from scratch** — I write all the copy and use an existing template design
> **B) Clone an existing page** — paste the source code from any live page and I'll replicate its design with new content"

**If they choose A** → continue to Step 1 (normal flow).

**If they choose B** → follow the **Duplicate Flow** below, then rejoin at Step 3 (topic/keyword).

---

### DUPLICATE FLOW (only if they chose B)

#### D1 — Get the original page URL

Ask: *"What's the URL of the page you want to clone? (e.g. `https://christian-sexuality.com/raising-kids`)"*

Save this as `source_url`. This is used for the canonical reference and to check the live page later.

#### D2 — Get the full page source code

Ask:

> "Now I need the full HTML source of that page. Here's how to get it:
>
> 1. Open the page in Chrome or Safari
> 2. Right-click anywhere on the page → **View Page Source** (or press `Cmd+U` on Mac, `Ctrl+U` on Windows)
> 3. Press `Cmd+A` (or `Ctrl+A`) to select all, then `Cmd+C` to copy
> 4. Paste it here in the chat"

Wait for them to paste the HTML. It will be long — that's fine, read it.

Once received:
- Extract: color palette (hex codes from CSS), font families, section structure (H1/H2/H3 patterns, CTA button styles), layout approach (full-width hero, diagonal cuts, etc.)
- Note: the important things are the **visual design tokens** (colors, fonts, spacing philosophy) and the **section order** — not the exact copy, which you'll replace
- Save these as `cloned_design` notes you'll use when building the template

#### D3 — Get a screenshot of the full page

Ask:

> "One more thing — can you share a screenshot of the full page? This helps me match the visual layout section by section.
>
> To get a full-page screenshot:
> - **Chrome**: Press `Cmd+Shift+P` → type 'screenshot' → select 'Capture full size screenshot'
> - **Firefox**: Right-click → Take Screenshot → Save full page
> - Or just scroll through and share multiple screenshots
>
> Drag and drop the image(s) directly into this chat."

Study the screenshot carefully:
- Note the hero background (photo, gradient, solid color)
- Note section colors and the order they appear
- Note any decorative elements (diagonal cuts, overlapping sections, yellow blocks, etc.)
- Note typography scale (giant H1, medium H2, smaller body)
- Note CTA button color and position

#### D4 — Confirm what you extracted

Show the user what you found:

```
Here's what I extracted from the page:

🎨 Colors
   Primary (dark navy):   #1F2833
   Accent (orange/CTA):   #BF4E30
   Highlight (yellow):    #E9D985
   Secondary (green):     #439A86

🖋  Fonts
   Headings: Poppins (bold, uppercase)
   Body: Source Sans Pro

📐 Sections (in order)
   1. Hero — full-width photo + overlay, giant H1, CTA button
   2. Yellow diagonal block — "gold standard" paragraph
   3. Myth-busting — 3 columns
   4. Course intro banner — dark background
   5. Roadmap — numbered list
   6. Expert bios
   7. Pricing — 2 columns (features + bonus)
   8. FAQ — accordion
   9. Final CTA — light text on dark

Does this look right? I'll use this as the design blueprint for the new page.
```

#### D5 — Create or reuse the template

Check if a template matching this design already exists in `templates/`.

**If a matching template exists** → use it (just like normal flow).

**If not** → tell the user:

> "This is a design I haven't built a template for yet. I'll clone the structure into a new template for this client. It'll be saved as `templates/{slug}-clone/` so you can reuse it for future pages.
>
> This takes a few minutes. Want me to proceed?"

On yes:
1. Create `templates/{slug}-clone/manifest.json` — section list matching the source page
2. Create `templates/{slug}-clone/content-schema.json` — fields matching the section structure
3. Create `templates/{slug}-clone/template.ejs` — EJS template built from the extracted HTML, replacing all hardcoded copy with `<%= content.field_name %>` variables, keeping all CSS/design intact
4. Save the source URL + screenshot description in `templates/{slug}-clone/README.md` for future reference

> Once the template is built, all future `/new-page` calls for this client can use it — and `/bulk-pages` can use it for batch generation.

---

### Step 1 — Pick the client

If they didn't name a client, list available clients:
```
ls clients/ | grep -v _example
```

Ask: *"Which client is this page for? (Pick one of: acme, brandX, brandY)"*

Read their `clients/{slug}/config.json` for brand info.

### Step 2 — Pick the template

If they didn't say, list available:
```
ls templates/
```

Default to `raising-kids` if there's only one.

Read `templates/{template}/manifest.json` and `templates/{template}/content-schema.json` so you know what content fields to fill.

### Step 3 — Get the topic / keyword

Ask: *"What's this page about? Give me the keyword or topic — e.g., 'small business tax software' or 'how to start running'."*

Save as the page's `keyword`. Also auto-generate the URL slug from this (kebab-case).

Show the slug: *"This page will live at `{client.domain or vercel-url}/{slug}` — sound good?"*

### Step 4 — Audience refinement

Ask: *"Who specifically should this page convert? (Defaults to the client's audience: '{client.audience}')"*

This sharpens the copy. Save as `target_audience` for this page.

### Step 5 — Content generation (the meaty part)

Read `docs/knowledge/ai-copywriting-prompts.md` for the section-by-section prompts.

Read `templates/{template}/content-schema.json` to see what fields the template expects. For `raising-kids`, the fields are:

- `h1` — main headline (max 12 words, benefit-driven)
- `h1_sub` — italic subheadline in parens (the "without the X" qualifier)
- `hero_body` — 1 sentence under the hero
- `cta_text` — button text (3-5 words)
- `gold_standard_intro` — the "wherever your customers learn..." paragraph
- `gold_standard_options` — 4 items: 3 negatives + 1 positive ("Or You?")
- `gold_standard_truth` — the "The Truth:" paragraph
- `myth_title` — "X is a Myth" headline
- `myth_columns` — 3 cards: { title, body }
- `intro_banner_subtitle` — "Introducing:" line
- `intro_banner_title` — the big course/product name
- `course_intro_h3` — uppercase intro to the offer
- `course_intro_body` — 1-2 sentences
- `core_philosophy_h5` — heading
- `core_philosophy_body` — 2-3 sentences
- `roadmap_title` — section heading ("Your Roadmap to X")
- `roadmap_items` — array of { number, title, body } — 8-10 items
- `guides_title` — "Meet Your Guides" or similar
- `guides_items` — array of { name, role, bio }
- `experts_section_title` — usually "GUEST EXPERTS"
- `experts` — array of { name, photo_url }
- `pricing_title` — "Equip Yourself Today" or similar
- `pricing_bullets` — 3-4 items: { title, body, icon }
- `pricing_bonus_title` + `pricing_bonus_items` — bonus column
- `total_value` — "$197"
- `your_price` — "$99"
- `pricing_tagline` — italic statement under prices
- `faq_title` — "Common Questions"
- `faqs` — array of { q, a } — 3-5 items
- `final_cta_title` — big light-weight headline (e.g., "Your Silence Is An Answer")
- `final_cta_subtitle` — uppercase tagline
- `final_cta_button` — button text

**Generate all of these** based on the keyword + audience + business_type. Use the patterns in [docs/knowledge/landing-page-best-practices.md](../../docs/knowledge/landing-page-best-practices.md) and the prompt templates in [docs/knowledge/ai-copywriting-prompts.md](../../docs/knowledge/ai-copywriting-prompts.md).

### Step 6 — Show the draft

Don't dump the whole JSON. Show a clean human-readable summary:

```
Here's the draft for "{keyword}":

📌 Hero
   H1: {h1}
   Sub: {h1_sub}
   Body: {hero_body}
   Button: {cta_text}

📌 Roadmap (10 items)
   01. {first item title}
   ...

📌 Pricing
   {total_value} → {your_price}
   3 bullets + 1 bonus column

📌 FAQ ({faqs.length} items)

What do you want to change? Or type "looks good" to save.
```

### Step 7 — Iterate

If they request changes (e.g., "make the H1 punchier", "add a 4th FAQ"), regenerate just that section, show the diff.

### Step 8 — Save

When approved, write to:
```
clients/{client-slug}/pages/{page-slug}.json
```

The file format:
```json
{
  "slug": "small-business-tax-software",
  "keyword": "small business tax software",
  "template": "raising-kids",
  "client": "acme",
  "target_audience": "Small business owners ...",
  "content": { /* all the fields above */ },
  "status": "draft",
  "created_at": "2026-05-01",
  "last_edited": "2026-05-01"
}
```

### Step 9 — Preview

Auto-trigger `/preview {client-slug} {page-slug}` so they can see it rendered. (Don't make them ask.)

### Step 10 — Commit

```
git add clients/{client-slug}/pages/{page-slug}.json
git commit -m "Add page: {client-slug}/{page-slug} ({keyword})"
```

### Step 11 — Wrap up

*"✅ Page draft saved. You can preview it again with `/preview {client}/{page}`, edit by telling me what to change, or publish when ready with `/publish`."*

## Edge cases

- Client doesn't exist → trigger `/new-client` first
- Slug collision (page already exists) → ask: overwrite, append `-2`, or rename
- Template content-schema has fields you can't fill (no info from user) → use `[NEEDS INPUT]` placeholders, list them at the end so they can fill in manually
- They give vague keyword → ask for clarification before generating

## Critical: don't fabricate

Especially for sections like:
- **Guides** (real people's names) → ASK for names + bios; never invent
- **Guest experts** (real photos/people) → ASK; never use names you made up
- **Total value / Your price** → ASK what's their offer
- **CTA URL** → use `client.default_cta_url` unless they specify

For everything else (headlines, body copy, FAQs), generating fresh is fine and expected.
