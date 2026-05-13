# Yuri Brown — portfolio (systems)

Personal portfolio site: a single-page narrative home plus dedicated case-study routes, project registry, thoughts, and motion-aware shell UI. Built as a **Vite + React 19 + TypeScript** SPA with **React Router**, **Tailwind CSS v4**, and **Framer Motion**.

## Quick start

```bash
npm install
npm run dev
```

| Script | Description |
|--------|-------------|
| `npm run dev` | Local dev server (Vite HMR) |
| `npm run build` | `tsc -b` then production bundle |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |

## Stack (high level)

- **UI:** React 19, Tailwind v4 (`@tailwindcss/vite`), `clsx`, Radix primitives where used  
- **Motion / scroll:** Framer Motion, Lenis (smooth scroll; respects `prefers-reduced-motion`)  
- **Routing:** `react-router-dom` v6  
- **Charts / graph:** Recharts, `@xyflow/react` (skills graph)  
- **Content:** TypeScript modules for “thoughts”; Markdown in `docs/projects/` for design-system inputs consumed at build time  

Path alias: `@` → [`src/`](src/).

## Repository layout

| Path | Purpose |
|------|---------|
| [`src/`](src/) | Application source (`main.tsx`, `App.tsx`, `pages/`, `components/`, `config/`, `data/`, `lib/`, `styles/`) |
| [`src/assets/`](src/assets/) | Static images (e.g. hero [`profile.png`](src/assets/profile.png), Cosmic Mashups mark [`cosmicmashups.jpg`](src/assets/cosmicmashups.jpg) layered behind the portrait in the hero) |
| [`docs/projects/`](docs/projects/) | Per-project design-system Markdown; imported as `?raw` in [`src/lib/designDoc/importDocs.ts`](src/lib/designDoc/importDocs.ts) for theme parsing |
| [`docs/features/`](docs/features/) | Product/feature notes (not bundled) |
| [`docs/PORTFOLIO_FRONTEND_CONTEXT.md`](docs/PORTFOLIO_FRONTEND_CONTEXT.md) | LLM- and maintainer-oriented map of routes, sections, tokens, and case-study pages |
| [`docs/FRONTEND_FEATURES_AND_ENHANCEMENTS.md`](docs/FRONTEND_FEATURES_AND_ENHANCEMENTS.md) | Enhancement backlog / ideas |
| [`old/`](old/) | Archived earlier layout (reference only) |

## Documentation

- **Frontend architecture and per-route UI:** [`docs/PORTFOLIO_FRONTEND_CONTEXT.md`](docs/PORTFOLIO_FRONTEND_CONTEXT.md)  
- **Roadmap / enhancements:** [`docs/FRONTEND_FEATURES_AND_ENHANCEMENTS.md`](docs/FRONTEND_FEATURES_AND_ENHANCEMENTS.md)  

Keep [`docs/projects/*.md`](docs/projects/) in sync when changing project theming or the design-doc pipeline; the Vite config allows reading from the repo root for those imports.

## Vite configuration

[`vite.config.ts`](vite.config.ts) registers the React and Tailwind plugins, sets `@` → `src`, and expands `server.fs.allow` so build-time imports can reach parent paths when needed.

## License

Private project (`private: true` in [`package.json`](package.json)).
