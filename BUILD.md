# Build journal

Last verified: 2026-10-01.

## Architecture

- `src/content.mjs` owns studio, project and route metadata.
- `src/server/render.mjs` renders every public route with `what-framework/server`, including direct project pages and root `404.html`.
- `src/client/main.jsx` mounts the filter and proposal islands; browser JSX is never imported by the Node renderer.
- `scripts/build.mjs` validates `SITE_URL`, writes static HTML, sitemap, robots and `dist/manifest.json`.
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
