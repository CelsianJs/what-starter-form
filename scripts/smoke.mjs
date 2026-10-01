import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { chromium } from 'playwright';

const root = join(process.cwd(), 'dist/static');
mkdirSync('.screenshots', { recursive: true });
const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let file = join(root, decodeURIComponent(url.pathname));
  if (!extname(file)) file = join(file, 'index.html');
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(root, '404.html');
  res.setHeader('content-type', contentType(file));
  res.statusCode = file.endsWith('404.html') && !url.pathname.startsWith('/404') ? 404 : 200;
  res.end(readFileSync(file));
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const failures = [];
async function check(name, fn) { try { await fn(); console.log(`ok ${name}`); } catch (e) { failures.push(`${name}: ${e.message}`); console.log(`FAIL ${name}: ${e.message}`); } }
try {
  await check('desktop routes and project detail load without console errors', async () => {
    const page = await browser.newPage({ viewport: { width: 1360, height: 920 } });
    const errors = [];
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
    for (const path of ['/', '/projects', '/projects/north-arcade', '/studio', '/proposal', '/build']) {
      const res = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
      if (res.status() !== 200) throw new Error(`${path} status ${res.status()}`);
      if (await page.locator('h1').count() !== 1) throw new Error(`${path} h1 count`);
      if (path === '/') await page.screenshot({ path: '.screenshots/form-desktop.png', fullPage: true });
    }
    if (errors.length) throw new Error(errors.join(' | '));
    await page.close();
  });
  await check('project filter narrows the static index', async () => {
    const page = await browser.newPage();
    await page.goto(`${base}/projects`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'civic' }).click();
    if (await page.locator('.project-card').count() !== 1) throw new Error('filter did not narrow to one project');
    await page.close();
  });
  await check('390px mobile pages do not overflow horizontally', async () => {
    const page = await browser.newPage({ viewport: { width: 390, height: 820 }, isMobile: true });
    for (const path of ['/', '/projects', '/projects/north-arcade', '/proposal', '/build']) {
      await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
      const width = await page.evaluate(() => Math.max(document.body.scrollWidth, document.documentElement.scrollWidth));
      if (width > 390) throw new Error(`${path} width ${width}`);
    }
    await page.close();
  });
  await check('proposal edits persist and download', async () => {
    const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 390, height: 820 }, isMobile: true });
    const page = await context.newPage();
    await page.goto(`${base}/proposal`, { waitUntil: 'networkidle' });
    await page.locator('input').first().fill('North Pier Cooperative');
    await page.getByRole('button', { name: 'Download brief' }).focus();
    await page.keyboard.press('Enter');
    if (!(await page.locator('p[aria-live="polite"]').textContent()).includes('form-proposal-brief.txt')) throw new Error('download status missing');
    if (!(await page.locator('pre').textContent()).includes('North Pier Cooperative')) throw new Error('preview did not update');
    await page.reload({ waitUntil: 'networkidle' });
    if ((await page.locator('input').first().inputValue()) !== 'North Pier Cooperative') throw new Error('proposal did not persist');
    await page.screenshot({ path: '.screenshots/form-mobile.png', fullPage: true });
    await context.close();
  });
  await check('corrupt and denied storage remain usable', async () => {
    const corrupt = await browser.newPage();
    await corrupt.addInitScript(() => localStorage.setItem('form-proposal', '{"client":{}}'));
    await corrupt.goto(`${base}/proposal`, { waitUntil: 'networkidle' });
    if ((await corrupt.locator('input').first().inputValue()) !== 'Civic Works Trust') throw new Error('corrupt proposal did not reset');
    await corrupt.close();
    const denied = await browser.newPage();
    await denied.addInitScript(() => { const bad = () => { throw new DOMException('denied', 'SecurityError'); }; Storage.prototype.getItem = bad; Storage.prototype.setItem = bad; });
    await denied.goto(`${base}/proposal`, { waitUntil: 'networkidle' });
    await denied.locator('input').first().fill('Memory Client');
    if ((await denied.locator('input').first().inputValue()) !== 'Memory Client') throw new Error('denied storage edit failed');
    if (await denied.locator('.storage-note').evaluate((node) => node.hidden)) throw new Error('storage note hidden');
    await denied.close();
  });
  await check('unknown path returns genuine 404', async () => {
    const res = await fetch(`${base}/unbuilt-room`);
    const html = await res.text();
    if (res.status !== 404) throw new Error(`status ${res.status}`);
    if (!html.includes('no drawing')) throw new Error('404 copy missing');
  });
} finally { await browser.close(); server.close(); }
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
function contentType(file) { if (file.endsWith('.css')) return 'text/css'; if (file.endsWith('.js')) return 'text/javascript'; return 'text/html; charset=utf-8'; }
