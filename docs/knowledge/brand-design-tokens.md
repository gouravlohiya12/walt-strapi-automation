# Brand Design Tokens

Translating "I want it to look [vibe]" into actual hex codes + font choices.

Use this when a user describes their brand without giving you specific colors/fonts.

## Color palettes by vibe

### Professional / corporate / trustworthy
- Primary: `#1F2833` (deep navy) or `#0F172A` (slate)
- Accent: `#3F7CAC` (steel blue) or `#1E40AF` (royal blue)
- Neutral: `#E5EBEA` (pale blue-gray)
- Background: `#FFFFFF`
- Text: `#1F2833`

### Modern SaaS / tech-forward
- Primary: `#0F172A` (near-black)
- Accent: `#7C3AED` (vivid purple) or `#0EA5E9` (sky blue)
- Neutral: `#F8FAFC` (off-white)
- Background: `#FFFFFF`
- Text: `#334155`

### Warm / educational / coaching
- Primary: `#1F2833` (deep navy)
- Accent: `#BF4E30` (warm orange/clay) — matches Christian Sexuality
- Neutral: `#E9D985` (mustard yellow)
- Secondary: `#439A86` (sea green)
- Background: `#FFFFFF`
- Text: `#73777b`

### Bold / energetic / fitness
- Primary: `#111827` (dark)
- Accent: `#DC2626` (vibrant red) or `#F97316` (orange)
- Neutral: `#FBBF24` (gold)
- Background: `#FFFFFF`
- Text: `#1F2937`

### Calm / health / wellness
- Primary: `#0F2A2E` (deep teal)
- Accent: `#0F8B8D` (teal) — matches CS palette page 5
- Neutral: `#FED7C3` (peach) or `#B098A4` (mauve)
- Background: `#FFFFFF`
- Text: `#374151`

### Premium / luxury / law / finance
- Primary: `#1F2833` (charcoal navy)
- Accent: `#B89B71` (gold) or `#8F250C` (deep brick red)
- Neutral: `#FAFAF9` (cream)
- Background: `#FFFFFF`
- Text: `#1F2833`

### Playful / kids / family
- Primary: `#1E3A8A` (deep blue)
- Accent: `#F59E0B` (amber) or `#EC4899` (pink)
- Neutral: `#FEF3C7` (light yellow)
- Background: `#FFFFFF`
- Text: `#1F2937`

### Minimal / artisan / handmade
- Primary: `#1C1917` (warm black)
- Accent: `#92400E` (terracotta) or `#374151` (slate)
- Neutral: `#FAFAF9` (off-white)
- Background: `#FFFFFF`
- Text: `#374151`

## Color rules to enforce

1. **Always 5 tokens**: primary, accent, neutral, background, text. No more, no less.
2. **Accent reserved for CTAs only.** Don't use it for body text or section backgrounds.
3. **Test contrast.** Text must be WCAG AA (4.5:1 for body, 3:1 for headlines). Reject combos that fail.
4. **Background should always be white or off-white.** Section coloring comes from full-bleed sections.
5. **Body text should always be dark on light or light on dark, never tinted.**

## Font pairings by vibe

### Modern SaaS
- Heading: `Inter` (700/800)
- Body: `Inter` (400)
- *Single-font approach reads contemporary*

### Coaching / education / warm
- Heading: `Poppins` (500/700/800) — current default
- Body: `Source Sans Pro` (400/600)
- *Geometric heading + humanist body for depth*

### Editorial / premium
- Heading: `Playfair Display` (400/700) or `Cormorant Garamond`
- Body: `Lato` or `Source Sans Pro`
- *Serif heading creates authority*

### Tech / developer
- Heading: `JetBrains Mono` or `IBM Plex Sans` (700)
- Body: `IBM Plex Sans` (400)
- *Mono accents signal precision*

### Lifestyle / fitness
- Heading: `Montserrat` (700/800)
- Body: `Open Sans` (400)
- *Strong heading + clean body for energy*

### Luxury / law
- Heading: `Cormorant Garamond` (500/700)
- Body: `Karla` or `Inter` (400)
- *Refined serif over modern body*

### Friendly / playful
- Heading: `Nunito` (700/800)
- Body: `Nunito Sans` (400)
- *Rounded letterforms for approachability*

## Loading fonts

All fonts above are available on Google Fonts. The template loads them via:

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700;800&family=Source+Sans+Pro:wght@400;600&display=swap" rel="stylesheet">
```

When a user picks new fonts, regenerate this `<link>` tag with the right family + weights.

## Logo guidance

- **SVG > PNG > JPG** — always prefer SVG (scales clean)
- **Max width 200px** in header (height auto)
- **If no logo provided, fall back to text logo** styled with the heading font
- **Footer logo can be a different version** (often white-on-dark variant)

## Hero image selection

When the client doesn't have a hero image:

- **For B2B/SaaS**: clean product mockup or abstract gradient — avoid stock people photos
- **For courses/coaching**: photo of the instructor (warm, authentic) or a relatable life moment
- **For physical products**: the product in use, in context
- **For services**: a metaphor for the outcome (not a person at a desk)

NEVER use:
- Stock photos of "diverse smiling team in office"
- AI-generated faces (uncanny valley)
- Photos with watermarks
- Generic flat illustrations of "people doing computer"

## Translating user descriptions

| User says | You suggest |
|---|---|
| "modern" | Tech / SaaS palette + Inter |
| "warm" | Education palette + Poppins |
| "professional" | Corporate palette + Inter |
| "premium" / "high-end" | Luxury palette + Cormorant |
| "friendly" / "approachable" | Friendly palette + Nunito |
| "energetic" / "bold" | Fitness palette + Montserrat |
| "minimal" / "clean" | Minimal palette + Inter or Karla |
| "trustworthy" | Corporate palette |
| "creative" / "artistic" | Custom — ask more |
| "fun" / "playful" | Friendly palette |

When in doubt, show 2-3 options and let them pick.

## Example: full token set

```json
{
  "colors": {
    "primary": "#1F2833",
    "accent": "#BF4E30",
    "neutral": "#E9D985",
    "secondary": "#439A86",
    "background": "#FFFFFF",
    "text": "#73777b"
  },
  "fonts": {
    "heading": "Poppins",
    "body": "Source Sans Pro"
  }
}
```

This is the Christian Sexuality / `_example` client palette. Most warm/educational brands can start here and tune.
