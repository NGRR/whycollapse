# CHANGE-005 — Protea viva en el tercio reservado

Estado: APPLY autorizado expresamente por Nicolás el 2026-09-06. Resultado esperado: `PROTEA_v04_REVIEW`.

Referencia LOCKED del hero manual: estado acumulado de GitHub `fa24f7c6d6eea48c725eda0edc7111ff2460c4d8`, incluidos los commits `fac9188` y `54429cc`. `CHANGE-005` se aplica encima de esa referencia y no sustituye ninguno de sus assets.

## Objetivo

Activar el primer tercio reservado del cuerpo de la Home como plano visual de fondo, usando el componente animado `Protea Vive v16`. El organismo debe evolucionar por etapas conforme avanza el scroll del cuerpo. El fondo del cuerpo pasa a azul Protea y el contenido se adapta a ese contraste.

## Alcance

1. Aplicar la animación sólo desde `#colapso` hasta el cierre del cuerpo; el hero queda fuera.
2. Confinar el canvas al primer tercio de `.protea-main`, a la derecha del rail lateral. El contenido conserva los dos tercios existentes.
3. Vincular el progreso 0–100 % al recorrido del cuerpo, no al documento completo.
4. Reutilizar la configuración y los activos válidos de `prototipos/protea_vive_v16/`; no incorporar el editor ni el activo vacío `stage-09-mature.webp`.
5. Cambiar las secciones del cuerpo a azul Protea y ajustar localmente textos, líneas, formularios y estados al contraste oscuro.
6. En viewport menor a 960 px, mantener la retícula apilada ya aprobada y ocultar el canvas del tercio inexistente; el fondo azul y el contraste permanecen.

## LOCKED

- Hero completo: HTML, canvas, assets, filtros, carga, lente, movimiento, copy y composición.
- Rail lateral y sus dimensiones.
- Retícula de tres tercios y posición del contenido.
- Contenido editorial, navegación, equipo, imágenes, formularios y lógica de contacto.
- Tipografías, componentes, botones y breakpoints existentes salvo variantes cromáticas locales necesarias para el fondo azul.

## Archivos previstos

- `protea_vivo/index.html`: inserción del canvas decorativo y carga de configuración/script al final.
- `protea_vivo/assets/css/protea-consolidacion.css`: plano fijo, fondo y contraste local.
- `protea_vivo/assets/js/protea-viva-config.js`: configuración del componente para el tercio.
- `protea_vivo/assets/js/protea-viva-background.js`: adaptación del componente al contenedor y al progreso del cuerpo.
- `protea_vivo/assets/img/protea-viva/`: cuatro texturas válidas del componente.
- `index.html`: rótulo de versión del acceso superior.

## Aceptación

- El hero permanece byte-equivalente al estado manual de GitHub `fa24f7c6` en todos sus archivos y fragmentos.
- El canvas no invade los dos tercios de contenido en escritorio.
- La secuencia comienza al entrar al cuerpo y madura al llegar a su final.
- No existe solicitud del activo vacío ni error de recurso asociado.
- En móvil no se reserva espacio vacío y el contenido conserva legibilidad.
- Un solo H1, IDs únicos, referencias locales válidas, JavaScript correcto y build estático equivalente.

## Validación ejecutada

- Fragmento HTML del hero antes/después: SHA-256 idéntico `58ef28b7f87cbe2dce2aa4bf22466de1665979591ecb18d7a2c2f3bb3ca7a77c`.
- `assets/js/protea.js`, `assets/css/protea-live.css` y `components/hero/**` proceden intactos del estado manual `fa24f7c6`; no forman parte del diff de `CHANGE-005`.
- Cuatro texturas válidas y no vacías; 1.582.538 bytes en conjunto. No se referencia `stage-09-mature.webp`.
- Sintaxis de los cuatro scripts de Home correcta.
- Home, IAO y Adaptive Thinking: un H1 por página, IDs únicos y referencias locales válidas.
- Build estático equivalente a la fuente y `git diff --check` correcto.
- Revisión visual en navegador: pendiente de dirección de arte.
