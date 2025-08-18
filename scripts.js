// scripts.js
// code to fetch and display reports
class ViasSegurasApp {
    constructor() {
        this.mapa = null;
        this.usuario = null;
        this.todosLosReportes = [];
        this.provinciaSeleccionada = null;
        this.marcadoresMapa = [];
        this.formReporte = null;
        this.filtrosActivos = {
            urgente: true,
            precaucion: true,
            info: true
        };
        this.modoCreacionIncidente = false;

        // Detectar BASE_URL automáticamente
        this.BASE_URL = this.detectarBaseURL();

        this.datosProvincias = {
            'San José': {
                lat: 9.9333,
                lng: -84.0833,
                incidentes: { urgente: 0, precaucion: 0, info: 0 },
                cantones: {
                    'San José': ['Carmen', 'Merced', 'Hospital', 'Catedral', 'Zapote', 'San Francisco', 'Uruca', 'Mata Redonda', 'Pavas', 'Hatillo', 'San Sebastián'],
                    'Escazú': ['Escazú', 'San Antonio', 'San Rafael'],
                    'Desamparados': ['Desamparados', 'San Miguel', 'San Juan de Dios', 'San Rafael Arriba', 'San Antonio', 'Frailes', 'Patarrá'],
                    'Moravia': ['San Vicente', 'San Jerónimo', 'Trinidad'],
                    'Goicoechea': ['Guadalupe', 'San Francisco', 'Calle Blancos', 'Mata de Plátano', 'Ipís', 'Rancho Redondo', 'Purral'],
                    'Santa Ana': ['Santa Ana', 'Salitral', 'Pozos', 'Uruca', 'Piedades', 'Brasil'],
                    'Alajuelita': ['Alajuelita', 'San Josecito', 'San Antonio', 'Concepción', 'San Felipe']
                }
            },
            'Alajuela': {
                lat: 10.0162,
                lng: -84.2163,
                incidentes: { urgente: 0, precaucion: 0, info: 0 },
                cantones: {
                    'Alajuela': ['Alajuela', 'San José', 'Carrizal', 'San Antonio', 'Guácima', 'San Isidro', 'Sabanilla', 'San Rafael', 'Río Segundo', 'Desamparados', 'Turrúcares', 'Tambor', 'Garita', 'Sarapiquí'],
                    'San Ramón': ['San Ramón', 'Santiago', 'San Juan', 'Piedades Norte', 'Piedades Sur', 'San Rafael', 'San Isidro', 'Ángeles', 'Alfaro', 'Volio', 'Concepción'],
                    'Grecia': ['Grecia', 'San Isidro', 'San José', 'San Roque', 'Tacares', 'Puente de Piedra', 'Bolívar'],
                    'San Carlos': ['Quesada', 'Florencia', 'Buenavista', 'Aguas Zarcas', 'Venecia', 'Pital', 'La Fortuna', 'La Tigra', 'La Palmera', 'Venado', 'Cutris', 'Monterrey', 'Pocosol']
                }
            },
            'Cartago': {
                lat: 9.8634,
                lng: -83.9194,
                incidentes: { urgente: 0, precaucion: 0, info: 0 },
                cantones: {
                    'Cartago': ['Oriental', 'Occidental', 'Carmen', 'San Nicolás', 'Aguacaliente', 'Guadalupe', 'Corralillo', 'Tierra Blanca', 'Dulce Nombre', 'Llano Grande', 'Quebradilla'],
                    'Paraíso': ['Paraíso', 'Santiago', 'Orosi', 'Cachí', 'Llanos de Santa Lucía'],
                    'La Unión': ['Tres Ríos', 'San Diego', 'San Juan', 'San Rafael', 'Concepción', 'Dulce Nombre', 'San Ramón', 'Río Azul'],
                    'Turrialba': ['Turrialba', 'La Suiza', 'Peralta', 'Santa Cruz', 'Santa Teresita', 'Pavones', 'Tuis', 'Tayutic', 'Santa Rosa', 'Tres Equis']
                }
            },
            'Heredia': {
                lat: 10.0024,
                lng: -84.1165,
                incidentes: { urgente: 0, precaucion: 0, info: 0 },
                cantones: {
                    'Heredia': ['Heredia', 'Mercedes', 'San Francisco', 'Ulloa', 'Varablanca'],
                    'Barva': ['Barva', 'San Pedro', 'San Pablo', 'San Roque', 'Santa Lucía', 'San José de la Montaña'],
                    'Santo Domingo': ['Santo Domingo', 'San Vicente', 'San Miguel', 'Paracito', 'Santo Tomás', 'Santa Rosa', 'Tures', 'Pará'],
                    'San Rafael': ['San Rafael', 'San Josecito', 'Santiago', 'Ángeles', 'Concepción'],
                    'San Isidro': ['San Isidro', 'San José', 'Concepción', 'San Francisco'],
                    'Belén': ['San Antonio', 'La Ribera', 'La Asunción'],
                    'Flores': ['San Joaquín', 'Barrantes', 'Llorente']
                }
            },
            'Guanacaste': {
                lat: 10.4285,
                lng: -85.3968,
                incidentes: { urgente: 0, precaucion: 0, info: 0 },
                cantones: {
                    'Liberia': ['Liberia', 'Cañas Dulces', 'Mayorga', 'Nacascolo', 'Curubandé'],
                    'Nicoya': ['Nicoya', 'Mansión', 'San Antonio', 'Quebrada Honda', 'Sámara', 'Nosara', 'Belén de Nosarita'],
                    'Santa Cruz': ['Santa Cruz', 'Bolsón', 'Veintisiete de Abril', 'Tempate', 'Cartagena', 'Cuajiniquil', 'Diriá', 'Cabo Velas', 'Tamarindo'],
                    'Bagaces': ['Bagaces', 'La Fortuna', 'Mogote', 'Río Naranjo'],
                    'Carrillo': ['Filadelfia', 'Palmira', 'Sardinal', 'Belén'],
                    'Cañas': ['Cañas', 'Palmira', 'San Miguel', 'Bebedero', 'Porozal']
                }
            },
            'Puntarenas': {
                lat: 9.9763,
                lng: -84.8388,
                incidentes: { urgente: 0, precaucion: 0, info: 0 },
                cantones: {
                    'Puntarenas': ['Puntarenas', 'Pitahaya', 'Chomes', 'Lepanto', 'Paquera', 'Manzanillo', 'Guacimal', 'Barranca', 'Monte Verde', 'Isla del Coco', 'Cóbano', 'Chacarita', 'Chira', 'Acapulco', 'El Roble', 'Arancibia'],
                    'Esparza': ['Espíritu Santo', 'San Juan Grande', 'Macacona', 'San Rafael', 'San Jerónimo', 'Caldera'],
                    'Buenos Aires': ['Buenos Aires', 'Volcán', 'Potrero Grande', 'Boruca', 'Pilas', 'Colinas', 'Chánguena', 'Biolley', 'Brunka'],
                    'Montes de Oro': ['Miramar', 'La Unión', 'San Isidro'],
                    'Osa': ['Puerto Cortés', 'Palmar', 'Sierpe', 'Bahía Ballena', 'Piedras Blancas', 'Bahía Drake']
                }
            },
            'Limón': {
                lat: 9.9907,
                lng: -83.0355,
                incidentes: { urgente: 0, precaucion: 0, info: 0 },
                cantones: {
                    'Limón': ['Limón', 'Valle La Estrella', 'Río Blanco', 'Matama'],
                    'Pococí': ['Guápiles', 'Jiménez', 'Rita', 'Roxana', 'Cariari', 'Colorado', 'La Colonia'],
                    'Siquirres': ['Siquirres', 'Pacuarito', 'Florida', 'Germania', 'Cairo', 'Alegría'],
                    'Talamanca': ['Bratsi', 'Sixaola', 'Cahuita', 'Telire'],
                    'Matina': ['Matina', 'Batán', 'Carrandi'],
                    'Guácimo': ['Guácimo', 'Mercedes', 'Pocora', 'Río Jiménez', 'Duacarí']
                }
            }
        };

        // INICIALIZACIÓN SEGURA DE DOM
        this.dom = this.inicializarDOM();
        this.inicializar();
    }

    // MÉTODO PARA DETECTAR BASE_URL AUTOMÁTICAMENTE
    detectarBaseURL() {
        const currentPath = window.location.pathname;
        const origin = window.location.origin;

        // Si estamos en localhost
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            // Buscar la carpeta del proyecto
            if (currentPath.includes('SC502-2C2025-GRUPO7')) {
                const projectIndex = currentPath.indexOf('SC502-2C2025-GRUPO7');
                return origin + currentPath.substring(0, projectIndex + 'SC502-2C2025-GRUPO7'.length) + '/';
            }
            return origin + '/'; // fallback para localhost
        }

        // Para producción, ajustar según tu estructura
        return origin + '/SC502-2C2025-GRUPO7/';
    }

    // INICIALIZACIÓN SEGURA DE ELEMENTOS DOM
    inicializarDOM() {
        const getElement = (id) => {
            const element = document.getElementById(id);
            if (!element) {
                console.warn(`Elemento con ID '${id}' no encontrado`);
            }
            return element;
        };

        return {
            botonLogin: getElement('botonLogin'),
            menuUsuario: getElement('menuUsuario'),
            nombreUsuario: getElement('nombreUsuario'),
            btnCerrarSesion: getElement('btnCerrarSesion'),
            formularioLogin: getElement('formularioLogin'),
            formularioRegistro: getElement('formularioRegistro'),
            modalLogin: null,
            modalRegistro: null,
        };
    }

    inicializar() {
        this.inicializarMapa();
        this.configurarEventos();
        this.inicializarSelectoresUbicacion();
        this.cargarEstadoUsuario();
        this.configurarModales();
        this.mostrarSeccion('inicio');
        this.cargarDatosIniciales();
    }

    configurarEventos() {
        const addEventListenerSafe = (element, event, handler) => {
            if (element) {
                element.addEventListener(event, handler);
            } else {
                console.warn(`No se pudo agregar event listener a elemento null`);
            }
        };

        // CORREGIR: Usar arrow function para mantener el contexto de 'this'
        addEventListenerSafe(document.getElementById('btnEnviarReporte'), 'click', (e) => this.enviarReporte(e));
        addEventListenerSafe(document.getElementById('inputImagen'), 'change', (e) => this.previsualizarImagen(e));
        addEventListenerSafe(document.getElementById('selectProvincia'), 'change', (e) => this.cambiarProvincia(e));
        addEventListenerSafe(document.getElementById('selectCanton'), 'change', (e) => this.cambiarCanton(e));

        addEventListenerSafe(this.dom.formularioLogin, 'submit', (e) => this.iniciarSesion(e));
        addEventListenerSafe(this.dom.formularioRegistro, 'submit', (e) => this.registrarUsuario(e));
        addEventListenerSafe(this.dom.btnCerrarSesion, 'click', () => this.cerrarSesion());

        // Navigation links
        document.querySelectorAll('.navbar-nav .nav-link[data-section], .btn[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.mostrarSeccion(e.currentTarget.dataset.section);
            });
        });

        // Filtros
        document.querySelectorAll('.filtro-tipo').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.handleFiltroTipoChange(e));
        });
    }

    // FUNCIÓN DE REPORTE CORREGIDA Y MEJORADA
    // Actualiza la función de enviar reporte
    // Función de enviar reporte mejorada con mejor manejo de errores
    async enviarReporte(evento) {
        if (evento) {
            evento.preventDefault();
        }

        if (!this.usuario) {
            this.mostrarNotificacion('Debes iniciar sesión para poder reportar.', 'danger');
            this.dom.modalLogin?.show();
            return;
        }

        const descripcion = document.getElementById('textoReporte').value.trim();
        const provincia = document.getElementById('selectProvincia').value;
        const canton = document.getElementById('selectCanton').value;
        const distrito = document.getElementById('selectDistrito').value;
        const prioridad = document.getElementById('prioridadReporte').value;
        const imagenFile = document.getElementById('inputImagen').files[0];

        if (!descripcion || !provincia || !canton) {
            this.mostrarNotificacion('Descripción, provincia y cantón son obligatorios.', 'warning');
            return;
        }

        // Crear FormData
        const formData = new FormData();
        formData.append('descripcion', descripcion);
        formData.append('provincia', provincia);
        formData.append('canton', canton);
        formData.append('distrito', distrito);
        formData.append('prioridad', prioridad);
        formData.append('id_usuario', this.usuario.id);
        formData.append('id_tipo_incidente', 6);

        if (imagenFile) {
            formData.append('imagen', imagenFile);
        }

        // Mostrar loading en el botón
        const btnEnviar = document.getElementById('btnEnviarReporte');
        const textoOriginal = btnEnviar.innerHTML;
        btnEnviar.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Enviando...';
        btnEnviar.disabled = true;

        try {
            console.log('Enviando reporte a:', this.BASE_URL + 'create_report.php');

            const response = await fetch(this.BASE_URL + 'create_report.php', {
                method: 'POST',
                body: formData
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            // Obtener el texto completo de la respuesta
            const responseText = await response.text();
            console.log('Response text completo:', responseText);

            // Verificar si la respuesta está vacía
            if (!responseText || responseText.trim() === '') {
                throw new Error('Respuesta vacía del servidor');
            }

            // Verificar si la respuesta parece ser HTML en lugar de JSON
            if (responseText.trim().startsWith('<') || responseText.includes('<br />') || responseText.includes('<!DOCTYPE')) {
                console.error('Respuesta HTML recibida en lugar de JSON:', responseText.substring(0, 500));
                throw new Error('El servidor devolvió HTML en lugar de JSON. Posible error de PHP. Revisa la consola del navegador.');
            }

            // Intentar parsear JSON
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                console.error('Respuesta que causó el error:', responseText);
                throw new Error(`Error parsing JSON: ${parseError.message}. Respuesta: ${responseText.substring(0, 200)}`);
            }

            if (result.success) {
                this.mostrarNotificacion(result.message, 'success');
                this.limpiarFormularioReporte();
                await this.cargarDatosIniciales(); // Recargar reportes
                if (this.usuario) {
                    this.cargarPuntosUsuario(); // Actualizar puntos
                }
            } else {
                this.mostrarNotificacion('Error: ' + result.message, 'danger');
            }

        } catch (error) {
            console.error('Error completo:', error);
            console.error('Stack trace:', error.stack);

            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                this.mostrarNotificacion('Error de conexión. Verifica tu conexión a internet.', 'danger');
            } else if (error.message.includes('JSON')) {
                this.mostrarNotificacion('Error de formato de respuesta del servidor.', 'danger');
            } else {
                this.mostrarNotificacion('Error: ' + error.message, 'danger');
            }
        } finally {
            // Restaurar botón
            btnEnviar.innerHTML = textoOriginal;
            btnEnviar.disabled = false;
        }
    }

    /**  limpiarFormulario() {
         const elementos = [
             { id: 'textoReporte', valor: '' },
             { id: 'previewImagen', html: '' },
             { id: 'inputImagen', valor: '' },
             { id: 'prioridadReporte', valor: 'info' },
             { id: 'selectProvincia', valor: '' }
         ];
 
         elementos.forEach(elem => {
             const element = document.getElementById(elem.id);
             if (element) {
                 if (elem.html !== undefined) {
                     element.innerHTML = elem.html;
                 } else {
                     element.value = elem.valor;
                 }
             }
         });
 
         this.cambiarProvincia({ target: { value: '' } });
     }**/

    limpiarFormularioReporte() {
        document.getElementById('textoReporte').value = '';
        document.getElementById('selectProvincia').value = '';
        document.getElementById('selectCanton').innerHTML = '<option value="">Cantón *</option>';
        document.getElementById('selectDistrito').innerHTML = '<option value="">Distrito</option>';
        document.getElementById('selectCanton').disabled = true;
        document.getElementById('selectDistrito').disabled = true;
        document.getElementById('prioridadReporte').value = 'info';
        document.getElementById('inputImagen').value = '';
        document.getElementById('previewImagen').innerHTML = '';

        // Resetear checkbox si existe
        const checkboxAnonimo = document.getElementById('modoAnonimo');
        if (checkboxAnonimo) {
            checkboxAnonimo.checked = false;
        }
    }

    async cargarDatosIniciales() {
        const feedContainer = document.getElementById('feedReportes');
        if (feedContainer) {
            feedContainer.innerHTML = '<div class="text-center py-3"><i class="fas fa-spinner fa-spin me-2"></i>Cargando reportes...</div>';
        }

        try {
            console.log('Cargando datos desde:', this.BASE_URL + 'get_reports.php');

            const response = await fetch(this.BASE_URL + 'get_reports.php');
            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();  // Parsear directamente como JSON
            console.log('Response data:', result);

            // Verificar estructura de respuesta
            if (!result.success) {
                throw new Error(result.message || 'Error en la respuesta del servidor');
            }

            if (!Array.isArray(result.data)) {
                throw new Error('Formato de datos inválido: se esperaba un array');
            }

            const reportes = result.data;
            console.log(`Reportes recibidos: ${reportes.length}`);

            if (feedContainer) {
                feedContainer.innerHTML = '';
            }

            if (reportes.length === 0) {
                if (feedContainer) {
                    feedContainer.innerHTML = '<div class="alert alert-info text-center">No hay reportes para mostrar en este momento.</div>';
                }
                return;
            }

            this.todosLosReportes = reportes;
            this.procesarYRenderizarTodo();

            // Actualizar el mapa con los reportes
            this.actualizarMapaConReportes(reportes);

        } catch (error) {
            console.error('Error cargando reportes:', error);
            if (feedContainer) {
                feedContainer.innerHTML = `<div class="alert alert-danger">Error: ${error.message}<br><small>URL: ${this.BASE_URL}get_reports.php</small></div>`;
            }
        }
    }

    procesarYRenderizarTodo() {
        this.procesarDatosDeReportes(this.todosLosReportes);
        this.actualizarPanelProvincias();
        this.aplicarFiltrosYRenderizar();
    }

    aplicarFiltrosYRenderizar() {
        let reportesFiltrados = this.todosLosReportes;

        if (this.provinciaSeleccionada) {
            reportesFiltrados = reportesFiltrados.filter(r => r.provincia === this.provinciaSeleccionada);
        }

        reportesFiltrados = reportesFiltrados.filter(r => {
            const prioridadLower = (r.prioridad || 'info').toLowerCase();
            return this.filtrosActivos[prioridadLower];
        });

        this.renderizarFeed(reportesFiltrados);
        this.actualizarMapaConReportes(reportesFiltrados);
    }

    renderizarFeed(reportes) {
        const feedContainer = document.getElementById('feedReportes');
        if (!feedContainer) return;

        feedContainer.innerHTML = '';

        if (reportes.length === 0) {
            feedContainer.innerHTML = '<div class="alert alert-info text-center">No hay reportes que coincidan con los filtros seleccionados.</div>';
            return;
        }

        reportes.forEach(report => {
            const estadoBadge = this.obtenerBadgeEstado(report.estado_reporte || 'normal');
            const botonesAccion = this.usuario ? `
            <div class="d-flex gap-2 mt-2">
                <button class="btn btn-sm btn-outline-success btn-voto-positivo" onclick="window.app.votar(${report.id}, 'positivo')">
                    <i class="fas fa-thumbs-up me-1"></i> ${report.votos_positivos || 0}
                </button>
                <button class="btn btn-sm btn-outline-danger btn-voto-negativo" onclick="window.app.votar(${report.id}, 'negativo')">
                    <i class="fas fa-thumbs-down me-1"></i> ${report.votos_negativos || 0}
                </button>
                <button class="btn btn-sm btn-outline-warning" onclick="window.app.mostrarModalInforme(${report.id})">
                    <i class="fas fa-flag me-1"></i> Informar
                </button>
            </div>
        ` : `<div class="text-muted small mt-2">
            <i class="fas fa-thumbs-up me-1"></i> ${report.votos_positivos || 0} 
            <i class="fas fa-thumbs-down ms-2 me-1"></i> ${report.votos_negativos || 0}
        </div>`;

            // CORREGIR: Manejo correcto de imágenes
            let imagenHTML = '';
            if (report.imagen &&
                report.imagen !== 'NULL' &&
                report.imagen !== 'null' &&
                report.imagen.trim() !== '') {

                // Construir la URL completa de la imagen
                const imagenUrl = report.imagen.startsWith('http')
                    ? report.imagen
                    : this.BASE_URL + report.imagen;

                imagenHTML = `
                <div class="mb-2">
                    <img src="${imagenUrl}" 
                         class="img-fluid rounded" 
                         alt="Imagen del reporte" 
                         style="max-height: 300px; width: 100%; object-fit: cover;"
                         onerror="this.style.display='none';">
                </div>`;
            }

            const reportHTML = `
            <div class="card mb-3" data-reporte-id="${report.id}">
                <div class="card-body">
                    <div class="d-flex align-items-start mb-2">
                        <div class="flex-shrink-0 me-3">
                            <i class="fas fa-user-circle fa-2x text-secondary"></i>
                        </div>
                        <div class="flex-grow-1">
                            <h6 class="mb-1">${this.escapeHtml(report.usuario_nombre || 'Usuario')} ${this.escapeHtml(report.usuario_apellido || '')} 
                                <small class="badge bg-secondary ms-1">${this.escapeHtml(report.usuario_rango || 'Novato')}</small>
                            </h6>
                            <small class="text-muted">
                                ${new Date(report.created_at).toLocaleString('es-ES')} • 
                                ${this.escapeHtml(report.provincia)}, ${this.escapeHtml(report.canton)}
                                ${report.distrito ? ', ' + this.escapeHtml(report.distrito) : ''}
                            </small>
                        </div>
                        <div class="flex-shrink-0">
                            ${estadoBadge}
                        </div>
                    </div>
                    <p class="mb-2">${this.escapeHtml(report.descripcion)}</p>
                    ${imagenHTML}
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <span class="badge bg-${this.getPrioridadColor(report.prioridad)} me-1">
                                ${this.escapeHtml((report.prioridad || 'Info').toUpperCase())}
                            </span>
                            <span class="badge bg-secondary">
                                ${this.escapeHtml(report.tipo_incidente_nombre || 'General')}
                            </span>
                        </div>
                    </div>
                    ${botonesAccion}
                </div>
            </div>
        `;
            feedContainer.insertAdjacentHTML('beforeend', reportHTML);
        });
    }

    getPrioridadColor(prioridad) {
        switch ((prioridad || '').toLowerCase()) {
            case 'urgente': return 'danger';
            case 'precaucion': return 'warning';
            case 'info': return 'info';
            default: return 'secondary';
        }
    }

    // FUNCIÓN PARA ESCAPAR HTML Y PREVENIR XSS
    escapeHtml(text) {
        if (text === null || text === undefined) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, function (m) { return map[m]; });
    }

    procesarDatosDeReportes(reportes) {
        // Reset contadores
        for (const provincia in this.datosProvincias) {
            this.datosProvincias[provincia].incidentes = { urgente: 0, precaucion: 0, info: 0 };
        }

        reportes.forEach(reporte => {
            if (reporte.provincia && this.datosProvincias[reporte.provincia]) {
                const prioridadLower = (reporte.prioridad || 'info').toLowerCase();
                if (this.datosProvincias[reporte.provincia].incidentes[prioridadLower] !== undefined) {
                    this.datosProvincias[reporte.provincia].incidentes[prioridadLower]++;
                }
            }
        });
    }

    actualizarPanelProvincias() {
        const contenedor = document.getElementById('listaProvincias');
        if (!contenedor) return;

        contenedor.innerHTML = '';

        Object.entries(this.datosProvincias).forEach(([provincia, datos]) => {
            const totalProvincia = datos.incidentes.urgente + datos.incidentes.precaucion + datos.incidentes.info;
            const itemProvincia = document.createElement('div');
            itemProvincia.className = `list-group-item list-group-item-action d-flex justify-content-between align-items-center ${this.provinciaSeleccionada === provincia ? 'active' : ''}`;
            itemProvincia.innerHTML = `
                <span>${this.escapeHtml(provincia)}</span>
                <span class="badge bg-primary rounded-pill">${totalProvincia}</span>
            `;
            itemProvincia.addEventListener('click', () => this.handleProvinciaClick(provincia));
            contenedor.appendChild(itemProvincia);
        });
    }

    handleProvinciaClick(provincia) {
        this.provinciaSeleccionada = this.provinciaSeleccionada === provincia ? null : provincia;
        this.aplicarFiltrosYRenderizar();
        this.actualizarPanelProvincias();
    }

    handleFiltroTipoChange(evento) {
        const filtro = evento.target.dataset.filtro;
        const estaActivo = evento.target.checked;
        this.filtrosActivos[filtro] = estaActivo;
        this.aplicarFiltrosYRenderizar();
    }

    actualizarMapaConReportes(reportes) {
        if (!this.mapa) return;

        // Limpiar marcadores existentes
        this.marcadoresMapa.forEach(marcador => this.mapa.removeLayer(marcador));
        this.marcadoresMapa = [];

        let latLngs = [];

        reportes.forEach(reporte => {
            if (reporte.latitud && reporte.longitud && reporte.latitud !== 0) {
                const lat = parseFloat(reporte.latitud);
                const lng = parseFloat(reporte.longitud);
                const latLng = [lat, lng];

                const iconColor = reporte.prioridad.toLowerCase() === 'urgente' ? 'red' :
                    reporte.prioridad.toLowerCase() === 'precaucion' ? 'orange' : 'blue';

                const customIcon = L.icon({
                    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColor}.png`,
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });

                const marcador = L.marker(latLng, { icon: customIcon })
                    .addTo(this.mapa)
                    .bindPopup(`
                    <b>${reporte.tipo_incidente_nombre || 'Reporte'}</b><br>
                    <small>${reporte.provincia}, ${reporte.canton}</small>
                    <hr style="margin: 5px 0;">
                    ${reporte.descripcion.substring(0, 70)}...
                `);

                this.marcadoresMapa.push(marcador);
                latLngs.push(latLng);
            }
        });

        if (latLngs.length > 0) {
            this.mapa.fitBounds(latLngs, { padding: [50, 50], maxZoom: 14 });
        } else if (!this.provinciaSeleccionada) {
            this.mapa.setView([9.7489, -83.7534], 8);  // Vista por defecto de Costa Rica
        }

        this.mapa.invalidateSize();
    }

    inicializarMapa() {
        if (document.getElementById('mapaLeaflet')) {
            this.mapa = L.map('mapaLeaflet').setView([9.7489, -83.7534], 8);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(this.mapa);

            this.mapa.on('click', (e) => {
                if (this.usuario && this.modoCreacionIncidente) {
                    this.mostrarModalCrearIncidente(e.latlng.lat, e.latlng.lng);
                }
            });

            this.agregarControlMapa();
        }
    }

    agregarControlMapa() {
        const CustomControl = L.Control.extend({
            onAdd: (map) => {
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
                container.style.backgroundColor = 'white';
                container.style.padding = '5px';
                container.style.cursor = 'pointer';
                container.innerHTML = '📍 Crear Incidente';
                container.onclick = () => {
                    if (this.usuario) {
                        this.modoCreacionIncidente = !this.modoCreacionIncidente;
                        container.style.backgroundColor = this.modoCreacionIncidente ? '#007bff' : 'white';
                        container.style.color = this.modoCreacionIncidente ? 'white' : 'black';
                        this.mostrarNotificacion(
                            this.modoCreacionIncidente
                                ? 'Modo creación activado. Haz clic en el mapa para crear un incidente.'
                                : 'Modo creación desactivado.',
                            'info'
                        );
                    } else {
                        this.mostrarNotificacion('Debes iniciar sesión para crear incidentes.', 'warning');
                    }
                };
                return container;
            }
        });

        new CustomControl({ position: 'topright' }).addTo(this.mapa);
    }

    mostrarSeccion(seccionId) {
        document.querySelectorAll('section.seccion-hero, div#mainAppContent').forEach(sec => sec.classList.add('d-none'));
        document.querySelectorAll('.seccion-app').forEach(sec => sec.classList.add('d-none'));

        if (seccionId === 'inicio') {
            document.getElementById('inicio').classList.remove('d-none');
        } else {
            document.getElementById('mainAppContent').classList.remove('d-none');
            const seccionActiva = document.getElementById(seccionId);
            if (seccionActiva) {
                seccionActiva.classList.remove('d-none');
            }
            if (seccionId === 'mapa' && this.mapa) {
                this.mapa.invalidateSize();
            }
        }
    }

    configurarModales() {
        const modalLoginEl = document.getElementById('modalLogin');
        const modalRegistroEl = document.getElementById('modalRegistro');
        if (modalLoginEl) this.dom.modalLogin = new bootstrap.Modal(modalLoginEl);
        if (modalRegistroEl) this.dom.modalRegistro = new bootstrap.Modal(modalRegistroEl);
    }

    inicializarSelectoresUbicacion() {
        const selectProvincia = document.getElementById('selectProvincia');
        if (!selectProvincia) return;
        selectProvincia.innerHTML = '<option value="">Provincia *</option>';
        Object.keys(this.datosProvincias).forEach(provincia => {
            const option = document.createElement('option');
            option.value = provincia;
            option.textContent = provincia;
            selectProvincia.appendChild(option);
        });
    }

    cambiarProvincia(evento) {
        const provincia = evento.target.value;
        const selectCanton = document.getElementById('selectCanton');
        const selectDistrito = document.getElementById('selectDistrito');
        selectCanton.innerHTML = '<option value="">Cantón *</option>';
        selectDistrito.innerHTML = '<option value="">Distrito</option>';
        selectCanton.disabled = true;
        selectDistrito.disabled = true;
        if (provincia) {
            selectCanton.disabled = false;
            Object.keys(this.datosProvincias[provincia].cantones).forEach(canton => {
                const option = document.createElement('option');
                option.value = canton;
                option.textContent = canton;
                selectCanton.appendChild(option);
            });
        }
    }

    cambiarCanton(evento) {
        const provincia = document.getElementById('selectProvincia').value;
        const canton = evento.target.value;
        const selectDistrito = document.getElementById('selectDistrito');
        selectDistrito.innerHTML = '<option value="">Distrito</option>';
        selectDistrito.disabled = true;
        if (provincia && canton && this.datosProvincias[provincia].cantones[canton]) {
            selectDistrito.disabled = false;
            this.datosProvincias[provincia].cantones[canton].forEach(distrito => {
                const option = document.createElement('option');
                option.value = distrito;
                option.textContent = distrito;
                selectDistrito.appendChild(option);
            });
        }
    }

    previsualizarImagen(evento) {
        const archivo = evento.target.files[0];
        const preview = document.getElementById('previewImagen');
        if (archivo && preview) {
            const lector = new FileReader();
            lector.onload = (e) => {
                preview.innerHTML = `<img src="${e.target.result}" class="img-fluid rounded">`;
            };
            lector.readAsDataURL(archivo);
        }
    }

    async iniciarSesion(evento) {
        evento.preventDefault();
        const email = document.getElementById('emailLogin').value;
        const password = document.getElementById('passwordLogin').value;

        try {
            const response = await fetch(this.BASE_URL + 'login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            // MANEJO MEJORADO DE RESPUESTAS JSON
            let data;
            try {
                const responseText = await response.text();
                console.log('Login response:', responseText); // Debug
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Error parsing login JSON:', parseError);
                this.mostrarNotificacion('Error del servidor al iniciar sesión.', 'danger');
                return;
            }

            if (response.ok && data.success) {
                this.usuario = data.user;
                localStorage.setItem('usuarioViasSeguras', JSON.stringify(this.usuario));
                this.actualizarUIUsuario();
                this.dom.modalLogin?.hide();
                this.mostrarNotificacion(`¡Bienvenido, ${this.usuario.nombre}!`, 'success');
                this.mostrarSeccion('reportes');
            } else {
                this.mostrarNotificacion('Error: ' + (data.message || 'Credenciales inválidas.'), 'danger');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            this.mostrarNotificacion('Ocurrió un error. Inténtalo de nuevo.', 'danger');
        }
    }

    async registrarUsuario(evento) {
        evento.preventDefault();

        const nombre = document.getElementById('nombreRegistro').value.trim();
        const apellido = document.getElementById('apellidoRegistro').value.trim();
        const email = document.getElementById('emailRegistro').value.trim();
        const password = document.getElementById('passwordRegistro').value;
        const confirmPassword = document.getElementById('confirmPasswordRegistro').value;
        const termsCheck = document.getElementById('termsCheckRegistro').checked;

        console.log('Valores del formulario:', {
            nombre, apellido, email, password: '***', confirmPassword: '***', termsCheck
        });

        if (!nombre || !apellido || !email || !password) {
            this.mostrarNotificacion('Todos los campos son obligatorios.', 'warning');
            return;
        }

        if (password !== confirmPassword) {
            this.mostrarNotificacion('Las contraseñas no coinciden.', 'warning');
            return;
        }

        if (password.length < 8) {
            this.mostrarNotificacion('La contraseña debe tener al menos 8 caracteres.', 'warning');
            return;
        }

        if (!termsCheck) {
            this.mostrarNotificacion('Debes aceptar los Términos y Condiciones.', 'warning');
            return;
        }

        const datosRegistro = {
            nombre: nombre,
            apellido: apellido,
            email: email,
            password: password
        };

        console.log('Datos a enviar:', datosRegistro);
        console.log('URL completa:', this.BASE_URL + 'registro.php');

        try {
            const submitBtn = evento.target.querySelector('button[type="submit"]');
            const textoOriginal = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Registrando...';
            submitBtn.disabled = true;

            const response = await fetch(this.BASE_URL + 'registro.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(datosRegistro)
            });

            console.log('Response status:', response.status);

            // MANEJO MEJORADO DE RESPUESTAS JSON
            let data;
            try {
                const responseText = await response.text();
                console.log('Register response text:', responseText);
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Error parseando JSON:', parseError);
                submitBtn.innerHTML = textoOriginal;
                submitBtn.disabled = false;
                this.mostrarNotificacion('Error del servidor. Revisa la consola para más detalles.', 'danger');
                return;
            }

            console.log('Data parsed:', data);

            submitBtn.innerHTML = textoOriginal;
            submitBtn.disabled = false;

            if (response.ok && data.success) {
                this.mostrarNotificacion(data.message + ' Ahora puedes iniciar sesión.', 'success');
                document.getElementById('formularioRegistro').reset();
                this.dom.modalRegistro?.hide();

                setTimeout(() => {
                    this.dom.modalLogin?.show();
                    document.getElementById('emailLogin').value = email;
                }, 500);

            } else {
                console.error('Error del servidor:', data);
                this.mostrarNotificacion('Error al registrar: ' + (data.message || 'Hubo un problema.'), 'danger');
            }

        } catch (error) {
            console.error('Error de red completo:', error);
            const submitBtn = evento.target.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = 'Crear Cuenta';
                submitBtn.disabled = false;
            }
            this.mostrarNotificacion('Error de conexión. Verifica tu conexión a internet.', 'danger');
        }
    }

    async cerrarSesion() {
        try {
            const response = await fetch(this.BASE_URL + 'logout.php', { method: 'POST' });

            let data;
            try {
                const responseText = await response.text();
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Error parsing logout JSON:', parseError);
                // Continuar con logout local aunque falle el servidor
                data = { success: true, message: 'Sesión cerrada localmente' };
            }

            if (response.ok && data.success) {
                this.usuario = null;
                localStorage.removeItem('usuarioViasSeguras');
                this.actualizarUIUsuario();
                this.mostrarNotificacion(data.message, 'info');
                this.mostrarSeccion('inicio');
            } else {
                this.mostrarNotificacion('Error al cerrar sesión: ' + (data.message || 'No se pudo.'), 'danger');
            }
        } catch (error) {
            console.error('Error cerrando sesión:', error);
            this.mostrarNotificacion('Ocurrió un error. Inténtalo de nuevo.', 'danger');
        }
    }

    cargarEstadoUsuario() {
        const storedUser = localStorage.getItem('usuarioViasSeguras');
        if (storedUser) {
            this.usuario = JSON.parse(storedUser);
        } else {
            this.usuario = null;
        }
        this.actualizarUIUsuario();
    }

    actualizarUIUsuario() {
        if (this.usuario) {
            this.dom.botonLogin.classList.add('d-none');
            this.dom.menuUsuario.classList.remove('d-none');
            this.dom.nombreUsuario.textContent = this.usuario.nombre;
            const nombrePerfilEl = document.getElementById('nombrePerfil');
            const emailPerfilEl = document.getElementById('emailPerfil');
            if (nombrePerfilEl) nombrePerfilEl.textContent = `${this.usuario.nombre} ${this.usuario.apellido}`;
            if (emailPerfilEl) emailPerfilEl.textContent = this.usuario.email;

            this.cargarPuntosUsuario();
        } else {
            this.dom.botonLogin.classList.remove('d-none');
            this.dom.menuUsuario.classList.add('d-none');
            const nombrePerfilEl = document.getElementById('nombrePerfil');
            const emailPerfilEl = document.getElementById('emailPerfil');
            const puntosEl = document.getElementById('puntosUsuario');
            const rangoEl = document.getElementById('rangoUsuario');

            if (nombrePerfilEl) nombrePerfilEl.textContent = 'Invitado';
            if (emailPerfilEl) emailPerfilEl.textContent = 'Inicia sesión para ver tu perfil';
            if (puntosEl) puntosEl.textContent = '0';
            if (rangoEl) rangoEl.textContent = 'Novato';
        }
    }

    async votar(idReporte, tipoVoto) {
        if (!this.usuario) {
            this.mostrarNotificacion('Debes iniciar sesión para votar.', 'warning');
            return;
        }

        try {
            const response = await fetch(this.BASE_URL + 'votar_reporte.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_usuario: this.usuario.id,
                    id_reporte: idReporte,
                    tipo_voto: tipoVoto
                })
            });

            let result;
            try {
                const responseText = await response.text();
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Error parsing vote JSON:', parseError);
                this.mostrarNotificacion('Error del servidor al votar.', 'danger');
                return;
            }

            if (result.success) {
                this.mostrarNotificacion(result.message, 'success');
                this.actualizarContadoresVoto(idReporte, result.votos_positivos, result.votos_negativos);
            } else {
                this.mostrarNotificacion('Error: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error votando:', error);
            this.mostrarNotificacion('Error de red al votar.', 'danger');
        }
    }

    async informarReporte(idReporte, motivo, descripcion = '') {
        if (!this.usuario) {
            this.mostrarNotificacion('Debes iniciar sesión para reportar.', 'warning');
            return;
        }

        try {
            const response = await fetch(this.BASE_URL + 'informar_reporte.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_usuario: this.usuario.id,
                    id_reporte: idReporte,
                    motivo: motivo,
                    descripcion: descripcion
                })
            });

            let result;
            try {
                const responseText = await response.text();
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Error parsing report JSON:', parseError);
                this.mostrarNotificacion('Error del servidor al informar.', 'danger');
                return;
            }

            if (result.success) {
                this.mostrarNotificacion(result.message, 'success');
            } else {
                this.mostrarNotificacion('Error: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error informando:', error);
            this.mostrarNotificacion('Error de red al informar.', 'danger');
        }
    }

    async cargarPuntosUsuario() {
        if (!this.usuario) return;

        try {
            const response = await fetch(this.BASE_URL + `get_user_points.php?id_usuario=${this.usuario.id}`);

            let result;
            try {
                const responseText = await response.text();
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Error parsing points JSON:', parseError);
                return;
            }

            if (result.success) {
                this.actualizarInterfazPuntos(result.data);
            }
        } catch (error) {
            console.error('Error al cargar puntos:', error);
        }
    }

    actualizarInterfazPuntos(data) {
        const puntosElement = document.getElementById('puntosUsuario');
        const rangoElement = document.getElementById('rangoUsuario');

        if (puntosElement) puntosElement.textContent = data.puntos;
        if (rangoElement) rangoElement.textContent = data.rango_actual;

        if (this.usuario) {
            this.usuario.puntos = data.puntos;
            this.usuario.user_rank = data.rango_actual;
            localStorage.setItem('usuarioViasSeguras', JSON.stringify(this.usuario));
        }
    }

    actualizarContadoresVoto(idReporte, votosPositivos, votosNegativos) {
        const reporteElement = document.querySelector(`[data-reporte-id="${idReporte}"]`);
        if (reporteElement) {
            const positiveBtn = reporteElement.querySelector('.btn-voto-positivo');
            const negativeBtn = reporteElement.querySelector('.btn-voto-negativo');

            if (positiveBtn) positiveBtn.textContent = `👍 ${votosPositivos}`;
            if (negativeBtn) negativeBtn.textContent = `👎 ${votosNegativos}`;
        }
    }

    async crearIncidenteEnMapa(latitud, longitud, descripcion, prioridad = 'info', tipoIncidente = 6) {
        if (!this.usuario) {
            this.mostrarNotificacion('Debes iniciar sesión para crear incidentes.', 'warning');
            return;
        }

        try {
            const response = await fetch(this.BASE_URL + 'get_map_incidents.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_usuario: this.usuario.id,
                    descripcion: descripcion,
                    latitud: latitud,
                    longitud: longitud,
                    prioridad: prioridad,
                    id_tipo_incidente: tipoIncidente
                })
            });

            let result;
            try {
                const responseText = await response.text();
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Error parsing incident JSON:', parseError);
                this.mostrarNotificacion('Error del servidor al crear incidente.', 'danger');
                return;
            }

            if (result.success) {
                this.mostrarNotificacion(result.message, 'success');
                this.cargarDatosIniciales();
                this.cargarPuntosUsuario();
            } else {
                this.mostrarNotificacion('Error: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error creando incidente:', error);
            this.mostrarNotificacion('Error de red al crear incidente.', 'danger');
        }
    }

    obtenerBadgeEstado(estado) {
        switch (estado) {
            case 'confiable':
                return '<span class="badge bg-success">✓ Confiable</span>';
            case 'dudoso':
                return '<span class="badge bg-danger">⚠ Dudoso</span>';
            case 'bajo_revision':
                return '<span class="badge bg-warning">👁 En revisión</span>';
            default:
                return '';
        }
    }

    mostrarModalInforme(idReporte) {
        const modalHTML = `
           <div class="modal fade" id="modalInforme" tabindex="-1">
               <div class="modal-dialog">
                   <div class="modal-content">
                       <div class="modal-header">
                           <h5 class="modal-title">Informar Reporte</h5>
                           <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                       </div>
                       <div class="modal-body">
                           <form id="formInforme">
                               <div class="mb-3">
                                   <label class="form-label">Motivo del informe</label>
                                   <select class="form-select" id="motivoInforme" required>
                                       <option value="">Seleccionar motivo...</option>
                                       <option value="spam">Spam</option>
                                       <option value="contenido_inapropiado">Contenido inapropiado</option>
                                       <option value="informacion_falsa">Información falsa</option>
                                       <option value="duplicado">Reporte duplicado</option>
                                       <option value="otro">Otro</option>
                                   </select>
                               </div>
                               <div class="mb-3">
                                   <label class="form-label">Descripción adicional (opcional)</label>
                                   <textarea class="form-control" id="descripcionInforme" rows="3"></textarea>
                               </div>
                           </form>
                       </div>
                       <div class="modal-footer">
                           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                           <button type="button" class="btn btn-warning" onclick="window.app.enviarInforme(${idReporte})">Enviar Informe</button>
                       </div>
                   </div>
               </div>
           </div>
       `;

        const modalAnterior = document.getElementById('modalInforme');
        if (modalAnterior) modalAnterior.remove();

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = new bootstrap.Modal(document.getElementById('modalInforme'));
        modal.show();
    }

    async enviarInforme(idReporte) {
        const motivo = document.getElementById('motivoInforme').value;
        const descripcion = document.getElementById('descripcionInforme').value;

        if (!motivo) {
            this.mostrarNotificacion('Debes seleccionar un motivo.', 'warning');
            return;
        }

        await this.informarReporte(idReporte, motivo, descripcion);

        const modal = bootstrap.Modal.getInstance(document.getElementById('modalInforme'));
        modal.hide();
    }

    mostrarModalCrearIncidente(lat, lng) {
        const modalHTML = `
           <div class="modal fade" id="modalCrearIncidente" tabindex="-1">
               <div class="modal-dialog">
                   <div class="modal-content">
                       <div class="modal-header">
                           <h5 class="modal-title">Crear Incidente</h5>
                           <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                       </div>
                       <div class="modal-body">
                           <form id="formCrearIncidente">
                               <div class="mb-3">
                                   <label class="form-label">Ubicación</label>
                                   <input type="text" class="form-control" value="Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}" readonly>
                               </div>
                               <div class="mb-3">
                                   <label class="form-label">Descripción</label>
                                   <textarea class="form-control" id="descripcionIncidente" rows="3" required placeholder="Describe el incidente..."></textarea>
                               </div>
                               <div class="mb-3">
                                   <label class="form-label">Prioridad</label>
                                   <select class="form-select" id="prioridadIncidente">
                                       <option value="info">Información</option>
                                       <option value="precaucion">Precaución</option>
                                       <option value="urgente">Urgente</option>
                                   </select>
                               </div>
                               <div class="mb-3">
                                   <label class="form-label">Tipo de Incidente</label>
                                   <select class="form-select" id="tipoIncidente">
                                       <option value="1">Accidente de Tránsito</option>
                                       <option value="2">Emergencia Médica</option>
                                       <option value="3">Bloqueo de Vía</option>
                                       <option value="4">Condiciones Climáticas</option>
                                       <option value="5">Obra en Construcción</option>
                                       <option value="6">Otro</option>
                                   </select>
                               </div>
                           </form>
                       </div>
                       <div class="modal-footer">
                           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                           <button type="button" class="btn btn-primary" onclick="window.app.confirmarCrearIncidente(${lat}, ${lng})">Crear Incidente</button>
                       </div>
                   </div>
               </div>
           </div>
       `;

        const modalAnterior = document.getElementById('modalCrearIncidente');
        if (modalAnterior) modalAnterior.remove();

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = new bootstrap.Modal(document.getElementById('modalCrearIncidente'));
        modal.show();
    }

    async confirmarCrearIncidente(lat, lng) {
        const descripcion = document.getElementById('descripcionIncidente').value;
        const prioridad = document.getElementById('prioridadIncidente').value;
        const tipo = document.getElementById('tipoIncidente').value;

        if (!descripcion.trim()) {
            this.mostrarNotificacion('La descripción es obligatoria.', 'warning');
            return;
        }

        await this.crearIncidenteEnMapa(lat, lng, descripcion, prioridad, parseInt(tipo));

        const modal = bootstrap.Modal.getInstance(document.getElementById('modalCrearIncidente'));
        modal.hide();

        this.modoCreacionIncidente = false;
        const controlBtn = document.querySelector('.leaflet-control-custom');
        if (controlBtn) {
            controlBtn.style.backgroundColor = 'white';
            controlBtn.style.color = 'black';
        }
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        const colores = { success: '#198754', info: '#0dcaf0', warning: '#ffc107', danger: '#dc3545' };
        const notificacion = document.createElement('div');
        notificacion.style.cssText = `position: fixed; top: 80px; right: -300px; background-color: ${colores[tipo]}; color: white; padding: 1rem 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 9999; transition: right 0.5s ease-in-out;`;
        notificacion.textContent = mensaje;
        document.body.appendChild(notificacion);
        setTimeout(() => { notificacion.style.right = '20px'; }, 100);
        setTimeout(() => {
            notificacion.style.right = '-300px';
            setTimeout(() => notificacion.remove(), 500);
        }, 3000);
    }
}

// Variable global para acceder a la app desde onclick
window.app = null;

document.addEventListener('DOMContentLoaded', () => {
    window.app = new ViasSegurasApp();
});

// Desplazamiento suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.hasAttribute('data-bs-toggle') && this.getAttribute('data-bs-toggle') === 'modal') {
            return;
        }
        e.preventDefault();
        const href = this.getAttribute('href');

        if (!href || href === '#') {
            return;
        }
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Limpiar alertas después de 5 segundos
setTimeout(function () {
    document.querySelectorAll('.alert').forEach(function (alert) {
        if (alert.classList.contains('show')) {
            bootstrap.Alert.getOrCreateInstance(alert).close();
        }
    });
}, 5000);