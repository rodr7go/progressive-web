;
// Registro de caracteristicas de PWA's
((d, w, n, c) => {

    // Registro de SW
    if ( 'serviceWorker' in n ) {
        w.addEventListener('load', () => {
            n.serviceWorker.register('./sw.js')
                .then(registration => {
                    c(registration)
                    c(
                        'Service Worker registrado con exito',
                        registration.scope
                    )
                })
                .catch(err => c('Registro de service Worker fallido', err))
        })
    }

    // Activar Notificaciones
    if ( w.Notification && Notification.permission !== 'denied' ) {
        Notification.requestPermission(status => {
            c(status)
            let n = new Notification('Titulo', {
                body: 'Soy una notificacion',
                icon: '/img/icon_192x192.png'
            })
            .onclick = () => {
              // alert('hola prro')
              w.open('https://controlmas.mx')
            };
        })
    }

})(document, window, navigator, console.log);

// Deteccion del estado de la conexion
((d, w, n, c) => {
    const header = d.querySelector('.Header'),
        metaTagTheme = d.querySelector('meta[name=theme-color]')

    function networkStatus (e) {
        c(e, e.type)

        if (n.onLine) {
            metaTagTheme.setAttribute('content', '#F7DF1E')
            header.classList.remove('u-offline')
            alert('conexion recuperada :)')
        } else {
            metaTagTheme.setAttribute('content', '#666666')
            header.classList.add('u-offline')
            alert('conexion perdida :(')
        }
    }

    if (!n.onLine) {
        networkStatus(this)
    }
    d.addEventListener('DOMContentLoaded', e => {
        w.addEventListener('online', networkStatus)
        w.addEventListener('offline', networkStatus)
    })
})(document, window, navigator, console.log);

((d, w, n, c) => {

})(document, window, navigator, console.log);

((d, w, n, c) => {

})(document, window, navigator, console.log);
