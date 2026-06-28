# Protea Vivo - reporte tecnico del modelo storytelling

Modelo web inmersivo para Protea construido sobre UIkit, con una experiencia desktop basada en canvas/lente y una adaptacion movil orientada a narrativa por secciones, tab bar inferior y carruseles horizontales.

Este documento consolida la arquitectura tecnica, nombres de objetos, medidas, versionado, observaciones y el cierre de TASK-001.

## Version documentada

- Version visual: `v20260624-7`
- Commit funcional de referencia: `11497af`
- Etiqueta visible en landing principal: `Modelo storytelling`
- Estado: prototipo navegable estatico con UIkit por CDN.

## Stack y dependencias

- HTML estatico.
- UIkit `3.21.16` por CDN.
- UIkit Icons por CDN.
- Google Fonts:
  - `Montserrat` para marca, titulos, nav y rotulos.
  - `Roboto` para texto base.
- Canvas 2D nativo para hero inmersivo.
- CSS propio:
  - `assets/css/protea.css`: base visual original del skeleton.
  - `assets/css/protea-live.css`: capa viva de integracion, responsive, mobile UI y overrides.
- JS propio:
  - `assets/js/protea.js`: motor canvas/lente, assets, parallax, resize estable.

## Mapa de archivos

```txt
protea_vivo/
|-- index.html
|-- README.md
|-- assets/
|   |-- css/
|   |   |-- protea.css
|   |   `-- protea-live.css
|   |-- js/
|   |   `-- protea.js
|   `-- img/
|       `-- reference-home.png
|-- components/
|   `-- hero/
|       |-- index.html
|       |-- style.css
|       |-- script.js
|       `-- assets/
|           |-- base_sharp.png
|           |-- bg_far.png
|           |-- bg_mid.png
|           |-- glow_far.png
|           |-- glow_mid.png
|           |-- network_far.png
|           |-- network_mid.png
|           |-- network_near.png
|           |-- orbits_far.png
|           `-- orbits_sharp.png
|-- pages/
|   |-- contacto.html
|   `-- insights.html
`-- task/
    `-- TASKS_CODEX.md
```

Nota: `task/` es carpeta local de gestion y no debe ser versionada ni pusheada salvo instruccion explicita.

## Mapa de sitio

```txt
/
|-- protea/                  estructura general del rediseno
|-- protea_vivo/             modelo storytelling vivo
|   |-- #observatorio         hero / tesis perceptiva
|   |-- #colapso              slideshow de colapso silencioso
|   |-- #capacidad            capacidades adaptativas
|   |-- #inteligencia         inteligencia adaptativa / triada
|   |-- #protea               soluciones Protea
|   `-- #contacto-final       cierre CTA
|-- protea/sitemap.txt
|-- protea/Brief.md
|-- Drive externo
|-- 0001/
`-- prototipos/aminoacidos/v2.9-memoria-adaptativa/
```

## Arquitectura de interfaz

```txt
protea-shell
|-- section-rail
|   `-- rail-item
|-- protea-main
|   |-- site-nav
|   |   |-- brand
|   |   |-- desktop navbar
|   |   `-- mobile-menu-button
|   |-- mobile-story-nav
|   |-- story-section
|   |   |-- hero-section
|   |   |   |-- hero-canvas
|   |   |   |-- hero-copy-panel
|   |   |   |   |-- eyebrow
|   |   |   |   |-- hero-title
|   |   |   |   |-- hero-copy
|   |   |   |   `-- CTA group
|   |   |   `-- hero-canvas-space
|   |   |-- dark-section
|   |   |-- light-section
|   |   |-- slide-card
|   |   |-- mini-card
|   |   |-- device-card
|   |   `-- triad-diagram
|   `-- footer-cta
`-- mobile-offcanvas
```

## Glosario tecnico de objetos UI

### `protea-shell`

Contenedor maestro del modelo. En desktop se comporta como reticula de dos columnas:

- columna izquierda: `section-rail`
- columna derecha: `protea-main`

### `section-rail`

Rail narrativo lateral desktop. Funciona como indice vertical de secciones y referencia visual del storytelling.

- Visible desde breakpoint `m` de UIkit.
- Ancho: `132px`.
- Posicion: `sticky` en la capa viva.
- Altura: `100vh`.

### `site-nav`

Navegacion superior. Contiene marca, enlaces desktop, boton de contacto y boton hamburguesa movil.

- Desktop: transparente/papel 10% con blur.
- Movil: sticky superior, fondo papel translucido, boton menu.

### `mobile-story-nav`

Tab bar movil inferior con iconos UIkit. Reemplaza al rail lateral en movil.

- Posicion: `fixed`.
- Ubicacion: pie de pantalla.
- Estetica: interfaz tipo red social / app tab bar.
- Iconos UIkit:
  - `search`: observatorio
  - `warning`: colapso
  - `refresh`: capacidad
  - `bolt`: inteligencia
  - `world`: Protea

### `hero-section`

Seccion principal del sitio. Es el primer bloque narrativo y contiene el canvas inmersivo.

- Desktop: `height: 100vh`, `min-height: 760px`.
- Movil: usa `--mobile-critical-h`, calculado desde `100dvh` menos nav superior, tab bar inferior y safe area.

### `hero-canvas`

Canvas absoluto de fondo. Renderiza lente, capas, redes, glow, cotas cientificas y parallax.

- Selector: `#protea-canvas`.
- JS: `assets/js/protea.js`.
- Assets: `components/hero/assets/`.
- En desktop responde al puntero.
- En movil funciona como parallax pasivo para no interferir con gestos tactiles.

### `hero-copy-panel`

Bloque textual del hero, tambien llamado "panel de copia del hero".

HTML actual:

```html
<div class="uk-width-1-3@m hero-copy-panel">
```

Contiene:

- `eyebrow`: etiqueta "Lo importante".
- `hero-title`: titulo principal.
- `hero-copy`: bajada descriptiva.
- CTA group: botones "Explorar" y "Ver ruta Protea".

Problema detectado:

- La caja se siente angosta en desktop.
- El texto salta de linea demasiado pronto.

Causas tecnicas:

- `uk-width-1-3@m`: ocupa 1/3 del grid desktop.
- `.hero-section .hero-copy-panel>* { max-width: 440px; }`
- `.hero-copy { max-width: 420px; }`

Directriz tecnica sugerida:

> Expandir el `hero-copy-panel` desktop de `1/3` a `5/12` o aumentar el ancho maximo de contenido a `540-580px`, manteniendo la lente en el area visual derecha.

### `hero-canvas-space`

Columna visual reservada para la lente/canvas en desktop.

HTML actual:

```html
<div class="uk-width-2-3@m hero-canvas-space" aria-hidden="true">
```

Este objeto no dibuja la lente directamente; reserva aire compositivo para que el canvas absoluto respire detras del contenido.

### `slide-card`

Objeto usado dentro del slideshow de "Colapso silencioso".

Contiene:

- objeto visual central (`slide-object`)
- caption (`slide-caption`)
- texto de comentario conceptual

### `mini-card`

Card de capacidades adaptativas.

Contenido actual:

- Percibir
- Comprender
- Aprender
- Responder
- Evolucionar

### `triad-diagram`

Diagrama textual de Inteligencia Adaptativa.

Contiene:

- Complejidad
- Adaptabilidad
- Innovacion

### `device-card`

Card de soluciones Protea.

Contenido actual:

- IAO
- DIAGNOS
- Training
- Lab
- Hub

## Medidas actuales

### Desktop

```txt
section-rail
- width: 132px
- height: 100vh

hero-section
- height: 100vh
- min-height: 760px

hero-copy-panel
- UIkit width: uk-width-1-3@m
- padding-left: 68px
- padding-right: 24px
- content max-width: 440px

hero-copy
- max-width: 420px
- font-size base: 18px

hero-canvas-space
- UIkit width: uk-width-2-3@m
- min-height: 620px

desktop nav
- padding base: 22px 28px desde protea.css
- fondo vivo: rgba(243,239,232,.10)
- blur: 14px
```

### Movil

```txt
variables
- --mobile-nav-h: 62px
- --mobile-story-h: 46px
- --mobile-safe-b: env(safe-area-inset-bottom, 0px)
- --mobile-critical-h: 100dvh - nav - tabbar - safe area

site-nav
- sticky top
- min-height: 62px
- padding: 9px 16px

mobile-story-nav
- fixed bottom
- left/right: 12px
- bottom: 10px + safe area
- min-height: 46px
- border-radius: 999px

hero-copy-panel
- padding-left/right: 28px
- text-align: center

hero-copy
- max-width: 320px
- font-size: 16px

mobile section cards
- width: min(80vw, 330px)
- min-height: min(52dvh, 390px)
- padding: 24px
- overflow: auto
```

## Comportamiento desktop

- Layout principal en dos columnas.
- Rail narrativo lateral fijo/sticky.
- Nav superior flotante con transparencia tipo papel.
- Hero full viewport con canvas inmersivo.
- Canvas con:
  - capas de fondo
  - redes
  - glows
  - lente magnetica
  - escala de grados
  - cotas tecnicas
  - nodos y lineas guia
- Pointer desktop altera foco/parallax de la lente.
- Secciones posteriores alternan fondo oscuro y papel.

## Comportamiento movil

- Nav superior sticky compacto.
- Menu completo en offcanvas UIkit.
- Navegacion narrativa inferior tipo tab bar de red social.
- Iconos desde UIkit Icons, no SVG custom.
- Area critica calculada con `100dvh` y safe area.
- Scroll vertical por secciones con `scroll-snap`.
- Hero centrado:
  - texto intro centrado
  - lente/canvas debajo
  - canvas como parallax pasivo
- Secciones largas pasan a carrusel horizontal:
  - primera slide: introduccion textual de la seccion
  - slides siguientes: conceptos/cards
  - pista visual `Desliza ->`
  - cards con overflow interno para evitar cortes de texto

## Motor canvas

Archivo:

```txt
assets/js/protea.js
```

Responsabilidades:

- Cargar assets del hero.
- Medir `hero-section`.
- Configurar DPR limitado (`dprMax: 1.15`).
- Dibujar capas con `drawCover`.
- Dibujar lente interior.
- Dibujar marco de lente.
- Dibujar overlay cientifico.
- Recalcular tamanos con:
  - `ResizeObserver`
  - `window.load`
  - `document.fonts.ready`
  - doble `requestAnimationFrame`

Motivo:

Evitar que al refrescar el canvas se mida antes de que el layout este asentado y se desarme la escala de la lente.

## Versiones recientes

```txt
v20260624-7
- commit: 11497af
- cambio: tab bar movil inferior, historial dl/dt/dd, carruseles con pista de deslizamiento.

v20260624-6
- commit: c672540
- cambio: iconos UIkit y slides moviles con intro.

v20260624-5
- commit: a4dab00
- cambio: sliders moviles por seccion.

v20260624-4
- commit: fdc3547
- cambio: UI movil adaptativa.

v20260624-3
- commit: c3466b7
- cambio: estabilidad de sizing del canvas.
```

## Caracteristicas implementadas

- Home storytelling con UIkit.
- Hero canvas inmersivo integrado como fondo.
- Nav superior con marca Protea.
- Rail narrativo desktop.
- Tab bar narrativa movil.
- Offcanvas movil.
- Scroll snap vertical en movil.
- Carruseles horizontales en movil.
- Slideshow UIkit para colapso silencioso.
- Cards de capacidades.
- Diagrama de inteligencia adaptativa.
- Cards de soluciones Protea.
- CTA final.
- Cache busting en assets vivos.

## TASK-001 - Consolidacion tecnica

### Alcance ejecutado

- Revision de estructura actual.
- Revision de codificacion UTF-8.
- Revision de enlaces internos y externos.
- Revision de componentes UIkit usados.
- Revision de tipografias declaradas.
- Revision de organizacion de carpetas.
- Actualizacion de README tecnico.

### Resultado de codificacion

- `index.html`: UTF-8 correcto.
- `pages/contacto.html`: UTF-8 correcto.
- `pages/insights.html`: UTF-8 correcto.
- `README.md`: normalizado a diagramas ASCII para evitar mojibake en terminales.
- `task/TASKS_CODEX.md`: se mantiene sin cambios por ser insumo local de trabajo.

### Resultado de enlaces

Enlaces revisados:

- Anclas internas: `#observatorio`, `#colapso`, `#capacidad`, `#inteligencia`, `#protea`, `#contacto-final`.
- Paginas internas: `pages/insights.html`, `pages/contacto.html`.
- Assets CSS: `assets/css/protea.css`, `assets/css/protea-live.css`.
- Assets JS: `assets/js/protea.js`.
- CDN UIkit: CSS, JS e iconos.
- Google Fonts: Montserrat y Roboto.

Observacion:

- No se modificaron rutas para no alterar comportamiento visual ni navegacion conceptual.
- Las paginas `pages/contacto.html` y `pages/insights.html` son placeholders editoriales minimos; su desarrollo formal queda para TASK-003.

### Resultado UIkit

Componentes UIkit presentes:

- Navbar.
- Grid.
- Slideshow.
- Dotnav.
- Slidenav.
- Offcanvas.
- Icons.
- Utility classes responsive.

Sin cambios funcionales en componentes.

### Resultado CSS

- Se mantiene `protea.css` como base historica.
- Se mantiene `protea-live.css` como capa de integracion viva.
- No se hicieron cambios visuales en TASK-001.
- Se documenta deuda de futura modularizacion:
  - separar layout shell
  - separar hero
  - separar mobile navigation
  - separar cards/carruseles

### Resultado JS

- Se mantiene `assets/js/protea.js`.
- No se modifico el Hero ni el canvas.
- El script ya esta preparado con resize estable y `ResizeObserver`.

### Estructura de carpetas

Estructura actual aceptada para continuar:

```txt
assets/      recursos del sitio vivo
components/  prototipos o componentes fuente reutilizables
pages/       paginas internas placeholder
task/        tareas locales no versionables
```

Observacion:

- `components/hero/` funciona como fuente historica del hero inmersivo.
- `assets/js/protea.js` contiene la version integrada en el sitio.
- No se mueve ninguna carpeta en TASK-001 para evitar deuda por rutas rotas.

### Archivos modificados

```txt
README.md
```

### Archivos creados

```txt
Ninguno
```

### Checklist de aceptacion TASK-001

- [x] UIkit preservado como framework principal.
- [x] Sin Bootstrap.
- [x] Sin Tailwind.
- [x] Sin dependencias nuevas.
- [x] Hero no modificado.
- [x] Canvas no modificado.
- [x] Storytelling no modificado.
- [x] Navegacion conceptual no modificada.
- [x] Codificacion revisada.
- [x] Enlaces revisados.
- [x] Componentes UIkit revisados.
- [x] Tipografias revisadas.
- [x] Estructura de carpetas revisada.
- [x] README actualizado.

## Riesgos y observaciones

- `hero-copy-panel` desktop esta demasiado restringido para el texto actual.
- La reticula desktop del hero favorece fuertemente la lente. Si se agranda el texto, habra que decidir si se reduce ligeramente el campo visual o si se superpone mas contenido sobre el canvas.
- En movil, los carruseles horizontales dependen de gesto lateral. La pista `Desliza ->` ayuda, pero podria reforzarse con un "peek" mas evidente de la segunda card.
- El tab bar inferior ocupa area visual critica; se compensa en CSS con `--mobile-critical-h`, pero requiere pruebas en Chrome Android y Safari iOS.
- El desarrollo formal de paginas internas queda pendiente para TASK-003.

## Proxima directriz sugerida

1. Ajustar ancho desktop de `hero-copy-panel`.
2. Definir una reticula editorial estable para desktop:
   - `Hero Copy Panel`
   - `Visual Field`
   - `Narrative Rail`
   - `Section Intro Card`
   - `Concept Card`
   - `Mobile Tab Bar`
3. Revisar balance entre lente y texto en desktop.
4. Afinar affordance de carruseles moviles.
5. Continuar con TASK-002 solo despues de revision.

## Directriz tecnica para ampliar "Lo importante"

Opcion conservadora:

```html
<div class="uk-width-5-12@m hero-copy-panel">
```

y ajustar:

```css
.hero-section .hero-copy-panel>*{
  max-width:560px;
}

.hero-copy{
  max-width:540px;
}
```

Opcion visual:

- Mantener `uk-width-1-3@m`.
- Aumentar solo `max-width` a `520px`.
- Reducir levemente `font-size` del `hero-title` en desktop medio.

Opcion de composicion:

- Mantener el grid actual.
- Ubicar `hero-copy-panel` con `position: relative`.
- Permitir que invada parte del campo visual.
- Mantener la lente desplazada a derecha como objeto focal.
