require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const express = require("express");
const compression = require("compression");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(compression());
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const CLIENTS_DIR = path.resolve(__dirname, "..", "clients");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// --- File-based page store (no Strapi needed) ---

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function getAllFilePages() {
  const pages = [];
  if (!fs.existsSync(CLIENTS_DIR)) return pages;
  for (const clientSlug of fs.readdirSync(CLIENTS_DIR)) {
    if (clientSlug.startsWith("_") || clientSlug.startsWith(".")) continue;
    const pagesDir = path.join(CLIENTS_DIR, clientSlug, "pages");
    if (!fs.existsSync(pagesDir)) continue;
    for (const file of fs.readdirSync(pagesDir)) {
      if (!file.endsWith(".json") || file.endsWith(".draft.json")) continue;
      try {
        const page = readJSON(path.join(pagesDir, file));
        const config = readJSON(path.join(CLIENTS_DIR, clientSlug, "config.json"));
        if (page.status === "published") pages.push({ page, client: config });
      } catch {}
    }
  }
  return pages;
}

function findFilePageBySlug(slug) {
  if (!fs.existsSync(CLIENTS_DIR)) return null;
  for (const clientSlug of fs.readdirSync(CLIENTS_DIR)) {
    if (clientSlug.startsWith("_") || clientSlug.startsWith(".")) continue;
    const pageFile = path.join(CLIENTS_DIR, clientSlug, "pages", `${slug}.json`);
    if (fs.existsSync(pageFile)) {
      try {
        const page = readJSON(pageFile);
        const config = readJSON(path.join(CLIENTS_DIR, clientSlug, "config.json"));
        return { page, client: config };
      } catch {}
    }
  }
  return null;
}

// --- Strapi fallback (optional — only used if STRAPI_URL is set) ---

async function strapiGet(endpoint) {
  const strapiUrl = process.env.STRAPI_URL;
  if (!strapiUrl) throw new Error("STRAPI_URL not configured");
  const axios = require("axios");
  const res = await axios.get(`${strapiUrl}${endpoint}`);
  return res.data;
}

// --- Routes ---

// Homepage — list all published pages
app.get("/", async (req, res) => {
  const filePages = getAllFilePages();
  if (filePages.length > 0) {
    return res.render("index", { pages: filePages.map(fp => fp.page), baseUrl: BASE_URL });
  }
  try {
    const response = await strapiGet(
      "/api/landing-pages?filters[status][$eq]=published&sort=createdAt:desc&pagination[pageSize]=100"
    );
    res.render("index", { pages: response.data || [], baseUrl: BASE_URL });
  } catch {
    res.render("index", { pages: [], baseUrl: BASE_URL });
  }
});

// Sitemap
app.get("/sitemap.xml", async (req, res) => {
  let pages = getAllFilePages().map(fp => ({
    slug: fp.page.slug,
    updatedAt: fp.page.last_edited || fp.page.created_at,
  }));

  if (pages.length === 0) {
    try {
      const r = await strapiGet(
        "/api/landing-pages?filters[status][$eq]=published&pagination[pageSize]=1000&fields[0]=slug&fields[1]=updatedAt"
      );
      pages = (r.data || []).map(p => ({ slug: p.slug, updatedAt: p.updatedAt }));
    } catch {}
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `  <url>\n    <loc>${BASE_URL}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  for (const p of pages) {
    const lastmod = p.updatedAt ? p.updatedAt.split("T")[0] : new Date().toISOString().split("T")[0];
    xml += `  <url>\n    <loc>${BASE_URL}/${p.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }
  xml += `</urlset>`;
  res.set("Content-Type", "application/xml").send(xml);
});

// Static raising-kids demo
app.get("/raising-kids", (req, res) => {
  const filePage = findFilePageBySlug("raising-kids");
  if (filePage) {
    const template = filePage.page.template || "raising-kids";
    return res.render(template, {
      page: filePage.page,
      client: filePage.client,
      baseUrl: BASE_URL,
      ctaUrl: filePage.page.content?.cta_url || filePage.client?.default_cta_url || process.env.RAISING_KIDS_CTA_URL,
    });
  }
  res.render("raising-kids", {
    baseUrl: BASE_URL,
    ctaUrl: process.env.RAISING_KIDS_CTA_URL || "https://courses.christian-sexuality.com/cart/add_product/3339719?price_id=4243848",
  });
});

// robots.txt
app.get("/robots.txt", (req, res) => {
  res.type("text/plain").send(`User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`);
});

// Landing page by slug — file-based first, Strapi fallback
app.get("/:slug", async (req, res) => {
  const filePage = findFilePageBySlug(req.params.slug);
  if (filePage) {
    const template = filePage.page.template || "raising-kids";
    return res.render(template, {
      page: filePage.page,
      client: filePage.client,
      baseUrl: BASE_URL,
      ctaUrl: filePage.page.content?.cta_url || filePage.client?.default_cta_url,
    });
  }

  try {
    const response = await strapiGet(
      `/api/landing-pages?filters[slug][$eq]=${encodeURIComponent(req.params.slug)}&filters[status][$eq]=published`
    );
    const pages = response.data || [];
    if (pages.length === 0) return res.status(404).render("404");
    res.render("landing-page", { page: pages[0], baseUrl: BASE_URL });
  } catch {
    res.status(404).render("404");
  }
});

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => console.log(`Frontend running at http://localhost:${PORT}`));
}

module.exports = app;
