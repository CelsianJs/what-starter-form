import { existsSync, readFileSync } from 'node:fs';
import { projects, routes } from '../src/content.mjs';

const manifest = JSON.parse(readFileSync('dist/manifest.json', 'utf8'));
const expected = routes.filter((route) => route.path !== '/404').length;
if (!existsSync('dist/static/index.html')) throw new Error('missing root index');
if (!existsSync('dist/static/404.html')) throw new Error('missing root 404');
for (const project of projects) {
  if (!existsSync(`dist/static/projects/${project.slug}/index.html`)) throw new Error(`missing project ${project.slug}`);
}
if (manifest.routes.length !== expected) throw new Error(`manifest route mismatch ${manifest.routes.length}/${expected}`);
console.log(`check OK: ${routes.length} routes, ${projects.length} projects, ${manifest.routes.length} manifest pages.`);
