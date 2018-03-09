if ( 'serviceWorker' in navigator ) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log(registration)
                console.log(
                    'Service Worker registrado con exito',
                    registration.scope
                )
            })
            .catch(err => console.log('Registro de service Worker fallido', err))
    })
}

if ( window.Notification && Notification.permission !== 'denied' ) {
    Notification.requestPermission(status => {
        console.log(status)

        let n = new Notification('Titulo', {
            body: 'Soy una notificacion',
            icon: '/img/icon_192x192.png'
        })

        n.onclick = () => {
          // alert('hola prro')
          window.open('https://controlmas.mx')
        };
    })
}
