#!/usr/bin/env node
// Render a landing page from a client + page config + template.
// Usage:
//   node scripts/render-page.js --client acme --page seo-software-for-lawyers
//   node scripts/render-page.js --client acme --page seo-software-for-lawyers --out /tmp/preview.html

const fs = require("fs");
const path = require("path");

// Lazy-load EJS from frontend so we don't need a separate install
const ejsPath = path.resolve(__dirname, "..", "frontend", "node_modules", "ejs");
let ejs;
try {
  ejs = require(ejsPath);
} catch {
  console.error("EJS not found. Run 'cd frontend && npm install' first.");
  process.exit(1);
}

const ROOT = path.resolve(__dirname, "..");

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : def;
}

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function exists(p) {
  return fs.existsSync(p);
}

const clientSlug = arg("client");
const pageSlug = arg("page");
const outPath = arg("out", `/tmp/preview-${clientSlug}-${pageSlug}.html`);
const baseUrl = arg("base-url", "");

if (!clientSlug || !pageSlug) {
  console.error("Usage: node scripts/render-page.js --client <slug> --page <slug> [--out <path>] [--base-url <url>]");
  process.exit(1);
}

// Load client config
const clientPath = path.join(ROOT, "clients", clientSlug, "config.json");
if (!exists(clientPath)) {
  console.error(`Client not found: ${clientPath}`);
  process.exit(1);
}
const client = readJSON(clientPath);

// Load page config
const pagePath = path.join(ROOT, "clients", clientSlug, "pages", `${pageSlug}.json`);
if (!exists(pagePath)) {
  console.error(`Page not found: ${pagePath}`);
  process.exit(1);
}
const page = readJSON(pagePath);

// Load template
const templateName = page.template || "raising-kids";
const templateDir = path.join(ROOT, "templates", templateName);
const templatePath = path.join(templateDir, "template.ejs");
if (!exists(templatePath)) {
  console.error(`Template not found: ${templatePath}`);
  process.exit(1);
}
const tpl = fs.readFileSync(templatePath, "utf8");
const manifest = exists(path.join(templateDir, "manifest.json"))
  ? readJSON(path.join(templateDir, "manifest.json"))
  : {};

// Validate required fields per content-schema
const schemaPath = path.join(templateDir, "content-schema.json");
if (exists(schemaPath)) {
  const schema = readJSON(schemaPath);
  const missing = [];
  for (const [field, def] of Object.entries(schema.fields || {})) {
    if (def.required) {
      const val = page.content?.[field];
      const isMissing =
        val === undefined ||
        val === null ||
        val === "" ||
        (typeof val === "string" && val.includes("[NEEDS INPUT]")) ||
        (Array.isArray(val) && val.length === 0);
      if (isMissing) missing.push(field);
    }
  }
  if (missing.length > 0) {
    console.error(`Page is missing required fields: ${missing.join(", ")}`);
    console.error("Fill these in before rendering, or remove 'required' from the schema.");
    process.exit(1);
  }
}

// Merge client + page into the EJS render context
// The current frontend EJS expects { page, baseUrl, ctaUrl } at the top level
// But also reads brand info from the page object. We'll merge intelligently.
const renderContext = {
  // Top-level shape the existing template expects
  page: {
    title: page.content.h1 || page.keyword,
    slug: page.slug,
    h1: page.content.h1 || "",
    subheadline: page.content.h1_sub || "",
    body_copy: page.content.body_copy || "",
    cta_text: page.content.cta_text || "Get Started",
    cta_url: page.cta_url || client.default_cta_url || "#",
    meta_description: page.content.meta_description || "",
    keyword: page.keyword,
  },
  baseUrl: baseUrl || (client.domain ? `https://${client.domain}` : ""),
  ctaUrl: page.cta_url || client.default_cta_url || "#",
  // Future: when the EJS is upgraded to read from these directly:
  client,
  pageContent: page.content,
  manifest,
};

let html;
try {
  html = ejs.render(tpl, renderContext, { filename: templatePath });
} catch (err) {
  console.error("EJS render error:", err.message);
  process.exit(1);
}

// Rewrite asset paths so the file works when served standalone
// /images/raising-kids/foo.webp → ./images/foo.webp (relative to where index.html lives)
html = html.replace(/\/images\/raising-kids\//g, "./images/");

// Write output
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html);

// Copy assets next to the output
const outDir = path.dirname(outPath);
const imagesOut = path.join(outDir, "images");
fs.mkdirSync(imagesOut, { recursive: true });

const templateAssets = path.join(templateDir, "assets");
if (exists(templateAssets)) {
  for (const file of fs.readdirSync(templateAssets)) {
    fs.copyFileSync(path.join(templateAssets, file), path.join(imagesOut, file));
  }
}

const clientAssets = path.join(ROOT, "clients", clientSlug, "assets");
if (exists(clientAssets)) {
  for (const file of fs.readdirSync(clientAssets)) {
    // Client assets override template assets with same name
    fs.copyFileSync(path.join(clientAssets, file), path.join(imagesOut, file));
  }
}

console.log(`✅ Rendered: ${outPath}`);
console.log(`   Size: ${html.length} bytes`);
console.log(`   Template: ${templateName}`);
console.log(`   Assets in: ${imagesOut}`);
