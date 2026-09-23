# Lo que falta de parte del cliente — 17-ago-2026

Todo lo que hoy bloquea al sitio, junto. Cada punto dice **dónde impacta** y
**qué pasa si no llega**, para no volver a preguntar de a uno.
La versión corta para pegar en WhatsApp está al final.

## 1. Franquicia — los números (lo más urgente)

La página `/franquicia/` está hecha y coincide con la referencia que mandó
(CLIC / franquiciasquecrecen). La diferencia es que esa referencia habla de
**invertir en un negocio** y la nuestra es toda marca y emoción: no tiene un
solo dato económico. Quien busca franquicia quiere saber:

- **Inversión inicial estimada** (rango: "desde X").
- **Qué incluye** exactamente ese monto (equipamiento, marca, formación, obra).
- **Regalía / canon mensual**, si lo hay.
- **Plazo de recupero estimado**.
- **Requisitos del local**: metros mínimos, tipo de zona, cantidad de camas.
- **Zonas disponibles** y si hay exclusividad territorial.

→ Van en un bloque nuevo entre "El modelo" y el formulario. Sin esto, la página
capta curiosos y no inversores.

## 2. ¿Va a haber pauta paga?

Si la franquicia se va a promocionar con anuncios (como el posteo de referencia),
el sitio hoy **no tiene GA4 ni Pixel de Meta**: no habría forma de medir ni de
optimizar. Hace falta el ID del Pixel y el de GA4, y decidir cuál es la acción
que cuenta como conversión (⚠️ mal definida, las conversiones se inflan solas).

## 3. Horarios — hay una contradicción

El doc del 17-ago contesta "no tengo tiempo" con **L a V 7:00–22:00, sábados
desde 9:00, domingos a la mañana y feriados abiertos**. Eso es solo José
Hernández. En el sitio figuran:

| Sede | Lunes a viernes | Sábados | Domingos |
| --- | --- | --- | --- |
| FJH José Hernández | 7:00–22:00 | 9:00–18:00 | hasta 17:00 |
| FEC Emilio Castro | 8:00–21:00 | 9:00–13:00 | cerrado |
| FNN Núñez | 8:00–21:00 | 8:00–13:00 | cerrado |

→ Confirmar sede por sede. Y en JH: ¿domingos "a la mañana" o "hasta 17:00"?
**No se toca nada hasta que confirme**: publicar horarios que no se cumplen es
peor que no publicarlos.

## 4. Direcciones sin confirmar

- **José Hernández** → el pin de Google está en **Bragado 5952**.
- **Emilio Castro** → el pin está en **Andalgalá 1395**.

El nombre comercial no coincide con la calle en ninguna de las dos. ¿Es correcto?

## 5. Links que faltan (los pide su propio documento)

- **EVO**: la URL del login de socios. El botón "Ingresá a tu Perfil" está en el
  header y en el footer, hoy apunta a la nada.
- **Instagram y Facebook** generales.
- **Instagram de cada sede** (activa el botón en las tarjetas de sucursal).

## 6. Mitos: ¿7 o 3?

En el sitio están los 7 que mandó en agosto. El doc del 17-ago lista 3. Se
asumió que son ejemplos y **no se borró nada**. Confirmar.

## 7. Núñez no está filmada

El rodaje del 12-ago cubrió las dos sedes de Mataderos. El doc pide "material
audiovisual real de cada sede": Núñez queda con video de IA hasta que se filme.
¿Se agenda una jornada?

## 8. Fotos del equipo

Las fotos de la sección Equipo son de IA y hay que cambiarlas antes del
lanzamiento. Falta además el retrato del **personal de mantenimiento**.

## 9. Dominio

Su documento encabeza con **fosque.com** como si ya existiera. Hoy el sitio vive
en fosque.vercel.app. ¿Quién compra el dominio?

---

## 10. Fuerza y Cardio en José Hernández (nuevo, 16-sep)

La sección ya está armada con tus tomas del gimnasio y el copy lo escribí yo
como **complemento de Fosque Reformer**, no como gimnasio. Para que no diga
nada que no sea cierto, tres preguntas cerradas:

1. ~~**¿Qué hay en la sala?**~~ ✅ **Contestado el 21-sep**: mandó el texto de
   las tres tarjetas (fuerza y peso libre; cintas con y sin motor, bicicletas
   fijas y elípticos; siempre con instructor). Está cargado tal cual.
2. ~~**¿Entra en la membresía de Reformer o es un plan aparte?**~~ ✅ **Contestado
   por el PDF del 21-sep**: la Membresía F de José Hernández es integral
   (Fuerza, Cardio + Reformer). Cargado en la sección Membresía F de JH.
3. ~~**"Un instructor te guía y te corrige en cada sesión"**~~ ✅ **Contestado
   el 21-sep**: "siempre hay un profesional del equipo". Es literal.

Las tres quedaron contestadas. Lo que sigue abierto está en el punto 11.

## 11. Lo que llegó en el PDF del 21-sep (membresías, landing, Fuerza y Cardio)

Los tres cambios ya están armados para que los veas en el preview:
https://fosque-preview.vercel.app (la Membresía F en cada sede, la landing en
/invitacion/ y Fuerza y Cardio con tu texto en /jose-hernandez/). Cuatro
preguntas cerradas para cerrarlos:

1. **URL de la plataforma de socios.** El PDF dice `socios.fosquereformer.com`,
   pero esa dirección no existe (ni el dominio fosquereformer.com está
   registrado). ¿Cuál es la URL real donde entran hoy las socias (EVO)? Es lo
   que falta desde agosto para que "Ingresá a tu Perfil" e "Ingresar a mi
   Membresía F" funcionen.
2. **"Pilates Reformer" o "Fosque Reformer".** En tu PDF es siempre "Pilates
   Reformer"; en todo el sitio es "Fosque Reformer, la evolución de Pilates".
   Lo cargué como lo escribiste. ¿Lo dejamos así o unificamos?
3. **Semana de Invitación (2 sesiones).** ¿Es permanente o tiene fecha de
   inicio y fin? Si tiene fecha, la sacamos después para que el sitio no
   prometa algo vencido.
4. ~~**Las fotos de Fuerza y Cardio.**~~ ✅ **Resuelto el 21-sep**: la imagen
   principal de la sección ahora es un díptico con la sala de fuerza (mayoría
   entrenando, una sonriendo a cámara) al lado de la de Reformer, como
   pediste. Es una foto generada, igual que el resto de la galería del sitio,
   así que no hace falta el OK de ninguna alumna: no es nadie real.

Tres retoques que hice sobre tu texto de la landing, por si no van:
"Actívate" → "Activate" y "Anótate" → "Anotate" (el resto está en vos) e
"Inicia" → "Inicial" en los niveles.

## Versión corta para WhatsApp

> Hola! Ya está online todo lo que pediste en el documento: el hero arranca con
> el video desde el primer segundo y sin fondos negros, el texto entra por
> tiempos, "Fosque no es un gimnasio" quedó como pantalla aparte al scrollear y
> el cierre ahora dice "Mi momento es ahora". También quedó el footer en tonos
> claros, así no queda ninguna superficie oscura en el sitio.
>
> La landing de franquicia ya estaba hecha desde la semana pasada, acá te la
> dejo: fosque.vercel.app/franquicia/ — coincide con la referencia de CLIC que
> me pasaste, con una diferencia: la de ellos habla de invertir y da números, y
> la nuestra todavía no tiene ninguno. Para completarla necesito:
> inversión inicial estimada, qué incluye, si hay canon mensual, plazo de
> recupero, metros mínimos del local y qué zonas están disponibles.
>
> Y me quedaron estas para cerrar:
> 1) Horarios de cada sede. Lo que me pasaste (7 a 22, domingos y feriados) es
>    el de José Hernández; Emilio Castro y Núñez tengo 8 a 21 y sin domingos.
>    ¿Está bien así?
> 2) Direcciones: José Hernández en Bragado 5952 y Emilio Castro en Andalgalá
>    1395, ¿correcto?
> 3) El link de EVO para el botón "Ingresá a tu Perfil".
> 4) Instagram y Facebook, los generales y el de cada sede.
> 5) Los mitos, ¿quedan los 7 o querés solo los 3 del documento?
> 6) Núñez no la filmamos, ¿agendamos un día?
> 7) El dominio fosque.com, ¿lo comprás vos?
> 8) ¿Vas a hacer publicidad paga con esto? Si sí, necesito el Pixel de Meta y
>    Google Analytics antes de que arranque, si no no hay forma de medir.
