import { existsSync } from 'node:fs';
import { projects, routes } from '../src/content.mjs';
import { validateVuraStaticManifest } from './vura-static-check.mjs';

const expected = routes.length;
if (!existsSync('dist/static/index.html')) throw new Error('missing root index');
if (!existsSync('dist/static/404.html')) throw new Error('missing root 404');
for (const project of projects) {
  if (!existsSync(`dist/static/projects/${project.slug}/index.html`)) throw new Error(`missing project ${project.slug}`);
}
const manifestPages = validateVuraStaticManifest(expected);
console.log(`check OK: ${routes.length} routes, ${projects.length} projects, ${manifestPages} canonical Vura manifest pages validated.`);
