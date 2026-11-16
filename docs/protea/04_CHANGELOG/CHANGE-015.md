# CHANGE-015 — V4.2 · Protea Viva desplazada y fondo azul pleno

Fecha: 2026-11-16. Estado REVIEW. Base: `d9c6a4f0cf958465fb13a64f4516517e8d01fd03`.

## Alcance y decisiones
Solicitud: incrementar contraste, desplazar la figura aproximadamente 200 px a la izquierda y hacer aparecer un fondo azul detrás. El desplazamiento se calcula en las coordenadas del motor, no mediante una transformación CSS que alteraría las mediciones de resize. Se aplica hasta 200 px, limitado para que el centro quede al menos 56 px a la derecha del rail cuando exista espacio (sin desplazarlo hacia la derecha respecto al anclaje previo). Se conserva la reacción al puntero y el crecimiento según scroll.

El fondo es una superficie azul noche Protea #001133, sin gradiente, que aparece con el estado narrativo existente is-protea-viva-active, mediante transición de opacidad de 850 ms. Cubre la capa de fondo de escritorio; los paneles del contenido siguen blancos. Las cotas se reubican alrededor de la coordenada de la figura y reducen su opacidad sobre azul. El canvas recupera luminancia y aumenta contraste/saturación en ese estado. No se alteran la geometría interna, etapas ni assets del motor, el hero, el EAI, reseñas, CTA o versiones anteriores. Móvil conserva fondo blanco y ocultación de la figura. Se respeta preferencia de movimiento reducido en la transición.

## Archivos
- `assets/js/protea-viva-background.js`: anclaje y variable CSS del centro.
- `v42-scientific.css`: capas azul, cotas y canvas, transición y contraste.
- `index.html`: referencias CSS/JS con nueva versión de caché.
- `README.md`: registro.

## Validación
Sintaxis JavaScript comprobada mediante compilación; cambios de HTML limitados a las dos referencias. Pendiente revisión visual en navegador y verificación del despliegue: especialmente recorte lateral de la figura, legibilidad de cotas y relación con marcadores a 960, 1440 y 1920 px. No se declara aprobación.
