# CHANGE-017 — V4.2 · cotas de transición y jerarquía de secciones

Fecha: 2026-11-16. Estado REVIEW. Base: `254cb7f910a337ae2b493b112669dd3081be64bb`.

## Alcance
Diferenciar de manera visible las siete secciones principales del cuerpo de V4.2. Se conserva la nomenclatura y numeración existentes: 01 Protea, 02 Qué hacemos, 03 IAO, 04 Conferencias, 05 Actualidad, 06 Experiencia y 07 Contacto (según marcador existente).

## Diff
- `index.html`: se separa el número y nombre de los seis encabezados existentes en spans; el séptimo recibe el índice decorativo 07, oculto para lectores de pantalla por ser redundante. Se actualiza URL de caché CSS.
- `v42-scientific.css`: cotas horizontales con terminales angulares, índice de escala mayor, línea discontinua y contraste de naranja/azul alternado. Las reglas se restringen al contenido y a sus encabezados principales; no cubren el primer quinto ni duplican etiquetas mediante pseudo-elementos textuales. Se usan los siete IDs efectivos y no se interviene #observatorio.
- `README.md`: registro.

## Validación
Comprobación estática: siete etiquetas, IDs existentes, selectores limitados al cuerpo y cambios de HTML restringidos a las etiquetas y referencia CSS. No se modifica el motor, figura roja, SVG de fondo, retícula, hero, EAI, fotos, formularios ni reseñas. Pendiente comprobar contraste, espaciado y adaptación a anchos reducidos en navegador. No es aprobación.
