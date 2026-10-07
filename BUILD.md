# Build journal

## Product-depth patterns — 2026-10-07

A case study links to `/proposal?study=${project.slug}`. The client resolves that slug against embedded project records, seeds an empty editor with study context and preserves a saved brief until the visitor selects Use study brief. No lead is submitted. `output` remains a computed projection of the four field signals, so editing immediately changes the downloadable preview. A figure wrapper initially inherited browser margins and constrained the drawing; resetting figure margin and aspect ratio restores its drafting frame. Preview grid children now use `min-width:0` and `white-space:pre-wrap` at all widths. Product-depth checks require program/material/rationale records; browser regressions verify contextual seed, preserved edits, download, no-JS fallback and 390px layout.

Verification: `npm test` runs content/model regressions, production artifact checks, contextual browser flows, desktop/mobile screenshots and the original smoke suite. Screenshot proof is under `.screenshots/`; no external services are required.

Last verified: 2026-10-07.

## Architecture

- `src/content.mjs` owns studio, project and route metadata.
- `src/server/render.mjs` renders every public route with `what-framework/server`, including direct project pages and root `404.html`.
- `src/client/main.jsx` mounts the filter and proposal islands; browser JSX is never imported by the Node renderer.
- `scripts/build.mjs` validates `SITE_URL` and writes static HTML, sitemap and robots output under `dist/static`.
- `scripts/check.mjs` validates the emitted Vura route manifest with `@celsian/vura-contract`.
- `scripts/serve-static.mjs` previews `dist/static` and returns real HTTP 404 for unknown paths.

## What Framework patterns

- Signals: `useSignal` stores active discipline, proposal fields, storage mode and download status.
- Computed values: `useComputed` derives filtered project lists and the plain-text proposal.
- Effects: `useEffect` persists proposal fields through safe wrappers and avoids clearing user storage.
- Global state: proposal state is local to the browser; project records are static content.
- Routing/SSG: all case-study pages are generated from the project dataset.

## Lessons and limitations

- `mount()` creates client-mounted islands over static fallbacks; it is not SSR-preserving hydration.
- Storage APIs can throw, so proposal reads/writes use safe wrappers and tab-local memory fallback.
- SVG studies are deliberately original geometric drawings, not fake photography or client assets.
- Browser QA found a dense mobile composition where the hero layer could intercept pointer taps on the proposal button. CSS now keeps the proposal layer above the hero, and the smoke test verifies the keyboard activation path as the reliable accessible flow.
- Refinement: the case-study route regressed because `.case{margin:34px 0 68px}` overrode `.shell{margin:auto}`; the route now uses horizontal auto margins and compact drafting-label `h2`s.
- Refinement: the client filter mirrors the original SVG study variants, so enhanced project lists do not collapse all three studies into one simplified drawing.
- Vura upload rejected the first handwritten static manifest because it lacked required `timestamp` and `pages[].filePath` fields. The starter now emits the full manifest contract and maps each route to its promoted public file via `config.staticKey`.
- The proposal download is local-only; there is no submission endpoint, CRM, analytics or file upload.

## Reference snippets

```js
const output = useComputed(() => `FORM PROPOSAL BRIEF\n\nClient: ${client()}`);
useEffect(() => safeSet(STORAGE, JSON.stringify({ client: client(), site: site() }), storageStatus));
```

```js
const results = useComputed(() =>
  active() === 'all' ? data.projects : data.projects.filter((project) => project.type === active())
);
```

## Verification plan

The smoke suite builds production output, runs Chromium against the generated artifact, captures desktop/mobile screenshots, and checks:

- Desktop routes render without console errors.
- Project detail routes are direct-loadable.
- Filters narrow the static project index.
- Proposal editing persists, recovers from corrupt storage and downloads a text brief.
- Denied storage keeps the proposal usable with a visible boundary.
- Preview server returns genuine HTTP 404 for unknown paths.
