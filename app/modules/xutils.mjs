import { x } from './xscript.mjs';

const xutils = {
  build(xdata, main){
    let strip_unsafe = xdata.default.strip_unsafe,
    meta = xdata.default.meta,
    css = xdata.default.styles,
    js_head = xdata.default.js_head,
    jsonLD = xdata.default.jsonLD,
    js_body = xdata.default.js_body,
    head_args = [],
    body_args = [main],
    delete_meta = xdata.default.delete_meta;

    if(strip_unsafe && strip_unsafe.length){
      for (let i = 0; i < strip_unsafe.length; i++) {
        window[strip_unsafe[i]] = null;
      }
    }

    document.scripts.namedItem(xdata.default.base_script_name).remove()

    if(xdata.default.csp){
      head_args.push(x('meta', {
        'http-equiv': 'Content-Security-Policy',
        content: xdata.default.csp
      }))
    }

    if(meta && meta.length){
      for (let i = 0; i < meta.length; i++) {
        head_args.push(x('meta', meta[i]))
      }
    }

    if(xdata.default.webmanifest){
      head_args.push(x('link', {
        href: xdata.default.webmanifest,
        rel: 'manifest'
      }))
    }

    if(css && css.length){
      for (let i = 0; i < css.length; i++) {
        head_args.push(x('link', css[i]))
      }
    }

    if(js_head && js_head.length){
      for (let i = 0; i < js_head.length; i++) {
        head_args.push(x('script', js_head[i]))
      }
    }

    if(jsonLD && jsonLD.length){
      for (let i = 0; i < jsonLD.length; i++) {
        head_args.push(x('script', {type: 'application/ld+json'}, JSON.stringify(jsonLD[i])))
      }
    }

    document.head.append(...head_args)

    if(js_body && js_body.length){
      for (let i = 0; i < js_body.length; i++) {
        body_args.push(x('script', js_body[i]))
      }
    }

    document.body.append(...body_args);


    if(delete_meta){
      meta = document.head.childNodes;
      setTimeout(function(){
        for (let i = 0; i < meta.length; i++) {
          if(meta[i].tagName === 'META'){
            meta[i].remove();
          }
        }
      }, delete_meta)

    }

  },
  ls: {
    get(i) {
      return JSON.parse(localStorage.getItem(i))
    },
    set(i, e) {
      localStorage.setItem(i, JSON.stringify(e))
      return;
    },
    del(i) {
      localStorage.removeItem(i);
    }
  },
  ss: {
    get(i) {
      return JSON.parse(sessionStorage.getItem(i))
    },
    set(i, e) {
      sessionStorage.setItem(i, JSON.stringify(e))
      return;
    },
    del(i) {
      sessionStorage.removeItem(i);
    }
  },
  url: {
    add(text, type, charset){
      return URL.createObjectURL(xutils.blob(text, type, charset))
    },
    del(item){
      URL.revokeObjectURL(item);
    },
    parse(i){
      return new URL(i)
    }
  },
  cookie: {
    set(name, val, obj) {
      let str = (name + "=" + val + ";")
      Object.keys(obj).forEach(function(x,y){
        str+= x + "=" + y + ";";
      })
      return document.cookie = str;
    },
    get(name){
      name+= "=";
      let ca = document.cookie.split(';');
      for(var i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return false;
    },
    del(name){
      let str = (name + "=;max-age=0;")
      return document.cookie = str;
    }
  },
  parse_params(str){
    str = str.split('?');
    let obj = {
      dest: str[0]
    }
    if(str[1]){
      obj.params = new URLSearchParams(str[1])
    }
    return obj;
  },
  blob(text, type, charset){
    return new Blob([text], {
      type: [type +";"+ charset].join(';')
    })
  },
  download(settings, filename, text, type, charset) {
    if(!type){type = settings.type;}
    if(!charset){charset = settings.charset;}
    let url = xutils.url.add(text, type, charset),
    link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.style.display = 'none';
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    setTimeout(function(){
      xutils.url.del(url);
      blob = url = link = null;
    },5000)

  },
  empty(settings, x){
    if(!x){
      x = settings.app_main
    }
    while(x.firstChild){
      x.removeChild(x.firstChild);
    }
  },
  fetch(settings, src, options, cb){
    let cnf = settings.fetch
    if(typeof options === 'function'){
      cb = options;
      options = cnf;
    } else {
      options = Object.assign(cnf, options);
    }

    let headers = {}
    fetch(src, options).then(function(res){
      console.log(res)
      if (res.status >= 200 && res.status < 300) {
        headers.status = res.status;
        headers.statusText = res.statusText;
        res.headers.forEach(function(x,y){
          headers[y] = x;
        })
        return res.text();
      } else {
        return Promise.reject(new Error(res.statusText))
      }
    }).then(function(data){
      let ctype = headers['content-type'],
      obj = {
        headers: headers,
        body: data
      }

      if (ctype && ctype.includes('application/json')) {
        obj.json = JSON.parse(data)
      }

      cb(false, obj);

      headers = data = null;
    }).catch(function(err){
      cb(err)
    })
  },
  path(src){
    try {
      src = src.split('/');
      let len = src.length,
      fileName = src.pop(),
      base = fileName.split('.');

      return {
        fileName: fileName,
        baseName: base[0],
        ext: base.pop(),
        dirName: src.join('/')
      }
    } catch (err) {
      return null;
    }
  }
}

export { xutils }
