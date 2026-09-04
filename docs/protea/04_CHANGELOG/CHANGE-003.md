# CHANGE-003 — contacto Protea progresivo sin diagnóstico

Estado: APPLY autorizado expresamente por Nicolás el 2026-09-04. Resultado: `PROTEA_v03_REVIEW`.

## Objetivo

Reemplazar únicamente la presentación plana del formulario de `#contacto-final` por un recorrido progresivo que conserve la claridad del contacto directo sin reactivar el test, la orientación automática ni el debrief retirados en CHANGE-001.

## Cambios

1. Distribuir los mismos campos autorizados en cuatro momentos: situación, organización, contacto y revisión.
2. Mostrar progreso, controles Anterior/Continuar y un resumen literal de las respuestas antes de “Conversemos”.
3. Validar cada momento antes de avanzar. No puntuar, clasificar, interpretar ni recomendar un servicio.
4. Mantener todos los campos accesibles y utilizables cuando JavaScript no esté disponible.
5. Conservar el aviso de que el envío real aún no está habilitado y no simular confirmaciones.
6. Actualizar el rótulo del acceso destacado del índice central a `PROTEA_v03_REVIEW`; su destino continúa siendo `./protea_vivo/`.

## No modificar

- Hero, canvas, navegación, rail, retícula de tercios, tipografías, colores y breakpoints.
- Relato Becoming Adaptive, IAO, equipo y Adaptive Thinking.
- Formulario específico de Marcelo.
- Canal de envío, persistencia o integraciones externas.
- Archivos protegidos enumerados en CHANGE-001.

## Selectores y archivos

- `protea_vivo/index.html`: `#contacto-final [data-contact-form="protea"]`.
- `protea_vivo/assets/css/protea-consolidacion.css`: `.contact-progress`, `.contact-step`, `.contact-step-actions`, `.contact-review`.
- `protea_vivo/assets/js/protea-sections.js`: progresión, validación local y resumen literal del formulario Protea.
- `index.html`: texto de `a.featured`; el destino no cambia.

## Aceptación

- Los cuatro momentos funcionan en orden, permiten retroceder y conservan las respuestas.
- No aparecen resultados, rutas, puntuaciones, selección de señales ni recomendaciones.
- El resumen reproduce texto mediante `textContent`; no interpreta ni persiste datos.
- El intento final conserva el estado “no enviado”.
- El formulario de Marcelo y el DOM fuera del alcance permanecen sin cambios funcionales.
- Sintaxis JavaScript, referencias locales, build estático y diff de whitespace correctos.

## Validación ejecutada

- Sintaxis JavaScript y `git diff --check`: correctos.
- Estructura HTML: cuatro momentos, cinco campos autorizados, un H1 e IDs únicos.
- 103 referencias locales de Home, IAO y Adaptive Thinking: sin archivos ni anclas rotos.
- Salida estática: equivalente a la construcción fuente después del build.
- Archivos protegidos de la baseline y formulario de Marcelo: sin cambios.
- Inspección visual en navegador: pendiente de revisión de dirección de arte; no se infiere aprobación del commit.
