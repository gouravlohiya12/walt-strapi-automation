---
description: Check current Vercel + Railway + GitHub deployment status
---

# /deploy-status

Quick health check across all deployed services. Use when something seems broken, or before/after a publish.

## The flow

Run these checks (parallel where possible) and report cleanly.

### Check 1 — Frontend (Vercel)

```bash
source .env  # for VERCEL_TOKEN
vercel ls ai-auto-landing-pages-system --token "$VERCEL_TOKEN" --scope mms-digital-minions-projects 2>&1 | head -5
```

Get latest deployment status. Test the live URL:
```bash
curl -sIo /dev/null -w "%{http_code}" https://ai-auto-landing-pages-system.vercel.app
```

### Check 2 — Strapi (Railway)

```bash
curl -sIo /dev/null -w "%{http_code}" https://strapi-production-442f.up.railway.app/admin
curl -sIo /dev/null -w "%{http_code}" https://strapi-production-442f.up.railway.app/api/landing-pages
```

Optionally check Railway service status via GraphQL (only if needed for diagnostics):
```bash
curl -X POST "https://backboard.railway.com/graphql/v2" \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"query { project(id: \"9b2bb4bc-e2f9-412a-9194-f1b24aeae7ca\") { services { edges { node { name deployments(first: 1) { edges { node { status } } } } } } } }"}'
```

### Check 3 — GitHub repo

```bash
curl -sH "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/repos/mms-digital-minions/ai-auto-landing-pages-system/commits?per_page=1 \
  | python3 -c "import sys,json; d=json.load(sys.stdin)[0]; print(f\"Latest commit: {d['sha'][:7]} - {d['commit']['message'].splitlines()[0]}\")"
```

### Check 4 — Local git status

```bash
cd /Users/gouravlohiya/claude\ code/ai-auto-landing-pages-system
git status --short
git log --oneline @{u}..HEAD  # commits ahead of remote
```

## Format the output

```
🚀 Deploy Status

✅ Frontend (Vercel)
   Status: Ready
   Latest: 10m ago
   URL: https://ai-auto-landing-pages-system.vercel.app (HTTP 200)

✅ Strapi (Railway)
   Admin: https://strapi-production-442f.up.railway.app/admin (HTTP 200)
   API:   https://strapi-production-442f.up.railway.app/api/landing-pages (HTTP 200)

✅ GitHub
   Latest: 8dac1c9 - "Add page: acme/small-business-tax-software"

⚠️ Local
   2 uncommitted changes:
     M clients/acme/pages/helpdesk-software.json
     ? clients/acme/pages/new-draft.json

   1 commit ahead of remote (not yet pushed)
```

Use ✅ for green, ⚠️ for warnings, ❌ for actually broken.

## Edge cases

- If a service is down (5xx response) → show what could cause it (likely Railway sleeping, Vercel build failed, etc.)
- If GitHub is unreachable → just show local git state
- If env vars missing → say which one and where to add it (locally in `.env` or in Vercel/Railway settings)
