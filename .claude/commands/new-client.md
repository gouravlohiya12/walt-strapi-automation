---
description: Walks the user through creating a new client (brand profile)
---

# /new-client

A client is a brand/business that gets one or more landing pages. This command sets up their folder + config so future pages inherit their brand.

## Your job

Interview the user one question at a time. Suggest defaults. Save to `clients/{slug}/config.json`.

## The flow (ask in this order — one at a time)

### Step 1 — Brand name
Ask: *"What's the brand name?"*

Slugify it for the folder name (lowercase, hyphens). Show the slug back: *"I'll save this under `clients/{slug}/`. OK?"*

If a folder with that slug already exists, warn them — pick a different one or update the existing.

### Step 2 — Business type + audience
Ask: *"What does this brand do, and who's the target audience? (e.g., 'AI tax-prep software for small business owners' or 'fitness coaching for new moms')"*

This informs copy tone + design suggestions. Save as `business_type` + `audience` in the config.

### Step 3 — Default CTA URL
Ask: *"Where should the 'Buy Now' / 'Get Started' buttons link to? (a checkout URL, signup form, Stripe link, Calendly, etc.)"*

Save as `default_cta_url`.

### Step 4 — Brand colors
Ask: *"What are the brand colors? You can give me hex codes, or describe the vibe and I'll suggest some."*

If they describe vibes, use [docs/knowledge/brand-design-tokens.md](../../docs/knowledge/brand-design-tokens.md) to pick colors. Confirm with: *"How about these — primary `#XXX`, accent `#YYY`, neutral `#ZZZ`? Or change them?"*

Save as `colors: { primary, accent, neutral, background, text }`.

### Step 5 — Logo
Ask: *"Do you have a logo file? Drop it in the chat or give me a URL/path. If not, we can use a text logo with the brand name."*

If they provide a file path, copy it to `clients/{slug}/assets/logo.{ext}` and reference it in config as `logo: "assets/logo.svg"`.

If no logo, set `logo: null` (template will fall back to text).

### Step 6 — Fonts
Ask: *"Any specific fonts you want? Or I can pick what fits the vibe."*

Defaults based on business type:
- SaaS / tech → `Inter` (heading + body)
- Course / education → `Poppins` (heading) + `Source Sans Pro` (body)
- Law / finance → `Playfair Display` (heading) + `Lato` (body)
- Fitness / lifestyle → `Montserrat` (heading) + `Open Sans` (body)

Save as `fonts: { heading, body }`.

### Step 7 — Domain (optional)
Ask: *"Do you have a custom domain ready, or skip for now? (e.g., `kids.brandsite.com`)"*

If they say yes:
- Save as `domain` in config
- Trigger workflow E (domain setup) at the end

If skip → set `domain: null`.

### Step 8 — Confirm + write config

Show the full config you're about to write. Ask: *"Look right? Type 'yes' to save, or tell me what to change."*

On yes:
1. Create `clients/{slug}/config.json`
2. Create `clients/{slug}/pages/` (empty)
3. Create `clients/{slug}/assets/` (empty unless logo provided)
4. Add a `clients/{slug}/README.md` summarizing the client

### Step 9 — Commit

Run:
```
git add clients/{slug}/
git commit -m "Add new client: {Brand Name}"
```

### Step 10 — Wrap up

Reply: *"✅ Done! `{Brand Name}` is set up. You can now run `/new-page` to create their first landing page. Want to do that now?"*

If they said yes to a domain in step 7, also offer: *"You also said you have a domain. Want me to walk you through connecting it now? (Or do `/connect-domain` later.)"*

## Config file format (`clients/{slug}/config.json`)

```json
{
  "slug": "acme",
  "name": "Acme Corp",
  "business_type": "AI tax-prep software for small business owners",
  "audience": "Small business owners doing their own taxes",
  "default_cta_url": "https://acme.com/checkout",
  "colors": {
    "primary": "#1F2833",
    "accent": "#BF4E30",
    "neutral": "#E9D985",
    "background": "#FFFFFF",
    "text": "#1F2833"
  },
  "fonts": {
    "heading": "Poppins",
    "body": "Source Sans Pro"
  },
  "logo": "assets/logo.svg",
  "domain": "kids.acme.com",
  "created_at": "2026-05-01"
}
```

## Edge cases to handle

- Slug collision → ask for a different slug or offer to update existing
- Bad hex colors → validate they're 6-char hex; offer to fix
- Logo file too large → warn if > 1MB, offer to use online URL instead
- Domain already in use on another client → flag it, ask which client should "own" it
