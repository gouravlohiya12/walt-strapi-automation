# Programmatic Landing Page Pipeline — Project Plan
### Client: Walt | Brand: NovaDash (POC)

---

## What We're Building

An automated system that generates hundreds of unique landing pages from a single template. Each page targets a specific keyword with AI-generated copy, is stored in a CMS, and auto-submitted to Google for indexing.

**One template → Unlimited keyword-targeted pages → Auto-indexed on Google**

---

## Deliverables

### 1. Strapi CMS (Content Backend)
- Self-hosted, open-source CMS storing all landing page content
- Each page entry has: title, slug, keyword, headline, subheadline, body copy, CTA, meta description
- REST API for reading/writing pages programmatically
- Scales to 100,000+ pages at near-zero cost

### 2. Master Landing Page Template
- Clean, high-converting page layout (NovaDash branding)
- Hero section, body copy, CTA — all dynamically pulled from CMS
- SEO-optimized: meta tags, canonical URLs, Open Graph
- Every page uses this one template — only the copy changes

### 3. Bulk Page Generation Script
- Takes a keyword list (JSON) as input
- For each keyword: Claude API generates unique H1, subheadline, body copy, CTA, meta description
- Automatically creates each page in Strapi via API
- Handles duplicates, rate limiting, error logging
- **Run once → 10, 100, or 1000 pages created**

### 4. Auto-Generated Sitemap
- `/sitemap.xml` dynamically lists all published pages
- Updates automatically as new pages are added

### 5. Google Indexing Scripts
- Submit sitemap to Google Search Console
- Request indexing per URL via Google Indexing API
- Pages start appearing in Google search results

### 6. Deployment
- **Testing:** Vercel (frontend)
- **Production:** Railway (Strapi + frontend, migrated later)
- GitHub repo with full codebase

---

## Tech Stack

| Layer              | Tool                    |
|--------------------|-------------------------|
| CMS                | Strapi (self-hosted)    |
| Content Generation | Claude API              |
| Frontend           | Node.js + Express + EJS |
| Styling            | Tailwind CSS            |
| Hosting (test)     | Vercel                  |
| Hosting (prod)     | Railway                 |
| Version Control    | GitHub                  |
| Indexing           | Google Search Console + Indexing API |

---

## Build Phases

| Phase | What                                    | Outcome                                      |
|-------|-----------------------------------------|----------------------------------------------|
| 1     | Strapi CMS setup + content type         | CMS running, API accessible                  |
| 2     | Frontend template + Express app         | Pages render dynamically at unique URLs      |
| 3     | Bulk generation script (Claude + Strapi)| 10+ pages created from keyword list          |
| 4     | Deploy to Vercel + GitHub               | Live, publicly accessible                    |
| 5     | Google indexing scripts                 | Pages submitted and indexed by Google        |

---

## POC Validation

The proof of concept is complete when:

1. ✅ 10+ landing pages generated from keywords with unique AI copy
2. ✅ Each page live at its own URL (e.g., `/ai-dashboard-for-marketing`)
3. ✅ All pages use one master template — only copy differs
4. ✅ Sitemap auto-generated
5. ✅ Deployed and publicly accessible
6. ✅ Google indexing submitted

---

## What Comes After POC

- Swap dummy brand for real client brand/keywords
- Scale to 100+ pages
- Feed in Google Ads converting keywords for page generation
- Analytics integration to track page performance
- Migrate hosting to Railway for production
