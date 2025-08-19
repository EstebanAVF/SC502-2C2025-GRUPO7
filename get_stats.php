<?php
// get_stats.php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'conexion.php';

function normalizarPrioridad($texto) {
    $texto_lower = strtolower($texto);
    $mapa = [
        'urgente' => 'Urgente',
        'precaucion' => 'Precaucion',
        'precaución' => 'Precaucion',
        'info' => 'Informacion',
        'informacion' => 'Informacion',
        'información' => 'Informacion'
    ];
    return $mapa[$texto_lower] ?? ucfirst($texto_lower);
}

try {
    $stats = [];

    // 1. Conteo de reportes por prioridad (Total histórico)
    $sql_prioridad = "SELECT prioridad, COUNT(*) as total FROM reportes GROUP BY prioridad";
    $result_prioridad = $conn->query($sql_prioridad);
    $por_prioridad = ['Urgente' => 0, 'Precaucion' => 0, 'Informacion' => 0];
    while($row = $result_prioridad->fetch_assoc()) {
        $prioridad_key = normalizarPrioridad($row['prioridad']);
        if (array_key_exists($prioridad_key, $por_prioridad)) {
            $por_prioridad[$prioridad_key] += (int)$row['total'];
        }
    }
    $stats['por_prioridad'] = $por_prioridad;

    // 2. Conteo de reportes por provincia
    $sql_provincia = "SELECT provincia, COUNT(*) as total FROM reportes GROUP BY provincia ORDER BY total DESC";
    $result_provincia = $conn->query($sql_provincia);
    $por_provincia = [];
    while($row = $result_provincia->fetch_assoc()) {
        $por_provincia[] = [
            'provincia' => $row['provincia'],
            'total' => (int)$row['total']
        ];
    }
    $stats['por_provincia'] = $por_provincia;

    // ==================== INICIO DE LA MODIFICACIÓN ====================
    // 3. Cálculos para el Resumen Nacional
    $resumen_nacional = [];

    // Total de incidentes de hoy (desde las 00:00:00)
    $sql_hoy = "SELECT COUNT(id) as total_hoy FROM reportes WHERE DATE(created_at) = CURDATE()";
    $result_hoy = $conn->query($sql_hoy);
    $resumen_nacional['total_hoy'] = (int)$result_hoy->fetch_assoc()['total_hoy'];

    // Provincias afectadas (contamos cuántas provincias tienen al menos 1 reporte)
    $provincias_afectadas = 0;
    foreach ($stats['por_provincia'] as $p) {
        if ($p['total'] > 0) {
            $provincias_afectadas++;
        }
    }
    $resumen_nacional['provincias_afectadas'] = $provincias_afectadas;

    // Nivel de alerta (basado en reportes urgentes de las últimas 24h)
    $sql_urgentes = "SELECT COUNT(id) as total_urgente FROM reportes WHERE (prioridad = 'urgente' OR prioridad = 'Urgente') AND created_at >= NOW() - INTERVAL 24 HOUR";
    $result_urgentes = $conn->query($sql_urgentes);
    $total_urgentes = (int)$result_urgentes->fetch_assoc()['total_urgente'];
    
    if ($total_urgentes >= 5) {
        $resumen_nacional['nivel_alerta'] = 'Alto';
    } elseif ($total_urgentes > 0) {
        $resumen_nacional['nivel_alerta'] = 'Moderado';
    } else {
        $resumen_nacional['nivel_alerta'] = 'Bajo';
    }
    
    $stats['resumen_nacional'] = $resumen_nacional;
    // ==================== FIN DE LA MODIFICACIÓN ====================


    echo json_encode(['success' => true, 'stats' => $stats]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error del servidor: ' . $e->getMessage()]);
}

$conn->close();
?>