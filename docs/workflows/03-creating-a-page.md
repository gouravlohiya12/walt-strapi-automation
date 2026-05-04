# Workflow 03 — Creating a new landing page

Triggered by: `/new-page` command, or natural language ("create a page about X").

The full conversational script is in [.claude/commands/new-page.md](../../.claude/commands/new-page.md). This doc gives extra context.

## The 4 inputs needed

1. **Client** — which brand owns this page?
2. **Template** — which design? Default: `raising-kids`
3. **Keyword** — what's this page about?
4. **Target audience** — who specifically converts?

## How content gets generated

The AI fills the fields in `templates/{template}/content-schema.json` using:
- The client's `config.json` (for brand voice, audience defaults)
- The page's keyword + target audience
- The patterns in [docs/knowledge/ai-copywriting-prompts.md](../knowledge/ai-copywriting-prompts.md)
- Best practices in [docs/knowledge/landing-page-best-practices.md](../knowledge/landing-page-best-practices.md)

## What CAN be auto-generated (no need to ask)

- Headlines (H1, H1 sub, hero body)
- Body paragraphs (gold standard, myth columns, course intro, philosophy)
- Roadmap items (titles + teasers)
- FAQ questions and answers
- Final CTA copy
- Meta description

## What MUST be asked (never invent)

- **Real people's names** (instructors, guest experts) — no fabrication
- **Real photos** — ask for URLs or file paths
- **Specific numbers** (subscriber counts, revenue, % statistics)
- **Real prices** — total_value and your_price
- **Real testimonials** (if added later)
- **CTA URL** — defaults to client's, but ask if it should be different

## Iteration loop

After first draft:

1. Show the user a clean summary (not the JSON)
2. Ask: *"What do you want to change?"*
3. Edit only the requested sections
4. Save the JSON
5. Re-preview if visual changes were made

## Saving

Page lives at `clients/{client-slug}/pages/{page-slug}.json`.

Always commit immediately after saving:
```bash
git add clients/{client}/pages/{page-slug}.json
git commit -m "Add page: {client}/{page-slug} ({keyword})"
```

Don't push yet — that happens via `/publish`.

## Status field

Pages have a `status` field with three values:
- `draft` — saved but not published
- `published` — pushed to GitHub + live on Vercel
- `archived` — soft-deleted, hidden from sitemap

Default: `draft` until `/publish` runs.

## Validating before save

Before writing the JSON, check:
- Slug doesn't collide with an existing page in same client folder
- All required fields per the schema are non-empty (or have `[NEEDS INPUT]` placeholder)
- `cta_url` is a valid URL (or empty string for placeholder)
- `total_value` and `your_price` are simple `$X` strings (no currency confusion)

## Edge cases

### User wants pages for a client that doesn't exist
→ trigger `/new-client` first, then come back

### User gives multiple keywords at once ("create 5 pages about X for industries A, B, C, D, E")
→ this is batch mode. Generate one at a time, show progress: *"1/5 done, 2/5 done..."*. Save each, commit each. Don't try to ship all 5 in one giant response.

### User wants to clone an existing page with small changes
→ read the source page JSON, copy to new slug, generate fresh copy for any fields they want changed, save. Useful for industry variants.

### User wants a different template
→ list available templates (currently only `raising-kids`). If they want a new design, that's a separate "new template" workflow (not built yet — flag as future work).

### Template fields don't fit the user's offer
→ skip optional fields (set to null or empty array). Required fields can't be skipped — push back if they don't have content for them.
