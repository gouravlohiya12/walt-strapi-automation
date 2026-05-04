---
description: Show all clients and their pages
---

# /list-clients

Display every client in the system with a quick summary of their pages.

## The flow

### Step 1 — Read the clients folder

```bash
ls clients/ | grep -v '^_'  # skip the _example
```

For each client folder, read `clients/{slug}/config.json` for the brand info.

### Step 2 — For each client, list their pages

```bash
ls clients/{slug}/pages/*.json 2>/dev/null
```

Parse each page JSON for `keyword` + `status`.

### Step 3 — Format output

```
📂 Clients (3)

🏢 acme — Acme Corp
   Domain: kids.acme.com
   Brand: #1F2833 / #BF4E30
   Pages (4):
     ✅ small-business-tax-software (published)
     ✅ helpdesk-software (published)
     📝 ai-customer-service (draft)
     📝 onboarding-software (draft)

🏢 brandx — BrandX Productivity
   Domain: (none — using vercel default)
   Brand: #2563EB / #F59E0B
   Pages (2):
     ✅ project-management-tool (published)
     📝 team-collaboration-software (draft)

🏢 fitness-co — Fitness Co
   Domain: programs.fitnessco.com
   Brand: #DC2626 / #FBBF24
   Pages (0): (none yet — try `/new-page`)
```

Use status icons:
- ✅ published — has been pushed to GitHub
- 📝 draft — saved locally but not pushed
- 🚧 in-progress — has `[NEEDS INPUT]` placeholders
- ❌ broken — failed last validation

### Step 4 — Suggest next action

```
What would you like to do?
- `/new-page {client}` — add a page for an existing client
- `/new-client` — set up a new brand
- `/preview {client}/{page}` — see a page rendered
- `/publish` — push all drafts live
```

## Edge cases

- No clients yet → suggest `/new-client` to create the first one
- A client folder exists but config.json is missing/broken → flag as broken, offer to fix
- A page JSON is malformed → flag in the list with ❌
