require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const axios = require("axios");

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const pages = [
  {
    title: "AI Customer Support — Nexora",
    slug: "ai-customer-support",
    keyword: "ai customer support",
    h1: "Customer Support That Never Sleeps",
    subheadline: "Nexora's AI resolves 70% of tickets instantly — so your team can focus on the conversations that matter.",
    body_copy: "<p>Customer expectations have changed. They want answers in minutes, not hours. They want help at 2am on a Sunday, not just during business hours. They want to message you on whatever channel is convenient for them — chat, email, social, phone — and they never want to repeat themselves. Meeting these expectations with a human-only team is impossible without burning out your agents or burning through your budget.</p><p>Nexora is AI customer support built for the modern era. It learns from your knowledge base, past tickets, and product docs to resolve common questions automatically — with the accuracy and tone your brand demands. When the AI can't help, it hands off to a human with full context: the customer's history, what was already tried, and a suggested response. Your team spends less time on password resets and shipping inquiries, and more time on the complex issues that build loyalty. The result? Faster responses, happier customers, and a support team that actually scales.</p>",
    cta_text: "Start Free Trial",
    cta_url: "#",
    meta_description: "Nexora is AI customer support that resolves 70% of tickets automatically. Faster responses, happier customers, lower costs. Try free for 14 days.",
    status: "published"
  },
  {
    title: "AI Chatbot For Website — Nexora",
    slug: "ai-chatbot-for-website",
    keyword: "ai chatbot for website",
    h1: "An AI Chatbot That Actually Helps",
    subheadline: "Not another dumb bot. Nexora understands your product and resolves real customer issues in real time.",
    body_copy: "<p>Most website chatbots are glorified FAQ search bars. They match keywords, spit out canned responses, and frustrate customers until they demand a human agent. You spent money implementing it, and all it did was add one more step between your customer and the help they need. That's not AI — that's a bad menu system.</p><p>Nexora's chatbot is fundamentally different. It understands context, handles multi-turn conversations, and actually resolves issues — not just deflects them. It processes refunds, checks order status, troubleshoots product issues, and knows when to escalate. Train it once on your docs and it keeps learning from every conversation. It speaks your brand's tone, works 24/7, and handles hundreds of simultaneous conversations without breaking a sweat. Install it in minutes with a single code snippet. Watch your support queue shrink by the end of the first week.</p>",
    cta_text: "Add to Your Site",
    cta_url: "#",
    meta_description: "Nexora's AI chatbot for websites resolves real customer issues, not just FAQs. Understands context, handles multi-turn conversations. Install in minutes.",
    status: "published"
  },
  {
    title: "Customer Support Software For Startups — Nexora",
    slug: "customer-support-software-for-startups",
    keyword: "customer support software for startups",
    h1: "Startup-Grade Support Without the Enterprise Price",
    subheadline: "Give your early customers incredible support — without hiring a full team to do it.",
    body_copy: "<p>When you're a startup, every customer interaction matters. A bad support experience doesn't just lose one customer — it loses the referral chain behind them. But you can't afford five support agents when you're still finding product-market fit. You need to deliver amazing support at a scale of one or two people, and that means you need the right tool, not just the cheapest one.</p><p>Nexora is built for startups that punch above their weight. Start free, set up in minutes, and let AI handle the volume while your small team handles the nuance. Nexora learns your product from your docs and starts resolving tickets immediately. Shared inbox keeps email, chat, and social organized. Smart routing makes sure urgent issues get seen first. And when your startup scales from 100 customers to 10,000? Nexora scales with you — same tool, same team, just more AI handling the load. No rip-and-replace, no migration pain.</p>",
    cta_text: "Get Started Free",
    cta_url: "#",
    meta_description: "Nexora is customer support software built for startups. AI-powered, free to start, and scales with you. Deliver great support without a big team.",
    status: "published"
  },
  {
    title: "Helpdesk Software — Nexora",
    slug: "helpdesk-software",
    keyword: "helpdesk software",
    h1: "The Helpdesk That Closes Tickets For You",
    subheadline: "AI-powered helpdesk that auto-resolves, auto-routes, and auto-prioritizes — so your agents don't have to.",
    body_copy: "<p>Your current helpdesk is basically a fancy email inbox. Tickets come in, someone reads them, someone assigns them, someone responds. The tool manages the queue but it doesn't actually reduce it. You're paying for software that organizes work but doesn't do any of it. Meanwhile, your agents drown in repetitive questions while complex issues wait in line behind password resets.</p><p>Nexora is helpdesk software that actively works alongside your team. AI reads every incoming ticket and auto-resolves the ones it can handle — which is about 70% of them. The rest get intelligently routed to the right agent based on skill, workload, and urgency. Priority is set automatically based on customer value, issue severity, and SLA timelines. Your agents open their queue to find only the tickets that actually need human judgment, each pre-loaded with context and suggested responses. Less busywork, faster resolution, better CSAT.</p>",
    cta_text: "Start Free Trial",
    cta_url: "#",
    meta_description: "Nexora is AI-powered helpdesk software that auto-resolves 70% of tickets. Smart routing, auto-prioritization, and faster resolution. Try free.",
    status: "published"
  },
  {
    title: "AI Customer Service Tool — Nexora",
    slug: "ai-customer-service-tool",
    keyword: "ai customer service tool",
    h1: "AI That Delivers Service, Not Excuses",
    subheadline: "Nexora resolves issues, processes requests, and escalates intelligently — like your best agent, at scale.",
    body_copy: "<p>The promise of AI in customer service has been oversold. Most tools just add a chatbot that deflects questions and frustrates customers. Real customer service means actually resolving problems — processing a refund, updating an order, troubleshooting a technical issue, knowing when to say sorry and when to escalate. Most AI tools can't do any of that.</p><p>Nexora can. It connects to your systems — your CRM, order management, billing platform — and takes real action on behalf of customers. It doesn't just say \"I'll pass this to a team member.\" It checks the order status, processes the return, updates the address, and confirms the change. When it encounters something it can't handle, it escalates with full context so the human agent picks up right where the AI left off. Your customers get faster resolution. Your agents get fewer repetitive tasks. And your support costs stop growing linearly with your customer base.</p>",
    cta_text: "See It In Action",
    cta_url: "#",
    meta_description: "Nexora is an AI customer service tool that actually resolves issues — not just deflects. Connects to your systems, takes action, and escalates smartly.",
    status: "published"
  },
  {
    title: "Live Chat Software — Nexora",
    slug: "live-chat-software",
    keyword: "live chat software",
    h1: "Live Chat That Converts and Supports",
    subheadline: "AI-powered live chat that answers questions, captures leads, and resolves issues — all in real time.",
    body_copy: "<p>Live chat is the fastest way to lose or win a customer. When someone's on your site with a question, you have about 30 seconds before they leave. If your chat widget shows \"We'll get back to you in 24 hours,\" you've already lost them. But staffing a live chat team 24/7 costs a fortune, and most questions are the same five things asked different ways.</p><p>Nexora's live chat is AI-first, human-backed. When a visitor opens the chat, AI responds instantly with accurate, helpful answers drawn from your knowledge base. It handles product questions, pricing inquiries, order lookups, and technical troubleshooting in real time. For sales conversations, it qualifies leads and books meetings. When a conversation needs a human touch, it routes to the right agent with full context. Your visitors get instant help. Your sales team gets qualified leads. Your support team handles fewer interruptions. One widget, three wins.</p>",
    cta_text: "Try Live Chat Free",
    cta_url: "#",
    meta_description: "Nexora live chat software combines AI and human agents for instant, 24/7 customer support. Answer questions, capture leads, resolve issues in real time.",
    status: "published"
  },
  {
    title: "Customer Support For Ecommerce — Nexora",
    slug: "customer-support-for-ecommerce",
    keyword: "customer support for ecommerce",
    h1: "Ecommerce Support That Drives Revenue",
    subheadline: "Resolve \"where's my order\" in seconds. Convert browsing shoppers into buyers. Scale without hiring.",
    body_copy: "<p>Ecommerce support is 80% the same questions on repeat: Where's my order? Can I return this? Do you ship to my country? What size should I get? Your support team answers these hundreds of times a day while the interesting problems — and the revenue-generating conversations — get buried in the queue. Meanwhile, potential buyers with pre-sale questions abandon their carts because nobody's there to answer.</p><p>Nexora is built for ecommerce. It plugs into Shopify, WooCommerce, and your shipping providers to answer order status, return, and tracking questions automatically. No human needed. Pre-sale questions get AI-powered instant answers that keep shoppers moving toward checkout. Product recommendations, size guides, shipping estimates — all handled in real time. Nexora even detects high-value customers and VIPs, routing them to your best agents. The result: fewer tickets, higher conversion, and a support team that focuses on the 20% of conversations that actually need them.</p>",
    cta_text: "Start Free Trial",
    cta_url: "#",
    meta_description: "Nexora is customer support for ecommerce. Auto-resolve order questions, convert shoppers with instant answers, and scale support without hiring.",
    status: "published"
  },
  {
    title: "AI Ticketing System — Nexora",
    slug: "ai-ticketing-system",
    keyword: "ai ticketing system",
    h1: "A Ticketing System That Solves Tickets",
    subheadline: "Auto-classify, auto-route, auto-resolve. Nexora turns your ticket queue into a ticket solution engine.",
    body_copy: "<p>Traditional ticketing systems are filing cabinets with a search bar. Tickets come in, get tagged, sit in a queue, and wait for a human to read them. The system doesn't understand the ticket, doesn't know who should handle it, and certainly doesn't try to resolve it. You're paying for organization, not resolution. And as volume grows, you just hire more people to read more tickets.</p><p>Nexora rethinks ticketing from the ground up. Every incoming ticket is read by AI that understands intent, urgency, and sentiment. Simple issues are resolved immediately — no queue, no wait. Complex issues are classified, prioritized by business impact, and routed to the agent with the right skills and availability. Duplicate tickets are merged automatically. Trending issues trigger alerts before they become incidents. Your agents see a queue of pre-triaged, context-rich tickets instead of a wall of unread emails. Resolution times drop. Agent satisfaction goes up. And your ticketing system finally earns its subscription fee.</p>",
    cta_text: "Start Free Trial",
    cta_url: "#",
    meta_description: "Nexora is an AI ticketing system that auto-classifies, auto-routes, and auto-resolves support tickets. Smarter queues, faster resolution. Try free.",
    status: "published"
  },
  {
    title: "Customer Support For SaaS — Nexora",
    slug: "customer-support-for-saas",
    keyword: "customer support for saas",
    h1: "SaaS Support That Reduces Churn",
    subheadline: "Turn support from a cost center into a retention engine. AI that saves accounts, not just closes tickets.",
    body_copy: "<p>In SaaS, support isn't just about answering questions — it's about keeping customers. Every unanswered ticket is a churn risk. Every slow response erodes trust. Every \"I'll escalate this\" without follow-through pushes someone closer to canceling. Your support team isn't just solving problems — they're fighting for revenue. But most support tools don't understand that context.</p><p>Nexora is customer support built for SaaS economics. It integrates with your product data to understand each customer's health score, plan tier, and usage patterns. High-value accounts get priority routing. At-risk customers get proactive outreach. AI handles onboarding questions, feature explanations, and technical troubleshooting so your team can focus on the conversations that directly impact retention and expansion. Track support-influenced churn, measure time-to-value, and identify product gaps from ticket patterns. Nexora turns support data into retention intelligence.</p>",
    cta_text: "Try It Free",
    cta_url: "#",
    meta_description: "Nexora is customer support for SaaS companies. AI-powered ticket resolution, churn prevention, and retention analytics. Reduce churn, not headcount.",
    status: "published"
  },
  {
    title: "Automated Customer Support — Nexora",
    slug: "automated-customer-support",
    keyword: "automated customer support",
    h1: "Automate Support Without Losing the Human Touch",
    subheadline: "Nexora automates the repetitive work so your team can be more human where it counts.",
    body_copy: "<p>Automation in customer support has a bad reputation — and honestly, it's deserved. Most automation means phone trees nobody wants to navigate, chatbots that can't understand plain English, and canned responses that make customers feel like a ticket number. The goal was efficiency, but the result was frustration. No wonder people mash zero to get a human.</p><p>Nexora automates differently. It handles the genuinely repetitive stuff — order status checks, password resets, billing questions, feature how-tos — with AI that actually understands the question and gives a real answer. Not a menu. Not a link to your help center. A real, contextual, helpful response. And for everything the AI can't handle, it creates a seamless handoff to a human agent who has the full conversation history and a suggested response ready to go. Your customers never feel like they're talking to a robot. Your agents never feel like they are one. That's automation done right.</p>",
    cta_text: "Start Free Trial",
    cta_url: "#",
    meta_description: "Nexora delivers automated customer support that actually works. AI resolves repetitive issues while keeping the human touch for complex conversations.",
    status: "published"
  }
];

async function checkExistingPage(slug) {
  try {
    const res = await axios.get(
      `${STRAPI_URL}/api/landing-pages?filters[slug][$eq]=${encodeURIComponent(slug)}`,
      { headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` } }
    );
    const data = res.data.data || [];
    return data.length > 0 ? data[0] : null;
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

async function deletePage(documentId) {
  await axios.delete(
    `${STRAPI_URL}/api/landing-pages/${documentId}`,
    {
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
    }
  );
}

async function main() {
  console.log(`\n🚀 Nexora Landing Page Seeder`);
  console.log(`   Pages to create: ${pages.length}`);
  console.log(`   Strapi: ${STRAPI_URL}\n`);

  // Check for --clean flag to wipe existing pages first
  if (process.argv.includes("--clean")) {
    console.log("🧹 Cleaning existing pages...\n");
    try {
      const res = await axios.get(
        `${STRAPI_URL}/api/landing-pages?pagination[pageSize]=100`,
        { headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` } }
      );
      const existing = res.data.data || [];
      for (const page of existing) {
        await deletePage(page.documentId);
        console.log(`   Deleted: /${page.slug}`);
      }
      console.log(`   Removed ${existing.length} page(s)\n`);
    } catch (err) {
      console.log(`   Warning: Could not clean pages — ${err.message}\n`);
    }
  }

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const progress = `[${i + 1}/${pages.length}]`;

    const existing = await checkExistingPage(page.slug);
    if (existing) {
      console.log(`${progress} ⏭  Skipped (exists): /${page.slug}`);
      skipped++;
      continue;
    }

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
  console.log(`📊 Summary: ${created} created, ${skipped} skipped, ${failed} failed`);
  console.log(`────────────────────────────────\n`);
}

main();
