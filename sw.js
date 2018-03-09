const CACHE_NAME = 'pwa-demo-edteam-cache-v1'
let baseUrl = 'https://rodr7go.github.io/progressive-web/';
urlsToCache = [
    'https://controlmas.mx',
    '/',
    './',
    './?utm=homescreen',
    './index.html',
    './index.html/?utm=homescreen',
    './style.css',
    './script.js',
    './sw.js',
    './favicon.ico',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
]
self.addEventListener('install', e =>  {
    console.log('Evento: SW Instalado')
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Archivos en cache')
                return cache.addAll(urlsToCache)
            })
            .catch(err => console.log('Fallo registro de cache', err))
    )
})

self.addEventListener('activate', e => {
  console.log('Evento: SW Activado')
  const cacheWhitelist = [CACHE_NAME]

  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          //Eliminamos lo que ya no se necesita en cache
          if ( cacheWhitelist.indexOf(cacheName) === -1 )
            return caches.delete(cacheName)
        })
      )
    })
    .then(() => {
      console.log('Cache actualizado')
      // Le indica al SW activar el cache actual
      return self.clients.claim()
    })
  )
})

self.addEventListener('fetch', e => {
    console.log('Evento: SW Recuperando')
    e.respondWith(
        caches.match(e.request)
            .then(res => {
                if ( res ) {
                    return res
                }
                let request
                return fetch(request)
                    .then(res => {
                        let resToCache = res.clone()
                        let cacheName
                        caches.open(cacheName)
                            .then(cache => {
                                cache
                                    .put(request, resToCache)
                                    .catch(err => console.log(`${request.url}, ${err.message}`))
                            })

                        return res
                    })
            })
    )
})
