const STATIC_CACHE = 'appShell-v6';
const DYNAMIC_CACHE = 'dynamic';

self.addEventListener('install', (event) => {
    console.log("Installing...");
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(function(cache){
                console.log('[Service Worker] Precaching App Shell');
                cache.addAll([
                    '/',
                    '/src/js/main.js',
                    '/src/js/material.min.js',
                    '/src/css/app.css',
                    '/src/css/main.css'
                ]);
            })
    );
});

self.addEventListener('activate', (event) => {
    console.log("Activating...");
    event.waitUntil(
        Promise.all[
            caches.keys()
                .then(function(keyList){
                    keyList.map(function(key){
                        if(key !== STATIC_CACHE && key !== DYNAMIC_CACHE){
                            caches.delete(key);
                        }
                    })
                })]
    );
});

self.addEventListener('fetch', (event) => {
    console.log("Inside fetch...");
    return event.respondWith(
        caches.match(event.request)
            .then(function(res) {
                if(res) {
                    return res;
                } else {
                    return fetch(event.request)
                            .then(function(resp){
                                return caches.open(DYNAMIC_CACHE)
                                    .then(function(cacheRef){
                                        return cacheRef.put(event.request.url, resp);
                                    });
                            });
                }
            })
    );
});