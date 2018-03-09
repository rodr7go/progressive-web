// ((c) => {
//     const cuadrado = (value, callback) => {
//         setTimeout(() => {
//             callback(value, value*value)
//         }, Math.random * 100)
//     }
//
//     cuadrado(2, (value, result) => {
//         c('Inicio de callback')
//         c(`callback: ${value}, ${result}`)
//         cuadrado(4, (value, result) => {
//             c(`Callback: ${value}, ${result}`)
//             cuadrado(6, (value, result) => {
//                 c(`Callback: ${value}, ${result}`)
//                 c('Fin de callback')
//             })
//         })
//     })
// })(console.log)

((c) => {
    const cuadrado = value => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    value: value,
                    result: value*value
                })
            }, Math.random * 100)
        })

    }

    cuadrado(2)
        .then(obj => {
            c('Inicio de Promise')
            c(`Promise: ${obj.value}, ${obj.result}`)
            return cuadrado(4)
        })
        .then(obj => {
            c(`Promise: ${obj.value}, ${obj.result}`)
            return cuadrado(6)
        })
        .then(obj => {
            c('Fin de Promise')
            c(`Promise: ${obj.value}, ${obj.result}`)
        })
        .catch(err => C(err))
})(console.log)
