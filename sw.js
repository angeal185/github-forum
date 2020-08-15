let ORIGIN =
'https://angeal185.github.io/github-forum',
//'http://localhost:8000',
DEV_MODE = true,
CACHE_VERSION = 1,
CURRENT_CACHES = {
  static: 'static-cache-v1'
},
STATIC_FILES = [
  '/',
  '/app/manifest.webmanifest',
  '/app/defaults.mjs',
  '/app/main.mjs',
  '/app/data/xdata.mjs',
  '/app/data/jsonld.mjs',
  '/app/data/routes.mjs',
  '/app/views/xviews.mjs',
  '/app/views/routes.mjs',
  '/app/views/tpl.mjs',
  '/app/modules/jsnode.mjs',
  '/app/modules/router.mjs',
  '/app/modules/stream.mjs',
  '/app/modules/utils.mjs',
  '/app/modules/xidb.mjs',
  '/app/modules/xscript.mjs',
  '/app/modules/xutils.mjs',
  '/app/css/bootstrap.min.css',
  '/app/css/main.min.css',
  '/app/fonts/roboto-regular.woff2',
  '/app/fonts/roboto-bold.woff2',
  '/app/fonts/roboto-light.woff2',
  '/app/fonts/roboto-medium.woff2',
  '/app/fonts/ico.woff2'
],
CONTENT_TYPES = [
  'application/javascript',
  'text/css',
  'text/html',
  'font/woff2'
];


for (let i = 0; i < STATIC_FILES.length; i++) {
  STATIC_FILES[i] = ORIGIN + STATIC_FILES[i]
}

if(!DEV_MODE){
  self.addEventListener('install', function(event){
    event.waitUntil(
      caches.open(CURRENT_CACHES.static).then(function(cache){
        return cache.addAll(STATIC_FILES);
      })
    );
  });


  self.addEventListener('activate', function(event) {

    const expected = new Set(Object.values(CURRENT_CACHES));
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (!expected.has(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });



  self.addEventListener('fetch', function(event) {

    event.respondWith(
      caches.open(CURRENT_CACHES.static).then(function(cache) {
        return cache.match(event.request).then(function(response) {
          if(response){return response;}
          return fetch(event.request.clone()).then(function(response) {
            if (
              response.status < 400 &&
              response.headers.has('content-type') &&
              CONTENT_TYPES.indexOf(response.headers.get('content-type')) !== -1
            ) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        }).catch(function(error) {
          console.error('  Error in fetch handler:', error);
        });
      })
    );
  });

}
