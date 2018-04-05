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

        setTimeout(function () {
            Notification.requestPermission(status => {
                c(status, 'status')
                let n = new Notification('Titulo', {
                    body: 'Soy una notificacion',
                    icon: '/img/icon_192x192.png'
                })
                .onclick = () => {
                  // alert('hola prro')
                  w.open('https://controlmas.mx')
                };
            })
        }, 3000)
    }

    // Activar sincronizacion de fondo - segundo plano
    if ('serviceWorker' in n && 'SyncManager' in w) {
        function registerBGSync () {
            n.serviceWorker.ready
                .then(registration => {
                    return registration.sync.register('github')
                    .then(() => c('sincronizacion de fondo registrada'))
                    .catch((err) => c('fallo la sincronizacion de fondo', err))
                })
        }
        registerBGSync()
    }

    //Compartiendo contenido con el API Share
    if (n.share !== undefined) {
        d.addEventListener('DOMContentLoaded', e => {
            let shareBtn = d.getElementById('share')

            shareBtn.addEventListener('click', e => {
                n.share({
                    title: d.title,
                    text: 'Hola soy un contenido para compartir',
                    url: w.location.href
                })
                    .then(() => c('Contenido compartido con exito'))
                    .catch(err => c('Error al compartir',err))
            })
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

// Aplicacion demo interactuando con el API de Github y la sincronizacion
((d, w, n, c) => {
    const userInfo = d.querySelector('.GitHubUser'),
    searchForm = d.querySelector('.GitHubUserForm')

    function fetchGitHubUser (username, requestFromBGSync) {
        let name = username || 'escueladigital',
            url = `https://api.github.com/users/${name}`
        fetch(url, {method: 'GET'})
            .then(response => response.json())
            .then(userData => {
                if (!requestFromBGSync) {
                    localStorage.removeItem('github')
                }

                let template = `
                    <article class="GitHubUser-info">
                        <h2>${userData.name}</h2>
                        <img src="${userData.avatar_url}" alt="${userData.login}">
                        <p>${userData.bio}</p>
                        <ul>
                            <li>User GitHub ${userData.login}</li>
                            <li>Url GitHub ${userData.html_url}</li>
                            <li>Seguidores ${userData.followers}</li>
                            <li>Siguiendo ${userData.following}</li>
                            <li>Ubicacion ${userData.location}</li>
                        </ul>
                    </article>
                `
                userInfo.innerHTML = template
            })
            .catch(err => {
                localStorage.setItem('github', name)
                c(err)
            })
    }
    fetchGitHubUser(localStorage.getItem('github'))

    searchForm.addEventListener('submit', e => {
        e.preventDefault()

        let user = d.getElementById('search').value

        if (user === '') return;

        localStorage.setItem('github', user)

        fetchGitHubUser(user)

        e.target.reset()
    })

    n.serviceWorker.addEventListener('message', e => {
        console.log('Desde la sincronizacion de fondo', e.data)
        fetchGitHubUser(localStorage.getItem('github'), true)
    })

})(document, window, navigator, console.log);
