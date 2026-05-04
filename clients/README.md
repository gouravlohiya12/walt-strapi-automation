# `clients/` — One folder per client/brand

Each client (= one brand/business) gets a folder here. The folder contains everything that's unique to that client: brand info, page configs, and assets.

## Folder structure

```
clients/
├── _example/             ← reference structure (DON'T modify or delete)
│   ├── config.json       ← brand info: colors, fonts, logo, domain, default CTA
│   ├── pages/
│   │   └── example-page.json
│   └── assets/
│       ├── logo.svg
│       └── (other client-specific images)
└── {your-client-slug}/   ← created via /new-client
    ├── config.json
    ├── pages/
    └── assets/
```

## Naming convention

- **Folder name** = client slug (lowercase, hyphens, no spaces)
- Examples: `acme`, `fitness-co`, `legal-eagles`, `dr-smith-dental`

## What goes in `config.json`

The brand profile. Things that don't change per page (colors, logo, default CTA, domain, fonts).

Read [_example/config.json](_example/config.json) for the schema and a working example.

## What goes in `pages/`

One JSON file per landing page. Each file has the content (headlines, body, FAQs, etc.) merged with the client's brand at render time.

File name = page slug. So `pages/seo-software-for-lawyers.json` lives at `client-domain.com/seo-software-for-lawyers`.

## What goes in `assets/`

Images, logos, and other files unique to this client. Reference paths in `config.json` are relative to the client folder, so `assets/logo.svg` resolves to `clients/{slug}/assets/logo.svg`.

## Rules

1. **Never modify `_example/`** — it's the reference. The AI uses it to learn the format.
2. **Don't put secrets here.** No API keys, no passwords, no JWT tokens. Those go in `.env`.
3. **Always commit changes.** Every page added or edited should be a separate git commit.
4. **Slug must be unique within a client.** Two pages with the same slug = collision = error.

## Common operations

| What you want | Command |
|---|---|
| Create a new client | `/new-client` |
| Add a page to existing client | `/new-page` |
| List all clients | `/list-clients` |
| Edit a page | tell the AI: "edit {client}/{page}" |
| Delete a page | tell the AI: "delete {client}/{page}" (it'll confirm) |
| Delete a client | tell the AI: "delete {client}" (it'll triple-check) |
