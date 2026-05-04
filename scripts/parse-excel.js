#!/usr/bin/env node
// Parse an Excel (.xlsx) or CSV file into a JSON array of page rows.
// Usage:
//   node scripts/parse-excel.js --file /path/to/pages.xlsx --out /tmp/bulk-pages.json
//   node scripts/parse-excel.js --file /path/to/pages.csv  --out /tmp/bulk-pages.json

const fs = require("fs");
const path = require("path");

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : def;
}

const filePath = arg("file");
const outPath = arg("out", "/tmp/bulk-pages.json");

if (!filePath) {
  console.error("Usage: node scripts/parse-excel.js --file <path> [--out <path>]");
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const ext = path.extname(filePath).toLowerCase();

// Column name aliases → canonical field names
const COLUMN_MAP = {
  keyword:          ["keyword", "topic", "page topic", "page keyword", "target keyword", "search term"],
  target_audience:  ["target_audience", "target audience", "audience", "who", "persona"],
  cta_url:          ["cta_url", "cta", "checkout url", "checkout", "link", "url", "buy url"],
  custom_h1:        ["custom_h1", "headline", "h1", "custom headline", "title"],
  template:         ["template", "design", "layout", "page design"],
};

function normalizeHeader(h) {
  return h.toLowerCase().trim().replace(/[^a-z0-9 _]/g, "");
}

function mapHeader(raw) {
  const normalized = normalizeHeader(raw);
  for (const [canonical, aliases] of Object.entries(COLUMN_MAP)) {
    if (aliases.includes(normalized)) return canonical;
  }
  return null;
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function processRows(headers, rows) {
  const headerMap = headers.map(mapHeader);
  const pages = [];
  const seenSlugs = new Set();

  rows.forEach((row, i) => {
    const obj = {};
    headers.forEach((_, j) => {
      const field = headerMap[j];
      if (field && row[j] !== undefined && row[j] !== null && String(row[j]).trim() !== "") {
        obj[field] = String(row[j]).trim();
      }
    });

    if (!obj.keyword) {
      console.warn(`  ⚠️  Row ${i + 2}: missing keyword — skipped`);
      return;
    }

    // Generate slug, handle duplicates
    let slug = slugify(obj.keyword);
    if (seenSlugs.has(slug)) {
      let n = 2;
      while (seenSlugs.has(`${slug}-${n}`)) n++;
      slug = `${slug}-${n}`;
    }
    seenSlugs.add(slug);
    obj.slug = slug;

    pages.push(obj);
  });

  return pages;
}

let pages = [];

if (ext === ".csv") {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/).filter(l => l.trim());
  const parse = line => line.split(",").map(c => c.replace(/^"|"$/g, "").trim());
  const headers = parse(lines[0]);
  const rows = lines.slice(1).map(parse);
  pages = processRows(headers, rows);

} else if (ext === ".xlsx" || ext === ".xls") {
  let XLSX;
  try {
    XLSX = require("xlsx");
  } catch {
    console.error(
      "The 'xlsx' package is required for Excel files.\n" +
      "Run: npm install xlsx\n" +
      "Or export your file as CSV and use that instead."
    );
    process.exit(1);
  }
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  if (raw.length < 2) {
    console.error("Spreadsheet appears empty or has only headers.");
    process.exit(1);
  }
  const headers = raw[0].map(String);
  const rows = raw.slice(1).filter(r => r.some(c => String(c).trim() !== ""));
  pages = processRows(headers, rows);

} else {
  console.error(`Unsupported file type: ${ext}. Use .xlsx, .xls, or .csv`);
  process.exit(1);
}

fs.writeFileSync(outPath, JSON.stringify(pages, null, 2));
console.log(`✅ Parsed ${pages.length} pages → ${outPath}`);
pages.forEach((p, i) => {
  console.log(`  ${i + 1}. ${p.slug}${p.custom_h1 ? " (custom H1)" : ""}`);
});
