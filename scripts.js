// CLASE PRINCIPAL DE LA APLICACION (VERSIÓN UNIFICADA Y FUNCIONAL)
class ViasSegurasApp {
    constructor() {
        this.mapa = null;
        this.usuario = null;
        this.todosLosReportes = [];
        this.provinciaSeleccionada = null;
        this.marcadoresMapa = [];
        this.filtrosActivos = {
            urgente: true,
            precaucion: true,
            info: true
        };
        
        this.datosProvincias = { 'San José': { lat: 9.9333, lng: -84.0833, incidentes: { urgente: 0, precaucion: 0, info: 0 }, cantones: { 'San José': ['Carmen', 'Merced', 'Hospital', 'Catedral', 'Zapote', 'San Francisco', 'Uruca', 'Mata Redonda', 'Pavas', 'Hatillo', 'San Sebastián'], 'Escazú': ['Escazú', 'San Antonio', 'San Rafael'], 'Desamparados': ['Desamparados', 'San Miguel', 'San Juan de Dios', 'San Rafael Arriba', 'San Antonio', 'Frailes', 'Patarrá'], 'Moravia': ['San Vicente', 'San Jerónimo', 'Trinidad'], 'Goicoechea': ['Guadalupe', 'San Francisco', 'Calle Blancos', 'Mata de Plátano', 'Ipís', 'Rancho Redondo', 'Purral'], 'Santa Ana': ['Santa Ana', 'Salitral', 'Pozos', 'Uruca', 'Piedades', 'Brasil'], 'Alajuelita': ['Alajuelita', 'San Josecito', 'San Antonio', 'Concepción', 'San Felipe'] } }, 'Alajuela': { lat: 10.0162, lng: -84.2163, incidentes: { urgente: 0, precaucion: 0, info: 0 }, cantones: { 'Alajuela': ['Alajuela', 'San José', 'Carrizal', 'San Antonio', 'Guácima', 'San Isidro', 'Sabanilla', 'San Rafael', 'Río Segundo', 'Desamparados', 'Turrúcares', 'Tambor', 'Garita', 'Sarapiquí'], 'San Ramón': ['San Ramón', 'Santiago', 'San Juan', 'Piedades Norte', 'Piedades Sur', 'San Rafael', 'San Isidro', 'Ángeles', 'Alfaro', 'Volio', 'Concepción'], 'Grecia': ['Grecia', 'San Isidro', 'San José', 'San Roque', 'Tacares', 'Puente de Piedra', 'Bolívar'], 'San Carlos': ['Quesada', 'Florencia', 'Buenavista', 'Aguas Zarcas', 'Venecia', 'Pital', 'La Fortuna', 'La Tigra', 'La Palmera', 'Venado', 'Cutris', 'Monterrey', 'Pocosol'] } }, 'Cartago': { lat: 9.8634, lng: -83.9194, incidentes: { urgente: 0, precaucion: 0, info: 0 }, cantones: { 'Cartago': ['Oriental', 'Occidental', 'Carmen', 'San Nicolás', 'Aguacaliente', 'Guadalupe', 'Corralillo', 'Tierra Blanca', 'Dulce Nombre', 'Llano Grande', 'Quebradilla'], 'Paraíso': ['Paraíso', 'Santiago', 'Orosi', 'Cachí', 'Llanos de Santa Lucía'], 'La Unión': ['Tres Ríos', 'San Diego', 'San Juan', 'San Rafael', 'Concepción', 'Dulce Nombre', 'San Ramón', 'Río Azul'], 'Turrialba': ['Turrialba', 'La Suiza', 'Peralta', 'Santa Cruz', 'Santa Teresita', 'Pavones', 'Tuis', 'Tayutic', 'Santa Rosa', 'Tres Equis'] } }, 'Heredia': { lat: 10.0024, lng: -84.1165, incidentes: { urgente: 0, precaucion: 0, info: 0 }, cantones: { 'Heredia': ['Heredia', 'Mercedes', 'San Francisco', 'Ulloa', 'Varablanca'], 'Barva': ['Barva', 'San Pedro', 'San Pablo', 'San Roque', 'Santa Lucía', 'San José de la Montaña'], 'Santo Domingo': ['Santo Domingo', 'San Vicente', 'San Miguel', 'Paracito', 'Santo Tomás', 'Santa Rosa', 'Tures', 'Pará'], 'San Rafael': ['San Rafael', 'San Josecito', 'Santiago', 'Ángeles', 'Concepción'], 'San Isidro': ['San Isidro', 'San José', 'Concepción', 'San Francisco'], 'Belén': ['San Antonio', 'La Ribera', 'La Asunción'], 'Flores': ['San Joaquín', 'Barrantes', 'Llorente'] } }, 'Guanacaste': { lat: 10.4285, lng: -85.3968, incidentes: { urgente: 0, precaucion: 0, info: 0 }, cantones: { 'Liberia': ['Liberia', 'Cañas Dulces', 'Mayorga', 'Nacascolo', 'Curubandé'], 'Nicoya': ['Nicoya', 'Mansión', 'San Antonio', 'Quebrada Honda', 'Sámara', 'Nosara', 'Belén de Nosarita'], 'Santa Cruz': ['Santa Cruz', 'Bolsón', 'Veintisiete de Abril', 'Tempate', 'Cartagena', 'Cuajiniquil', 'Diriá', 'Cabo Velas', 'Tamarindo'], 'Bagaces': ['Bagaces', 'La Fortuna', 'Mogote', 'Río Naranjo'], 'Carrillo': ['Filadelfia', 'Palmira', 'Sardinal', 'Belén'], 'Cañas': ['Cañas', 'Palmira', 'San Miguel', 'Bebedero', 'Porozal'] } }, 'Puntarenas': { lat: 9.9763, lng: -84.8388, incidentes: { urgente: 0, precaucion: 0, info: 0 }, cantones: { 'Puntarenas': ['Puntarenas', 'Pitahaya', 'Chomes', 'Lepanto', 'Paquera', 'Manzanillo', 'Guacimal', 'Barranca', 'Monte Verde', 'Isla del Coco', 'Cóbano', 'Chacarita', 'Chira', 'Acapulco', 'El Roble', 'Arancibia'], 'Esparza': ['Espíritu Santo', 'San Juan Grande', 'Macacona', 'San Rafael', 'San Jerónimo', 'Caldera'], 'Buenos Aires': ['Buenos Aires', 'Volcán', 'Potrero Grande', 'Boruca', 'Pilas', 'Colinas', 'Chánguena', 'Biolley', 'Brunka'], 'Montes de Oro': ['Miramar', 'La Unión', 'San Isidro'], 'Osa': ['Puerto Cortés', 'Palmar', 'Sierpe', 'Bahía Ballena', 'Piedras Blancas', 'Bahía Drake'] } }, 'Limón': { lat: 9.9907, lng: -83.0355, incidentes: { urgente: 0, precaucion: 0, info: 0 }, cantones: { 'Limón': ['Limón', 'Valle La Estrella', 'Río Blanco', 'Matama'], 'Pococí': ['Guápiles', 'Jiménez', 'Rita', 'Roxana', 'Cariari', 'Colorado', 'La Colonia'], 'Siquirres': ['Siquirres', 'Pacuarito', 'Florida', 'Germania', 'Cairo', 'Alegría'], 'Talamanca': ['Bratsi', 'Sixaola', 'Cahuita', 'Telire'], 'Matina': ['Matina', 'Batán', 'Carrandi'], 'Guácimo': ['Guácimo', 'Mercedes', 'Pocora', 'Río Jiménez', 'Duacarí'] } } };

        this.BASE_URL = 'http://localhost/Proyecto/';
        this.dom = {
            botonLogin: document.getElementById('botonLogin'),
            menuUsuario: document.getElementById('menuUsuario'),
            nombreUsuario: document.getElementById('nombreUsuario'),
            btnCerrarSesion: document.getElementById('btnCerrarSesion'),
            formularioLogin: document.getElementById('formularioLogin'),
            formularioRegistro: document.getElementById('formularioRegistro'),
            modalLogin: null,
            modalRegistro: null,
        };
        this.inicializar();
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
        document.getElementById('btnEnviarReporte')?.addEventListener('click', () => this.enviarReporte());
        document.getElementById('inputImagen')?.addEventListener('change', (e) => this.previsualizarImagen(e));
        document.getElementById('selectProvincia')?.addEventListener('change', (e) => this.cambiarProvincia(e));
        document.getElementById('selectCanton')?.addEventListener('change', (e) => this.cambiarCanton(e));
        
        this.dom.formularioLogin?.addEventListener('submit', (e) => this.iniciarSesion(e));
        this.dom.formularioRegistro?.addEventListener('submit', (e) => this.registrarUsuario(e));
        this.dom.btnCerrarSesion?.addEventListener('click', () => this.cerrarSesion());
        
        document.querySelectorAll('.navbar-nav .nav-link[data-section], .btn[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.mostrarSeccion(e.currentTarget.dataset.section);
            });
        });
        
        // Se mantienen los listeners para los filtros de prioridad
        document.querySelectorAll('.filtro-tipo').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.handleFiltroTipoChange(e));
        });
    }

    // FUNCIÓN DE REPORTE (TOMADA DE LA VERSIÓN SIMPLE Y FUNCIONAL)
    async enviarReporte() {
        const descripcion = document.getElementById('textoReporte').value;
        const prioridad = document.getElementById('prioridadReporte').value;
        const provincia = document.getElementById('selectProvincia').value;
        const canton = document.getElementById('selectCanton').value;
        const distrito = document.getElementById('selectDistrito').value;
        const imagenInput = document.getElementById('inputImagen');

        if (!this.usuario) {
            this.mostrarNotificacion('Debes iniciar sesión para poder reportar.', 'danger');
            this.dom.modalLogin?.show();
            return;
        }

        // VALIDACIÓN SIMPLE Y FUNCIONAL (de scripts copy.js)
        if (!descripcion.trim() || !provincia || !canton) {
            this.mostrarNotificacion('Por favor, completa la descripción, provincia y cantón.', 'warning');
            return;
        }

        const formData = new FormData();
        formData.append('descripcion', descripcion);
        formData.append('prioridad', prioridad);
        formData.append('provincia', provincia);
        formData.append('canton', canton);
        formData.append('distrito', distrito);
        formData.append('id_usuario', this.usuario.id); // Aseguramos enviar el ID
        if (imagenInput.files.length > 0) formData.append('imagen', imagenInput.files[0]);
        
        // Se mantiene la lógica de añadir coordenadas de la provincia
        const datosProvincia = this.datosProvincias[provincia];
        if (datosProvincia) {
            formData.append('latitud', datosProvincia.lat);
            formData.append('longitud', datosProvincia.lng);
        }

        try {
            const response = await fetch(this.BASE_URL + 'create_report.php', { method: 'POST', body: formData });
            const result = await response.json();
            if (response.ok && result.success) {
                this.mostrarNotificacion(result.message, 'success');
                this.limpiarFormulario();
                // Se llama a la función de carga de la estructura avanzada
                this.cargarDatosIniciales();
            } else {
                this.mostrarNotificacion('Error: ' + (result.message || 'No se pudo enviar.'), 'danger');
            }
        } catch (error) {
            console.error('Error de red:', error);
            this.mostrarNotificacion('Ocurrió un error de red.', 'danger');
        }
    }

    limpiarFormulario() {
        document.getElementById('textoReporte').value = '';
        document.getElementById('previewImagen').innerHTML = '';
        document.getElementById('inputImagen').value = '';
        document.getElementById('prioridadReporte').value = 'info';
        document.getElementById('selectProvincia').value = '';
        this.cambiarProvincia({ target: { value: '' } });
    }
    
    // ESTRUCTURA AVANZADA DE RENDERIZADO Y FILTRADO (de scripts.js)
    async cargarDatosIniciales() {
        const feedContainer = document.getElementById('feedReportes');
        if (feedContainer) feedContainer.innerHTML = '<p class="text-center texto-muted">Cargando reportes...</p>';
        try {
            const response = await fetch(this.BASE_URL + 'get_reports.php');
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            
            this.todosLosReportes = await response.json();
            this.procesarYRenderizarTodo();

        } catch (error) {
            console.error('Error fatal al cargar reportes:', error);
            if (feedContainer) feedContainer.innerHTML = '<p class="text-center text-danger">No se pudieron cargar los reportes iniciales.</p>';
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

        reportesFiltrados = reportesFiltrados.filter(r => this.filtrosActivos[r.prioridad.toLowerCase()]);

        this.renderizarFeed(reportesFiltrados);
        this.actualizarMapaConReportes(reportesFiltrados);
    }
    
    renderizarFeed(reportes) {
        const feedContainer = document.getElementById('feedReportes');
        if (!feedContainer) return;
        feedContainer.innerHTML = '';
        if (reportes.length === 0) {
            feedContainer.innerHTML = '<p class="text-center texto-muted">No hay reportes que coincidan con los filtros seleccionados.</p>';
            return;
        }
        reportes.forEach(report => {
            const reportHTML = `<div class="tarjeta-info mb-3"><div class="d-flex align-items-start mb-2"><div class="avatar-usuario me-3"><i class="fas fa-user-circle"></i></div><div class="flex-grow-1"><h6 class="mb-0">${report.usuario_nombre} ${report.usuario_apellido}</h6><small class="texto-muted">${new Date(report.created_at).toLocaleString()} &middot; ${report.provincia}, ${report.canton}</small></div></div><p class="mb-2">${report.descripcion}</p>${report.imagen ? `<img src="${this.BASE_URL}${report.imagen}" class="img-fluid rounded mb-2" alt="Imagen del reporte">` : ''}<div class="d-flex justify-content-between align-items-center"><div><span class="badge-filtro ${report.prioridad.toLowerCase()}">${report.prioridad}</span><span class="badge bg-secondary">${report.tipo_incidente_nombre || 'General'}</span></div></div></div>`;
            feedContainer.insertAdjacentHTML('beforeend', reportHTML);
        });
    }

    procesarDatosDeReportes(reportes) {
        for (const provincia in this.datosProvincias) {
            this.datosProvincias[provincia].incidentes = { urgente: 0, precaucion: 0, info: 0 };
        }
        reportes.forEach(reporte => {
            const prioridadLower = reporte.prioridad.toLowerCase();
            if (this.datosProvincias[reporte.provincia] && this.datosProvincias[reporte.provincia].incidentes[prioridadLower] !== undefined) {
                this.datosProvincias[reporte.provincia].incidentes[prioridadLower]++;
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
            itemProvincia.className = `item-provincia ${this.provinciaSeleccionada === provincia ? 'activa' : ''}`;
            itemProvincia.innerHTML = `<div class="nombre-provincia"><span>${provincia}</span><span class="contador-incidentes">${totalProvincia}</span></div>`;
            itemProvincia.addEventListener('click', () => this.handleProvinciaClick(provincia));
            contenedor.appendChild(itemProvincia);
        });
    }
    
    handleProvinciaClick(provincia) {
        this.provinciaSeleccionada = this.provinciaSeleccionada === provincia ? null : provincia;
        this.aplicarFiltrosYRenderizar();
        this.actualizarPanelProvincias(); // Re-render para actualizar la clase 'activa'
    }
    
    handleFiltroTipoChange(evento) {
        const filtro = evento.target.dataset.filtro;
        const estaActivo = evento.target.checked;
        this.filtrosActivos[filtro] = estaActivo;
        this.aplicarFiltrosYRenderizar();
    }
    
    actualizarMapaConReportes(reportes) {
        if (!this.mapa) return;
        this.marcadoresMapa.forEach(marcador => this.mapa.removeLayer(marcador));
        this.marcadoresMapa = [];
        let latLngs = [];
        reportes.forEach(reporte => {
            if (reporte.latitud && reporte.longitud && parseFloat(reporte.latitud) !== 0) {
                const lat = parseFloat(reporte.latitud);
                const lng = parseFloat(reporte.longitud);
                const latLng = [lat, lng];
                const iconColor = reporte.prioridad.toLowerCase() === 'urgente' ? 'red' : reporte.prioridad.toLowerCase() === 'precaucion' ? 'orange' : 'blue';
                const customIcon = L.icon({
                    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColor}.png`,
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
                });
                const marcador = L.marker(latLng, { icon: customIcon })
                    .addTo(this.mapa)
                    .bindPopup(`<b>${reporte.tipo_incidente_nombre || 'Reporte'}</b><br><small>${reporte.provincia}, ${reporte.canton}</small><hr style="margin: 5px 0;">${reporte.descripcion.substring(0, 70)}...`);
                this.marcadoresMapa.push(marcador);
                latLngs.push(latLng);
            }
        });
        if (latLngs.length > 0) {
            this.mapa.fitBounds(latLngs, { padding: [50, 50], maxZoom: 14 });
        } else if (!this.provinciaSeleccionada) {
            this.mapa.setView([9.7489, -83.7534], 8);
        }
        this.mapa.invalidateSize();
    }
    
    inicializarMapa() {
        if (document.getElementById('mapaLeaflet')) {
            this.mapa = L.map('mapaLeaflet').setView([9.7489, -83.7534], 8);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(this.mapa);
        }
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
            const response = await fetch(this.BASE_URL + 'login.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
            const data = await response.json();
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
            this.mostrarNotificacion('Ocurrió un error. Inténtalo de nuevo.', 'danger');
        }
    }

    async registrarUsuario(evento) {
        evento.preventDefault();
        const nombre = document.getElementById('nombreRegistro').value;
        const apellido = document.getElementById('apellidoRegistro').value;
        const email = document.getElementById('emailRegistro').value;
        const password = document.getElementById('passwordRegistro').value;
        const confirmPassword = document.getElementById('confirmPasswordRegistro').value;
        const termsCheck = document.getElementById('termsCheckRegistro').checked;
        if (password !== confirmPassword) { this.mostrarNotificacion('Las contraseñas no coinciden.', 'warning'); return; }
        if (!termsCheck) { this.mostrarNotificacion('Debes aceptar los Términos y Condiciones.', 'warning'); return; }
        try {
            const response = await fetch(this.BASE_URL + 'registro.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre, apellido, email, password }) });
            const data = await response.json();
            if (response.ok && data.success) {
                this.mostrarNotificacion(data.message + ' Ahora puedes iniciar sesión.', 'success');
                this.dom.modalRegistro?.hide();
                this.dom.modalLogin?.show();
            } else {
                this.mostrarNotificacion('Error al registrar: ' + (data.message || 'Hubo un problema.'), 'danger');
            }
        } catch (error) {
            this.mostrarNotificacion('Ocurrió un error. Inténtalo de nuevo.', 'danger');
        }
    }

    async cerrarSesion() {
        try {
            const response = await fetch(this.BASE_URL + 'logout.php', { method: 'POST' });
            const data = await response.json();
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
            this.mostrarNotificacion('Ocurrió un error. Inténtalo de nuevo.', 'danger');
        }
    }

    cargarEstadoUsuario() {
        const storedUser = localStorage.getItem('usuarioViasSeguras');
        if (storedUser) { this.usuario = JSON.parse(storedUser); } else { this.usuario = null; }
        this.actualizarUIUsuario();
    }

    actualizarUIUsuario() {
        if (this.usuario) {
            this.dom.botonLogin.classList.add('d-none');
            this.dom.menuUsuario.classList.remove('d-none');
            this.dom.nombreUsuario.textContent = this.usuario.nombre;
            document.getElementById('nombrePerfil').textContent = `${this.usuario.nombre} ${this.usuario.apellido}`;
            document.getElementById('emailPerfil').textContent = this.usuario.email;
        } else {
            this.dom.botonLogin.classList.remove('d-none');
            this.dom.menuUsuario.classList.add('d-none');
            document.getElementById('nombrePerfil').textContent = 'Invitado';
            document.getElementById('emailPerfil').textContent = 'Inicia sesión para ver tu perfil';
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

document.addEventListener('DOMContentLoaded', () => {
    new ViasSegurasApp();
});