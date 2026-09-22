// Run once the final public HTTPS domain is known: node configure-domain.mjs https://your-domain
import fs from 'node:fs';
const domain = new URL(process.argv[2]);
if(domain.protocol !== 'https:' || domain.pathname !== '/' || domain.search || domain.hash || domain.username || domain.password || domain.hostname === 'localhost' || /^[\d.]+$/.test(domain.hostname)) throw Error('Use the final public HTTPS origin only.');
const root = new URL('./dist/', import.meta.url);
const pages = ['index.html','soframiz.html','hakkimizda.html','lezzetler.html','iletisim.html'];
const escape = value => value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
for(const page of pages){
 const file = new URL(page, root);
 let html = fs.readFileSync(file,'utf8');
 const url = new URL(page === 'index.html' ? '/' : page, domain).href;
 html = html.replace(/<link rel="canonical"[^>]*>/g,'').replace(/<meta property="og:url"[^>]*>/g,'');
 html = html.replace('</head>',`<link rel="canonical" href="${escape(url)}"><meta property="og:url" content="${escape(url)}"></head>`);
 html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(_,data)=>{
  const schema = JSON.parse(data);
  schema['@id'] = new URL('/#restaurant',domain).href;
  schema.url = domain.href;
  schema.image = new URL('assets/hakkimizda-duvar.png',domain).href;
  schema.hasMenu = new URL('lezzetler.html',domain).href;
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
 });
 fs.writeFileSync(file,html);
}
fs.writeFileSync(new URL('sitemap.xml',root),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+pages.map(page=>'<url><loc>'+escape(new URL(page==='index.html'?'/':page,domain).href)+'</loc></url>').join('')+'</urlset>');
fs.writeFileSync(new URL('robots.txt',root),'User-agent: *\nAllow: /\nSitemap: '+new URL('sitemap.xml',domain).href+'\n');
console.log('Canonical URLs, Restaurant URLs, sitemap and robots configured for '+domain.origin);
