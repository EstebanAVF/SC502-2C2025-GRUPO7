<?php
require_once 'conexion.php';

// get_reports.php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Para desarrollo. En producción, usa tu dominio real.
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Incluir el archivo de conexión a la base de datos
require_once 'conexion.php';

$reports = [];

try {
    // Esta es la consulta principal. Usamos JOIN para combinar datos de 3 tablas.
    $sql = "
        SELECT 
            r.id,
            r.descripcion,
            r.provincia,
            r.prioridad,
            r.canton,
            r.distrito,
            r.latitud,
            r.longitud,
            r.imagen,
            r.created_at,
            u.nombre AS usuario_nombre,
            u.apellido AS usuario_apellido,
            ti.nombre AS tipo_incidente_nombre,
            ti.icono_clase_css
        FROM 
            reportes AS r
        INNER JOIN 
            usuarios AS u ON r.id_usuario = u.id
        INNER JOIN 
            tipos_incidente AS ti ON r.id_tipo_incidente = ti.id
        ORDER BY 
            r.created_at DESC -- Ordenamos para mostrar los más recientes primero
    ";

    $stmt = $conn->prepare($sql);
    
    // Verificar si la preparación de la consulta falló
    if (!$stmt) {
        throw new Exception('Error al preparar la consulta: ' . $conn->error);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $reports[] = $row;
    }

    $stmt->close();
    
} catch (Exception $e) {
    // Si algo sale mal, enviamos una respuesta de error.
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error del servidor: ' . $e->getMessage()]);
    $conn->close();
    exit();
}

// Si todo va bien, enviamos los reportes.
echo json_encode($reports);
$conn->close();

?>