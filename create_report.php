<?php
// create_report.php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once 'conexion.php'; // Este archivo ya maneja la sesión.

$coordenadas_provincias = [
    'San José' => ['lat' => 9.9333, 'lng' => -84.0833],
    'Alajuela' => ['lat' => 10.0162, 'lng' => -84.2163],
    'Cartago' => ['lat' => 9.8634, 'lng' => -83.9194],
    'Heredia' => ['lat' => 10.0024, 'lng' => -84.1165],
    'Guanacaste' => ['lat' => 10.4285, 'lng' => -85.3968],
    'Puntarenas' => ['lat' => 9.9763, 'lng' => -84.8388],
    'Limón' => ['lat' => 9.9907, 'lng' => -83.0355]
];

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verificación de Seguridad
if (!isset($_SESSION['user_id'])) {
    http_response_code(401); 
    echo json_encode(['success' => false, 'message' => 'Debes iniciar sesión para poder reportar.']);
    exit();
}

// Validación de Datos
$required_fields = ['descripcion', 'prioridad', 'provincia', 'canton'];
foreach ($required_fields as $field) {
    if (empty($_POST[$field])) {
        http_response_code(400); 
        echo json_encode(['success' => false, 'message' => "El campo '$field' es obligatorio."]);
        exit();
    }
}

// Recopilación de Datos
$id_usuario = $_SESSION['user_id'];
$descripcion = trim($_POST['descripcion']);
$prioridad = trim($_POST['prioridad']);
$provincia = trim($_POST['provincia']);
$canton = trim($_POST['canton']);
$distrito = !empty($_POST['distrito']) ? trim($_POST['distrito']) : null;
$id_tipo_incidente = 6; // Por defecto "Otro"

// ==================== INICIO DE LA CORRECCIÓN #1 ====================
// Recibimos la latitud y longitud que envía el frontend.
$latitud = !empty($_POST['latitud']) ? (float)$_POST['latitud'] : null;
$longitud = !empty($_POST['longitud']) ? (float)$_POST['longitud'] : null;
// ==================== FIN DE LA CORRECCIÓN #1 ====================

// Manejo de Imagen
$url_imagen = null;
if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] == 0) {
    $upload_dir = 'uploads/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    $file_name = uniqid() . '-' . basename($_FILES['imagen']['name']);
    $target_file = $upload_dir . $file_name;
    if (move_uploaded_file($_FILES['imagen']['tmp_name'], $target_file)) {
        $url_imagen = $file_name;
    }
}

define('PUNTOS_POR_REPORTE', 10);

try {
    $conn->begin_transaction();

    // 1. Insertar el reporte
    $id_estado = 1; // "Recibido"
    // ==================== INICIO DE LA CORRECCIÓN #2 ====================
    // Añadimos las columnas latitud y longitud a la consulta INSERT.
    $sql_reporte = "INSERT INTO reportes (id_usuario, id_tipo_incidente, id_estado, descripcion, prioridad, provincia, canton, distrito, imagen, latitud, longitud) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt_reporte = $conn->prepare($sql_reporte);
    // Añadimos los tipos ('dd' para double/float) y las variables de latitud y longitud.
    $stmt_reporte->bind_param("iiissssssdd", $id_usuario, $id_tipo_incidente, $id_estado, $descripcion, $prioridad, $provincia, $canton, $distrito, $url_imagen, $latitud, $longitud);
    // ==================== FIN DE LA CORRECCIÓN #2 ====================
    
    $stmt_reporte->execute();
    $nuevo_reporte_id = $conn->insert_id;
    $stmt_reporte->close();

    // 2. Actualizar puntos del usuario
    $puntos_a_sumar = PUNTOS_POR_REPORTE;
    $sql_puntos_usuario = "UPDATE usuarios SET puntos_totales = puntos_totales + ? WHERE id = ?";
    $stmt_puntos_usuario = $conn->prepare($sql_puntos_usuario);
    $stmt_puntos_usuario->bind_param("ii", $puntos_a_sumar, $id_usuario);
    $stmt_puntos_usuario->execute();
    $stmt_puntos_usuario->close();

    // 3. Registrar en historial de puntos
    $razon_puntos = "Creación de nuevo reporte";
    $sql_historial = "INSERT INTO historial_puntos (id_usuario, puntos_cambio, razon, referencia_id) VALUES (?, ?, ?, ?)";
    $stmt_historial = $conn->prepare($sql_historial);
    $stmt_historial->bind_param("iisi", $id_usuario, $puntos_a_sumar, $razon_puntos, $nuevo_reporte_id);
    $stmt_historial->execute();
    $stmt_historial->close();
    
    // 4. Obtener el nuevo total de puntos para devolverlo al frontend
    $sql_get_puntos = "SELECT puntos_totales FROM usuarios WHERE id = ?";
    $stmt_get_puntos = $conn->prepare($sql_get_puntos);
    $stmt_get_puntos->bind_param("i", $id_usuario);
    $stmt_get_puntos->execute();
    $result_puntos = $stmt_get_puntos->get_result();
    $nuevos_puntos = $result_puntos->fetch_assoc()['puntos_totales'];
    $stmt_get_puntos->close();
    
    $conn->commit();
    
    echo json_encode([
        'success' => true, 
        'message' => '¡Reporte enviado! Has ganado ' . PUNTOS_POR_REPORTE . ' puntos.',
        'nuevos_puntos' => $nuevos_puntos
    ]);

} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error del servidor: ' . $e->getMessage()]);
}

$conn->close();
?>