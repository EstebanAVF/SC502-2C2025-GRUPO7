<?php
// get_reports.php - VERSIÓN CORREGIDA Y MEJORADA
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Configurar errores según el entorno
if ($_SERVER['HTTP_HOST'] === 'localhost' || strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false) {
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    error_reporting(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Incluir conexión
    require_once 'conexion.php';

    // Verificar conexión
    if (!isset($conn) || $conn->connect_error) {
        throw new Exception('Error de conexión: ' . ($conn->connect_error ?? 'Conexión no disponible'));
    }
    
    error_log("GET_REPORTS: Iniciando consulta de reportes");
    
    $sql = "
        SELECT 
            r.id,
            r.descripcion,
            r.prioridad,
            r.provincia,
            r.canton,
            r.distrito,
            r.latitud,
            r.longitud,
            r.imagen,
            r.votos_positivos,
            r.votos_negativos,
            r.created_at,
            
            -- Datos del usuario
            u.nombre AS usuario_nombre,
            u.apellido AS usuario_apellido,
            u.user_rank AS usuario_rango,
            
            -- Datos del tipo de incidente
            ti.nombre AS tipo_incidente_nombre,
            ti.icono_clase_css,
            ti.descripcion AS tipo_descripcion,
            
            -- Campos calculados
            (r.votos_positivos - r.votos_negativos) AS balance_votos,
            CASE 
                WHEN (r.votos_positivos + r.votos_negativos) > 0 
                THEN ROUND((r.votos_positivos * 100.0) / (r.votos_positivos + r.votos_negativos), 1)
                ELSE 0 
            END AS popularidad,
            
            -- Estado del reporte
            CASE 
                WHEN (SELECT COUNT(*) FROM informes_reportes ir WHERE ir.id_reporte = r.id) >= 3 
                THEN 'bajo_revision'
                WHEN (r.votos_positivos - r.votos_negativos) >= 5 
                THEN 'confiable'
                WHEN (r.votos_negativos - r.votos_positivos) >= 3 
                THEN 'dudoso'
                ELSE 'normal'
            END AS estado_reporte,
            
            -- Total de informes
            (SELECT COUNT(*) FROM informes_reportes ir WHERE ir.id_reporte = r.id) AS total_informes
            
        FROM reportes AS r
        LEFT JOIN usuarios AS u ON r.id_usuario = u.id
        LEFT JOIN tipos_incidente AS ti ON r.id_tipo_incidente = ti.id
        ORDER BY r.created_at DESC
        LIMIT 100
    ";

    $result = $conn->query($sql);
    
    if (!$result) {
        throw new Exception('Error en la consulta SQL: ' . $conn->error);
    }

    $reports = [];
    while ($row = $result->fetch_assoc()) {
        // Procesar imagen - construir URL completa si existe
        if ($row['imagen'] && $row['imagen'] !== 'NULL' && trim($row['imagen']) !== '') {
            // La ruta de la imagen ya está como 'uploads/filename.ext'
            // No la modificamos aquí, el frontend construirá la URL completa
            $row['imagen_url'] = $row['imagen']; // Mantener compatibilidad
        } else {
            $row['imagen'] = null;
            $row['imagen_url'] = null;
        }
        
        // Asegurar tipos de datos correctos
        $row['id'] = (int)$row['id'];
        $row['votos_positivos'] = (int)$row['votos_positivos'];
        $row['votos_negativos'] = (int)$row['votos_negativos'];
        $row['balance_votos'] = (int)$row['balance_votos'];
        $row['popularidad'] = (float)$row['popularidad'];
        $row['total_informes'] = (int)$row['total_informes'];
        $row['latitud'] = $row['latitud'] ? (float)$row['latitud'] : null;
        $row['longitud'] = $row['longitud'] ? (float)$row['longitud'] : null;
        
        $reports[] = $row;
    }
    
    error_log("GET_REPORTS: Devolviendo " . count($reports) . " reportes");
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'count' => count($reports),
        'data' => $reports,
        'message' => 'Reportes cargados exitosamente',
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    error_log("GET_REPORTS ERROR: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Error del servidor: ' . $e->getMessage(),
        'data' => [],
        'count' => 0,
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE);
    
} finally {
    if (isset($conn) && $conn) {
        $conn->close();
    }
}
?>