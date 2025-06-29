-- Crear la base de datos (si no existe)
--CREATE DATABASE IF NOT EXISTS vias_seguras;

-- Usar la base de datos
--USE vias_seguras;

/**-- Crear la tabla de usuarios 
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    puntos INT DEFAULT 0, -- para almacenar los puntos del usuario
    user_rank VARCHAR(50) DEFAULT 'Novato', -- para el rango del usuario
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- para que nos diga cuando se creo el usuario de forma automatica
);

-- Rangos disponibles
CREATE TABLE IF NOT EXISTS rangos_usuarios (
    nombre_rango VARCHAR(50) PRIMARY KEY,
    minimo_puntos INT NOT NULL,
    descripcion TEXT
);

-- Insertar algunos rangos 
INSERT INTO rangos_usuarios (nombre_rango, minimo_puntos, descripcion) VALUES
('Novato', 0, 'Usuario nuevo en la plataforma.'),
('Explorador', 100, 'Usuario que ha comenzado a explorar y reportar.'),
('Colaborador', 500, 'Usuario activo que contribuye frecuentemente.'),
('Experto', 1000, 'Usuario con gran experiencia y conocimiento de la plataforma.'),
('Líder', 2500, 'Usuario que guía a otros y es un referente.');

-- asignar la foreing key
ALTER TABLE usuarios ADD FOREIGN KEY (rangos_usuarios) REFERENCES rangos_usuarios(nombre_rango);*/