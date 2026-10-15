<?php
// Modelo del archivo con el token de EVO para el hosting.
//
// 1. Copiarlo como evo-config.php (esta en .gitignore: nunca al repo).
// 2. Completar el token (lo mando Silvy por WhatsApp el 15-oct; vence oct-2027).
// 3. Subirlo por FTP a la RAIZ del FTP, un nivel ARRIBA de htdocs, al lado de
//    htdocs. Ahi ninguna URL llega. No subirlo dentro de htdocs.
//
// npm run ftp NO lo copia al paquete a proposito.
return array(
  'dns' => 'fosque',
  'token' => 'PEGAR-ACA-EL-TOKEN',
  'sucursales' => array('jose-hernandez' => 1, 'emilio-castro' => 2, 'nunez' => 3),
  'marketing' => 'Sesión sin cargo Web',
);
