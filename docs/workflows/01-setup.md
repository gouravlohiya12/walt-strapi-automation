# Workflow 01 — One-time setup (for a new team member)

This is what a new person on Walt's team does the first time they open this project.

## Before they start

They need:
- This GitHub repo cloned locally
- Claude Code installed on their machine
- An Anthropic account (their own)

## Step-by-step (the AI guides them through this)

### 1. Confirm they have access to required tools

Ask:
- *"Do you have Claude Code installed and signed in?"*
- *"Have you cloned the repo to your machine?"* (offer the command if not)
- *"Do you have access to the team's Anthropic account, or your own?"*

### 2. Confirm they have CLI authentications

Run these in their terminal (one at a time):

```bash
# Vercel
vercel whoami
# Should show: mms-digital-minions (or whatever Walt's team name is)

# Railway
railway whoami
# Should show: ai@mediamadesimple.co (or whatever)

# GitHub
gh auth status
# Should show: Logged in to github.com
```

If any fail, walk them through:
- `vercel login` (browser flow)
- `railway login` (browser flow)
- `gh auth login` (browser flow)

### 3. Check the .env file

```bash
ls -la .env
```

If missing, copy from example:
```bash
cp .env.example .env
```

Then ask: *"Do you have these tokens?"*
- `VERCEL_TOKEN` (or skip if using `vercel login`)
- `RAILWAY_TOKEN` (same)
- `GITHUB_TOKEN` (or skip if using `gh auth`)
- `ANTHROPIC_API_KEY` (only needed for the AI page-gen scripts)
- `GOOGLE_SERVICE_ACCOUNT_KEY` (path to JSON file, only for indexing)
- `STRAPI_API_TOKEN` (only if using Strapi CMS mode)

If missing, point them to the right place:
- Vercel: https://vercel.com/account/tokens
- Anthropic: https://console.anthropic.com/settings/keys
- Strapi: log in to admin → Settings → API Tokens

### 4. Verify everything connects

```bash
# Check the live frontend is reachable
curl -sIo /dev/null -w "%{http_code}\n" https://ai-auto-landing-pages-system.vercel.app

# Check Strapi is reachable
curl -sIo /dev/null -w "%{http_code}\n" https://strapi-production-442f.up.railway.app/admin
```

Both should return `200`.

### 5. Show them what's already in the project

Run `/list-clients` and walk them through the existing state.

### 6. Suggest next action

Based on what they want to do:
- *"Want to create a new client?"* → `/new-client`
- *"Want to create a new page for an existing client?"* → `/new-page`
- *"Just exploring? Open `clients/_example/` and `templates/raising-kids/` to see how things are organized."*

### 7. Bookmark the docs

Tell them:
- The full playbook is in `CLAUDE.md` (root of repo)
- Workflow guides are in `docs/workflows/`
- Knowledge base is in `docs/knowledge/`
- They can ask me anything anytime

## When something goes wrong

If a CLI or env var is misconfigured, walk through `docs/knowledge/troubleshooting-common-errors.md`.

If their Anthropic account isn't set up, suggest they finish that first before trying to generate pages.

## End state

After this workflow, the team member should be able to:
- Run any slash command without auth errors
- See the live deployments
- Create their first client + page
