

<?php
// get_map_incidents.php
// 1. INICIAR LA SESIÓN PRIMERO QUE NADA
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

// Validaciones básicas
if (empty($data['id_usuario']) || empty($data['descripcion']) || 
    empty($data['latitud']) || empty($data['longitud'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Datos obligatorios faltantes.']);
    exit();
}

$id_usuario = (int)$data['id_usuario'];
$descripcion = trim($data['descripcion']);
$latitud = (float)$data['latitud'];
$longitud = (float)$data['longitud'];
$prioridad = isset($data['prioridad']) ? $data['prioridad'] : 'info';
$id_tipo_incidente = isset($data['id_tipo_incidente']) ? (int)$data['id_tipo_incidente'] : 6;
$provincia = isset($data['provincia']) ? $data['provincia'] : '';
$canton = isset($data['canton']) ? $data['canton'] : '';
$distrito = isset($data['distrito']) ? $data['distrito'] : '';

// Validar coordenadas
if ($latitud < -90 || $latitud > 90 || $longitud < -180 || $longitud > 180) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Coordenadas inválidas.']);
    exit();
}

// Validar prioridad
if (!in_array($prioridad, ['info', 'precaucion', 'urgente'])) {
    $prioridad = 'info';
}

try {
    $conn->begin_transaction();
    
    // Si no se proporcionaron provincia/cantón, intentar obtenerlos por geocodificación reversa
    if (empty($provincia) || empty($canton)) {
        // Aquí podrías implementar geocodificación reversa
        // Por ahora, usar valores por defecto
        $provincia = $provincia ?: 'Sin especificar';
        $canton = $canton ?: 'Sin especificar';
    }
    
    // Insertar el reporte
    $stmt = $conn->prepare("
        INSERT INTO reportes (
            id_usuario, id_tipo_incidente, descripcion, prioridad, 
            provincia, canton, distrito, latitud, longitud
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->bind_param("iisssssdd", 
        $id_usuario, $id_tipo_incidente, $descripcion, $prioridad,
        $provincia, $canton, $distrito, $latitud, $longitud
    );
    
    if (!$stmt->execute()) {
        throw new Exception('Error al crear el incidente: ' . $stmt->error);
    }
    
    $id_reporte = $conn->insert_id;
    
    // Sistema de puntos
    $puntos_por_reporte = 10;
    
    // Bonificación por prioridad
    switch ($prioridad) {
        case 'urgente':
            $puntos_por_reporte += 15;
            break;
        case 'precaucion':
            $puntos_por_reporte += 5;
            break;
    }
    
    // Bonificación por incluir coordenadas precisas
    $puntos_por_reporte += 5;
    
    // Actualizar puntos del usuario
    $stmt_puntos = $conn->prepare("UPDATE usuarios SET puntos = puntos + ? WHERE id = ?");
    $stmt_puntos->bind_param("ii", $puntos_por_reporte, $id_usuario);
    $stmt_puntos->execute();
    
    // Registrar en historial de puntos
    $razon = "Incidente creado desde mapa (prioridad: $prioridad)";
    $stmt_historial = $conn->prepare("
        INSERT INTO historial_puntos (id_usuario, puntos_ganados, razon, id_reporte) 
        VALUES (?, ?, ?, ?)
    ");
    $stmt_historial->bind_param("iisi", $id_usuario, $puntos_por_reporte, $razon, $id_reporte);
    $stmt_historial->execute();
    
    $conn->commit();
    
    echo json_encode([
        'success' => true,
        'message' => "Incidente creado exitosamente. Has ganado $puntos_por_reporte puntos.",
        'data' => [
            'id_reporte' => $id_reporte,
            'puntos_ganados' => $puntos_por_reporte,
            'latitud' => $latitud,
            'longitud' => $longitud
        ]
    ]);

} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error del servidor: ' . $e->getMessage()]);
}

$conn->close();
?>