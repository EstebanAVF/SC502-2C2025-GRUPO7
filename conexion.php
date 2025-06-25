<?php
// Conexion a la base de datos 
// Credenciales de la base de datos
define('DB_HOST', 'localhost');                 
define('DB_USER', 'root');             
define('DB_PASS', 'via123');         
define('DB_NAME', 'vias_seguras');       

// Intentar la conexion
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Verificar la conexion
if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor.']);
    exit(); // Terminar el script si la conexion falla
}

// Opcional: Establecer el conjunto de caracteres a UTF-8
$conn->set_charset("utf8mb4");

?>