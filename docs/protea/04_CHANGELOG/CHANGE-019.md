# CHANGE-019 — V4.1 y V4.2 · retiro del esquema EAI

Fecha: 2026-11-16. Estado REVIEW. Base: `925076bea0a4ee878cf090d9a8a4a24b70b9842d`.

## Alcance
Retirar el esquema de Estilo de Adaptabilidad Individual (EAI) de las páginas principales de V4.1 y V4.2, por solicitud expresa. No se sustituye por otro esquema. Se conserva el contenido del IAO: cinco atributos, 21 variables, resultados, metodología y navegación.

## Diff
- En ambos `index.html`: eliminar la figura completa del EAI (incluido respaldo PNG, mapa SVG, botón y pie), los diálogos de ampliación y detalle y la carga de CSS/JS del componente.
- Actualizar los README de ambas versiones.
- Conservar los archivos fuente del componente y las imágenes como recursos no referenciados, de manera reversible; no depurar reglas CSS heredadas inactivas ni modificar otras versiones. El marco científico decorativo de V4.2 no es el esquema EAI y queda intacto, junto con Protea Viva y el hero.

## Validación
Verificación estática: una aparición de cada bloque retirado por versión, ausencia de identificadores y referencias EAI en ambos HTML y presencia del contenido IAO y canvas. No se realizan cambios en motores, estilos ni activos. Pendiente comprobación visual en navegador y despliegue Pages.
