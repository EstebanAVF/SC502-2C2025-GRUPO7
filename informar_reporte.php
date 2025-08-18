<?php
// informar_reporte.php
// Configurar para mostrar errores (solo en desarrollo)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

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

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (empty($data['id_usuario']) || empty($data['id_reporte']) || empty($data['motivo'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Datos incompletos.']);
    exit();
}

$id_usuario = (int)$data['id_usuario'];
$id_reporte = (int)$data['id_reporte'];
$motivo = $data['motivo'];
$descripcion = isset($data['descripcion']) ? $data['descripcion'] : '';

$motivos_validos = ['spam', 'contenido_inapropiado', 'informacion_falsa', 'duplicado', 'otro'];
if (!in_array($motivo, $motivos_validos)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Motivo de informe inválido.']);
    exit();
}

try {
    // Verificar si el usuario ya informó este reporte
    $stmt_check = $conn->prepare("SELECT id FROM informes_reportes WHERE id_usuario = ? AND id_reporte = ?");
    $stmt_check->bind_param("ii", $id_usuario, $id_reporte);
    $stmt_check->execute();
    
    if ($stmt_check->get_result()->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Ya has informado sobre este reporte anteriormente.']);
        exit();
    }
    
    // Insertar el informe
    $stmt = $conn->prepare("INSERT INTO informes_reportes (id_usuario, id_reporte, motivo, descripcion) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("iiss", $id_usuario, $id_reporte, $motivo, $descripcion);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Informe enviado correctamente. Será revisado por nuestro equipo.']);
    } else {
        throw new Exception('Error al insertar el informe.');
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error del servidor: ' . $e->getMessage()]);
}

$conn->close();
?>