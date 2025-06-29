// CLASE PRINCIPAL DE LA APLICACIÓN
class ViasSegurasApp {
    constructor() {
        this.mapa = null;
        this.reportes = [];
        this.usuario = null;
        this.contadorReportes = 0;
        this.inicializar();
    }

    // Inicialización de la aplicación
    inicializar() {
        this.inicializarMapa();
        this.configurarEventos();
        this.cargarReportesEjemplo();
        this.actualizarEstadisticas();
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
            {lat: 9.9333, lng: -84.0833, titulo: 'Accidente en San José', tipo: 'urgente'},
            {lat: 10.0, lng: -84.2, titulo: 'Construcción en Ruta 27', tipo: 'precaucion'},
            {lat: 9.5, lng: -83.8, titulo: 'Lluvia intensa', tipo: 'info'}
        ];

        ejemplos.forEach(ej => {
            const icono = this.obtenerIconoPorTipo(ej.tipo);
            L.marker([ej.lat, ej.lng], {icon: icono})
                .addTo(this.mapa)
                .bindPopup(`<b>${ej.titulo}</b><br><small>Reportado hace 30 min</small>`);
        });
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

        // Eventos de autenticación
        document.getElementById('formularioLogin').addEventListener('submit', (e) => this.iniciarSesion(e));
        document.getElementById('formularioRegistro').addEventListener('submit', (e) => this.registrarUsuario(e));
        document.getElementById('btnCerrarSesion').addEventListener('click', () => this.cerrarSesion());

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

    // GESTIÓN DE REPORTES
    enviarReporte() {
        const texto = document.getElementById('textoReporte').value.trim();
        if (!texto) {
            alert('Por favor escribe algo sobre el incidente');
            return;
        }

        const esAnonimo = document.getElementById('modoAnonimo').checked;
        const prioridad = document.getElementById('prioridadReporte').value;
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
            imagen: tieneImagen ? document.getElementById('previewImagen').querySelector('img').src : null
        };

        this.agregarReporte(nuevoReporte);
        this.limpiarFormulario();
        this.actualizarEstadisticas();
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
        
        // Resetear avatar
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