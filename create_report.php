<?php
// create_report.php - VERSIÓN CORREGIDA
// Configurar headers antes que nada
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Configurar para mostrar errores (solo en desarrollo) 
if ($_SERVER['HTTP_HOST'] === 'localhost' || strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);
    error_reporting(0);
}

// Manejar OPTIONS request (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit();
}

try {
    // Incluir conexión
    if (!file_exists('conexion.php')) {
        throw new Exception('Archivo de conexión no encontrado');
    }
    
    require_once 'conexion.php';
    
    // Verificar que la conexión existe
    if (!isset($conn) || !$conn) {
        throw new Exception('Error de conexión a la base de datos');
    }

    // Log para debug
    error_log("CREATE_REPORT: Iniciando procesamiento");
    error_log("CREATE_REPORT: POST data: " . print_r($_POST, true));
    error_log("CREATE_REPORT: FILES data: " . print_r($_FILES, true));

    // Validaciones básicas
    $campos_requeridos = ['descripcion', 'provincia', 'canton', 'id_usuario'];
    foreach ($campos_requeridos as $campo) {
        if (empty($_POST[$campo])) {
            throw new Exception("Campo requerido faltante: $campo");
        }
    }

    // Obtener y limpiar datos
    $id_usuario = (int)$_POST['id_usuario'];
    $descripcion = trim($_POST['descripcion']);
    $prioridad = isset($_POST['prioridad']) ? trim($_POST['prioridad']) : 'info';
    $provincia = trim($_POST['provincia']);
    $canton = trim($_POST['canton']);
    $distrito = isset($_POST['distrito']) ? trim($_POST['distrito']) : '';
    $latitud = isset($_POST['latitud']) && $_POST['latitud'] !== '' ? (float)$_POST['latitud'] : null;
    $longitud = isset($_POST['longitud']) && $_POST['longitud'] !== '' ? (float)$_POST['longitud'] : null;
    $id_tipo_incidente = isset($_POST['id_tipo_incidente']) ? (int)$_POST['id_tipo_incidente'] : 6;

    // Validar que el usuario existe
    $stmt_user_check = $conn->prepare("SELECT id, nombre FROM usuarios WHERE id = ?");
    if (!$stmt_user_check) {
        throw new Exception('Error preparando validación de usuario: ' . $conn->error);
    }
    
    $stmt_user_check->bind_param("i", $id_usuario);
    $stmt_user_check->execute();
    $user_result = $stmt_user_check->get_result();
    
    if ($user_result->num_rows === 0) {
        throw new Exception('Usuario no válido o no encontrado');
    }
    
    $usuario_data = $user_result->fetch_assoc();
    error_log("CREATE_REPORT: Usuario válido: " . $usuario_data['nombre']);

    // Validar prioridad
    if (!in_array($prioridad, ['info', 'precaucion', 'urgente'])) {
        $prioridad = 'info';
    }

    // Manejo de imagen mejorado
    $imagen_path = null;
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
        
        error_log("CREATE_REPORT: Procesando imagen...");
        
        // Validar tipo de archivo
        $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        $file_type = $_FILES['imagen']['type'];
        $file_info = pathinfo($_FILES['imagen']['name']);
        $file_extension = strtolower($file_info['extension']);
        
        // Validación adicional por extensión
        if (!in_array($file_type, $allowed_types) && !in_array($file_extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
            throw new Exception('Tipo de archivo no permitido. Solo se permiten imágenes JPG, PNG, GIF, WEBP.');
        }
        
        // Validar tamaño (máximo 5MB)
        if ($_FILES['imagen']['size'] > 5 * 1024 * 1024) {
            throw new Exception('El archivo es demasiado grande. Máximo 5MB.');
        }
        
        // Crear directorio uploads si no existe
        $upload_dir = __DIR__ . '/uploads/';
        if (!file_exists($upload_dir)) {
            if (!mkdir($upload_dir, 0755, true)) {
                error_log("CREATE_REPORT: Error creando directorio uploads");
                throw new Exception('No se pudo crear el directorio de uploads');
            }
        }
        
        // Generar nombre único y seguro
        $filename = 'report_' . date('Ymd_His') . '_' . uniqid() . '.' . $file_extension;
        $target_path = $upload_dir . $filename;
        
        error_log("CREATE_REPORT: Intentando mover archivo a: " . $target_path);
        
        if (move_uploaded_file($_FILES['imagen']['tmp_name'], $target_path)) {
            $imagen_path = 'uploads/' . $filename;
            error_log("CREATE_REPORT: Imagen guardada exitosamente: " . $imagen_path);
        } else {
            error_log("CREATE_REPORT: Error moviendo archivo de imagen");
            throw new Exception('Error al guardar la imagen');
        }
        
    } elseif (isset($_FILES['imagen']) && $_FILES['imagen']['error'] !== UPLOAD_ERR_NO_FILE) {
        error_log("CREATE_REPORT: Error en upload de imagen: " . $_FILES['imagen']['error']);
        throw new Exception('Error al subir la imagen: código ' . $_FILES['imagen']['error']);
    }

    // Iniciar transacción
    $conn->begin_transaction();

    try {
        // Preparar statement para insertar el reporte
        $sql_insert = "
            INSERT INTO reportes (
                id_usuario, id_tipo_incidente, descripcion, prioridad, 
                provincia, canton, distrito, latitud, longitud, imagen
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ";

        $stmt = $conn->prepare($sql_insert);
        if (!$stmt) {
            throw new Exception('Error preparando consulta: ' . $conn->error);
        }

        $stmt->bind_param(
            "iisssssdds",
            $id_usuario,
            $id_tipo_incidente,
            $descripcion,
            $prioridad,
            $provincia,
            $canton,
            $distrito,
            $latitud,
            $longitud,
            $imagen_path
        );

        if (!$stmt->execute()) {
            throw new Exception('Error ejecutando consulta: ' . $stmt->error);
        }

        $id_reporte = $conn->insert_id;
        error_log("CREATE_REPORT: Reporte creado con ID: " . $id_reporte);

        // Sistema de puntos
        $puntos_por_reporte = 10;

        switch ($prioridad) {
            case 'urgente':
                $puntos_por_reporte += 15;
                break;
            case 'precaucion':
                $puntos_por_reporte += 5;
                break;
        }

        if ($imagen_path) {
            $puntos_por_reporte += 5;
        }

        if ($latitud && $longitud && $latitud != 0 && $longitud != 0) {
            $puntos_por_reporte += 5;
        }

        // Actualizar puntos del usuario
        $stmt_puntos = $conn->prepare("UPDATE usuarios SET puntos = puntos + ? WHERE id = ?");
        if (!$stmt_puntos) {
            throw new Exception('Error preparando actualización de puntos: ' . $conn->error);
        }
        
        $stmt_puntos->bind_param("ii", $puntos_por_reporte, $id_usuario);
        if (!$stmt_puntos->execute()) {
            throw new Exception('Error actualizando puntos: ' . $stmt_puntos->error);
        }

        // Registrar en historial de puntos
        $razon = "Reporte creado (prioridad: $prioridad)";
        $stmt_historial = $conn->prepare("
            INSERT INTO historial_puntos (id_usuario, puntos_ganados, razon, id_reporte) 
            VALUES (?, ?, ?, ?)
        ");
        
        if ($stmt_historial) {
            $stmt_historial->bind_param("iisi", $id_usuario, $puntos_por_reporte, $razon, $id_reporte);
            if (!$stmt_historial->execute()) {
                error_log("CREATE_REPORT: Error en historial de puntos: " . $stmt_historial->error);
            }
        }

        // Commit de la transacción
        $conn->commit();
        
        error_log("CREATE_REPORT: Transacción completada exitosamente");

        // Respuesta exitosa
        echo json_encode([
            'success' => true,
            'message' => "Reporte creado exitosamente. Has ganado $puntos_por_reporte puntos.",
            'data' => [
                'id_reporte' => $id_reporte,
                'puntos_ganados' => $puntos_por_reporte,
                'imagen_path' => $imagen_path
            ]
        ]);

    } catch (Exception $e) {
        // Rollback de la transacción
        $conn->rollback();
        throw $e;
    }

} catch (Exception $e) {
    // Eliminar imagen si se subió pero falló la BD
    if (isset($imagen_path) && $imagen_path && file_exists(__DIR__ . '/' . $imagen_path)) {
        unlink(__DIR__ . '/' . $imagen_path);
        error_log("CREATE_REPORT: Imagen eliminada por error en BD");
    }

    // Log del error completo
    error_log("CREATE_REPORT ERROR: " . $e->getMessage());
    error_log("CREATE_REPORT STACK: " . $e->getTraceAsString());

    // Respuesta de error
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Error del servidor: ' . $e->getMessage()
    ]);
    
} finally {
    // Cerrar conexión
    if (isset($conn) && $conn) {
        $conn->close();
    }
}
?>