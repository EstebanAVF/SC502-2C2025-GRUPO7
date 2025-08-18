// Este código se ejecuta cuando todo el contenido de la página ha cargado
document.addEventListener('DOMContentLoaded', () => {

    // Llamamos a las funciones para cargar los datos iniciales
    fetchAndDisplayReports(); // La que ya teníamos
    populateIncidentTypes();  // La nueva que acabamos de agregar

});


/**
 * Función mejorada para obtener los reportes del servidor y mostrarlos en la página.
 */
async function fetchAndDisplayReports() {
    const BASE_URL = 'http://localhost/SC502-2C2025-GRUPO7/'; 
    const reportsContainer = document.getElementById('contenedor-reportes');

    // Mostrar mensaje de carga
    reportsContainer.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Cargando...</span></div><p>Cargando reportes...</p></div>';

    try {
        const response = await fetch(BASE_URL + 'get_reports.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status} - ${response.statusText}`);
        }

        const responseText = await response.text();
        console.log('Response text:', responseText);

        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            throw new Error('Respuesta del servidor no es JSON válido');
        }

        // Verificar si la respuesta tiene la estructura esperada
        let reports;
        if (result.success !== undefined) {
            // Nueva estructura con success
            if (!result.success) {
                throw new Error(result.message || 'Error desconocido del servidor');
            }
            reports = result.data || [];
        } else {
            // Estructura antigua - array directo
            reports = Array.isArray(result) ? result : [];
        }
        
        // Limpiar contenedor
        reportsContainer.innerHTML = ''; 

        if (reports.length === 0) {
            reportsContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info text-center">
                        <i class="fas fa-info-circle me-2"></i>
                        No hay reportes para mostrar en este momento.
                    </div>
                </div>
            `;
            return;
        }

        console.log(`Mostrando ${reports.length} reportes`);

        // Crear las tarjetas de reportes
        reports.forEach((report, index) => {
            const reportCardHTML = createReportCard(report);
            reportsContainer.insertAdjacentHTML('beforeend', reportCardHTML);
        });

    } catch (error) {
        console.error('Error detallado al cargar los reportes:', error);
        reportsContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    <h5><i class="fas fa-exclamation-triangle me-2"></i>Error al cargar reportes</h5>
                    <p><strong>Detalle del error:</strong> ${error.message}</p>
                    <small>Revisa la consola del navegador para más información.</small>
                </div>
            </div>
        `;
    }
}

/**
 * Función para crear la tarjeta HTML de un reporte
 */
function createReportCard(report) {
    // Valores por defecto para evitar errores
    const tipoIncidente = report.tipo_incidente_nombre || 'Tipo desconocido';
    const iconoClase = report.icono_clase_css || 'fas fa-exclamation-triangle';
    const descripcion = report.descripcion || 'Sin descripción';
    const usuarioNombre = report.usuario_nombre || 'Usuario';
    const usuarioApellido = report.usuario_apellido || 'Anónimo';
    const distrito = report.distrito || 'No especificado';
    const canton = report.canton || 'No especificado';
    const fechaCreacion = report.created_at || report.fecha_formateada || new Date().toISOString();
    
    // Información adicional
    const votosPositivos = report.votos_positivos || 0;
    const votosNegativos = report.votos_negativos || 0;
    const balanceVotos = report.balance_votos || 0;
    const popularidad = report.popularidad || 0;
    const estadoReporte = report.estado_reporte || 'normal';
    const totalInformes = report.total_informes || 0;

    // Clases CSS según el estado
    let estadoClass = 'border-secondary';
    let estadoBadge = '';
    
    switch(estadoReporte) {
        case 'confiable':
            estadoClass = 'border-success';
            estadoBadge = '<span class="badge bg-success ms-2">Confiable</span>';
            break;
        case 'dudoso':
            estadoClass = 'border-warning';
            estadoBadge = '<span class="badge bg-warning ms-2">Dudoso</span>';
            break;
        case 'bajo_revision':
            estadoClass = 'border-info';
            estadoBadge = '<span class="badge bg-info ms-2">En revisión</span>';
            break;
    }

    return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 ${estadoClass}">
                <div class="card-header d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                        <i class="${iconoClase} me-2"></i>
                        <h5 class="card-title mb-0">${tipoIncidente}</h5>
                    </div>
                    ${estadoBadge}
                </div>
                <div class="card-body">
                    <p class="card-text">${descripcion}</p>
                    
                    <!-- Información de votos -->
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <small class="text-muted">
                            <i class="fas fa-thumbs-up text-success"></i> ${votosPositivos}
                            <i class="fas fa-thumbs-down text-danger ms-2"></i> ${votosNegativos}
                        </small>
                        <small class="text-muted">
                            Balance: <strong class="${balanceVotos >= 0 ? 'text-success' : 'text-danger'}">${balanceVotos}</strong>
                        </small>
                    </div>
                    
                    ${totalInformes > 0 ? `<small class="text-warning"><i class="fas fa-flag"></i> ${totalInformes} informe(s)</small>` : ''}
                </div>
                <div class="card-footer text-muted">
                    <small>Reportado por: <strong>${usuarioNombre} ${usuarioApellido}</strong></small><br>
                    <small>Ubicación: ${distrito}, ${canton}</small><br>
                    <small>Fecha: ${new Date(fechaCreacion).toLocaleDateString()}</small>
                </div>
            </div>
        </div>
    `;
}

/**
 * Función para obtener los tipos de incidente y rellenar el menú desplegable del formulario.
 */
async function populateIncidentTypes() {
    const BASE_URL = 'http://localhost/SC502-2C2025-GRUPO7/'; 
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