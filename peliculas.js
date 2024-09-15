class Llamada {
    constructor() {
        this.usedIds = new Set();
    }

    getRandomId() {
        let numero_r;
        do {
            numero_r = Math.floor(Math.random() * 20) + 1;
        } while (this.usedIds.has(numero_r));
        this.usedIds.add(numero_r);
        return numero_r;
    }

    ruta() {
        const numero_r = this.getRandomId();
        return fetch('https://freetestapi.com/api/v1/movies/' + numero_r)
            .then(response => response.json())
            .then(data => {
                this.agregarFila(data);
                return data; // Devolver los datos
            })
            .catch(error => {
                console.error('Error:', error);
                return null; // Devolver null en caso de error
            });
    }

    agregarFila(data) {
        const tabla = document.getElementById('tablaPeliculas').getElementsByTagName('tbody')[0];
        const nuevaFila = tabla.insertRow();

        const celdaId = nuevaFila.insertCell(0);
        const celdaTitulo = nuevaFila.insertCell(1);
        const celdaPremio = nuevaFila.insertCell(2);


        celdaId.textContent = data.id;
        celdaTitulo.textContent = data.title;
        celdaPremio.textContent = data.awards;

    }
}

const miLlamada = new Llamada();

function llamarCada5Segundos() {
    miLlamada.ruta();
    setTimeout(llamarCada5Segundos, 5000);
}

llamarCada5Segundos();