# `templates/` — Master designs (reusable across clients)

Templates are the design + section structure of a landing page. They're brand-agnostic — colors, fonts, and content come from the client + page configs at render time.

## Folder structure

```
templates/
└── {template-name}/
    ├── manifest.json         ← what sections this template has, when to use it
    ├── content-schema.json   ← what fields the AI must fill per page
    ├── template.ejs          ← the HTML/CSS markup with placeholders
    └── assets/               ← default images (logo, hero, icons)
```

## What's currently available

### `raising-kids/` (v1.0.0)

**Best for**: courses, coaching programs, membership offers, digital products with high-trust requirement.

**Sections**: header, hero with diagonal cut, gold-standard authority section, "X is a Myth" 3-column, green intro banner, course intro 2-column with devices image, numbered roadmap (8-10 items), Meet Your Guides 2-column, Guest Experts row with yellow overlay, contained green pricing card, FAQ accordion, final CTA "Your Silence Is" style, dark navy footer.

**Reference page**: `clients/_example/pages/example-page.json` shows the full content structure.

## How rendering works

1. AI loads `clients/{client}/config.json` for brand tokens
2. AI loads `clients/{client}/pages/{page}.json` for content
3. AI loads `templates/{template}/template.ejs` for markup
4. EJS merges them (via `scripts/render-page.js`)
5. Output is HTML/CSS

## Adding a new template (future work)

If a future page type needs a different design, create a sibling folder:

```
templates/
├── raising-kids/         ← course-style (existing)
├── saas-landing/         ← SaaS-style (future)
└── ebook-funnel/         ← lead-magnet (future)
```

Each new template needs the same 4 files: `manifest.json`, `content-schema.json`, `template.ejs`, and an `assets/` folder.

When generating a page, the AI lets the user pick which template to use (defaults to first one).

## Rules

1. **Never edit `template.ejs` to change brand colors / fonts directly.** Those come from the client config. If you need to change brand handling, edit the EJS to read from a different field.
2. **Templates should be content-agnostic.** No hardcoded copy in the EJS. Everything that the user might want to change should be a placeholder.
3. **Keep `default_assets/`** for images that have no client-provided override (e.g., generic icons). Specific assets (hero photo, instructor photo) come from the client.
4. **Version your templates.** When you make breaking changes to a template, bump the `version` in manifest.json.

## Schema rules

The `content-schema.json` is the contract between the AI and the template. If you add a new field to the template:
1. Add it to `content-schema.json` with type, required, max_words, guidance
2. Update `clients/_example/pages/example-page.json` to show the field filled in
3. Update [docs/knowledge/ai-copywriting-prompts.md](../docs/knowledge/ai-copywriting-prompts.md) with prompt patterns for it
