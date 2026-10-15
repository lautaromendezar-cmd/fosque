<?php
// Intermediario del formulario de Experiencia -> EVO (prospecto), version
// hosting del cliente. Hace lo mismo que api/lead.mjs (la funcion de Vercel
// del preview): si se cambia algo aca, cambiarlo tambien alla.
//
// El DNS y el token de EVO son usuario y contraseña del CRM: viven en
// evo-config.php, FUERA de htdocs (raiz del FTP, un nivel arriba), donde
// ninguna URL llega. Modelo: deploy/evo-config.ejemplo.php.
//
// Abrir /api/lead.php en el navegador tiene que devolver
// {"ok":false,"error":"metodo"}: eso prueba que el hosting corre PHP.
// Si en cambio se ve este codigo, el hosting no tiene PHP.
//
// Escrito sin ?? ni funciones flecha: anda desde PHP 5.4.

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function responder($codigo, $datos) {
  http_response_code($codigo);
  echo json_encode($datos);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') responder(405, array('ok' => false, 'error' => 'metodo'));

$b = json_decode(file_get_contents('php://input'), true);
if (!is_array($b)) $b = array();
// Campo trampa: invisible para una persona, los bots lo completan.
if (!empty($b['empresa'])) responder(200, array('ok' => true));

$campo = function ($k) use ($b) { return isset($b[$k]) ? trim((string) $b[$k]) : ''; };
$nombre = preg_replace('/\s+/u', ' ', $campo('nombre'));
$email = $campo('email');
$sede = $campo('sede');
$cel = preg_replace('/\D/', '', $campo('telefono'));
if (strpos($cel, '54') === 0) $cel = substr($cel, 2);
if ($nombre === '' || !preg_match('/^\S+@\S+\.\S+$/', $email) || strlen($cel) < 8) {
  responder(400, array('ok' => false, 'error' => 'datos'));
}

$config = null;
foreach (array(__DIR__ . '/../../evo-config.php', __DIR__ . '/evo-config.php') as $ruta) {
  if (is_file($ruta)) { $config = require $ruta; break; }
}
if (!is_array($config) || empty($config['dns']) || empty($config['token'])) {
  responder(503, array('ok' => false, 'error' => 'sin configurar'));
}
$sucursales = isset($config['sucursales']) ? $config['sucursales'] : array();
if (empty($sucursales[$sede])) responder(400, array('ok' => false, 'error' => 'sucursal'));

// EVO pide nombre y apellido por separado; el form tiene un solo campo.
$partes = explode(' ', $nombre, 2);
$prospecto = array(
  'name' => $partes[0],
  'lastName' => isset($partes[1]) ? $partes[1] : '-',
  'email' => $email,
  // Sin gender EVO pone Masculino; la campaña es para la Mujer Fosque.
  'gender' => 'F',
  'ddi' => '+54',
  'cellphone' => $cel,
  'idBranch' => (int) $sucursales[$sede],
  'notes' => 'Sesión sin cargo Web',
);
if (!empty($config['marketing'])) $prospecto['marketingType'] = $config['marketing'];

$ctx = stream_context_create(array('http' => array(
  'method' => 'POST',
  'header' => "Content-Type: application/json\r\n"
    . 'Authorization: Basic ' . base64_encode($config['dns'] . ':' . $config['token']) . "\r\n",
  'content' => json_encode($prospecto),
  'timeout' => 15,
  'ignore_errors' => true, // que devuelva el cuerpo aunque EVO conteste 4xx/5xx
)));
$texto = @file_get_contents('https://evo-integracao-api.w12app.com.br/api/v1/prospects', false, $ctx);
if ($texto === false) {
  error_log('EVO red: sin respuesta');
  responder(502, array('ok' => false, 'error' => 'red'));
}
$status = 0;
if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s?/', $http_response_header[0], $m)) $status = (int) $m[1];
if ($status < 200 || $status >= 300) {
  error_log('EVO ' . $status . ' ' . substr($texto, 0, 500));
  responder(502, array('ok' => false, 'error' => 'evo', 'status' => $status));
}
$data = json_decode($texto, true);
responder(200, array('ok' => true, 'idProspect' => isset($data['idProspect']) ? $data['idProspect'] : null));
