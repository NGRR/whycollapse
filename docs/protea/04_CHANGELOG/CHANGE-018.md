# CHANGE-018 — V4.2 · índices y perímetro monocromos

Fecha: 2026-11-16. Estado REVIEW. Base: `0eb5d05e75d0e4652086ef3c86a78bdc5603c093`.

## Alcance
Todos los índices numerados de interfaz se fijan en negro #111; rail, nodos, estados, marcadores del primer quinto, navegación móvil y pie de página en blanco/negro con grises de jerarquía. La guía SVG lateral pierde solo sus acentos azul/naranja; mantiene exactamente la geometría. Se interpreta el perímetro como interfaz y estructura exterior del cuerpo narrativo, no como modificación del hero protegido. Los acentos cromáticos interiores, terminales de las cotas editoriales, letras de etapas, CTA, fotografías, reseñas y mapa EAI conservan su tratamiento. Figura Protea Viva intacta.

## Diff
- `v42-scientific.css`: índices y contadores negros; selectores explícitos para estados y objetos del perímetro; referencia SVG versionada.
- `scientific-guide-v42.svg`: sustituir exclusivamente valores de color azul y naranja por negro, sin alterar posiciones ni formas; conservar grises auxiliares.
- `index.html`: versión de caché CSS; `README.md`: registro de revisión.

## Validación
Verificación estática de cambios restringidos a cuatro archivos V4.2 y registro. Las reglas CSS de #protea-viva-canvas, la posición de la guía y el motor JS no cambian. Sin prueba real en navegador; pendiente comprobación visual en escritorio y móvil, y despliegue Pages. No es aprobación.
