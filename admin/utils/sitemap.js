const config = require('../config/sitemap'),
fs = require('fs');


let tpl = '<url><loc>{{loc}}</loc><lastmod>{{lastmod}}</lastmod><changefreq>{{changefreq}}</changefreq><priority>{{priority}}</priority></url>',
str = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
end = '</urlset>';

function sitemap(){
  for (let i = 0; i < config.length; i++) {
    str+= tpl.replace('{{loc}}', config[i].loc)
    .replace('{{lastmod}}', config[i].lastmod)
    .replace('{{changefreq}}', config[i].changefreq)
    .replace('{{priority}}', config[i].priority)
  }

  str+= end;

  fs.writeFileSync('./sitemap.xml', str)
}

module.exports = { sitemap };
