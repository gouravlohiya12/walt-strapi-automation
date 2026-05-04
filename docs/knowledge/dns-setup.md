# DNS Setup — Connecting a Client's Domain

How to point a client's domain (or subdomain) to the Vercel-hosted landing pages.

## When this is needed

- Client wants their pages at `kids.brandsite.com` instead of `*.vercel.app`
- Client wants their own root domain `brandsite.com`
- Client wants different subdomains for different page sets

## The two pieces

1. **Vercel side**: add the domain to the Vercel project (we do this)
2. **DNS side**: client adds a record in their domain registrar (they do this)

## Step 1 — Add the domain to Vercel

```bash
source .env  # for VERCEL_TOKEN
vercel domains add kids.brandsite.com ai-auto-landing-pages-system \
  --token "$VERCEL_TOKEN" \
  --scope mms-digital-minions-projects
```

Vercel will return one of two outputs:

**For a subdomain** (e.g., `kids.brandsite.com`):
```
Add the following CNAME record to kids.brandsite.com:
   CNAME  kids  →  cname.vercel-dns.com
```

**For a root domain** (e.g., `brandsite.com`):
```
Add the following A record to brandsite.com:
   A  @  →  76.76.21.21
```

Save this output — you'll send it to the client.

## Step 2 — Send instructions to the client

Use this template (copy/paste, fill in the brackets):

> **Subject: Action needed — connect your domain**
>
> Hi {client name},
>
> To go live, please add **one DNS record** in your domain registrar (where you bought {domain}). Takes ~2 minutes.
>
> ### Steps
>
> 1. Log into your domain registrar (GoDaddy, Namecheap, Cloudflare, Google Domains, etc.)
> 2. Find DNS settings for **{domain}**
> 3. Add this record:
>
>    | Field | Value |
>    |-------|-------|
>    | Type | `{CNAME or A}` |
>    | Name / Host | `{kids or @}` |
>    | Value / Target | `{cname.vercel-dns.com or 76.76.21.21}` |
>    | TTL | Auto / 3600 |
>
> 4. Save.
>
> 5. Reply to confirm. DNS usually propagates in 5-30 min (sometimes up to 24 hrs). Once live, your pages will be at:
>    `https://{full-subdomain}`
>
> ### Notes
> - You will NOT lose your main website — this only affects this subdomain
> - Don't delete existing records, only ADD this one
> - SSL/HTTPS is automatic — Vercel provisions a cert within minutes after DNS resolves

## Step 3 — Wait + verify

Once they confirm DNS is set, verify:

```bash
# Check DNS resolution
dig +short {subdomain.client-domain.com}
# Expected: cname.vercel-dns.com or the A record IP

# Check Vercel sees it as verified
vercel domains inspect {subdomain.client-domain.com} \
  --token "$VERCEL_TOKEN" \
  --scope mms-digital-minions-projects
```

When Vercel shows `verified: true`, test in browser:
```bash
curl -sIo /dev/null -w "%{http_code}\n" https://{subdomain.client-domain.com}
```

Expected 200. SSL cert auto-provisions within ~5 min after verification.

## Step 4 — Update client config

Save the domain to their config:
```json
{
  "domain": "kids.brandsite.com"
}
```

Now when the AI generates new pages for this client, URLs use this domain in canonical tags + sitemap.

## Common DNS provider quirks

### Cloudflare
- **Important**: set the record to `DNS only` (gray cloud), NOT `Proxied` (orange cloud). Vercel won't verify if proxied.
- After save, takes ~30 sec to propagate.

### GoDaddy
- The "Host" field for a subdomain takes only the prefix (`kids`), not the full domain.
- They use TXT verification sometimes — follow Vercel's prompts.

### Namecheap
- Use the "Advanced DNS" tab.
- TTL: pick "Automatic" (5 min default).

### Google Domains / Squarespace
- Now Squarespace Domains. Use "Custom records" section.
- "Type" must be selected from dropdown (CNAME or A).

### Route 53 (AWS)
- Pick "Quick create" mode.
- Routing policy: Simple.

## Multiple subdomains for one client

If a client wants multiple landing page paths under different subdomains:
- `course.brand.com` → page A
- `app.brand.com` → page B

This is supported. Add each subdomain to Vercel as a separate domain, and configure path-based routing in the frontend if needed (or use one Vercel project per subdomain).

For our default setup, **stick with one subdomain per client** — pages live under paths (e.g., `kids.brand.com/topic-1`, `kids.brand.com/topic-2`). Cleaner.

## When the client doesn't have a domain yet

Two options:
1. **Use Vercel's default** — `ai-auto-landing-pages-system.vercel.app/{slug}` works fine, just less branded
2. **Buy a cheap one** — Namecheap, $10/year. Most modern brands need a domain anyway.

Don't pressure. Some clients are OK with the default URL forever.

## Troubleshooting

### "DNS not detected" after 24 hours
- Did they add the record but at the wrong level (e.g., on their parent domain instead of subdomain)?
- Cloudflare proxy on? (Set to DNS only.)
- Multiple conflicting records? (Old A records pointing elsewhere.)

### "SSL pending" forever
- DNS is verified but cert isn't issuing. Usually a CAA record blocking Let's Encrypt.
- Run `dig +short CAA {domain}` — if it returns rules, they need to allow `letsencrypt.org` and `pki.goog`.

### "Domain already in use"
- Another Vercel account has it. Check who. Sometimes a previous agency claimed it.
- Have client run through Vercel's domain transfer flow.
