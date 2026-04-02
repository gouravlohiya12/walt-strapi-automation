require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Helper: fetch from Strapi
async function strapiGet(endpoint) {
  const res = await axios.get(`${STRAPI_URL}${endpoint}`);
  return res.data;
}

// Homepage — list all published pages
app.get("/", async (req, res) => {
  try {
    const response = await strapiGet(
      "/api/landing-pages?filters[status][$eq]=published&sort=createdAt:desc&pagination[pageSize]=100"
    );
    res.render("index", {
      pages: response.data || [],
      baseUrl: BASE_URL,
    });
  } catch (err) {
    console.error("Error fetching pages:", err.message);
    res.render("index", { pages: [], baseUrl: BASE_URL });
  }
});

// Sitemap
app.get("/sitemap.xml", async (req, res) => {
  try {
    const response = await strapiGet(
      "/api/landing-pages?filters[status][$eq]=published&pagination[pageSize]=1000&fields[0]=slug&fields[1]=updatedAt"
    );
    const pages = response.data || [];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Homepage
    xml += `  <url>\n    <loc>${BASE_URL}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    // Landing pages
    for (const page of pages) {
      const lastmod = page.updatedAt
        ? page.updatedAt.split("T")[0]
        : new Date().toISOString().split("T")[0];
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}/${page.slug}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    console.error("Error generating sitemap:", err.message);
    res.status(500).send("Error generating sitemap");
  }
});

// Landing page by slug
app.get("/:slug", async (req, res) => {
  try {
    const response = await strapiGet(
      `/api/landing-pages?filters[slug][$eq]=${encodeURIComponent(req.params.slug)}&filters[status][$eq]=published`
    );
    const pages = response.data || [];

    if (pages.length === 0) {
      return res.status(404).render("404");
    }

    const page = pages[0];
    res.render("landing-page", {
      page,
      baseUrl: BASE_URL,
    });
  } catch (err) {
    console.error("Error fetching page:", err.message);
    res.status(500).render("404");
  }
});

app.listen(PORT, () => {
  console.log(`Frontend running at http://localhost:${PORT}`);
  console.log(`Strapi URL: ${STRAPI_URL}`);
});
