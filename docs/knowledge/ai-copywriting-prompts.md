# AI Copywriting Prompts

Mental templates the AI should follow when generating each section of a page.

These are NOT prompts to send to another model — they're prompt patterns YOU (the AI) should run mentally when generating each field.

## Inputs you always have

When generating, you've already collected:
- `client.business_type` — what the brand does
- `client.audience` — who they sell to (general)
- `page.target_audience` — who this page sells to (specific)
- `page.keyword` — the search term this page targets

Use ALL FOUR. Don't generate copy that ignores any of them.

## Hero section prompts

### H1
Write a 6-12 word ALL CAPS headline that promises the outcome `{target_audience}` wants when searching for `{keyword}`. Use 2 lines (insert `<br>` mid-way). Avoid "discover", "unlock", "master".

Best patterns:
- "HOW TO [DO X]<br>[WITHOUT Y]"
- "THE [SYSTEM NAME] FOR<br>[OUTCOME]"
- "[BENEFIT] FOR<br>[SPECIFIC AUDIENCE]"

### H1 sub (italic parens)
Address 2-3 objections that the audience has when considering this kind of solution. Format: `(Without the X, Y, or Z)` or `(Even if X)`.

Examples:
- "(Without hiring a developer)"
- "(Without the trial-and-error or wasted weekends)"
- "(Even if you've never built a funnel)"

### Hero body
1 sentence. Names the system AND the outcome AND who it's for. Pattern:
> "The step-by-step system to [outcome] using [method] — even if [common objection]."

### CTA text
Action verb + offer. Include price in parens if there's a discount play.
> "START THE CONVERSATION ($197 $99 TODAY)"

## Gold-standard section prompts

### Intro paragraph
Write a 25-30 word paragraph using this pattern:
> "Wherever your [audience-noun] learns about [topic-noun] first becomes their 'gold standard' — the [authority/default/reference] they compare everything else to."

Adapt the nouns to fit. The structure must stay.

### 4 options
4 short labels, 2-4 words each. First 3 are the "wrong" options the audience currently has. The 4th is "Or [client-side]?" — positive framing.

Pattern by industry:
- **Course/coaching**: "[Random] Tutorials? / [Generic] Books? / [Lazy] Tools? / Or A Real System?"
- **B2B SaaS**: "[Spreadsheets]? / [Manual Process]? / [Offshore Team]? / Or [Brand]?"
- **Education**: "Just [Studying Alone]? / [Generic Coursework]? / [YouTube]? / Or [The Brand]?"

### "The Truth:" paragraph
30-35 words. Acknowledges the audience's inadequacy ("most [X] feel..."). Reframes silence/inaction as a choice. Names the consequence of inaction.

## Myth section prompts

### Myth title
"[Common Belief] is a Myth." — 3-5 words.

Examples:
- "'Productivity Tools' Are a Myth."
- "'The Talk' is a Myth."
- "'Doing It Yourself' is a Myth."

### 3 columns
Always Old Way / New Way / The Goal. Each ~20-25 words.

| Column | Tone |
|---|---|
| Old Way | Concrete, painful, named with specifics |
| New Way | The contrast — fluid, simple, repeatable |
| The Goal | Aspirational outcome — what life looks like after |

## Course intro section prompts

### H3 (uppercase)
ALL CAPS. Format:
> "AN N-EPISODE/MODULE/STEP [PRODUCT TYPE] FOR [SPECIFIC AUDIENCE]."

Examples:
- "AN 8-EPISODE ON-DEMAND COURSE FOR SMALL BUSINESS OWNERS WITH 5–50 EMPLOYEES."
- "A 4-MODULE WORKSHOP FOR FIRST-TIME FOUNDERS RAISING SEED."

### Body
1-2 sentences contrasting "just X" with "X + the missing piece."
> "We don't just give you the [obvious thing]. We give you the [missing piece] and the [posture/framework] to [outcome]."

### Core Philosophy h5
"Our Core Philosophy:" — 3 words. Don't get fancy.

### Core Philosophy body
2-3 sentences. The underlying belief. Often a mini-manifesto. Should cause a "huh, never thought about it that way" reaction.

## Roadmap prompts

### Roadmap title
"Your Roadmap to [Destination]" — 4-6 words.
- "Your Roadmap to Confidence"
- "Your Path to [Outcome]"
- "The [Brand] Method"

### Roadmap items (8-10 of them)
For each:
- **Number**: "01.", "02.", etc. (zero-padded)
- **Title**: "Episode N: [Compelling Question or Outcome]? (X minutes)" — duration only if real
- **Body**: 1 sentence. NOT a topic list. Sells the takeaway.

Question patterns for titles work especially well:
- "What If [Worst Fear]?"
- "How Do I [Real Question]?"
- "Why Does [Common Pattern]?"
- "When Should I [Decision Point]?"

## Guides section prompts

**ASK THE USER for real names + roles + bios. Never fabricate.**

If they give you names, format each:
- **Name**: as-given
- **Role**: short title (max 8 words)
- **Bio**: 1 sentence (max 25 words). Lead with credibility, end with relatability.

Example:
> "Laurie Krieg" — "Director of Parent Programs" — "Mom of three boys, 15 years working with families on hard sexuality conversations."

## Pricing section prompts

### Section title
"Equip Yourself Today" / "Get Started" / "Join [Brand]" — emotional verb + reference.

### Bullets (3-4)
Each: short label + 1 sentence. Mix concrete (videos, docs) and accessible (easy, fast, anywhere).
- "8 Video Episodes:" / "Watch at your own pace."
- "Workflow Templates:" / "Cut-and-paste prompts for common tasks."
- "12-Month Access:" / "No rush, no expiration."

### Bonus column
Anything extra. Real things, not invented. ASK USER if unsure.

### Pricing tagline (italic)
1 sentence. Mission, not feature. Touches the "why we exist".
> "We're Building Better Businesses, One Owner at a Time."

## FAQ prompts

Generate 3-5 Q's. Mix:
1. **Qualification objection** — "Am I [too X / not X enough]?"
2. **Fit objection** — "What if my [situation] is different?"
3. **Risk objection** — "What if it doesn't work?"
4. **Money objection** — Worth it / payment plan / refund
5. **Logistics question** — Access duration, devices, format

For each answer:
- 30-50 words
- Validate → Reframe → Reassure with a specific
- Use `<em>` tags for emphasis sparingly

## Final CTA prompts

### Title
2-line, light-weight emotional headline. Pattern:
- "Your [Inaction Word] Is [Outcome Word]."
- "[Time Phrase] [Won't Wait/Doesn't Last/Is Now]."

Examples:
- "Your Silence Is an Answer."
- "Standing Still Is Falling Behind."
- "Yesterday's Method Won't Reach Tomorrow's Customers."

### Subtitle
ALL CAPS, bold. 2-3 short imperative sentences. Calls them to action.
> "STEP IN. TAKE THE LEAD. GIVE YOUR TEAM THE SYSTEM TO WORK SMARTER, NOT HARDER."

### Button
"Join The [Thing] $X $Y" — restates the offer one last time.

## Meta description

160 chars max. Include the keyword naturally in the first half. Sell the click — promise + price + audience.

> "Learn how to [outcome] without [objection]. {N}-episode on-demand course for [audience]. ${low} today (was ${high})."

## When you don't have enough info

NEVER fabricate the following — ASK the user:
- Real people's names (guides, experts)
- Real photos
- Specific numbers (subscriber counts, revenue claims)
- Specific testimonials
- Real prices (don't guess what they charge)
- Specific brand stories

ALWAYS feel free to generate fresh:
- Headlines + body copy
- FAQ questions + answers
- Reframing language
- Industry-agnostic patterns

## Voice and tone

Default tone: **warm, direct, modern, empathetic.**

Adjust by client:
- **Course / coaching**: more emotional, validating, mentor-like
- **B2B SaaS**: more practical, ROI-focused, time-respecting
- **Health / wellness**: gentle, non-judgmental, reassuring
- **Finance / law**: confident, plain, no jargon

Always avoid:
- Hype words ("revolutionary", "game-changing", "ultimate")
- Vague claims ("amazing results", "many people")
- Marketing speak ("solutions", "leverage", "synergy")
- Long sentences (over 25 words)
- Empty intensifiers ("very", "really", "truly")
