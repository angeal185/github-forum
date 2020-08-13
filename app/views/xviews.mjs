import { x } from '../modules/xscript.mjs';
import { xdata } from '../data/xdata.mjs';
import { router } from '../modules/jsnode.mjs';
import { tpl } from './tpl.mjs';
import { utils } from '../modules/utils.mjs';
import { xidb } from '../modules/xidb.mjs';

const xviews = {
  build(app_main){

    let toTop = x('div', {
      class: 'totop icon-chevron-up sh-95 hidden',
      onclick: function(){
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
    }),bc = x('span', {class: 'bc'},
      xdata.default.title,
      x('span')
    ),
    bc_tpl = x('span'),
    item = x('main-view',
      tpl.menu_main(router),
      tpl.menu_mobile(router),
      x('div', {class: 'app-main container-fluid'},
        x('div', {class: 'app-main row'},
          x('div', {class: 'col-lg-3'},
            tpl.quick_search(router),
            tpl.latest(router),
            tpl.cat_cloud(router),
            tpl.tag_cloud(router)
          ),
          app_main
        ),
        x('div',{class: 'b-nav'},
          toTop,
          bc
        )
      )
    )

    window.addEventListener('scroll', utils.debounce(function(evt){
       let top = window.pageYOffset || document.scrollTop
       if(top === NaN || !top){
         toTop.classList.add('hidden')
       } else if(toTop.classList.contains('hidden')){
         toTop.classList.remove('hidden');
       }
       top = null;
       return;
    }, 250))

    window.addEventListener('bc-ud', function(evt){
      let arr = [],
      items = evt.detail.split('/');
      for (let i = 0; i < items.length; i++) {
        items[i] = items[i].split('?')[0];
        arr.push(x('span',
          x('i', {class: 'icon-chevron-right'},
          items[i]
        )))
      }
      utils.empty(bc.lastChild).append(...arr)
    })

    xviews.build = null;
    return item
  },
  error(stream, data){
    return x('code', stream.js(data))
  },

  //views
  profile(stream, data){
    let obj = stream.ssGet('userData'),
    tk = stream.ssGet('tk');


    if(!obj || typeof obj !== 'object' || !tk){
      return router.rout('/login', {})
    }

    let contrib = x('p', {class: 'user-txt'}),
    authored = x('p', {class: 'user-txt'}),
    item = x('div', {class: 'row'},
      x('div', {class: 'col-12'},
        x('div', {class: 'card mb-4'},
          x('div', {class: 'card-body'},
            x('div', {class: 'media'},
              x('img', {
                class: 'img-thumbnail mr-4',
                src: obj.avatar_url
              }),
              x('div', {class: 'media-body'},
                x('h4', {class: 'mb-4'}, obj.login),
                x('p', {class: 'user-txt'}, obj.bio),
                x('p', {class: 'user-txt'}, obj.location),
                x('p', {class: 'user-txt'}, obj.blog),
                contrib, authored
              )
            )
          )
        )
      ),
      x('div', {class: 'col-12'},
        x('div', {class: 'card mb-4'},
          x('div', {class: 'card-body'},
            x('div', {class: 'row'},
              tpl.profile_data(data.items_a, obj),
              tpl.profile_data(data.items_b, obj)
            )
          )
        )
      )
    )

    let cnf = xdata.default.stream.fetch,
    src = xdata.app.forum.user_issues.replace(/{{type}}/, 'commenter').replace(/{{user}}/, obj.login),
    user_obj = {
      commented: 0,
      authored: 0,
      date: Date.now() + stream.settings.idb.cache_maxage
    },
    ttl = xdata.default.title,
    cnt;

    cnf.headers['Authorization'] = 'token '+ tk,

    utils.get(src, cnf, function(err,res){
      if(err){return console.error(err)}
      cnt = res.total_count
      user_obj.commented = cnt
      contrib.textContent = 'Commented in '+ cnt +' '+ ttl +' issues';
      src = xdata.app.forum.user_issues.replace(/{{type}}/, 'author').replace(/{{user}}/, obj.login);
      utils.get(src, cnf, function(err,res){
        if(err){return console.error(err)}
        cnt = res.total_count
        user_obj.authored = cnt
        authored.textContent = 'Author of '+ cnt +' '+ ttl +' issues';
        stream.lsSet('userContrib', user_obj)
      })
    })

    return item;
  },
  login(stream, data){

    let tk_inp = x('div', {class: 'form-group'},
      x('input', {
        class:'form-control',
        type: 'password',
        placeHolder: 'github access token'
      })
    ),
    pass_inp = x('input', {
      class:'form-control',
      type: 'password',
      placeHolder: 'password'
    }),
    tk_msg = x('p');

    if(stream.lsGet('tk')){
      tk_inp.classList.add('hidden');
      tk_msg.textContent = 'encrypted token found.'
    } else {
      tk_msg.textContent = 'encrypted token not found.'
    }

    let item = x('div', {class: 'container'},
      x('div', {class: 'row'},
        x('div', {class: 'col-lg-6 offset-lg-3'},
          x('div', {class: 'card'},
            x('div', {class: 'card-body text-center'},
              x('h4', {class:'mb-4'}, 'Authentication'),
              tk_msg,
              tk_inp,
              x('div', {class: 'form-group'},
                pass_inp,
                x('button', {
                  class: 'btn btn-outline-primary btn-sm rs-btn',
                  onclick(){
                    stream.lsDel('tk');
                    tk_inp.classList.remove('hidden');
                    tk_msg.textContent = 'encrypted token not found.'
                  }
                }, 'reset'),
                x('button', {
                  class: 'btn btn-outline-primary btn-sm cat-btn',
                  onclick(){
                    let val = tk_inp.firstChild.value,
                    pass = pass_inp.value,
                    tk = stream.lsGet('tk')

                    if(pass && tk){
                      utils.decrypt(pass, tk, function(err,res){
                        if(err){return console.error(err)}
                        stream.ssSet('tk', res);
                        utils.getUserData(res, router)
                      })
                    } else if(pass && val){
                      utils.encrypt(pass, val, function(err,res){
                        if(err){return console.error(err)}
                        stream.lsSet('tk', res);
                        stream.ssSet('tk', val);
                        utils.getUserData(val, router)
                      })
                    } else {
                      return //
                    }

                  }
                }, 'commit')
              )
            )
          )
        )
      )
    )


    return item;
  },
  forum(stream, data){
    let item = x('div'),
    cats = xdata.app.forum.categories;

    for (let i = 0; i < cats.length; i++) {
      utils.getCat(cats[i], item, router, 'listgroup_forum', '1');
    }

    return item;
  },
  forum_category(stream, data){
    let item = x('div');
    utils.getCat(data.id, item, router, 'listgroup_forum_cat', '1');
    return item;
  },
  forum_search(stream, data){
    let str;
    if(!data.type){
      str = 'Search results';
    } else if(data.type === 'tag'){
      str = [data.term, 'issues'].join(' ')
      data.term = '[tag:'+ data.term +']'
    } else if(data.type === 'category'){
      str = [data.term, 'issues'].join(' ')
      data.term = '[cat:'+ data.term +']'
    } else if(data.type === 'author'){
      str = [data.term, 'issues'].join(' ')
    }

    let item = x('div', {class: 'list-group'},
      x('div', {class: 'list-group-item active'},str)
    )
    utils.getForumSearch(data.term, item, router, '1', data.type);
    return x('div', item, tpl.show_more_Search(data.term, item, router, data.type));
  },
  forum_issue(stream, data){

    stream.ssSet('comment_pag', 1)
    let item = x('div'),
    per_page = xdata.app.forum.comment_per_page,
    id = 'issue:' + data.data.number + ':page:1',
    src = data.data.comments_url + '?page=1&per_page='+ per_page,
    ccount = x('span'),
    rf = x('span', {
      class: 'float-right cp icon-redo-alt',
      title: 'refresh',
      onclick(){

        xidb.delete({index: 'cache', id: id}, function(err){
          if(err){return console.log('unable to add item to cache')}
          router.rout('/forum/issue?ts='+Date.now(), {id: data.id, data: data.data})
        })

      }
    }),
    comments = x('div', {class: 'list-group'},
      x('div', {class: 'list-group-item active'},
        ccount,rf
      )
    ),
    ttl = utils.sortTitle(data.data.title),
    cat = ttl[1],
    reactions = data.data.comments_url.split('/').slice(0,-1).join('/') +'/reactions',
    tk = stream.ssGet('tk')

    let obj = {
      url: reactions,
      opt: xdata.default.stream.react
    },
    showMore = x('div');

    obj.opt.headers['Authorization'] = 'token '+ tk
    obj.opt.body = JSON.stringify({content: 'eyes'});
    utils.react(obj, function(err,res){
      if(err){return console.error(err)}
      item.append(
        tpl.listitem_forum_main(data.data, Object.assign({},obj), router),
        comments,
        showMore,
        tpl.create_comment(data.data.comments_url, data.data.comments, router, cat, data.data.number,rf)
      )

      xidb.get({index: 'cache', id: id}, function(err,res){
        if(err || !res || res.date < Date.now()){
          let obj2 = {id: id};

          utils.get(src, xdata.default.stream.fetch, function(err,res){
            if(err){return console.error(err)}
            stream.ssSet('comment_len', res.length);
            ccount.textContent = utils.srt_comment(res.length);
            if(res.length < 100){
              showMore.append(
                tpl.show_more_comment(data, comments, cat, router, obj, ccount)
              )
            }

            for (let i = 0; i < res.length; i++) {
              obj.url = res[i].reactions.url;
              comments.append(tpl.listitem_forum_comment(res[i],cat, Object.assign({}, obj),router))
            }

            obj2.data = res;
            obj2.date = (Date.now() + stream.settings.idb.cache_maxage)
            xidb.add({index: 'cache', data: obj2, put: true}, function(err){
              if(err){return console.log('unable to add item to cache')}

            })

          })

        } else {
          console.log('loaded from cache')

          ccount.textContent = utils.srt_comment(res.data.length);
          stream.ssSet('comment_len', res.data.length);
          if(res.data.length < 100){
            showMore.append(
              tpl.show_more_comment(data, comments, cat, router, obj, ccount)
            )
          }
          for (let i = 0; i < res.data.length; i++) {
            obj.url = res.data[i].reactions.url;
            comments.append(tpl.listitem_forum_comment(res.data[i], cat, Object.assign({}, obj), router))
          }


        }
      })
    })

    return item
  }
}

export { xviews }
