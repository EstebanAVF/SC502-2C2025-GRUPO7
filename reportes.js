// Este código se ejecuta cuando todo el contenido de la página ha cargado
document.addEventListener('DOMContentLoaded', () => {

    // Llamamos a las funciones para cargar los datos iniciales
    fetchAndDisplayReports(); // La que ya teníamos
    populateIncidentTypes();  // La nueva que acabamos de agregar

});

/**
 * Función para obtener los reportes del servidor y mostrarlos en la página.
 */
async function fetchAndDisplayReports() {
    // Reemplaza con tu URL base si es diferente
    const BASE_URL = 'http://localhost/Proyecto/'; 
    const reportsContainer = document.getElementById('contenedor-reportes');

    // Mostramos un mensaje de carga mientras se obtienen los datos.
    reportsContainer.innerHTML = '<p>Cargando reportes...</p>';

    try {
        const response = await fetch(BASE_URL + 'get_reports.php');

        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const reports = await response.json();
        
        // Limpiamos el contenedor antes de añadir los nuevos datos.
        reportsContainer.innerHTML = ''; 

        if (reports.length === 0) {
            reportsContainer.innerHTML = '<p>No hay reportes para mostrar en este momento.</p>';
            return;
        }

        // Iteramos sobre cada reporte y creamos su tarjeta HTML
        reports.forEach(report => {
            const reportCardHTML = `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100">
                        <div class="card-header d-flex align-items-center">
                            <i class="${report.icono_clase_css} me-2"></i> <h5 class="card-title mb-0">${report.tipo_incidente_nombre}</h5>
                        </div>
                        <div class="card-body">
                            <p class="card-text">${report.descripcion}</p>
                        </div>
                        <div class="card-footer text-muted">
                            <small>Reportado por: <strong>${report.usuario_nombre} ${report.usuario_apellido}</strong></small><br>
                            <small>Ubicación: ${report.distrito}, ${report.canton}</small><br>
                            <small>Fecha: ${new Date(report.created_at).toLocaleDateString()}</small>
                        </div>
                    </div>
                </div>
            `;
            // Añadimos la tarjeta al contenedor
            reportsContainer.insertAdjacentHTML('beforeend', reportCardHTML);
        });

    } catch (error) {
        console.error('Error al cargar los reportes:', error);
        reportsContainer.innerHTML = '<p class="text-danger">No se pudieron cargar los reportes. Inténtalo de nuevo más tarde.</p>';
    }
}

/**
 * Función para obtener los tipos de incidente y rellenar el menú desplegable del formulario.
 */
async function populateIncidentTypes() {
    const BASE_URL = 'http://localhost/Proyecto/'; 
    const selectElement = document.getElementById('incident_type');

    try {
        const response = await fetch(BASE_URL + 'get_incident_types.php');
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const incidentTypes = await response.json();

        // Limpiar opciones existentes (excepto la primera que dice "Selecciona...")
        selectElement.innerHTML = '<option value="">Selecciona el tipo...</option>';

        incidentTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.id; // El valor será el ID del tipo de incidente
            option.textContent = type.nombre; // El texto visible será el nombre
            selectElement.appendChild(option);
        });

    } catch (error) {
        console.error('Error al cargar los tipos de incidente:', error);
        // Dejar el select con las opciones por defecto si falla
    }
}