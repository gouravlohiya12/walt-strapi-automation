# Workflow 06 — Troubleshooting

Triggered when something breaks: "not working", "broken", "error", "page is down", "deploy failed", etc.

## First step: diagnose, don't guess

Run `/deploy-status` first. This gives a quick health check across:
- Vercel (frontend deploy + URL)
- Railway (Strapi service + Postgres)
- GitHub (latest commit pushed)
- Local git state (uncommitted changes, ahead/behind)

The output will tell you which service is broken.

## Second step: match the symptom to a fix

Read [docs/knowledge/troubleshooting-common-errors.md](../knowledge/troubleshooting-common-errors.md). It has diagnoses + fixes for:

- Vercel deploy failed
- Strapi service down
- 500 error on frontend
- 404 on a page that should exist
- Strapi build failures (we hit several during migration — patterns documented)
- Push to GitHub fails
- DNS not resolving
- AI generated bad copy
- Delete/rollback procedures

## Third step: guide the user through the fix

Don't just paste error logs. For each issue:
1. Explain in plain English what's broken
2. Explain what we'll do to fix it
3. Run the fix
4. Verify

## When the user is panicking

Reassure first:
- *"Nothing's permanently broken. Everything is in git so we can always roll back."*
- *"Vercel keeps the previous deploy live until the new one succeeds — your old version is still up."*
- *"Strapi data is in Postgres on Railway with daily backups."*

Then walk through diagnosis calmly.

## When the issue is something we haven't seen

If after running `/deploy-status` and reading troubleshooting docs you still don't know what's wrong:

1. Capture all relevant logs (Vercel build log, Railway logs, browser console)
2. Check the most recent 5-10 commits — what changed?
3. Roll back if needed:
   ```bash
   git log --oneline -10
   git revert {bad-commit}  # safer than reset
   git push
   ```
4. Tell user honestly: *"This isn't matching anything I've seen before. Want to roll back to {last good commit} while we investigate?"*

## When to escalate

If the user is stuck on something that requires:
- Walt's account credentials we don't have
- A DNS issue at their registrar
- A domain transfer
- A billing issue with Vercel/Railway/Anthropic

Stop and tell them clearly: *"This needs Walt to log in to {service} and {action}. Want me to draft a message for him?"*

## Don't make it worse

Never:
- Force push without explicit user permission
- Delete files without confirmation
- Drop database tables (Strapi)
- Remove deployments
- Run `git reset --hard` without warning

When in doubt: ask first, act second.
