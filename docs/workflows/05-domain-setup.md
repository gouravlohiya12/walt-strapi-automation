# Workflow 05 — Connecting a custom domain

Triggered by: user says "connect my domain", "DNS", "I have a domain", or runs `/new-client` and provides a domain.

The detailed reference is in [docs/knowledge/dns-setup.md](../knowledge/dns-setup.md). This is the step-by-step conversational flow.

## When this runs

- During `/new-client` if they provide a domain
- Standalone, as `/connect-domain {client-slug}`
- After publishing, if they want to upgrade from `*.vercel.app` to a real domain

## The flow

### Step 1 — Confirm the domain

Ask: *"Which domain are we connecting? Full URL like `kids.brandsite.com` or `brandsite.com`?"*

Validate:
- It's a proper domain format (no trailing slash, no protocol)
- They actually own it (just trust them — Vercel will verify)

### Step 2 — Add to Vercel

```bash
source .env
vercel domains add {domain} ai-auto-landing-pages-system \
  --token "$VERCEL_TOKEN" \
  --scope mms-digital-minions-projects
```

Capture the output — it has the DNS record they need to add.

### Step 3 — Format the message for the client

Use the template from [dns-setup.md](../knowledge/dns-setup.md). Fill in:
- Their domain
- The exact CNAME or A record (from Vercel's output)
- The expected final URL

Show this to Walt's user (so they can copy and forward to the actual client).

### Step 4 — Save the domain in the client config

```json
// clients/{slug}/config.json
{
  "domain": "kids.brandsite.com"
}
```

Commit:
```bash
git add clients/{slug}/config.json
git commit -m "Connect domain {domain} to client {slug}"
```

### Step 5 — Wait for client to confirm

Tell user: *"Once {client name} confirms the DNS record is added, let me know — I'll verify and we'll be live."*

### Step 6 — When they confirm, verify

```bash
# Check DNS resolves
dig +short {domain}

# Check Vercel sees it as verified
vercel domains inspect {domain} --token "$VERCEL_TOKEN" --scope mms-digital-minions-projects

# Test the URL
curl -sIo /dev/null -w "%{http_code}\n" https://{domain}
```

All three should show success. If not, walk through troubleshooting in [dns-setup.md](../knowledge/dns-setup.md).

### Step 7 — Wrap up

Tell user:
> "✅ {domain} is live! Your client's pages are now at:
> - https://{domain}/{page-slug-1}
> - https://{domain}/{page-slug-2}
>
> SSL certificate is automatic — no further setup needed."

## Tips

- **Subdomain is easier** than root domain — recommend subdomain when possible
- **Cloudflare proxy** is the #1 cause of "DNS not working" — always tell them to set the record to "DNS only" / gray cloud
- **Patience** — DNS can take 5 min to 24 hr. Don't keep trying to verify every minute. Wait, then check.
- **One domain per client** is the default. Multiple subdomains would mean multiple Vercel projects (not currently set up).
