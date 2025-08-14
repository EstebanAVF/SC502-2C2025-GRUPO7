<?php
// create_report.php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Ajustar para producción
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'conexion.php';

// --- Verificación de Seguridad: El usuario DEBE haber iniciado sesión ---
if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // No autorizado
    echo json_encode(['success' => false, 'message' => 'Debes iniciar sesión para poder reportar.']);
    exit();
}

// --- Validación de Datos del Formulario ---
$required_fields = ['descripcion', 'prioridad', 'provincia', 'canton'];
foreach ($required_fields as $field) {
    if (empty($_POST[$field])) {
        http_response_code(400); // Bad Request
        echo json_encode(['success' => false, 'message' => "El campo '$field' es obligatorio."]);
        exit();
    }
}

// --- Recopilación y Saneamiento de Datos ---
$id_usuario = $_SESSION['user_id'];
$descripcion = trim($_POST['descripcion']);
$prioridad = trim($_POST['prioridad']);
$provincia = trim($_POST['provincia']);
$canton = trim($_POST['canton']);
// El distrito es opcional, así que usamos el operador de fusión de null
$distrito = !empty($_POST['distrito']) ? trim($_POST['distrito']) : null;
// El tipo de incidente lo dejaremos como un valor fijo por ahora, ya que no está en el nuevo formulario.
// En una futura mejora, se puede añadir un selector para esto.
$id_tipo_incidente = 1; // Asumimos un tipo "Reporte General" o similar. ¡Ajustar si es necesario!

$url_imagen = null;

// --- Manejo de la Subida de Imagen ---
if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] == 0) {
    $upload_dir = 'uploads/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    
    $file_name = uniqid() . '-' . basename($_FILES['imagen']['name']);
    $target_file = $upload_dir . $file_name;

    // Mover el archivo subido al directorio de uploads
    if (move_uploaded_file($_FILES['imagen']['tmp_name'], $target_file)) {
        // Guardamos la ruta relativa para almacenarla en la BD
        $url_imagen = $target_file;
    }
}

// --- Inserción en la Base de Datos ---
try {
    // Asignamos un estado por defecto. Asumimos que '1' es "Recibido" o "Nuevo"
    $id_estado = 1; 

    $sql = "INSERT INTO reportes (id_usuario, id_tipo_incidente, id_estado, descripcion, prioridad, provincia, canton, distrito, imagen) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception('Error al preparar la consulta: ' . $conn->error);
    }
    
    // El tipo de dato ahora es 'iiissssss' (integer, integer, integer, string...)
    $stmt->bind_param("iiissssss", $id_usuario, $id_tipo_incidente, $id_estado, $descripcion, $prioridad, $provincia, $canton, $distrito, $url_imagen);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => '¡Reporte enviado con éxito!']);
    } else {
        throw new Exception('Error al guardar el reporte en la base de datos.');
    }
    $stmt->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error del servidor: ' . $e->getMessage()]);
}

$conn->close();