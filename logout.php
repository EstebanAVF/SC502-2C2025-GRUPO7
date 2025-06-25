<?php
// logout.php

header('Content-Type: application/json'); // Indicar que la respuesta es JSON
header('Access-Control-Allow-Origin: *'); // Ajustar para produccion
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar solicitudes OPTIONS 
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start(); // Inicia la sesion

// Destruir todas las variables de sesion
$_SESSION = array();

// Al destruir la sesion completamente, también borre la cookie de sesion
// Esto destruira la sesion, y no la informacion de la sesion
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Finalmente, destruir la sesion
session_destroy();

echo json_encode(['success' => true, 'message' => 'Sesión cerrada exitosamente.']);
exit();

?>