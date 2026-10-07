import assert from 'node:assert/strict';
import { projects } from '../src/content.mjs';
import { renderRoute } from '../src/server/render.mjs';
for (const project of projects) {
  assert.ok(project.program && project.area && project.materials.length >= 3);
  assert.ok(project.rationale.length >= 2);
  assert.ok(renderRoute(`/projects/${project.slug}`).includes(`/proposal?study=${project.slug}`));
}
console.log('ok rich studies and contextual brief links');
