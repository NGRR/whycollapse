# CHANGE-011 — Materia Viva · subpropuesta UIkit

Solicitud 2026-09-09. Estado REVIEW, no sustituye la consolidada.

Base: consolidada en commit 2328996ba1573ea4063f085628789bf8e8003a4f.
Destino: protea_vivo/materia-viva.html. Versión MATERIA_VIVA_v01_REVIEW.

Conservar todo el texto, formularios, perfiles, imágenes documentales, destinos y hero manual. Las páginas IAO y Adaptive Thinking siguen compartidas con la consolidada.
Aplicar exclusivamente a la propuesta patrones del UIkit local: spec-card con esquinas, dark-card, contrast-panel y living-card. No importar la hoja global del catálogo, sus ejemplos de datos ni sus controles de demostración.
Integrar reconocimiento.jpg en Nuestra mirada, capacidades.jpg en Entrenar y life-system.jpg en Sostener, como ilustraciones conceptuales, no evidencia diagnóstica.
Índice: nueva entrada bajo consolidada y sobre ajustes cliente, con nombre, versión, fecha y referencia de origen.
LOCKED: archivos de la consolidada, hero, fuentes, activos originales, otras versiones.
Validación: equivalencia de texto original, formularios y destinos; referencias locales; CSS aislado; diff sin cambios en archivos compartidos. No declarar QA visual si no se ejecutó.

## Resultado de validación

- Texto del cuerpo e identificadores: equivalentes a la consolidada.
- Formularios y fragmento HTML del hero: idénticos byte a byte.
- Referencias originales conservadas; archivos locales y anclas existentes comprobados.
- JavaScript local: comprobación de sintaxis sin errores.
- CSS nuevo limitado a `.materia-viva`; sin modificaciones en hojas o activos compartidos.
- Índice: única inserción entre consolidada y ajustes cliente.
- Pendiente: revisión visual en navegador y aprobación de dirección de arte.

## Diff conceptual

Nuevos `protea_vivo/materia-viva.html` y `protea_vivo/materia-viva.css`: copia editorial independiente, imágenes conceptuales, esquinas técnicas, paneles de contraste y tarjetas de equipo. Selectores principales: `.mv-art`, `.mv-spec-card`, `.journey-close`, `.team-person`, `.contact-anchor`, siempre bajo `.materia-viva`.
`index.html`: añade enlace, nombre, versión REVIEW y fecha. La consolidada, el hero manual, los destinos de contacto y los archivos originales permanecen sin cambios.
Riesgo: la composición y el desplazamiento del equipo móvil requieren revisión visual; los comportamientos y formularios se heredan sin nuevas integraciones.
