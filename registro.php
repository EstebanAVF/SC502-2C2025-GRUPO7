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
session_start();

// Obtener los datos JSON de la solicitud
$input = file_get_contents('php://input');      // Lee el cuerpo de la peticion que contiene los datos JSON enviados desde JavaScript
$data = json_decode($input, true);              // Convierte el texto JSON en un array asociativo de PHP


// Validar que los datos esperados esten presentes
if (empty($data['nombre']) || empty($data['apellido']) || empty($data['email']) || empty($data['password'])) {
    // Si falta algun dato, responde con error 400 (Peticion Incorrecta)
    http_response_code(400); 
    echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios.']);
    exit();
}

// LIMPIAR y obtener los datos.
// Quita espacios en blanco al inicio y al final.
$nombre = trim($data['nombre']);
$apellido = trim($data['apellido']);
// Quita espacios y luego elimina caracteres no validos para un email.
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
// Obtiene la contrasena tal como viene para validarla.
$password = $data['password'];

// Validaciones adicionales basicas
// Despues de limpiar el email, verifica que su formato sea valido (contenga @, . etc).
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Formato de correo electrónico inválido.']);
    exit();
}
// Verifica que la contrasena cumpla con un largo minimo.
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
    // El codigo de error 1062 en MySQL significa "entrada duplicada" para una clave unica.
    if ($conn->errno == 1062) { 
        http_response_code(409); 
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