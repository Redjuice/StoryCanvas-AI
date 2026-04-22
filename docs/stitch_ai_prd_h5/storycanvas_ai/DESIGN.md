# Design System Strategy: The Imaginative Canvas

## 1. Overview & Creative North Star
This design system is built upon the Creative North Star of **"The Digital Storyteller’s Canvas."** 

Unlike generic AI platforms that feel like cold tools, this system is designed to feel like a high-end, tactile pop-up book. We are moving away from the "Software as a Service" aesthetic and toward "Experience as an Art Form." We achieve this through **Layered Imagination**: a visual language that uses intentional asymmetry, overlapping surfaces, and soft tonal shifts to guide the user through the magical process of story creation.

The layout should feel "bouncy" but grounded. We break the rigid grid by allowing preview images to "peek" out of containers and using varying corner radii to distinguish between "tools" (functional) and "stories" (expressive).

---

## 2. Colors & Atmospheric Depth
Our palette balances professional stability with a sense of wonder. The goal is to avoid the "Fisher-Price" look by using sophisticated neutrals (`surface` tiers) to ground the energetic accents.

### The "No-Line" Rule
**Borders are prohibited for sectioning.** To define boundaries, you must use background color shifts.
- A card should sit on `surface_container_low` while its background is `surface_container_lowest`.
- Navigation bars should be defined by a shift from `surface` to `surface_container_high`, never by a divider line.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine paper.
- **Base Level:** `surface` (#f7f9fc)
- **Primary Layout Containers:** `surface_container` (#eceef1)
- **Interactive Elements/Cards:** `surface_container_lowest` (#ffffff) for maximum "lift."
- **Inactive/Recessed Areas:** `surface_container_highest` (#e0e3e6) to create a "punched-in" look for forms.

### The "Glass & Gradient" Rule
To add "soul," use subtle gradients for main CTAs, transitioning from `primary` (#5847d2) to `primary_fixed_dim` (#c6bfff). For floating AI generation panels, use **Glassmorphism**: 
- Background: `surface_container_lowest` at 70% opacity.
- Backdrop Blur: 20px.
- This ensures the vibrant colors of the generated book art bleed through the UI, making the app feel alive.

---

## 3. Typography: Editorial Clarity
We use **Plus Jakarta Sans** for its modern, rounded, and friendly geometric shapes. For Chinese language support, pair it with **PingFang SC** or **Noto Sans SC (Medium)** to maintain the soft-weighted, legible feel.

- **Display (display-lg/md):** Reserved for book titles and "Magic Moments." Use these to anchor the page with personality.
- **Headline (headline-sm):** Used for section titles in the creation dashboard.
- **Body (body-lg/md):** High legibility is key. Use `on_surface_variant` (#494458) for body text to reduce eye strain compared to pure black.
- **Labels (label-md):** Always in uppercase with slight letter-spacing to provide a "professional" counter-balance to the playful roundedness.

---

## 4. Elevation & Depth
In this system, depth is a functional tool, not just a decoration.

- **The Layering Principle:** Avoid shadows where possible. Achieve hierarchy by stacking:
  - Place a `surface_container_lowest` card on a `surface_container_low` background. The subtle contrast creates a natural, soft lift.
- **Ambient Shadows:** For "floating" elements like story previews or modal prompts, use a "Tinted Ambient Shadow":
  - Blur: 32px | Opacity: 6% | Color: `primary` (#5847d2). 
  - This mimics the way colored objects cast light in the real world.
- **The "Ghost Border" Fallback:** If a container is lost against its background, use a 1px border of `outline_variant` (#cbc3dc) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Cards (The Story Tiles)
- **Radius:** `lg` (2rem).
- **Style:** No borders. Use `surface_container_lowest` backgrounds. 
- **Interaction:** On hover, the card should scale (1.02x) and the shadow should slightly intensify using the `primary` tint.
- **Layout:** Images in cards should never be perfectly centered; use an offset "scrapbook" crop to emphasize creativity.

### Story Input Forms
- **Field Style:** Use `surface_container_low` (#f2f4f7) for the input background. 
- **Radius:** `md` (1.5rem).
- **States:** When focused, the background shifts to `surface_container_lowest` and a "Ghost Border" of `primary` (20% opacity) appears.
- **Chinese Input:** Ensure line-height for `body-lg` is set to 1.6 to accommodate the vertical complexity of Chinese characters.

### Buttons
- **Primary:** `full` (pill-shaped) radius. Gradient from `primary` to `primary_fixed_dim`. 
- **Secondary:** Transparent background with a `primary` label and a `primary` Ghost Border.
- **Padding:** Use spacing `4` (1.4rem) for horizontal padding to ensure the pill shape is distinct.

### Preview Grids
- **Constraint:** Forbid divider lines.
- **Separation:** Use Spacing `8` (2.75rem) between grid items. Use "Asymmetric Staggering"—every second column is offset by Spacing `5` (1.7rem) to mimic a physical gallery of sketches.

---

## 6. Do’s and Don'ts

### Do:
- **Use "White Space" as a Separator:** Let the background breathe. If two sections feel stuck together, increase spacing to `12` or `16`.
- **Embrace the Corner Scale:** Use `xl` (3rem) for hero sections and `sm` (0.5rem) for tiny functional tags. The contrast in roundness creates visual rhythm.
- **Micro-interactions:** When an AI image is generating, use a pulsing `secondary_container` (#ffdad8) background to indicate "life."

### Don't:
- **Don't Use Pure Black:** It breaks the "Imaginative Canvas" warmth. Use `on_background` (#191c1e) for text.
- **Don't Use Standard Grids:** Avoid 12-column rigid layouts for previewing books. Overlap images slightly to create a sense of depth and discovery.
- **Don't Use 100% Opacity Borders:** High-contrast lines create "visual noise" that distracts from the vibrant picture book art. Keep all borders "Ghost" style (under 20% opacity).