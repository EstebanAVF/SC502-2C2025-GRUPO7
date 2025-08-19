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
        
        // ==================== INICIO DE LA MODIFICACIÓN #1 ====================
        // Se añade una propiedad para guardar la instancia del gráfico
        this.graficoPrioridades = null;
        // ==================== FIN DE LA MODIFICACIÓN #1 ====================

        this.datosProvincias = {
            'San José': {
                lat: 9.9333, lng: -84.0833,
                cantones: {
                    'San José': { lat: 9.9325, lng: -84.0787, distritos: ['Carmen', 'Merced', 'Hospital', 'Catedral', 'Zapote', 'San Francisco', 'Uruca', 'Mata Redonda', 'Pavas', 'Hatillo', 'San Sebastián'] },
                    'Escazú': { lat: 9.9208, lng: -84.1436, distritos: ['Escazú', 'San Antonio', 'San Rafael'] },
                    'Desamparados': { lat: 9.8939, lng: -84.0673, distritos: ['Desamparados', 'San Miguel', 'San Juan de Dios', 'San Rafael Arriba', 'San Antonio', 'Frailes', 'Patarrá'] },
                    'Puriscal': { lat: 9.8519, lng: -84.3142, distritos: ['Santiago', 'Mercedes Sur', 'Barbacoas', 'Grifo Alto', 'San Rafael'] },
                    'Tarrazú': { lat: 9.6644, lng: -84.0292, distritos: ['San Marcos', 'San Lorenzo', 'San Carlos'] },
                    'Aserrí': { lat: 9.8608, lng: -84.0922, distritos: ['Aserrí', 'Tarbaca', 'Vuelta de Jorco', 'San Gabriel', 'Legua', 'Monterrey'] },
                    'Mora': { lat: 9.8806, lng: -84.2731, distritos: ['Colón', 'Guayabo', 'Tabarcia', 'Piedras Negras', 'Picagres'] },
                    'Goicoechea': { lat: 9.9575, lng: -84.0450, distritos: ['Guadalupe', 'San Francisco', 'Calle Blancos', 'Mata de Plátano', 'Ipís', 'Rancho Redondo', 'Purral'] },
                    'Santa Ana': { lat: 9.9328, lng: -84.1833, distritos: ['Santa Ana', 'Salitral', 'Pozos', 'Uruca', 'Piedades', 'Brasil'] },
                    'Alajuelita': { lat: 9.9025, lng: -84.1033, distritos: ['Alajuelita', 'San Josecito', 'San Antonio', 'Concepción', 'San Felipe'] },
                    'Vázquez de Coronado': { lat: 9.9881, lng: -84.0231, distritos: ['San Isidro', 'San Rafael', 'Dulce Nombre de Jesús', 'Patalillo', 'Cascajal'] },
                    'Acosta': { lat: 9.7719, lng: -84.2403, distritos: ['San Ignacio', 'Guaitil', 'Palmichal', 'Cangrejal', 'Sabanillas'] },
                    'Tibás': { lat: 9.9572, lng: -84.0822, distritos: ['San Juan', 'Cinco Esquinas', 'Anselmo Llorente', 'León XIII', 'Colima'] },
                    'Moravia': { lat: 9.9658, lng: -84.0536, distritos: ['San Vicente', 'San Jerónimo', 'La Trinidad'] },
                    'Montes de Oca': { lat: 9.9358, lng: -84.0494, distritos: ['San Pedro', 'Sabanilla', 'Mercedes', 'San Rafael'] },
                    'Turrubares': { lat: 9.8353, lng: -84.4864, distritos: ['San Pablo', 'San Pedro', 'San Juan de Mata', 'San Luis'] },
                    'Dota': { lat: 9.6808, lng: -83.9881, distritos: ['Santa María', 'Jardín', 'Copey'] },
                    'Curridabat': { lat: 9.9142, lng: -84.0322, distritos: ['Curridabat', 'Granadilla', 'Sánchez', 'Tirrases'] },
                    'Pérez Zeledón': { lat: 9.3739, lng: -83.7022, distritos: ['San Isidro de El General', 'El General', 'Daniel Flores', 'Rivas', 'San Pedro'] },
                    'León Cortés': { lat: 9.7153, lng: -84.0792, distritos: ['San Pablo', 'San Andrés', 'Llano Bonito', 'San Isidro', 'Santa Cruz'] }
                }
            },
            'Alajuela': {
                lat: 10.0162, lng: -84.2163,
                cantones: {
                    'Alajuela': { lat: 10.0167, lng: -84.2167, distritos: ['Alajuela', 'San José', 'Carrizal', 'San Antonio', 'Guácima', 'San Isidro', 'Sabanilla', 'San Rafael', 'Río Segundo', 'Desamparados', 'Turrúcares', 'Tambor', 'Garita', 'Sarapiquí'] },
                    'San Ramón': { lat: 10.0886, lng: -84.4706, distritos: ['San Ramón', 'Santiago', 'San Juan', 'Piedades Norte', 'Piedades Sur', 'San Rafael', 'San Isidro', 'Ángeles', 'Alfaro', 'Volio', 'Concepción'] },
                    'Grecia': { lat: 10.0719, lng: -84.3117, distritos: ['Grecia', 'San Isidro', 'San José', 'San Roque', 'Tacares', 'Puente de Piedra', 'Bolívar'] },
                    'San Mateo': { lat: 9.9589, lng: -84.5208, distritos: ['San Mateo', 'Desmonte', 'Jesús María', 'Labrador'] },
                    'Atenas': { lat: 9.9786, lng: -84.3800, distritos: ['Atenas', 'Jesús', 'Mercedes', 'San Isidro', 'Concepción', 'San José', 'Santa Eulalia', 'Escobal'] },
                    'Naranjo': { lat: 10.0967, lng: -84.3781, distritos: ['Naranjo', 'San Miguel', 'San José', 'Cirrí Sur', 'San Jerónimo', 'San Juan', 'El Rosario', 'Palmitos'] },
                    'Palmares': { lat: 10.0592, lng: -84.4294, distritos: ['Palmares', 'Zaragoza', 'Buenos Aires', 'Santiago', 'Candelaria', 'Esquipulas', 'La Granja'] },
                    'Poás': { lat: 10.1219, lng: -84.2503, distritos: ['San Pedro', 'San Juan', 'San Rafael', 'Carrillos', 'Sabana Redonda'] },
                    'Orotina': { lat: 9.9114, lng: -84.5256, distritos: ['Orotina', 'El Mastate', 'Hacienda Vieja', 'Coyolar', 'La Ceiba'] },
                    'San Carlos': { lat: 10.4686, lng: -84.5122, distritos: ['Quesada', 'Florencia', 'Buenavista', 'Aguas Zarcas', 'Venecia', 'Pital', 'La Fortuna', 'La Tigra', 'La Palmera', 'Venado', 'Cutris', 'Monterrey', 'Pocosol'] },
                    'Zarcero': { lat: 10.1867, lng: -84.3942, distritos: ['Zarcero', 'Laguna', 'Tapesco', 'Guadalupe', 'Palmira', 'Zapote', 'Brisas'] },
                    'Sarchí': { lat: 10.0931, lng: -84.3411, distritos: ['Sarchí Norte', 'Sarchí Sur', 'Toro Amarillo', 'San Pedro', 'Rodríguez'] },
                    'Upala': { lat: 10.8981, lng: -85.0161, distritos: ['Upala', 'Aguas Claras', 'San José (Pizote)', 'Bijagua', 'Delicias', 'Dos Ríos', 'Yolillal', 'Canalete'] },
                    'Los Chiles': { lat: 11.0333, lng: -84.7167, distritos: ['Los Chiles', 'Caño Negro', 'El Amparo', 'San Jorge'] },
                    'Guatuso': { lat: 10.7167, lng: -84.8000, distritos: ['San Rafael', 'Buenavista', 'Cote', 'Katira'] },
                    'Río Cuarto': { lat: 10.3667, lng: -84.2167, distritos: ['Río Cuarto', 'Santa Rita', 'Santa Isabel'] }
                }
            },
            'Cartago': {
                lat: 9.8634, lng: -83.9194,
                cantones: {
                    'Cartago': { lat: 9.8667, lng: -83.9167, distritos: ['Oriental', 'Occidental', 'Carmen', 'San Nicolás', 'Aguacaliente (San Francisco)', 'Guadalupe (Arenilla)', 'Corralillo', 'Tierra Blanca', 'Dulce Nombre', 'Llano Grande', 'Quebradilla'] },
                    'Paraíso': { lat: 9.8417, lng: -83.8667, distritos: ['Paraíso', 'Santiago', 'Orosi', 'Cachí', 'Llanos de Santa Lucía'] },
                    'La Unión': { lat: 9.9167, lng: -84.0000, distritos: ['Tres Ríos', 'San Diego', 'San Juan', 'San Rafael', 'Concepción', 'Dulce Nombre', 'San Ramón', 'Río Azul'] },
                    'Jiménez': { lat: 9.8167, lng: -83.7333, distritos: ['Juan Viñas', 'Tucurrique', 'Pejibaye'] },
                    'Turrialba': { lat: 9.9000, lng: -83.6833, distritos: ['Turrialba', 'La Suiza', 'Peralta', 'Santa Cruz', 'Santa Teresita', 'Pavones', 'Tuis', 'Tayutic', 'Santa Rosa', 'Tres Equis', 'La Isabel', 'Chirripó'] },
                    'Alvarado': { lat: 9.9000, lng: -83.8000, distritos: ['Pacayas', 'Cervantes', 'Capellades'] },
                    'Oreamuno': { lat: 9.9167, lng: -83.8500, distritos: ['San Rafael', 'Cot', 'Potrero Cerrado', 'Cipreses', 'Santa Rosa'] },
                    'El Guarco': { lat: 9.8167, lng: -83.9333, distritos: ['El Tejar', 'San Isidro', 'Tobosi', 'Patio de Agua'] }
                }
            },
            'Heredia': {
                lat: 10.0024, lng: -84.1165,
                cantones: {
                    'Heredia': { lat: 9.9983, lng: -84.1189, distritos: ['Heredia', 'Mercedes', 'San Francisco', 'Ulloa', 'Varablanca'] },
                    'Barva': { lat: 10.0194, lng: -84.1283, distritos: ['Barva', 'San Pedro', 'San Pablo', 'San Roque', 'Santa Lucía', 'San José de la Montaña'] },
                    'Santo Domingo': { lat: 9.9806, lng: -84.0933, distritos: ['Santo Domingo', 'San Vicente', 'San Miguel', 'Paracito', 'Santo Tomás', 'Santa Rosa', 'Tures', 'Pará'] },
                    'Santa Bárbara': { lat: 10.0400, lng: -84.1611, distritos: ['Santa Bárbara', 'San Pedro', 'San Juan', 'Jesús', 'Santo Domingo', 'Purabá'] },
                    'San Rafael': { lat: 10.0503, lng: -84.0983, distritos: ['San Rafael', 'San Josecito', 'Santiago', 'Ángeles', 'Concepción'] },
                    'San Isidro': { lat: 10.0383, lng: -84.0456, distritos: ['San Isidro', 'San José', 'Concepción', 'San Francisco'] },
                    'Belén': { lat: 9.9767, lng: -84.1956, distritos: ['San Antonio', 'La Ribera', 'La Asunción'] },
                    'Flores': { lat: 9.9883, lng: -84.1656, distritos: ['San Joaquín', 'Barrantes', 'Llorente'] },
                    'San Pablo': { lat: 9.9822, lng: -84.0811, distritos: ['San Pablo', 'Rincón de Sabanilla'] },
                    'Sarapiquí': { lat: 10.4600, lng: -84.0089, distritos: ['Puerto Viejo', 'La Virgen', 'Horquetas', 'Llanuras del Gaspar', 'Cureña'] }
                }
            },
            'Guanacaste': {
                lat: 10.4285, lng: -85.3968,
                cantones: {
                    'Liberia': { lat: 10.6333, lng: -85.4333, distritos: ['Liberia', 'Cañas Dulces', 'Mayorga', 'Nacascolo', 'Curubandé'] },
                    'Nicoya': { lat: 10.1458, lng: -85.4519, distritos: ['Nicoya', 'Mansión', 'San Antonio', 'Quebrada Honda', 'Sámara', 'Nosara', 'Belén de Nosarita'] },
                    'Santa Cruz': { lat: 10.2597, lng: -85.6853, distritos: ['Santa Cruz', 'Bolsón', 'Veintisiete de Abril', 'Tempate', 'Cartagena', 'Cuajiniquil', 'Diriá', 'Cabo Velas', 'Tamarindo'] },
                    'Bagaces': { lat: 10.5256, lng: -85.2483, distritos: ['Bagaces', 'La Fortuna', 'Mogote', 'Río Naranjo'] },
                    'Carrillo': { lat: 10.4686, lng: -85.5683, distritos: ['Filadelfia', 'Palmira', 'Sardinal', 'Belén'] },
                    'Cañas': { lat: 10.4319, lng: -85.0981, distritos: ['Cañas', 'Palmira', 'San Miguel', 'Bebedero', 'Porozal'] },
                    'Abangares': { lat: 10.2817, lng: -84.9653, distritos: ['Las Juntas', 'Sierra', 'San Juan', 'Colorado'] },
                    'Tilarán': { lat: 10.4681, lng: -84.9703, distritos: ['Tilarán', 'Quebrada Grande', 'Tronadora', 'Santa Rosa', 'Líbano', 'Tierras Morenas', 'Arenal'] },
                    'Nandayure': { lat: 9.9833, lng: -85.3500, distritos: ['Carmona', 'Santa Rita', 'Zapotal', 'San Pablo', 'Porvenir', 'Bejuco'] },
                    'La Cruz': { lat: 11.0717, lng: -85.6311, distritos: ['La Cruz', 'Santa Cecilia', 'La Garita', 'Santa Elena'] },
                    'Hojancha': { lat: 10.0583, lng: -85.4211, distritos: ['Hojancha', 'Monte Romo', 'Puerto Carrillo', 'Huacas', 'Matambú'] }
                }
            },
            'Puntarenas': {
                lat: 9.9763, lng: -84.8388,
                cantones: {
                    'Puntarenas': { lat: 9.9769, lng: -84.8322, distritos: ['Puntarenas', 'Pitahaya', 'Chomes', 'Lepanto', 'Paquera', 'Manzanillo', 'Guacimal', 'Barranca', 'Monte Verde', 'Isla del Coco', 'Cóbano', 'Chacarita', 'Chira', 'Acapulco', 'El Roble', 'Arancibia'] },
                    'Esparza': { lat: 9.9925, lng: -84.6644, distritos: ['Espíritu Santo', 'San Juan Grande', 'Macacona', 'San Rafael', 'San Jerónimo', 'Caldera'] },
                    'Buenos Aires': { lat: 9.1722, lng: -83.3347, distritos: ['Buenos Aires', 'Volcán', 'Potrero Grande', 'Boruca', 'Pilas', 'Colinas', 'Chánguena', 'Biolley', 'Brunka'] },
                    'Montes de Oro': { lat: 10.1167, lng: -84.7167, distritos: ['Miramar', 'La Unión', 'San Isidro'] },
                    'Osa': { lat: 8.9583, lng: -83.4564, distritos: ['Puerto Cortés', 'Palmar', 'Sierpe', 'Bahía Ballena', 'Piedras Blancas', 'Bahía Drake'] },
                    'Quepos': { lat: 9.4308, lng: -84.1611, distritos: ['Quepos', 'Savegre', 'Naranjito'] },
                    'Golfito': { lat: 8.6381, lng: -83.1658, distritos: ['Golfito', 'Puerto Jiménez', 'Guaycará', 'Pavón'] },
                    'Coto Brus': { lat: 8.9667, lng: -82.9667, distritos: ['San Vito', 'Sabalito', 'Aguabuena', 'Limóncito', 'Pittier'] },
                    'Parrita': { lat: 9.5186, lng: -84.3217, distritos: ['Parrita'] },
                    'Corredores': { lat: 8.7833, lng: -82.9500, distritos: ['Corredor', 'La Cuesta', 'Canoas', 'Laurel'] },
                    'Garabito': { lat: 9.6167, lng: -84.6333, distritos: ['Jacó', 'Tárcoles'] }
                }
            },
            'Limón': {
                lat: 9.9907, lng: -83.0355,
                cantones: {
                    'Limón': { lat: 9.9889, lng: -83.0317, distritos: ['Limón', 'Valle La Estrella', 'Río Blanco', 'Matama'] },
                    'Pococí': { lat: 10.4667, lng: -83.6500, distritos: ['Guápiles', 'Jiménez', 'Rita', 'Roxana', 'Cariari', 'Colorado', 'La Colonia'] },
                    'Siquirres': { lat: 10.0986, lng: -83.5075, distritos: ['Siquirres', 'Pacuarito', 'Florida', 'Germania', 'Cairo', 'Alegría'] },
                    'Talamanca': { lat: 9.6333, lng: -82.8500, distritos: ['Bratsi', 'Sixaola', 'Cahuita', 'Telire'] },
                    'Matina': { lat: 10.0833, lng: -83.2833, distritos: ['Matina', 'Batán', 'Carrandi'] },
                    'Guácimo': { lat: 10.2167, lng: -83.6833, distritos: ['Guácimo', 'Mercedes', 'Pocora', 'Río Jiménez', 'Duacarí'] }
                }
            }
        };
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
        this.cargarEstadisticas();
        // ==================== INICIO DE LA MODIFICACIÓN #2 ====================
        // Se llama a la nueva función para crear el gráfico al iniciar la app
        this.inicializarGrafico();
        // ==================== FIN DE LA MODIFICACIÓN #2 ====================
    }
    
    // ==================== INICIO DE LA MODIFICACIÓN #3 ====================
    // Nueva función para crear y configurar el gráfico de pastel
    inicializarGrafico() {
        const ctx = document.getElementById('graficoPrioridades');
        if (!ctx) return;

        // Configuración para un estilo profesional y adaptado al tema oscuro
        this.graficoPrioridades = new Chart(ctx, {
            type: 'pie', // Tipo de gráfico
            data: {
                labels: ['Urgente', 'Precaución', 'Información'],
                datasets: [{
                    label: 'Reportes',
                    data: [0, 0, 0], // Inicia con datos en cero
                    backgroundColor: [
                        'rgba(220, 38, 38, 0.7)',  // Rojo alerta
                        'rgba(245, 158, 11, 0.7)', // Amarillo precaución
                        'rgba(8, 145, 178, 0.7)'   // Cyan información
                    ],
                    borderColor: [
                        '#334155', // Color del borde de la tarjeta para integrar
                    ],
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#f1f5f9', // Color de texto para la leyenda
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#0f172a',
                        titleColor: '#f1f5f9',
                        bodyColor: '#cbd5e1',
                        bodyFont: {
                            size: 14
                        },
                        titleFont: {
                            size: 16
                        },
                        padding: 12,
                        cornerRadius: 6
                    }
                }
            }
        });
    }
    // ==================== FIN DE LA MODIFICACIÓN #3 ====================

    configurarEventos() {
        document.getElementById('btnEnviarReporte')?.addEventListener('click', () => this.enviarReporte());
        document.getElementById('inputImagen')?.addEventListener('change', (e) => this.previsualizarImagen(e));
        document.getElementById('selectProvincia')?.addEventListener('change', (e) => this.cambiarProvincia(e));
        document.getElementById('selectCanton')?.addEventListener('change', (e) => this.cambiarCanton(e));
        document.getElementById('formularioLogin')?.addEventListener('submit', (e) => this.iniciarSesion(e));
        document.getElementById('formularioRegistro')?.addEventListener('submit', (e) => this.registrarUsuario(e));
        document.getElementById('btnCerrarSesion')?.addEventListener('click', () => this.cerrarSesion());
        document.querySelectorAll('.navbar-nav .nav-link[data-section], .btn[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.mostrarSeccion(e.currentTarget.dataset.section);
            });
        });
        document.querySelectorAll('.filtro-tipo').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.handleFiltroTipoChange(e));
        });
    }

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
        if (imagenInput.files.length > 0) {
            formData.append('imagen', imagenInput.files[0]);
        }
        
        let lat, lng;
        if (provincia && canton && this.datosProvincias[provincia]?.cantones[canton]) {
            lat = this.datosProvincias[provincia].cantones[canton].lat;
            lng = this.datosProvincias[provincia].cantones[canton].lng;
        } else if (provincia && this.datosProvincias[provincia]) {
            lat = this.datosProvincias[provincia].lat;
            lng = this.datosProvincias[provincia].lng;
        }

        if (lat && lng) {
            formData.append('latitud', lat);
            formData.append('longitud', lng);
        }

        try {
            const response = await fetch(this.BASE_URL + 'create_report.php', { method: 'POST', body: formData });
            const result = await response.json();
            
            if (response.ok && result.success) {
                this.mostrarNotificacion(result.message, 'success');
                this.limpiarFormulario();
                this.cargarDatosIniciales();
                this.cargarEstadisticas();

                if (result.nuevos_puntos !== undefined) {
                    this.usuario.puntos_totales = result.nuevos_puntos;
                }
                if (result.nuevo_rango_nombre) {
                    this.usuario.nombre_rango = result.nuevo_rango_nombre;
                }
                localStorage.setItem('usuarioViasSeguras', JSON.stringify(this.usuario));
                this.actualizarUIUsuario();

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
    
    async cargarDatosIniciales() {
        const feedContainer = document.getElementById('feedReportes');
        if (feedContainer) {
            feedContainer.innerHTML = '<p class="text-center texto-muted">Cargando reportes...</p>';
        }
        try {
            const response = await fetch(this.BASE_URL + 'get_reports.php?t=' + new Date().getTime());
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            
            this.todosLosReportes = await response.json();
            this.procesarYRenderizarTodo();

        } catch (error) {
            console.error('Error fatal al cargar reportes:', error);
            if (feedContainer) {
                feedContainer.innerHTML = '<p class="text-center text-danger">No se pudieron cargar los reportes iniciales.</p>';
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
            const prioridad = r.prioridad.toLowerCase();
            return (prioridad === 'precaucion' || prioridad === 'precaución') 
                   ? this.filtrosActivos.precaucion 
                   : this.filtrosActivos[prioridad];
        });

        this.renderizarFeed(reportesFiltrados);
        this.actualizarMapaConReportes(reportesFiltrados);
        this.addLikeButtonListeners();
    }
    //////////////////////////////////////////////////////////////////////
    addLikeButtonListeners() {
        const likeButtons = document.querySelectorAll('.like-button');
        likeButtons.forEach(button => {
            const handleLikeClick = async (event) => {
                event.stopPropagation();
                const reportId = button.dataset.reportId;
                button.disabled = true;

                try {
                    const response = await this.voteForReport(reportId);
                    if (response.success) {
                        const countSpan = button.querySelector('.like-count');
                        const currentLikes = parseInt(countSpan.textContent, 10);
                        countSpan.textContent = currentLikes + 1;
                        button.classList.remove('btn-outline-light');
                        button.classList.add('btn-primary');
                    } else {
                        button.classList.remove('btn-outline-light');
                        button.classList.add('btn-primary');
                    }
                } catch (error) {
                    console.error('Error al votar:', error);
                    this.mostrarNotificacion('No se pudo registrar tu voto. Revisa si has iniciado sesión.', 'danger');
                    button.disabled = false;
                }
            };

            button.removeEventListener('click', button.handleLikeClick);
            button.addEventListener('click', handleLikeClick);
            button.handleLikeClick = handleLikeClick;
        });
    }

    async voteForReport(reportId) {
        const response = await fetch(this.BASE_URL + 'vote_report.php', {
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
    
    renderizarFeed(reportes) {
        const feedContainer = document.getElementById('feedReportes');
        if (!feedContainer) {
            return;
        }
        feedContainer.innerHTML = '';
        if (reportes.length === 0) {
            feedContainer.innerHTML = '<p class="text-center texto-muted">No hay reportes que coincidan con los filtros seleccionados.</p>';
            return;
        }
        reportes.forEach(report => {
            const reportHTML = `<div class="tarjeta-info mb-3"><div class="d-flex align-items-start mb-2"><div class="avatar-usuario me-3"><i class="fas fa-user-circle"></i></div><div class="flex-grow-1"><h6 class="mb-0">${report.usuario_nombre} ${report.usuario_apellido}</h6><small class="texto-muted">${new Date(report.created_at).toLocaleString()} &middot; ${report.provincia}, ${report.canton}</small></div></div><p class="mb-2">${report.descripcion}</p>${report.imagen ? `<img src="${this.BASE_URL}uploads/${report.imagen}" class="img-fluid rounded mb-2" alt="Imagen del reporte">` : ''}<div class="d-flex justify-content-between align-items-center"><div><span class="badge-filtro ${report.prioridad.toLowerCase()}">${report.prioridad}</span><span class="badge bg-secondary">${report.tipo_incidente_nombre || 'General'}</span></div><button class="btn btn-sm btn-outline-light like-button" data-report-id="${report.id}"><i class="fas fa-thumbs-up me-1"></i> <span class="like-count">${report.total_likes}</span></button></div></div>`;
            feedContainer.insertAdjacentHTML('beforeend', reportHTML);
        });
    }

    procesarDatosDeReportes(reportes) {
        for (const provincia in this.datosProvincias) {
            this.datosProvincias[provincia].incidentes = { urgente: 0, precaucion: 0, info: 0 };
        }
        reportes.forEach(reporte => {
            let prioridadLower = reporte.prioridad.toLowerCase();
            if (prioridadLower === 'precaución') {
                prioridadLower = 'precaucion';
            }
            if (this.datosProvincias[reporte.provincia] && this.datosProvincias[reporte.provincia].incidentes[prioridadLower] !== undefined) {
                this.datosProvincias[reporte.provincia].incidentes[prioridadLower]++;
            }
        });
    }
    
    actualizarPanelProvincias() {
        const contenedor = document.getElementById('listaProvincias');
        if (!contenedor) {
            return;
        }
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
        this.actualizarPanelProvincias();
    }
    
    handleFiltroTipoChange(evento) {
        const filtro = evento.target.dataset.filtro;
        const estaActivo = evento.target.checked;
        this.filtrosActivos[filtro] = estaActivo;
        this.aplicarFiltrosYRenderizar();
    }
    
    actualizarMapaConReportes(reportes) {
        if (!this.mapa) {
            return;
        }

        this.marcadoresMapa.forEach(marcador => this.mapa.removeLayer(marcador));
        this.marcadoresMapa = [];

        const latLngs = [];

        reportes.forEach(reporte => {
            const lat = parseFloat(reporte.latitud);
            const lng = parseFloat(reporte.longitud);

            if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
                const latLng = [lat, lng];

                let prioridadLower = reporte.prioridad.toLowerCase();
                if (prioridadLower === 'precaución') {
                    prioridadLower = 'precaucion';
                }
                
                let iconColor = 'blue';
                if (prioridadLower === 'urgente') {
                    iconColor = 'red';
                } else if (prioridadLower === 'precaucion') {
                    iconColor = 'orange';
                }

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
                        ${reporte.descripcion.substring(0, 100)}...
                    `);
                
                this.marcadoresMapa.push(marcador);
                latLngs.push(latLng);
            }
        });

        if (latLngs.length > 0) {
            this.mapa.fitBounds(latLngs, { padding: [50, 50], maxZoom: 15 });
        } else if (!this.provinciaSeleccionada) {
            this.mapa.setView([9.7489, -83.7534], 8);
        }
    }
    
    inicializarMapa() {
        if (document.getElementById('mapaLeaflet')) {
            this.mapa = L.map('mapaLeaflet').setView([9.7489, -83.7534], 8);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.mapa);
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
                setTimeout(() => this.mapa.invalidateSize(), 10);
            }
        }
    }

    configurarModales() {
        const modalLoginEl = document.getElementById('modalLogin');
        const modalRegistroEl = document.getElementById('modalRegistro');
        if (modalLoginEl) {
            this.dom.modalLogin = new bootstrap.Modal(modalLoginEl);
        }
        if (modalRegistroEl) {
            this.dom.modalRegistro = new bootstrap.Modal(modalRegistroEl);
        }
    }

    inicializarSelectoresUbicacion() {
        const selectProvincia = document.getElementById('selectProvincia');
        if (!selectProvincia) {
            return;
        }
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
        
        if (provincia && this.datosProvincias[provincia]) {
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
        selectDistrito.innerHTML = '<option value="">Distrito (Opcional)</option>';
        selectDistrito.disabled = true;

        if (provincia && canton && this.datosProvincias[provincia]?.cantones[canton]?.distritos) {
            selectDistrito.disabled = false;
            const distritos = this.datosProvincias[provincia].cantones[canton].distritos;
            
            distritos.forEach(distrito => {
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
        if (password !== confirmPassword) {
            this.mostrarNotificacion('Las contraseñas no coinciden.', 'warning');
            return;
        }
        if (!termsCheck) {
            this.mostrarNotificacion('Debes aceptar los Términos y Condiciones.', 'warning');
            return;
        }
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
        if (storedUser) {
            this.usuario = JSON.parse(storedUser);
        } else {
            this.usuario = null;
        }
        this.actualizarUIUsuario();
    }

    actualizarUIUsuario() {
        const puntosPerfil = document.getElementById('puntosUsuario');
        const rangoPerfil = document.getElementById('rangoUsuario');

        if (this.usuario) {
            this.dom.botonLogin.classList.add('d-none');
            this.dom.menuUsuario.classList.remove('d-none');
            this.dom.nombreUsuario.textContent = this.usuario.nombre;
            document.getElementById('nombrePerfil').textContent = `${this.usuario.nombre} ${this.usuario.apellido}`;
            document.getElementById('emailPerfil').textContent = this.usuario.email;

            if (puntosPerfil) {
                puntosPerfil.textContent = this.usuario.puntos_totales;
            }
            if (rangoPerfil) {
                rangoPerfil.textContent = this.usuario.nombre_rango;
            }

        } else {
            this.dom.botonLogin.classList.remove('d-none');
            this.dom.menuUsuario.classList.add('d-none');
            document.getElementById('nombrePerfil').textContent = 'Invitado';
            document.getElementById('emailPerfil').textContent = 'Inicia sesión para ver tu perfil';
            
            if (puntosPerfil) {
                puntosPerfil.textContent = '0';
            }
            if (rangoPerfil) {
                rangoPerfil.textContent = 'N/A';
            }
        }
    }

    async cargarEstadisticas() {
        try {
            const response = await fetch(this.BASE_URL + 'get_stats.php?t=' + new Date().getTime());
            
            if (!response.ok) {
                throw new Error('No se pudieron cargar las estadísticas.');
            }
            const data = await response.json();
            if (data.success) {
                this.actualizarPanelesEstadisticas(data.stats);
            }
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    }

    actualizarPanelesEstadisticas(stats) {
        // Actualiza los paneles de texto
        document.getElementById('stats-urgente').textContent = stats.por_prioridad.Urgente || 0;
        document.getElementById('stats-precaucion').textContent = stats.por_prioridad.Precaucion || 0;
        document.getElementById('stats-info').textContent = stats.por_prioridad.Informacion || 0;
        const zonasContainer = document.getElementById('stats-zonas-incidencia');
        zonasContainer.innerHTML = '';
        const topProvincias = stats.por_provincia.slice(0, 3);
        if (topProvincias.length > 0) {
            topProvincias.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `${item.provincia}: <span class="badge bg-primary">${item.total}</span>`;
                zonasContainer.appendChild(li);
            });
        } else {
            zonasContainer.innerHTML = '<li>No hay datos de incidencia.</li>';
        }
        const resumen = stats.resumen_nacional;
        if (resumen) {
            document.getElementById('totalNacional').textContent = resumen.total_hoy || 0;
            document.getElementById('provinciasAfectadas').textContent = resumen.provincias_afectadas || 0;
            const nivelAlertaEl = document.getElementById('nivelAlerta');
            nivelAlertaEl.textContent = resumen.nivel_alerta || 'Bajo';
            nivelAlertaEl.className = 'badge';
            if (resumen.nivel_alerta === 'Alto') {
                nivelAlertaEl.classList.add('bg-danger');
            } else if (resumen.nivel_alerta === 'Moderado') {
                nivelAlertaEl.classList.add('bg-warning');
            } else {
                nivelAlertaEl.classList.add('bg-success');
            }
        }

        // ==================== INICIO DE LA MODIFICACIÓN #4 ====================
        // Se añade la lógica para actualizar el gráfico con los nuevos datos
        if (this.graficoPrioridades) {
            this.graficoPrioridades.data.datasets[0].data = [
                stats.por_prioridad.Urgente || 0,
                stats.por_prioridad.Precaucion || 0,
                stats.por_prioridad.Informacion || 0
            ];
            this.graficoPrioridades.update(); // Vuelve a dibujar el gráfico
        }
        // ==================== FIN DE LA MODIFICACIÓN #4 ====================
    }

    mostrarNotificacion(mensaje, tipo = 'info') { /* ... */ }
}

document.addEventListener('DOMContentLoaded', () => {
    new ViasSegurasApp();
});