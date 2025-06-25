<?php
// register.php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Estas cabeceras son cruciales. Se deben enviar siempre.
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Para desarrollo. En producción, usa tu dominio real.
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// El navegador puede enviar una petición OPTIONS (preflight) antes de la petición POST.
// Respondemos a esta petición y terminamos el script.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// A partir de aquí, el código solo se ejecutará si el método NO es OPTIONS.
// Ahora sí, verificamos que la solicitud sea POST.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit();
}

// Incluir el archivo de conexion a la base de datos
require_once 'conexion.php';

// Iniciar sesión PHP
session_start();

// Obtener los datos JSON de la solicitud
$input = file_get_contents('php://input');
$data = json_decode($input, true); // se coloca true para obtener un array asociativo

// Validar que los datos esperados esten presentes
if (empty($data['nombre']) || empty($data['apellido']) || empty($data['email']) || empty($data['password'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios.']);
    exit();
}

// SANITIZAR y obtener los datos
$nombre = trim($data['nombre']);
$apellido = trim($data['apellido']);
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$password = $data['password']; // La contraseña tal como viene del cliente

// Validaciones adicionales basicas
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

// Hashear la contraseña antes de almacenarla
$password_hash = password_hash($password, PASSWORD_BCRYPT); // BCRYPT es una opcion segura

// Preparar la consulta SQL para insertar el nuevo usuario
$stmt = $conn->prepare("INSERT INTO usuarios (nombre, apellido, email, password_hash) VALUES (?, ?, ?, ?)");

// Verificar si la preparacion de la consulta fallo
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al preparar la consulta: ' . $conn->error]);
    exit();
}

// Vincular parametros a la consulta
// 'ssss' indica que son 4 strings (nombre, apellido, email, password_hash)
$stmt->bind_param("ssss", $nombre, $apellido, $email, $password_hash);

// Ejecutar la consulta
if ($stmt->execute()) {
    // Registro exitoso
    echo json_encode(['success' => true, 'message' => '¡Registro exitoso! Ahora puedes iniciar sesión.']);
} else {
    // Error al ejecutar la consulta (ej. email duplicado por UNIQUE constraint)
    if ($conn->errno == 1062) { // MySQL error code for duplicate entry
        http_response_code(409); // Conflict
        echo json_encode(['success' => false, 'message' => 'Este correo electrónico ya está registrado.']);
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(['success' => false, 'message' => 'Error al registrar el usuario: ' . $stmt->error]);
    }
}

// Cerrar la sentencia y la conexión
$stmt->close();
$conn->close();

?>