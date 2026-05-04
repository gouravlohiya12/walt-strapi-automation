# Slash commands

Each `.md` file in this folder defines a custom command available in Claude Code. The team types `/{name}` and the AI follows the script in the matching file.

## Available commands

| Command | Purpose | File |
|---------|---|---|
| `/new-client` | Set up a new client (brand profile) | [new-client.md](new-client.md) |
| `/new-page` | Create a new landing page for an existing client | [new-page.md](new-page.md) |
| `/preview` | Render a page locally and show a screenshot | [preview.md](preview.md) |
| `/publish` | Push committed pages to GitHub → auto-deploy via Vercel | [publish.md](publish.md) |
| `/list-clients` | Show all clients + their pages | [list-clients.md](list-clients.md) |
| `/deploy-status` | Check Vercel + Railway + GitHub health | [deploy-status.md](deploy-status.md) |

## How to add a new command

1. Create a new `.md` file in this folder (kebab-case name)
2. Add front-matter with a description:
   ```
   ---
   description: One-line summary of what the command does
   ---
   ```
3. Write the conversational script the AI should follow:
   - What to ask the user
   - In what order
   - With what defaults
   - How to validate input
   - What files to create/modify
   - When to commit

Example skeleton:
```markdown
---
description: My new command
---

# /my-command

What this does in plain English.

## The flow

### Step 1 — ...
### Step 2 — ...

## Edge cases

- ...
```

4. Update this README + the command list in `CLAUDE.md`.

## Best practices

- **One command, one job.** Don't combine "new-client + new-page" into one command. Chain them via suggestions.
- **Always confirm before destructive actions.** Show what will be deleted; require "yes" or equivalent.
- **Commit after every step.** Each meaningful action = a git commit.
- **Plain English everywhere.** Walt's team is non-technical. No jargon, no command output unless they ask.
- **Suggest the next step.** End every flow with "want to do X next?"
