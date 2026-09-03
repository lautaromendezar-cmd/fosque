# FOSQUE — Estado del proyecto y cómo continuar

**EN VIVO: https://fosque.com/** — hosting del cliente, **se publica subiendo `deploy-ftp/` por FTP a mano** (`npm run ftp` + FileZilla; guía en `deploy/LEEME-SUBIDA.txt`).
Repo: https://github.com/lautaromendezar-cmd/fosque. Pushear a `main` deploya a **fosque.vercel.app**, que ya NO es el sitio público: es **staging**.

## 🖥️ Arrancar en una PC nueva

```bash
git clone https://github.com/lautaromendezar-cmd/fosque.git
cd fosque            # la raíz del repo ES la carpeta site del proyecto
npm install
npx playwright install chromium   # solo para el smoke test (una vez)
npm run dev                       # desarrollo en localhost:3000
```

Verificación antes de CADA push (cazó varios bugs reales):

```bash
npm run build                 # export estático a out/
node scripts/smoke.mjs        # Playwright: consola + screenshots de las 5 rutas
node scripts/check-hero.mjs   # luminancia + contraste + los 4 caminos del hero
```

`SMOKE_PORT` / `HERO_PORT` cambian el puerto si otro proyecto tiene tomado el
default (4173 / 4194).

⚠️ Pushear a `main` deploya a Vercel, que es **staging**: publicar de verdad es subir por FTP. ⚠️ En Claude Code el cwd se resetea entre comandos bash: siempre `cd` absoluto antes de npm/git.

⚠️ "No se ven las animaciones": revisar "Mostrar animaciones en Windows" / "Reducir movimiento" del SO — el sitio respeta `prefers-reduced-motion` a propósito (trailer del hero y preloader no corren; counters muestran valor final). Preloader y trailer: solo 1ª visita por sesión (`sessionStorage fosque-seen`).

## 🚚 2026-09-03 — El sitio se muda al hosting del cliente (FTP)

**DECISIÓN DEL CLIENTE: el sitio va alojado en SU hosting, no en Vercel.** No hay
que convertir nada: ya era `output: 'export'` + `trailingSlash: true` +
`images.unoptimized`, sin API routes ni middleware → HTML plano que anda en un
Apache pelado. **Probado de verdad**: se subió por FTP al hosting de otro cliente
y funcionó (rutas, estilos, fuentes, videos, 404 propio).

**Todo se regenera con un comando, desde cualquier PC:**

```
git pull && npm install && npm run ftp     # deja deploy-ftp/ listo (~16 MB)
npm run probar                             # lo sirve por HTTP y abre el navegador
```

- `scripts/armar-ftp.mjs` — buildea con `NEXT_PUBLIC_SITE_URL=https://fosque.com`
  **fijo adentro del script** (si falta, el fallback es `localhost:3000` y el
  preview de WhatsApp queda roto igual), copia `out/`, suma `deploy/.htaccess`,
  saca `media/hero.mp4` (huérfano desde el 27-ago, 6,6 MB que no pide nadie) y
  **verifica** que el HTML tenga el dominio y estén `_next/`, `media/`, `.htaccess`.
- `scripts/probar-ftp.mjs` (+ `PROBAR SITIO.bat`) — sirve `deploy-ftp/` imitando
  a Apache. ⚠️ Abrir `index.html` con doble clic NO sirve: rutas absolutas.
- `deploy/.htaccess` — 404 propio, gzip y cache. El HTML va con **`no-cache`** a
  propósito, para que un cambio subido por FTP se vea; `_next/static` (con hash
  en el nombre) va con cache de un año — aunque ojo: `mod_expires` y
  `mod_headers` **no están cargados** en este hosting, así que esos bloques no
  aplican (ver abajo). **Sin `RewriteRule`**: acá tira 403 en todo el sitio.
- `deploy/LEEME-SUBIDA.txt` — instructivo de FileZilla. **No se sube** (quedaría
  público en la raíz); tampoco lo copia el script.
- `deploy-ftp/` está en `.gitignore`: es generado, no se versiona.

⚠️ **YA NO HAY DEPLOY AUTOMÁTICO.** Un `git push` actualiza el staging de
Vercel, no el sitio del cliente. Lo que ve la gente es lo que esté subido por
FTP.

**Estado real del dominio — el hosting lo arregló ESE MISMO DÍA.** Lo de arriba
(la tabla del relevamiento de la mañana: apex redirigiendo y `www` en Bitrix24)
quedó viejo en horas. Verificado en vivo el 3-sep a las 18:30:

| Qué | Cómo está ahora |
|---|---|
| `fosque.com` y `www.fosque.com` | los **dos** al Apache del hosting, `190.210.9.50` — se acabó la redirección al `.vercel.app` |
| Certificado | **Let's Encrypt emitido el 3-sep 18:48 UTC**, SAN = `fosque.com` + `www.fosque.com`, vence el 2-dic (se renueva solo) |
| `http://` | ya redirige a `https://` **solo, a nivel de servidor** (por eso el forzar-HTTPS del `.htaccess` queda comentado) |
| `https://` (los dos) | **403 Forbidden** de Apache = la raíz web está VACÍA, esperando esta subida |
| FTP | vivo en `ftp.fosque.com:21`, **Pure-FTPd con TLS** (SFTP/22 cerrado: es FTPS explícito, no SFTP) |
| MX | intacto: `MX 0 a.mx.fosque.com`. El mail no se tocó |

✅ **El bloqueante del SSL murió**: era exactamente lo que pedía
`docs/PEDIDO-AL-HOSTING.md` y lo hicieron completo. Ya no hay nada que esperar
de nadie: subir `deploy-ftp/` por FTP y el sitio queda en el dominio propio, con
el preview de WhatsApp andando.

⚠️ **Efecto colateral que hay que avisarle al cliente:** al mover `www` al
hosting, el hosting **desenchufó el sitio viejo de Bitrix24** — `www.fosque.com`
ya no lo sirve. Con él se cayeron el chat **"Asesor Fosque"** (si entraban
consultas al CRM, dejaron de entrar por ahí) y la sección **Planes**, que el
sitio nuevo no tiene. No lo hicimos nosotros, pero pasó hoy: preguntarle si el
chat estaba en uso y si Planes tiene que existir en el sitio nuevo.

**Ajustes de esta sesión (3-sep, PC de casa), ya con el SSL resuelto:**
- `deploy/.htaccess`: se intentó meter un **301 de `www` → apex**… y **tiró el
  sitio entero a 403**. Ver la sección de abajo: en este Apache `mod_rewrite`
  está prohibido. Quedó afuera, y también se borró el bloque comentado de
  "forzar HTTPS" para que nadie lo descomente (el hosting ya redirige solo).
- `app/layout.tsx`: `alternates: { canonical: './' }` → todas las páginas salen
  con `<link rel="canonical">` a `https://fosque.com/...`. Antes no había
  ninguno y Google se quedaba con el `.vercel.app`.

## 🟢 3-sep, 18:50 — **EL SITIO ESTÁ ONLINE EN https://fosque.com**

Subido por FTP a `/htdocs` y **verificado en vivo**: las 7 páginas en 200, el 404
propio andando, y **46 assets + 7 fuentes (14,1 MB) sin un solo roto**, con los
MIME correctos (`video/mp4`, `font/woff2`). gzip activo: la home viaja 102 KB →
**19 KB**. `<link rel="canonical">` y `og:image` absoluto salen bien servidos.

### ⛔ Lo que hay que saber de este Apache (aprendido a los golpes)

**`mod_rewrite` NO SE PUEDE USAR. Nunca.** El vhost tiene `FollowSymLinks` y
`SymLinksIfOwnerMatch` **apagados**, y en ese caso Apache prohíbe `RewriteRule`
en `.htaccess` y contesta **403 a TODO el sitio** — no al pedido que matchea: a
todo. Un 301 de `www` → apex de tres líneas dejó `fosque.com` entero caído. Se
diagnostica en un minuto con el log (ver abajo):

```
AH00670: Options FollowSymLinks and SymLinksIfOwnerMatch are both off, so the
RewriteRule directive is also forbidden ... /users/webs/fosque.com/htdocs/
```

Por eso `deploy/.htaccess` ya **no tiene ni el bloque comentado** de "forzar
HTTPS": descomentarlo tiraba el sitio. Tampoco hace falta, el hosting redirige
`http` → `https` solo, a nivel de servidor.

**Qué módulos hay y cuáles no:**

| Módulo | ¿Anda? | Consecuencia |
|---|---|---|
| `mod_deflate` | ✅ | gzip andando, la home baja a 19 KB |
| `mod_mime` | ✅ | `AddType` aplicado (woff2 y mp4 correctos) |
| `mod_rewrite` | ⛔ **prohibido** | cualquier `RewriteRule` = 403 en todo el sitio |
| `mod_expires` | ❌ no cargado | el `<IfModule>` lo saltea en silencio |
| `mod_headers` | ❌ no cargado | ídem |

⚠️ Como `mod_expires`/`mod_headers` no están, **el HTML sale sin `Cache-Control`**.
No es grave (Apache manda `Last-Modified` + `ETag` y el navegador revalida por
heurística), pero después de subir un cambio por FTP alguien puede ver el HTML
viejo un rato. Si molesta, pedirle al hosting que habilite los dos módulos.

### 🔎 Los logs del vhost están en el FTP

En la raíz del FTP (un nivel arriba de `htdocs`) están **`fosque.com.error.log`
y `fosque.com.access.log`**, al día. Ante cualquier cosa rara, bajarlos y leer el
final: ahí salió el `AH00670` con la ruta real del `DocumentRoot`
(`/users/webs/fosque.com/htdocs`), que es lo que destrabó todo. **No commitear
los logs**: tienen IPs de visitantes y pesan.

### 🗂️ Cómo quedó el FTP

| Carpeta | Qué es |
|---|---|
| `/htdocs` | **la raíz web** — acá vive el sitio nuevo |
| `/htdocs/.htaccess.off` | la redirección vieja al `.vercel.app`, desactivada por el hosting. Inerte, dejarla |
| `/htdocs.off` | el sitio viejo de 2022 (`send-mail.php`, `js/`, `images/`). Parkeado por ellos, **no borrar** |
| `/subdomains` | vacío |
| `/web_fosque_vieja.rar` | backup de 2017, ignorar |

### Pendiente menor: el 301 de `www`

`www.fosque.com` sirve el **mismo** contenido en 200 (mismo docroot) en vez de
redirigir al apex. No se puede arreglar por `.htaccess` (sería un `RewriteRule`).
El daño real —que Google indexe duplicado— ya lo tapan los `<link rel="canonical">`
de las 9 páginas, que apuntan todos a `https://fosque.com/`. Si se quiere el 301
de verdad, pedírselo al hosting junto con `mod_headers`/`mod_expires`.

### 🧪 Vercel queda como STAGING — se borra al cerrar el proyecto

Idea descartada por ahora: mientras queden cambios por hacer, tener dónde ver un
cambio deployado vale más que la cuota que consume. **Se borra cuando el sitio
esté cerrado**, y ahí sí conviene: los bots crawlean esa copia, cada push gasta
minutos de build y el plan Hobby prohíbe uso comercial. Borrarlo no pierde nada
(el repo se basta solo y `NEXT_PUBLIC_SITE_URL` está horneada en
`scripts/armar-ftp.mjs`); lo único es avisarle al cliente que reemplace el link
viejo, porque él lo tiene.

⚠️ **Las dos trampas mientras siga vivo:**

1. **Un `git push` actualiza Vercel y NO el sitio real.** Si el cliente revisa
   `fosque.vercel.app` puede estar mirando algo que no está publicado — y al
   revés: podés dar por arreglado algo que en producción sigue roto. Ante la
   duda, **mirar fosque.com**. (Alternativa local sin Vercel: `npm run probar`.)
2. ⚠️ **`NEXT_PUBLIC_SITE_URL` en Vercel quedó en `https://www.fosque.com`** (de
   cuando el `www` era el único con SSL válido). Eso hace que el staging se
   declare canónico en `www` mientras el sitio real se declara en el apex: dos
   hosts peleándose el mismo contenido ante Google. **Arreglo, a mano (no hay CLI
   de Vercel en estas PCs): Settings → Environment Variables →
   `NEXT_PUBLIC_SITE_URL` = `https://fosque.com` → Redeploy.**

### Lo que sigue

1. **Probar el preview de WhatsApp** mandándose el link: era EL síntoma que
   reportó el cliente. Si no aparece la imagen, sospechar del `og:image`, que
   pesa **384 KB** (WhatsApp suele cortar cerca de 300 KB); se baja a 131 KB
   re-encodeando el PNG a paleta de 256 colores con sharp, sin tocar la URL.
2. **Vercel → `NEXT_PUBLIC_SITE_URL` = `https://fosque.com`** (sin `www`) +
   Redeploy, para que el staging deje de declararse canónico en otro host.
3. Dar de alta `https://fosque.com` en Search Console.
4. Avisarle al cliente lo del Bitrix24 caído (chat "Asesor Fosque" y Planes).
5. Cuando el sitio esté cerrado: borrar el proyecto de Vercel.

## 📄 Qué es el sitio

Next.js 15 App Router, `output: 'export'` (100% estático). GSAP + ScrollTrigger vía `useGSAP`, Lenis sincronizado (`SmoothScroll.tsx`). Tipografías del manual: Momo Trust Display (local, títulos), Baloo Bhaijaan 2 (texto), Bebas Neue (etiquetas). Logo oficial vectorizado del PDF (`components/logo/paths.ts`, regenerable con `scripts/trace-logo.mjs` + `gen-logo.mjs`). OG image: `scripts/gen-og.mjs`.

Rutas: `/` (home cine) · `/jose-hernandez` `/emilio-castro` `/nunez` (landings de conversión) · `/equipo` · `/franquicia` · `/novedades` (markdown en `content/novedades/`).

Datos centralizados: `data/sedes.ts` (única fuente de verdad: direcciones, WhatsApp, horarios, place_ids, instagram, guiones de rodaje) y `data/mitos.ts`.

Media: TODA la media actual es IA provisoria (`public/media/`). `components/Media.tsx` cae a placeholder con guion de rodaje si el archivo no existe; el material real del rodaje reemplaza archivos por nombre y listo (requiere rebuild). `AutoVideo.tsx` obligatorio para videos de fondo (fix autoplay iOS).

## ✅ Sesión 2026-08-06 — Sprint "lineamientos nuevos del cliente" COMPLETO

El doc del cliente está en `docs/lineamientos-cliente-2026-08.txt`. Se implementó entero:

1. **Copys oficiales**: manifiesto nuevo ("A Fosque venís a sentirte querida"), "evaluación sin cargo" (ex clase de diagnóstico) en todos los touchpoints, 7 mitos sincronizados. La respuesta "No tengo tiempo" en home usa la grilla completa (solo real en JH); por sede se adapta (`mitosParaSede`).
2. **Programa**: los 7 beneficios del doc (antes 4).
3. **`/equipo`**: 3 grupos oficiales — Profe Fosque `#profe`, Ejecutiva Fosque `#ejecutiva`, Personal de Mantenimiento `#mantenimiento` (placeholder `equipo-mantenimiento.jpg`). Teaser de 3 cards en la home (`.eq-card`).
4. **Nav oficial**: Método Fosque | Profe Fosque | Ejecutiva Fosque | Tu Sucursal (dropdown) | Novedades | Franquicia + botón EVO desktop + íconos IG/FB (URLs en `#`). Redes se ocultan <1500px, EVO <1360px (siguen en menú mobile y footer).
5. **WhatsApp flotante con selector de sede** (`WaFloat`): panel FJH/FEC/Núñez + general; en landings de sede prop `directo` (sin selector).
6. **Cards de sedes con accesos directos**: WA/Maps siempre; IG aparece solo al cargar la URL en `data/sedes.ts`. La card es `<div>` + `.sc-link` estirado (no se anidan links).
7. **`/franquicia`**: hero sandwich "FOSQUE / en tu barrio", marquee, 4 cards del modelo, stats con counters, `FranquiciaForm` → arma WhatsApp al número general. Placeholder `franquicia.mp4`.
8. **HERO PELÍCULA (home)**: se eliminó el bento + scrub. `#cine`: video fullscreen con velo oscuro + TRAILER de 3 frases secuenciales al mismo tamaño (`.cine-frases`) → al cierre entra el estado final fijo (`.cine-content`: pregunta palabra por palabra + CTAs). Visitas repetidas de la sesión van directo al estado final. Zoom lentísimo yoyo del video. `CineAudio` = mute/unmute (audible cuando el hero.mp4 real tenga pista de audio).

### Lecciones técnicas de la sesión (no re-debuggear)

- **Bug Next App Router**: varios `<Link>` al mismo pathname con distinto hash → la caché de prefetch pisa el hash. Solución: `<a>` nativo para anclas cross-page + effect en `SmoothScroll` que hace `lenis.scrollTo(hash)` al montar la ruta. El click handler también cubre `a[href*="#"]` de la misma página.
- **GSAP**: `from()` con stagger sobre targets de selectores mezclados dejó un target congelado en los valores iniciales → `CineAudio` quedó fuera de la timeline (siempre visible). Pins: usar `clearProps` en entrances para no pisar hovers CSS.
- **Counters + reduced-motion**: setear el valor final directo (HomeFx y FranquiciaFx lo hacen).

## ✅ Sesión 2026-08-07 — Hero en 3 actos

Rework del trailer del hero a pedido de Lautaro: **acto 1** = la pregunta sola sobre telón negro (sin video, `#cine` tiene `background: var(--negro)`); **acto 2** = el video+velo+botón de audio se funden a la vista junto con "Fosque no es un gimnasio." (leve anticipo `'<-0.35'`); sigue la 3ª frase sobre el video y al cierre el estado final (pregunta + CTAs) igual que antes. Detalle clave: la escena se oculta (`gsap.set opacity 0`) ANTES de arrancar el preloader — si se hace en `film()` el video se ve un instante detrás del preloader al desvanecerse y se apaga de golpe. Reduced-motion no se toca (nunca corre `film()`, la escena queda visible). Verificado con capturas Playwright por acto.

**Replay de la intro**: RECARGAR la página repite preloader+trailer; volver a la home navegando dentro del sitio va directo al estado final. Criterio: `performance.getEntriesByType('navigation')[0].type === 'reload'` + variable de módulo `homeMontoEnEsteDoc` (sobrevive navegación client-side, se resetea por documento). No sirve marcar el documento con `timeOrigin`: los `<a>` nativos a `/equipo#...` recargan documento y el regreso client-side repetiría la intro. Verificado con Playwright: carga fresca ✓, reload repite ✓, Novedades→logo no repite ✓.

**Estado final con subtítulo**: para que el cierre no repita la pregunta pelada del acto 1, el estado final ahora es pregunta + `.sub` ("Un espacio donde siempre sos bienvenida…" — la 3ª oración del subtítulo oficial del brief, que el trailer no dice) + CTAs. Con esto el hero tiene el copy oficial COMPLETO (título + subtítulo + CTA del doc del cliente).

**Intro limpia**: durante la intro el nav y el WhatsApp flotante están ocultos (`autoAlpha 0` seteado junto con el telón, antes del preloader) y entran en `reveal()` con los CTAs — en el acto 1 se ve SOLO la frase sobre negro. `CineAudio` quedó detrás del flag `HERO_CON_AUDIO` en `page.tsx` (hoy `false`): poner `true` cuando el hero.mp4 real traiga pista de audio, con video mudo el botón confundía.

**Video del hero sin loop visible**: el hero.mp4 (8s) se reproducía invisible desde la carga y loopeaba a mitad del trailer. Ahora, en el momento exacto en que abre la escena, un callback en la timeline lo reinicia (`currentTime = 0`) y lo ralentiza (`playbackRate = 0.55` → un pase ≈ 14.6s): cubre las frases y el aterrizaje del estado final; el primer loop llega mucho después. ⚠️ Si se reemplaza hero.mp4 por el del rodaje, recalcular el rate (comentario en `HomeFx.tsx`) — y si trae audio, el playbackRate ralentizado va a deformar la pista: en ese caso repensar (quizás rate 1 y un clip más largo).

## ✅ Sesión 2026-08-17 — Devolución del cliente: se va el telón negro

Doc del cliente (`docs/devolucion-cliente-2026-08-17.md`). El 85% describía lo
que ya estaba hecho; lo que sí pedía de nuevo se implementó entero:

1. **Adiós al telón negro.** `#cine` pasó de `--negro` a `--crema` y el video ya
   NO se oculta detrás del preloader: cuando el preloader se disuelve (0,9s, era
   0,4s) la escena ya está ahí. Se eliminó `.cine-frases` (el trailer de 3 frases
   que se reemplazaban) y con él la duplicación de la pregunta.
2. **El copy se SUMA en capas, no se reemplaza.** `film()` en `HomeFx.tsx`:
   pregunta palabra por palabra → `HOLD_PREGUNTA` (3s, constante arriba del
   archivo) → frase central → botones + nav + WhatsApp. Total ≈9s.
3. **Copys oficiales nuevos**: la 2ª frase es "En Fosque nos dedicamos a que
   puedas disfrutar y cuidar lo que verdaderamente tiene valor en tu vida" y el
   párrafo largo "Fosque no es un gimnasio…" salió del trailer y es ahora la
   sección `#manifiesto`, la 2ª pantalla narrativa que se descubre al scrollear.
4. **CTA final en 1ª persona**: "Mi momento es ahora / Comienzo el cambio. Elijo
   ser mi mejor versión."
5. **Códigos oficiales de sede** `FJH/FEC/FNN` (campo `codigo` en `data/sedes.ts`):
   reemplazan al "SEDE 01/02/03" inventado, en las cards y en el selector de WhatsApp.
6. **Posters de video** (`scripts/gen-posters.mjs` → `<nombre>-poster.jpg`): un
   `<video>` sin `poster` pinta NEGRO mientras bufferea, justo el corte técnico
   que el cliente marcó. `Media.tsx` lo pasa solo si el archivo existe.
7. **Fundidos**: el pie del hero se funde al crema (`#cine::after`) y el fondo del
   body pasó a `0.8s ease-in-out`, como pedía el doc.

### Contraste: el hallazgo de la sesión

Medido con `scripts/check-hero.mjs`: el título del hero estaba en **2,11:1**
contra los frames más claros del video — no llegaba ni a AA large. Venía de
antes y se notó más al quedar el copy fijo sobre el video. **No se resolvió
oscureciendo la escena** (sería volver a lo que el cliente rechazó) sino con un
velo LOCAL detrás del copy: elipse de caída larga en `.cine-content::before`,
tono de paleta. Los bordes del cuadro siguen luminosos. Ahora **5,0:1** el
título y **6,1:1** la frase. ⚠️ Volver a correr el check al cambiar `hero.mp4`:
un clip más claro tira esto abajo sin que se vea a ojo.

## ✅ Sesión 2026-08-18/19 — Entra el material real del rodaje

**5 de los 6 videos ya no son IA.** De 641 MB en bruto quedaron 18 MB servidos.

| Archivo | En bruto | En el sitio | Notas |
| --- | --- | --- | --- |
| `hero.mp4` | 212 MB | **6,6 MB** | 21,8s · 1920×1080 · ⚠️ audio MUDO |
| `sede-jose-hernandez.mp4` | 53,6 MB | **2,6 MB** | 5,2s |
| `sede-emilio-castro.mp4` | 61,5 MB | **2,3 MB** | 5,9s |
| `historia.mp4` | 95,3 MB | **2,9 MB** | 9,9s · 16:9 en marco cuadrado, se recorta 43% |
| `metodo.mp4` | 68,5 MB | **3,0 MB** | 9,7s · 1080×1350, se recorta 21% de alto |
| `franquicia.mp4` | 205 MB | **3,2 MB** | 20,3s · a 1600px y CRF 26 |
| `sede-nunez.mp4` | — | 5,0 MB | **SIGUE SIENDO IA** (sede sin filmar) |

### ⚠️ Todo lo que exporta Premiere viene en bruto

Los seis llegaron a 55-82 Mbps, 119,88 fps y con pista de audio que el
reproductor mutea igual. **No subir nada sin pasarlo por acá:**

```bash
ffmpeg -y -i ENTRADA.mp4 -an -r 30 -vf "scale=1920:-2"   -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 23   -preset slow -movflags +faststart public/media/SALIDA.mp4

rm public/media/SALIDA-poster.jpg   # el viejo es el frame del clip anterior
node scripts/gen-posters.mjs
```

Para clips de 20s o más: `-crf 26` y `scale=1600:-2`, si no se van a 8+ MB.
**Los originales en bruto NO están en el repo** (pesan 641 MB) y quedaron en un
temporal de la PC vieja: si hacen falta, se reexportan de Premiere.

### Decisiones tomadas en esta sesión

- **`HERO_RATE` pasó de 0.55 a 1**. El ralentizado existía solo porque el clip de
  IA duraba 8s y loopeaba en mitad de la intro; el real dura 21,8s.
- **El botón de audio sigue apagado** (`HERO_CON_AUDIO` en `app/page.tsx`): la
  pista del hero salió en silencio digital (-91 dB de pico). Debe ser el audio
  desactivado en la secuencia de Premiere. Reexportar con sonido de sala y
  poner el flag en `true`.
- **Los marcos de `historia` y `metodo` son casi cuadrados** (1,01:1). Se probó
  pasarlos a 16:9 y **se descartó por cómo quedaba la sección**: si hay que
  corregir el recorte, se reexporta el video en 1080×1080, no se toca el CSS.
- **Galerías separadas por sede** (`galeria-jh-*` / `galeria-ec-*`). Los archivos
  que hay son copias de los de IA hasta que lleguen las fotos reales.

### `check-hero.mjs`: dos fallas del propio test que el material real destapó

1. Los tiempos se anclaban en `networkidle`. Con videos de verdad la carga tarda
   más y la intro ya venía corriendo → 3 chequeos fallaban por el test, no por el
   sitio. Ahora se anclan en **el momento en que desaparece el preloader**, que es
   exactamente cuando arranca `film()`.
2. El contraste se medía sobre la reproducción en vivo: el mismo clip daba 3,49
   en una corrida y 4,86 en la siguiente. Ahora **pausa el video y lo recorre
   entero segundo a segundo**. Determinista y cubre el 100% del loop.

⚠️ **Pendiente concreto**: con esa medición honesta el título del hero da
**3,45:1 en el segundo 1** del clip (justo donde la pregunta queda sola). Cumple
AA para texto grande (3:1 a 86px) pero no el 4,5 del script. Se arregla subiendo
el velo local de `.cine-content::before` en `globals.css` — **no** oscureciendo
la escena entera, que es lo que el cliente rechazó.

## ✅ Sesión 2026-08-27 — Se va el video del hero

Devolución del cliente: **el video a pantalla completa le resulta invasivo**.
Se eligió la lectura literal (nada de video en el hero, ni siquiera contenido).

1. **`#cine` es ahora fondo crema + los arcos del manual.** Dos `RingsDeco`
   mucho más grandes que los de las secciones (`#cine .rings`: 72vw el rosa
   arriba a la izquierda, 46vw el teal abajo a la derecha). Se fueron
   `.cine-bg`, `.cine-veil`, el velo local `.cine-content::before`, los
   `text-shadow`, el fundido de pie `#cine::after` y `.btn.ghost` — todos
   existían solo para sobrevivir arriba del video.
2. **El copy pasó a negro sobre crema.** La coreografía que el cliente pidió el
   17-ago NO se tocó: pregunta palabra por palabra → `HOLD_PREGUNTA` (3s) →
   frase central → botones + nav + WhatsApp.
3. **El zoom lento del video lo reemplaza la respiración de los arcos** (24s,
   scale 1→1.06 y ±3°, en `HomeFx`, o sea que respeta reduced-motion).
4. **`hero.mp4` queda en `public/media/` sin usar**, a la espera de que el
   cliente defina dónde va (opciones que se le pasaron: banda contenida
   después del manifiesto, o sándwich como en las landings de sede).
   ⚠️ Sigue viajando al build (6,6 MB en `out/`) aunque ninguna página lo pida.
5. **`CineAudio.tsx` se eliminó** (está en el historial de git). Sin video no hay
   audio que activar. ⚠️ Esto **contradice el brief del cliente**, que pide
   expresamente "audio activable de forma orgánica" en el hero: hay que
   decírselo. Hoy no se perdía nada real porque el clip salió mudo (-91 dB).

### El manifiesto tuvo que animarse de nuevo

Con el hero ya en crema plano, el `fade-up` genérico del manifiesto no se veía:
se pasaba de una pantalla quieta a otra igual. Ahora el **título sube palabra
por palabra** con máscara (el mismo idioma que el hero) y el **párrafo se
enciende atado al scroll** (`scrub`, de 0,22 a 1 de opacidad por palabra), así
el que lo lee es el propio scroll.

- Las palabras se parten **desde JS** (`partirEnPalabras` en `HomeFx`), nunca
  desde el HTML con el CSS ocultando: si el script no llega, el texto queda
  entero y legible. Hay dos chequeos nuevos en `check-hero.mjs` que lo
  garantizan (en reduced-motion no se parte y nada queda apagado; con animación,
  al final del scroll ninguna palabra queda a media luz).
- El marco de la máscara lleva `padding-bottom: 0.16em` con margen negativo: los
  display van con `line-height: 0.95` y sin ese aire el marco le corta la cola a
  la "g" de "gimnasio".
- El `end` del scrub va en `top 20%`, no más abajo: con el recorrido largo las
  últimas palabras seguían apagadas con la sección ya centrada en pantalla.

### Lo que esto cierra

- **El pendiente de contraste se resolvió solo.** Venía 3,45:1 contra el frame
  más claro del clip; ahora el título da **14,64:1** y la frase **8,85:1**.
- **Lighthouse >90 en performance pasa a ser realista**: era el video fullscreen
  en autoplay lo que lo hacía imposible.
- Ya no hay que recalcular `HERO_RATE` ni volver a medir contraste cada vez que
  se cambia el clip del hero.

### Dos bugs de medición que aparecieron al hacerlo

1. **`opacity` en `.cine-content .sub` no existía en la práctica**: la intro
   anima esa misma propiedad con `autoAlpha` y al cerrar deja `opacity: 1`
   inline. O sea que el ablande solo se veía en reduced-motion, donde no corre
   la animación — las dos entradas quedaban distintas. Ahora va por **color**
   (`rgba(26, 24, 21, 0.82)`), que la animación no pisa.
2. **`check-hero.mjs` medía de más**: parseaba el color con `/\d+/` y se comía
   el alfa de `rgba()`, así que daba 14,64 para `.sub` en vez de 8,85. Además
   el chequeo 2 se reescribió entero: ya no recorre el video segundo a segundo
   sino que mide **los renglones reales** (rects de un `Range`, no la caja del
   elemento, que en un `h1` centrado de 16ch tiene aire a los costados) y
   calcula el contraste **píxel a píxel** mezclando el color del texto con el
   fondo. Sigue teniendo sentido: los arcos SÍ pintan color bajo el título.
   Y como los arcos se mueven, **se los clava con `!important` en los dos
   extremos del ciclo** antes de medir (el inline de GSAP pierde contra eso):
   sin eso daba 14,64 en una corrida y 11,62 en la siguiente. Es la misma
   lección de agosto con el video, en otra forma: **nunca medir sobre algo que
   se está moviendo.**
3. **Los arcos con `transformOrigin` en la esquina se van de cuadro.** Anclar el
   pivote en el centro de los círculos parecía más prolijo, pero `.rings.tl` ya
   trae `rotate(180deg)` del CSS y con el origen corrido el elemento entero
   termina en el extremo opuesto de la pantalla. Se deja el origen por defecto.
   (Lo cazó una captura, no el test: es de las cosas que hay que mirar.)

## 🎬 "Mejorar los videos con IA" — APROBADO, integrándose por tandas

**Decisión de Lautaro tras hablar con el cliente**: el cliente vio videos de
avatares IA en Instagram y quiere ese camino — no le molesta que sea IA. El
enfoque elegido NO es retocar los clips reales sino **recrear el lugar con
Nano Banana usando frames del video real como referencia** (mismo pipeline que
el cartel IA de /franquicia) y animar con image-to-video.

**El piloto (3 pruebas) fue APROBADO por el cliente (27-ago)** y se acordó
integrar por tandas, sede por sede, con revisión de Lautaro entre tandas.

**✅ TANDA 1 — José Hernández, INTEGRADA Y DEPLOYADA (27-ago):**
- `sede-jose-hernandez.mp4` = recreación del salón con luz solar dorada
  (0,98 MB, pipeline ffmpeg del proyecto) + poster regenerado.
- `galeria-jh-*.jpg` (las 5, 896×1200): reformer, fuerza, recepción, detalle
  con placa FOSQUE, salida. Verificado: build + smoke + check-hero OK.
- ⚠️ `galeria-jh-fuerza.jpg` es la única INVENTADA de cero (el video real no
  muestra la sala de fuerza) — si el cliente la quiere fiel, pedir foto real.
- ⚠️ En `galeria-jh-salida.jpg` el vidrio dice "PILATE…" cortado (texto IA
  menor); regenerar si molesta, igual que se hizo con recepción (v1 traía un
  cartel con texto ilegible).
- 🔑 **Truco del logo**: pasarle a Nano Banana el lockup oficial como imagen de
  referencia aparte (recorte de `app/opengraph-image.png`, crop 440:130:50:50)
  con "reproduced EXACTLY" → sale nítido. Sin eso lo deforma (pasó con el buzo).
- Los originales PNG 2K + los clips candidatos quedan en
  `Desktop/Claude/fosque/pruebas-ia/` (PC principal, fuera del repo).

**✅ TANDA 2 — Emilio Castro, INTEGRADA Y DEPLOYADA (27-ago):**
- `sede-emilio-castro.mp4` = **montaje de 3 tomas** (el original real también
  tenía 2-3 cortes): salón amplio con la profe de espaldas y la remera blanca
  FOSQUE (2,2s) → detalle de la placa FOSQUE en la torre con cuerda roja (1,8s)
  → plano medio de las alumnas (2s). Pedido de Lautaro: NO poner los dos planos
  generales seguidos. Corte con ffmpeg filter_complex trim+concat, luego el
  pipeline de compresión de siempre (1,4 MB).
- `galeria-ec-*.jpg` (las 4): reformer, recepción, detalle, salida. Identidad
  EC respetada: lámparas esféricas amarillas/naranjas colgando SIEMPRE
  presentes, galpón de chapa con lucarnas, reformers con torre, remera blanca
  FOSQUE (vs. buzo negro de JH).
- ⚠️ Inventadas de cero (sin referencia en el clip real): `galeria-ec-recepcion`
  y `galeria-ec-salida` (frente vidriado). Si el cliente las quiere fieles,
  pedir fotos del local.
- Los 3 clips individuales de 5s + las imágenes base 2K quedan en
  `Desktop/Claude/fosque/pruebas-ia/` para re-cortar el montaje sin regenerar.

**✅ TANDA 3 — Serie "equipo", INTEGRADA Y DEPLOYADA (27-ago):**
- Las 6 fotos que alimentan las cards de la home, /equipo y las landings de
  sede: `equipo-1..4.jpg`, `equipo-mantenimiento.jpg` (antes NO existía, era
  placeholder) y `galeria-detalle.jpg` (card mantenimiento de la home + galería
  Núñez). Todas con los uniformes reales (buzo negro con logo F / remera blanca
  FOSQUE) y los espacios reales (correas rosas JH, lámparas EC).
- Detalles menores aceptados por Lautaro: en la grupal el estampado chico dice
  "FOSQU"; en la de mantenimiento las máquinas salieron más de madera clara que
  las reales. Regenerar si el cliente los marca.
- 🔁 **`equipo-mantenimiento.jpg` REGENERADA (27-ago, 2ª pasada)**: la mujer de
  la v1 tenía la cara de una **profe** — la IA la sacó de los frames del rodaje,
  donde las que aparecen son las profesoras. Poner esa cara limpiando es
  atribuirle a una persona real un puesto que no es el suyo. La v2 es la misma
  escena y la misma luz, pero **de espaldas y con la cabeza girada hacia abajo:
  no se ve nada de la cara, ni de perfil**. Regla que queda: en esta serie,
  **cualquier rol que no sea "profe" va sin cara reconocible** — de espaldas o
  plano cerrado. Bonus: de espaldas no se ve el logo del pecho, así que se
  esquiva la deformación de siempre. Prompt: "recreate this EXACT interior…
  change ONLY the person, photographed strictly FROM BEHIND… no part of her face
  is visible, not even a sliver of profile". El 2K fuente está en
  `pruebas-ia/eq-mantenimiento.jpg` (pisó al anterior).

**✅ TANDA 4 — metodo.mp4 e historia.mp4 de la home (27-ago), SIN créditos:**
- Reemplazados por videos "Ken Burns" (zoom lento sobre still) hechos con
  ffmpeg `zoompan` a partir de imágenes IA ya aprobadas: metodo = la profe
  corrigiendo el estiramiento (crop 1080×1350 de `ia-reformers.png`), historia
  = el salón cálido de JH (`ia-salon.png`, 1920×1080). ~10s cada uno, mismas
  dimensiones que los clips reales que reemplazan.
- Receta anti-tembleque del zoompan: upscale grande ANTES del zoompan
  (`scale=3240:4052` / `5504:3072`) y zoom de 0.0003 por frame. Sin eso el
  Ken Burns tiembla.

**Próximas tandas**: Núñez (sin referencia real: pedir fotos del local, aunque
sean de celular) → hero/franquicia si el cliente quiere.
⚠️ Créditos Higgsfield: **~91 de 456** (imagen ≈2, video 5s 1080p = 45) — para
más tandas con video IA hace falta recargar; los Ken Burns salen gratis.

**Piloto (2 pruebas) generado vía Higgsfield MCP, esperando el OK del cliente:**
- Pipeline: frames del MP4 real (`ffmpeg fps=1`) → `media_upload` →
  `nano_banana_pro` 16:9 2k con `image_references` (prompt: "recreate this
  exact studio… preserve architecture/machines/branding, transform only the
  atmosphere") → `seedance_2_5` mode `omni_reference` con `start_image` =
  job_id de la imagen, 5s 1080p sin audio (45 créditos por clip).
- Resultados en `Desktop/Claude/fosque/pruebas-ia/` (PC principal, fuera del
  repo): `clip-salon.mp4` (recreación fiel del salón de JH con luz cálida) y
  `clip-reformers.mp4` (fila de reformers + profe con buzo del logo).
- Costo del piloto: ~94 créditos (2 imágenes + 2 videos). Saldo tras el piloto:
  362 de 456.
- ⚠️ El logo de la marca en el buzo sale semi-deformado (trampa conocida: la IA
  regenera, no copia). En planos donde el logo se vea grande, taparlo/evitarlo
  o corregirlo aparte.
- Si el cliente aprueba: repetir por video a reemplazar eligiendo el mejor
  frame de referencia de cada MP4 real; para Núñez (sin rodaje) no hay
  referencia real — pedir fotos del local aunque sean de celular.

### Contexto previo (análisis del 27-ago, antes del piloto)

Pedido del cliente (27-ago-2026), **sin resolver y sin idea todavía**. Lo que
dijo es que no le gusta cómo se ven sus locales. Ojo con lo que eso significa:
**el problema no es técnico** (resolución, compresión, nitidez) sino la luz y el
espacio real. Eso cambia cuál es la herramienta.

**La trampa a evitar.** Ya está documentado en otro proyecto que el upscale de
IA **no escala: regenera** — reescribió texto de etiquetas en las 3 pruebas que
se hicieron. Sobre el local REAL de un negocio eso es peor que feo: la persona
que reserva **va a ir físicamente ahí**. Mostrar un salón que la IA mejoró es
venderle un lugar que no existe. Antes de hacer nada de esto hay que planteárselo
al cliente en esos términos, no como un problema técnico.

**Lo que sí se puede hacer sin inventar nada, en orden de rendimiento:**

1. **Corrección de color.** Los seis clips salieron de Premiere y acá se
   comprimieron con ffmpeg (CRF 23) — **el grading nunca se tocó**. Levantar
   sombras, calentar hacia la paleta de la marca (crema/durazno) y sacarle el
   verde a la luz fluorescente es, con bastante probabilidad, el 80% de "no me
   gusta cómo se ve". Es lo primero que hay que probar y no necesita IA.
2. **Cambiar el plano, no el local.** Hay **296 clips en bruto** sin usar (ver
   abajo): los 6 que están servidos son un recorte mínimo. Si lo que no le gusta
   es el salón, la respuesta editorial es no mostrarlo entero — planos cerrados
   de reformer, manos, caras — y no maquillarlo.
3. **Higgsfield** (MCP conectado): `upscale_video` 2K/4K, `reframe`,
   `motion_control`. Probar en **UN** clip corto y comparar mirando
   específicamente si reescribe carteles, logos o el equipamiento del local.
   No prometerle nada antes de esa prueba.

⚠️ **Núñez es caso aparte**: esa sede nunca se filmó, así que `sede-nunez.mp4`
ya es 100% IA. Ahí el pedido es al revés — hace falta material real, no mejor.

## 🗂️ Material en bruto: está en la PC de casa, NO viaja

`Desktop/Fosque` — **23 GB**, fuera del repo: 99 ARW + 296 clips 1080p a
119,88 fps con audio, del rodaje del 12-ago (solo las 2 sedes de Mataderos).
Es de donde salieron los 6 videos servidos. **Si en la otra PC hay que tocar los
videos, este material tiene que viajar**: sin él solo se pueden retocar los MP4
ya comprimidos, que es partir de mucho menos.
Los exports intermedios de Premiere (641 MB) se perdieron en un temporal: se
reexportan si hacen falta.

## ⏳ Pendientes

📋 Todo lo que falta de parte del cliente, junto y listo para mandarle:
`docs/PEDIDO-AL-CLIENTE.md` (incluye los números de franquicia y la versión
corta para WhatsApp).

**Del CLIENTE (bloquean):**
1. URL login EVO → `EVO_URL` en `components/Nav.tsx` (hoy `#`; también en Footer).
   ⚠️ El doc del 17-ago vuelve a dibujar el botón `[Ingresá a tu Perfil]` pero
   sigue sin mandar la URL.
2. ~~Instagram por sede~~ ✅ RESUELTO (27-ago): el cliente mandó las 3 URLs y están cargadas en `data/sedes.ts` (cards home + landing con @handle + footer). Falta: Instagram/Facebook GENERAL → `IG_URL`/`FB_URL` en `Nav.tsx` (los íconos del nav siguen en `#`; el "Facebook" del footer también).
3. Confirmar direcciones ⚠️ "José Hernández" pin en Bragado 5952, "Emilio Castro" en Andalgalá 1395 (`direccionPendiente: true`). Los NOMBRES ya los confirmó el doc del 17-ago (Fosque José Hernández / Emilio Castro / Núñez, FJH/FEC/FNN).
4. **HORARIOS: hay contradicción sin resolver.** El doc del 17-ago contesta el
   mito "no tengo tiempo" con "L a V 7:00–22:00, sábados desde 9:00, domingos a
   la mañana y feriados abiertos" — eso es SOLO José Hernández. En `data/sedes.ts`
   Emilio Castro es L-V 8–21 / sáb 9–13 y Núñez L-V 8–21 / sáb 8–13, y **ninguna
   de las dos abre domingo**. Encima para JH figura "domingos hasta 17:00" y el
   doc dice "a la mañana". No tocar hasta que confirme sede por sede.
5. ¿Los mitos son 7 o 3? El doc del 17-ago lista 3; en el sitio están los 7 que
   él mismo mandó en agosto. Se asumió que los 3 son ejemplos y NO se borró nada.
6. Media real del rodaje: reemplazar por nombre en `public/media/` — `franquicia.mp4`, `equipo-mantenimiento.jpg`, y todas las fotos IA (las del "equipo" son IA: cambiarlas antes del lanzamiento real). ⚠️ Desde el 27-ago el hero NO usa video: definir con el cliente dónde va `hero.mp4` (o si se descarta).
   ⚠️ El rodaje del 12-ago cubrió **solo las 2 sedes de Mataderos** (material en
   `Desktop/Fosque`, fuera del repo: 99 ARW + 296 clips 1080p a 119,88fps con
   audio). **Núñez no se filmó** y el doc pide material real de cada sede.
   Además hoy las 3 sedes comparten los mismos `galeria-*.jpg`: con material real
   conviene separarlos por sede en `data/sedes.ts`.

**Técnicos:**
- ~~**Dominio fosque.com mal apuntado**~~ ✅ **RESUELTO el 3-sep**: el hosting
  apuntó los dos nombres a su Apache y emitió el SSL. El relevamiento del 27-ago
  que estaba acá (redirección al `.vercel.app`, certificado roto, `www` en
  Bitrix24) quedó obsoleto — el estado real y lo que falta está arriba, en
  "2026-09-03 — El sitio se muda al hosting del cliente (FTP)". Lo único que
  queda es **subir `deploy-ftp/` por FTP**.
- **Confirmarle al cliente que el botón de audio del hero se cayó** con el video (lo pide el brief). Vuelve solo si el video vuelve al hero de alguna forma.
- Lighthouse >90 que pide el doc: **ahora sí es alcanzable en las cuatro categorías** — el techo era el video fullscreen en autoplay. Falta medirlo.
- Decap CMS para que Vero publique novedades sola (guía provisoria: `COMO-PUBLIR.md.txt` en la carpeta del proyecto de la PC principal).
- Transición home → sede con barrido de arcos (idea vieja, baja prioridad).

## 🔄 Traspaso 27-ago (2ª sesión, PC principal → PC de casa)

Todo lo de hoy está DEPLOYADO y en el repo — para continuar alcanza `git pull`:

1. **Tandas IA 1-4 en vivo**: JH (video + 5 galería), EC (montaje 3 tomas + 4
   galería), serie equipo (6 fotos: home + /equipo + sedes), metodo/historia de
   la home como Ken Burns (gratis, ffmpeg zoompan).
2. **Instagram por sede cargados** (bloqueante resuelto): cards home + landing
   con @handle + footer. Falta el IG/FB GENERAL (nav sigue en `#`).
3. **Fix mobile**: las cards de sedes se clipeaban 60px abajo (entrance `y:60`
   dentro del scroller nativo). Mobile ahora anima solo opacidad.
4. **`pruebas-ia/` ahora viaja EN el repo** (20MB: clips fuente + stills en JPG
   + README con el pipeline). Los PNG 2K originales quedaron en la PC principal
   (`Desktop/Claude/fosque/pruebas-ia/`) y en el historial de Higgsfield.

**Para seguir (en la PC de casa conviene porque AHÍ está el material en bruto):**
- **Núñez**: pedir fotos del local al cliente (nunca se filmó, no hay referencia).
- **Créditos Higgsfield: quedan ~91** — recargar antes de más videos IA
  (45/clip). Fotos (~2) y Ken Burns (gratis) alcanzan con lo que hay.
- Pendientes de siempre: EVO URL, IG/FB general, horarios por sede, fosque.com.

## 🗂️ Otros archivos fuera del repo (PC de casa, Desktop/Claude/fosque/)

`CONTINUAR.md` viejo (reemplazado por este), `lineamientos nuevos fosque.txt` (copiado a `docs/`), `files/` (brief y prototipos originales). Nada de esto hace falta: para trabajar el SITIO alcanza con el repo. Lo único que sí puede faltar es el material en bruto del rodaje (ver arriba).
