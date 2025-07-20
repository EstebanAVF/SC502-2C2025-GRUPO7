// CLASE PRINCIPAL DE LA APLICACION
class ViasSegurasApp {
    constructor() {
        this.mapa = null;
        this.reportes = [];
        this.usuario = null; 
        this.contadorReportes = 0;
        this.provinciaSeleccionada = null;
        this.marcadores = [];
        this.datosProvincias = {
            'San José': { 
                lat: 9.9333, 
                lng: -84.0833, 
                incidentes: { urgente: 0, precaucion: 0, info: 0 },
                cantones: {
                    'San José': ['Carmen', 'Merced', 'Hospital', 'Catedral', 'Zapote', 'San Francisco', 'Uruca', 'Mata Redonda', 'Pavas', 'Hatillo', 'San Sebastián', 'Rohmoser'],
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
        // URL base parascripts PHP 
        this.BASE_URL = 'http://localhost/Proyecto/'; 

        // Referencias a elementos de la UI 
        this.dom = {
            // Navbar elements
            botonLogin: document.getElementById('botonLogin'),
            menuUsuario: document.getElementById('menuUsuario'),
            dropdownUsuario: document.getElementById('dropdownUsuario'),
            nombreUsuario: document.getElementById('nombreUsuario'), 
            btnConfiguracion: document.getElementById('btnConfiguracion'),
            btnCerrarSesion: document.getElementById('btnCerrarSesion'),
            
            // Forms within Modals
            formularioLogin: document.getElementById('formularioLogin'),
            formularioRegistro: document.getElementById('formularioRegistro'),

            // Modal instances 
            modalLogin: null, 
            modalRegistro: null, 

            // Main sections of the app
            seccionInicio: document.getElementById('inicio'),
            mainAppContent: document.getElementById('mainAppContent'),
            seccionReportes: document.getElementById('reportes'),
            seccionMapa: document.getElementById('mapa'),
            seccionInformes: document.getElementById('informes'), 
            seccionEstadisticas: document.getElementById('estadisticas'), 
        };

        this.inicializar();
    }

    // Inicializacion de la aplicacion
    inicializar() {
        this.inicializarMapa();
        this.configurarEventos();
        this.inicializarSelectoresUbicacion();
        this.cargarReportesEjemplo();
        this.actualizarEstadisticas();
        this.inicializarPanelProvincias();
        this.cargarEstadoUsuario(); 
        this.configurarModales(); 
        this.mostrarSeccion('inicio'); 
    }

    // CONFIGURACION DEL MAPA
    inicializarMapa() {
        // Inicializar el mapa centrado en Costa Rica
        this.mapa = L.map('mapaLeaflet').setView([9.7489, -83.7534], 8);

        // Añadir capa de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(this.mapa);

        // Añadir marcadores de ejemplo
        this.agregarMarcadoresEjemplo();
    }

    agregarMarcadoresEjemplo() {
        const ejemplos = [
            {lat: 9.9333, lng: -84.0833, titulo: 'Accidente en San José', tipo: 'urgente', provincia: 'San José'},
            {lat: 10.0, lng: -84.2, titulo: 'Construcción en Ruta 27', tipo: 'precaucion', provincia: 'Alajuela'},
            {lat: 9.5, lng: -83.8, titulo: 'Lluvia intensa', tipo: 'info', provincia: 'Cartago'}
        ];

        ejemplos.forEach(ej => {
            const icono = this.obtenerIconoPorTipo(ej.tipo);
            const marcador = L.marker([ej.lat, ej.lng], {icon: icono})
                .addTo(this.mapa)
                .bindPopup(`<b>${ej.titulo}</b><br><small>Reportado hace 30 min</small>`);
            
            this.marcadores.push({ marcador, provincia: ej.provincia, tipo: ej.tipo });
            
            // Actualizar contador de provincia
            if (this.datosProvincias[ej.provincia]) {
                this.datosProvincias[ej.provincia].incidentes[ej.tipo]++;
            }
        });
        
        this.actualizarPanelProvincias();
    }

    obtenerIconoPorTipo(tipo) {
        const colores = {
            urgente: 'var(--color-secundario)',
            precaucion: 'var(--color-advertencia)',
            info: 'var(--color-info)'
        };

        return L.divIcon({
            html: `<div style="background-color: ${colores[tipo]}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [20, 20],
            className: 'marcador-personalizado'
        });
    }

    // GESTION DE SECCIONES
    mostrarSeccion(seccionId) {
        // Ocultar todas las secciones principales
        const allSections = document.querySelectorAll('section.seccion-hero, section.seccion-app, section.seccion-estadisticas');
        allSections.forEach(sec => sec.classList.add('d-none'));

        // Ocultar/mostrar el contenedor principal de la app 
        if (seccionId === 'inicio') {
            this.dom.seccionInicio.classList.remove('d-none');
            this.dom.mainAppContent.classList.add('d-none');
            this.dom.seccionEstadisticas.classList.add('d-none');
        } else {
            this.dom.seccionInicio.classList.add('d-none');
            this.dom.mainAppContent.classList.remove('d-none');

            // Mostrar la secciOn especIfica dentro del mainAppContent
            switch (seccionId) {
                case 'reportes':
                    this.dom.seccionReportes.classList.remove('d-none');
                    break;
                case 'mapa':
                    this.dom.seccionMapa.classList.remove('d-none');
                    // Asegurarse de invalidar el tamaño del mapa si estaba oculto
                    if (this.mapa) this.mapa.invalidateSize();
                    break;
                case 'informes':
                    this.dom.seccionInformes.classList.remove('d-none');
                    break;
                case 'estadisticas': 
                    this.dom.seccionEstadisticas.classList.remove('d-none');
                    this.dom.mainAppContent.classList.add('d-none'); 
                    break;
            }
        }
        // Actualizar el estado activo de los enlaces de la navbar
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            if (link.dataset.section === seccionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }


    // CONFIGURACION DE EVENTOS
    configurarEventos() {
        document.getElementById('btnEnviarReporte').addEventListener('click', () => this.enviarReporte());
        document.getElementById('textoReporte').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.enviarReporte();
            }
        });

        // Evento de imagen
        document.getElementById('inputImagen').addEventListener('change', (e) => this.previsualizarImagen(e));

        // Evento de modo anonimo
        document.getElementById('modoAnonimo').addEventListener('change', (e) => this.cambiarModoAnonimo(e));

        // Eventos de selectores de ubicacion
        document.getElementById('selectProvincia').addEventListener('change', (e) => this.cambiarProvincia(e));
        document.getElementById('selectCanton').addEventListener('change', (e) => this.cambiarCanton(e));

        // Eventos de autenticacion
        if (this.dom.formularioLogin) {
            this.dom.formularioLogin.addEventListener('submit', (e) => this.iniciarSesion(e));
        }
        if (this.dom.formularioRegistro) {
            this.dom.formularioRegistro.addEventListener('submit', (e) => this.registrarUsuario(e));
        }
        if (this.dom.btnCerrarSesion) {
            this.dom.btnCerrarSesion.addEventListener('click', () => this.cerrarSesion());
        }
        if (this.dom.btnConfiguracion) {
            this.dom.btnConfiguracion.addEventListener('click', (e) => {
                e.preventDefault();
                this.mostrarNotificacion('Funcionalidad de configuración en desarrollo...', 'info');
            });
        }
        
        // Eventos de navegacion por secciones
        document.querySelectorAll('.navbar-nav .nav-link[data-section], .seccion-hero .btn[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = e.currentTarget.dataset.section;
                this.mostrarSeccion(sectionId);
            });
        });

        // Eventos de filtros
        document.getElementById('filtroUrgente').addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filtroPrecaucion').addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filtroInfo').addEventListener('change', () => this.aplicarFiltros());

        // Navegacion suave
        this.configurarNavegacionSuave();
    }

    configurarNavegacionSuave() {
        document.querySelectorAll('a[href^="#"]').forEach(enlace => {
            enlace.addEventListener('click', function(e) {
                if (this.hasAttribute('data-bs-toggle') || this.hasAttribute('data-section')) return;
                
                e.preventDefault();
                const destino = document.querySelector(this.getAttribute('href'));
                if (destino) {
                    destino.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // CONFIGURACION DE MODALES DE BOOTSTRAP
    configurarModales() {
        // Obteniendo instancias de los modales de Bootstrap
        // Esto permite ocultarlos/mostrarlos programaticamente
        this.dom.modalLogin = new bootstrap.Modal(document.getElementById('modalLogin'));
        this.dom.modalRegistro = new bootstrap.Modal(document.getElementById('modalRegistro'));

        // Evento para que al cerrar el modal de registro, no intente abrir el de login automaticamente si fue cerrado manualmente.
        document.getElementById('modalRegistro').addEventListener('hidden.bs.modal', () => {
            // No hacer nada si el cierre fue por cambio de modal (data-bs-dismiss="modal" ya maneja esto)
            // Esto es mas para evitar que se abra el de login si el usuario cierra el de registro con el botón X
        });
    }

    // GESTIÓN DE SELECTORES DE UBICACIÓN
    inicializarSelectoresUbicacion() {
        const selectProvincia = document.getElementById('selectProvincia');
        
        // Llenar provincias
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
        
        // Limpiar cantones y distritos
        selectCanton.innerHTML = '<option value="">Cantón *</option>';
        selectDistrito.innerHTML = '<option value="">Distrito</option>';
        
        if (provincia && this.datosProvincias[provincia].cantones) {
            selectCanton.disabled = false;
            
            // Llenar cantones
            Object.keys(this.datosProvincias[provincia].cantones).forEach(canton => {
                const option = document.createElement('option');
                option.value = canton;
                option.textContent = canton;
                selectCanton.appendChild(option);
            });
        } else {
            selectCanton.disabled = true;
            selectDistrito.disabled = true;
        }
    }

    cambiarCanton(evento) {
        const provincia = document.getElementById('selectProvincia').value;
        const canton = evento.target.value;
        const selectDistrito = document.getElementById('selectDistrito');
        
        // Limpiar distritos
        selectDistrito.innerHTML = '<option value="">Distrito</option>';
        
        if (provincia && canton && this.datosProvincias[provincia].cantones[canton]) {
            selectDistrito.disabled = false;
            
            // Llenar distritos
            this.datosProvincias[provincia].cantones[canton].forEach(distrito => {
                const option = document.createElement('option');
                option.value = distrito;
                option.textContent = distrito;
                selectDistrito.appendChild(option);
            });
        } else {
            selectDistrito.disabled = true;
        }
    }

    // GESTION DE REPORTES
    enviarReporte() {
        // Asegurarse de que el usuario esté logueado para reportar, si no es anónimo
        const esAnonimo = document.getElementById('modoAnonimo').checked;
        if (!esAnonimo && !this.usuario) {
            this.mostrarNotificacion('Debes iniciar sesión para enviar un reporte (o marca la opción Anónimo).', 'danger');
            this.dom.modalLogin.show(); // Abrir el modal de login
            return;
        }

        const texto = document.getElementById('textoReporte').value.trim();
        const provincia = document.getElementById('selectProvincia').value;
        const canton = document.getElementById('selectCanton').value;
        
        if (!texto) {
            this.mostrarNotificacion('Por favor escribe algo sobre el incidente', 'warning');
            return;
        }
        
        if (!provincia || !canton) {
            this.mostrarNotificacion('Por favor selecciona provincia y cantón', 'warning');
            return;
        }

        const prioridad = document.getElementById('prioridadReporte').value;
        const distrito = document.getElementById('selectDistrito').value;
        const tieneImagen = document.getElementById('previewImagen').querySelector('img') !== null;

        const nuevoReporte = {
            id: Date.now(),
            texto: texto,
            autor: esAnonimo ? 'Usuario Anónimo' : (this.usuario?.nombre || 'Usuario'),
            esAnonimo: esAnonimo,
            prioridad: prioridad,
            tiempo: 'ahora mismo',
            likes: 0,
            comentarios: 0,
            imagen: tieneImagen ? document.getElementById('previewImagen').querySelector('img').src : null,
            provincia: provincia,
            canton: canton,
            distrito: distrito
        };

        this.agregarReporte(nuevoReporte);
        this.limpiarFormulario();
        this.actualizarEstadisticas();
        
        // Actualizar datos de provincia
        this.datosProvincias[provincia].incidentes[prioridad]++;
        this.actualizarPanelProvincias();
        
        // Agregar marcador al mapa con ubicación más precisa
        const coords = this.datosProvincias[provincia];
        const icono = this.obtenerIconoPorTipo(prioridad);
        const marcador = L.marker([coords.lat + (Math.random() - 0.5) * 0.05, coords.lng + (Math.random() - 0.5) * 0.05], {icon: icono})
            .addTo(this.mapa)
            .bindPopup(`
                <b>${texto.substring(0, 50)}...</b><br>
                <small>${provincia} - ${canton}${distrito ? ' - ' + distrito : ''}</small><br>
                <small class="text-muted">Hace un momento</small>
            `);
        
        this.marcadores.push({ marcador, provincia: provincia, canton: canton, tipo: prioridad });
        
        this.mostrarNotificacion('¡Reporte enviado exitosamente!', 'success');
    }

    agregarReporte(reporte) {
        this.reportes.unshift(reporte);
        const contenedorReportes = document.getElementById('feedReportes');
        const elementoReporte = this.crearElementoReporte(reporte);
        contenedorReportes.insertBefore(elementoReporte, contenedorReportes.firstChild);
        this.contadorReportes++;
    }

    crearElementoReporte(reporte) {
        const div = document.createElement('div');
        div.className = 'item-reporte';
        div.innerHTML = `
            <div class="d-flex">
                <div class="avatar-usuario me-3" style="${reporte.esAnonimo ? 'background: linear-gradient(135deg, var(--fondo-tarjeta), var(--texto-muted));' : ''}">
                    ${reporte.esAnonimo ? '<i class="fas fa-user-secret"></i>' : reporte.autor.charAt(0).toUpperCase()}
                </div>
                <div class="flex-grow-1">
                    <div class="cabecera-reporte">
                        <div class="info-usuario">
                            <span class="nombre-usuario">${reporte.autor}</span>
                            <span class="tiempo-reporte">${reporte.tiempo}</span>
                        </div>
                        <span class="etiqueta-prioridad prioridad-${reporte.prioridad}">
                            ${this.obtenerTextoPrioridad(reporte.prioridad)}
                        </span>
                    </div>
                    <div class="contenido-reporte">${reporte.texto}</div>
                    ${reporte.imagen ? `<img src="${reporte.imagen}" class="img-fluid rounded mb-3" style="max-height: 300px;">` : ''}
                    <div class="acciones-reporte">
                        <button class="btn-accion" onclick="app.darLike(${reporte.id})">
                            <i class="fas fa-thumbs-up"></i>
                            <span>${reporte.likes}</span>
                        </button>
                        <button class="btn-accion">
                            <i class="fas fa-comment"></i>
                            <span>${reporte.comentarios}</span>
                        </button>
                        <button class="btn-accion">
                            <i class="fas fa-share"></i>
                            Compartir
                        </button>
                    </div>
                </div>
            </div>
        `;
        return div;
    }

    obtenerTextoPrioridad(prioridad) {
        const textos = {
            urgente: '🚨 Urgente',
            precaucion: '⚠️ Precaución',
            info: 'ℹ️ Información'
        };
        return textos[prioridad] || 'Información';
    }

    darLike(reporteId) {
        // Lógica de like
        // -----------------------------------------------------------QUEDA COMO PREVISTA 
        const reporte = this.reportes.find(r => r.id === reporteId);
        if (reporte) {
            reporte.likes++;
            this.mostrarNotificacion('¡Gracias por tu like!', 'info');
           
        }
    }

    // GESTION DE IMAGENES
    previsualizarImagen(evento) {
        const archivo = evento.target.files[0];
        if (archivo) {
            const lector = new FileReader();
            lector.onload = (e) => {
                const contenedorPreview = document.getElementById('previewImagen');
                contenedorPreview.innerHTML = `<img src="${e.target.result}" class="img-fluid rounded">`;
                contenedorPreview.style.display = 'block';
            };
            lector.readAsDataURL(archivo);
        }
    }

    // MODO ANONIMO
    cambiarModoAnonimo(evento) {
        const avatar = document.getElementById('avatarUsuario');
        if (evento.target.checked) {
            avatar.innerHTML = '<i class="fas fa-user-secret"></i>';
            avatar.style.background = 'linear-gradient(135deg, var(--fondo-tarjeta), var(--texto-muted))'; // Usar vars CSS
        } else {
            avatar.innerHTML = '<i class="fas fa-user"></i>';
            avatar.style.background = 'linear-gradient(135deg, var(--color-primario), var(--color-info))'; // Usar vars CSS
        }
    }

    // GESTION DE AUTENTICACION 
    async iniciarSesion(evento) {
        evento.preventDefault();
        const email = document.getElementById('emailLogin').value;
        const password = document.getElementById('passwordLogin').value;

        try {
            const response = await fetch(this.BASE_URL + 'login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                this.usuario = data.user; // Almacena el objeto completo del usuario
                localStorage.setItem('usuarioViasSeguras', JSON.stringify(this.usuario)); // Guarda el objeto completo
                this.actualizarUIUsuario();
                this.dom.modalLogin.hide(); // Oculta el modal

                this.mostrarNotificacion(`¡Bienvenido, ${this.usuario.nombre}!`, 'success');
                this.mostrarSeccion('reportes'); // Llevar al usuario al feed de reportes
                document.getElementById('emailLogin').value = ''; // Limpiar campos
                document.getElementById('passwordLogin').value = '';
            } else {
                this.mostrarNotificacion('Error al iniciar sesión: ' + (data.message || 'Credenciales inválidas.'), 'danger');
            }
        } catch (error) {
            console.error('Error de red o del servidor al iniciar sesión:', error);
            this.mostrarNotificacion('Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.', 'danger');
        }
    }

    async registrarUsuario(evento) {
        evento.preventDefault();
        const nombre = document.getElementById('nombreRegistro').value;
        const apellido = document.getElementById('apellidoRegistro').value; // Asegúrate que existe en HTML
        const email = document.getElementById('emailRegistro').value;
        const password = document.getElementById('passwordRegistro').value;
        const confirmPassword = document.getElementById('confirmPasswordRegistro').value; // Asegúrate que existe en HTML
        const termsCheck = document.getElementById('termsCheckRegistro').checked; // Asegúrate que existe en HTML

        if (password !== confirmPassword) {
            this.mostrarNotificacion('Las contraseñas no coinciden.', 'warning');
            return;
        }
        if (!termsCheck) {
            this.mostrarNotificacion('Debes aceptar los Términos y Condiciones.', 'warning');
            return;
        }

        try {
            const response = await fetch(this.BASE_URL + 'registro.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, apellido, email, password }) // Enviar 'nombre' y 'apellido'
            });

            const data = await response.json();

            if (response.ok && data.success) {
                this.mostrarNotificacion(data.message + ' Ahora puedes iniciar sesión.', 'success');
                this.dom.modalRegistro.hide();
                this.dom.modalLogin.show(); // Abrir modal de login tras registro exitoso
                document.getElementById('nombreRegistro').value = ''; // Limpiar campos
                document.getElementById('apellidoRegistro').value = '';
                document.getElementById('emailRegistro').value = '';
                document.getElementById('passwordRegistro').value = '';
                document.getElementById('confirmPasswordRegistro').value = '';
                document.getElementById('termsCheckRegistro').checked = false;

            } else {
                this.mostrarNotificacion('Error al registrar: ' + (data.message || 'Hubo un problema con el registro.'), 'danger');
            }
        } catch (error) {
            console.error('Error de red o del servidor al registrar:', error);
            this.mostrarNotificacion('Ocurrió un error al intentar registrarte. Por favor, inténtalo de nuevo más tarde.', 'danger');
        }
    }

    async cerrarSesion() {
        try {
            const response = await fetch(this.BASE_URL + 'logout.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                this.usuario = null; // Limpiar el objeto de usuario en la app
                localStorage.removeItem('usuarioViasSeguras'); // Limpiar de localStorage
                this.actualizarUIUsuario(); // Actualizar la UI a estado "invitado"
                this.mostrarNotificacion(data.message, 'info');
                this.mostrarSeccion('inicio'); // Volver a la página de inicio
            } else {
                this.mostrarNotificacion('Error al cerrar sesión: ' + (data.message || 'No se pudo cerrar la sesión.'), 'danger');
            }
        } catch (error) {
            console.error('Error de red o del servidor al cerrar sesión:', error);
            this.mostrarNotificacion('Ocurrió un error al intentar cerrar sesión. Por favor, inténtalo de nuevo más tarde.', 'danger');
        }
    }

    // Cargar estado del usuario desde localStorage al iniciar la aplicacion
    cargarEstadoUsuario() {
        const storedUser = localStorage.getItem('usuarioViasSeguras');
        if (storedUser) {
            try {
                this.usuario = JSON.parse(storedUser);
                this.actualizarUIUsuario(); // Actualizar UI si hay un usuario guardado
            } catch (e) {
                console.error("Error al parsear usuario de localStorage", e);
                localStorage.removeItem('usuarioViasSeguras'); // Limpiar dato corrupto
                this.usuario = null;
                this.actualizarUIUsuario();
            }
        } else {
            this.usuario = null;
            this.actualizarUIUsuario(); // Asegurar que la UI esté en modo invitado
        }
    }

    actualizarUIUsuario() {
        // Actualizar elementos de la barra de navegacion
        if (this.usuario) {
            this.dom.botonLogin.classList.add('d-none');
            this.dom.menuUsuario.classList.remove('d-none');
            this.dom.nombreUsuario.textContent = this.usuario.nombre; 
            
            // Actualizar panel lateral de perfil si existe
            const nombrePerfil = document.getElementById('nombrePerfil');
            const emailPerfil = document.getElementById('emailPerfil');
            const puntosUsuario = document.getElementById('puntosUsuario');
            const rangoUsuario = document.getElementById('rangoUsuario');
            const avatarUsuario = document.getElementById('avatarUsuario'); // Avatar del formulario de reporte
            
            if (nombrePerfil) nombrePerfil.textContent = this.usuario.nombre + ' ' + (this.usuario.apellido || '');
            if (emailPerfil) emailPerfil.textContent = this.usuario.email;
            // Si la BD devuelve puntos y rango, actualizarlos aquí
            if (puntosUsuario) puntosUsuario.textContent = this.usuario.points || 0; 
            if (rangoUsuario) rangoUsuario.textContent = this.usuario.user_rank || 'Novato'; 

            // Actualizar avatar del formulario de reporte
            if (avatarUsuario) {
                avatarUsuario.innerHTML = this.usuario.nombre.charAt(0).toUpperCase();
                avatarUsuario.style.background = 'linear-gradient(135deg, var(--color-primario), var(--color-info))';
            }

            // Si el modo anónimo está marcado al iniciar sesión, desmarcarlo
            const modoAnonimoCheckbox = document.getElementById('modoAnonimo');
            if (modoAnonimoCheckbox && modoAnonimoCheckbox.checked) {
                modoAnonimoCheckbox.checked = false;
                this.cambiarModoAnonimo({ target: modoAnonimoCheckbox }); // Llama a la función para actualizar avatar
            }

        } else {
            this.dom.botonLogin.classList.remove('d-none');
            this.dom.menuUsuario.classList.add('d-none');
            this.dom.nombreUsuario.textContent = 'Usuario'; // Restablece texto por defecto
            
            // Restablecer panel lateral de perfil
            const nombrePerfil = document.getElementById('nombrePerfil');
            const emailPerfil = document.getElementById('emailPerfil');
            const puntosUsuario = document.getElementById('puntosUsuario');
            const rangoUsuario = document.getElementById('rangoUsuario');
            const avatarUsuario = document.getElementById('avatarUsuario');

            if (nombrePerfil) nombrePerfil.textContent = 'Invitado';
            if (emailPerfil) emailPerfil.textContent = 'Inicia sesión para ver tu perfil';
            if (puntosUsuario) puntosUsuario.textContent = '0';
            if (rangoUsuario) rangoUsuario.textContent = 'Novato';

            // Restablecer avatar del formulario de reporte
            if (avatarUsuario) {
                avatarUsuario.innerHTML = '<i class="fas fa-user"></i>';
                avatarUsuario.style.background = 'linear-gradient(135deg, var(--color-primario), var(--color-info))';
            }
        }
    }


    // UTILIDADES
    limpiarFormulario() {
        document.getElementById('textoReporte').value = '';
        document.getElementById('previewImagen').innerHTML = '';
        document.getElementById('previewImagen').style.display = 'none';
        document.getElementById('inputImagen').value = '';
        document.getElementById('modoAnonimo').checked = false;
        document.getElementById('prioridadReporte').value = 'info';
        
        // Limpiar selectores de ubicación
        document.getElementById('selectProvincia').value = '';
        document.getElementById('selectCanton').value = '';
        document.getElementById('selectCanton').disabled = true;
        document.getElementById('selectDistrito').value = '';
        document.getElementById('selectDistrito').disabled = true;
        
        // Resetear el avatar
        const avatar = document.getElementById('avatarUsuario');
        avatar.innerHTML = '<i class="fas fa-user"></i>';
        avatar.style.background = 'linear-gradient(135deg, var(--color-primario), var(--color-info))';
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        const colores = {
            success: 'var(--color-exito)',
            info: 'var(--color-info)',
            warning: 'var(--color-advertencia)',
            danger: 'var(--color-secundario)'
        };

        const notificacion = document.createElement('div');
        notificacion.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background-color: ${colores[tipo]};
            color: var(--texto-principal); /* Usar variable para el color de texto */
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            animation: slideIn 0.3s ease-out forwards; /* Añadir forwards para que mantenga el estado final */
        `;
        notificacion.textContent = mensaje;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.style.animation = 'slideOut 0.3s ease-out forwards'; // Añadir forwards
            setTimeout(() => notificacion.remove(), 300);
        }, 3000);
    }

    actualizarEstadisticas() {
        document.getElementById('totalReportes').textContent = this.contadorReportes;
        document.getElementById('reportesResueltos').textContent = Math.floor(this.contadorReportes * 0.3);
        document.getElementById('usuariosActivos').textContent = Math.floor(Math.random() * 50) + 100;
        // Podrías añadir lógica para actualizar las estadísticas de la sección 'informes' aquí
    }

    // PANEL DE PROVINCIAS
    inicializarPanelProvincias() {
        this.actualizarPanelProvincias();
    }

    actualizarPanelProvincias() {
        const contenedor = document.getElementById('listaProvincias');
        contenedor.innerHTML = '';
        
        let totalNacional = 0;
        let provinciasAfectadas = 0;
        
        Object.entries(this.datosProvincias).forEach(([provincia, datos]) => {
            const totalProvincia = datos.incidentes.urgente + datos.incidentes.precaucion + datos.incidentes.info;
            totalNacional += totalProvincia;
            if (totalProvincia > 0) provinciasAfectadas++;
            
            const itemProvincia = document.createElement('div');
            itemProvincia.className = 'item-provincia';
            if (this.provinciaSeleccionada === provincia) {
                itemProvincia.classList.add('activa');
            }
            
            itemProvincia.innerHTML = `
                <div class="nombre-provincia">
                    <span>${provincia}</span>
                    <span class="contador-incidentes">${totalProvincia}</span>
                </div>
                <div class="detalle-incidentes">
                    ${datos.incidentes.urgente > 0 ? `<span class="mini-contador urgente">${datos.incidentes.urgente}</span>` : ''}
                    ${datos.incidentes.precaucion > 0 ? `<span class="mini-contador precaucion">${datos.incidentes.precaucion}</span>` : ''}
                    ${datos.incidentes.info > 0 ? `<span class="mini-contador info">${datos.incidentes.info}</span>` : ''}
                </div>
            `;
            
            itemProvincia.addEventListener('click', () => this.seleccionarProvincia(provincia));
            contenedor.appendChild(itemProvincia);
        });
        
        // Actualizar resumen nacional
        document.getElementById('totalNacional').textContent = totalNacional;
        document.getElementById('provinciasAfectadas').textContent = provinciasAfectadas;
        
        // Actualizar nivel de alerta
        const nivelAlerta = document.getElementById('nivelAlerta');
        if (totalNacional > 20) {
            nivelAlerta.textContent = 'Alto';
            nivelAlerta.className = 'badge bg-danger';
        } else if (totalNacional > 10) {
            nivelAlerta.textContent = 'Medio';
            nivelAlerta.className = 'badge bg-warning';
        } else {
            nivelAlerta.textContent = 'Bajo';
            nivelAlerta.className = 'badge bg-success';
        }
    }

    seleccionarProvincia(provincia) {
        this.provinciaSeleccionada = this.provinciaSeleccionada === provincia ? null : provincia;
        this.actualizarPanelProvincias();
        
        if (this.provinciaSeleccionada) {
            const coords = this.datosProvincias[provincia];
            this.mapa.setView([coords.lat, coords.lng], 10);
            this.filtrarReportesPorProvincia(provincia);
        } else {
            this.mapa.setView([9.7489, -83.7534], 8);
            this.mostrarTodosLosReportes();
        }
    }

    filtrarReportesPorProvincia(provincia) {
        this.marcadores.forEach(({ marcador, provincia: markerProvincia }) => {
            if (markerProvincia === provincia) {
                marcador.setOpacity(1);
            } else {
                marcador.setOpacity(0);
            }
        });

        document.querySelectorAll('.item-reporte').forEach(reporteElement => {
            // Este filtro en el feed de reportes requeriría que los reportes tengan el dato de provincia
            // para ser consistente. Por ahora, asume que 'reporteElement' tiene un data-attribute o similar
            // Por simplicidad, aquí puedes controlar la visibilidad o dejarlo abierto
            reporteElement.style.display = 'block'; // Ocultar/mostrar según la provincia real
        });
    }

    mostrarTodosLosReportes() {
        this.marcadores.forEach(({ marcador }) => marcador.setOpacity(1));
        document.querySelectorAll('.item-reporte').forEach(reporte => {
            reporte.style.display = 'block';
        });
    }

    aplicarFiltros() {
        const filtroUrgente = document.getElementById('filtroUrgente').checked;
        const filtroPrecaucion = document.getElementById('filtroPrecaucion').checked;
        const filtroInfo = document.getElementById('filtroInfo').checked;
        
        this.marcadores.forEach(({ marcador, tipo }) => {
            const mostrar = (tipo === 'urgente' && filtroUrgente) ||
                           (tipo === 'precaucion' && filtroPrecaucion) ||
                           (tipo === 'info' && filtroInfo);
            
            if (mostrar) {
                marcador.setOpacity(1);
            } else {
                marcador.setOpacity(0);
            }
        });
        
        const reportes = document.querySelectorAll('.item-reporte');
        reportes.forEach(reporte => {
            const prioridad = reporte.querySelector('.etiqueta-prioridad').classList;
            const mostrar = (prioridad.contains('prioridad-urgente') && filtroUrgente) ||
                           (prioridad.contains('prioridad-precaucion') && filtroPrecaucion) ||
                           (prioridad.contains('prioridad-info') && filtroInfo);
            
            reporte.style.display = mostrar ? 'block' : 'none';
        });
    }

    // DATOS DE EJEMPLO
    cargarReportesEjemplo() {
        const reportesEjemplo = [
            {
                id: 1,
                texto: '🚗 Accidente múltiple en la Autopista General Cañas. Tres vehículos involucrados. Se recomienda tomar rutas alternas.',
                autor: 'Carlos Mendez',
                esAnonimo: false,
                prioridad: 'urgente',
                tiempo: 'hace 15 minutos',
                likes: 12,
                comentarios: 3,
                imagen: null,
                provincia: 'San José', canton: 'San José' // Añadir provincia y cantón
            },
            {
                id: 2,
                texto: '🚧 Trabajos de mantenimiento en Avenida Central. Carril derecho cerrado hasta las 6 PM.',
                autor: 'María Rodriguez',
                esAnonimo: false,
                prioridad: 'precaucion',
                tiempo: 'hace 45 minutos',
                likes: 8,
                comentarios: 5,
                imagen: null,
                provincia: 'Alajuela', canton: 'Alajuela' // Añadir provincia y canton
            },
            {
                id: 3,
                texto: '🌧️ Lluvia intensa en la zona de Cartago. Visibilidad reducida. Manejen con precaución.',
                autor: 'Usuario Anónimo',
                esAnonimo: true,
                prioridad: 'info',
                tiempo: 'hace 1 hora',
                likes: 15,
                comentarios: 2,
                imagen: null,
                provincia: 'Cartago', canton: 'Cartago' // Añadir provincia y canton
            }
        ];

        reportesEjemplo.forEach(reporte => {
            this.reportes.push(reporte);
            const elemento = this.crearElementoReporte(reporte);
            document.getElementById('feedReportes').appendChild(elemento);
        });

        this.contadorReportes = reportesEjemplo.length;
        
        // Actualizar panel de provincias con los datos de ejemplo
        this.actualizarPanelProvincias();
        
        // Agregar más marcadores al mapa según los reportes
        reportesEjemplo.forEach(reporte => {
            if (this.datosProvincias[reporte.provincia]) {
                const coords = this.datosProvincias[reporte.provincia];
                const icono = this.obtenerIconoPorTipo(reporte.prioridad);
                const marcador = L.marker([
                    coords.lat + (Math.random() - 0.5) * 0.1, 
                    coords.lng + (Math.random() - 0.5) * 0.1
                ], {icon: icono})
                    .addTo(this.mapa)
                    .bindPopup(`<b>${reporte.texto.substring(0, 50)}...</b><br><small>${reporte.provincia} - ${reporte.tiempo}</small>`);
                
                this.marcadores.push({ marcador, provincia: reporte.provincia, tipo: reporte.prioridad });
            }
        });
    }
}


// ANIMACIONES CSS (Mantenidas aquí, aunque podrían ir en estilos.css si son usadas globalmente)
const estilosAnimacion = document.createElement('style');
estilosAnimacion.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(estilosAnimacion);


// INICIALIZAR APLICACIÓN
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ViasSegurasApp();
});
    