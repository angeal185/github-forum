import { router, x } from './modules/jsnode.mjs';
import { xidb } from './modules/xidb.mjs';
import { utils } from './modules/utils.mjs';

router.on('/login', function(request, stream){
  stream.render('login', request.data, function(err){
    if(err){return stream.renderErr();}
  })
})
.on('/profile', function(request, stream){
  if(utils.isAuth(router)){
    stream.render('profile', request.data, function(err){
      if(err){return stream.renderErr();}
    })
  }
})
.on('/forum', function(request, stream) {
  if(utils.isAuth(router)){
    stream.render('forum', request.data, function(err){
      if(err){return stream.renderErr();}
    })
  }
})
.on('/forum/category', function(request, stream) {
  if(utils.isAuth(router)){
    stream.render('forum_category', request.data, function(err){
      if(err){return stream.renderErr();}
    })
  }
})
.on('/forum/tag', function(request, stream) {
  if(utils.isAuth(router)){
    request.data.type = 'tag';
    stream.render('forum_search', request.data, function(err){
      if(err){return stream.renderErr();}
    })
  }
})
.on('/forum/issue', function(request, stream) {
  if(utils.isAuth(router)){
    if(!request.data.data || !request.data.id){
      return router.rout('/forum')
    }

    stream.render('forum_issue', request.data, function(err){
      if(err){return stream.renderErr();}
    })
  }

})
.on('/forum/search', function(request, stream) {
  if(utils.isAuth(router)){
    stream.render('forum_search', request.data, function(err){
      if(err){return stream.renderErr();}
    })
  }
})
.on('/forum/user', function(request, stream) {
  if(utils.isAuth(router)){
    request.data.type = 'author';
    stream.render('forum_search', request.data, function(err){
      if(err){return stream.renderErr();}
    })
  }
})
.on('/forum/latest', function(request, stream) {
  if(utils.isAuth(router)){
    stream.render('forum_create', request.data, function(err){
      if(err){return stream.renderErr();}
    })
  }
})
.on('/forum/popular', function(request, stream) {
  if(utils.isAuth(router)){
    stream.render('forum_create', request.data, function(err){
      if(err){return stream.renderErr();}
    })
  }
})
.on('/blog', function(request, stream) {
  if(utils.isAuth(router)){
    stream.render('blog', request.data, function(err){
      if(err){return stream.renderErr();}
    })
  }
})
.on('/blog/category', function(request, stream) {
  if(utils.isAuth(router)){
    stream.render('blog_category', request.data, function(err){
      if(err){return stream.renderErr();}
    })
  }
})
.on('/about', function(request, stream) {
  stream.render('about', request.data, function(err){
    if(err){return stream.renderErr();}
  })
})
.on('/contact', function(request, stream) {
  stream.render('contact', request.data, function(err){
    if(err){return stream.renderErr();}
  })
})
.on('/terms', function(request, stream) {
  stream.render('terms', request.data, function(err){
    if(err){return stream.renderErr();}
  })
})
.on('/error', function(request, stream) {
  stream.render('error', request.data, function(err){
    if(err){return console.error(err)}
  })
})
.init().listen().validate();
