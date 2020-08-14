import { x } from './xscript.mjs';
import { xdata } from '../data/xdata.mjs';
import { tpl } from '../views/tpl.mjs';
import { xidb } from './xidb.mjs';

const wcs = window.crypto.subtle;

const utils = {
  get(src, options, cb){
    fetch(src, options).then(function(res){
      if (res.status >= 200 && res.status < 300) {
        return res.json();
      } else {
        return Promise.reject(new Error(res.statusText))
      }
    }).then(function(data){
      cb(false, data);
    }).catch(function(err){
      cb(err)
    })
  },
  getUserData(tk, router){
    let obj = xdata.default.stream.fetch
    obj.headers['Authorization'] = 'token '+ tk
    utils.get(xdata.app.user_data, obj, function(err,res){
      if(err){
        utils.toast('danger', 'login failed');
        return console.error(err)
      }
      obj = {
        avatar_url: res.avatar_url,
        bio: res.bio,
        blog: res.blog,
        company: res.company,
        created_at: res.created_at,
        disk_usage: res.disk_usage,
        email: res.email,
        followers: res.followers,
        following: res.following,
        hireable: res.hireable,
        location: res.location,
        login: res.login,
        name: res.name,
        owned_private_repos: res.owned_private_repos,
        private_gists: res.private_gists,
        public_gists: res.public_gists,
        public_repos: res.public_repos,
        total_private_repos: res.total_private_repos,
        updated_at: res.updated_at,
        url: res.url
      }

      sessionStorage.setItem('userData', JSON.stringify(obj));
      utils.toast('success', 'login success');
      if(router){
        window.dispatchEvent(new CustomEvent("auth-status",{detail: true}));
        router.rout('/profile',{})
      }

    })
  },
  getCat(cat, item, router, sel, page){

    let src = xdata.app.forum.cat_search.replace('{{category}}', cat).replace('{{page}}', page),
    id = 'category:' + cat + ':page:1',
    items;

    sessionStorage.setItem('issue_pag', 1);

    xidb.get({index: 'cache', id: id}, function(err,res){
      if(err || !res || res.date < Date.now()){
        let obj = {id: id};

        utils.get(src, xdata.default.stream.fetch, function(err,res){
          if(err){return console.error(err)}

          items = tpl[sel](cat, res, router);

          item.append(items);

          if(sel === 'listgroup_forum_cat'){
            if(res.total_count > xdata.app.forum.issues_per_page){
              item.append(
                tpl.show_more_cat(cat, items, router)
              );
            }
            item.append(
              tpl.create_issue(cat,router)
            );
          }

          obj.data = res;
          obj.date = (Date.now() + xdata.default.idb.cache_maxage)
          xidb.add({index: 'cache', data: obj, put: true}, function(err){
            if(err){return console.log('unable to add item to cache')}

          })
        })

      } else {

        items = tpl[sel](cat, res.data, router);
        item.append(items)

        if(sel === 'listgroup_forum_cat'){
          if(res.data.total_count > xdata.app.forum.issues_per_page){
            item.append(
              tpl.show_more_cat(cat, items, router)
            );
          }
          item.append(
            tpl.create_issue(cat,router)
          );
        }
      }
    })
  },
  getNews(item, router, page, cnt){

    let src = xdata.app.news.issues.replace('{{page}}', page);

    sessionStorage.setItem('issue_pag', page);

    utils.get(src, xdata.default.stream.fetch, function(err,res){
      if(err){return console.error(err)}

      for (let i = 0; i < res.items.length; i++) {
        item.append(tpl.news_item(router, res.items[i]));
      }

      cnt.textContent = res.total_count;
      if(res.total_count > xdata.app.forum.issues_per_page){
        item.append(
          tpl.show_more_news(item, router)
        );
      }
    })

  },
  getForumSearch(term, item, router, page, dtype){

    let src;

    if(dtype && dtype === 'author'){
      src = xdata.app.forum.user_issues.replace(/{{type}}/, 'author').replace(/{{user}}/, term) + '&page='+ page;
    } else {
      src = xdata.app.forum.search.replace('{{search}}', term).replace('{{page}}', page);
    }

    sessionStorage.setItem('search_pag', 1);

    utils.get(src, xdata.default.stream.fetch, function(err,res){
      if(err){return console.error(err)}

      item.firstChild.append(x('span', {class: 'float-right'}, res.total_count));
      for (let i = 0; i < res.items.length; i++) {
        item.append(tpl.listgroup_forum_cat_item(res.items[i], router));
      }

    })

  },
  getNew(item, router, sel){
    let src = xdata.app.forum[sel],
    id = 'forum_'+ sel;
    xidb.get({index: 'cache', id: id}, function(err,res){
      if(err || !res || res.date < Date.now()){
        let obj = {id: id};

        utils.get(src, xdata.default.stream.fetch, function(err,res){
          if(err){return console.error(err)}
          tpl.latest_tpl(item, router, res)
          obj.data = res;
          obj.date = (Date.now() + xdata.default.idb.cache_maxage)
          xidb.add({index: 'cache', data: obj, put: true}, function(err){
            if(err){return console.log('unable to add item to cache')}

          })
        })

      } else {
        tpl.latest_tpl(item, router, res.data)
      }
    })
  },
  react(obj, cb){
    utils.get(obj.url, obj.opt, function(err,res){
      if(err){return cb(err)}
      cb(false)
    })
  },
  truncate(str, len){
    return str.slice(0, len) + '...'
  },
  empty: function(i){
    while (i.firstChild) {
      i.removeChild(i.firstChild);
    }
    return i
  },
  debounce(func, wait, immediate) {
    let timeout;
    return function() {
      let context = this, args = arguments,
      later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      },
      callNow = immediate && !timeout;

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow){
        func.apply(context, args);
      }
    }
  },
  isAuth(router){
    if(!sessionStorage.getItem('tk') || !sessionStorage.getItem('userData')){
      router.rout('/login', {});
      return false
    }
    return true;
  },
  hash(str, cb){
    wcs.digest({name: "SHA-512"},utils.str2u8(str))
    .then(function(hash){
      cb(false, new Uint8Array(hash));
    })
    .catch(function(err){
      cb(err)
    });
  },
  pbkdf2(pass,cb){

    wcs.importKey('raw', Uint8Array.from(pass.slice(0,32)),{name: 'PBKDF2'},false,['deriveBits'])
    .then(function(key) {
      wcs.deriveBits({
        "name": "PBKDF2",
        salt: Uint8Array.from(pass.slice(32)),
        iterations: 10000,
        hash: {name: "SHA-512"}},
        key, 256
      )
      .then(function(bits){
        cb(false, new Uint8Array(bits));
      })
      .catch(function(err){
        cb(err);
      });
    })
    .catch(function(err){
      cb(err);
    });
  },
  encrypt(secret, data, cb){

    let iv = window.crypto.getRandomValues(new Uint8Array(12));

    utils.hash(secret, function(err, pass){
      if(err){return cb(err)}

      utils.pbkdf2(pass, function(err, keybase){
        if(err){return cb(err)}

        wcs.importKey("raw", keybase,{name: "AES-GCM"},false,["encrypt", "decrypt"])
        .then(function(key){
          wcs.encrypt({name: "AES-GCM", iv: iv, tagLength: 128}, key, utils.str2u8(data))
          .then(function(ctext){
            ctext = utils.arr2hex([].concat(Array.from(iv), Array.from(new Uint8Array(ctext))))
            cb(false, ctext);
          })
          .catch(function(err){
            cb(err);
          });
        })
        .catch(function(err){
          console.error(err);
        });
      })
    })

  },
  decrypt(secret, data, cb){

    data = utils.hex2arr(data);

    let iv = Uint8Array.from(data.slice(0,12));
    data = Uint8Array.from(data.slice(12));

    utils.hash(secret, function(err, pass){
      if(err){return console.error(err)}

      utils.pbkdf2(pass, function(err, keybase){
        if(err){return console.error(err)}

        wcs.importKey("raw", keybase,{name: "AES-GCM"},false,["encrypt", "decrypt"])
        .then(function(key){
          wcs.decrypt({name: "AES-GCM",iv:iv,tagLength: 128},key,data)
          .then(function(ptext){
              ptext = utils.u82str(new Uint8Array(ptext))
              cb(false, ptext)
          })
          .catch(function(err){
            cb(err);
          });
        })
      })
    })
  },
  str2u8(str) {
    return new TextEncoder().encode(str);
  },
  u82str(str){
    return new TextDecoder().decode(str)
  },
  arr2hex(arr) {
    let str = '';
    for (let i = 0; i < arr.length; i++) {
      str+= ('0' + (arr[i] & 0xFF).toString(16)).slice(-2);
    }
    return str;
  },
  hex2arr(str) {
    let arr = [];
    for (var i = 0; i < str.length; i += 2) {
      arr.push(parseInt(str.substr(i, 2), 16));
    }
    return arr;
  },
  sortTitle(i){
    try {
      i = i.split('|');
      i[0] = i[0].slice(1,-1).replace(/-/g, ' ');
      i[1] = i[1].slice(5,-1);
      i[2] = i[2].replace(/\[tag:/g, '').split(']').slice(0,-1);
      return i;
    } catch (err) {
      return null;
    }

  },
  checkSpecial(str){
   return !/[~`!#$%\^&*+=\\\[\]\\';,/{}|\\":<>\?]/g.test(str);
 },
 toast: function(i, msg){
   const toast = x('div', {
      id: 'toast',
      class: 'alert alert-'+ i,
       role: "alert"
   }, msg);
   document.body.append(toast);
   setTimeout(function(){
     toast.classList.add('fadeout');
     setTimeout(function(){
       toast.remove();
     },1000)
   },3000)
   return;
 },
 add_sp: function(item, text){
   item.append(x('span',{class: 'spinner-grow.spinner-grow-sm.mr-1'}));
 },
 remove_sp: function(item, text){
   setTimeout(function(){
     item.lastChild.remove();
   },1000)
 },
 srt_comment(cnt){
   let str = 'Showing ' + cnt + ' comment';
   if(cnt !== 1){
     str+= 's'
   }
   return str;
 },
 shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
  }
}

export { utils }
