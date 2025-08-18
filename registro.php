<?php
// Iniciar sesión al principio
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Muestra los errores de PHP en la respuesta esencial para la etapa de desarrollo
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Estas cabeceras son cruciales para que la comunicación entre JavaScript y PHP funcione
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// El navegador puede enviar una peticion OPTIONS (preflight) antes de la peticion POST
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verificamos que la solicitud sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); 
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit();
}

// Incluir el archivo de conexion a la base de datos
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
error_log("Datos recibidos: " . print_r($data, true));

// Validar que los datos JSON se decodificaron correctamente
if ($data === null) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Datos JSON inválidos.']);
    exit();
}

// Validar que los datos esperados estén presentes
if (empty($data['nombre']) || empty($data['apellido']) || empty($data['email']) || empty($data['password'])) {
    http_response_code(400); 
    echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios.']);
    exit();
}

// LIMPIAR y obtener los datos
$nombre = trim($data['nombre']);
$apellido = trim($data['apellido']);
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$password = $data['password'];

// Validaciones adicionales básicas
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

// Verificar si el email ya existe
$stmt_check = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
if (!$stmt_check) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al verificar email: ' . $conn->error]);
    exit();
}

$stmt_check->bind_param("s", $email);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

if ($result_check->num_rows > 0) {
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'Este correo electrónico ya está registrado.']);
    $stmt_check->close();
    exit();
}
$stmt_check->close();

// Hashear la contraseña antes de almacenarla
$password_hash = password_hash($password, PASSWORD_BCRYPT);

// Preparar la consulta SQL para insertar el nuevo usuario
// NOTA: 'fecha_registro' se establece con NOW() directamente en la consulta, no se bindea.
$stmt = $conn->prepare("INSERT INTO usuarios (nombre, apellido, email, password_hash, fecha_registro) VALUES (?, ?, ?, ?, NOW())");

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al preparar la consulta: ' . $conn->error]);
    exit();
}

// Vincular parámetros a la consulta (solo los 4 primeros, ya que NOW() no es un parámetro bindeado)
$stmt->bind_param("ssss", $nombre, $apellido, $email, $password_hash);

// Ejecutar la consulta
if ($stmt->execute()) {
    // Obtener el ID del usuario recién creado
    $user_id = $conn->insert_id;
    
    // Registro exitoso
    echo json_encode([
        'success' => true, 
        'message' => '¡Registro exitoso! Ahora puedes iniciar sesión.',
        'user_id' => $user_id
    ]);
} else {
    // Error al ejecutar la consulta
    if ($conn->errno == 1062) { 
        http_response_code(409); 
        echo json_encode(['success' => false, 'message' => 'Este correo electrónico ya está registrado.']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al registrar el usuario: ' . $stmt->error]);
    }
}

// Cerrar la sentencia y la conexión
$stmt->close();
$conn->close();
?>
