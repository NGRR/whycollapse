# CHANGE-012 — Protea V4.2 · monocromo científico claro

Fecha: 2026-11-16. Estado REVIEW. Base: `d127af75099b2120f18a1052c7985b6bb7cf88bb`. Alcance: `protea_vivo/v4.2/` exclusivamente.

## Orden y criterio de aplicación
Fondo blanco, texto negro y lenguaje de líneas inspirado por el EAI existente (`components/eai/eai.js`: map-guide, map-soft, map-dotted, map-point y map-edge). La geometría es decorativa, no representa mediciones ni relaciones nuevas. Conservar hero protegido (incluida la secuencia de carga), motores canvas, retícula, anclajes, EAI, textos, formularios, fotografías originales y otras versiones. La excepción cromática del hero se conserva de la revisión anterior; los logotipos de clientes mantienen colores originales. El resto de las ilustraciones/retratos usa filtro monocromo reversible.

## Diff conceptual
- `index.html`: una referencia CSS posterior a v42.css; sin alterar el DOM restante.
- `v42-scientific.css`: capa acotada a V4.2. Blanco en fondo, paneles, menú, pie, marcadores y formularios; negro en tipografía y controles; estados de foco/hover por contraste de trazo. Guías, cruces, nodos, cotas y esquinas técnicas en cabeceras y tarjetas. Canvas de cuerpo en tinta mediante filtro CSS, sin destruir su motor ni modificar posiciones.
- `assets/img/protea/scientific-guide-v42.svg`: geometría de guías sin valores ni rótulos ficticios, subordinada al canvas y retirada en móvil.
- `README.md`: registro de revisión.
  
## Validación y riesgos
Verificación estática: cambio de HTML limitado a una línea, CSS y SVG propios, referencias locales, sin dependencias ni cambios en scripts o activos existentes. El SVG EAI y sus selecciones conservan su CSS de fills/strokes. Pendiente revisión visual y funcional en navegador real, especialmente contraste sobre canvas, jerarquía de formularios, menú móvil, estados de foco y continuidad con hero cromático. No se declara aprobación ni QA visual.
