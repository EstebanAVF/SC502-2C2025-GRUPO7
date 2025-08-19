<?php
// create_report.php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once 'conexion.php'; 

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401); 
    echo json_encode(['success' => false, 'message' => 'Debes iniciar sesión para poder reportar.']);
    exit();
}

$id_usuario = $_SESSION['user_id'];
$descripcion = trim($_POST['descripcion']);
$prioridad = trim($_POST['prioridad']);
$provincia = trim($_POST['provincia']);
$canton = trim($_POST['canton']);
$distrito = !empty($_POST['distrito']) ? trim($_POST['distrito']) : null;
$id_tipo_incidente = 6;
$latitud = !empty($_POST['latitud']) ? (float)$_POST['latitud'] : null;
$longitud = !empty($_POST['longitud']) ? (float)$_POST['longitud'] : null;
$url_imagen = null;

if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] == 0) {
    $upload_dir = 'uploads/';
    if (!is_dir($upload_dir)) { mkdir($upload_dir, 0777, true); }
    $file_name = uniqid() . '-' . basename($_FILES['imagen']['name']);
    $target_file = $upload_dir . $file_name;
    if (move_uploaded_file($_FILES['imagen']['tmp_name'], $target_file)) {
        $url_imagen = $file_name;
    }
}

// Para probar más rápido el cambio de rango, puedes poner un valor alto aquí temporalmente
define('PUNTOS_POR_REPORTE', 10); 

try {
    $conn->begin_transaction();

    // 1. Insertar el reporte
    $id_estado = 1;
    $sql_reporte = "INSERT INTO reportes (id_usuario, id_tipo_incidente, id_estado, descripcion, prioridad, provincia, canton, distrito, imagen, latitud, longitud) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt_reporte = $conn->prepare($sql_reporte);
    $stmt_reporte->bind_param("iiissssssdd", $id_usuario, $id_tipo_incidente, $id_estado, $descripcion, $prioridad, $provincia, $canton, $distrito, $url_imagen, $latitud, $longitud);
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
    
    // 4. Obtener el nuevo total de puntos
    $sql_get_puntos = "SELECT puntos_totales FROM usuarios WHERE id = ?";
    $stmt_get_puntos = $conn->prepare($sql_get_puntos);
    $stmt_get_puntos->bind_param("i", $id_usuario);
    $stmt_get_puntos->execute();
    $nuevos_puntos = $stmt_get_puntos->get_result()->fetch_assoc()['puntos_totales'];
    $stmt_get_puntos->close();

    // ==================== INICIO DE LA MODIFICACIÓN ====================
    // 5. Verificar y actualizar el rango del usuario
    // Se busca el rango más alto que el usuario alcanza con sus nuevos puntos
    $sql_get_rango = "SELECT id, nombre_rango FROM rangos WHERE puntos_minimos <= ? ORDER BY puntos_minimos DESC LIMIT 1";
    $stmt_get_rango = $conn->prepare($sql_get_rango);
    $stmt_get_rango->bind_param("i", $nuevos_puntos);
    $stmt_get_rango->execute();
    $result_rango = $stmt_get_rango->get_result()->fetch_assoc();
    $stmt_get_rango->close();

    $nuevo_rango_id = $result_rango['id'];
    $nuevo_rango_nombre = $result_rango['nombre_rango'];
    
    // Se actualiza el id_rango en la tabla de usuarios
    $sql_update_rango = "UPDATE usuarios SET id_rango = ? WHERE id = ?";
    $stmt_update_rango = $conn->prepare($sql_update_rango);
    $stmt_update_rango->bind_param("ii", $nuevo_rango_id, $id_usuario);
    $stmt_update_rango->execute();
    $stmt_update_rango->close();
    // ==================== FIN DE LA MODIFICACIÓN ====================
    
    $conn->commit();
    
    // Se añade 'nuevo_rango_nombre' a la respuesta para que la UI se actualice
    echo json_encode([
        'success' => true, 
        'message' => '¡Reporte enviado! Has ganado ' . PUNTOS_POR_REPORTE . ' puntos.',
        'nuevos_puntos' => $nuevos_puntos,
        'nuevo_rango_nombre' => $nuevo_rango_nombre
    ]);

} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error del servidor: ' . $e->getMessage()]);
}

$conn->close();
?>