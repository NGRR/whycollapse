# CHANGE-008 — Protea viva visible en móvil

Estado: APPLY autorizado por la observación de Nicolás del 2026-09-06. Resultado esperado: `PROTEA_v07_REVIEW`.

## Problema

La regla responsive de `CHANGE-005` ocultaba `.protea-viva-background` por debajo de 960 px. Por eso el canvas no podía verse en teléfonos ni tabletas, aunque el motor ya incluía parámetros específicos para móvil.

## Corrección

1. Mantener en escritorio el viewport completo recortado al primer tercio.
2. En pantallas menores de 960 px, mostrar el canvas a ancho y alto completos del viewport, sin reservar una columna ni aplicar recorte lateral.
3. Reutilizar `centerXMobile`, `centerYMobile`, dimensiones y densidad móvil ya existentes en el componente.
4. Mantener el plano detrás del contenido y sin capturar eventos táctiles.

## LOCKED

- Hero manual, canvas del hero y todos sus assets.
- Composición de escritorio y recorte del primer tercio.
- Contenido, navegación, formularios y carrusel del equipo.
- Configuración y texturas del componente Protea viva.

## Aceptación

- El canvas permanece visible durante el cuerpo en móvil y tablet.
- Ocupa el viewport completo como fondo, sin producir desplazamiento horizontal.
- El contenido conserva el contraste blanco sobre azul.
- El hero permanece fuera del diff.

