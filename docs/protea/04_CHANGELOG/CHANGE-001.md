# CHANGE-001 — consolidación editorial autorizada

Estado: APPLY autorizado por solicitud explícita del 2026-09-04. Resultado: REVIEW.

## Diagnóstico

El relato distribuye información entre conceptos y servicios, antepone el colapso a la identidad y conduce a un test. No distingue suficientemente la contratación de Marcelo. Causa: arquitectura anterior al informe. Afecta `protea_vivo/index.html`, `assets/js/protea-sections.js`, `pages/iao.html`, `pages/contacto.html`, `pages/debrief.html` y las referencias de navegación a secciones retiradas.

## Cambios

1. Copy del hero del informe, un CTA hacia `#becoming-adaptive`. Preservar canvas, composición, tipografías y animación; permitir ajuste local de saltos y tamaño del titular para encajar el nuevo texto. La revisión de navegador detectó líneas huérfanas con el largo del copy; se acota la excepción a `.protea-review .hero-title` sin cambiar familias, pesos ni reglas globales.
2. Cinco destinos: Protea, Qué hacemos, Adaptive Thinking, Quiénes somos, Conversemos. Preservar mecanismos UIkit, cabecera, botones y rail.
3. Cuerpo en tercios a partir de 960px: barra de navegación exterior; primer tercio interior vacío y reservado; contenido continuo en los dos tercios derechos. Rótulos dentro del contenido. Móvil apilado a los breakpoints existentes. Corrección explícita de Nicolás durante esta misma ejecución.
4. Nuestra mirada tipográfica, cuatro afirmaciones progresivas y sin CTA.
5. Recorrido continuo DIAGNOS/IAO → Training → Lab → Hub. IAO con mapa real y mayor peso.
6. Módulo Marcelo editorial y landing independiente, tres formatos preseleccionables, conferencia, perfil y contratación.
7. Equipo con retratos reales y perfiles breves; contacto Protea separado de Marcelo. Reemplazar test y debrief por contacto directo.
8. Manifiesto central, instrucciones de trabajo, baseline y estado verificable en el repositorio.

## Protegido

`assets/css/protea.css`, `assets/css/protea-live.css`, `assets/js/protea.js`, `components/hero/**`, imágenes existentes. No cambiar variables globales, breakpoints ni dependencias. CSS nuevo acotado a los bloques de esta orden. No modificar otros prototipos del repositorio.

## Referencias y aceptación

Baseline: commit indicado en `00_BASELINE`. Copy: `01_BRIEF/informe-cliente.txt`. Imágenes: Word adjunto y perfiles públicos oficiales documentados en `03_REFERENCIAS`.

Verificar hashes protegidos; sintaxis JavaScript; todos los destinos locales y assets usados; separación de formularios; ausencia de test activo; selección correcta de formatos; integridad del hero y comprobación de maquetación en 1440, 768 y 390px cuando el entorno permita navegador. No afirmar envío real sin canal comercial configurado.
