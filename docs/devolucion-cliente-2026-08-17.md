# Devolución del cliente — 17-ago-2026

Documento recibido de Dirección / Comunicación Método Fosque ("Documento de
trabajo y devolución de arquitectura digital"). Se guarda tal como llegó.

⚠️ **Cómo leerlo**: el grueso del documento describe secciones que YA estaban
construidas y online (historia, programa, sucursales, mitos, equipo, header
sticky, widget de WhatsApp, nav). Habla de "comenzar la maquetación" y de
"ajustar el prototipo en Figma": no hay etapa de Figma en este proyecto. Lo que
pedía DE NUEVO está implementado y anotado en `CONTINUAR.md`, sesión 2026-08-17.

---

## Dirección de arte y color

- **Continuidad cromática obligatoria**: prohibido el salto a fondos negros
  neutros (`#000000`) o contrastes bruscos al terminar la carga de video. Todos
  los fondos dentro de la paleta oficial (sobrios, cálidos, neutros).
- **Transiciones de fondo**: progresivas, con fades suaves
  (`transition: background-color 0.8s ease-in-out`).
- **Estética premium**: limpia, alto valor percibido, tipo lifestyle
  luxury/wellness, tipografías de gran porte, pausas en pantalla calculadas.

## Motor de video

- **Hero loop continuo**: autoplay, muted, loop, playsinline, desde el segundo 0,
  sin congelamientos ni pantalla negra mientras bufferea.
- **Audio orgánico**: activación opcional con un micro-botón sutil
  `[🔊 Activar Sonido]` que no interrumpa el flujo visual.
- **Control de pasadas de texto**: el copy de impacto no aparece de golpe; se
  sincroniza con el video a un ritmo que permita procesar y conectar.

## Sección 1 — Hero, secuencia temporal

1. **0s – 3s**: carga y reproducción continua sobre fondo en paleta. En pantalla,
   grande y pausada, la pregunta:
   > ¿Qué es lo más importante de tu vida?
2. **A los 3s**: transición fluida, el video continúa y se SUMA el texto central:
   > En Fosque nos dedicamos a que puedas disfrutar y cuidar lo que
   > verdaderamente tiene valor en tu vida.
3. **Elementos fijos**: al quedar asentado el mensaje emergen los botones, y la
   segunda pantalla narrativa aparece al hacer scroll:
   > Fosque no es un gimnasio. Es el lugar donde lográs tu mejor versión,
   > acompañada y motivada por personas maravillosas. Un espacio donde siempre
   > sos bienvenida, guiada con amabilidad para que el ejercicio físico se
   > convierta en un hábito en tu vida y disfrutes los enormes beneficios.

CTA principal: `[ Quiero vivir la experiencia Fosque ]`.

## Secciones 2 a 7

Historia y manifiesto (24 años, 30.000 personas, Mujer Fosque) · Programa Fosque
con los 7 beneficios y los 3 niveles · Sucursales · Mitos en acordeón · Equipo
(Profe / Ejecutiva / Mantenimiento) · Header sticky con EVO · Widget flotante de
WhatsApp con selector por sede. **Todo esto ya estaba implementado.**

### Sucursales — nombres y códigos oficiales (dato NUEVO y útil)

| Código | Nombre oficial          | Disciplinas                       |
| ------ | ----------------------- | --------------------------------- |
| FJH    | Fosque José Hernández   | Fosque Reformer + Fuerza y Cardio |
| FEC    | Fosque Emilio Castro    | Fosque Reformer                   |
| FNN    | Fosque Núñez            | Fosque Reformer                   |

### Horarios que menciona (⚠️ contradicen a `data/sedes.ts`)

> Lunes a viernes de 7:00 a 22:00 · Sábados desde 9:00 · Domingos a la mañana y
> feriados abiertos.

Eso corresponde solo a José Hernández. Ver el pendiente 4 en `CONTINUAR.md`.

## Nota adicional — cambio de copy del cierre

Reemplazar:

> TU MOMENTO ES AHORA
> Cambiá tu vida en un abrir y cerrar de ojos.

por:

> MI MOMENTO ES AHORA.
> Comienzo el cambio. Elijo ser mi mejor versión.

(+ el mismo botón `[ Quiero vivir la experiencia Fosque ]`.) **Implementado.**

## Próximos pasos que pide

1. Ajustar el prototipo en Figma con la paleta unificada. → No aplica: el sitio
   está construido y online, no hay Figma en el proyecto.
2. Maqueta técnica del hero con la temporización de 3 segundos. → Implementado
   (`HOLD_PREGUNTA` en `components/home/HomeFx.tsx`).
3. Revisión de avances validando Lighthouse > 90 en performance. → Ver pendientes
   técnicos: >90 en performance con video fullscreen en autoplay no es realista.
