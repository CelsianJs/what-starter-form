import { h } from 'what-framework';
import { renderToString } from 'what-framework/server';
import { projects, proposalDefaults, routes, site } from '../content.mjs';

export function renderRoute(path, origin = 'http://localhost:4173') {
  const project = projects.find((item) => path === `/projects/${item.slug}`);
  let title = site.name;
  let description = site.description;
  let body;
  if (path === '/') body = Home();
  else if (path === '/projects') body = Projects();
  else if (project) { title = `${project.title} — ${site.name}`; description = project.summary; body = Project(project); }
  else if (path === '/studio') body = Studio();
  else if (path === '/proposal') body = Proposal();
  else if (path === '/build') body = Build();
  else body = NotFound();
  return `<!doctype html>${renderToString(Layout({ path, title, description, origin, body }))}`;
}

export function publicRoutes() {
  return routes.map((route) => route.path);
}

function Layout({ path, title, description, origin, body }) {
  return h('html', { lang: 'en' },
    h('head', {},
      h('meta', { charset: 'utf-8' }),
      h('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }),
      h('title', {}, title),
      h('meta', { name: 'description', content: description }),
      h('link', { rel: 'canonical', href: new URL(path, origin).toString() }),
      h('link', { rel: 'stylesheet', href: '/site.css' }),
      h('script', { type: 'module', src: '/assets/main.js', defer: true }),
    ),
    h('body', {},
      h('header', { class: 'shell mast' }, h('a', { class: 'brand', href: '/' }, 'Form'), h('nav', { class: 'nav', 'aria-label': 'Primary' }, h('a', { href: '/projects' }, 'Projects'), h('a', { href: '/studio' }, 'Studio'), h('a', { href: '/proposal' }, 'Proposal'), h('a', { href: '/build' }, 'Build'))),
      h('main', {}, body),
      h('footer', { class: 'shell footer' }, 'Fictional studio studies · browser-local proposal state · project case studies'),
      h('script', { id: 'form-data', type: 'application/json' }, JSON.stringify({ projects, proposalDefaults })),
    ),
  );
}

function Study(project) {
  const variant = project.slug;
  return h('div', { class: 'study', 'aria-label': `Geometric study for ${project.title}` },
    h('svg', { viewBox: '0 0 420 300', role: 'img', 'aria-hidden': 'true' },
      h('rect', { x: '20', y: '28', width: '380', height: '244', fill: 'none', stroke: project.accent, 'stroke-width': '3' }),
      h('path', { d: variant === 'north-arcade' ? 'M52 240 L52 126 L112 126 L112 92 L190 92 L190 240 M226 240 L226 78 L338 122 L338 240' : variant === 'linea-library' ? 'M58 224 L360 78 M80 248 L382 102 M76 224 L76 124 L180 124 L180 174 L300 174 L300 104' : 'M66 236 L66 112 L354 112 L354 236 M108 112 L138 64 L168 112 M242 112 L272 64 L302 112', fill: 'none', stroke: '#151515', 'stroke-width': '5' }),
      h('g', { stroke: '#151515', 'stroke-width': '1' }, ...[70, 110, 150, 190, 230].map((y) => h('line', { x1: '42', y1: String(y), x2: '378', y2: String(y) }))),
      h('rect', { x: variant === 'linea-library' ? '82' : '206', y: variant === 'sill-workshop' ? '138' : '122', width: variant === 'north-arcade' ? '124' : '86', height: variant === 'linea-library' ? '72' : '116', fill: project.accent, opacity: '.14', stroke: project.accent }),
    ),
  );
}

function Home() {
  return h('div', { class: 'shell' }, h('section', { class: 'hero portfolio-lead' }, h('div', {}, h('p', { class: 'eyeline' }, 'Architecture / public rooms'), h('h1', {}, 'Space for everyday life.'), h('p', {}, 'We study the thresholds between housing, work and the street. Three fictional projects explore how modest construction decisions can make shared space generous.'), h('a', { class: 'button', href: '/projects' }, 'View projects')), h('div', { class: 'panel' }, h('p', { class: 'eyeline' }, 'Practice notes'), h('p', {}, 'Start with the public room. Keep the useful structure. Draw light, circulation and service together. Our studies make the constraints visible before presenting the finished frame.'))), ProjectGrid(projects));
}

function Projects() {
  return h('div', { class: 'shell' }, h('section', { class: 'hero' }, h('div', {}, h('p', { class: 'eyeline' }, 'Project index'), h('h1', {}, 'Filter by discipline, then open a case study directly.')), h('p', {}, 'Browse the full study list, choose a discipline, and open each case study directly.')), h('section', { id: 'project-filter', class: 'panel' }, h('p', {}, 'Project filter loading…'), ProjectGrid(projects)));
}

function ProjectGrid(items) {
  return h('div', { class: 'project-grid' }, ...items.map((project) => h('a', { class: 'project-card', href: `/projects/${project.slug}` }, Study(project), h('div', {}, h('p', { class: 'meta' }, `${project.type} · ${project.year}`), h('h3', {}, project.title), h('p', {}, project.summary)))));
}

function Project(project) {
  return h('div', { class: 'shell case' }, h('figure', {}, Study(project), h('figcaption', { class: 'meta' }, 'Concept section · schematic, not a construction drawing')), h('article', {}, h('p', { class: 'eyeline' }, `${project.type} · ${project.location}`), h('h1', {}, project.title), h('p', {}, project.summary), h('p', { class: 'meta' }, `${project.year} · ${project.area}`), h('h2', {}, 'Program'), h('p', {}, project.program), h('h2', {}, 'Brief'), h('p', {}, project.brief), h('h2', {}, 'Section and rationale'), ...project.rationale.map(text => h('p', {}, text)), h('h2', {}, 'Material palette'), h('ul', {}, ...project.materials.map(text => h('li', {}, text))), h('h2', {}, 'Design moves'), h('ul', { class: 'build-list' }, ...project.moves.map((move) => h('li', {}, move))), h('h2', {}, 'The tradeoff'), h('p', {}, project.tradeoff), h('a', { class: 'button', href: `/proposal?study=${project.slug}` }, 'Draft a proposal'), h('h2', {}, 'Other studies'), ...projects.filter(item => item.slug !== project.slug).map(item => h('p', {}, h('a', { href: `/projects/${item.slug}` }, item.title)))));
}

function Studio() {
  return h('div', { class: 'shell hero' }, h('div', {}, h('p', { class: 'eyeline' }, 'Studio method'), h('h1', {}, 'We draw the public room first.'), h('p', {}, 'Form is a fictional practice for adaptive reuse, civic rooms and compact housing. We look for the useful space between a building and its neighbors: an arcade, a shared stair, a table that makes work visible.')), h('div', { class: 'panel' }, h('h2', {}, 'Method'), h('p', {}, 'Survey what can remain. Map daily arrivals and deliveries. Draw the light and service section before the facade. Test the public room against access, maintenance and winter use.'), h('p', {}, 'Every study records a tradeoff. More openness can mean less rentable area; more daylight can mean harder glare control. A clear brief keeps those choices available for discussion.'), h('a', { href: '/proposal', class: 'button' }, 'Prepare a local brief')));
}

function Proposal() {
  return h('div', { class: 'shell' }, h('section', { class: 'hero' }, h('div', {}, h('p', { class: 'eyeline' }, 'Local proposal brief'), h('h1', {}, 'Draft a study brief in the browser.')), h('p', {}, 'Your brief stays in this browser when storage is available and downloads as a plain-text study note without contacting a server.')), h('section', { id: 'proposal-island', class: 'brief-grid' }, h('div', { class: 'panel' }, h('h2', {}, 'Sample brief'), h('p', {}, 'Enable JavaScript to edit or download. Nothing is submitted.'), ...Object.entries(proposalDefaults).map(([label,value])=>h('p',{},h('strong',{},`${label}: `),value)))));
}

function Build() {
  return h('div', { class: 'shell hero' }, h('div', {}, h('p', { class: 'eyeline' }, 'Public build journal'), h('h1', {}, 'How Form is assembled.')), h('div', { class: 'panel' }, h('ul', { class: 'build-list' }, h('li', {}, h('code', {}, '/proposal?study=${project.slug}'), ' carries a known study into the editor; saved edits are preserved until explicit application.'), h('li', {}, 'Study records now include concept area, program, materials, rationale and tradeoffs. The same embedded records seed a local brief without a lead endpoint.'), h('li', {}, 'Preview grid children use min-width:0 and pre-wrap; figure margins are reset so browser defaults do not narrow the drawing.'), h('li', {}, 'Signals: active filter, proposal fields, storage mode and download status.'), h('li', {}, 'Computed: filtered projects and plain-text proposal output.'), h('li', {}, 'Effects: proposal persistence through safe storage wrappers.'), h('li', {}, 'Snippet: `safeSet(STORAGE, JSON.stringify(fields), storageStatus)` writes locally when possible and falls back to memory on `SecurityError`.'), h('li', {}, 'Problem fixed during QA: dense mobile composition intercepted pointer taps, so the smoke test verifies the keyboard activation path and CSS keeps proposal content above the hero layer.'), h('li', {}, 'Problem fixed during refinement: `.case{margin:34px 0 68px}` overrode `.shell{margin:auto}`; the case route now uses `margin:34px auto 68px`.'), h('li', {}, 'Refinement: case `h2` headings use a compact drafting-label scale so the original SVG drawing remains the dominant object.'), h('li', {}, 'Routing: project records generate `/projects/:slug/index.html`.'), h('li', {}, 'Vura: `dist/manifest.json` is validated with the public manifest contract and maps each route to `config.staticKey` in `dist/static`.'), h('li', {}, 'Lesson: client `mount()` enhances static fallbacks; it is not SSR-preserving hydration.'), h('li', {}, 'Limitation: local-only fictional proposal; no lead capture or analytics.'))));
}

function NotFound() {
  return h('div', { class: 'shell hero' }, h('div', {}, h('p', { class: 'eyeline' }, 'Unbuilt room'), h('h1', {}, 'This room has no drawing.'), h('p', {}, 'Return to the project index to continue.'), h('a', { class: 'button', href: '/projects' }, 'View projects')));
}
