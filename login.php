<?php
// Iniciar sesión al principio
   if (session_status() == PHP_SESSION_NONE) {
       session_start();
   }

// Muestra los errores de PHP en la respuesta
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Cabeceras para la comunicación entre JavaScript y PHP
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar petición OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verificar que la solicitud sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); 
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit();
}

// Incluir el archivo de conexion a la base de datos (solo una vez)
require_once 'conexion.php';

// Verificar que la conexión existe
if (!$conn) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos.']);
    exit();
}

// Obtener los datos JSON de la solicitud
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Debug: Log de los datos recibidos (quitar en producción)
error_log("Datos de login recibidos: " . print_r($data, true));

// Validar que los datos JSON se decodificaron correctamente
if ($data === null) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Datos JSON inválidos.']);
    exit();
}

// Validar que los datos esperados estén presentes
if (empty($data['email']) || empty($data['password'])) {
    http_response_code(400); 
    echo json_encode(['success' => false, 'message' => 'Correo electrónico y contraseña son obligatorios.']);
    exit();
}

// LIMPIAR y obtener los datos
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$password = $data['password'];

// Preparar la consulta SQL para buscar el usuario por email
$stmt = $conn->prepare("SELECT id, nombre, apellido, email, password_hash FROM usuarios WHERE email = ?");

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al preparar la consulta: ' . $conn->error]);
    exit();
}

// Vincular el parámetro email
$stmt->bind_param("s", $email);

// Ejecutar la consulta
$stmt->execute();
$result = $stmt->get_result();

// Verificar si se encontró un usuario
if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // Verificar la contraseña hasheada
    if (password_verify($password, $user['password_hash'])) {
        // Almacenar información del usuario en la sesión
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_nombre'] = $user['nombre'];
        $_SESSION['user_apellido'] = $user['apellido'];
        $_SESSION['user_email'] = $user['email'];

        // Respuesta de éxito
        echo json_encode([
            'success' => true,
            'message' => '¡Inicio de sesión exitoso!',
            'user' => [
                'id' => $user['id'],
                'nombre' => $user['nombre'],
                'apellido' => $user['apellido'],
                'email' => $user['email']
            ]
        ]);
    } else {
        // Contraseña incorrecta
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta.']);
    }
} else {
    // Usuario no encontrado
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Correo electrónico no registrado.']);
}

// Cerrar la sentencia y la conexión
$stmt->close();
$conn->close();
?>