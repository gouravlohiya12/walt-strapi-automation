# Workflow 02 — Creating a new client

Triggered by: `/new-client` command, or natural language ("I want to add a new client").

This workflow already lives in [.claude/commands/new-client.md](../../.claude/commands/new-client.md). Read that for the conversational script.

## What this workflow does

Sets up a new client folder under `clients/{slug}/` with their brand info, so future pages can inherit the brand automatically.

## What gets created

```
clients/{slug}/
├── config.json          # brand info: name, colors, fonts, domain, default CTA
├── pages/               # empty — pages added later via /new-page
└── assets/              # logo, hero image, etc.
```

## Things to remember

1. **Slug matters** — it's used in URLs and folder paths. Pick something that won't change.
2. **Always commit at the end** — the new folder isn't useful until it's in git.
3. **The Vercel project is already deployed** — adding a client doesn't trigger a new deploy until pages are created.
4. **Domain is optional** — you can add a client without one and connect later.

## After completion

Suggest:
- `/new-page` to create their first page
- `/connect-domain {slug}` if they want to wire up DNS now

## Common questions during this flow

- *"Can I have multiple brands under one client?"* → No. One client = one brand. Make a new client folder for a different brand.
- *"Can I change the slug later?"* → Yes, but you'd need to update all references. Easier to pick well now.
- *"What if I don't have a logo yet?"* → Set `logo: null`. The template falls back to text logo with the brand name.
- *"Can I use the same colors/fonts as another client?"* → Yes, copy from their `config.json`.

## Edge cases

- **Slug collision**: another client folder already exists with the slug. Ask for different one.
- **Logo file path**: if the user gives a path that doesn't exist, ask them to drop the file in the chat or provide a URL.
- **Hex color validation**: must be `#RRGGBB` (6-char). Reject `#RGB` or named colors like "red".
- **Domain conflict**: same domain used by another client. Flag and ask which should "own" it.
