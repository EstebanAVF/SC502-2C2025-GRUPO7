// Este código se ejecuta cuando todo el contenido de la página ha cargado
document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayReports();
    // La siguiente función la dejamos por si la necesitas en el futuro, no afecta en nada.
    // populateIncidentTypes(); 
});

/**
 * Función para obtener los reportes del servidor y mostrarlos en la página.
 */
async function fetchAndDisplayReports() {
    // Usamos el contenedor "feedReportes" de tu Index.html
    const reportsContainer = document.getElementById('feedReportes');
    if (!reportsContainer) {
        console.error("El contenedor #feedReportes no se encontró en el DOM.");
        return;
    }
    
    const BASE_URL = 'http://localhost/Proyecto/'; // Asegúrate que esta sea tu URL base
    reportsContainer.innerHTML = '<p>Cargando reportes...</p>';

    try {
        const response = await fetch(BASE_URL + 'get_reports.php');
        if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
        
        const reports = await response.json();
        reportsContainer.innerHTML = ''; 

        if (reports.length === 0) {
            reportsContainer.innerHTML = '<p>No hay reportes para mostrar.</p>';
            return;
        }

        reports.forEach(report => {
            // Helper para asignar colores de Bootstrap según la prioridad del reporte
            const prioridadColors = {
                'Urgente': 'danger',
                'Precaucion': 'warning',
                'Informacion': 'info'
            };
            const prioridadColorClass = prioridadColors[report.prioridad] || 'secondary';

            // --> NUEVA ESTRUCTURA HTML BASADA EN BOOTSTRAP 5
            const reportCardHTML = `
                <div class="card mb-3" style="background-color: #1e293b;">
                    <div class="card-body text-white">
                        <div class="d-flex align-items-center mb-2">
                            <i class="fas fa-user-circle fa-2x me-3" style="color: #94a3b8;"></i>
                            <div>
                                <h6 class="mb-0 fw-bold">${report.usuario_nombre} ${report.usuario_apellido}</h6>
                                <small style="color: #94a3b8;">
                                    ${new Date(report.created_at).toLocaleString('es-CR')} &middot; ${report.canton}, ${report.provincia}
                                </small>
                            </div>
                        </div>

                        <p class="card-text my-3">${report.descripcion}</p>

                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <span class="badge bg-${prioridadColorClass}">${report.prioridad}</span>
                                <span class="badge text-bg-secondary">${report.tipo_incidente_nombre}</span>
                            </div>
                            
                            <button class="btn btn-sm btn-outline-light like-button" data-report-id="${report.id}">
                                <i class="fas fa-thumbs-up me-1"></i>
                                <span class="like-count">${report.total_likes}</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            reportsContainer.insertAdjacentHTML('beforeend', reportCardHTML);
        });

        addLikeButtonListeners();

    } catch (error) {
        console.error('Error al cargar los reportes:', error);
        reportsContainer.innerHTML = '<p class="text-danger">No se pudieron cargar los reportes.</p>';
    }
}

/**
 * Añade los event listeners a todos los botones de "like". (Sin cambios)
 */
function addLikeButtonListeners() {
    const likeButtons = document.querySelectorAll('.like-button');
    likeButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            // Evitar que el evento se propague a otros elementos
            event.stopPropagation(); 
            
            const reportId = button.dataset.reportId;
            button.disabled = true;

            try {
                const response = await voteForReport(reportId);
                if (response.success) {
                    const countSpan = button.querySelector('.like-count');
                    const currentLikes = parseInt(countSpan.textContent, 10);
                    countSpan.textContent = currentLikes + 1;
                    
                    button.classList.remove('btn-outline-light');
                    button.classList.add('btn-primary'); // Cambia a color sólido para indicar voto
                } else {
                    console.log(response.message); // "Ya has votado"
                    // Si ya votó, lo dejamos deshabilitado pero con estilo de éxito
                    button.classList.remove('btn-outline-light');
                    button.classList.add('btn-primary');
                }
            } catch (error) {
                console.error('Error al votar:', error);
                alert('No se pudo registrar tu voto. Revisa si has iniciado sesión.');
                button.disabled = false; // Habilitar de nuevo solo si hay error
            }
        });
    });
}

/**
 * Envía la solicitud de voto al servidor. (Sin cambios)
 */
async function voteForReport(reportId) {
    const BASE_URL = 'http://localhost/Proyecto/';
    const response = await fetch(BASE_URL + 'vote_report.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report_id: reportId })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la solicitud de voto.');
    }
    return await response.json();
}