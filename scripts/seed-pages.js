require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const axios = require("axios");

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const pages = [
  {
    title: "AI Dashboard For Marketing — NovaDash",
    slug: "ai-dashboard-for-marketing",
    keyword: "ai dashboard for marketing",
    h1: "Your Marketing Data, One AI Dashboard",
    subheadline: "Stop drowning in spreadsheets. Get real-time marketing insights that actually drive revenue.",
    body_copy: "<p>Marketing teams juggle dozens of tools — Google Ads, Meta, HubSpot, email platforms, analytics suites. Each one generates data, but none of them talk to each other. The result? Hours wasted pulling reports, reconciling numbers, and building dashboards that are outdated by the time they're finished.</p><p>NovaDash connects every marketing tool in your stack and turns scattered data into a single, AI-powered dashboard. Ask plain-English questions like \"Which campaign drove the most signups last week?\" and get instant answers with visualizations. Our AI spots trends you'd miss, flags anomalies before they become problems, and recommends where to shift budget for maximum impact. No SQL. No data engineering. Just clarity.</p>",
    cta_text: "Start Free Trial",
    cta_url: "#",
    meta_description: "NovaDash is the AI dashboard for marketing teams. Unify your data, get instant insights, and make smarter decisions — no analysts required.",
    status: "published"
  },
  {
    title: "AI Dashboard For Sales — NovaDash",
    slug: "ai-dashboard-for-sales",
    keyword: "ai dashboard for sales",
    h1: "Close More Deals With AI-Powered Sales Data",
    subheadline: "See your entire pipeline, forecast revenue, and spot at-risk deals — all in one dashboard.",
    body_copy: "<p>Your CRM has the data. Your spreadsheets have the forecasts. Your team meetings have the context. But nowhere does it all come together in a way that actually helps you sell more. Sales leaders spend more time reporting on pipeline than actually improving it.</p><p>NovaDash changes that. Connect your CRM, call tools, and revenue data into one AI-powered dashboard that gives you the full picture. Ask \"Which deals are most likely to close this quarter?\" or \"Where are reps losing deals in the funnel?\" and get answers instantly. NovaDash's AI analyzes patterns across your entire sales history to surface insights that move the needle — not just charts that look good in board decks.</p>",
    cta_text: "Try It Free",
    cta_url: "#",
    meta_description: "NovaDash is the AI dashboard built for sales teams. Unify pipeline data, forecast revenue accurately, and close more deals with AI-driven insights.",
    status: "published"
  },
  {
    title: "AI Dashboard For Startups — NovaDash",
    slug: "ai-dashboard-for-startups",
    keyword: "ai dashboard for startups",
    h1: "The Analytics Dashboard Startups Actually Use",
    subheadline: "Enterprise-grade insights without the enterprise-grade headcount. Built for lean teams.",
    body_copy: "<p>You're a 15-person startup. You can't afford a data team, but you're generating more data than ever — from product analytics and ad spend to revenue metrics and customer feedback. Investors want dashboards. Your team needs answers. And nobody has time to wrestle with Looker or build something from scratch.</p><p>NovaDash was built for exactly this moment. Connect your tools in minutes — Stripe, Google Analytics, your CRM, your ad platforms — and let AI do the heavy lifting. Ask questions in plain English, get instant charts and insights, and share dashboards with your team or your board. No setup fees, no data engineer required, no six-month implementation. Just the answers you need to move fast and make smart bets with limited runway.</p>",
    cta_text: "Get Started Free",
    cta_url: "#",
    meta_description: "NovaDash gives startups an AI-powered analytics dashboard without needing a data team. Connect your tools, ask questions, get answers instantly.",
    status: "published"
  },
  {
    title: "Free AI Dashboard Tool — NovaDash",
    slug: "free-ai-dashboard-tool",
    keyword: "free ai dashboard tool",
    h1: "The Free AI Dashboard That Replaces Your Spreadsheets",
    subheadline: "Connect your data, ask questions in plain English, and get instant visual answers. Free to start.",
    body_copy: "<p>Most dashboard tools either cost a fortune or require a computer science degree to set up. You shouldn't need to learn SQL or hire a contractor just to understand your own business data. If you've been living in spreadsheets because the alternatives are too expensive or too complex, there's a better way.</p><p>NovaDash gives you a free AI-powered dashboard that anyone can use. Connect your data sources — Google Sheets, Stripe, your CRM, ad platforms — and start asking questions. \"What was our revenue trend last quarter?\" \"Which channel has the lowest CAC?\" NovaDash generates visualizations and insights instantly. Start free with generous limits, and scale up only when your data needs grow. No credit card, no commitment, no catch.</p>",
    cta_text: "Start Free",
    cta_url: "#",
    meta_description: "Try NovaDash — a free AI dashboard tool that connects your data and answers questions instantly. No SQL, no setup fees, no credit card required.",
    status: "published"
  },
  {
    title: "AI Dashboard For Ecommerce — NovaDash",
    slug: "ai-dashboard-for-ecommerce",
    keyword: "ai dashboard for ecommerce",
    h1: "Run Your Ecommerce Store on Smarter Data",
    subheadline: "Unify Shopify, ads, email, and analytics into one AI dashboard that drives revenue.",
    body_copy: "<p>Ecommerce moves fast. Between managing inventory, running ads, optimizing product pages, and handling customer support, the last thing you need is another hour spent pulling reports from five different platforms. But without clear data, you're guessing — and guessing gets expensive when you're spending real money on ads and inventory.</p><p>NovaDash pulls your Shopify, Google Ads, Meta Ads, Klaviyo, and analytics data into one intelligent dashboard. See your true ROAS across channels, identify your best-performing products, track customer lifetime value, and spot trends before your competitors do. Ask questions like \"Which products had the highest margin last month?\" or \"Where am I wasting ad spend?\" and get actionable answers in seconds. Built for ecommerce operators who'd rather grow their store than build dashboards.</p>",
    cta_text: "Start Free Trial",
    cta_url: "#",
    meta_description: "NovaDash is the AI dashboard for ecommerce. Unify Shopify, ads, and analytics data to see real ROAS, track LTV, and grow revenue smarter.",
    status: "published"
  },
  {
    title: "AI Analytics Dashboard — NovaDash",
    slug: "ai-analytics-dashboard",
    keyword: "ai analytics dashboard",
    h1: "Analytics That Think, Not Just Display",
    subheadline: "Go beyond charts. NovaDash uses AI to find insights, spot anomalies, and recommend action.",
    body_copy: "<p>Traditional analytics dashboards show you what happened. They're great at displaying numbers, but terrible at telling you what those numbers mean. You still have to connect the dots yourself — and in a world where data volume doubles every year, that's becoming impossible for humans to do alone.</p><p>NovaDash is an analytics dashboard with AI at its core. It doesn't just visualize your data — it actively analyzes it. It finds correlations across datasets you'd never think to compare. It alerts you to anomalies before they become crises. It recommends specific actions based on patterns in your data. Ask it anything — \"Why did conversion drop last Tuesday?\" \"What's driving our best customer segment?\" — and get answers that would take an analyst days to produce. This is what analytics was always supposed to be.</p>",
    cta_text: "Try NovaDash Free",
    cta_url: "#",
    meta_description: "NovaDash is an AI analytics dashboard that goes beyond charts. Get automated insights, anomaly detection, and plain-English answers from your data.",
    status: "published"
  },
  {
    title: "AI Dashboard For Agencies — NovaDash",
    slug: "ai-dashboard-for-agencies",
    keyword: "ai dashboard for agencies",
    h1: "One Dashboard For Every Client. Powered by AI.",
    subheadline: "Stop building custom reports for each client. NovaDash auto-generates insights across all accounts.",
    body_copy: "<p>Agency life means managing data across dozens of clients, each with their own tech stack, their own KPIs, and their own expectations for reporting. You spend Monday mornings pulling numbers from fifteen platforms just to fill a slide deck. Your team is burning hours on reporting that should be spent on strategy.</p><p>NovaDash lets you connect every client's data sources into dedicated dashboards — each one powered by AI that does the analysis for you. Auto-generate weekly performance summaries, flag underperforming campaigns, and answer client questions in seconds instead of hours. Share live dashboards with clients so they can self-serve basic questions. Your team gets time back. Your clients get better insights. And you can finally scale without hiring another analyst for every five accounts.</p>",
    cta_text: "Start Free Trial",
    cta_url: "#",
    meta_description: "NovaDash helps agencies manage client data with AI-powered dashboards. Auto-generate reports, flag issues, and scale without extra headcount.",
    status: "published"
  },
  {
    title: "Real-Time AI Dashboard — NovaDash",
    slug: "real-time-ai-dashboard",
    keyword: "real-time ai dashboard",
    h1: "Real-Time Data. Real-Time AI Insights.",
    subheadline: "Watch your metrics update live and let AI alert you the moment something needs attention.",
    body_copy: "<p>Stale data is dangerous data. When your dashboard refreshes once a day — or worse, requires someone to manually update it — you're making decisions on yesterday's reality. In fast-moving environments like paid advertising, ecommerce, and SaaS, an hour of bad data can cost thousands.</p><p>NovaDash delivers real-time data streaming into an AI-powered dashboard that never sleeps. Your metrics update continuously, and NovaDash's AI monitors every data point for anomalies, trends, and opportunities. The moment your CPA spikes, your conversion rate drops, or a new traffic source starts performing — you'll know. Set custom alerts or let the AI decide what's worth flagging. Combine real-time visibility with intelligent analysis and you stop reacting to problems. You start preventing them.</p>",
    cta_text: "See It Live",
    cta_url: "#",
    meta_description: "NovaDash is a real-time AI dashboard with live data streaming and intelligent alerts. Spot anomalies, track metrics, and act faster than ever.",
    status: "published"
  },
  {
    title: "AI Dashboard For Small Business — NovaDash",
    slug: "ai-dashboard-for-small-business",
    keyword: "ai dashboard for small business",
    h1: "Big Business Insights. Small Business Simplicity.",
    subheadline: "No analysts, no consultants, no complexity. Just connect your tools and ask questions.",
    body_copy: "<p>Small business owners wear every hat. You're the CEO, the marketer, the salesperson, and apparently also the data analyst. You know your numbers matter — revenue trends, customer acquisition costs, which products are actually profitable — but who has time to build dashboards when you're also handling payroll and customer support?</p><p>NovaDash was designed for business owners who need answers, not another tool to learn. Connect the platforms you already use — QuickBooks, Stripe, Google Analytics, your email tool — and start asking questions in plain English. \"Am I profitable this month?\" \"Which marketing channel brings the best customers?\" \"What are my top products by margin?\" NovaDash gives you clear, visual answers in seconds. It's like having a data analyst on your team, without the salary. Finally, make data-driven decisions without the data science degree.</p>",
    cta_text: "Try It Free",
    cta_url: "#",
    meta_description: "NovaDash gives small businesses an AI-powered dashboard. Connect your tools, ask questions in plain English, and get insights — no data team needed.",
    status: "published"
  },
  {
    title: "Custom AI Dashboard Builder — NovaDash",
    slug: "custom-ai-dashboard-builder",
    keyword: "custom ai dashboard builder",
    h1: "Build Custom Dashboards in Minutes, Not Months",
    subheadline: "Drag, drop, and ask — NovaDash lets you create tailored dashboards with zero code.",
    body_copy: "<p>Every team has different questions, different KPIs, and different ways they want to see data. Cookie-cutter dashboards don't cut it. But building custom dashboards traditionally means weeks of development time, expensive BI tools, and constant maintenance as your data sources change.</p><p>NovaDash is a custom dashboard builder with AI at its foundation. Start with a blank canvas or a template, connect your data sources, and build exactly what you need. Drag widgets, set filters, choose visualizations — or just tell the AI what you want to see and it builds it for you. \"Show me monthly revenue by channel with a comparison to last year\" turns into a polished dashboard widget in seconds. Every dashboard updates in real-time, can be shared with your team, and gets smarter as NovaDash learns which metrics matter most to you.</p>",
    cta_text: "Build Your Dashboard",
    cta_url: "#",
    meta_description: "NovaDash is a custom AI dashboard builder. Create tailored dashboards in minutes with drag-and-drop and AI — no code or data engineering required.",
    status: "published"
  }
];

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

async function main() {
  console.log(`\n🚀 NovaDash Landing Page Seeder`);
  console.log(`   Pages to create: ${pages.length}`);
  console.log(`   Strapi: ${STRAPI_URL}\n`);

  let created = 0;
  let failed = 0;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const progress = `[${i + 1}/${pages.length}]`;

    try {
      await createPage(page);
      console.log(`${progress} ✅ Created: /${page.slug}`);
      created++;
    } catch (err) {
      console.log(`${progress} ❌ Failed: /${page.slug} — ${err.response?.data?.error?.message || err.message}`);
      failed++;
    }
  }

  console.log(`\n────────────────────────────────`);
  console.log(`📊 Summary: ${created} created, ${failed} failed`);
  console.log(`────────────────────────────────\n`);
}

main();
