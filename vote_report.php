<?php
// vote_report.php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'conexion.php';

// 1. Verificación de Seguridad: El usuario DEBE haber iniciado sesión.
if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // No autorizado
    echo json_encode(['success' => false, 'message' => 'Debes iniciar sesión para votar.']);
    exit();
}

// 2. Obtener los datos enviados desde JavaScript.
$data = json_decode(file_get_contents('php://input'), true);
$id_reporte = isset($data['report_id']) ? (int)$data['report_id'] : 0;

if ($id_reporte <= 0) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'ID de reporte inválido.']);
    exit();
}

$id_usuario = $_SESSION['user_id'];
$tipo_voto = 'like'; // Por ahora, solo manejamos 'likes'.

try {
    // Usamos INSERT IGNORE para evitar errores si el usuario ya votó.
    // La restricción UNIQUE en la tabla `votos` (id_reporte, id_usuario) se encarga de esto.
    $sql = "INSERT IGNORE INTO votos (id_reporte, id_usuario, tipo_voto) VALUES (?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception('Error al preparar la consulta de voto: ' . $conn->error);
    }
    
    $stmt->bind_param("iis", $id_reporte, $id_usuario, $tipo_voto);
    
    if ($stmt->execute()) {
        // `affected_rows` nos dice si la inserción fue exitosa (1) o ignorada (0).
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => '¡Voto registrado con éxito!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Ya has votado por este reporte.']);
        }
    } else {
        throw new Exception('No se pudo registrar el voto.');
    }
    
    $stmt->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error del servidor: ' . $e->getMessage()]);
}

$conn->close();
?>