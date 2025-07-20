<?php
// Muestra los errores de PHP en la respuesta esencial para la etapa de desarrollo para saber donde pueden estar los errores
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
// Reporta todos los tipos de errores de PHP.
error_reporting(E_ALL);

// Estas cabeceras son cruciales para que la comunicación entre JavaScript y PHP funcione
header('Content-Type: application/json');                                   // Avisa al navegador que la respuesta de este script siempre será en formato JSON.
header('Access-Control-Allow-Origin: *');                                   // Para desarrollo. En produccion, usa tu dominio real.
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');                 // Define los métodos que este script acepta
header('Access-Control-Allow-Headers: Content-Type, Authorization');        // Define las cabeceras que el navegador tiene permitido enviar en su peticion.

// El navegador puede enviar una peticion OPTIONS (preflight) antes de la peticion POST.
// Respondemos a esta peticion y terminamos el script.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Responde con un código 200 (OK) para indicar que la futura petición POST está permitida
    http_response_code(200);
    exit();
}

// A partir de aqui, el codigo solo se ejecutara si el método NO es OPTIONS.
// verificamos que la solicitud sea POST.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    // Si el método no es POST, se envía un código de error 405 (Método no Permitido).
    http_response_code(405); 
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit();
}

// Incluir el archivo de conexion a la base de datos
require_once 'conexion.php';

// Iniciar sesión PHP
// Esto permite al servidor "recordar" a un usuario a traves de diferentes paginas o peticiones
// usando la superglobal $_SESSION.
session_start();


// Obtener los datos JSON de la solicitud
$input = file_get_contents('php://input');      // Lee el cuerpo de la peticion que contiene los datos JSON enviados desde JavaScript
$data = json_decode($input, true);              // Convierte el texto JSON en un array asociativo de PHP

// Validar que los datos esperados esten presentes
// Revisa si las claves 'email' o 'password' estan vacias o no existen
if (empty($data['email']) || empty($data['password'])) {
    // devuelve un error 
    http_response_code(400); 
    // Devuelve un mensaje de error en formato JSON
    echo json_encode(['success' => false, 'message' => 'Correo electrónico y contraseña son obligatorios.']);
    exit();
}

// LIMPIAR y obtener los datos
// Elimina caracteres no validos del email para mas seguridad. 'trim' quita espacios
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
// Se obtiene la contraseña tal cual para poder verificarla.
$password = $data['password'];

// Preparar la consulta SQL para buscar el usuario por email
// Se usa una consulta preparada para prevenir ataques de inyeccion SQL. El '?' es un marcador de posicion
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
// Obtener los resultados de la consulta
$result = $stmt->get_result();

// Verificar si se encontro un usuario
if ($result->num_rows === 1) {
    // Si se encontro, convierte los datos del usuario en un array
    $user = $result->fetch_assoc();

    // Verificar la contraseña hasheada
    if (password_verify($password, $user['password_hash'])) {
        // Almacenar información del usuario en la sesión
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_nombre'] = $user['nombre'];
        $_SESSION['user_email'] = $user['email'];

         // Envia una respuesta JSON de exito al cliente (JavaScript)
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