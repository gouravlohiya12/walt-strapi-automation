#!/usr/bin/env node

/**
 * Request Google indexing for published landing pages
 *
 * Uses the Google Web Search Indexing API to request URL indexing.
 * This is faster than waiting for Google to discover pages via sitemap.
 *
 * Prerequisites:
 * 1. Create a Google Cloud project at https://console.cloud.google.com
 * 2. Enable "Web Search Indexing API"
 * 3. Create a Service Account and download the JSON key file
 * 4. Add the service account email as an owner in Google Search Console
 *    (Settings → Users and permissions → Add user → Owner permission)
 * 5. Set GOOGLE_SERVICE_ACCOUNT_KEY path and GOOGLE_SITE_URL in .env
 *
 * Usage:
 *   node scripts/request-indexing.js                              # All published pages
 *   node scripts/request-indexing.js --slug ai-dashboard-for-marketing  # Single page
 *   node scripts/request-indexing.js --status                     # Check indexing status
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { google } = require("googleapis");
const axios = require("axios");
const path = require("path");

const SITE_URL = process.env.GOOGLE_SITE_URL || process.env.BASE_URL;
const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const KEY_FILE = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

// Google Indexing API quota: 200 requests/day
const RATE_LIMIT_MS = 1000; // 1 second between requests
const MAX_REQUESTS_PER_RUN = 200;

async function getAuthClient() {
  if (!KEY_FILE) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_KEY not set in .env\n" +
        "Set it to the path of your Google Cloud service account JSON key file."
    );
  }

  const keyPath = path.isAbsolute(KEY_FILE)
    ? KEY_FILE
    : path.resolve(__dirname, "..", KEY_FILE);

  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });

  return auth.getClient();
}

async function getPublishedPages(slugFilter) {
  let url = `${STRAPI_URL}/api/landing-pages?filters[status][$eq]=published&pagination[pageSize]=100`;
  if (slugFilter) {
    url += `&filters[slug][$eq]=${encodeURIComponent(slugFilter)}`;
  }

  const res = await axios.get(url);
  return res.data.data || [];
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestIndexing(authClient, pageUrl, type = "URL_UPDATED") {
  const res = await authClient.request({
    url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
    method: "POST",
    data: {
      url: pageUrl,
      type,
    },
  });
  return res.data;
}

async function checkIndexingStatus(authClient, pageUrl) {
  const res = await authClient.request({
    url: `https://indexing.googleapis.com/v3/urlNotifications/metadata?url=${encodeURIComponent(pageUrl)}`,
    method: "GET",
  });
  return res.data;
}

async function main() {
  if (!SITE_URL) {
    console.error("Error: GOOGLE_SITE_URL or BASE_URL not set in .env");
    process.exit(1);
  }

  const baseUrl = SITE_URL.replace(/\/$/, "");
  const args = process.argv.slice(2);
  const slugIndex = args.indexOf("--slug");
  const slugFilter = slugIndex !== -1 ? args[slugIndex + 1] : null;
  const checkStatus = args.includes("--status");

  console.log("🔍 Google Indexing API — URL Submission\n");
  console.log(`   Site:   ${baseUrl}`);
  console.log(`   Strapi: ${STRAPI_URL}\n`);

  // Fetch pages from Strapi
  const pages = await getPublishedPages(slugFilter);

  if (pages.length === 0) {
    console.log("No published pages found.");
    if (slugFilter) console.log(`   (filtered by slug: ${slugFilter})`);
    process.exit(0);
  }

  console.log(`   Found ${pages.length} published page(s)\n`);

  const authClient = await getAuthClient();

  let success = 0;
  let failed = 0;
  const total = Math.min(pages.length, MAX_REQUESTS_PER_RUN);

  for (let i = 0; i < total; i++) {
    const page = pages[i];
    const pageUrl = `${baseUrl}/${page.slug}`;

    if (checkStatus) {
      // Check status mode
      try {
        const status = await checkIndexingStatus(authClient, pageUrl);
        const lastNotify = status.latestUpdate?.notifyTime || "Never";
        const lastType = status.latestUpdate?.type || "N/A";
        console.log(
          `[${i + 1}/${total}] ${page.slug}`
        );
        console.log(`         Last notified: ${lastNotify} (${lastType})`);
        if (status.latestRemove) {
          console.log(`         Removed: ${status.latestRemove.notifyTime}`);
        }
        success++;
      } catch (err) {
        if (err.code === 404 || err.response?.status === 404) {
          console.log(
            `[${i + 1}/${total}] ${page.slug} — Not yet submitted`
          );
        } else {
          console.log(
            `[${i + 1}/${total}] ❌ ${page.slug} — ${err.message}`
          );
          failed++;
        }
      }
    } else {
      // Submit mode
      try {
        const result = await requestIndexing(authClient, pageUrl);
        const notifyTime = result.urlNotificationMetadata?.latestUpdate?.notifyTime || "Pending";
        console.log(
          `[${i + 1}/${total}] ✅ ${page.slug} — Notified: ${notifyTime}`
        );
        success++;
      } catch (err) {
        const errMsg = err.response?.data?.error?.message || err.message;
        console.log(
          `[${i + 1}/${total}] ❌ ${page.slug} — ${errMsg}`
        );
        failed++;
      }
    }

    // Rate limit
    if (i < total - 1) {
      await sleep(RATE_LIMIT_MS);
    }
  }

  console.log(`\n────────────────────────────────`);
  if (checkStatus) {
    console.log(`📊 Status check: ${success} found, ${failed} errors`);
  } else {
    console.log(`📊 Indexing: ${success} submitted, ${failed} failed`);
  }
  if (pages.length > MAX_REQUESTS_PER_RUN) {
    console.log(`⚠️  ${pages.length - MAX_REQUESTS_PER_RUN} pages skipped (daily quota: ${MAX_REQUESTS_PER_RUN})`);
  }
  console.log(`────────────────────────────────`);
}

main().catch((err) => {
  console.error("\n❌ Error:", err.message);
  if (err.code === 403) {
    console.error(
      "\nMake sure:\n" +
        "1. The Web Search Indexing API is enabled in your Google Cloud project\n" +
        "2. The service account email is added as an Owner in Google Search Console"
    );
  }
  process.exit(1);
});
