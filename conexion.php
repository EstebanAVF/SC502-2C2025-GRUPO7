<?php
// conexion.php - Configuración de base de datos para Vías Seguras

// Configuración para mostrar errores (solo en desarrollo)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Configuración de la base de datos
$host = "localhost";
$username = "root";
$password = "";
$database = "vias_seguras";

// Crear conexión
try {
    $conn = new mysqli($host, $username, $password, $database);
    
    // Verificar conexión
    if ($conn->connect_error) {
        throw new Exception("Error de conexión: " . $conn->connect_error);
    }
    
    // Establecer charset UTF-8
    if (!$conn->set_charset("utf8mb4")) {
        throw new Exception("Error estableciendo charset: " . $conn->error);
    }
    
    // Log de éxito (solo para debug)
    error_log("Conexión a BD exitosa - " . date('Y-m-d H:i:s'));
    
} catch (Exception $e) {
    // Log del error
    error_log("Error de conexión a BD: " . $e->getMessage());
    
    // Solo mostrar error detallado en desarrollo
    if ($_SERVER['HTTP_HOST'] === 'localhost' || strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false) {
        die("Error de conexión: " . $e->getMessage());
    } else {
        die("Error de conexión a la base de datos. Contacte al administrador.");
    }
}

// Función helper para prepared statements seguros
function ejecutarQuery($conn, $sql, $tipos = "", $valores = []) {
    try {
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Error preparando consulta: " . $conn->error);
        }
        
        if (!empty($tipos) && !empty($valores)) {
            $stmt->bind_param($tipos, ...$valores);
        }
        
        if (!$stmt->execute()) {
            throw new Exception("Error ejecutando consulta: " . $stmt->error);
        }
        
        return $stmt;
    } catch (Exception $e) {
        error_log("Error en ejecutarQuery: " . $e->getMessage());
        throw $e;
    }
}

// Función para respuestas JSON consistentes
function respuestaJSON($success, $message, $data = null, $codigo_http = 200) {
    http_response_code($codigo_http);
    
    $respuesta = [
        'success' => $success,
        'message' => $message,
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    if ($data !== null) {
        $respuesta['data'] = $data;
    }
    
    header('Content-Type: application/json');
    echo json_encode($respuesta, JSON_UNESCAPED_UNICODE);
    exit();
}
?>