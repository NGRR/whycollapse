# CHANGE-007 — equipo responsive y enlace consolidado único

Estado: APPLY autorizado por la observación de Nicolás del 2026-09-06. Resultado esperado: `PROTEA_v06_REVIEW`.

## Objetivo

1. Mantener el equipo como mosaico de tres columnas en escritorio.
2. Convertir el mismo listado, sin duplicar perfiles ni añadir dependencias, en un carrusel táctil horizontal en móvil.
3. Evitar que el índice central presente una versión anterior con el mismo destino que la consolidada.

## Cambios

- `#equipo .team-mosaic`: scroll horizontal nativo, ajuste por tarjeta y avance táctil en pantallas de hasta 639 px.
- Indicación breve de deslizamiento visible únicamente en móvil.
- Retiro del bloque duplicado «Modelo storytelling» del índice central; el botón azul queda como único acceso a `protea_vivo/`.
- Etiqueta del botón azul actualizada a `PROTEA_v06_REVIEW`.

## LOCKED

- Hero manual, canvas del hero y sus assets.
- Integración, configuración y assets de Protea viva.
- Retícula, rail, colores, tipografías y breakpoints existentes.
- Contenido y perfiles del equipo.
- Secciones y formularios restantes.

## Aceptación

- Escritorio: tres perfiles por fila, conservando el escalonamiento aprobado.
- Móvil: una tarjeta predominante y una fracción de la siguiente; gesto horizontal con `scroll-snap`.
- No aparece desbordamiento horizontal en la página fuera del carrusel.
- El índice central contiene un único enlace a la consolidada.

