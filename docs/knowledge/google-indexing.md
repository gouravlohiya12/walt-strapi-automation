# Google Indexing — How to Get Pages Discovered Fast

After publishing, you have two ways to get Google to index pages:

1. **Wait** — Google crawls naturally over weeks/months
2. **Submit** — use the Indexing API (per URL) + sitemap submission (one-time per site)

This system uses both, automated.

## The two scripts

### `scripts/submit-sitemap.js`
- Submits `https://your-frontend.vercel.app/sitemap.xml` to Google Search Console
- Run once per client/domain (or after the first batch of pages goes live)
- Daily limit: 500 sitemaps/day — way more than you'll ever hit

### `scripts/request-indexing.js`
- Calls Google's Indexing API per URL (one HTTP request per page)
- Run after publishing new pages to "ping" Google
- **Daily limit: 200 URLs/day per project** (hard quota)
- Pages submitted this way are usually crawled within 24-48 hours

## When to run each

| Scenario | Run |
|----------|-----|
| First publish for a domain | `submit-sitemap` once |
| New batch of 5-50 pages | `request-indexing` after publish |
| Monthly maintenance | both, on the 1st of each month |
| Domain change | `submit-sitemap` again with new domain |

## Required setup

### Google Cloud project
1. Create at https://console.cloud.google.com
2. Enable two APIs: "Web Search Indexing API" + "Search Console API"
3. Create a Service Account
4. Download the JSON key file
5. Save to `.brand-assets/google-key.json` (gitignored)
6. Add `GOOGLE_SERVICE_ACCOUNT_KEY=.brand-assets/google-key.json` to `.env`

### Google Search Console
1. Add the domain at https://search.google.com/search-console
2. Verify ownership (DNS TXT record OR HTML meta tag)
3. Settings → Users and permissions → Add User → enter the service account email
4. Set role: **Owner**

Now the API can submit URLs on behalf of the verified site.

## Quotas (memorize)

| API | Daily limit | Per-second |
|-----|---|---|
| Indexing API | 200 URLs | 1 req/sec |
| Search Console | 1200 sitemap submits | unlimited |

If hitting the 200/day limit, the AI should:
1. Tell the user how many remain
2. Suggest spreading submissions across days
3. Save remaining pages to a queue (`scripts/indexing-queue.json`) and submit tomorrow

## Common errors

### `403 Forbidden` on indexing API
- Service account isn't an Owner in Search Console for that domain
- Fix: re-add as Owner in Search Console settings

### `404 Not Found` on sitemap submit
- The sitemap URL didn't actually exist when Google crawled it
- Verify by visiting the sitemap URL in browser first

### `"Quota exceeded"` on indexing API
- Hit the 200/day limit
- Wait until tomorrow, or split into smaller batches

### `Google never indexes` despite submission
- Page might be blocked (`robots.txt`, `<meta name="robots" content="noindex">`)
- Check the rendered HTML for these
- Page might have thin content (Google flagged as low quality)
- Page might be duplicate (Google has a similar page already indexed)

## What success looks like

After running `request-indexing`:
- Within 1-3 days: Search Console shows pages as "Crawled - indexed"
- Within 7-14 days: pages start appearing in search for their target keyword
- Within 30-60 days: pages reach their stable ranking position

If a page hasn't been indexed in 7 days, the AI should suggest:
1. Re-running `request-indexing` for that specific URL
2. Checking content for thin content / duplicates
3. Verifying canonical tag is correct (not pointing elsewhere)
4. Manually requesting indexing in Search Console UI (sometimes works when API doesn't)

## Don't over-submit

Each URL counts once per day. Submitting the same URL repeatedly:
- Won't speed up indexing
- Won't hurt rankings
- Just wastes quota

Submit once per significant content update, not after every minor edit.
