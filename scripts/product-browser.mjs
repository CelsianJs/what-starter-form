import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';
const name='form';
const routes=["/","/projects/north-arcade","/proposal?study=north-arcade"];
const root=join(process.cwd(),'dist/static');
const server=createServer((req,res)=>{let path=join(root,new URL(req.url,'http://local').pathname);if(!extname(path))path=join(path,'index.html');if(!existsSync(path)||statSync(path).isDirectory()){path=join(root,'404.html');res.statusCode=404;}res.setHeader('content-type',path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':'text/html');res.end(readFileSync(path));});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch();mkdirSync('.screenshots',{recursive:true});
try{
for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:1000},acceptDownloads:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const [index,route] of routes.entries()){await page.goto(base+route,{waitUntil:'networkidle'});assert.equal(await page.locator('h1').count(),1);assert.ok(await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)<=innerWidth),route+' overflow');await page.screenshot({path:'.screenshots/'+name+'-depth-'+index+'-'+width+'.png',fullPage:true});}
 await page.getByRole('button',{name:'Use North Arcade Housing brief'}).click();assert.ok((await page.locator('pre').textContent()).includes('36 homes'));await page.getByRole('textbox',{name:'Client',exact:true}).fill('Preserve this edit');await page.goto(base+'/proposal?study=linea-library',{waitUntil:'networkidle'});assert.equal(await page.getByRole('textbox',{name:'Client',exact:true}).inputValue(),'Preserve this edit');
 assert.deepEqual(errors,[]);await page.close();
}
const staticPage=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:1000}});
for(const route of routes){await staticPage.goto(base+route);assert.equal(await staticPage.locator('h1').count(),1);assert.ok((await staticPage.locator('main').textContent()).length>120);}
await staticPage.close();console.log('ok form product flow, 1440/390 geometry, errors and no-JS routes');
}finally{await browser.close();server.close();}
