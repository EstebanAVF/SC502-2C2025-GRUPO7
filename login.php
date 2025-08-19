<?php
// Muestra los errores de PHP en la respuesta, esencial para desarrollo.
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// NO se incluye session_start(); aquí, ya que es probable que conexion.php lo maneje.

// Cabeceras para la comunicación entre JavaScript y PHP.
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejo de la petición pre-vuelo OPTIONS.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir el archivo de conexión a la base de datos.
require_once 'conexion.php';

// Obtener los datos JSON de la solicitud.
$data = json_decode(file_get_contents('php://input'), true);

// Validar que los datos esperados estén presentes.
if (empty($data['email']) || empty($data['password'])) {
    http_response_code(400); 
    echo json_encode(['success' => false, 'message' => 'Correo electrónico y contraseña son obligatorios.']);
    exit();
}

$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$password = $data['password'];

try {
    // Consulta SQL que une usuarios y rangos para obtener toda la información.
    $sql = "SELECT 
                u.id, 
                u.nombre, 
                u.apellido, 
                u.email, 
                u.password_hash,
                u.puntos_totales,
                r.nombre_rango 
            FROM usuarios u
            LEFT JOIN rangos r ON u.id_rango = r.id
            WHERE u.email = ? 
            LIMIT 1";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception('Error al preparar la consulta: ' . $conn->error);
    }
    
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password_hash'])) {
            // La sesión ya está iniciada por conexion.php, así que la usamos directamente.
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_nombre'] = $user['nombre'];

            // Respuesta JSON completa con puntos y rango.
            echo json_encode([
                'success' => true,
                'message' => '¡Inicio de sesión exitoso!',
                'user' => [
                    'id' => $user['id'],
                    'nombre' => $user['nombre'],
                    'apellido' => $user['apellido'],
                    'email' => $user['email'],
                    'puntos_totales' => $user['puntos_totales'],
                    'nombre_rango' => $user['nombre_rango'] ?? 'Novato'
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta.']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Correo electrónico no registrado.']);
    }
    
    $stmt->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error del servidor: ' . $e->getMessage()]);
}

$conn->close();
?>