# Strapi Content Types

The Strapi CMS backend stores landing pages as content. Most of the time you don't need to touch this — pages live as JSON files in `clients/`. But if a client wants visual editing or non-technical team members updating copy, Strapi is the alternative.

## When to use Strapi

| Scenario | Use file-based (default) | Use Strapi |
|----------|:---:|:---:|
| Walt's team manages everything via Claude Code | ✅ | |
| Client wants to edit copy themselves without engineers | | ✅ |
| Quick AI-generated batch (50+ pages) | ✅ | |
| Client has a marketing person who lives in admin panels | | ✅ |
| Pages change frequently | | ✅ |
| Pages are written once and rarely edited | ✅ | |

## The LandingPage content type

Located at `strapi/src/api/landing-page/content-types/landing-page/schema.json`.

Fields:

| Field | Type | Required | Description |
|-------|------|---|---|
| `title` | string | yes | Browser tab title (50-60 chars) |
| `slug` | uid | yes | URL slug, unique |
| `keyword` | string | yes | Target keyword for this page |
| `h1` | string | yes | Hero headline |
| `subheadline` | text | yes | Hero subhead |
| `body_copy` | richtext | yes | Main body section content (HTML) |
| `cta_text` | string | yes | Button text |
| `cta_url` | string | yes | Button destination |
| `meta_description` | string | yes | SEO description (160 char max) |
| `status` | enum | yes | `draft` / `published` |
| `client` | relation | optional | Link to a Client content type (if you add one) |

## Public permissions

Set automatically on first boot via `strapi/src/index.ts`. The bootstrap script:
1. Creates an admin if none exists (uses `ADMIN_BOOTSTRAP_EMAIL` / `ADMIN_BOOTSTRAP_PASSWORD`)
2. Sets `find` + `findOne` permissions for the public role on `landing-page`

This means:
- `GET /api/landing-pages` — public, no auth needed
- `GET /api/landing-pages/:id` — public, no auth needed
- `POST /api/landing-pages` — requires API token

## Strapi admin

URL: `https://strapi-production-442f.up.railway.app/admin`

Default login (created by bootstrap):
- Email: `admin@mediamadesimple.co`
- Password: `Admin123ChangeMe!` (CHANGE THIS on first login)

## Generating an API token

1. Log in to the admin
2. Settings → API Tokens → Create New API Token
3. Type: `Full access` (or scoped if you want)
4. Copy token — it's shown only once
5. Save to `.env` as `STRAPI_API_TOKEN`
6. Set on Vercel via `vercel env add STRAPI_API_TOKEN`

## API operations the AI might need

### List all pages
```bash
curl -s "$STRAPI_URL/api/landing-pages?pagination[pageSize]=100" \
  -H "Authorization: Bearer $STRAPI_API_TOKEN"
```

### Get a page by slug
```bash
curl -s "$STRAPI_URL/api/landing-pages?filters[slug][\$eq]=$SLUG" \
  -H "Authorization: Bearer $STRAPI_API_TOKEN"
```

### Create a page
```bash
curl -X POST "$STRAPI_URL/api/landing-pages" \
  -H "Authorization: Bearer $STRAPI_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data": { "title": "...", "slug": "...", ... }}'
```

### Delete a page (uses documentId, not numeric id)
```bash
curl -X DELETE "$STRAPI_URL/api/landing-pages/$DOCUMENT_ID" \
  -H "Authorization: Bearer $STRAPI_API_TOKEN"
```

## Syncing files ↔ Strapi

If a client switches from file-based to CMS, run:

```bash
node scripts/seed-pages.js --client {client-slug}
```

This reads `clients/{client-slug}/pages/*.json` and pushes them to Strapi.

To sync the other direction (Strapi → files), no script exists yet — would need to be built if/when needed.

## Troubleshooting

### Strapi not booting
Check Railway logs. Usually:
- Postgres connection issue (check `DATABASE_URL` env var)
- Missing required env vars (APP_KEYS, JWT_SECRET, etc.)
- Build cache issue — try redeploying

### Public API returns 403
Bootstrap permissions didn't run. Manually fix:
1. Admin → Settings → Roles → Public
2. Check `landing-page` → `find` + `findOne`
3. Save

### Database is empty after deploy
Postgres volume not mounted, or new project created. Re-run seed scripts.

### "Token invalid" errors
API token expired or rotated. Generate a new one in admin and update env vars in Vercel.
