<?php

// Muestra los errores de PHP en la respuesta esencial para la etapa de desarrollo para saber donde pueden estar los errores
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
// Reporta todos los tipos de errores de PHP.
error_reporting(E_ALL);

// Estas cabeceras son cruciales para que la comunicación entre JavaScript y PHP funcione
header('Content-Type: application/json');                                   // Avisa al navegador que la respuesta de este script siempre será en formato JSON.
header('Access-Control-Allow-Origin: *');                                   // Para desarrollo. En produccion, usa tu dominio real.
header('Access-Control-Allow-Methods: POST, OPTIONS');                      // Define los métodos que este script acepta
header('Access-Control-Allow-Headers: Content-Type, Authorization');        // Define las cabeceras que el navegador tiene permitido enviar en su peticion.

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); 
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit();
}

require_once 'conexion.php';

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['nombre']) || empty($data['apellido']) || empty($data['email']) || empty($data['password'])) {
    http_response_code(400); 
    echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios.']);
    exit();
}

$nombre = trim($data['nombre']);
$apellido = trim($data['apellido']);
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$password = $data['password'];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Formato de correo electrónico inválido.']);
    exit();
}

if (strlen($password) < 8) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'La contraseña debe tener al menos 8 caracteres.']);
    exit();
}

$password_hash = password_hash($password, PASSWORD_BCRYPT);

// ==================== INICIO DE LA CORRECCIÓN ====================
// Se añade el campo 'id_rango' a la consulta INSERT
$sql = "INSERT INTO usuarios (nombre, apellido, email, password_hash, id_rango) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al preparar la consulta: ' . $conn->error]);
    exit();
}

// Se define el ID del rango por defecto (1 = Novato)
$id_rango_default = 1;

// Se vincula el nuevo parámetro 'id_rango'. Nota el 'i' al final para indicar que es un entero.
$stmt->bind_param("ssssi", $nombre, $apellido, $email, $password_hash, $id_rango_default);
// ==================== FIN DE LA CORRECCIÓN ====================

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => '¡Registro exitoso! Ahora puedes iniciar sesión.']);
} else {
    if ($conn->errno == 1062) { 
        http_response_code(409); 
        echo json_encode(['success' => false, 'message' => 'Este correo electrónico ya está registrado.']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al registrar el usuario: ' . $stmt->error]);
    }
}

$stmt->close();
$conn->close();

?>