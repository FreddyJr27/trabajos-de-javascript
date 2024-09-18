class Llamada {
    constructor() {
        this.usedIds = new Set();
        this.maxIds = 20; // Número máximo de IDs posibles
        this.intervalId = null; // Guardar el ID del intervalo
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
            clearInterval(this.intervalId); // Detener el intervalo
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

        const celdaIconos = nuevaFila.insertCell(3);

        // Crear los íconos de Font Awesome
        const ojoIcon = document.createElement('i');
        ojoIcon.className = 'fa-solid fa-eye';
        ojoIcon.style.cursor = 'pointer'; // Cambia el cursor para indicar que es clickeable
        ojoIcon.style.marginRight = '10px'; // Añadir margen a la derecha para separar los iconos

        const xIcon = document.createElement('i');
        xIcon.className = 'fa-solid fa-trash';
        xIcon.style.cursor = 'pointer'; // Cambia el cursor para indicar que es clickeable

        // Añadir los íconos a la celda
        celdaIconos.appendChild(ojoIcon);
        celdaIconos.appendChild(xIcon);

        ojoIcon.addEventListener('click', () => {
            console.log('Ícono de ojo clickeado');
            // Mostrar la ventana emergente con la información de la película
            this.mostrarInformacion(data);
        });

        xIcon.addEventListener('click', () => {
            // Acciones a realizar cuando se hace clic en el ícono de la X roja
            console.log('Ícono de X roja clickeado');
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
        console.log(data);
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

        // Verificar si el póster está disponible
        if (data.poster) {
            document.getElementById('infoPoster').src = data.poster;
            document.getElementById('infoPoster').style.display = 'block'; // Mostrar la imagen si está disponible
        } else {
            document.getElementById('infoPoster').style.display = 'none'; // Ocultar la imagen si no está disponible
        }

        document.getElementById('infoTrailer').href = data.trailer;

        infoVentana.style.display = 'block'; // Mostrar la ventana emergente
    }
    cerrarInformacion() {
        const infoVentana = document.getElementById('infoVentana');
        infoVentana.style.display = 'none'; // Ocultar la ventana emergente
    }

    buscarPelicula(titulo) {
        const tabla = document.getElementById('tablaPeliculas').getElementsByTagName('tbody')[0];
        const filas = Array.from(tabla.rows);

        // Eliminar el resaltado de la fila anterior si existe
        filas.forEach(fila => fila.classList.remove('fila-seleccionada'));

        const filaEncontrada = filas.find(fila => fila.cells[1].textContent.toLowerCase() === titulo.toLowerCase());

        if (filaEncontrada) {
            filaEncontrada.classList.add('fila-seleccionada');
            filaEncontrada.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            alert('No se encontró ninguna película con ese título.');
        }
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

document.getElementById('buscarBtn').addEventListener('click', () => {
    const tituloBuscado = document.getElementById('buscador').value.trim();
    if (tituloBuscado) {
        miLlamada.buscarPelicula(tituloBuscado);
    } else {
        alert('Por favor, ingresa un título para buscar.');
    }
});

function llamarCada5Segundos() {
    miLlamada.ruta();
}

// Guardar el ID del intervalo para poder detenerlo más tarde
miLlamada.intervalId = setInterval(llamarCada5Segundos, 5000);