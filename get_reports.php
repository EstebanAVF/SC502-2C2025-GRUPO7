<?php
// get_reports.php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'conexion.php';

// Se crea un mapa de coordenadas en PHP para respaldar los reportes antiguos.
$coordenadas = [
    'San José' => [
        'lat' => 9.9333, 'lng' => -84.0833,
        'cantones' => [
            'San José' => ['lat' => 9.9325, 'lng' => -84.0787], 'Escazú' => ['lat' => 9.9208, 'lng' => -84.1436],
            'Desamparados' => ['lat' => 9.8939, 'lng' => -84.0673], 'Puriscal' => ['lat' => 9.8519, 'lng' => -84.3142],
            'Tarrazú' => ['lat' => 9.6644, 'lng' => -84.0292], 'Aserrí' => ['lat' => 9.8608, 'lng' => -84.0922],
            'Mora' => ['lat' => 9.8806, 'lng' => -84.2731], 'Goicoechea' => ['lat' => 9.9575, 'lng' => -84.0450],
            'Santa Ana' => ['lat' => 9.9328, 'lng' => -84.1833], 'Alajuelita' => ['lat' => 9.9025, 'lng' => -84.1033],
            'Vázquez de Coronado' => ['lat' => 9.9881, 'lng' => -84.0231], 'Acosta' => ['lat' => 9.7719, 'lng' => -84.2403],
            'Tibás' => ['lat' => 9.9572, 'lng' => -84.0822], 'Moravia' => ['lat' => 9.9658, 'lng' => -84.0536],
            'Montes de Oca' => ['lat' => 9.9358, 'lng' => -84.0494], 'Turrubares' => ['lat' => 9.8353, 'lng' => -84.4864],
            'Dota' => ['lat' => 9.6808, 'lng' => -83.9881], 'Curridabat' => ['lat' => 9.9142, 'lng' => -84.0322],
            'Pérez Zeledón' => ['lat' => 9.3739, 'lng' => -83.7022], 'León Cortés' => ['lat' => 9.7153, 'lng' => -84.0792]
        ]
    ],
    'Alajuela' => [
        'lat' => 10.0162, 'lng' => -84.2163,
        'cantones' => [
            'Alajuela' => ['lat' => 10.0167, 'lng' => -84.2167], 'San Ramón' => ['lat' => 10.0886, 'lng' => -84.4706],
            'Grecia' => ['lat' => 10.0719, 'lng' => -84.3117], 'San Mateo' => ['lat' => 9.9589, 'lng' => -84.5208],
            'Atenas' => ['lat' => 9.9786, 'lng' => -84.3800], 'Naranjo' => ['lat' => 10.0967, 'lng' => -84.3781],
            'Palmares' => ['lat' => 10.0592, 'lng' => -84.4294], 'Poás' => ['lat' => 10.1219, 'lng' => -84.2503],
            'Orotina' => ['lat' => 9.9114, 'lng' => -84.5256], 'San Carlos' => ['lat' => 10.4686, 'lng' => -84.5122],
            'Zarcero' => ['lat' => 10.1867, 'lng' => -84.3942], 'Sarchí' => ['lat' => 10.0931, 'lng' => -84.3411],
            'Upala' => ['lat' => 10.8981, 'lng' => -85.0161], 'Los Chiles' => ['lat' => 11.0333, 'lng' => -84.7167],
            'Guatuso' => ['lat' => 10.7167, 'lng' => -84.8000], 'Río Cuarto' => ['lat' => 10.3667, 'lng' => -84.2167]
        ]
    ],
    'Cartago' => [
        'lat' => 9.8634, 'lng' => -83.9194,
        'cantones' => [
            'Cartago' => ['lat' => 9.8667, 'lng' => -83.9167], 'Paraíso' => ['lat' => 9.8417, 'lng' => -83.8667],
            'La Unión' => ['lat' => 9.9167, 'lng' => -84.0000], 'Jiménez' => ['lat' => 9.8167, 'lng' => -83.7333],
            'Turrialba' => ['lat' => 9.9000, 'lng' => -83.6833], 'Alvarado' => ['lat' => 9.9000, 'lng' => -83.8000],
            'Oreamuno' => ['lat' => 9.9167, 'lng' => -83.8500], 'El Guarco' => ['lat' => 9.8167, 'lng' => -83.9333]
        ]
    ],
    'Heredia' => [
        'lat' => 10.0024, 'lng' => -84.1165,
        'cantones' => [
            'Heredia' => ['lat' => 9.9983, 'lng' => -84.1189], 'Barva' => ['lat' => 10.0194, 'lng' => -84.1283],
            'Santo Domingo' => ['lat' => 9.9806, 'lng' => -84.0933], 'Santa Bárbara' => ['lat' => 10.0400, 'lng' => -84.1611],
            'San Rafael' => ['lat' => 10.0503, 'lng' => -84.0983], 'San Isidro' => ['lat' => 10.0383, 'lng' => -84.0456],
            'Belén' => ['lat' => 9.9767, 'lng' => -84.1956], 'Flores' => ['lat' => 9.9883, 'lng' => -84.1656],
            'San Pablo' => ['lat' => 9.9822, 'lng' => -84.0811], 'Sarapiquí' => ['lat' => 10.4600, 'lng' => -84.0089]
        ]
    ],
    'Guanacaste' => [
        'lat' => 10.4285, 'lng' => -85.3968,
        'cantones' => [
            'Liberia' => ['lat' => 10.6333, 'lng' => -85.4333], 'Nicoya' => ['lat' => 10.1458, 'lng' => -85.4519],
            'Santa Cruz' => ['lat' => 10.2597, 'lng' => -85.6853], 'Bagaces' => ['lat' => 10.5256, 'lng' => -85.2483],
            'Carrillo' => ['lat' => 10.4686, 'lng' => -85.5683], 'Cañas' => ['lat' => 10.4319, 'lng' => -85.0981],
            'Abangares' => ['lat' => 10.2817, 'lng' => -84.9653], 'Tilarán' => ['lat' => 10.4681, 'lng' => -84.9703],
            'Nandayure' => ['lat' => 9.9833, 'lng' => -85.3500], 'La Cruz' => ['lat' => 11.0717, 'lng' => -85.6311],
            'Hojancha' => ['lat' => 10.0583, 'lng' => -85.4211]
        ]
    ],
    'Puntarenas' => [
        'lat' => 9.9763, 'lng' => -84.8388,
        'cantones' => [
            'Puntarenas' => ['lat' => 9.9769, 'lng' => -84.8322], 'Esparza' => ['lat' => 9.9925, 'lng' => -84.6644],
            'Buenos Aires' => ['lat' => 9.1722, 'lng' => -83.3347], 'Montes de Oro' => ['lat' => 10.1167, 'lng' => -84.7167],
            'Osa' => ['lat' => 8.9583, 'lng' => -83.4564], 'Quepos' => ['lat' => 9.4308, 'lng' => -84.1611],
            'Golfito' => ['lat' => 8.6381, 'lng' => -83.1658], 'Coto Brus' => ['lat' => 8.9667, 'lng' => -82.9667],
            'Parrita' => ['lat' => 9.5186, 'lng' => -84.3217], 'Corredores' => ['lat' => 8.7833, 'lng' => -82.9500],
            'Garabito' => ['lat' => 9.6167, 'lng' => -84.6333]
        ]
    ],
    'Limón' => [
        'lat' => 9.9907, 'lng' => -83.0355,
        'cantones' => [
            'Limón' => ['lat' => 9.9889, 'lng' => -83.0317], 'Pococí' => ['lat' => 10.4667, 'lng' => -83.6500],
            'Siquirres' => ['lat' => 10.0986, 'lng' => -83.5075], 'Talamanca' => ['lat' => 9.6333, 'lng' => -82.8500],
            'Matina' => ['lat' => 10.0833, 'lng' => -83.2833], 'Guácimo' => ['lat' => 10.2167, 'lng' => -83.6833]
        ]
    ]
];

try {
    $sql = "
        SELECT
            r.id, r.descripcion, r.prioridad, r.provincia, r.canton,
            r.distrito, r.latitud, r.longitud, r.imagen, r.created_at,
            u.nombre AS usuario_nombre, u.apellido AS usuario_apellido,
            ti.nombre AS tipo_incidente_nombre,
            (SELECT COUNT(*) FROM votos v WHERE v.id_reporte = r.id) AS total_likes
        FROM
            reportes AS r
        JOIN
            usuarios AS u ON r.id_usuario = u.id
        JOIN
            tipos_incidente AS ti ON r.id_tipo_incidente = ti.id
        LEFT JOIN
            votos AS v ON r.id = v.id_reporte
        GROUP BY
            r.id
        ORDER BY
            r.created_at DESC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();
    $reports = [];
    
    while ($row = $result->fetch_assoc()) {
        // Si el reporte no tiene latitud (porque es antiguo), se le asigna una.
        if (empty($row['latitud']) || (float)$row['latitud'] == 0) {
            $provincia = $row['provincia'];
            $canton = $row['canton'];
            
            // Se intenta asignar la del cantón, que es más precisa.
            if (isset($coordenadas[$provincia]['cantones'][$canton])) {
                $row['latitud'] = $coordenadas[$provincia]['cantones'][$canton]['lat'];
                $row['longitud'] = $coordenadas[$provincia]['cantones'][$canton]['lng'];
            } 
            // Si no se puede, se le asigna la de la provincia como respaldo.
            elseif (isset($coordenadas[$provincia])) {
                $row['latitud'] = $coordenadas[$provincia]['lat'];
                $row['longitud'] = $coordenadas[$provincia]['lng'];
            }
        }
        
        $reports[] = $row;
    }

    echo json_encode($reports);
    
    $stmt->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error del servidor: ' . $e->getMessage()]);
}

$conn->close();
?>