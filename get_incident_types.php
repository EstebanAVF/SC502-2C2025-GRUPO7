<?php
// get_incident_types.php
// Configurar cabeceras para JSON y CORS
// Esto permite que cualquier origen acceda a este recurso

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
require_once 'conexion.php';

$tipos = [];

try {
    $sql = "SELECT id, nombre FROM tipos_incidente ORDER BY nombre ASC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $tipos[] = $row;
    }
    $stmt->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error del servidor: ' . $e->getMessage()]);
    $conn->close();
    exit();
}

echo json_encode($tipos);
$conn->close();

?>