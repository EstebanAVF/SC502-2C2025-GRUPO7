// CLASE PRINCIPAL DE LA APLICACIÓN
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
        this.inicializar();
    }

    // Inicialización de la aplicación
    inicializar() {
        this.inicializarMapa();
        this.configurarEventos();
        this.inicializarSelectoresUbicacion();
        this.cargarReportesEjemplo();
        this.actualizarEstadisticas();
        this.inicializarPanelProvincias();
    }

    // CONFIGURACIÓN DEL MAPA
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
            urgente: '#dc2626',
            precaucion: '#f59e0b',
            info: '#0891b2'
        };

        return L.divIcon({
            html: `<div style="background-color: ${colores[tipo]}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [20, 20],
            className: 'marcador-personalizado'
        });
    }


    // CONFIGURACIÓN DE EVENTOS

    configurarEventos() {
        // Eventos del formulario de reporte
        document.getElementById('btnEnviarReporte').addEventListener('click', () => this.enviarReporte());
        document.getElementById('textoReporte').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.enviarReporte();
            }
        });

        // Evento de imagen
        document.getElementById('inputImagen').addEventListener('change', (e) => this.previsualizarImagen(e));

        // Evento de modo anónimo
        document.getElementById('modoAnonimo').addEventListener('change', (e) => this.cambiarModoAnonimo(e));

        // Eventos de selectores de ubicación
        document.getElementById('selectProvincia').addEventListener('change', (e) => this.cambiarProvincia(e));
        document.getElementById('selectCanton').addEventListener('change', (e) => this.cambiarCanton(e));

        // Eventos de autenticación
        document.getElementById('formularioLogin').addEventListener('submit', (e) => this.iniciarSesion(e));
        document.getElementById('formularioRegistro').addEventListener('submit', (e) => this.registrarUsuario(e));
        document.getElementById('btnCerrarSesion').addEventListener('click', () => this.cerrarSesion());

        // Eventos de filtros
        document.getElementById('filtroUrgente').addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filtroPrecaucion').addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filtroInfo').addEventListener('change', () => this.aplicarFiltros());

        // Navegación suave
        this.configurarNavegacionSuave();
    }

    configurarNavegacionSuave() {
        document.querySelectorAll('a[href^="#"]').forEach(enlace => {
            enlace.addEventListener('click', function(e) {
                // Ignorar si es un modal
                if (this.hasAttribute('data-bs-toggle')) return;
                
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


    // GESTIÓN DE REPORTES

    enviarReporte() {
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

        const esAnonimo = document.getElementById('modoAnonimo').checked;
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
                <div class="avatar-usuario me-3" style="${reporte.esAnonimo ? 'background: linear-gradient(135deg, #64748b, #475569);' : ''}">
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
        const reporte = this.reportes.find(r => r.id === reporteId);
        if (reporte) {
            reporte.likes++;
            // Actualizar UI (en producción esto sería una actualización parcial)
            location.reload();
        }
    }


    // GESTIÓN DE IMÁGENES

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


    // MODO ANÓNIMO

    cambiarModoAnonimo(evento) {
        const avatar = document.getElementById('avatarUsuario');
        if (evento.target.checked) {
            avatar.innerHTML = '<i class="fas fa-user-secret"></i>';
            avatar.style.background = 'linear-gradient(135deg, #64748b, #475569)';
        } else {
            avatar.innerHTML = '<i class="fas fa-user"></i>';
            avatar.style.background = 'linear-gradient(135deg, #1e40af, #0891b2)';
        }
    }


    // GESTIÓN DE USUARIOS
    iniciarSesion(evento) {
        evento.preventDefault();
        const email = document.getElementById('emailLogin').value;
        const nombre = email.split('@')[0];
        
        this.usuario = { nombre: nombre, email: email };
        this.actualizarUIUsuario();
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalLogin'));
        modal.hide();
        
        // Mostrar mensaje de bienvenida
        this.mostrarNotificacion(`¡Bienvenido ${nombre}!`, 'success');
    }

    registrarUsuario(evento) {
        evento.preventDefault();
        const nombre = document.getElementById('nombreRegistro').value;
        const email = document.getElementById('emailRegistro').value;
        
        this.usuario = { nombre: nombre, email: email };
        this.actualizarUIUsuario();
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalRegistro'));
        modal.hide();
        
        // Mostrar mensaje de bienvenida
        this.mostrarNotificacion(`¡Cuenta creada exitosamente! Bienvenido ${nombre}`, 'success');
    }

    cerrarSesion() {
        this.usuario = null;
        this.actualizarUIUsuario();
        this.mostrarNotificacion('Sesión cerrada', 'info');
    }

    actualizarUIUsuario() {
        const botonLogin = document.getElementById('botonLogin');
        const menuUsuario = document.getElementById('menuUsuario');
        const nombreUsuario = document.getElementById('nombreUsuario');
        
        if (this.usuario) {
            botonLogin.classList.add('d-none');
            menuUsuario.classList.remove('d-none');
            nombreUsuario.textContent = this.usuario.nombre;
        } else {
            botonLogin.classList.remove('d-none');
            menuUsuario.classList.add('d-none');
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
        avatar.style.background = 'linear-gradient(135deg, #1e40af, #0891b2)';
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        const colores = {
            success: '#16a34a',
            info: '#0891b2',
            warning: '#f59e0b',
            danger: '#dc2626'
        };

        const notificacion = document.createElement('div');
        notificacion.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background-color: ${colores[tipo]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
        `;
        notificacion.textContent = mensaje;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notificacion.remove(), 300);
        }, 3000);
    }

    actualizarEstadisticas() {
        document.getElementById('totalReportes').textContent = this.contadorReportes;
        document.getElementById('reportesResueltos').textContent = Math.floor(this.contadorReportes * 0.3);
        document.getElementById('usuariosActivos').textContent = Math.floor(Math.random() * 50) + 100;
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
            // Centrar mapa en la provincia seleccionada
            const coords = this.datosProvincias[provincia];
            this.mapa.setView([coords.lat, coords.lng], 10);
            
            // Filtrar reportes por provincia
            this.filtrarReportesPorProvincia(provincia);
        } else {
            // Volver a vista general
            this.mapa.setView([9.7489, -83.7534], 8);
            this.mostrarTodosLosReportes();
        }
    }

    filtrarReportesPorProvincia(provincia) {
        const reportes = document.querySelectorAll('.item-reporte');
        reportes.forEach(reporte => {
            // En producción, esto verificaría la provincia del reporte
            reporte.style.display = 'block';
        });
    }

    mostrarTodosLosReportes() {
        const reportes = document.querySelectorAll('.item-reporte');
        reportes.forEach(reporte => {
            reporte.style.display = 'block';
        });
    }

    aplicarFiltros() {
        const filtroUrgente = document.getElementById('filtroUrgente').checked;
        const filtroPrecaucion = document.getElementById('filtroPrecaucion').checked;
        const filtroInfo = document.getElementById('filtroInfo').checked;
        
        // Filtrar marcadores en el mapa
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
        
        // Filtrar reportes en el feed
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
                imagen: null
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
                imagen: null
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
                imagen: null
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


// ANIMACIONES CSS
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
    