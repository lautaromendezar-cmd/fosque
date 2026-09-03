# Pedido al hosting de Fosque — publicar el sitio en SU hosting (vía FTP)

**Actualizado:** 2026-09-03 · **Vía elegida:** el sitio se sube por FTP al hosting
del cliente (NO se apunta el dominio a Vercel).
**Probado:** el paquete estático se subió por FTP a otro hosting compartido y
funcionó (rutas, estilos, videos, 404 propio).

---

## Situación de la zona (relevada 3-sep contra 8.8.8.8)

| Registro | Valor actual | Para esta vía |
|---|---|---|
| `A` `@` | `190.210.9.50` (`ws84.host4g.com`) | **YA ESTÁ BIEN** — no se toca |
| `CNAME` `www` | `lb.bitrix24.site` | **CAMBIAR** (landing vieja de Bitrix24) |
| Redirección `fosque.com` → `fosque.vercel.app` | en el servidor web | **ANULAR** |
| `MX` `@` | `a.mx.fosque.com` (prio 0) | NO TOCAR |
| `A` `a.mx` | `190.210.9.50` | NO TOCAR |
| `TXT` `@` | `v=spf1 mx a ptr ip4:190.210.9.0/24 ip4:190.210.132.0/24 ~all` | NO TOCAR |
| `TXT` `@` | `google-site-verification=D7bFB1fqEnnJ26hCyR9NuFJpo_WYjDo0T90HYWfwuHY` | NO TOCAR |
| `NS` | `ns.fosque.com`, `b.ns.fosque.com` | NO TOCAR |

Ventaja de esta vía: **el registro A del apex ya apunta al servidor correcto.**
Solo hacen falta acceso FTP, sacar la redirección, arreglar `www` y el SSL.

⚠️ **EL BLOQUEANTE REAL ES EL SSL.** El problema que reportó el cliente (el link
compartido por WhatsApp no muestra vista previa) es porque `https://fosque.com`
da error de certificado. Cambiar de Vercel al hosting propio NO lo resuelve solo:
igual tienen que emitir el certificado.

⚠️ El `www` tiene que apuntar al servidor ANTES de pedir el certificado, porque
AutoSSL/Let's Encrypt valida resolviendo el nombre.

⚠️ Antes de mandar esto: confirmar con el cliente que la landing de **Bitrix24**
en `www.fosque.com` ya no se usa.

---

## MENSAJE DE WHATSAPP (copiar de acá para abajo)

> Los *asteriscos* salen en negrita al enviarlo. Va todo en un solo mensaje.

Hola, buenas! Te escribo por el dominio *fosque.com*. Soy el que desarrolló el sitio web nuevo de Fosque.

El cliente decidió que el sitio quede alojado en el hosting de ustedes. Necesitamos coordinar cuatro cosas, y la buena noticia es que el registro A del dominio ya apunta a su servidor, así que de DNS hay poco que tocar.

*1) Acceso FTP*
Usuario, contraseña y host de FTP con acceso a la carpeta raíz del sitio de fosque.com, para subir los archivos. Nos confirman también cuál es esa carpeta (public_html, htdocs, o la que corresponda).

*2) Anular la redirección actual*
Hoy fosque.com tiene configurada una *redirección* hacia fosque.vercel.app. Cuando terminemos de subir los archivos les avisamos y ahí necesitamos que la saquen, para que el dominio sirva el sitio nuevo directo desde el hosting. Mientras tanto puede quedar como está, así no se cae nada.

*3) Apuntar www.fosque.com al mismo servidor*
Hoy www.fosque.com apunta a otro lado (un CNAME a lb.bitrix24.site, una landing vieja que ya no se usa). Necesitamos que www resuelva al mismo servidor que fosque.com, así las dos direcciones muestran el sitio.

*4) Emitir el certificado SSL, para fosque.com Y para www.fosque.com*
Esto es lo más importante: hoy al entrar por https://fosque.com salta un error de certificado, y por eso cuando se comparte el link por WhatsApp no aparece la vista previa del sitio. Ese es el problema que nos reportó el cliente. El certificado de www hay que emitirlo DESPUÉS de que el punto 3 esté propagado, porque la validación necesita que el nombre resuelva al servidor.

Un pedido puntual: por favor *no modifiquen ni eliminen* ninguno de estos registros, porque de ellos dependen el correo del dominio y la verificación de Google:

- MX  @  ->  a.mx.fosque.com (prioridad 0)
- A  a.mx  ->  190.210.9.50
- TXT  @  ->  v=spf1 mx a ptr ip4:190.210.9.0/24 ip4:190.210.132.0/24 ~all
- TXT  @  ->  google-site-verification=D7bFB1fqEnnJ26hCyR9NuFJpo_WYjDo0T90HYWfwuHY
- Los NS de la zona (ns.fosque.com y b.ns.fosque.com)
- El registro A del dominio raíz (@ -> 190.210.9.50), que ya está correcto

Y un dato técnico por las dudas: el sitio es *HTML estático*, no necesita PHP, base de datos ni Node. Son unos 17 MB de archivos. Solo hace falta que el servidor lea un .htaccess, que es lo estándar en Apache.

Quedamos a la espera del acceso FTP para arrancar. Cualquier duda me escribís. Gracias!

Lautaro Méndez - Desarrollo web Fosque

---

## Orden de ejecución (para Lautaro)

1. Confirmar con el cliente lo de la landing de Bitrix24 en `www`.
2. Mandar el pedido. **Lo primero que hace falta es el acceso FTP.**
3. Subir el contenido de `fosque/deploy-ftp/` a la raíz web (ver `LEEME-SUBIDA.txt`).
   NO subir `LEEME-SUBIDA.txt`.
4. Verificar entrando por `http://` (la redirección puede seguir activa: probar
   con la IP o pidiendo la URL temporal del hosting si la dan).
5. Avisar al hosting para que **saquen la redirección**.
6. Que apunten `www` y **emitan el SSL de los dos nombres**.
7. Cuando `https://fosque.com` cargue: descomentar el bloque *forzar HTTPS* del
   `.htaccess` y volver a subirlo.
8. Probar el preview mandándose el link por WhatsApp.
9. Google Search Console: propiedad `https://fosque.com`.
10. Avisarle al cliente que a partir de acá **no hay más deploy automático**:
    cada cambio es build local + FTP.

## Plan B — si el hosting no colabora (vía Vercel)

Si no dan acceso FTP o no emiten el certificado, se vuelve a la vía Vercel.
Registros que había que pedir en ese caso (sacados del panel de Vercel el 3-sep):

- `A` `@` -> `216.198.79.1`
- `CNAME` `www` -> `e65b31d7dd4e0176.vercel-dns-017.com.`

⚠️ Esos valores cambian: copiarlos de nuevo del panel de Vercel al momento de
pedirlos. Tercera alternativa: delegar la zona DNS a Cloudflare y administrarla
nosotros, replicando MX/SPF para no tocar el correo.
