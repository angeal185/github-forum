const CACHE_VERSION = 1,
CURRENT_CACHES = {
  static: 'static-cache-v1'
},
STATIC_FILES = [
  '/',
  '/manifest.webmanifest',
  '/app/defaults.mjs',
  '/app/main.mjs',
  '/app/data/xdata.mjs',
  '/app/views/xviews.mjs',
  '/app/modules/jsnode.mjs',
  '/app/modules/router.mjs',
  '/app/modules/stream.mjs',
  '/app/modules/xscript.mjs',
  '/app/modules/xutils.mjs',
  '/app/css/bootstrap.min.css',
  '/app/css/main.min.css'
],
CONTENT_TYPES = [
  'application/javascript',
  'text/css',
  'text/html'
],
DEV_MODE = true

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
          if (response) {
            return response;
          }

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
