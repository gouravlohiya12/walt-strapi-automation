require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const axios = require("axios");

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const pages = [
  {
    title: "AI Project Management Tool — BrightFlow",
    slug: "ai-project-management-tool",
    keyword: "ai project management tool",
    h1: "Project Management That Thinks Ahead",
    subheadline: "BrightFlow uses AI to prioritize tasks, predict bottlenecks, and keep your team shipping on schedule.",
    body_copy: "<p>Project management tools have barely changed in a decade. You still manually drag cards, update statuses, and chase people for updates. Meanwhile, deadlines slip, priorities shift, and nobody has a clear picture of what's actually on track. The tool that was supposed to create order is just another thing to maintain.</p><p>BrightFlow is different. It's a project management tool with AI at its core — not bolted on as an afterthought. BrightFlow watches your team's workflow and automatically reprioritizes tasks when deadlines shift. It flags blockers before they stall a sprint. It tells you which projects are at risk based on velocity patterns, not gut feelings. Ask it \"What should the team focus on this week?\" and get an answer backed by data. Less time managing the tool, more time doing the work.</p>",
    cta_text: "Start Free Trial",
    cta_url: "#",
    meta_description: "BrightFlow is the AI project management tool that auto-prioritizes tasks, predicts bottlenecks, and helps your team ship faster. Try it free.",
    status: "published"
  },
  {
    title: "Project Management For Startups — BrightFlow",
    slug: "project-management-for-startups",
    keyword: "project management for startups",
    h1: "Ship Fast Without the Chaos",
    subheadline: "Built for lean teams that move fast. No enterprise bloat, no month-long setup — just clarity.",
    body_copy: "<p>When you're a 10-person startup, everyone wears five hats. You don't have a dedicated project manager, and you definitely don't have time to learn a complex tool with 200 features you'll never use. But without some system, things fall through the cracks — tasks get duplicated, deadlines get missed, and the weekly standup becomes a 45-minute confusion session.</p><p>BrightFlow was built for teams like yours. Set it up in five minutes, import from Notion or Trello if you want, and let AI handle the overhead. BrightFlow auto-assigns priorities based on your sprint goals, sends smart reminders before things slip, and gives founders a real-time view of what every team member is working on. No gantt charts nobody reads. No permission matrices. Just a clean workspace that helps small teams punch above their weight.</p>",
    cta_text: "Get Started Free",
    cta_url: "#",
    meta_description: "BrightFlow is project management built for startups. Fast setup, AI-powered prioritization, and zero bloat. Get your lean team shipping faster.",
    status: "published"
  },
  {
    title: "Project Management For Remote Teams — BrightFlow",
    slug: "project-management-for-remote-teams",
    keyword: "project management for remote teams",
    h1: "Keep Your Remote Team Aligned, Not Micromanaged",
    subheadline: "Async-first project management with AI that bridges time zones and keeps work flowing.",
    body_copy: "<p>Remote work broke the old playbook. You can't tap someone on the shoulder to ask about a task. You can't read the room in a standup that half the team joins at midnight their time. Traditional project management tools assume everyone's in the same office — they weren't designed for teams spread across four continents and eight time zones.</p><p>BrightFlow is built async-first. Every task has full context — goals, dependencies, decisions, and discussions — so anyone can pick up work without a Slack thread. AI generates daily progress summaries for each time zone, flags tasks that are blocked or stalling, and automatically adjusts priorities when scope changes. Managers get visibility without micromanaging. Team members get clarity without meetings. Whether your team is fully remote or hybrid, BrightFlow makes distance disappear.</p>",
    cta_text: "Try It Free",
    cta_url: "#",
    meta_description: "BrightFlow is async-first project management for remote teams. AI-powered updates, smart prioritization, and full visibility across time zones.",
    status: "published"
  },
  {
    title: "Free Project Management Software — BrightFlow",
    slug: "free-project-management-software",
    keyword: "free project management software",
    h1: "Free Project Management That Actually Works",
    subheadline: "No credit card. No limits on projects. Just a powerful workspace with AI built in.",
    body_copy: "<p>Most free project management tools are either too basic to be useful or so limited they're just a gateway to an upsell. You hit the user cap in a week, the features you actually need are paywalled, and suddenly you're paying $15/user/month for something that's barely better than a shared spreadsheet.</p><p>BrightFlow's free tier is genuinely generous — unlimited projects, up to 10 team members, and full access to AI features. Create tasks, set deadlines, track progress, and let BrightFlow's AI handle prioritization and smart reminders. No storage limits on attachments, no feature gates that cripple your workflow. We built the free plan to be a real tool, not a demo. When your team grows beyond 10, upgrade for more seats and advanced analytics. But for most small teams, free is all you'll ever need.</p>",
    cta_text: "Start Free",
    cta_url: "#",
    meta_description: "BrightFlow offers free project management software with AI features, unlimited projects, and up to 10 users. No credit card, no catch.",
    status: "published"
  },
  {
    title: "AI Task Management — BrightFlow",
    slug: "ai-task-management",
    keyword: "ai task management",
    h1: "Tasks That Manage Themselves",
    subheadline: "BrightFlow's AI auto-prioritizes, assigns, and tracks tasks so your team can focus on real work.",
    body_copy: "<p>You create a task. You assign it. You set a due date. Then you spend the rest of the week following up — is it started? Is it blocked? Did the priority change because of that new client request? Task management shouldn't be a full-time job, but for most teams it secretly is. Someone is always updating boards, chasing statuses, and reshuffling priorities.</p><p>BrightFlow automates the busywork. When a new task comes in, AI evaluates urgency, team capacity, and existing deadlines to suggest the right owner and priority. As work progresses, BrightFlow detects when tasks are at risk and nudges the right people. It learns your team's patterns — who's fastest at what, which tasks tend to get stuck — and gets smarter over time. You still make the decisions. BrightFlow just makes sure nothing falls through the cracks while you do.</p>",
    cta_text: "Start Free Trial",
    cta_url: "#",
    meta_description: "BrightFlow is AI task management that auto-prioritizes, assigns, and tracks work. Less overhead, fewer dropped balls, faster delivery.",
    status: "published"
  },
  {
    title: "Project Management For Agencies — BrightFlow",
    slug: "project-management-for-agencies",
    keyword: "project management for agencies",
    h1: "Manage Every Client. Ship Every Deadline.",
    subheadline: "One workspace for all your clients — with AI that keeps projects on track and teams at capacity.",
    body_copy: "<p>Agency project management is a special kind of chaos. You're juggling 15 clients, each with their own timelines, deliverables, and feedback cycles. Your team is split across accounts, and nobody knows who has bandwidth until someone misses a deadline. The tools built for product teams don't work when every week brings a different mix of projects.</p><p>BrightFlow is built for agencies. Create separate workspaces per client, track time and deliverables in one view, and let AI balance workloads across your team. BrightFlow knows who's overloaded and who has capacity. It flags projects where timelines are slipping and suggests resource shifts before deadlines are at risk. Give clients a read-only portal to check progress — no more weekly status emails. Scale your agency without scaling your overhead.</p>",
    cta_text: "Start Free Trial",
    cta_url: "#",
    meta_description: "BrightFlow is project management built for agencies. Manage multiple clients, balance workloads with AI, and never miss a deadline.",
    status: "published"
  },
  {
    title: "Team Collaboration Tool — BrightFlow",
    slug: "team-collaboration-tool",
    keyword: "team collaboration tool",
    h1: "Collaboration Without the Noise",
    subheadline: "Replace scattered Slack threads and lost docs with one workspace where work actually happens.",
    body_copy: "<p>Your team uses Slack for communication, Google Docs for documents, Figma for designs, Jira for tasks, and email for everything that falls through the cracks. Context is everywhere and nowhere. Decisions get made in threads nobody can find. Files live in three different places. And every new project starts with the same question: \"Where should we put this?\"</p><p>BrightFlow is a collaboration tool that puts tasks, discussions, files, and decisions in one place — attached to the work, not scattered across apps. Comment directly on tasks. Share files where they're relevant. Make decisions and have them automatically logged so nobody asks \"wait, did we decide that?\" three weeks later. AI summarizes long threads, highlights action items from discussions, and keeps everyone on the same page — literally. Less tool-switching, less context-switching, more shipping.</p>",
    cta_text: "Try BrightFlow Free",
    cta_url: "#",
    meta_description: "BrightFlow is a team collaboration tool that combines tasks, docs, and discussions in one AI-powered workspace. Less noise, more progress.",
    status: "published"
  },
  {
    title: "Project Planning Software — BrightFlow",
    slug: "project-planning-software",
    keyword: "project planning software",
    h1: "Plan Projects in Minutes, Not Meetings",
    subheadline: "Describe your project and let AI build the plan — tasks, timelines, dependencies, and milestones.",
    body_copy: "<p>Project planning is supposed to set you up for success, but most teams spend more time planning than executing. You're in a room with a whiteboard, mapping dependencies, estimating timelines, and negotiating scope — only to have the plan fall apart two weeks in when reality hits. The gap between the plan and the work is where projects go to die.</p><p>BrightFlow reimagines planning. Describe your project in plain English — \"Launch the new marketing site by end of Q2, involves design, copy, dev, and QA\" — and BrightFlow's AI generates a structured plan with tasks, dependencies, milestones, and realistic timelines based on your team's historical velocity. Adjust anything, drag to reschedule, and watch the entire plan update intelligently. As work progresses, BrightFlow continuously re-forecasts your delivery date. Plans that stay alive, not plans that collect dust.</p>",
    cta_text: "Start Planning Free",
    cta_url: "#",
    meta_description: "BrightFlow is project planning software with AI. Describe your project and get an instant plan with tasks, timelines, and dependencies. Try free.",
    status: "published"
  },
  {
    title: "Project Management For Small Business — BrightFlow",
    slug: "project-management-for-small-business",
    keyword: "project management for small business",
    h1: "Run Your Business, Not Your Project Tool",
    subheadline: "Simple, powerful project management that small teams actually stick with. AI handles the rest.",
    body_copy: "<p>Small business owners don't need a project management certification — they need their team to stop dropping the ball. You've tried spreadsheets, sticky notes, maybe even a tool like Monday or Asana. But those tools are built for project managers, not for the restaurant owner tracking a renovation, the marketing agency managing five clients, or the contractor coordinating three crews.</p><p>BrightFlow is project management that stays out of your way. Create projects in seconds, add tasks with due dates, and let AI handle reminders and prioritization. No training required — if you can use a to-do list, you can use BrightFlow. It tracks what your team is working on, alerts you when something's overdue, and gives you a simple dashboard showing where everything stands. Built for people who run businesses, not Gantt charts.</p>",
    cta_text: "Try It Free",
    cta_url: "#",
    meta_description: "BrightFlow is project management for small business. Simple setup, AI-powered task tracking, and zero learning curve. Free to start.",
    status: "published"
  },
  {
    title: "Agile Project Management Tool — BrightFlow",
    slug: "agile-project-management-tool",
    keyword: "agile project management tool",
    h1: "Agile That Adapts as Fast as You Do",
    subheadline: "Sprints, kanban, backlog — plus AI that spots blockers and keeps velocity high.",
    body_copy: "<p>Your team does agile. Sort of. You have sprints, but planning takes half a day. You have a backlog, but it's 400 items nobody's groomed in months. You do retros, but the same problems come up every two weeks. The agile tools on the market give you boards and burndown charts, but they don't actually help you get better at agile.</p><p>BrightFlow is an agile project management tool with AI that actively improves your process. It auto-generates sprint plans based on backlog priority and team capacity. It monitors velocity in real-time and flags when a sprint is at risk — not after the fact, but while there's still time to adjust. It analyzes retro patterns and suggests specific process changes. Kanban or scrum, your choice. BrightFlow supports both with views that adapt to how your team actually works. Stop doing agile theatre. Start shipping with real agility.</p>",
    cta_text: "Start Free Trial",
    cta_url: "#",
    meta_description: "BrightFlow is an agile project management tool with AI-powered sprint planning, real-time velocity tracking, and smart backlog grooming. Try free.",
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
  console.log(`\n🚀 BrightFlow Landing Page Seeder`);
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

    // Check for existing
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
