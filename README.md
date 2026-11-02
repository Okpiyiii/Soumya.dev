# soumya.dev

**Where Creativity Meets Results** — a single-page portfolio for **Soumyadeep Pal (Soumya)**, a
full-stack developer and ML/AI engineer.

Live: [soumya-dev-nine.vercel.app](https://soumya-dev-nine.vercel.app/)

---

## About this build

A hand-written, dependency-free portfolio: **HTML, CSS custom properties and vanilla JavaScript**.
No framework, no bundler, no build step, no backend. Everything you see is served as static files.

The visual language is deliberately restrained — **monochrome ink on paper, zero hue** — and it
ships in **both light and dark themes**, with a toggle in the nav.

---

## Sections

| Section | Content |
|---------|---------|
| **Hero** | "SOUMYA. CREATIVE VISION & CODE" typography, animated neural-network canvas, two overlay cards (ML & AI Engineering / Building Digital Solutions) |
| **Services** | ML & AI Engineering, Web Stack, Scalable Code — each with a description and skill tags |
| **Tech Stack** | Infinite marquee of Devicon tech icons over a blueprint line grid |
| **Featured Work** | 3 case studies with live links: Ambient Habit, Flowline CRM, ClusterCart |
| **About** | Bio, portrait, and stats (4+ hackathons, 6+ projects shipped) |
| **Contact** | Email, GitHub, LinkedIn |
| **Ask about Soumya** | Floating chat assistant that answers questions about this portfolio (see below) |

---

## Features

### Light / dark theming
The whole palette is a token layer (`--paper`, `--ink`, `--graphite`, `--rule`, …). Dark mode is a
single `html[data-theme="dark"]` block that swaps the token values — a true inversion, no accent
colour. A round sun/moon toggle sits in the nav and:

- respects `prefers-color-scheme` on a first visit, then remembers your choice in `localStorage`
- applies the theme **before first paint** via an inline `<head>` script, so there is no flash
- updates `<meta name="theme-color">` so mobile browser chrome matches
- crossfades over ~320ms (skipped automatically under reduced-motion)

### Hero neural network
A 2D canvas network of layered nodes and edges, drawn at `devicePixelRatio` so strokes stay crisp on
HiDPI screens. Node "pulses" travel along the edges. It is **themed** (it reads ink from a CSS
token), becomes a **full-bleed backdrop on phones**, skips the `INPUT/HIDDEN/OUTPUT` captions on
narrow canvases, and **pauses redrawing while scrolled out of view**.

### Scrollspy navigation
A single sliding pill indicator follows the section in view — driven by scroll position, not just
clicks. Below 768px the nav collapses into a hamburger with a slide-in panel, where the active item
carries its own pill.

### "Ask about Soumya" assistant
A retrieval-only chat widget (no LLM generation) that answers questions about the portfolio. See
[The assistant](#the-assistant) below.

### Responsive & device-aware
Breakpoints at 1200 / 1024 / 768 / 576 / 420 px, plus a `max-height: 540px` case for landscape
phones and short windows. Uses `100dvh` (with `100vh` fallbacks) so iOS Safari's toolbars don't clip
fixed panels, `viewport-fit=cover` with `env(safe-area-inset-*)` for notches and home indicators, and
16px inputs on touch devices so iOS doesn't zoom on focus.

### Accessibility
Honours `prefers-reduced-motion` (animations and transitions are disabled globally), keyboard
focus is visible (`:focus-visible` rings), the assistant is a labelled dialog with a focus trap and
Esc-to-close, and touch targets are ≥44px. On the dark base, `--graphite` body/secondary text sits
at roughly 7:1 contrast (`--mist`, used only for decorative labels, is intentionally lower).

---

## Project Structure

```
Soumya.dev/
├── index.html              # The whole page: all sections in one document
├── vercel.json             # Static-site deployment config
├── README.md
├── css/
│   └── style.css           # Design tokens, layout, components, responsive rules
├── js/
│   ├── main.js             # Loading screen, nav, marquee, scroll reveal,
│   │                       #   neural canvas, scrollspy, theme toggle
│   └── assistant.js        # "Ask about Soumya" widget, retrieval + guardrails
├── data/
│   └── knowledge.js        # Knowledge base the assistant answers from
└── img/
    ├── avatar.png          # About section portrait
    ├── project-1.png       # Ambient Habit screenshot
    ├── project-2.png       # Flowline CRM screenshot
    └── project-3.png       # ClusterCart screenshot
```

---

## The assistant

`js/assistant.js` + `data/knowledge.js` power a chat widget that answers questions about this
portfolio.

**It does not use a generative model.** A question is matched against the knowledge base and the
stored answer is returned verbatim, which means it **structurally cannot invent facts** — its worst
case is "I don't know that".

Matching runs in layers:

1. **Exact phrasing** — one of an entry's `q` phrasings appears in the question.
2. **BM25 keyword ranking**, gated on content-term coverage, with a stopword list.
3. **Optional sentence embeddings** — `all-MiniLM-L6-v2` via Transformers.js, lazy-loaded only when
   the panel is first opened and cached in `localStorage`. Strictly a progressive enhancement: if it
   is blocked or unsupported, keyword matching carries on unchanged.

Guardrails keep it on-topic: prompt-injection patterns are rejected outright, and off-topic
questions fail the coverage gate. Answers can carry tappable link chips (project demos, GitHub,
LinkedIn, email); external links are limited to `http(s):`/`mailto:` and open with
`rel="noopener noreferrer"`.

### Editing the knowledge base

Everything the assistant knows lives in `data/knowledge.js`:

```js
{
  id: 'project-ambient-habit',
  q: ['ambient habit', 'the habit tracker'],   // phrasings, indexed
  keywords: ['next.js', 'openai'],             // extra matching terms, indexed
  tags: ['projects'],
  answer: 'Ambient Habit (001 / Full-Stack) — …',
  links: [{ label: 'Open Ambient Habit', href: 'https://ambient-habit.vercel.app/' }],
  related: ['project-flowline-crm', 'contact'] // offered as follow-up chips
}
```

Bump `version` after editing so cached embedding vectors are discarded. To run the widget with
**zero downloads**, set `useEmbeddings: false` in the `CONFIG` block at the top of `js/assistant.js`.

---

## Live project links

| Project | Stack | Link |
|---|---|---|
| Ambient Habit | Next.js, OpenAI, Vercel AI SDK, PostgreSQL | [ambient-habit.vercel.app](https://ambient-habit.vercel.app/) |
| Flowline CRM | React, Node.js, MongoDB, Redis | [saas-flow-sigma.vercel.app](https://saas-flow-sigma.vercel.app/) |
| ClusterCart | React, Web3.js, D3.js, GraphQL | [clustercart-mfw7.vercel.app](https://clustercart-mfw7.vercel.app/) |

Also on the résumé: **BitRise** (fraud-detection frontend, hackathon) and a final-year project —
a **TinyML predictive-maintenance system** using Random Forest on low-power microcontrollers.

---

## Tech

**Frontend**
- HTML5, CSS3 custom properties, flexbox, grid — no framework, no build step
- Vanilla JavaScript (ES2020+, no dependencies bundled)
- Canvas 2D with `devicePixelRatio`-aware rendering
- `IntersectionObserver` for scroll reveal, canvas pausing and the scrollspy

**External (CDN, not bundled)**
- [Google Fonts](https://fonts.google.com/) — Archivo, JetBrains Mono
- [Devicons](https://devicon.dev/) — tech-stack icons
- [Transformers.js](https://github.com/huggingface/transformers.js) — *optional*, only for the
  assistant's embedding pass

**Deployment**
- [Vercel](https://vercel.com) — static hosting via `vercel.json`

---

## Getting started

There is **no build step**. Clone and serve the folder:

```bash
git clone https://github.com/Okpiyiii/portfolio.git
cd portfolio

# any static server works, e.g.
python -m http.server 8000
# or
npx serve .
```

Open `http://localhost:8000`.

> Tip: if you edit CSS/JS and the browser keeps serving old files, use a server that sends
> `Cache-Control: no-store` (or hard-refresh) — the markup carries no cache-busting hashes.

---

## Deployment

Configured for Vercel as a pure static site. Any push to the default branch deploys automatically.

```bash
vercel deploy --prod
```

Because everything is static, the site also works on GitHub Pages, Netlify, Cloudflare Pages or any
plain file host — no server, no environment variables, no API keys.

---

## Author

**Soumyadeep Pal** — ML/AI Engineer & Full-Stack Developer, based in Kolkata.

- GitHub: [@Okpiyiii](https://github.com/Okpiyiii)
- LinkedIn: [Soumyadeep Pal](https://www.linkedin.com/in/soumyadeep-pal-1a9929380)
- Email: [soumyadeeppal4211@gmail.com](mailto:soumyadeeppal4211@gmail.com)

---
