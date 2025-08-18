<?php
// votar_reporte.php
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

if (empty($data['id_usuario']) || empty($data['id_reporte']) || empty($data['tipo_voto'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Datos incompletos.']);
    exit();
}

$id_usuario = (int)$data['id_usuario'];
$id_reporte = (int)$data['id_reporte'];
$tipo_voto = $data['tipo_voto']; // 'positivo' o 'negativo'

if (!in_array($tipo_voto, ['positivo', 'negativo'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Tipo de voto inválido.']);
    exit();
}

try {
    $conn->begin_transaction();
    
    // Verificar si el usuario ya votó este reporte
    $stmt = $conn->prepare("SELECT tipo_voto FROM votos_reportes WHERE id_usuario = ? AND id_reporte = ?");
    $stmt->bind_param("ii", $id_usuario, $id_reporte);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $voto_existente = $result->fetch_assoc()['tipo_voto'];
        
        if ($voto_existente === $tipo_voto) {
            // Si intenta votar igual que antes, eliminar el voto
            $stmt_delete = $conn->prepare("DELETE FROM votos_reportes WHERE id_usuario = ? AND id_reporte = ?");
            $stmt_delete->bind_param("ii", $id_usuario, $id_reporte);
            $stmt_delete->execute();
            
            // Actualizar contador en reportes
            $campo_restar = ($tipo_voto === 'positivo') ? 'votos_positivos' : 'votos_negativos';
            $stmt_update = $conn->prepare("UPDATE reportes SET $campo_restar = $campo_restar - 1 WHERE id = ?");
            $stmt_update->bind_param("i", $id_reporte);
            $stmt_update->execute();
            
            $mensaje = 'Voto eliminado correctamente.';
        } else {
            // Si quiere cambiar el voto, actualizar
            $stmt_update_voto = $conn->prepare("UPDATE votos_reportes SET tipo_voto = ? WHERE id_usuario = ? AND id_reporte = ?");
            $stmt_update_voto->bind_param("sii", $tipo_voto, $id_usuario, $id_reporte);
            $stmt_update_voto->execute();
            
            // Actualizar contadores
            $campo_sumar = ($tipo_voto === 'positivo') ? 'votos_positivos' : 'votos_negativos';
            $campo_restar = ($tipo_voto === 'positivo') ? 'votos_negativos' : 'votos_positivos';
            
            $stmt_counters = $conn->prepare("UPDATE reportes SET $campo_sumar = $campo_sumar + 1, $campo_restar = $campo_restar - 1 WHERE id = ?");
            $stmt_counters->bind_param("i", $id_reporte);
            $stmt_counters->execute();
            
            $mensaje = 'Voto actualizado correctamente.';
        }
    } else {
        // Nuevo voto
        $stmt_insert = $conn->prepare("INSERT INTO votos_reportes (id_usuario, id_reporte, tipo_voto) VALUES (?, ?, ?)");
        $stmt_insert->bind_param("iis", $id_usuario, $id_reporte, $tipo_voto);
        $stmt_insert->execute();
        
        // Actualizar contador
        $campo_sumar = ($tipo_voto === 'positivo') ? 'votos_positivos' : 'votos_negativos';
        $stmt_counter = $conn->prepare("UPDATE reportes SET $campo_sumar = $campo_sumar + 1 WHERE id = ?");
        $stmt_counter->bind_param("i", $id_reporte);
        $stmt_counter->execute();
        
        $mensaje = 'Voto registrado correctamente.';
        
        // Dar puntos al autor del reporte si es voto positivo
        if ($tipo_voto === 'positivo') {
            // Obtener el autor del reporte
            $stmt_autor = $conn->prepare("SELECT id_usuario FROM reportes WHERE id = ?");
            $stmt_autor->bind_param("i", $id_reporte);
            $stmt_autor->execute();
            $autor_result = $stmt_autor->get_result();
            
            if ($autor_result->num_rows > 0) {
                $id_autor = $autor_result->fetch_assoc()['id_usuario'];
                
                // Solo dar puntos si no es auto-voto
                if ($id_autor != $id_usuario) {
                    $puntos_voto_positivo = 5;
                    
                    // Actualizar puntos del autor
                    $stmt_puntos = $conn->prepare("UPDATE usuarios SET puntos = puntos + ? WHERE id = ?");
                    $stmt_puntos->bind_param("ii", $puntos_voto_positivo, $id_autor);
                    $stmt_puntos->execute();
                    
                    // Registrar en historial
                    $stmt_historial = $conn->prepare("INSERT INTO historial_puntos (id_usuario, puntos_ganados, razon, id_reporte) VALUES (?, ?, 'Voto positivo recibido', ?)");
                    $stmt_historial->bind_param("iii", $id_autor, $puntos_voto_positivo, $id_reporte);
                    $stmt_historial->execute();
                }
            }
        }
    }
    
    // Obtener contadores actualizados
    $stmt_final = $conn->prepare("SELECT votos_positivos, votos_negativos FROM reportes WHERE id = ?");
    $stmt_final->bind_param("i", $id_reporte);
    $stmt_final->execute();
    $contadores = $stmt_final->get_result()->fetch_assoc();
    
    $conn->commit();
    
    echo json_encode([
        'success' => true,
        'message' => $mensaje,
        'votos_positivos' => $contadores['votos_positivos'],
        'votos_negativos' => $contadores['votos_negativos']
    ]);

} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error del servidor: ' . $e->getMessage()]);
}

$conn->close();
?>

<?php
// informar_reporte.php
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

<?php
// get_user_points.php
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