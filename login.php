<?php
// login.php
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
$data = json_decode($input, true);

// Validar que los datos esperados esten presentes
if (empty($data['email']) || empty($data['password'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Correo electrónico y contraseña son obligatorios.']);
    exit();
}

// SANITIZAR y obtener los datos
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$password = $data['password'];

// Preparar la consulta SQL para buscar el usuario por email
$stmt = $conn->prepare("SELECT id, nombre, apellido, email, password_hash FROM usuarios WHERE email = ?");

// Verificar si la preparacion de la consulta fallo
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al preparar la consulta: ' . $conn->error]);
    exit();
}

// Vincular el parametro email
$stmt->bind_param("s", $email);

// Ejecutar la consulta
$stmt->execute();
$result = $stmt->get_result();

// Verificar si se encontro un usuario
if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // Verificar la contraseña hasheada
    if (password_verify($password, $user['password_hash'])) {
        // Contraseña correcta: Iniciar sesión

        // Opcional: Almacenar información del usuario en la sesión
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_nombre'] = $user['nombre'];
        $_SESSION['user_email'] = $user['email'];

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
        http_response_code(401); // no autorizado
        echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta.']);
    }
} else {
    // Usuario no encontrado
    http_response_code(401); // Unauthorized
    echo json_encode(['success' => false, 'message' => 'Correo electrónico no registrado.']);
}

// Cerrar la sentencia y la conexion
$stmt->close();
$conn->close();
?>