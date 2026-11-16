# CHANGE-016 — V4.2 · figura roja sobre blanco y cotas coaxiales

Fecha: 2026-11-16. Estado REVIEW. Base: `0bce8dee4bd3d595b1a20f493caabf47523452a4`.

## Cambios
- Mover la figura 100 px a la derecha del centro efectivo de CHANGE-015; el clamp normalizado de seguridad del motor permanece. El marco SVG usa la misma coordenada horizontal, expresada respecto al contenedor, y centro vertical 50%. El marco queda fijo; el dibujo conserva la oscilación original del puntero.
- Eliminar capa azul y transición; fondo blanco plano en escritorio y móvil.
- Pasar líneas, partículas y volúmenes procedurales a tonos rojos y composición source-over (no aditiva), aumentar alfa de filamentos, desactivar halo. Sin cambio en semilla, geometría ni progreso.
- Texturas de las etapas y final: extracción de píxeles de predominio rojo mediante alfa suave en canvas auxiliar, paleta roja, procesada una sola vez al cargar; preserva originales. Si falla la lectura, se mantiene la figura procedural sin esa textura para no reinstroducir fondos azules.
- Invalidar caché CSS/JS, conservar hero, EAI, CTA, reseñas, imágenes editoriales y resto de versiones.

## Validación
Compilación sintáctica JS; prueba de máscara con muestras sintéticas; control de diff y referencias. No se ha inspeccionado cada textura rasterizada ni probado el resultado visual en navegador; pendiente comprobar conservación de detalle de la textura final, coincidencia de marco y figura y ausencia de recorte en anchos estrechos de escritorio. Móvil mantiene figura oculta. No es aprobación.
