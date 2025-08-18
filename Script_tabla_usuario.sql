-- Crear la base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS vias_seguras;

-- Usar la base de datos
USE vias_seguras;

-- Crear la tabla de usuarios 
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    puntos INT DEFAULT 0,
    user_rank VARCHAR(50) DEFAULT 'Novato',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Rangos disponibles
CREATE TABLE IF NOT EXISTS rangos_usuarios (
    nombre_rango VARCHAR(50) PRIMARY KEY,
    minimo_puntos INT NOT NULL,
    descripcion TEXT
);

-- Insertar los rangos 
INSERT INTO rangos_usuarios (nombre_rango, minimo_puntos, descripcion) VALUES
('Novato', 0, 'Usuario nuevo en la plataforma.'),
('Explorador', 100, 'Usuario que ha comenzado a explorar y reportar.'),
('Colaborador', 500, 'Usuario activo que contribuye frecuentemente.'),
('Experto', 1000, 'Usuario con gran experiencia y conocimiento de la plataforma.'),
('Líder', 2500, 'Usuario que guía a otros y es un referente.');

-- CORREGIR: Agregar la foreign key correcta
ALTER TABLE usuarios ADD FOREIGN KEY (user_rank) REFERENCES rangos_usuarios(nombre_rango);

-- Tabla de tipos de incidente (AGREGANDO la columna descripcion que faltaba)
CREATE TABLE IF NOT EXISTS tipos_incidente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT, -- ESTA COLUMNA FALTABA
    icono_clase_css VARCHAR(100) DEFAULT 'fas fa-exclamation-triangle'
);

-- Insertar algunos tipos de incidente (CON descripcion)
INSERT INTO tipos_incidente (nombre, descripcion, icono_clase_css) VALUES
('Accidente de Tránsito', 'Colisiones y accidentes vehiculares', 'fas fa-car-crash'),
('Emergencia Médica', 'Situaciones que requieren atención médica urgente', 'fas fa-ambulance'),
('Bloqueo de Vía', 'Obstáculos que impiden el tránsito normal', 'fas fa-road'),


-- Tabla de reportes
CREATE TABLE IF NOT EXISTS reportes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_tipo_incidente INT DEFAULT 11, -- Por defecto "Otro" (ajustado al nuevo ID)
    descripcion TEXT NOT NULL,
    prioridad ENUM('info', 'precaucion', 'urgente') DEFAULT 'info',
    provincia VARCHAR(100) NOT NULL,
    canton VARCHAR(100) NOT NULL,
    distrito VARCHAR(100),
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    imagen VARCHAR(255),
    resuelto BOOLEAN DEFAULT FALSE,
    votos_positivos INT DEFAULT 0,
    votos_negativos INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_tipo_incidente) REFERENCES tipos_incidente(id)
);

-- Tabla para los votos de los usuarios
CREATE TABLE IF NOT EXISTS votos_reportes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_reporte INT NOT NULL,
    tipo_voto ENUM('positivo', 'negativo') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_reporte) REFERENCES reportes(id),
    UNIQUE KEY unico_voto_usuario_reporte (id_usuario, id_reporte)
);

-- Tabla para informes sobre reportes
CREATE TABLE IF NOT EXISTS informes_reportes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_reporte INT NOT NULL,
    motivo ENUM('spam', 'contenido_inapropiado', 'informacion_falsa', 'duplicado', 'otro') NOT NULL,
    descripcion TEXT,
    estado ENUM('pendiente', 'revisado', 'resuelto') DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_reporte) REFERENCES reportes(id)
);

-- Tabla para historial de puntos
CREATE TABLE IF NOT EXISTS historial_puntos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    puntos_ganados INT NOT NULL,
    razon VARCHAR(255) NOT NULL,
    id_reporte INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_reporte) REFERENCES reportes(id)
);

-- Índices para mejor rendimiento
CREATE INDEX idx_votos_usuario_reporte ON votos_reportes(id_usuario, id_reporte);
CREATE INDEX idx_votos_reporte ON votos_reportes(id_reporte);
CREATE INDEX idx_informes_reporte ON informes_reportes(id_reporte);
CREATE INDEX idx_reportes_coordenadas ON reportes(latitud, longitud);
CREATE INDEX idx_historial_puntos_usuario ON historial_puntos(id_usuario);