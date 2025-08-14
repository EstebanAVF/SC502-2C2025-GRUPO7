<?php
require_once 'conexion.php';

// Estas cabeceras son cruciales para que la comunicación entre JavaScript y PHP funcione
header('Content-Type: application/json');                                   // Avisa al navegador que la respuesta de este script siempre será en formato JSON.
header('Access-Control-Allow-Origin: *');                                   // Para desarrollo. En produccion, usa tu dominio real.
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');                 // Define los métodos que este script acepta
header('Access-Control-Allow-Headers: Content-Type, Authorization');        // Define las cabeceras que el navegador tiene permitido enviar en su peticion.


// El navegador puede enviar una peticion OPTIONS (preflight) antes de la peticion POST.
// Respondemos a esta peticion y terminamos el script.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Responde con un código 200 (OK) para indicar que la futura petición POST está permitida
    http_response_code(200);
    exit();
}


// Destruir todas las variables de sesion
$_SESSION = array();

// Al destruir la sesion completamente, también borre la cookie de sesion
// Esto destruira la sesion, y no la informacion de la sesion
// Revisa si la configuracion de PHP usa cookies
if (ini_get("session.use_cookies")) {
    // Obtiene todos los parametros de la cookie de sesion actual
    $params = session_get_cookie_params();
    // Envia una nueva cookie al navegador para "borrar" la cookie de sesion
    setcookie(session_name(), '', time() - 42000,
        // Se le da el mismo nombre, un valor vacio y una fecha de expiracion en el pasado.
        // El navegador, al ver una fecha pasada, elimina la cookie.
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Finalmente, destruir la sesion
// Esta funcion elimina toda la informacion guardada en el servidor (borra la variable $_SESSION)
session_destroy();

echo json_encode(['success' => true, 'message' => 'Sesión cerrada exitosamente.']);
exit();

?>