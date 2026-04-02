require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const Anthropic = require("@anthropic-ai/sdk");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Config
const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const DELAY_MS = 1500; // delay between Claude API calls
const MAX_RETRIES = 3;

// Parse CLI args
const args = process.argv.slice(2);
const inputFile = args.includes("--input")
  ? args[args.indexOf("--input") + 1]
  : "keywords.json";
const forceOverwrite = args.includes("--force");

// Validate env
if (!STRAPI_API_TOKEN) {
  console.error("❌ STRAPI_API_TOKEN is missing in .env");
  process.exit(1);
}
if (!ANTHROPIC_API_KEY) {
  console.error("❌ ANTHROPIC_API_KEY is missing in .env");
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a landing page copywriter for NovaDash, an AI-powered analytics dashboard.
Brand voice: confident, clear, modern. Tagline: "Your data, simplified."
The copy should feel premium but approachable — like talking to a smart friend who happens to be a data expert.
Never use filler words. Every sentence should earn its place.`;

function buildUserPrompt(keyword) {
  return `Generate landing page content for the keyword: "${keyword}"

Return a JSON object with these fields:
- h1: A compelling headline (max 10 words) that speaks directly to someone searching "${keyword}"
- subheadline: A supporting line (max 20 words) that adds value beyond the h1
- body_copy: 2 paragraphs of persuasive copy (150-250 words total) in HTML format using <p> tags. Address the pain point, then position NovaDash as the solution.
- cta_text: A call-to-action button label (2-5 words)
- meta_description: SEO meta description (max 160 characters) that includes the keyword naturally

Respond ONLY with valid JSON. No markdown, no backticks, no explanation.`;
}

function toSlug(keyword) {
  return keyword
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toTitle(keyword) {
  const capitalized = keyword.replace(/\b\w/g, (c) => c.toUpperCase());
  return `${capitalized} — NovaDash`;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateCopy(keyword, retries = 0) {
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(keyword) }],
    });

    const text = response.content[0].text.trim();
    const parsed = JSON.parse(text);

    // Validate required fields
    const required = ["h1", "subheadline", "body_copy", "cta_text", "meta_description"];
    for (const field of required) {
      if (!parsed[field]) {
        throw new Error(`Missing field: ${field}`);
      }
    }

    return parsed;
  } catch (err) {
    if (retries < MAX_RETRIES) {
      console.log(`   ⟳ Retry ${retries + 1}/${MAX_RETRIES} for "${keyword}": ${err.message}`);
      await sleep(2000);
      return generateCopy(keyword, retries + 1);
    }
    throw err;
  }
}

async function checkExistingPage(slug) {
  try {
    const res = await axios.get(
      `${STRAPI_URL}/api/landing-pages?filters[slug][$eq]=${encodeURIComponent(slug)}`,
      { headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` } }
    );
    const pages = res.data.data || [];
    return pages.length > 0 ? pages[0] : null;
  } catch {
    return null;
  }
}

async function createPage(data) {
  const res = await axios.post(
    `${STRAPI_URL}/api/landing-pages`,
    { data },
    {
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
}

async function updatePage(documentId, data) {
  const res = await axios.put(
    `${STRAPI_URL}/api/landing-pages/${documentId}`,
    { data },
    {
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
}

async function main() {
  // Load keywords
  const keywordsPath = path.resolve(__dirname, inputFile);
  if (!fs.existsSync(keywordsPath)) {
    console.error(`❌ Keywords file not found: ${keywordsPath}`);
    process.exit(1);
  }

  const keywords = JSON.parse(fs.readFileSync(keywordsPath, "utf-8"));
  console.log(`\n🚀 NovaDash Landing Page Generator`);
  console.log(`   Keywords: ${keywords.length}`);
  console.log(`   Strapi: ${STRAPI_URL}`);
  console.log(`   Force overwrite: ${forceOverwrite}`);
  console.log(`   Input: ${inputFile}\n`);

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i];
    const slug = toSlug(keyword);
    const progress = `[${i + 1}/${keywords.length}]`;

    console.log(`${progress} Processing: "${keyword}"`);

    // Check for existing page
    const existing = await checkExistingPage(slug);
    if (existing && !forceOverwrite) {
      console.log(`   ⏭  Skipped (already exists at /${slug})`);
      skipped++;
      continue;
    }

    // Generate copy via Claude
    try {
      console.log(`   🤖 Generating copy...`);
      const copy = await generateCopy(keyword);

      const pageData = {
        title: toTitle(keyword),
        slug,
        keyword,
        h1: copy.h1,
        subheadline: copy.subheadline,
        body_copy: copy.body_copy,
        cta_text: copy.cta_text,
        cta_url: "#",
        meta_description: copy.meta_description,
        status: "published",
      };

      if (existing && forceOverwrite) {
        await updatePage(existing.documentId, pageData);
        console.log(`   ✅ Updated: /${slug}`);
        updated++;
      } else {
        await createPage(pageData);
        console.log(`   ✅ Created: /${slug}`);
        created++;
      }
    } catch (err) {
      console.log(`   ❌ Failed: ${err.message}`);
      failed++;
    }

    // Rate limit delay (skip on last item)
    if (i < keywords.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  // Summary
  console.log(`\n────────────────────────────────`);
  console.log(`📊 Summary`);
  console.log(`   ✅ Created: ${created}`);
  console.log(`   🔄 Updated: ${updated}`);
  console.log(`   ⏭  Skipped: ${skipped}`);
  console.log(`   ❌ Failed:  ${failed}`);
  console.log(`   📄 Total:   ${keywords.length}`);
  console.log(`────────────────────────────────\n`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
