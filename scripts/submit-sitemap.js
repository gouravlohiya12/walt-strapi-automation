#!/usr/bin/env node

/**
 * Submit sitemap to Google Search Console
 *
 * Prerequisites:
 * 1. Create a Google Cloud project at https://console.cloud.google.com
 * 2. Enable "Google Search Console API"
 * 3. Create a Service Account and download the JSON key file
 * 4. Add the service account email as a user in Google Search Console
 *    (Settings → Users and permissions → Add user → Full permission)
 * 5. Set GOOGLE_SERVICE_ACCOUNT_KEY path and GOOGLE_SITE_URL in .env
 *
 * Usage:
 *   node scripts/submit-sitemap.js
 *   node scripts/submit-sitemap.js --check   # Check sitemap status only
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { google } = require("googleapis");
const path = require("path");

const SITE_URL = process.env.GOOGLE_SITE_URL || process.env.BASE_URL;
const KEY_FILE = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
const SITEMAP_PATH = "/sitemap.xml";

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
    scopes: ["https://www.googleapis.com/auth/webmasters"],
  });

  return auth.getClient();
}

async function submitSitemap() {
  if (!SITE_URL) {
    console.error("Error: GOOGLE_SITE_URL or BASE_URL not set in .env");
    process.exit(1);
  }

  const sitemapUrl = `${SITE_URL.replace(/\/$/, "")}${SITEMAP_PATH}`;
  const siteUrl = SITE_URL.replace(/\/$/, "");

  console.log("🗺️  Google Search Console — Sitemap Submission\n");
  console.log(`   Site:    ${siteUrl}`);
  console.log(`   Sitemap: ${sitemapUrl}\n`);

  const authClient = await getAuthClient();
  const searchConsole = google.searchconsole({ version: "v1", auth: authClient });

  const checkOnly = process.argv.includes("--check");

  if (!checkOnly) {
    // Submit sitemap
    try {
      await searchConsole.sitemaps.submit({
        siteUrl,
        feedpath: sitemapUrl,
      });
      console.log("✅ Sitemap submitted successfully!\n");
    } catch (err) {
      if (err.code === 409) {
        console.log("ℹ️  Sitemap already submitted.\n");
      } else {
        throw err;
      }
    }
  }

  // Check sitemap status
  try {
    const res = await searchConsole.sitemaps.get({
      siteUrl,
      feedpath: sitemapUrl,
    });

    const sitemap = res.data;
    console.log("📊 Sitemap Status:");
    console.log(`   Path:          ${sitemap.path}`);
    console.log(`   Last submitted: ${sitemap.lastSubmitted || "N/A"}`);
    console.log(`   Last downloaded: ${sitemap.lastDownloaded || "N/A"}`);
    console.log(`   Warnings:      ${sitemap.warnings || 0}`);
    console.log(`   Errors:        ${sitemap.errors || 0}`);

    if (sitemap.contents) {
      for (const content of sitemap.contents) {
        console.log(
          `   URLs (${content.type}): ${content.submitted} submitted, ${content.indexed} indexed`
        );
      }
    }
  } catch (err) {
    if (err.code === 404) {
      console.log("⏳ Sitemap not yet processed by Google. Check back later.");
    } else {
      throw err;
    }
  }
}

submitSitemap().catch((err) => {
  console.error("\n❌ Error:", err.message);
  if (err.code === 403) {
    console.error(
      "\nMake sure the service account email is added as a user in Google Search Console."
    );
  }
  process.exit(1);
});
