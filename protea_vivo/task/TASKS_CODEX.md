# TASKS_CODEX.md

# PROTEA VIVO

## Sprint 01 · Consolidación del sitio y desarrollo de contenidos

### Objetivo del Sprint

Este sprint tiene como objetivo consolidar la base técnica del proyecto y desarrollar las primeras capas de contenido del sitio web.

El Home se considera conceptualmente aprobado.

No se deben introducir cambios al storytelling principal, a la estructura narrativa ni a la experiencia del Hero sin autorización expresa.

La prioridad es completar el ecosistema del sitio respetando la arquitectura narrativa ya definida.

---

# Principios generales

Antes de comenzar cualquier desarrollo se deben respetar las siguientes reglas.

## Storytelling

No modificar.

No alterar.

No reinterpretar.

El Home constituye la experiencia inmersiva del sitio y ya posee una línea narrativa validada.

---

## Framework

Mantener UIkit como framework principal.

No introducir Bootstrap.

No introducir Tailwind.

No incorporar frameworks adicionales.

---

## CSS

Mantener una arquitectura limpia.

Evitar estilos inline.

Agrupar componentes reutilizables.

No duplicar reglas.

---

## JavaScript

Modular.

Sin dependencias innecesarias.

Preparado para futuras animaciones del sistema de lente.

---

## Responsive

Todo desarrollo debe ser Mobile First.

Debe comprobarse visualmente:

* Desktop
* Notebook
* Tablet
* Mobile

---

## Entregables

Cada TASK debe finalizar con:

* Código limpio
* README actualizado
* Comentarios técnicos mínimos
* Lista de archivos modificados
* Lista de archivos creados
* Checklist de aceptación completado

No avanzar automáticamente al siguiente TASK.

Esperar revisión.

---

# TASK-001

## Consolidación técnica del proyecto

### Objetivo

Preparar una base estable para continuar el desarrollo.

### Alcance

Revisar completamente la estructura actual.

Corregir inconsistencias.

Eliminar deuda técnica menor.

No modificar comportamiento visual.

---

## Actividades

Revisar codificación UTF-8.

Corregir caracteres corruptos.

Revisar enlaces.

Revisar navegación.

Revisar componentes UIkit.

Verificar consistencia de tipografías.

Optimizar estructura de carpetas.

Actualizar README.

---

## Restricciones

No modificar:

* Hero
* Canvas
* Storytelling
* Navegación conceptual

---

## Entregables

README actualizado.

Listado de mejoras.

Listado de observaciones.

Checklist técnico.

---

# TASK-002

## Desarrollo de las secciones 02, 03 y 04 del Home

### Objetivo

Completar las secciones narrativas actualmente incompletas.

No rediseñar el Home.

Continuar la línea ya establecida.

---

# Sección 02

## El colapso silencioso

Mantener slideshow.

Transformarlo en una experiencia inmersiva.

Agregar fondo vivo mediante JS + CSS.

No utilizar videos.

No utilizar librerías externas.

El fondo debe permanecer ligero y preparado para futuras ilustraciones.

---

### Slides propuestos

01

Las señales siempre estuvieron ahí.

---

02

Lo que no vemos se acumula.

---

03

La pérdida de sensibilidad.

---

04

El colapso silencioso.

---

05

La pregunta.

¿Y si el problema fuera la forma de percibir?

---

Cada slide debe permitir posteriormente incorporar ilustraciones sin modificar la estructura.

---

# Sección 03

## Capacidad Adaptativa

Desarrollar un sistema visual basado en capacidades.

No utilizar tarjetas corporativas tradicionales.

Construir un recorrido visual coherente con el resto del sitio.

Preparar placeholders para iconografía definitiva.

---

# Sección 04

## Inteligencia Adaptativa

Desarrollar la explicación visual de la Triarquía.

Preparar espacio para diagramas SVG.

No convertir esta sección en una página de producto.

Debe funcionar como puente hacia el resto del sitio.

---

## Restricciones

No modificar Hero.

No modificar Footer.

No alterar navegación.

---

# TASK-003

## Desarrollo de páginas de contenido

### Objetivo

Construir la arquitectura completa del sitio.

No utilizar la narrativa inmersiva del Home.

Cada página debe adoptar un formato editorial y de consulta.

---

## Crear

/pages/iao.html

/pages/diagnos.html

/pages/training.html

/pages/lab.html

/pages/hub.html

/pages/inteligencia-adaptativa.html

/pages/triarquia.html

/pages/metodologia.html

/pages/observatorio.html

/pages/contacto.html

---

## Arquitectura común

Hero simple.

Introducción.

Contenido.

CTA.

Footer.

---

## Todos los layouts deben compartir

Header.

Footer.

Sistema de navegación.

Grid.

Espaciados.

Tipografía.

Componentes.

---

# TASK-004

## Desarrollo del Hub

### Objetivo

Construir el espacio vivo del proyecto.

No diseñarlo como un blog tradicional.

Debe entenderse como una comunidad de conocimiento.

---

## Arquitectura propuesta

Landing Hub

↓

Feed editorial

↓

Artículo

↓

Caso

↓

Comunidad

↓

Radar

↓

Biblioteca

↓

Eventos

---

## Contenidos

Publicaciones.

Investigaciones.

Avances.

Experiencias.

Comunidades.

Aprendizajes.

Laboratorios.

Eventos.

Recursos.

---

Preparar arquitectura para integración posterior con CMS.

No implementar backend.

---

# TASK-005

## Productos

Cada producto debe tener una página propia.

No utilizar lenguaje comercial tradicional.

Todos deben responder una misma estructura.

---

## IAO

Qué es.

Qué revela.

Qué obtiene la organización.

Proceso.

CTA.

---

## DIAGNOS

Propósito.

Proceso.

Resultados.

CTA.

---

## TRAINING

Capacidades.

Experiencias.

Programas.

CTA.

---

## LAB

Experimentación.

Casos.

Procesos.

CTA.

---

## HUB

Conocimiento.

Comunidades.

Aprendizaje.

CTA.

---

# Criterios generales de aceptación

Cada entrega debe cumplir simultáneamente:

* UIkit puro.
* HTML semántico.
* CSS modular.
* JavaScript desacoplado.
* Mobile First.
* Accesibilidad básica.
* Componentes reutilizables.
* Sin dependencias innecesarias.
* Sin contenido definitivo incrustado.
* Preparado para sustitución de ilustraciones finales.

---

# Forma de trabajo

No asumir decisiones de diseño.

No reinterpretar la narrativa.

No introducir nuevas metáforas.

Cuando exista una duda conceptual, detener el desarrollo y documentar la observación en el README de la tarea correspondiente.

La prioridad es construir una base técnica sólida que permita incorporar posteriormente el sistema visual definitivo y las ilustraciones finales sin necesidad de rehacer la arquitectura.

---

# Bitacora de avance local

## 2026-06-28 - Registro de proceso

### Carpeta activa

`task_01_20260628_2333UTC`

### Directrices reconocidas

* Trabajar una tarea por vez.
* No modificar Hero, canvas ni storytelling sin autorizacion expresa.
* Mantener UIkit como framework principal.
* No incorporar Bootstrap, Tailwind ni frameworks adicionales.
* Documentar archivos modificados, decisiones, riesgos y checklist de aceptacion.
* Actualizar este archivo al cierre de cada avance con briefing de forma y fondo.
* Considerar `protea_vivo/task/` como parte del repositorio para coordinacion entre operadores.

### Archivos de tarea detectados

* `task/task_01_20260628_2333UTC/task/TASKS_CODEX.md`
* `task/task_01_20260628_2333UTC/sprint-01/01_HOME_SECCIONES_02_04.md`
* `task/task_01_20260628_2333UTC/sprint-01/02_HOME_REFINAMIENTO.md`
* `task/task_01_20260628_2333UTC/sprint-01/03_PRODUCTOS_BASE.md`
* `task/task_01_20260628_2333UTC/sprint-01/04_HUB_BASE.md`
* `task/task_01_20260628_2333UTC/sprint-01/05_CONTENIDOS_BASE.md`
* `task/task_01_20260628_2333UTC/sprint-01/06_RELEASE.md`

### Estado

Directrices leidas y reconocidas. Sin ejecucion de tareas de desarrollo en este paso.

---

## 2026-06-28 - Avance TASK-002 / 01_HOME_SECCIONES_02_04

### Briefing de fondo

Se inicia el desarrollo de las secciones 02, 03 y 04 del Home manteniendo intacto el Hero, el canvas principal, el footer y la navegacion conceptual. El objetivo fue fortalecer el relato existente sin redisenar la experiencia aprobada.

### Briefing de forma

* Seccion 02 mantiene slideshow UIkit y suma fondo vivo ligero mediante CSS + JS desacoplado.
* Seccion 03 incorpora un sistema visual de capacidades con placeholders para iconografia futura.
* Seccion 04 incorpora un stage de Triarquia con nodos y nucleo conceptual preparado para diagrama final.

### Archivos modificados

* `index.html`
* `assets/css/protea-live.css`
* `README.md`
* `task/TASKS_CODEX.md`

### Archivos creados

* `assets/js/protea-sections.js`

### Decisiones tecnicas

* No se agregan dependencias externas.
* No se usa video.
* El fondo vivo de seccion 02 queda separado del motor `protea.js`.
* Los placeholders visuales son estructurales y reemplazables.

### Riesgos y observaciones

* Requiere revision visual posterior para ajustar densidad del fondo vivo.
* La iconografia definitiva de capacidades queda pendiente.
* El stage de Triarquia queda listo para una ilustracion final futura.

### Checklist de aceptacion

* [x] Hero no modificado.
* [x] Canvas principal no modificado.
* [x] Footer no modificado.
* [x] Navegacion conceptual no modificada.
* [x] UIkit preservado.
* [x] Sin Bootstrap.
* [x] Sin Tailwind.
* [x] Sin dependencias nuevas.
* [x] README actualizado.
* [x] Bitacora de task actualizada.

---

## 2026-06-29 - Avance TASK 02 / Produccion estatica Protea Vivo

### Carpeta activa

`task_02_20260629_0000UTC`

### Briefing de fondo

Se ejecuta una maqueta estatica ampliada del ecosistema Protea Vivo. El Home conserva su Hero y su canvas principal, pero cierra la narrativa posterior con CTAs, enlaces semanticos y paginas internas que permiten revisar el sitio como sistema completo.

### Briefing de forma

* Home sin comentarios visibles para cliente.
* Seccion 02 ajustada con copy final de colapso silencioso.
* Secciones 03 y 04 conectadas a paginas conceptuales.
* Cards de Protea convertidas en enlaces hacia dispositivos.
* Paginas internas editoriales con UIkit, `protea.css` y `protea-live.css`.
* Hub estatico construido como comunidad de conocimiento, no como blog.
* Navegacion relativa preparada para GitHub Pages.

### Archivos modificados

* `index.html`
* `assets/css/protea-live.css`
* `assets/js/protea-sections.js`
* `pages/contacto.html`
* `pages/insights.html`
* `README.md`
* `task/TASKS_CODEX.md`

### Archivos creados

* `pages/iao.html`
* `pages/diagnos.html`
* `pages/training.html`
* `pages/lab.html`
* `pages/inteligencia-adaptativa.html`
* `pages/metodologia.html`
* `pages/observatorio.html`
* `pages/hub.html`
* `pages/hub-articulo.html`
* `pages/hub-caso.html`
* `pages/hub-comunidad.html`
* `pages/hub-biblioteca.html`
* `task/task_02_20260629_0000UTC/`

### Que NO se implemento

* CMS.
* Backend.
* Filtros dinamicos.
* Build system.
* Dependencias adicionales.
* Cambios al Hero o `#protea-canvas`.

### Riesgos y observaciones

* Las paginas internas son estaticas y usan contenido inicial; requieren curatoria final.
* El Hub queda como maqueta editorial/comunitaria para migracion futura.
* Pendiente revision visual en dispositivos reales, especialmente mobile 390 y navegadores con barras visibles.

### Checklist de aceptacion

* [x] UIkit preservado.
* [x] Sin Bootstrap.
* [x] Sin Tailwind.
* [x] Sin CMS.
* [x] Sin backend.
* [x] Sin build system.
* [x] Hero no modificado.
* [x] Canvas principal no modificado.
* [x] Home conectado a paginas internas.
* [x] Hub estatico creado.
* [x] README actualizado.
* [x] Bitacora de task actualizada.

### Ajuste posterior - navegacion persistente

Se unifica el nav superior de todas las paginas internas para que no cambie segun el contexto de pagina. El patron estable es:

`Inicio / Enfoque / Inteligencia Adaptativa / Sistema Protea / Hub / Insights / Contacto`

El boton derecho queda como CTA global `Conversemos ->`. Las acciones particulares de cada pagina se mantienen dentro de los bloques de contenido.

### Ajuste posterior - seccion 03 como diagrama de proceso

Se interviene la seccion `#capacidad` del Home para acercarla al mockup de referencia:

* Fondo papel tecnico.
* Cards tipo lamina con placeholder visual en blanco.
* Marcos con esquinas y microdetalles.
* Conectores punteados con nodos naranjas entre capacidades.
* Mobile mantiene carrusel horizontal y oculta conectores.

### Ajuste posterior - papel tecnico transversal

Se aplica el mismo lenguaje de papel tecnico y marcos de lamina a las secciones blancas con cards:

* `device-card` en seccion Protea del Home.
* `content-card` en paginas internas.
* `hub-card` en Hub.
* Fondo claro con grilla, marcas radiales y esquinas tecnicas.
* Cache bust actualizado a `protea-live.css?v=20260629-6`.

### Ajuste posterior - laminas expandibles en Capacidad Adaptativa

Se agrega interaccion a las cards de la seccion 03:

* Card activa expandida como lamina panoramica.
* Cards inactivas comprimidas como thumbnails verticales.
* Placeholder pequeno en modo thumbnail y panoramico en modo activo.
* Soporte por click y teclado.
* `aria-expanded` actualizado por JS.
* Mobile conserva carrusel sin compresion.
