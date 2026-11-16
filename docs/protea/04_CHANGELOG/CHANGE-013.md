# CHANGE-013 — V4.2 · blanco plano, cotas y acento Protea

Fecha: 2026-11-16. Estado REVIEW. Base: `c5a72e8571e42530af26c11d73706d1797342058`.

## Alcance y corrección
Solicitud: retirar el gradiente visible del cuerpo, conservar blanco plano y texto negro, usar cotas como lenguaje gráfico y devolver cromía a imágenes y botones. La causa del gradiente fue la declaración inline con prioridad important en `v4.js` (V3_SETTINGS.sectionPanel.background), no una insuficiencia de opacidad del CSS. Se cambia su valor a blanco y se consolidan las superficies blancas en la hoja propia V4.2. Las secciones externas permanecen transparentes para que se vea la gráfica lateral sobre el fondo blanco fijo.

## Diff
- `v4.js`: un valor del panel de sección, sin cambiar motores ni lógica.
- `index.html`: actualiza únicamente las versiones de los recursos CSS/JS para evitar caché.
- `v42-scientific.css`: superficies blancas planas, remates de cota; restaura cromía intrínseca de imágenes (no colorea fotografías cuyo original sea gris), overlay naranja de retratos y CTA/botones en #FF5A00 (token original), texto oscuro para contraste; enlaces CTA en naranja oscuro. El esquema EAI mantiene sus trazos y selección; solo su botón de ampliación/cierre adopta el acento.
- `scientific-guide-v42.svg`: cotas con prolongaciones y marcas oblicuas, sin magnitudes ficticias. El canvas del cuerpo se oculta visualmente conforme al ajuste planteado, sin retirar su motor; hero y precarga conservan composición y motor, CTA del hero mantiene naranja.
- `README.md`: registro de revisión.

## Validación
QA estático: sustituciones acotadas, referencia local, sin dependencias, otros directorios intactos. Pendiente prueba visual en navegador y despliegue Pages; verificar especialmente estilos calculados en paneles, fotografías y estados de CTA, y contraste móvil. No se declara aprobación.
