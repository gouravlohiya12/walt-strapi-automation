# Troubleshooting Common Errors

When something breaks, walk through these in order. Don't guess — diagnose with the matching commands.

## "The Vercel deploy failed"

### Diagnose
```bash
source .env
vercel ls ai-auto-landing-pages-system --token "$VERCEL_TOKEN" --scope mms-digital-minions-projects
# Find the failed deployment URL, then:
vercel inspect <deployment-url> --logs --token "$VERCEL_TOKEN" --scope mms-digital-minions-projects
```

### Common causes
1. **Missing env var** — log says `process.env.X is undefined`. Add via `vercel env add X production`.
2. **Build error** — TypeScript or syntax issue. Check the most recent commit for what changed.
3. **Module not found** — package missing from `package.json` or `node_modules` excluded from upload.
4. **Out of memory** — rare; Vercel build runs at 1GB. Optimize bundle size.

## "The Strapi service is down"

### Diagnose
```bash
curl -sIo /dev/null -w "%{http_code}\n" https://strapi-production-442f.up.railway.app/admin
```

If 502/503/504 → service is down, check Railway:
```bash
source .env
RAILWAY_API_TOKEN="$RAILWAY_TOKEN" railway logs --tail 50
```

### Common causes
1. **Postgres disconnected** — check `DATABASE_URL` env var still points to internal Postgres
2. **Build cache corrupted** — trigger a fresh deploy:
   ```bash
   cd strapi && railway up --detach
   ```
3. **Out of memory** — Strapi can OOM on the free tier. Upgrade Railway plan.
4. **App keys rotated** — JWT/admin tokens invalid; regenerate APP_KEYS

## "I get a 500 error on the frontend"

### Diagnose
```bash
curl -s https://ai-auto-landing-pages-system.vercel.app/{slug} | head -50
```

If it's an Express error page:
- `STRAPI_URL` is wrong (check Vercel env vars)
- `STRAPI_API_TOKEN` is invalid (regenerate in Strapi admin, update Vercel)
- The page slug doesn't exist in either files OR Strapi

## "I get 404 on a page that should exist"

### Diagnose
1. Did the deploy actually go through?
   ```bash
   vercel ls ai-auto-landing-pages-system --token "$VERCEL_TOKEN" --scope mms-digital-minions-projects
   ```
2. Is the page registered in `frontend/server.js` routes?
   ```bash
   grep "{slug}" frontend/server.js
   ```
3. Does the page JSON exist?
   ```bash
   ls clients/{client}/pages/{slug}.json
   ```

### Fix
- If JSON exists but route doesn't → the dynamic `/:slug` handler should pick it up. Check `frontend/server.js`.
- If using Strapi — confirm the page exists in the CMS:
  ```bash
  curl "$STRAPI_URL/api/landing-pages?filters[slug][\$eq]={slug}"
  ```

## "Strapi build keeps failing on Railway"

We hit this multiple times during migration. The pattern:

### Symptom A — `useGetAIFeatureConfigQuery is not exported`
Cause: `@strapi/content-manager` resolved to a newer version than `@strapi/admin`.

Fix: ensure `package.json` has `overrides` block pinning all `@strapi/*` packages to the same version (e.g., `5.40.0`).

### Symptom B — `Failed to load native binding` (@swc/core)
Cause: `package-lock.json` was generated on macOS, locking the darwin-arm64 binary.

Fix: delete `package-lock.json`, ensure `Dockerfile` uses `npm install --no-package-lock` (not `npm ci`). Lockfile-free install lets npm pick the right platform binary.

### Symptom C — Memory issues during admin build
Cause: Strapi admin build is heavy.

Fix: increase Railway memory. Or skip admin in production (advanced, requires custom Dockerfile).

## "Can't push to GitHub"

### Diagnose
```bash
git push 2>&1
```

### Common causes
1. **Auth failed** — token expired or revoked. Regenerate from GitHub settings, update `.env`.
2. **Behind remote** — someone (or the AI in another session) pushed. Run `git pull --rebase`.
3. **Detached HEAD** — accidentally checked out a commit. `git checkout main` first.

## "DNS isn't resolving"

### Diagnose
```bash
dig +short {subdomain.client-domain.com}
```

If empty → DNS record not set or not propagated yet.

### Common causes
1. **Cloudflare proxy on (orange cloud)** — must be DNS only (gray cloud)
2. **CNAME pointed wrong** — must be `cname.vercel-dns.com` exactly
3. **Wrong subdomain level** — record was added to `brand.com` but they wanted `kids.brand.com`
4. **Propagation delay** — wait up to 24 hrs

See [dns-setup.md](dns-setup.md) for full troubleshooting.

## "AI generated bad/generic copy"

If the AI's first draft is generic or off-tone:

1. **Be more specific in input** — "fitness coaching" is vague; "fitness coaching for new moms in their 30s" is concrete.
2. **Provide an example** — "tone like Bryan Harris" or "voice like ConvertKit's blog"
3. **Iterate on one section at a time** — re-prompt for just the H1 with new direction
4. **Check the prompt patterns** in [ai-copywriting-prompts.md](ai-copywriting-prompts.md) — apply them mentally before generating

## "How do I delete a page / client / deploy?"

### Delete a page
```bash
rm clients/{client}/pages/{slug}.json
git add -A
git commit -m "Remove page: {client}/{slug}"
git push
```

The page will 404 once Vercel redeploys. If using Strapi, also delete from CMS.

### Delete a client (DESTRUCTIVE)
**ASK THE USER FIRST.** Confirm they really want to.

```bash
rm -rf clients/{client}/
git add -A
git commit -m "Remove client: {client}"
git push
```

### Roll back a deploy
```bash
# Find the previous deployment URL
vercel ls ai-auto-landing-pages-system --token "$VERCEL_TOKEN" --scope mms-digital-minions-projects
# Promote it back to production
vercel promote <previous-deployment-url> --token "$VERCEL_TOKEN" --scope mms-digital-minions-projects
```

## When you're stuck

If none of the above match:
1. Run `/deploy-status` for a full health check
2. Check the most recent commits for what changed (`git log -10 --oneline`)
3. Roll back to the last known-good commit if needed
4. Ask the user — they often have context (was a domain expiring? did they edit env vars?)

Don't guess-and-check destructively. When in doubt, ask.
