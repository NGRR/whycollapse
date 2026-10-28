# PROTEA V4.1 · Primera pasada editorial (REVIEW)
Fecha: 2026-10-27
Referencia: `protea_vivo/v4/` en el commit previo a V4.1.
Motivo: feedback de Marcelo y Nicolás; reducir repetición, comunicar el trabajo con precisión, usar el sitio como biblioteca informativa y no como embudo comercial agresivo.

## Implementación
- Directorio completamente independiente `protea_vivo/v4.1/` con las mismas rutas de assets y componentes que V4.
- `index.html`: edición de hero copy, Protea, Quiénes somos, Qué hacemos, IAO, Conferencias, Actualidad, Experiencia y Conversemos. No sustituir nombres, marcas, testimonios ni métricas sin evidencia.
- `v41.css`: estilos de detalles accesibles, leyendas concisas, y referencias en carrusel CSS de desplazamiento horizontal.
- `comparar.html`: matriz visible de permanencias, reducciones y recursos pendientes.
- Página raíz: V4 y V4.1 bajo **una misma tarjeta** en proceso.
- Sin cambios de motor, JS, imágenes, paleta, fuentes, canvas o preloader.

## Conteos
- Texto visible aprox. V4: 2955 palabras; V4.1: 1696 palabras (−43 %; incluye etiquetas del formulario, navegación y pie).
- 7 áreas principales, 8 IDs de sección contando `colapso`, 6 perfiles, 4 etapas, 5 atributos IAO, 6 propuestas de conferencia.
- Los seis párrafos de tipo cita en el equipo, carentes de atribución externa verificable, se quitan de V4.1 sin borrar la fuente V4.
- Actualidad permanece como esquema editorial; no se simula una colección Squarespace ni un backend de formulario.

## Riesgos
- Visual QA pendiente con navegador real; validar carrusel CSS e interacciones con UIkit.
- Testimonios existentes en conferencias requieren confirmar selección 2,4,5,7 y autorizaciones.
- Foto «Cyborg» de Marcelo, imagen de evento, gráfico IAO, logos y brochure siguen pendientes.
- Formulario NO envía: requiere implementación en Squarespace Core y pruebas de recepción.
- V4.1 no debe marcarse APPROVED sin validación de dirección de arte.
