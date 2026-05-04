# Workflow 04 — Publishing pages

Triggered by: `/publish` command, or natural language ("ship it", "go live", "publish").

Full conversational script in [.claude/commands/publish.md](../../.claude/commands/publish.md).

## What "publishing" means here

Push committed page changes to GitHub `main` branch. Vercel watches the repo and auto-deploys.

That's it. No manual deploy step. The git push IS the publish.

## Pre-flight checks (always run BEFORE pushing)

1. `git status --short` is empty (or commit anything outstanding)
2. All pages have valid content (no `[NEEDS INPUT]` placeholders)
3. Local main is in sync with remote (no rebase needed)
4. The user has confirmed which pages they want live

If any check fails → STOP, report, and ask what to do.

## After pushing

1. **Wait for Vercel build** — usually 30-90 sec
2. **Verify each new page** with `curl -sIo /dev/null -w "%{http_code}"`
3. **Optionally submit to Google** for indexing (asks user first)

## Custom domain consideration

If the client has a custom domain set up (`config.json` has `domain` field), include both URLs in the success message:
- Vercel default: `https://ai-auto-landing-pages-system.vercel.app/{slug}`
- Client domain: `https://{client.domain}/{slug}`

Both should work; Vercel handles routing automatically.

## Rolling back

If something looks wrong after deploy:

```bash
# Find the previous good deployment URL from vercel ls
vercel promote {previous-deployment-url} --token "$VERCEL_TOKEN" --scope mms-digital-minions-projects
```

This swaps production back without changing the GitHub repo. Then fix the issue locally and re-publish.

## Common issues

- **"Vercel deploy stuck building"** — refresh, give it 2 min. If still stuck, check logs.
- **"Page returns 404 after deploy"** — check the route handler in `frontend/server.js`. Slug must be findable.
- **"Old content showing"** — Vercel CDN cache. Hard-refresh (Cmd+Shift+R) or wait 5 min.
- **"Sitemap doesn't include new page"** — the sitemap pulls from Strapi if using CMS, or from page files if not. Check the sitemap route in `server.js`.

## Don't auto-submit to Google

Always ASK before running indexing. Reasons:
- Quota is limited (200/day across the project)
- Sometimes the user is "publishing for staging only" and doesn't want it indexed yet
- If domain DNS isn't set, the indexing call will succeed but the URL Google sees will be the Vercel default

## After successful publish

Tell the user:
- The live URL(s)
- Whether you submitted to Google or skipped
- Suggest next action (`/new-page` for another, or wrap up)

Optionally update the page's `status` from `draft` → `published` and re-commit.
