# NovaDash — Programmatic Landing Page Pipeline
## Complete Workflow Document

---

## System Overview

A fully automated pipeline that takes keywords, generates unique landing page copy via Claude API, stores content in Strapi CMS, renders pages through a master template, and submits them for Google indexing.

**Stack:** Strapi (local/SQLite) → Claude API → Node/Express/EJS → Vercel (testing) → Railway (production) → Google Search Console

---

## Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   PHASE 1: KEYWORD INPUT                                            │
│   ┌─────────────┐                                                   │
│   │ keywords.json│ ← Manual list / Google Ads export / Research     │
│   └──────┬──────┘                                                   │
│          ▼                                                          │
│   PHASE 2: CONTENT GENERATION                                       │
│   ┌──────────────────┐                                              │
│   │ Claude API        │ ← Generates H1, subheadline, body,         │
│   │ (generate-pages)  │   meta description, CTA per keyword        │
│   └──────┬───────────┘                                              │
│          ▼                                                          │
│   PHASE 3: CMS STORAGE                                              │
│   ┌──────────────────┐                                              │
│   │ Strapi CMS        │ ← Stores each page as structured content   │
│   │ (REST API)        │   with slug, status, all copy fields       │
│   └──────┬───────────┘                                              │
│          ▼                                                          │
│   PHASE 4: FRONTEND RENDERING                                       │
│   ┌──────────────────┐                                              │
│   │ Express + EJS     │ ← Master template renders each page        │
│   │ (/:slug route)    │   dynamically from Strapi data             │
│   └──────┬───────────┘                                              │
│          ▼                                                          │
│   PHASE 5: DEPLOYMENT                                               │
│   ┌──────────────────┐                                              │
│   │ Vercel (testing)  │ ← Frontend deployed, Strapi local/Railway  │
│   │ Railway (prod)    │                                             │
│   └──────┬───────────┘                                              │
│          ▼                                                          │
│   PHASE 6: INDEXING                                                  │
│   ┌──────────────────┐                                              │
│   │ Google Search     │ ← Auto-generated sitemap.xml submitted     │
│   │ Console + Indexing│   + manual indexing requests per URL        │
│   │ API               │                                             │
│   └─────────────────┘                                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## PHASE 1: Strapi CMS Setup

### What
Set up Strapi as the content backend. It stores every landing page as a structured entry with all copy fields exposed via REST API.

### Steps

1. **Initialize Strapi project**
   ```bash
   npx create-strapi-app@latest strapi --quickstart
   ```
   - Uses SQLite locally (no external DB needed for POC)
   - Runs on `http://localhost:1337`

2. **Create `LandingPage` content type** with fields:

   | Field            | Type         | Required | Notes                              |
   |------------------|--------------|----------|------------------------------------|
   | title            | Text         | Yes      | Page title / meta title            |
   | slug             | UID          | Yes      | URL-friendly identifier, linked to title |
   | keyword          | Text         | Yes      | Target keyword this page is built for |
   | h1               | Text         | Yes      | Main headline                      |
   | subheadline      | Text         | No       | Supporting headline below H1       |
   | body_copy        | Rich Text    | No       | Main body content (1-2 paragraphs) |
   | cta_text         | Text         | No       | CTA button label (default: "Start Free Trial") |
   | cta_url          | Text         | No       | CTA link destination (default: "#") |
   | meta_description | Text         | No       | SEO meta description (max 160 chars) |
   | status           | Enumeration  | Yes      | Values: draft, published (default: draft) |

3. **Configure API permissions**
   - **Public (unauthenticated):** `find`, `findOne` on LandingPage
   - **Authenticated/Token:** `create`, `update`, `delete`

4. **Generate API token**
   - Go to Settings → API Tokens → Create new token
   - Full access type
   - Store in `.env` as `STRAPI_API_TOKEN`

### API Endpoints Created
```
GET  /api/landing-pages                              → List all pages
GET  /api/landing-pages?filters[slug][$eq]=some-slug → Find by slug
GET  /api/landing-pages?filters[status][$eq]=published → Published only
POST /api/landing-pages                              → Create page (auth required)
PUT  /api/landing-pages/:id                          → Update page (auth required)
DEL  /api/landing-pages/:id                          → Delete page (auth required)
```

### Done When
- Strapi runs locally on port 1337
- LandingPage content type exists with all fields
- Public read access works (test with curl)
- API token generated and stored in .env

---

## PHASE 2: Master Landing Page Template (Frontend)

### What
A Node/Express app with one EJS template that renders any landing page dynamically by pulling content from Strapi.

### Steps

1. **Initialize Express project** in `frontend/` folder
   ```bash
   npm init -y
   npm install express ejs axios dotenv
   ```

2. **Build master template** (`views/landing-page.ejs`)
   - **Header:** NovaDash logo placeholder + minimal nav
   - **Hero Section:** `<h1>{{h1}}</h1>`, `<p>{{subheadline}}</p>`, CTA button
   - **Body Section:** `{{body_copy}}` rendered as HTML
   - **Footer:** Basic links placeholder
   - **Styling:** Tailwind CSS via CDN
   - **Brand:** NovaDash, primary color #4F46E5 (indigo), tagline "Your data, simplified."

3. **Express routes** (`server.js`)

   | Route              | Purpose                                          |
   |--------------------|--------------------------------------------------|
   | `GET /`            | Homepage listing all published landing pages      |
   | `GET /sitemap.xml` | Auto-generated XML sitemap of all published pages |
   | `GET /:slug`       | Fetches page from Strapi by slug, renders template|

4. **Strapi data fetching**
   ```
   GET {STRAPI_URL}/api/landing-pages?filters[slug][$eq]={slug}&filters[status][$eq]=published
   ```
   - Frontend reads from Strapi REST API (public, no auth needed)
   - Handles 404 gracefully if slug not found or page is draft

5. **SEO essentials on every page**
   - `<title>` tag from `title` field
   - `<meta name="description">` from `meta_description` field
   - Canonical URL
   - Open Graph tags (basic)

### Done When
- Express app runs locally (port 3000)
- Homepage lists all published pages with links
- `/:slug` route renders the correct page with all dynamic fields
- `/sitemap.xml` returns valid XML with all published page URLs
- Pages look clean and professional (doesn't need to be perfect)

---

## PHASE 3: Bulk Page Generation Script

### What
The core automation — a script that takes a keyword list, generates unique copy for each via Claude API, and creates page entries in Strapi.

### Steps

1. **Create `scripts/generate-pages.js`**

2. **Input:** `scripts/keywords.json`
   ```json
   [
     "ai dashboard for marketing",
     "ai dashboard for sales",
     "ai dashboard for startups",
     "free ai dashboard tool",
     "ai dashboard for ecommerce",
     "ai analytics dashboard",
     "ai dashboard for agencies",
     "real-time ai dashboard",
     "ai dashboard for small business",
     "custom ai dashboard builder"
   ]
   ```

3. **For each keyword, the script does:**

   **Step A — Generate copy via Claude API**
   - System prompt enforces brand voice, tone, length, JSON output format
   - Per-keyword prompt asks for: h1, subheadline, body_copy, cta_text, meta_description
   - Prompt template:
     ```
     You are a landing page copywriter for NovaDash, an AI-powered analytics
     dashboard. Tagline: "Your data, simplified."

     Generate landing page content for the keyword: "{keyword}"

     Return a JSON object with:
     - h1: Compelling headline (max 10 words)
     - subheadline: Supporting line (max 20 words)
     - body_copy: 1-2 paragraphs of persuasive copy (150-250 words, HTML formatted)
     - cta_text: Call-to-action button label (2-5 words)
     - meta_description: SEO meta description (max 160 characters)

     Respond ONLY with valid JSON. No markdown, no backticks.
     ```

   **Step B — Create slug**
   - Convert keyword to URL-safe slug: lowercase, spaces → hyphens, strip special chars
   - Example: "ai dashboard for marketing" → `ai-dashboard-for-marketing`

   **Step C — POST to Strapi**
   ```json
   POST {STRAPI_URL}/api/landing-pages
   Authorization: Bearer {STRAPI_API_TOKEN}

   {
     "data": {
       "title": "AI Dashboard for Marketing — NovaDash",
       "slug": "ai-dashboard-for-marketing",
       "keyword": "ai dashboard for marketing",
       "h1": "{generated}",
       "subheadline": "{generated}",
       "body_copy": "{generated}",
       "cta_text": "{generated}",
       "meta_description": "{generated}",
       "status": "published"
     }
   }
   ```

   **Step D — Rate limiting**
   - 1-2 second delay between Claude API calls
   - Retry logic for failed requests (max 3 retries)

   **Step E — Logging**
   - Console output: ✅ or ❌ per keyword with slug
   - Final summary: X created, Y failed

4. **Duplicate detection**
   - Before creating, check if slug already exists in Strapi
   - Skip or update if duplicate found
   - Flag for `--force` to overwrite existing pages

### Script Usage
```bash
# Generate all pages from keywords.json
node scripts/generate-pages.js

# Generate from custom file
node scripts/generate-pages.js --input custom-keywords.json

# Force overwrite existing pages
node scripts/generate-pages.js --force
```

### Done When
- Script reads keywords.json
- Claude API generates unique copy per keyword
- Each keyword creates a page in Strapi
- Running the script against 10 keywords produces 10 published pages
- All 10 pages render correctly on the frontend

---

## PHASE 4: Deployment

### Testing (Now) — Vercel
- **Frontend only** on Vercel
- Strapi runs locally during development
- Frontend points to local Strapi URL during dev, can be switched to remote

### Production (Later) — Railway
- **Service 1:** Strapi CMS (persistent server + PostgreSQL)
- **Service 2:** Express Frontend
- Both auto-deploy from GitHub

### Environment Variables
```env
# Strapi
STRAPI_URL=http://localhost:1337     # Local dev
STRAPI_API_TOKEN=your_token_here     # For write operations

# Claude API
ANTHROPIC_API_KEY=your_key_here      # For content generation

# Frontend
PORT=3000                            # Express port
BASE_URL=http://localhost:3000       # For sitemap URLs

# Google (Phase 6)
GOOGLE_SERVICE_ACCOUNT_KEY=path/to/key.json
GOOGLE_SITE_URL=https://your-domain.com
```

### GitHub Setup
- Single repo with `strapi/`, `frontend/`, `scripts/` folders
- `.gitignore` excludes: node_modules, .env, .tmp, build, .cache
- Push to GitHub, connect to Vercel/Railway

### Done When
- Code is on GitHub
- Frontend is accessible on a public URL (Vercel)
- Pages load correctly from the deployed frontend

---

## PHASE 5: Google Indexing

### What
Automatically submit all published landing pages to Google for indexing.

### Steps

1. **Sitemap** (already built in Phase 2)
   - `/sitemap.xml` auto-generates from all published Strapi pages
   - Format:
     ```xml
     <?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       <url>
         <loc>https://your-domain.com/ai-dashboard-for-marketing</loc>
         <lastmod>2026-03-31</lastmod>
         <changefreq>weekly</changefreq>
       </url>
       <!-- ... more URLs ... -->
     </urlset>
     ```

2. **Google Search Console API script** (`scripts/submit-sitemap.js`)
   - Submits sitemap URL to Google Search Console
   - Requires: Google Cloud project + service account with Search Console API enabled

3. **Google Web Indexing API script** (`scripts/request-indexing.js`)
   - For pages that aren't getting indexed via sitemap
   - Sends individual indexing requests per URL
   - Requires: Google Cloud service account with Indexing API enabled
   - Rate limited to respect Google's quotas

4. **Workflow:**
   ```
   Generate pages → Wait for sitemap to update → Submit sitemap to Search Console
                                                → If slow: hit Indexing API per URL
   ```

### Script Usage
```bash
# Submit sitemap to Google Search Console
node scripts/submit-sitemap.js

# Request indexing for all published pages
node scripts/request-indexing.js

# Request indexing for specific slug
node scripts/request-indexing.js --slug ai-dashboard-for-marketing
```

### Done When
- Sitemap is submitted to Google Search Console
- Individual pages can be submitted for indexing via script
- Google starts crawling and indexing the pages

---

## PHASE 6: Iteration & Scaling (Future)

These are not part of the POC but are the natural next steps:

1. **Swap in real keywords** — From Google Ads conversions or winning ad angles
2. **Regenerate/update pages** — Script supports `--force` to overwrite with fresh copy
3. **Scale to 100+ pages** — Test Strapi performance, add pagination
4. **Analytics integration** — Track which landing pages convert, feed back into keyword selection
5. **Migrate to Railway** — Move Strapi to Railway with PostgreSQL, frontend alongside it
6. **Custom domains** — Point real domain to the deployed frontend
7. **A/B testing** — Multiple template variations per keyword

---

## File Structure

```
project-root/
├── strapi/                         # Strapi CMS (Phase 1)
│   ├── src/
│   │   └── api/
│   │       └── landing-page/       # Auto-generated content type
│   ├── config/
│   ├── .env
│   └── package.json
├── frontend/                       # Express frontend (Phase 2)
│   ├── views/
│   │   ├── landing-page.ejs        # Master template
│   │   ├── index.ejs               # Homepage listing
│   │   └── 404.ejs                 # Not found page
│   ├── public/
│   │   └── styles.css              # Custom styles (Tailwind via CDN)
│   ├── server.js                   # Express app + routes
│   └── package.json
├── scripts/                        # Automation scripts (Phase 3 & 5)
│   ├── generate-pages.js           # Bulk page generation (Claude + Strapi)
│   ├── submit-sitemap.js           # Google Search Console submission
│   ├── request-indexing.js         # Google Indexing API requests
│   └── keywords.json               # Input keyword list
├── .env                            # Root env (shared keys)
├── .gitignore
├── WORKFLOW.md                     # This document
└── README.md
```

---

## Build Order

| Step | Phase | Description                          | Depends On |
|------|-------|--------------------------------------|------------|
| 1    | 1     | Set up Strapi + LandingPage type     | Nothing    |
| 2    | 1     | Configure permissions + API token    | Step 1     |
| 3    | 2     | Build Express app + master template  | Nothing    |
| 4    | 2     | Connect frontend to Strapi API       | Steps 1, 3 |
| 5    | 2     | Add sitemap.xml route                | Step 4     |
| 6    | 3     | Build generate-pages.js script       | Steps 1, 2 |
| 7    | 3     | Run script, create 10 test pages     | Step 6     |
| 8    | 3     | Verify all pages render correctly    | Steps 4, 7 |
| 9    | 4     | Push to GitHub                       | Step 8     |
| 10   | 4     | Deploy frontend to Vercel            | Step 9     |
| 11   | 5     | Build + run indexing scripts         | Step 10    |

---

## Dummy Brand Reference

| Property       | Value                          |
|----------------|--------------------------------|
| Brand Name     | NovaDash                       |
| Product        | AI-powered analytics dashboard |
| Tagline        | "Your data, simplified."       |
| Primary Color  | #4F46E5 (indigo)               |
| Default CTA    | "Start Free Trial"             |

---

## Success Criteria

- [ ] Strapi running with LandingPage content type + API working
- [ ] Bulk generation script creates 10+ pages with Claude-generated copy
- [ ] Each page renders at its unique slug URL (e.g., `/ai-dashboard-for-marketing`)
- [ ] All pages use same master template — only copy changes
- [ ] sitemap.xml auto-generated with all published pages
- [ ] Code on GitHub
- [ ] Frontend deployed and accessible on Vercel
- [ ] Google indexing scripts functional
