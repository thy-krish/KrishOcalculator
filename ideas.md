# Calculator Design Brief

## Three Direction Options

### Theme Name: Acid-Pop Lab
Very bright, editorial, and playful: a math instrument reimagined as a sticker-covered studio desk. It uses warm paper, electric chartreuse, and ink-black type to make equations feel approachable and expressive.

**Probability:** 0.03

### Theme Name: Midnight Debug
A dark, fast, and slightly mischievous interface with electric accents and terminal-like precision. It treats each calculation like a tiny command-line win, using restrained glow only where it reinforces state and focus.

**Probability:** 0.08

### Theme Name: Soft Geometry
A calm, tactile calculator inspired by contemporary Swiss posters and molded industrial objects. It pairs a cool mineral base with a saturated coral signature color, letting spacing, shape, and typography do the visual work.

**Probability:** 0.06

## Chosen Direction: Acid-Pop Lab

### Design Movement
Neo-editorial maximalism with references to 1990s zines, modern risograph print, and playful lab notebook marginalia.

### Core Principles
1. Make every control feel touchable, immediate, and unmistakably interactive.
2. Treat utility copy as personality: concise, self-aware, and never at the expense of clarity.
3. Use asymmetry and layered cards to create a sense of a living workbench rather than a centered generic app shell.
4. Keep scientific functionality rigorous beneath an intentionally expressive surface.

### Color Philosophy
The base is a warm, lightly textured paper tone so the product feels like a notebook users want to keep open. Ink-black text creates high legibility and authority. Electric chartreuse is the signature color: it signals the active calculation and gives the calculator a memorable visual hook. Cobalt and coral are used as secondary annotations, separating scientific modes from playful feedback without turning the palette into a gradient spectacle.

### Layout Paradigm
An asymmetric two-column workbench: a tall calculation surface anchors the left side, while a narrower “lab notes” rail on the right holds mode controls, memory, history, and tips. On small screens the rail becomes a compact drawer-like section below the keypad. Large display typography and offset labels echo a poster pinned to a studio wall.

### Signature Elements
- A chartreuse “equals” key with a small audio-ready waveform badge.
- Offset index-card panels with handwritten-style micro-labels such as “ANGLE MODE” and “LAST MOVES”.
- Tiny cobalt and coral annotation marks that act like marginalia around important controls.

### Interaction Philosophy
Every press should feel like a physical button: fast, slightly springy, and visibly acknowledged. Keyboard input is first-class. Mode changes stay obvious through compact badges, while destructive actions ask for less attention than the main calculation flow. The future audio note is represented as an intentional affordance, not a fake sound effect.

### Animation
Use 120–180ms press feedback with a 0.97 scale, a crisp ease-out, and no layout shift. Let the result line slide in by a few pixels and fade only on equals, with reduced-motion support. History items should enter with a short stagger only when newly added. Never animate every key continuously; the calculator should feel snappy, not noisy.

### Typography System
Use **Space Grotesk** for display numbers, headings, and labels: wide, geometric, and slightly playful. Use **DM Sans** for explanatory copy, controls, and history details. Numbers use tabular figures and tight tracking; labels use compact uppercase with generous letter spacing. Avoid default Inter styling.

### Brand Essence
A scientific calculator for curious people who want serious math without serious vibes; different because the interface behaves like a personal math workbench instead of a cold utility.

**Personality:** curious, punchy, grounded.

### Brand Voice
Headlines should be short, observant, and a little cheeky. CTAs should name the action plainly. Microcopy should reward attention without pretending the math is a meme.

- Example headline: “Make the numbers behave.”
- Example microcopy: “Degrees on. Your trig is feeling seen.”

### Wordmark & Logo
A compact “KRISHOTATOR” wordmark set in Space Grotesk with the slash treated as a cobalt divider. The mark is a bold chartreuse square containing a black four-point “spark” made from calculator operators (+, −, ×, ÷) abstracted into a single symbol; it should work as a favicon without text.

### Signature Brand Color
**Lab Lime — `#D7F84A`**. It is bright enough to own the interaction layer, warm enough to belong with paper and coral, and distinctive without relying on a neon cyberpunk look.

### Style Decisions
- Prefer warm paper, ink, chartreuse, cobalt, and coral over purple gradients or generic blue UI.
- Keep the primary layout asymmetric and workbench-like.
- Keep the short “bruh” audio on equals as a visible, accessible affordance; avoid extra background beats or bass layers.

## Style Decisions

- The KRISHOTATOR logo mark is presented as a Lab Lime square with a dark operator-spark silhouette so the signature color owns the first-glance brand moment.
- Lab Lime remains reserved for primary interaction and active math state; coral and cobalt stay annotation/support colors.
- Equals plays only the short “bruh” cue through its natural end; the visible waveform remains as the audio affordance and no bass layer is played.
