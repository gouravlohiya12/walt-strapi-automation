---
description: Push committed pages to GitHub, which auto-deploys to Vercel
---

# /publish

Pushes everything to GitHub. Vercel watches the repo and auto-deploys to production.

## Usage

- `/publish` → push everything not yet pushed
- `/publish acme/small-business-tax-software` → if they want to verify a specific page lands

## The flow

### Step 1 — Pre-flight checks

Run these checks. If any fail, STOP and report:

1. **Git is clean of uncommitted changes**
   ```bash
   git status --short
   ```
   If output is non-empty → ask: *"You have uncommitted changes. Want me to commit them now (with what message)? Or skip them?"*

2. **All pages are valid**
   For each `clients/*/pages/*.json`:
   - Required content fields present (per template's content-schema.json)
   - No `[NEEDS INPUT]` placeholders
   - Slug doesn't collide with another page on the same client

3. **Local + remote are in sync**
   ```bash
   git fetch
   git status -uno
   ```
   If behind remote → suggest `git pull` first.

### Step 2 — Confirm with the user

Show what's about to deploy:
```
About to publish to https://ai-auto-landing-pages-system.vercel.app:

Client: acme
  + small-business-tax-software (NEW)
  ~ helpdesk-software (UPDATED)

Client: brandX
  + onboarding-software (NEW)

3 pages total. Proceed? [yes/no]
```

### Step 3 — Push

```bash
git push origin main
```

### Step 4 — Watch the deploy

Vercel takes ~30-90 seconds for the frontend deploy. Monitor:

```bash
source .env  # or read VERCEL_TOKEN
vercel ls ai-auto-landing-pages-system --token "$VERCEL_TOKEN" --scope mms-digital-minions-projects
```

Wait for newest deployment to flip from `● Building` → `● Ready`. Poll every 15 seconds, max 5 minutes.

### Step 5 — Verify each new page is live

For each page in the deploy:
```bash
curl -sIo /dev/null -w "%{http_code}" https://ai-auto-landing-pages-system.vercel.app/{slug}
```

Expect 200 for each.

If any fail (4xx/5xx), check the Vercel logs:
```bash
vercel inspect {deployment-url} --logs --token "$VERCEL_TOKEN" --scope mms-digital-minions-projects
```

### Step 6 — Optional: SEO submission

Ask: *"Want me to submit these to Google for indexing? (Helps them show up in search faster.)"*

If yes:
```bash
node scripts/submit-sitemap.js
node scripts/request-indexing.js  # auto-uses the latest pages
```

Note: requires `GOOGLE_SERVICE_ACCOUNT_KEY` env var. Skip if not set.

### Step 7 — Wrap up

Reply with the live URLs:
```
✅ Published! Live URLs:
- https://ai-auto-landing-pages-system.vercel.app/small-business-tax-software
- https://ai-auto-landing-pages-system.vercel.app/onboarding-software

If you have a custom domain set up, those URLs will also work at:
- https://kids.acme.com/small-business-tax-software (etc.)

Submitted to Google for indexing — first impressions usually within 48 hours.
```

## Edge cases

- Push fails (rejected non-fast-forward) → run `git pull --rebase`, retry
- Vercel deploy fails → fetch build logs, summarize the error in plain English
- 404 on a new page → it might be the route handler (check `frontend/server.js` has a route for the slug, or that the page is in Strapi if using CMS mode)
- Indexing API quota exceeded (200/day) → tell them, suggest spreading submissions across days

## What NOT to do

- Don't push if pre-flight checks fail
- Don't `--force` push without explicit user permission
- Don't skip the wait + verify step (need to confirm pages are actually live, not just deployed)
