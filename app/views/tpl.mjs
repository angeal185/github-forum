import { x } from '../modules/xscript.mjs';
import { xdata } from '../data/xdata.mjs';
import { utils } from '../modules/utils.mjs';
import { xidb } from '../modules/xidb.mjs';

const tpl = {
  //nav
  menu_main(router){
    let nav_left = x('div', {class: 'nav-left col-6 d-flex'},
      x('div', {
        class: 'nav-lnk icon-bars mr-2 d-lg-none',
        onclick(){
          window.dispatchEvent(new Event("toggle-sidebar"));
        }
      }),
      x('img', {
        class:'img-fluid logo-img sh-95',
        src: xdata.default.logo
      })
    ),
    nav_right = x('div', {class: 'nav-right col-6'}),
    nav_sb = x('div', {class: 'nav-sb d-lg-none'},
      x('div', {class: 'sb-body'})
    ),
    items = xdata.base.nav,
    sb_items = xdata.base.nav_sb,
    login_status = x('span'), login_event;

    for (let i = 0; i < items.length; i++) {
      nav_right.append(x('div', {
        class: 'nav-lnk d-none d-lg-block',
        onclick(){
          router.rout('/'+ items[i])
        }
      }, items[i]))

    }

    nav_sb.firstChild.append(tpl.quick_search(router));

    for (let i = 0; i < sb_items.length; i++) {
      nav_sb.firstChild.append(x('div', {
          class: 'sb-lnk',
          onclick(){
            window.dispatchEvent(new Event("toggle-sidebar"));
            router.rout('/'+ sb_items[i])
          }
        },
        sb_items[i],
        x('span', {class:'icon-chevron-right float-right'})
      ))
    }

    nav_right.append(login_status)

    window.addEventListener('toggle-sidebar', function(evt){
      nav_sb.classList.toggle('active')
    })

    window.addEventListener('auth-status', function(evt){
      evt = evt.detail;
      let ele;
      if(evt){
        let ud = JSON.parse(sessionStorage.getItem('userData')),
        ddown = x('div',{class: 'login-menu'},
          x('div', {class:'text-center'},
            x('img', {
              class: 'login-img img-thumbnail',
              title: 'profile',
              src: ud.avatar_url,
              onerror(evt){
                evt.target.src = xdata.app.user_logo;
              }
            }),
            x('small', {class: 'd-block'}, ud.login)
          ),
          x('div', {class:'text-center'},
            x('button', {
              class: 'btn btn-sm btn-block btn-outline-primary',
              onclick(evt){
                router.rout('/profile')
              }
            }, 'Profile')
          ),
          x('div', {class:'text-center mt-2'},
            x('button', {
              class: 'btn btn-sm btn-block btn-outline-primary',
              onclick(){
                sessionStorage.removeItem('userData')
                sessionStorage.removeItem('tk')
                window.dispatchEvent(new CustomEvent("auth-status"))
                router.rout('/login')
              }
            }, 'Logout')
          )
        )

        ele = x('div', {
          class: 'icon-cog nav-lnk',
          onclick(){
            ddown.classList.toggle('show')
          }
        },ddown)

      } else {
        ele = x('div', {
          class: 'nav-lnk',
          onclick(){
            router.rout('/login')
          }
        }, 'login')
      }
      nav_right.lastChild.remove()
      nav_right.append(ele);
    })


    if(utils.isAuth(router)){
      login_event = true;
    } else {
      login_event = false;
    }

    window.dispatchEvent(new CustomEvent("auth-status",{detail: login_event}));

    return x('nav', {class: 'navbar fixed-top menu-nav'},
      x('div', {class: 'row'},
        nav_left, nav_right
      ),
      nav_sb
    );

  },
  menu_mobile(router){
    let item = x('div')
    return item;
  },
  //forum
  sidebar_forum(){

  },
  listgroup_forum(cat, res, router){

    let item = x('div', {class: 'list-group'},
      x('div', {class: 'list-group-item active'},
        'latest ' + cat + ' issues',
        x('span', {
          class: 'float-right sh-95 cp',
          onclick(){
            router.rout('/forum/category', {id: cat})
          }
        }, 'view '+ res.total_count)
      )
    );

    let max = res.items.length;
    if(max > xdata.app.forum.latest_issues_max){
      max = xdata.app.forum.latest_issues_max;
    }

    for (let i = 0; i < max; i++) {
      item.append(tpl.listgroup_forum_item(cat, res.items[i], router))
    }

    return item;
  },
  listgroup_forum_item(cat, res, router){

    if(!res.user.avatar_url || res.user.avatar_url === ''){
      res.user.avatar_url = xdata.app.user_logo;
    }

    let ttl = utils.sortTitle(res.title);
    if(!ttl){
      return '';
    }

    let date_arr = res.created_at.slice(0,-1).split('T'),
    item = x('div', {
        class: 'list-group-item',
      },
      x('div', {class: 'row'},
        x('div', {class: 'col-lg-6'},
          x('div', {class: 'media'},
            x('img',{
              class: 'mr-3 cat-img',
              src: res.user.avatar_url,
              onerror(evt){
                evt.target.src = xdata.app.user_logo;
              }
            }),
            x('div', {class: 'media-body'},
              x('h5', {
                class: 'f-title',
                onclick(){
                  router.rout('/forum/issue', {id: cat, data: res})
                }
              },ttl[0]),
              x('p', {class: 'cat-sub'}, utils.truncate(res.body, 32)),
            )
          )
        ),
        x('div', {class: 'col-lg-6'},
          x('div', {class: 'cat-info'},
            x('span', {
              class: 'icon-user cat-ico',
              title: 'user',
              onclick(){
                router.rout('/forum/user?q='+ res.user.login, {term: res.user.login})
              }
            }, res.user.login),
            x('span', {class: 'icon-comments cat-ico', title: 'comments'}, res.comments),
            x('span', {class: 'icon-calendar cat-ico', title: 'date'}, date_arr[0]),
            x('span', {class: 'icon-clock cat-ico', title: 'time'}, date_arr[1]),
          ),
          function(){
            let cinfo = x('div', {class: 'cat-info'},
              x('span', {class: 'icon-tag cat-ico',title: 'category'},
                x('span', {
                  class: 'cat-min',
                  onclick(){
                    router.rout('/forum/category', {id: ttl[1]})
                  }
                }, ttl[1])
              ),
              x('span', {
                class: 'icon-tags cat-ico',
                title: 'tags'
              })
            );

            for(let i = 0; i < ttl[2].length; i++){
              cinfo.lastChild.append(x('span', {
                class: 'tag-min',
                title: ttl[2][i],
                onclick(){
                  router.rout('/forum/tag?ts='+ Date.now(), {term: ttl[2][i]})
                }
              },ttl[2][i]))
            }
            return cinfo;
          },
          x('div', {class: 'cat-info'},
            x('span', {class: 'icon-eye cat-ico', title: 'views'}, res.reactions.eyes),
            x('span', {class: 'icon-thumbs-up cat-ico', title: 'likes'}, res.reactions['+1']),
            x('span', {class: 'icon-thumbs-down cat-ico', title: 'dislikes'}, res.reactions['-1'])
          )
        )
      )
    )

    return item;
  },
  listgroup_forum_cat(cat, res, router){

    let item = x('div', {class: 'list-group'},
      x('div', {class: 'list-group-item active'},
        cat +' issues',
        x('span', {
          class: 'float-right',
        }, res.total_count)
      )
    );

    for (let i = 0; i < res.items.length; i++) {
      item.append(tpl.listgroup_forum_cat_item(res.items[i], router))
    }

    return item;
  },
  listgroup_forum_cat_item(res, router){

    if(!res.user.avatar_url || res.user.avatar_url === ''){
      res.user.avatar_url = xdata.app.user_logo;
    }

    let ttl = utils.sortTitle(res.title);
    if(!ttl){
      return '';
    }

    let date_arr = res.created_at.slice(0,-1).split('T'),
    item = x('div', {class: 'list-group-item'},
      x('div', {class: 'row'},
        x('div', {class: 'col-lg-6'},
          x('div', {class: 'media'},
            x('img',{
              class: 'mr-3 cat-img',
              src: res.user.avatar_url,
              onerror(evt){
                evt.target.src = xdata.app.user_logo;
              }
            }),
            x('div', {class: 'media-body'},
              x('h5', {
                class: 'f-title',
                onclick(){
                  router.rout('/forum/issue', {id: ttl[1], data: res})
                }
              }, ttl[0]),
              x('p', {class: 'cat-sub'}, utils.truncate(res.body, 32)),
            )
          )
        ),
        x('div', {class: 'col-lg-6'},
          x('div', {class: 'cat-info'},
            x('span', {
              class: 'icon-user cat-ico',
              title: 'user',
              onclick(){
                router.rout('/forum/user?q='+ res.user.login, {term: res.user.login})
              }
            }, res.user.login),
            x('span', {class: 'icon-comments cat-ico', title: 'comments'}, res.comments),
            x('span', {class: 'icon-calendar cat-ico', title: 'date'}, date_arr[0]),
            x('span', {class: 'icon-clock cat-ico', title: 'time'}, date_arr[1])
          ),
          function(){
            let cinfo = x('div', {class: 'cat-info'},
              x('span', {class: 'icon-tag cat-ico',title: 'category'},
                x('span', {
                  class: 'cat-min',
                  onclick(){
                    router.rout('/forum/category', {id: ttl[1]})
                  }
                }, ttl[1])
              ),
              x('span', {
                class: 'icon-tags cat-ico',
                title: 'tags'
              })
            );

            for(let i = 0; i < ttl[2].length; i++){
              cinfo.lastChild.append(x('span', {
                class: 'tag-min',
                title: ttl[2][i],
                onclick(){
                  router.rout('/forum/tag?ts='+ Date.now(), {term: ttl[2][i]})
                }
              },ttl[2][i]))
            }
            return cinfo;
          },
          x('div', {class: 'cat-info'},
            x('span', {class: 'icon-eye cat-ico', title: 'views'}, res.reactions.eyes),
            x('span', {class: 'icon-thumbs-up cat-ico', title: 'likes'}, res.reactions['+1']),
            x('span', {class: 'icon-thumbs-down cat-ico', title: 'dislikes'}, res.reactions['-1'])
          )
        )
      )
    )

    return item;

  },
  listitem_forum_main(res, obj, router){

    if(!res.user.avatar_url || res.user.avatar_url === ''){
      res.user.avatar_url = xdata.app.user_logo;
    }

    let ttl = utils.sortTitle(res.title);
    if(!ttl){
      return '';
    }

    let date_arr = res.created_at.slice(0,-1).split('T'),
    item = x('div', {class: 'list-group-item'},
      x('div', {class: 'row'},
        x('div', {class: 'col-lg-6'},
          x('div', {class: 'media'},
            x('img',{
              class: 'mr-3 cat-img',
              src: res.user.avatar_url,
              onerror(evt){
                evt.target.src = xdata.app.user_logo;
              }
            }),
            x('div', {class: 'media-body'},
              x('h5', ttl[0]),
              x('p', {class: 'cat-sub'}, res.body),
            )
          )
        ),
        x('div', {class: 'col-lg-6'},
          x('div', {class: 'cat-info'},
            x('span', {
              class: 'icon-user cat-ico',
              title: 'user',
              onclick(){
                router.rout('/forum/user?q='+ res.user.login, {term: res.user.login})
              }
            }, res.user.login),
            x('span', {class: 'icon-calendar cat-ico', title: 'date'}, date_arr[0]),
            x('span', {class: 'icon-clock cat-ico', title: 'time'}, date_arr[1])
          ),
          function(){
            let cinfo = x('div', {class: 'cat-info'},
              x('span', {class: 'icon-tag cat-ico',title: 'category'},
                x('span', {
                  class: 'cat-min',
                  onclick(){
                    router.rout('/forum/category', {id: ttl[1]})
                  }
                }, ttl[1])
              ),
              x('span', {
                class: 'icon-tags cat-ico',
                title: 'tags'
              })
            );

            for(let i = 0; i < ttl[2].length; i++){
              cinfo.lastChild.append(x('span', {
                class: 'tag-min',
                title: ttl[2][i],
                onclick(){
                  router.rout('/forum/tag?ts='+ Date.now(), {term: ttl[2][i]})
                }
              },ttl[2][i]))
            }
            return cinfo;
          },
          x('div', {class: 'cat-info'},
            x('span', {class: 'icon-eye cat-ico', title: 'views'}, res.reactions.eyes),
            x('span', {
              class: 'icon-thumbs-up cat-ico',
              title: 'like this issue',
              onclick(evt){
                obj.opt.body = JSON.stringify({content: '+1'});
                utils.react(obj, function(err,res){
                  if(err){return console.error(err)}
                  evt.target.textContent = (parseInt(evt.target.textContent) + 1)
                })
              }
            }, res.reactions['+1']),
            x('span', {
              class: 'icon-thumbs-down cat-ico',
              title: 'dislike this issue',
              onclick(evt){
                obj.opt.body = JSON.stringify({content: '-1'});
                utils.react(obj, function(err,res){
                  if(err){return console.error(err)}
                  evt.target.textContent = (parseInt(evt.target.textContent) + 1)
                })
              }
            }, res.reactions['-1']),
            x('span', {
              class: 'icon-crosshairs cat-ico',
              title: 'report this user',
              onclick(evt){
                window.dispatchEvent(new CustomEvent("report-user",{detail: res}))
              }
            })
          )
        )
      )
    )
    return x('div', {class: 'list-group'},
      x('div', {class: 'list-group-item active'}, 'issue'),
      item
    );
  },
  listitem_forum_comment(res, obj, router){

    if(!res.user.avatar_url || res.user.avatar_url === ''){
      res.user.avatar_url = xdata.app.user_logo;
    }

    let date_arr = res.created_at.slice(0,-1).split('T'),
    item = x('div', {class: 'list-group-item'},
      x('div', {class: 'row'},
        x('div', {class: 'col-lg-6'},
          x('div', {class: 'media'},
            x('img',{
              class: 'mr-3 cat-img',
              src: res.user.avatar_url,
              onerror(evt){
                evt.target.src = xdata.app.user_logo;
              }
            }),
            x('div', {class: 'media-body'},
              x('p', {class: 'cat-sub'}, res.body),
            )
          )
        ),
        x('div', {class: 'col-lg-6'},
          x('div', {class: 'cat-info'},
            x('span', {
              class: 'icon-user cat-ico',
              title: 'user',
              onclick(){
                router.rout('/forum/user?q='+ res.user.login, {term: res.user.login})
              }
            }, res.user.login),
            x('span', {class: 'icon-calendar cat-ico', title: 'date'}, date_arr[0]),
            x('span', {class: 'icon-clock cat-ico', title: 'time'}, date_arr[1])
          ),
          x('div', {class: 'cat-info'},
            x('span', {
              class: 'icon-thumbs-up cat-ico',
              title: 'like this comment',
              onclick(evt){
                obj.opt.body = JSON.stringify({content: '+1'});
                utils.react(obj, function(err,res){
                  if(err){return console.error(err)}
                  evt.target.textContent = (parseInt(evt.target.textContent) + 1)
                })
              }
            }, res.reactions['+1']),
            x('span', {
              class: 'icon-thumbs-down cat-ico',
              title: 'dislike this comment',
              onclick(evt){
                obj.opt.body = JSON.stringify({content: '-1'});
                utils.react(obj, function(err,res){
                  if(err){return console.error(err)}
                  evt.target.textContent = (parseInt(evt.target.textContent) + 1)
                })
              }
            }, res.reactions['-1']),
            x('span', {
              class: 'icon-crosshairs cat-ico',
              title: 'report this user',
              onclick(evt){
                window.dispatchEvent(new CustomEvent("report-user",{detail: res}))
              }
            })
          )
        )
      )
    )

    return item;
  },
  quick_search(router){
    let obj = {
      type: 'title',
      term: ''
    },
    btn = x('span', {
      class: 'icon-search input-group-text cp',
      onclick(evt){
        if(obj.term && obj.type){
          evt.target.classList.remove('icon-search');
          evt.target.append(x('div', {class: 'spinner-grow spinner-grow-sm'}));

          router.rout('/forum/search?ts='+ Date.now(), {term: obj.term, type: obj.type});
          setTimeout(function(){
            evt.target.firstChild.remove();
            evt.target.classList.add('icon-search');
          }, 2000)
        }
      }
    }),
    srch = x('input',{
      class: 'form-control',
      placeHolder: 'Search...',
      onkeyup(evt){
        if(evt.keyCode === 13){
          return btn.click()
        }
        obj.term = this.value.trim();
      }
    })

    return x('div', {class: 'form-group'},
      x('div', {class: 'input-group'},
        srch,
        x('div', {class: 'input-group-append'},btn)
      ),
      function(){
        let optGroup = x('div', {class: 'mt-1 ml-1 fs-1 fw-300'}),
        items = ['title', 'category', 'tag', 'author'];
        for (let i = 0; i < items.length; i++) {
          optGroup.append(x('div',{class: 'form-check form-check-inline'},
            x('input', {
              class: 'form-check-input',
              type: 'checkbox',
              onclick(evt){
                let eles = evt.target.parentNode.parentNode.children;
                evt.target.checked = true;
                obj.type = items[i];
                for (let j = 0; j < eles.length; j++) {
                  if(j !== i && eles[j].firstChild.checked){
                    eles[j].firstChild.checked = false;
                  }
                }

              }
            }),
            x('label', {class: 'form-check-label'}, items[i])
          ))
        }
        optGroup.firstChild.firstChild.checked = true;
        return optGroup;
      }
    )
  },
  latest(router, sel){

    let item = x('div', {class: 'list-group d-none d-lg-block'},
      x('div', {class: 'list-group-item active'},'forum '+ sel)
    )
    utils.getNew(item,router,sel);
    return item;
  },
  latest_tpl(item, router, res){

    let date_arr,
    max = xdata.app.forum.latest_issues_max,
    cnt = 0;
    for (let i = 0; i < res.length; i++) {

      if(!res[i].user.avatar_url || res[i].user.avatar_url === ''){
        res[i].user.avatar_url = xdata.app.user_logo;
      }
      let ttl = utils.sortTitle(res[i].title);
      if(!ttl){
        continue;
      }

      date_arr = res[i].created_at.slice(0,-1).split('T')
      item.append(x('div', {class: 'list-group-item'},
        x('div', {class: 'row'},
          x('div', {class: 'col-12'},
            x('div', {class: 'media'},
              x('img',{
                class: 'mr-3 min-img',
                src: res[i].user.avatar_url,
                onerror(evt){
                  evt.target.src = xdata.app.user_logo;
                }
              }),
              x('div', {class: 'media-body'},
                x('h5', {
                  class: 's-title',
                  onclick(){
                    router.rout('/forum/issue?ts='+ Date.now(), {id: ttl[1], data: res[i]})
                  }
                }, utils.truncate(ttl[0], 15)),

              )
            )
          ),
          x('div', {class: 'col-12'},
            x('div',
              x('span', {
                class: 'icon-user cat-ico',
                title: 'user',
                onclick(){
                  router.rout('/forum/user?q='+ res[i].user.login, {term: res[i].user.login})
                }
              }, res[i].user.login),
              x('span', {class: 'cat-ico', title: 'date/time'}, date_arr.join('/'))
            ),
            function(){
              let cinfo = x('div',
                x('span', {class: 'icon-tag cat-ico',title: 'category'},
                  x('span', {
                    class: 'cat-min',
                    onclick(){
                      router.rout('/forum/category?ts='+ Date.now(), {id: ttl[1]})
                    }
                  }, ttl[1])
                ),
                x('span', {
                  class: 'icon-tags cat-ico',
                  title: 'tags'
                })
              );

              for(let i = 0; i < ttl[2].length; i++){
                cinfo.lastChild.append(x('span', {
                  class: 'tag-min',
                  title: ttl[2][i],
                  onclick(){
                    router.rout('/forum/tag?ts='+ Date.now(), {term: ttl[2][i]})
                  }
                },ttl[2][i]))
              }

              return cinfo;
            },
            x('div',
              x('span', {class: 'icon-comments cat-ico', title: 'comments'}, res[i].comments),
              x('span', {class: 'icon-eye cat-ico', title: 'views'}, res[i].reactions.eyes),
              x('span', {class: 'icon-thumbs-up cat-ico', title: 'likes'}, res[i].reactions['+1']),
              x('span', {class: 'icon-thumbs-down cat-ico', title: 'dislikes'}, res[i].reactions['-1'])
            )
          )
        )
      ))
      cnt++;
      if(cnt === max){
        break;
      }
    }
  },
  create_issue(cat,router){
    let obj = {
      labels: [cat],
      title: '',
      body: ''
    },
    ttl_inp = x('input', {
      class: 'form-control',
      type: 'text',
      placeHolder: 'issue title',
      onkeyup(evt){
        let arg = evt.target.value,
        max = xdata.app.forum.max_issue_title_length;
        if(arg.length > max){
          arg = arg.slice(0,max);
          evt.target.value = arg;
        }
        obj.title = arg.trim();
      }
    }),
    tag_inp = x('input', {
      class: 'form-control',
      type: 'text',
      placeHolder: 'tags separated by comma',
      onkeyup(evt){
        let arr = [cat],
        items = evt.target.value.split(',');
        for (let i = 0; i < items.length; i++) {
          if(items[i] !== '' && items[i].length <= xdata.app.forum.max_tag_length && utils.checkSpecial(items[i])){
            arr.push(items[i].trim())
          }
        }
        arr = arr.slice(0, xdata.app.forum.max_tags)
        obj.labels = arr;
      }
    }),
    msg_ta = x('textarea', {
      class: 'form-control',
      placeHolder: 'issue body',
      rows: 10,
      onkeyup(evt){
        let body = evt.target.value,
        max = xdata.app.forum.max_issue_length;
        if(body.length > max){
          body = body.slice(0,max);
          evt.target.value = body;
        }
        obj.body = body.trim();
      }
    }),
    item = x('div', {class: 'create-issue'},
      x('div', {class: 'card'},
        x('div', {class: 'card-body'},
          x('h4', 'Create issue'),
          x('div', {class: 'row'},
            x('div', {class: 'col-lg-6'},
              x('div',{class: 'form-group'}, ttl_inp)
            ),
            x('div', {class: 'col-lg-6'},
              x('div',{class: 'form-group'}, tag_inp)
            ),
            x('div', {class: 'col-12'},
              x('div',{class: 'form-group'}, msg_ta)
            )
          ),
          x('button', {
            class: 'btn btn-outline-primary btn-sm',
            onclick(){

              let tk = JSON.parse(sessionStorage.getItem('tk')),
              newobj, data;
              if(
                !tk ||
                obj.labels.length < 1 ||
                !obj.title || !obj.body ||
                !utils.checkSpecial(obj.title) ||
                !utils.checkSpecial(obj.labels[0])
              ) {
                console.error('invalid data')
                return;
              }

              obj.title = obj.title.replace(/ /g, '-')

              newobj = Object.assign({}, obj);
              newobj.labels[0] = newobj.labels[0].replace(/ /g, '-')
              newobj.title = '[' + newobj.title + ']|[cat:'+ newobj.labels[0]+']|';

              for (let i = 1; i < newobj.labels.length; i++) {
                if(utils.checkSpecial(newobj.labels[i])){
                  newobj.labels[i] = newobj.labels[i].replace(/ /g, '-')
                  newobj.title+= ('[tag:'+ newobj.labels[i]+']');
                }
              }

              delete newobj.labels;
              data = Object.assign({}, xdata.default.stream.post, {body: JSON.stringify(newobj)});
              data.headers['Authorization'] = 'token '+ tk;


              utils.get(xdata.app.forum.create_issue, data, function(err,res){
                if(err){
                  utils.toast('danger', 'new issue failed');
                  return console.error(err)
                }
                utils.toast('success', 'new issue created');
                xidb.delete({index: 'cache', id: 'category:'+cat+':page:1'}, function(err){
                  if(err){return console.log('unable to add item to cache')}
                  setTimeout(function(){
                    router.rout('/forum/category?ts='+ Date.now(), {id: cat});
                  }, 2000)
                })
              })
            }
          }, 'Commit')

        )
      )
    )


    return item
  },
  create_comment(issue, cnt, router, num, rf){
    let obj = {
      body: ''
    },
    msg_ta = x('textarea', {
      class: 'form-control',
      placeHolder: 'issue body',
      rows: 6,
      onkeyup(evt){
        let body = evt.target.value,
        max = xdata.app.forum.max_comment_length;
        if(body.length > max){
          body = body.slice(0,max);
          evt.target.value = body;
        }
        obj.body = body.trim();
      }
    }),
    item = x('div', {class: 'create-issue'},
      x('div', {class: 'card'},
        x('div', {class: 'card-body'},

          x('div', {class: 'row'},
            x('div', {class: 'col-12'},
              x('h4', 'Comment'),
              x('div',{class: 'form-group'}, msg_ta)
            )
          ),
          x('button', {
            class: 'btn btn-outline-primary btn-sm',
            onclick(){

              let tk = JSON.parse(sessionStorage.getItem('tk')),
              data;

              if(!tk || !obj.body) {
                console.error('invalid data')
                return;
              }

              data = Object.assign({}, xdata.default.stream.post, {body: JSON.stringify(obj)});
              data.headers['Authorization'] = 'token '+ tk;

              utils.get(issue, data, function(err,res){
                if(err){
                  utils.toast('danger', 'new comment failed');
                  return console.error(err)
                }
                utils.toast('success', 'new comment added');
                rf.click()
              })
            }
          }, 'Commit')

        )
      )
    )


    return item
  },
  profile_data(items, obj){
    let sect = x('div', {class: 'col-lg-6'});
    for (let i = 0, keys = Object.keys(items); i < keys.length; i++) {
      sect.append(
        x('p', items[keys[i]] +': ', x('span', {class: 'user-txt'}, obj[keys[i]] || ''))
      )
    }
    return sect;
  },
  user_card(obj){

    return x('div', {class: 'col-12'},
        x('div', {class: 'card mb-4'},
          x('div', {class: 'card-body'},
            x('div', {class: 'media'},
              x('img', {
                class: 'img-thumbnail mr-4 user-img',
                src: obj.avatar_url || xdata.app.user_logo,
                onerror(evt){
                  evt.target.src = xdata.app.user_logo;
                }
              }),
              x('div', {class: 'media-body'},
                x('h4', {class: 'mb-4'}, obj.login),
                x('p', {class: 'user-txt'}, obj.bio || ''),
                x('p', {class: 'user-txt'}, obj.location || ''),
                x('p', {class: 'user-txt'}, obj.blog || '')
              )
            )
          )
        )
      )
  },
  show_more_cat(cat, items, router){

    let item = x('button',{
      class: 'btn btn-block btn-sm btn-primary mb-4',
      onclick(){
        let pag = sessionStorage.getItem('issue_pag'),
        src = xdata.app.forum.cat_search.replace('{{category}}', cat).replace('{{page}}', pag + 1)

        utils.get(src, xdata.default.stream.fetch, function(err,res){
          if(err){
            item.remove();
            return console.error(err)
          }

          if(!res.items || !res.items.length){
            item.textContent = 'No more issues';
            item.onclick = null;
          }

          sessionStorage.setItem('issue_pag', pag + 1);

          for (let i = 0; i < res.items.length; i++) {
            items.append(tpl.listgroup_forum_cat_item(res.items[i], router))
          }

        })

      }
    }, 'show more')

    return item;
  },
  show_more_news(items, router){

    let item = x('button',{
      class: 'btn btn-block btn-sm btn-primary mb-4',
      onclick(){
        let pag = sessionStorage.getItem('issue_pag'),
        src = xdata.app.news.issues.replace('{{page}}', pag+1);

        utils.get(src, xdata.default.stream.fetch, function(err,res){
          if(err){
            item.remove();
            return console.error(err)
          }

          if(!res.items || !res.items.length){
            item.textContent = 'No more news';
            item.onclick = null;
          }

          sessionStorage.setItem('issue_pag', pag + 1);

          for (let i = 0; i < res.items.length; i++) {
            items.append(tpl.news_item(router, res.items[i]));
          }

        })

      }
    }, 'show more')

    return item;
  },
  show_more_Search(term, items, router, dtype){

    let item = x('button',{
      class: 'btn btn-block btn-sm btn-primary mb-4',
      onclick(){
        let pag = sessionStorage.getItem('search_pag'),
        src;

        if(dtype === 'author'){
          src = xdata.app.forum.user_issues.replace(/{{type}}/, 'author').replace(/{{user}}/, term) + '&page='+ (pag+1)
        } else {
          src = xdata.app.forum.search.replace('{{search}}', term).replace('{{page}}', pag+1);
        }

        utils.get(src, xdata.default.stream.fetch, function(err,res){
          if(err){
            item.remove();
            return console.error(err)
          }

          if(!res.items || !res.items.length){
            item.textContent = 'No more issues';
            item.onclick = null;
          }

          sessionStorage.setItem('search_pag', pag + 1);

          for (let i = 0; i < res.items.length; i++) {
            items.append(tpl.listgroup_forum_cat_item(res.items[i], router))
          }

        })

      }
    }, 'show more')

    return item;
  },
  show_more_comment(data, comments, router, obj, ccount){

    let item = x('button',{
      class: 'btn btn-block btn-sm btn-primary mb-4',
      onclick(){
        let pag = parseInt(sessionStorage.getItem('comment_pag')),
        per_page = xdata.app.comment_per_page,
        src = data.data.comments_url + '?per_page='+ per_page +'&page='+ (pag + 1),
        clen = parseInt(sessionStorage.getItem('comment_len'));

        utils.get(src, xdata.default.stream.fetch, function(err,res){
          if(err){
            item.remove();
            return console.error(err)
          }

          if(!res.length){
            item.textContent = 'No more comments';
            item.onclick = null;
          }

          sessionStorage.setItem('comment_pag', JSON.stringify(pag + 1));
          clen+= res.length;
          ccount.textContent = utils.srt_comment(clen);
          sessionStorage.setItem('comment_len', JSON.stringify(clen));

          for (let i = 0; i < res.length; i++) {
            obj.url = res[i].reactions.url;
            comments.append(tpl.listitem_forum_comment(res[i], Object.assign({}, obj),router))
          }

        })

      }
    }, 'show more')

    return item;
  },
  news_item(router, res, obj){
    let date_arr = res.created_at.slice(0,-1).split('T')

    if(!res.user.avatar_url || res.user.avatar_url === ''){
      res.user.avatar_url = xdata.app.user_logo;
    }

    return x('div', {class: 'list-group-item'},
      x('div', {class: 'row'},
        x('div', {class: 'col-12'},
          x('div', {class: 'media'},
            x('img',{
              class: 'mr-3 min-img',
              src: res.user.avatar_url,
              onerror(evt){
                evt.target.src = xdata.app.user_logo;
              }
            }),
            x('div', {class: 'media-body'},
              x('h5', {
                class: 's-title',
                onclick(){
                  router.rout('/news/post?ts='+ Date.now(), {data: res})
                }
              }, res.title)
            )
          )
        ),
        x('div', {class: 'col-12'},
          function(){
            if(obj){
              return x('p', res.body)
            }
          },
          x('div',
            x('span', {
              class: 'icon-user cat-ico',
              title: 'user',
              onclick(){
                router.rout('/forum/user?q='+ res.user.login, {term: res.user.login})
              }
            }, res.user.login),
            x('span', {class: 'cat-ico', title: 'date/time'}, date_arr.join('/')),
            x('span', {class: 'icon-comments cat-ico', title: 'comments'}, res.comments),
            x('span', {class: 'icon-eye cat-ico', title: 'views'}, res.reactions.eyes),
            x('span', {
              class: 'icon-heart cat-ico',
              title: 'hearts',
              onclick(evt){
                if(obj){
                  obj.opt.body = JSON.stringify({content: 'heart'});
                  utils.react(obj, function(err,res){
                    if(err){return console.error(err)}
                    evt.target.textContent = (parseInt(evt.target.textContent) + 1)
                  })
                }
              }
            }, res.reactions.heart)
          )
        )
      )
    )

  },
  cat_cloud(router){
    let div = x('div', {class: 'list-group-item'}),
    item = x('div', {class: 'list-group d-none d-lg-block'},
      x('div', {class: 'list-group-item active'}, 'Categories'),
      div
    )

    utils.get(xdata.app.api +'/categories.json', xdata.default.stream.json, function(err,cats){
      if(err){return console.error(err)}
      for (let i = 0; i < cats.length; i++) {
        div.append(x('span', {
            class: 'cat-min cp mb-2',
            onclick(){
              router.rout('/forum/category?ts='+ Date.now(), {id: cats[i]})
            }
          },cats[i]
        ))
      }
    })

    return item
  },
  tag_cloud(router){
    let div = x('div', {class: 'list-group-item'}),
    item = x('div', {class: 'list-group d-none d-lg-block'},
      x('div', {class: 'list-group-item active'}, 'Tag cloud'),
      div
    )

    utils.get(xdata.app.api +'/tags.json', xdata.default.stream.json, function(err,tags){
      if(err){return console.error(err)}
      tags = tags = utils.shuffle(tags).slice(0, xdata.app.forum.tag_cloud_len)
      for (let i = 0; i < tags.length; i++) {
        div.append(x('span', {
            class: 'tag-min cp mb-2',
            onclick(){
              router.rout('/forum/tag?ts='+ Date.now(), {term: tags[i]})
            }
          },tags[i]
        ))
      }
    })
    
    return item
  },
  moderators(router){
    let div = x('div', {class: 'list-group-item'}),
    item = x('div', {class: 'list-group d-none d-lg-block'},
      x('div', {class: 'list-group-item active'}, 'Moderators'),
      div
    )

    utils.get(xdata.app.api +'/moderators.json', xdata.default.stream.json, function(err,mods){
      if(err){return console.error(err)}

      for (let i = 0; i < mods.length; i++) {
        div.append(x('div', {class: 'media'},
          x('img', {
            class: 'mr-3 min-img',
            src: mods[i].img,
            onerror(evt){
              evt.target.src = xdata.app.user_logo;
            }
          }),
          x('div',{class: 'media-body'},
            x('div', {
              class: 'cp sh-95',
              onclick(){
                router.rout('/forum/user?q='+ mods[i].name, {term: mods[i].name})
              }
            }, mods[i].name)
          )
        ))

      }
    })
    return item
  },
  bnav_lnks(router){
    return x('span', {class: 'b-lnks'},
      x('span', {
        class: 'icon-rss cp',
        title: 'atom feeds',
        onclick(){
          router.rout('/atom', {})
        }
      })
    )
  },
  report(){
    let obj = {},
    user = x('span'),
    ta = x('textarea', {
      class: 'form-control',
      readOnly: '',
      rows: 4
    }),
    rp = x('textarea', {
      class: 'form-control',
      rows: 4,
      onkeyup(evt){
        let txt = evt.target.value;
        if(txt.length > 200){
          txt = txt.slice(0,200);
          evt.target.value = txt;
        }
        obj.report_reason = txt;
      }
    })

    let mdl = x('div', {class:'modal'},
      x('div', {class:'modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg'},
        x('div', {class:'modal-content'},
          x('div', {class:'modal-header'},
            x('h5', {class: 'modal-title'}, 'Report a user')
          ),
          x('div', {class:'modal-body'},
            x('div', {class:'form-group mb-2'},
              x('label', 'this action will report user ', user, ' for the following'),
              ta
            ),
            x('div', {class:'form-group mb-2'},
              x('label', 'please state your reason'),
              rp
            )
          ),
          x('div', {class:'modal-footer'},
            x('button', {
              class: 'btn btn-sm btn-outline-primary',
              onclick(){

                let tk = JSON.parse(sessionStorage.getItem('tk')),
                data;

                if(!tk) {
                  return utils.toast('danger', 'This action requires you to login');
                }

                if(!obj || !obj.report_reason || obj.report_reason.length < 3 || !obj.report_data){
                  return utils.toast('danger', 'invalid input data');
                }

                obj = JSON.stringify(obj);
                data = Object.assign({}, xdata.default.stream.post);
                data.headers['Authorization'] = 'token '+ tk;
                data.body = JSON.stringify({body:obj});
                utils.get(xdata.app.forum.create_report, data, function(err,res){
                  if(err){
                    utils.toast('danger', 'report user failed');
                    return console.error(err)
                  }
                  utils.toast('success', 'user reported');
                  mdl.classList.remove('show')
                })

              }
            }, 'Submit'),
            x('button', {
              class: 'btn btn-sm btn-outline-primary',
              onclick(){
                mdl.classList.remove('show')
              }
            }, 'Cancel')
          )
        )
      )
    )

    window.addEventListener('report-user', function(evt){
      evt = evt.detail;
      obj = {};
      obj.report_data = JSON.stringify({
        user: evt.user.login,
        url: evt.url
      }) || null;
      obj.report_reason = '';
      user.textContent = evt.user.login;
      ta.textContent = evt.body;
      mdl.classList.add('show');
    })

    return mdl
  }
}

export { tpl }
