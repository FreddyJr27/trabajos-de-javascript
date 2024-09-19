
class Llamada {
    constructor() {
        this.usedIds = new Set();
        this.maxIds = 20; // Número máximo de IDs posibles
        this.intervalId = null;
        this.listadata = []
        this.chartInstance = null;
    }
    getRandomId() {
        const generateId = () => {
            const numero_r = Math.floor(Math.random() * this.maxIds) + 1;
            return this.usedIds.has(numero_r) ? generateId() : numero_r;
        };

        return this.usedIds.size >= this.maxIds
            ? (console.log('Todos los IDs están en uso.'), null)
            : (() => {
                const numero_r = generateId();
                this.usedIds.add(numero_r);
                return numero_r;
            })();
    }

    ruta() {
        const numero_r = this.getRandomId();
        return numero_r === null
            ? (console.log('No se pueden generar más IDs. Todos los IDs están en uso.'), clearInterval(this.intervalId), undefined)
            : fetch('https://freetestapi.com/api/v1/movies/' + numero_r)
                .then(response => response.json())
                .then(data => {
                    this.listadata.push(data);
                    this.agregarFila(data);
                    this.filtropremios(this.listadata);
                    console.log(this.listadata);
                    return { data, listadata: this.listadata }; // Devolver los datos
                })
                .catch(error => {
                    console.error('Error:', error);
                    return null; // Devolver null en caso de error
                });
    }

    filtropremios(listadata) {
        let totalnominacion = 0;
        let totalpremios = 0;

        listadata.forEach(movie => {
            const awards = movie.awards;
            if (awards.includes('Nominated')) {
                let nominationsMatch = awards.match(/Nominated for (\d+)/);
                if (nominationsMatch) {
                    totalnominacion += parseInt(nominationsMatch[1]);
                }
            }
            if (awards.includes('Won')) {
                let winsMatch = awards.match(/Won (\d+)/);
                if (winsMatch) {
                    totalpremios += parseInt(winsMatch[1]);
                }
            }
        });
       
        if (this.chartInstance) {
            this.chartInstance.data.datasets[0].data = [totalnominacion, totalpremios];
            this.chartInstance.update();
        } else {
            const gra = document.getElementById('grafico').getContext('2d');
            this.chartInstance = new Chart(gra, {
                type: 'bar',
                data: {
                    labels: ['Nominaciones', 'Premios'],
                    datasets: [{
                        label: 'Premios y Nominaciones',
                        data: [totalnominacion, totalpremios],
                        borderWidth: 1,
                        backgroundColor: ['rgba(126, 0, 183, 0.5)', 'rgba(169, 0, 169, 0.5)'],
                        borderColor: ['rgba(74, 0, 187, 1)', 'rgba(187, 0, 187, 1)'],
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

        }
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
        ojoIcon.style.color = '#87CEEB';
        const xIcon = document.createElement('i');
        xIcon.className = 'fa-solid fa-trash';
        xIcon.style.cursor = 'pointer'; // Cambia el cursor para indicar que es clickeable
        xIcon.style.color = 'red';
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

            tabla.removeChild(nuevaFila);
            this.usedIds.size < this.maxIds ? retomarLlamadas() : null;

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
        document.getElementById('infoPoster').src = data.poster;
        document.getElementById('infoPoster').style.display = 'flex';
        document.getElementById('infoPoster').style.justifyContent = 'center';
        document.getElementById('infoPoster').style.alignItems = 'center';

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

        filaEncontrada
            ? (filaEncontrada.classList.add('fila-seleccionada'), filaEncontrada.scrollIntoView({ behavior: 'smooth', block: 'center' }))
            : alert('No se encontró ninguna película con ese título.');
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
    tituloBuscado ? miLlamada.buscarPelicula(tituloBuscado) : alert('Por favor, ingresa un título para buscar.');
});

function llamarCada5Segundos() {
    miLlamada.ruta();
}

function retomarLlamadas() {
    miLlamada.intervalId = setInterval(llamarCada5Segundos, 5000);
}
retomarLlamadas();
