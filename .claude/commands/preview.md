---
description: Render a page locally and show a screenshot for review
---

# /preview

Render a page using the local frontend so the team can see how it looks before publishing.

## Usage

The user might say:
- `/preview` → ask which page
- `/preview acme/small-business-tax-software` → render that specific one
- `/preview acme` → list pages for that client and ask which

## The flow

### Step 1 — Identify the page

Get `{client-slug}/{page-slug}`. If ambiguous, list and ask.

### Step 2 — Make sure the page file is valid

Read `clients/{client-slug}/pages/{page-slug}.json`. Validate:
- All required fields per `templates/{template}/content-schema.json` are present
- No `[NEEDS INPUT]` placeholders left

If invalid, list missing fields and stop.

### Step 3 — Render via local frontend

Two paths depending on the team's setup:

**Path A — Quick static render (preferred for previews):**

```bash
cd /Users/gouravlohiya/claude\ code/ai-auto-landing-pages-system
node scripts/render-page.js --client {client-slug} --page {page-slug} --out /tmp/preview.html
```

(If `scripts/render-page.js` doesn't exist yet, create it — it should:
1. Load the page JSON + client config + template manifest
2. Merge them
3. Run EJS render
4. Write to /tmp/preview.html
5. Copy template assets + client assets to /tmp/preview-assets/)

**Path B — Live local Express server:**

```bash
cd frontend && npm run dev
```

Then open `http://localhost:3001/{page-slug}` in the browser preview.

### Step 4 — Screenshot via Claude Preview MCP

Start preview server pointed at the static HTML:
1. Use `preview_start` with the launch.json config that serves /tmp/preview-assets/ on port 8088
2. Use `preview_screenshot` to capture
3. Show user the screenshot

### Step 5 — Iterate

After they see it, ask: *"Looks good? Or what should I change?"*

If they request edits → modify the page JSON → re-render → re-screenshot.

## Files involved

- `clients/{client}/pages/{page}.json` — content
- `clients/{client}/config.json` — brand
- `templates/{template}/template.ejs` — markup
- `templates/{template}/content-schema.json` — required fields
- `scripts/render-page.js` — the renderer (creates if missing)

## Edge cases

- Page file missing → suggest `/new-page`
- Template missing → list available templates
- Render fails → show the EJS error in plain English; ask if they want to debug or fix manually
- Brand colors invalid (not 6-char hex) → flag, offer to fix in client config
