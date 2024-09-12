class llamada {
    ruta() {
        return fetch('https://freetestapi.com/api/v1/movies')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                return data; // Devolver los datos
            })
            .catch(error => {
                console.error('Error:', error);
                return null; // Devolver null en caso de error
            });
    }

    sacarDatos(data) {
        // Verificar si hay datos antes de iterar
        if (data && data.length > 0) {
            let i = 0;
            const interval = setInterval(() => {
                if (i < data.length) {
                    console.log(data[i]); // Operación con cada diccionario
                    i++;
                } else {
                    clearInterval(interval); // Detener el intervalo cuando se hayan mostrado todos los datos
                }
            }, 5000); // Intervalo de 5 segundos
        } else {
            console.log('No hay datos para mostrar');
        }
    }
}

const miLlamada = new llamada();
miLlamada.ruta().then(data => {
    
    miLlamada.sacarDatos(data);
// Llamar a sacarDatos con los datos obtenidos
}); 