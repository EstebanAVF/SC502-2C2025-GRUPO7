<?php
// get_user_points.php
// Este script obtiene los puntos de un usuario y su rango, así como el historial de puntos
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'conexion.php';

$id_usuario = isset($_GET['id_usuario']) ? (int)$_GET['id_usuario'] : 0;

if ($id_usuario <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID de usuario inválido.']);
    exit();
}

try {
    // Obtener información del usuario con su rango
    $stmt = $conn->prepare("
        SELECT u.puntos, u.user_rank, r.descripcion as rango_descripcion, r.minimo_puntos
        FROM usuarios u 
        LEFT JOIN rangos_usuarios r ON u.user_rank = r.nombre_rango 
        WHERE u.id = ?
    ");
    $stmt->bind_param("i", $id_usuario);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado.']);
        exit();
    }
    
    $usuario_data = $result->fetch_assoc();
    
    // Obtener el siguiente rango
    $stmt_siguiente = $conn->prepare("
        SELECT nombre_rango, minimo_puntos 
        FROM rangos_usuarios 
        WHERE minimo_puntos > ? 
        ORDER BY minimo_puntos ASC 
        LIMIT 1
    ");
    $stmt_siguiente->bind_param("i", $usuario_data['puntos']);
    $stmt_siguiente->execute();
    $siguiente_rango = $stmt_siguiente->get_result()->fetch_assoc();
    
    // Obtener historial de puntos reciente
    $stmt_historial = $conn->prepare("
        SELECT puntos_ganados, razon, created_at 
        FROM historial_puntos 
        WHERE id_usuario = ? 
        ORDER BY created_at DESC 
        LIMIT 10
    ");
    $stmt_historial->bind_param("i", $id_usuario);
    $stmt_historial->execute();
    $historial = $stmt_historial->get_result()->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => [
            'puntos' => $usuario_data['puntos'],
            'rango_actual' => $usuario_data['user_rank'],
            'rango_descripcion' => $usuario_data['rango_descripcion'],
            'puntos_minimos_rango' => $usuario_data['minimo_puntos'],
            'siguiente_rango' => $siguiente_rango,
            'historial_puntos' => $historial
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error del servidor: ' . $e->getMessage()]);
}

$conn->close();
?>
