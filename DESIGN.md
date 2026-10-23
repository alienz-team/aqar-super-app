# عقار — Style Reference
> منصة عقارية حديثة بتصميم أنيق على خلفية دافئة

**Theme:** light

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

عقار (Aqar) تعمل كمنصة عقارية فاخرة: خلفية كريمية دافئة، تصميم أحادي اللون تقريباً، والصور العقارية هي المصدر الوحيد للألوان. اللوجو يتكون من مباني حديثة مع النص العربي "عقار" يظهر بشكل بارز كعنصر بصري رئيسي. كل شيء آخر يتراجع: خط Gill Sans الإنساني يضفي طابعاً أدبياً راقياً بينما Fira Mono يتعامل مع التسميات الصغيرة بأحرف كبيرة التي تُقرأ كبطاقات متحف مطبوعة. البطاقات تعيش على حافة الصفحة مع حدود رفيعة، بدون ظلال، بدون تعبئة، وشارات دائرية نصف قطرها 5px تطفو في الزاوية العلوية اليسرى من كل صورة. النظام صارم عمداً — لا توجد أزرار CTA ملونة، لا ألوان تمييز، لا تدرجات — حتى تصبح الهندسة المعمارية والمناظر الطبيعية في الصور العقارية العنصر التعبيري الوحيد على الشاشة.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#242429` | `--color-obsidian` | Primary text, icon strokes, hairline borders across the system — the workhorse dark that replaces pure black for a slightly warmer read |
| Parchment | `#f9f5f2` | `--color-parchment` | Page canvas, hero and footer backgrounds — warm off-white that signals editorial paper rather than digital default |
| Gallery White | `#ffffff` | `--color-gallery-white` | Card surfaces, image borders, badge backgrounds — the brighter neutral used to lift content off the parchment |
| Ink Black | `#000000` | `--color-ink-black` | Headings, navigation borders, and high-contrast typographic moments where maximum weight is needed |
| Graphite | `#3e3e3e` | `--color-graphite` | Body text, card metadata, and list items — softer than Obsidian for secondary reading copy |
| Ash Gray | `#919191` | `--color-ash-gray` | Muted heading accent and de-emphasized text — the quietest neutral, used for location subtitles and tertiary labels |
| Charcoal Deep | `#070707` | `--color-charcoal-deep` | Reserved for the heaviest display headlines where a hair more density than Ink Black is desired |

## Tokens — Typography

### Gill Sans — Primary typeface for all editorial copy and headings. The humanist warmth of Gill Sans is the signature — its slightly organic strokes and bookish personality carry the literary travel-magazine tone. 400 handles body and nav; 500 adds weight for sub-headings and card titles. The 64px/1.00 setting powers the monumental KOBU wordmark, where line-height matches font-size to let the letters bleed. · `--font-gill-sans`
- **Substitute:** Avenir, Proxima Nova, or Museo Sans
- **Weights:** 400, 500
- **Sizes:** 14px, 15px, 33px
- **Line height:** 1.00–1.43
- **Role:** Primary typeface for all editorial copy and headings. The humanist warmth of Gill Sans is the signature — its slightly organic strokes and bookish personality carry the literary travel-magazine tone. 400 handles body and nav; 500 adds weight for sub-headings and card titles. The 64px/1.00 setting powers the monumental KOBU wordmark, where line-height matches font-size to let the letters bleed.

### Fira Mono — Monospace for small uppercase labels — badges, navigation, and category tags. The fixed-width geometry and wide letter-spacing (0.167em–0.183em on 10–12px) read as printed museum tags, turning functional labels into typographic detail rather than UI chrome. · `--font-fira-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400, 500
- **Sizes:** 10px, 11px, 12px, 14px
- **Line height:** 1.25–2.00
- **Letter spacing:** 0.167em–0.183em on small labels (10–12px)
- **OpenType features:** `"tnum" on, "ss01" on`
- **Role:** Monospace for small uppercase labels — badges, navigation, and category tags. The fixed-width geometry and wide letter-spacing (0.167em–0.183em on 10–12px) read as printed museum tags, turning functional labels into typographic detail rather than UI chrome.

### Gill Sans MT Pro — Gill Sans MT Pro — detected in extracted data but not described by AI · `--font-gill-sans-mt-pro`
- **Weights:** 400, 500
- **Sizes:** 14px, 16px, 21px, 24px, 32px, 64px
- **Line height:** 1, 1.25
- **Role:** Gill Sans MT Pro — detected in extracted data but not described by AI

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing | Token |
|------|--------|--------|------|-------------|----------------|-------|
| label | — | — | 10px | 1.5 | 0.183px | `--text-label` |
| caption | — | — | 12px | 1.43 | 0.167px | `--text-caption` |
| body-sm | — | — | 15px | 1.43 | 0px | `--text-body-sm` |
| subheading | — | — | 21px | 1.25 | 0px | `--text-subheading` |
| heading-sm | — | — | 24px | 1.25 | 0px | `--text-heading-sm` |
| heading-lg | — | — | 33px | 1.2 | 0px | `--text-heading-lg` |
| display | — | — | 64px | 1 | 0px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 13 | 13px | `--spacing-13` |
| 15 | 15px | `--spacing-15` |
| 19 | 19px | `--spacing-19` |
| 20 | 20px | `--spacing-20` |
| 25 | 25px | `--spacing-25` |
| 28 | 28px | `--spacing-28` |
| 34 | 34px | `--spacing-34` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |
| 110 | 110px | `--spacing-110` |
| 119 | 119px | `--spacing-119` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 5px |
| images | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 60-80px
- **Card padding:** 0px
- **Element gap:** 10-15px

## Components

### Navigation Bar
**Role:** Top-of-page site navigation

Full-width bar with no background fill — text rests directly on the Parchment canvas. Left-aligned category links (فلل، شقق، أراضي، مشاريع، مدونة) in Fira Mono 12px, uppercase, letter-spacing 0.167em, Obsidian color. Centered عقار logo with buildings icon. Right-aligned search icon. A single 1px Obsidian hairline border runs along the bottom edge.

### Display Logo & Wordmark
**Role:** Brand identifier and hero anchor

The عقار logo featuring modern buildings architecture icon above Arabic text, displayed prominently. Logo uses Obsidian color (#242429) on Parchment background. The buildings icon shows geometric line-art style with three towers and crossed lines forming an X pattern above. The Arabic wordmark "عقار" sits below in a complementary Arabic typeface. The combined logo is centered and dominates the hero section. No background, no container — the logo sits directly on Parchment.

### Section Heading
**Role:** Introduces content groups

Gill Sans 33px, line-height 1.20, weight 400, color Obsidian. Followed by an optional descriptive paragraph in Graphite body copy at 16px. No decorative underline or ornament — the type size and weight do all the work.

### Property Card
**Role:** Primary content unit for properties, villas, and apartments

Image-first layout. Full-bleed photograph with no border-radius, sitting on Parchment. Below the image: property name in Gill Sans 21px weight 500 (supports Arabic text), location subtitle in Fira Mono 12px (Ash Gray, uppercase for English, regular case for Arabic, tracked), and price anchor right-aligned in the same monospace style with Arabic numerals or Eastern Arabic numerals. No card background, no shadow, no border — only whitespace separates the image from the text.

### Featured Badge
**Role:** Tags the first card in a collection

Fira Mono 10px, weight 500, uppercase, letter-spacing 0.183em. White background, Obsidian text, 5px border-radius. Positioned top-left, inset 10px from the image edge, with a small dot character prefix. A 1px Obsidian hairline border surrounds the badge.

### New Badge
**Role:** Flags recently added properties

Identical structure to the Featured Badge — Fira Mono 10px weight 500, uppercase, white fill, Obsidian text, 5px radius, hairline border — differentiated only by the word NEW.

### Price Tag
**Role:** Right-aligned price indicator on property cards

Fira Mono 12px, weight 400, uppercase, letter-spacing 0.071em, color Obsidian. Aligned to the right edge of the card text row. No background, no border — pure typographic punctuation.

### Back-to-Top Button
**Role:** Floating scroll-return control

Circular surface button (approx. 40px diameter), white fill with a 1px Obsidian hairline border, containing an upward chevron icon. Fixed to the bottom-right viewport edge. No shadow.

### View All Link
**Role:** Collection overflow link

Gill Sans 21px weight 400, Obsidian color, with a trailing arrow glyph (↗). No underline. Right-aligned at the end of a card group. Functions as the only navigational action in the system.

### Body Paragraph
**Role:** Editorial description copy

Gill Sans 16px, line-height 1.25, weight 400, color Graphite. Max-width constrained to roughly 480px for comfortable reading. No first-line indent, no drop cap.

### Search Icon
**Role:** Trigger for property search

Simple line-drawn magnifying glass in Obsidian, 16px, no background or border. Sits in the top-right of the navigation bar.

### Footer
**Role:** Bottom-of-page closing band

Full-width Parchment band with a 1px Obsidian top border. Contains minimal type in Fira Mono 12px, weight 400, uppercase, tracked. No CTA buttons, no newsletter form, no decorative graphics.

## Do's and Don'ts

### Do
- Display the عقار logo prominently with the buildings icon and Arabic wordmark as the hero element — this is the brand statement.
- Use Fira Mono with 0.167em–0.183em letter-spacing for every badge, label, and navigational item — the tracked monospace is the system’s only typographic accent.
- Place property card images full-bleed with zero border-radius and rely on whitespace, not borders or shadows, to separate elements.
- Let property photography be the sole source of color — keep all UI surfaces in the Parchment/Gallery White neutral range and never introduce an accent hue.
- Use 10–15px gaps between card elements and 60–80px between sections to maintain an editorial, unhurried reading rhythm.
- Support both Arabic and English text throughout the interface with appropriate RTL/LTR text direction.
- Right-align prices and View All links to create visual tension against left-aligned titles (adjust for RTL in Arabic layout).
- Treat borders as 1px Obsidian hairlines — they define structure without adding visual weight.

### Don't
- Never add a colored CTA button, filled accent, or gradient — Kobu has no primary action color; navigation happens through text and links.
- Never apply border-radius greater than 5px to any element — the system is sharp-edged, not soft.
- Never use shadows or elevation to separate surfaces — separation comes from whitespace and the Parchment vs Gallery White surface contrast.
- Never set a heading below weight 400 or above weight 500 — the typography is deliberately restrained and should never shout.
- Never add icon fills, illustrations, or decorative graphics to the UI — photography is the only visual content allowed beyond typography.
- Never use a sans-serif other than Gill Sans for headings or body, or a monospace other than Fira Mono for labels — the pairing is non-negotiable.
- Never introduce a new neutral or chromatic color into the palette; the monochrome discipline is the brand.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Parchment Canvas | `#f9f5f2` | Base page background — warm cream visible in hero, footer, and breathing space between content blocks |
| 2 | Gallery White | `#ffffff` | Elevated content surfaces — card backgrounds, image frames, badge fills |

## Elevation

Kobu deliberately avoids shadows and elevation effects. Separation between surfaces is achieved through the Parchment (#f9f5f2) vs Gallery White (#ffffff) contrast, hairline 1px borders in Obsidian (#242429), and generous whitespace. The only depth cue is the slight tonal difference between page canvas and card surface — no drop shadows, no glow effects, no layered panels. This flat treatment reinforces the editorial print aesthetic, where content sits on a page rather than floating in a digital interface.

## Imagery

Photography is the only expressive element in the Kobu system — the UI is deliberately monochrome so that architecture, interiors, and landscapes become the color. Images are large, full-bleed, and editorial in framing: golden-hour resort exteriors, interior details with warm tungsten light, and lush tropical foliage against modernist concrete. Treatment is natural and unfiltered — no overlays, no duotone, no vignettes. Cards present single photographs with no cropping masks or rounded corners. The relationship is gallery-catalogue: each image is an artifact displayed on parchment, not a thumbnail in a product grid. No illustrations, no icons beyond simple line glyphs, no abstract graphics — the photography IS the visual language.

## Layout

Full-width, full-bleed layout with no centered max-width container for the hero — the KOBU wordmark stretches to the viewport edges. Below the hero, content is loosely constrained to roughly 1200–1440px max-width with generous side margins. The navigation is a single thin top bar (not sticky in evidence) with text-only links. The property grid is intentionally asymmetric: cards vary in width and vertical position, creating an editorial collage feel rather than a uniform grid. The first card in each collection is significantly wider (full content-width) and carries a FEATURED badge; subsequent cards are smaller and offset. Sections are separated by whitespace rather than dividers, with a single hairline border under the navigation and before the footer. Density is comfortable — large images dominate, and text is sparse. No sidebar, no mega-menu, no sticky elements beyond the back-to-top button.

## Agent Prompt Guide

**Quick Color Reference**
- text: #242429 (Obsidian)
- background: #f9f5f2 (Parchment)
- surface: #ffffff (Gallery White)
- border: #242429 (Obsidian hairline)
- muted text: #3e3e3e (Graphite) / #919191 (Ash Gray)
- primary action: no distinct CTA color

**Example Component Prompts**

1. Create a navigation bar: full-width, no background fill, Parchment canvas (#f9f5f2). Left-aligned links in Fira Mono 12px, uppercase for English (e.g., PROPERTIES), normal case for Arabic (e.g., عقارات), letter-spacing 0.167em, color Obsidian (#242429). Centered عقار logo with buildings icon. Right-aligned search icon. Bottom border: 1px solid #242429.

2. Create a property card: full-bleed photograph (no border-radius) as the top element. Below: property name in Gill Sans 21px weight 500, color Obsidian (#242429), supports Arabic text. Location in Fira Mono 12px uppercase for English/letter-spacing 0.167em, normal case for Arabic, color Ash Gray (#919191). Price right-aligned in Fira Mono 12px with Arabic or Eastern Arabic numerals, color Obsidian (#242429). No card background, no shadow, no border. 10px gap between name and location.

3. Create a featured badge: Fira Mono 10px weight 500, uppercase, letter-spacing 0.183em. White (#ffffff) background, Obsidian (#242429) text, 5px border-radius, 1px Obsidian hairline border. Padding 5px 10px. Positioned top-left of an image, inset 10px. Prefix with a small dot character.

4. Create a section heading: Gill Sans 33px, line-height 1.20, weight 400, color Obsidian (#242429). Optional supporting paragraph below in Gill Sans 16px, line-height 1.25, color Graphite (#3e3e3e), max-width 480px. 60px space below heading before content begins.

5. Create a footer band: full-width Parchment (#f9f5f2) background. Top border: 1px solid Obsidian (#242429). Content in Fira Mono 12px, weight 400, uppercase, letter-spacing 0.071em, color Obsidian. No buttons, no forms, no decorative elements.

## Typographic Discipline

Kobu's typography follows a strict two-family system. Gill Sans carries all editorial voice — its humanist warmth, visible in the curved 'o' and the bracketed serifs of its capitals, sets the literary travel-magazine tone. Fira Mono handles all functional labeling — its geometric monospace forms, set uppercase with aggressive tracking (0.167em–0.183em), read as printed museum tags rather than UI chrome. The 64px display setting (line-height 1.00) is reserved exclusively for the KOBU wordmark. No other element should approach this scale. The transition from display to body passes through 33px → 24px → 21px → 16px, a smooth editorial gradient with no abrupt jumps. Body text never goes below 14px, and micro-labels (badges) cap at 10px.

## Surface & Border Language

The surface system is binary: Parchment (#f9f5f2) for the page canvas, Gallery White (#ffffff) for content surfaces. There is no third tier — no modal overlay color, no hover state shade. Borders are exclusively 1px solid Obsidian (#242429), used as hairlines to define structure (navigation bottom, card frames, badge outlines). No element uses border-radius greater than 5px (badges only). No element has a shadow. The result is a flat, print-like surface treatment where depth is implied through typographic scale and whitespace rather than visual effects.

## Similar Brands

- **Bayut** — Premium real estate platform with clean, minimal design and focus on property photography
- **Property Finder** — Modern real estate interface with emphasis on visual property presentation
- **Sotheby's International Realty** — Luxury property showcase with editorial photography and refined typography
- **The Audo** — Same architectural-gallery approach — single warm neutral canvas, humanist typeface, photography presented as curated artifacts rather than product thumbnails

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #242429;
  --color-parchment: #f9f5f2;
  --color-gallery-white: #ffffff;
  --color-ink-black: #000000;
  --color-graphite: #3e3e3e;
  --color-ash-gray: #919191;
  --color-charcoal-deep: #070707;

  /* Typography — Font Families */
  --font-gill-sans: 'Gill Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fira-mono: 'Fira Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-gill-sans-mt-pro: 'Gill Sans MT Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-label: 10px;
  --leading-label: 1.5;
  --tracking-label: 0.183px;
  --text-caption: 12px;
  --leading-caption: 1.43;
  --tracking-caption: 0.167px;
  --text-body-sm: 15px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0px;
  --text-subheading: 21px;
  --leading-subheading: 1.25;
  --tracking-subheading: 0px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: 0px;
  --text-heading-lg: 33px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 0px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: 0px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-28: 28px;
  --spacing-34: 34px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-110: 110px;
  --spacing-119: 119px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 60-80px;
  --card-padding: 0px;
  --element-gap: 10-15px;

  /* Border Radius */
  --radius-md: 5px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 5px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-parchment-canvas: #f9f5f2;
  --surface-gallery-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #242429;
  --color-parchment: #f9f5f2;
  --color-gallery-white: #ffffff;
  --color-ink-black: #000000;
  --color-graphite: #3e3e3e;
  --color-ash-gray: #919191;
  --color-charcoal-deep: #070707;

  /* Typography */
  --font-gill-sans: 'Gill Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fira-mono: 'Fira Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-gill-sans-mt-pro: 'Gill Sans MT Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-label: 10px;
  --leading-label: 1.5;
  --tracking-label: 0.183px;
  --text-caption: 12px;
  --leading-caption: 1.43;
  --tracking-caption: 0.167px;
  --text-body-sm: 15px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0px;
  --text-subheading: 21px;
  --leading-subheading: 1.25;
  --tracking-subheading: 0px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: 0px;
  --text-heading-lg: 33px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 0px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: 0px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-28: 28px;
  --spacing-34: 34px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-110: 110px;
  --spacing-119: 119px;

  /* Border Radius */
  --radius-md: 5px;
}
```
