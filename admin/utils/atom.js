const https = require('https'),
crypto = require('crypto'),
fs = require('fs')

let obj = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'googlebot'
  }
},
config = require('../config/atom');

let utils = {
  atom_base(obj){

    let base = '<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom">'

    let arr = ['title', 'subtitle', 'icon', 'logo', 'updated', 'id', 'generator', 'rights']

    for (let i = 0; i < arr.length; i++) {
      if(obj[arr[i]] && obj[arr[i]] !== ''){
        base += '<'+ arr[i] +'>'+ obj[arr[i]] +'</'+ arr[i] +'>'
      }
    }

    // build link
    if(obj.link.href !== ''){
      let lnk = '<link ';
      if(obj.link.rel !== ''){
        lnk += 'rel="'+ obj.link.rel +'" ';
      }

      if(obj.link.title && obj.link.title !== ''){
        lnk += 'title="'+ obj.link.title +'" ';
      }

      if(obj.link.hreflang !== ''){
        lnk += 'hreflang="'+ obj.link.hreflang +'" ';
      }

      if(obj.link.type !== ''){
        lnk += 'type="'+ obj.link.type +'" ';
      }

      lnk += 'href="'+ obj.link.href +'" />';

      base += lnk;
      lnk = null;
    }

    // build category
    if(obj.category.term !== ''){
      let cat = '<category ';

      if(obj.category.label !== ''){
        cat += 'title="'+ obj.category.label +'" ';
      }

      if(obj.category.scheme !== ''){
        cat += 'scheme="'+ obj.category.scheme +'" ';
      }

      cat += 'term="'+ obj.category.term +'" />';

      base += cat;
      cat = null;
    }

    if(obj.author.name !== '' || obj.author.email !== '' || obj.author.uri !== ''){
      base += '<author>'
      for (let i in obj.author) {
        if(obj.author[i] !== ''){
          base += '<'+ i +'>'+ obj.author[i] +'</'+ i +'>'
        }
      }
      base += '</author>'
    }


    for (let i = 0; i < obj.entries.length; i++) {
      base += utils.atom_entry(obj.entries[i])
    }

    base += '</feed>\n\n'

    return base

  },
  atom_entry: function(obj){
    let entry = '<entry>';

    let arr = ['title','updated', 'id', 'summary', 'published', 'rights']

    for (let i = 0; i < arr.length; i++) {
      if(obj[arr[i]] && obj[arr[i]] !== ''){
        entry += '<'+ arr[i] +'>'+ obj[arr[i]] +'</'+ arr[i] +'>'
      }
    }

    if(obj.author.name !== '' || obj.author.email !== '' || obj.author.uri !== ''){
      entry += '<author>'
      for (let i in obj.author) {
        if(obj.author[i] !== ''){
          entry += '<'+ i +'>'+ obj.author[i] +'</'+ i +'>'
        }
      }
      entry += '</author>'
    }

    // build content
    if(obj.content.type !== '' || obj.content.data !== '' || obj.content.src !== ''){
      let data = '<content';

      if(obj.content.type && obj.content.type !== ''){
        data += ' type="'+ obj.content.type +'"';
      }

      if(obj.content.src && obj.content.src !== ''){
        data += ' src="'+ obj.content.src +'" />';
      } else {
        data += '>'+ obj.content.data +'</content>';
      }

      entry += data;
      data = null;
    }

    // build link
    if(obj.link.href && obj.link.href !== ''){
      let lnk = '<link ';
      if(obj.link.rel && obj.link.rel !== ''){
        lnk += 'rel="'+ obj.link.rel +'" ';
      }

      if(obj.link.title && obj.link.title !== ''){
        lnk += 'title="'+ obj.link.title +'" ';
      }

      if(obj.link.hreflang && obj.link.hreflang !== ''){
        lnk += 'hreflang="'+ obj.link.hreflang +'" ';
      }

      if(obj.link.type && obj.link.type !== ''){
        lnk += 'type="'+ obj.link.type +'" ';
      }

      lnk += 'href="'+ obj.link.href +'" />';

      entry += lnk;
      lnk = null;
    }

    // build category
    if(obj.category.term && obj.category.term !== ''){
      let cat = '<category ';

      if(obj.category.label && obj.category.label !== ''){
        cat += 'title="'+ obj.category.label +'" ';
      }

      if(obj.category.scheme && obj.category.scheme !== ''){
        cat += 'scheme="'+ obj.category.scheme +'" ';
      }

      cat += 'term="'+ obj.category.term +'" />';

      entry += cat;
      cat = null;
    }

    entry += '</entry>';
    return entry
  },
  escapeHTML: function(unsafe) {
    return unsafe.replace(/[&<"']/g, function(m) {
      switch (m) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '"':
          return '&quot;';
        default:
          return '&#039;';
      }
    });
  },
  sortTitle(i){
    try {
      i = i.split('|');
      i[0] = i[0].slice(1,-1);
      i[1] = i[1].slice(5,-1);
      i[2] = i[2].replace(/\[tag:/g, '').split(']').slice(0,-1);
      return i;
    } catch (err) {
      return null;
    }

  },
  uuid() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, function(c){
      return (c ^ crypto.randomBytes(1)[0] & 15 >> c / 4).toString(16)
    });
  }
}

function atom(){
  https.get(config.feedurl, obj, function(res){
    let str = ''
    res.on('data', function(d){
      str+=d
    }).on('end', function(){
      str = JSON.parse(str);

      let arr = [],ttl, entry;

      for (let i = 0; i < str.length; i++) {

        ttl = utils.sortTitle(str[i].title);
        arr.push({
          title: ttl[0],
          updated: str[i].updated_at,
          id: "urn:uuid:"+ utils.uuid(),
          published: str[i].created_at,
          author: {
            name: str[i].user.login,
            uri: str[i].user.url
          },
          category: {
            term: ttl[1]
          },
          content: {
            type: "text",
            data: str[i].body
          },
          link: {
            title: "link",
            href: config.baseurl+ '/#/forum'
          }
        })
      }

      config.templates.forum.entries = arr;

      fs.writeFileSync('./atom/issues.atom', utils.atom_base(config.templates.forum))
    });

  })
  .on('error', function(e){
    console.error(e);
  });

  https.get(config.newsurl, obj, function(res){
    let str = ''
    res.on('data', function(d){
      str+=d
    }).on('end', function(){
      str = JSON.parse(str);

      let arr = [],ttl, entry;

      for (let i = 0; i < str.length; i++) {

        arr.push({
          title: str[i].title,
          updated: str[i].updated_at,
          id: "urn:uuid:"+ utils.uuid(),
          published: str[i].created_at,
          author: {
            name: str[i].user.login,
            uri: str[i].user.url
          },
          category: {
            term: 'news'
          },
          content: {
            type: "text",
            data: str[i].body
          },
          link: {
            title: "link",
            href: config.baseurl+ '/#/news'
          }
        })
      }

      config.templates.news.entries = arr;

      fs.writeFileSync('./atom/news.atom', utils.atom_base(config.templates.news))
    });

  })
  .on('error', function(e){
    console.error(e);
  });

}

module.exports = { atom }
