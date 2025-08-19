<?php
// get_stats.php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'conexion.php';

// ==================== INICIO DE LA CORRECCIÓN ====================
// Función mejorada para normalizar texto. Ahora traduce "info" a "Informacion".
function normalizarPrioridad($texto) {
    $texto_lower = strtolower($texto);

    // Mapa de traducción
    $mapa = [
        'urgente' => 'Urgente',
        'precaucion' => 'Precaucion',
        'precaución' => 'Precaucion', // También maneja el acento por si acaso
        'info' => 'Informacion',
        'informacion' => 'Informacion',
        'información' => 'Informacion'
    ];

    // Si encuentra una clave en el mapa, devuelve su traducción. Si no, devuelve el texto original formateado.
    return $mapa[$texto_lower] ?? ucfirst($texto_lower);
}
// ==================== FIN DE LA CORRECCIÓN ====================

try {
    $stats = [];

    // 1. Conteo de TODOS los reportes por prioridad
    $sql_prioridad = "SELECT prioridad, COUNT(*) as total 
                      FROM reportes 
                      GROUP BY prioridad";
    
    $result_prioridad = $conn->query($sql_prioridad);
    $por_prioridad = ['Urgente' => 0, 'Precaucion' => 0, 'Informacion' => 0];
    
    while($row = $result_prioridad->fetch_assoc()) {
        // Usamos la nueva función mejorada
        $prioridad_key = normalizarPrioridad($row['prioridad']);
        
        if (array_key_exists($prioridad_key, $por_prioridad)) {
            $por_prioridad[$prioridad_key] += (int)$row['total'];
        }
    }
    $stats['por_prioridad'] = $por_prioridad;

    // 2. Conteo de reportes por provincia (esto ya está bien)
    $sql_provincia = "SELECT provincia, COUNT(*) as total 
                      FROM reportes 
                      GROUP BY provincia 
                      ORDER BY total DESC";

    $result_provincia = $conn->query($sql_provincia);
    $por_provincia = [];
    while($row = $result_provincia->fetch_assoc()) {
        $por_provincia[] = [
            'provincia' => $row['provincia'],
            'total' => (int)$row['total']
        ];
    }
    $stats['por_provincia'] = $por_provincia;

    echo json_encode(['success' => true, 'stats' => $stats]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error del servidor: ' . $e->getMessage()]);
}

$conn->close();
?>