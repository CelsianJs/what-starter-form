# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-10-01
- Primary product surfaces: Studio front, project index, project details, studio method, proposal brief, build journal, not-found page.
- Evidence reviewed: Starter brief; sibling What starter SSG/Vura pattern; local package constraints.

## Brand
- Personality: Spatial, precise, editorial, architectural; monochrome drafting table with vermillion correction marks.
- Trust signals: Original SVG studies instead of fake photography, clear local-only proposal state, direct case-study routes.
- Avoid: Generic portfolio grids, fake client photography, glossy agency copy, huge repeated H1 composition.

## Product goals
- Goals: Demonstrate static project case studies plus client-side filtering and a locally editable/downloadable proposal brief.
- Non-goals: Real client intake, CMS, image CDN, lead capture, analytics, remote storage.
- Success signals: Users can filter projects, direct-load a detail route, edit a proposal brief, recover from storage problems, and download a text brief.

## Personas and jobs
- Primary personas: Designer/developer evaluating What; studio website builder; agent adapting a starter.
- User jobs: See how SVG studies can replace stock media; reuse filtering and brief patterns; inspect build-route lessons.
- Key contexts of use: Desktop portfolio review, mobile case-study browsing, keyboard-only filter/proposal editing.

## Information architecture
- Primary navigation: Projects, Studio, Proposal, Build.
- Core routes/screens: `/`, `/projects`, `/projects/:slug`, `/studio`, `/proposal`, `/build`, `/404`.
- Content hierarchy: Studio position; project filters; case-study story; proposal editor; implementation guide.

## Design principles
- Principle 1: Every visual should feel like an architectural drawing or viewport composition.
- Principle 2: Interactions should feel useful, not decorative: filter, write, download.
- Tradeoffs: The proposal is local-only to keep the starter portable and privacy-preserving.

## Visual language
- Color: Warm paper, ink black, graphite, vermillion.
- Typography: Strong serif display with narrow uppercase drafting labels.
- Spacing/layout rhythm: Asymmetric columns, section numbers, viewport frames, ruled measurements.
- Shape/radius/elevation: Square edges, hairlines, no heavy shadows.
- Motion: Subtle drawing-line reveals and filter transitions; reduced motion disables movement.
- Imagery/iconography: Original inline SVG building studies generated from project metadata.

## Components
- Existing components to reuse: What signals/computed/effects, server `h()` renderer, static Vura scripts.
- New/changed components: Project filter island, proposal editor, SVG project study, case-study section.
- Variants and states: Empty filters, storage denied, corrupt proposal fallback, download-ready status.
- Token/component ownership: Tokens in `src/styles.css`; project data in `src/content.mjs`; client state in `src/client/main.jsx`.

## Accessibility
- Target standard: Practical WCAG AA.
- Keyboard/focus behavior: Filter buttons and proposal fields are keyboard reachable with visible focus.
- Contrast/readability: High-contrast ink/paper palette; vermillion is accent, not sole information channel.
- Screen-reader semantics: Project lists, labels, status messages and download actions are explicit.
- Reduced motion and sensory considerations: Motion disabled under `prefers-reduced-motion`.

## Responsive behavior
- Supported breakpoints/devices: 360px mobile through desktop.
- Layout adaptations: Viewport grids stack; SVG studies remain visible; proposal actions stay near editor.
- Touch/hover differences: Hover enriches only; all actions work on tap/keyboard.

## Interaction states
- Loading: Static fallback pages are useful without JavaScript.
- Empty: Filter island reports no project if a future category is empty.
- Error: Corrupt proposal storage resets to defaults with visible local-state boundary.
- Success: Download status reports generated filename.
- Disabled: No disabled primary actions; invalid storage uses memory fallback.
- Offline/slow network: No remote dependencies.

## Content voice
- Tone: Studio note, precise, concrete.
- Terminology: “study”, “brief”, “section”, “threshold”, “frame”.
- Microcopy rules: Avoid claiming real clients; call projects fictional studio studies.

## Implementation constraints
- Framework/styling system: `what-framework@0.13.10`, `what-compiler@0.13.10`, Vite 6.4.3, CSS only.
- Design-token constraints: No remote images, no paid services, no tracking.
- Performance constraints: SSG for every project route; compact SVG/CSS/client bundle.
- Compatibility constraints: Node 22; client file APIs behind user actions.
- Test/screenshot expectations: Desktop, mobile, direct route, 404, filter, proposal download, corrupt and denied storage.

## Open questions
- [ ] None for local review; live URL validation belongs to root after deployment.

## Refinement notes — 2026-10-01 style audit
- Reduce the giant intro image/headline behavior; lead with project context, measured typography and an asymmetric portfolio viewport.
- Make the three architectural studies visually distinct, not repeated thumbnails with different labels.
- Preserve the monochrome/vermillion studio voice while making the page feel like a clean working portfolio rather than a poster.
