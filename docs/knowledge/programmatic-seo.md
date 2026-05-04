# Programmatic SEO — How It Works in This System

## What programmatic SEO is

Generating many similar-but-unique landing pages, each targeting a specific long-tail keyword. Instead of writing one big "Pillar" page about *"AI productivity tools"*, you create 50 variations: *"AI productivity tools for lawyers"*, *"AI productivity tools for real estate agents"*, etc.

Each page is unique enough that Google indexes it separately, and ranks each one for its specific keyword.

## The system this project uses

1. **Pick a "keyword cluster"** — a parent topic with many natural variants (e.g., "AI X for Y industry")
2. **Generate one page per variant** — using the same template, but unique copy per variant
3. **Each page has its own URL slug** (`/ai-productivity-tools-for-lawyers`)
4. **Each gets submitted to Google's Indexing API** for fast discovery

## Keyword strategy

Good programmatic SEO keywords have these traits:
- **Long-tail**: 3-6 words. Less competition.
- **Modifier-driven**: Same root + many modifiers. (`X for [Y]`, `best X in [city]`, `X vs Y`)
- **Search-intent matched**: User has a specific problem ("CRM for solo lawyers") not vague curiosity ("what is a CRM")
- **Buyer-intent**: User is closer to a decision than a research phase

## How to help Walt's team brainstorm keywords

When they say *"I want pages about X"*, ask:
1. **What's the parent topic?** (e.g., "tax software")
2. **What modifier dimensions are valuable?** (industry? city? team size? feature?)
3. **Who's the buyer for each variant?** (will the copy be different?)

Then generate a list. Example:
> Parent: "AI tax software"
> Modifiers: industry (lawyers, contractors, restaurants...), team size (solo, small, mid-market), feature (1099, payroll, multi-state...)
> Result: ~50-100 variant keywords.

Save the list as `clients/{client}/keywords.json` for batch generation later.

## Avoiding the "thin content" trap

Google penalizes pages that are 95% identical with just the keyword swapped. To avoid this, each page in this system should have:

- **Unique H1** — not just templated
- **Unique 150-250 word body** — actual value, not filler
- **Unique FAQs** — addressing the specific audience's specific anxieties
- **Unique CTA framing** — speaks to their world

The AI generates all of these per page. Don't shortcut — that's where this system earns its rankings.

## Internal linking — INTENTIONALLY OFF

Per project preference: **DO NOT cross-link landing pages to each other.** Each is standalone. No "see also", no "related pages", no breadcrumbs to siblings.

Why: cleaner UX, no risk of Google flagging the network as a "doorway".

## Submitting to Google

Two scripts handle this:
- `scripts/submit-sitemap.js` — sends `sitemap.xml` to Search Console (one-time per client)
- `scripts/request-indexing.js` — pings the Indexing API per URL (200/day quota)

After publishing new pages, the AI should offer to run these. See [google-indexing.md](google-indexing.md) for quotas and gotchas.

## What "good" looks like

A successful programmatic SEO page:
- Loads in < 2 seconds (Lighthouse > 90 mobile)
- Has < 30% bounce rate after 3 months of traffic
- Ranks in top 10 for its primary keyword within 60-90 days
- Converts to email/CTA at 3-8% (depends on offer)

If a page is below these, the AI should suggest tweaks (better H1, stronger social proof, sharper CTA).
