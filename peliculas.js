class Llamada {
    constructor() {
        this.usedIds = new Set();
        this.maxIds = 20; // Número máximo de IDs posibles
    }

    getRandomId() {
        if (this.usedIds.size >= this.maxIds) {
            console.log('Todos los IDs están en uso.');
            return null; // No se puede obtener un nuevo ID si todos están en uso
        }

        let numero_r;

        // Generar un número aleatorio que no esté en usedIds
        do {
            numero_r = Math.floor(Math.random() * this.maxIds) + 1;
        } while (this.usedIds.has(numero_r));

        this.usedIds.add(numero_r);
        return numero_r;
    }

    ruta() {
        const numero_r = this.getRandomId();
        if (numero_r === null) {
            console.log('No se pueden generar más IDs. Todos los IDs están en uso.');
            return; // Salir si no se puede obtener un nuevo ID
        }

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
    
        // Insertar contenido en las celdas
        celdaId.textContent = data.id;
        celdaTitulo.textContent = data.title;
        celdaPremio.textContent = data.awards;

        // Añadir la nueva columna para las imágenes
        const celdaImagenes = nuevaFila.insertCell(3);

        // Crear las imágenes
        const Ojo = document.createElement('img');
        Ojo.src = '/ojo.png'; // Reemplaza con la ruta a tu imagen de ojo verde
        Ojo.alt = 'Ojo';
        Ojo.style.cursor = 'pointer'; // Cambia el cursor para indicar que es clickeable
        Ojo.style.width = '20px'; // Ajusta el tamaño de la imagen del ojo verde
        Ojo.style.height = '20px'; // Ajusta el tamaño de la imagen del ojo verde

        const X = document.createElement('img');
        X.src = '/xroja.png'; // Reemplaza con la ruta a tu imagen de X roja
        X.alt = 'X';
        X.style.cursor = 'pointer'; // Cambia el cursor para indicar que es clickeable
        X.style.width = '25px'; // Ajusta el tamaño de la imagen de la X roja
        X.style.height = '15px'; // Ajusta el tamaño de la imagen de la X roja

        // Añadir las imágenes a la celda
        celdaImagenes.appendChild(Ojo);
        celdaImagenes.appendChild(X);
        
        Ojo.addEventListener('click', () => {
            // Mostrar la ventana emergente con la información de la película
            this.mostrarInformacion(data);
        });
    
        X.addEventListener('click', () => {
            // Acciones a realizar cuando se hace clic en la imagen de la X roja
            console.log('Imagen de X roja clickeada');
            // Obtener el id de la fila y eliminar el id de usedIds
            const idFila = parseInt(celdaId.textContent, 10);
            this.usedIds.delete(idFila);
            // Eliminar la fila
            tabla.removeChild(nuevaFila);
        });

        // Ordenar la tabla después de añadir la fila
        this.ordenarTabla();
    }

    mostrarInformacion(data) {
        const infoVentana = document.getElementById('infoVentana');
        document.getElementById('infoTitulo').textContent = data.title;
        document.getElementById('infoAnio').textContent = data.year;
        document.getElementById('infoGenero').textContent = data.genre.join(', ');
        document.getElementById('infoRating').textContent = data.rating;
        document.getElementById('infoDirector').textContent = data.director;
        document.getElementById('infoActores').textContent = data.actors.join(', ');
        document.getElementById('infoSinopsis').textContent = data.plot;
        document.getElementById('infoDuracion').textContent = data.runtime + ' minutos';
        document.getElementById('infoPremios').textContent = data.awards;
        document.getElementById('infoPais').textContent = data.country;
        document.getElementById('infoIdioma').textContent = data.language;
        document.getElementById('infoTaquilla').textContent = data.boxOffice;
        document.getElementById('infoProduccion').textContent = data.production;
        document.getElementById('infoWebsite').href = data.website;
        document.getElementById('infoWebsite').textContent = data.website;
        document.getElementById('infoPoster').src = data.poster;
        document.getElementById('infoTrailer').href = data.trailer;

        infoVentana.style.display = 'block'; // Mostrar la ventana emergente
    }

    cerrarInformacion() {
        const infoVentana = document.getElementById('infoVentana');
        infoVentana.style.display = 'none'; // Ocultar la ventana emergente
    }

    ordenarTabla() {
        const tabla = document.getElementById('tablaPeliculas').getElementsByTagName('tbody')[0];
        // Convertir las filas en un array
        const filas = Array.from(tabla.rows);

        // Ordenar filas basadas en el texto de la segunda celda
        const filasOrdenadas = filas.sort((a, b) => {
            const nombreA = a.cells[1].textContent.toLowerCase();
            const nombreB = b.cells[1].textContent.toLowerCase();
            return nombreA.localeCompare(nombreB);
        });

        // Actualizar la tabla con las filas ordenadas
        tabla.innerHTML = '';
        filasOrdenadas.forEach(fila => tabla.appendChild(fila));
    }
}

const miLlamada = new Llamada();

// Manejador para cerrar la ventana emergente
document.querySelector('#infoVentana .cerrar').addEventListener('click', () => {
    miLlamada.cerrarInformacion();
});

function llamarCada5Segundos() {
    miLlamada.ruta();
}

setInterval(llamarCada5Segundos, 5000);

