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
