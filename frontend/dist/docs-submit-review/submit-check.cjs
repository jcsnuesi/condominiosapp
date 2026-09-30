const {chromium}=require('C:/Temp/openclaw-playwright/node_modules/playwright');
const http=require('http'),fs=require('fs'),path=require('path');
const root=path.resolve('frontend/dist/docs-submit-review');
const server=http.createServer((req,res)=>{let f=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(!fs.existsSync(f)||fs.statSync(f).isDirectory())f=path.join(root,'index.html');res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.html')?'text/html':'application/octet-stream');res.end(fs.readFileSync(f));});
(async()=>{await new Promise(r=>server.listen(4319,'127.0.0.1',r));const browser=await chromium.launch({channel:'msedge',headless:true});try{
const context=await browser.newContext({viewport:{width:1100,height:900}});
const identity={_id:'visual-user',role:'ADMIN',name:'Preview',lastname:'Admin',first_password_changed:true};
const token='test.'+Buffer.from(JSON.stringify({...identity,exp:Math.floor(Date.now()/1000)+3600})).toString('base64url')+'.test';
await context.addCookies([{name:'identity',value:JSON.stringify(identity),url:'http://127.0.0.1:4319'},{name:'token',value:token,url:'http://127.0.0.1:4319'}]);
await context.addCookies([{name:'access_context',value:JSON.stringify({permissions:['documents.read'],scope:{mode:'ALL',condominiumIds:[]}}),url:'http://127.0.0.1:4319'}]);
const page=await context.newPage();page.setDefaultTimeout(10000);page.on("console",m=>{if(m.type()==="error")console.log("CONSOLE",m.text())});page.on("pageerror",e=>console.log("PAGEERROR",e.message));let posts=[],fail=false,saved=[];
await page.route('**/*',async route=>{const u=new URL(route.request().url());if(u.origin==='http://127.0.0.1:4319'&&!u.pathname.startsWith('/api'))return route.continue();
if(u.pathname.endsWith('/auth/me'))return route.fulfill({json:{success:true,status:'success',data:{user:identity,access:{permissions:['documents.read'],scope:{mode:'ALL',condominiumIds:[]}}}}});
if(u.pathname.endsWith('/docs/createDoc')){posts.push(route.request().postData());if(fail)return route.fulfill({status:500,json:{status:'error',message:'Simulated error'}});saved=[{_id:'doc-test',title:'Community rules',description:'Documentation regression check',category:'OTHER',status:'Active',file:[],condoId:{_id:'visual-condo',alias:'Test condo'},createdBy:{email:'test@example.com'},createdAt:'2026-09-29'}];return route.fulfill({json:{status:'success',message:saved[0]}});}
if(u.pathname.includes('/docs/getDirectories/'))return route.fulfill({json:{status:'success',message:saved}});
return route.fulfill({json:{success:true,status:'success',data:{docs:[]},message:[]}});});
await page.goto('http://127.0.0.1:4319/#/docs/visual-condo');console.log('URL',page.url());console.log((await page.locator('body').innerText()).slice(0,1200));await page.waitForSelector('app-docs').catch(async e=>{console.log('FAILED_ROUTE',page.url(),await page.locator('body').innerText());throw e;});await page.getByRole('button',{name:/New document$/}).click();
const modal=page.getByRole('dialog',{name:'Create New Documentation',exact:true});await modal.waitFor();
if(await modal.getByRole('button',{name:/Delete$/}).count())throw Error('Delete shown for unsaved document');
await modal.locator('input[name="title"]').fill('Community rules');await modal.locator('textarea[name="description"]').fill('Documentation regression check');
await modal.locator('input[type=file]').first().setInputFiles({name:'rules.txt',mimeType:'text/plain',buffer:Buffer.from('Test document')});
await modal.getByRole('button',{name:/Submit$/}).click();
const confirm=page.locator('.p-confirmdialog');await confirm.waitFor();await confirm.getByRole('button',{name:/Cancel$/}).click();if(posts.length)throw Error('Cancel submitted');
await modal.getByRole('button',{name:/Submit$/}).click();await page.getByRole('button',{name:/Yes, Upload$/}).click();await modal.waitFor({state:'hidden'});await page.locator('.doc-name').filter({hasText:'Community rules'}).waitFor();
if(posts.length!==1||!posts[0].includes('visual-condo')||!posts[0].includes('rules.txt'))throw Error('Incorrect multipart submission');console.log('PASS create confirmation, cancellation, one multipart POST with attachment, modal closes and table refreshes');
await page.getByRole('button',{name:/New document$/}).click();await modal.locator('input[name="title"]').fill('Retry document');await modal.locator('textarea[name="description"]').fill('Keep this description on error');fail=true;
await modal.getByRole('button',{name:/Submit$/}).click();await page.getByRole('button',{name:/Yes, Upload$/}).click();await modal.getByRole('alert').waitFor();if(await modal.locator('input[name="title"]').inputValue()!=='Retry document')throw Error('Draft lost');if(!await modal.getByRole('button',{name:/Submit$/}).isEnabled())throw Error('Retry disabled');console.log('PASS failed request keeps draft, exposes error, allows retry');
fail=false;await modal.getByRole('button',{name:/Submit$/}).click();await page.getByRole('button',{name:/Yes, Upload$/}).click();await modal.waitFor({state:'hidden'});console.log('PASS retry without attachment');
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1});