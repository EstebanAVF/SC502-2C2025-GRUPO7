<?php
// 1. INICIAR LA SESIÓN PRIMERO QUE NADA
// Esto previene el error "headers already sent".
session_start();

// 2. MOSTRAR ERRORES (SOLO PARA DESARROLLO)
// Nos ayuda a ver cualquier problema directamente.
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// 3. CREDENCIALES DE LA BASE DE DATOS
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
// Usamos una contraseña vacía, que es el estándar para la mayoría de servidores locales como XAMPP.
define('DB_PASS', 'EAVF4444'); 
define('DB_NAME', 'vias_seguras');

// 4. INTENTAR LA CONEXIÓN
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// 5. VERIFICAR LA CONEXIÓN
// Si la conexión falla, el script se detiene aquí y muestra un error claro en JSON.
if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error
    // Enviamos un error en JSON, que JavaScript SÍ puede entender.
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos: ' . $conn->connect_error]);
    exit(); // Detener el script si la conexión falla
}

// 6. ESTABLECER JUEGO DE CARACTERES
// Buena práctica para evitar problemas con tildes y caracteres especiales.
$conn->set_charset("utf8mb4");

?>