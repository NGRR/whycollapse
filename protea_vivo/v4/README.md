# PROTEA_V4_REVIEW · 18-10-2026

## Objetivo
Revisión V4 autónoma de la V3 publicada, basada en *WEB Protea Pantallazos.docx* (22 páginas). La V3 original conserva toda su implementación y solo recibe un acceso a V4. El índice principal recibe un enlace visible por encima de la tarjeta V3.

## Construcción y archivos
- Publicación: `/protea_vivo/v4/`; no reemplaza `/protea_vivo/v3/`.
- `index.html`: siete secciones, bloque Protea con historia/equipo, IAO, conferencias, actualidad, experiencia, contacto y footer.
- `v4.css`: copia de V3 CSS más modificaciones editoriales y responsive.
- `v4-ui.css`: copia de V3 UI CSS más rail anclado en top 0 y menú móvil.
- `v4.js`: copia del V3 JS con nuevos siete estados narrativos y cuatro subetapas.
- `v4-loader.js`: copia exacta del loader de V3.
- `assets/` y `components/`: instantáneas independientes del árbol original de recursos y motores, copiadas como árboles Git (blobs compartidos por contenido, rutas separadas). Una modificación posterior de los archivos de V3 no actualiza V4.
- Dependencias externas existentes: UIkit y fuentes CDN; imagen neuronal TRAINING alojada en Google Drive.

## Alcance editorial aplicado
01 PROTEA — Hero original + Nuestra mirada/historia + equipo actualizado a Marcelo Lasagna, Constanza Collarte, Jimena Espinoza, Madis Ilstav, Adriana Arciniega y Estefanía Merino usando fotografías locales existentes.
02 QUÉ HACEMOS — Becoming Adaptive con DIAGNOS, TRAINING, LAB, HUB y submenú Comprender / Entrenar / Experimentar / Sostener.
03 IAO — descripción, cinco atributos, 21 variables (sin inventar listado), beneficios y cinco pasos de aplicación.
04 CONFERENCIAS — Adaptive Thinking, conferencia insignia, seis propuestas adicionales, formatos, perfil de Marcelo y referencias proporcionadas en documento.
05 ACTUALIDAD — estructura editorial por categorías; no se inventaron artículos.
06 EXPERIENCIA — textos Protea / Lead To Change Chile y espacio reservado para mosaico con autorizaciones.
07 CONVERSEMOS — formulario progresivo conservado, mailto de referencia y footer ampliado.
Navegación desktop: solo rail izquierdo en viewport desde `top:0`. Navegación móvil: solo cabecera reducida con marca y hamburguesa, abre offcanvas UIkit de siete elementos.

## Pendientes deliberados
- El formulario NO envía información; no se incorporó backend, endpoint o mensaje falso de confirmación. Requiere mecanismo real de recepción, consentimiento y ensayo de entrega.
- Mosaico de organizaciones: pendientes listado, logos y derechos de uso facilitados por Aina.
- Actualidad: pendientes publicaciones reales, imágenes, fechas, rutas y sistema de actualización.
- TRAINING: descripciones definitivas de GYMNOS, Complexus e Innovation.
- IAO en acción: casos anonimizados y material publicable.
- Conferencias: verificar autorización de referencias, testimonios y vigencia de cargos/duraciones.
- Footer: URLs efectivas de aviso legal y cookies.
- Verificación final: navegador real en 390, 768, 1024 y 1440 px, orientación móvil, contraste, scroll, animaciones, enlaces y validación de formulario. La comprobación estructural de código no sustituye la aprobación visual.

## Conservación y límites
No modificar `protea_vivo/v3/` salvo el enlace V4. Hero, motor de Protea Viva, tipografías, colores y componentes de la baseline solo se copian. La V4 queda en estado REVIEW; no equivale a aprobación de dirección de arte.
