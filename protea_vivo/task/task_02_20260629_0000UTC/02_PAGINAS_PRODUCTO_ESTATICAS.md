# 02 · Páginas producto estáticas

## Objetivo

Crear páginas HTML estáticas para cada dispositivo Protea. No implementar CMS. No backend. No lógica dinámica.

## Crear

- `pages/iao.html`
- `pages/diagnos.html`
- `pages/training.html`
- `pages/lab.html`
- `pages/inteligencia-adaptativa.html`
- `pages/metodologia.html`
- `pages/observatorio.html`

`pages/hub.html` se desarrolla en la tarea 03.

## Base técnica

Cada página debe usar:

- UIkit CDN.
- Google Fonts ya usadas.
- `../assets/css/protea.css`
- `../assets/css/protea-live.css`
- Estructura HTML estática.
- Header simple con retorno al Home.
- Footer/CTA consistente.

## No hacer

- No crear CMS.
- No crear JSON de datos.
- No crear filtros dinámicos.
- No agregar dependencias.
- No usar plantillas server-side.
- No crear build system.

## Layout común

Cada página debe contener:

1. Header.
2. Hero editorial.
3. Bajada conceptual.
4. Bloque “Qué permite ver”.
5. Bloque “Cómo funciona”.
6. Bloque “Qué obtiene la organización”.
7. Bloque “Relacionado”.
8. CTA final.

## Contenido inicial

### IAO

Título:
`IAO · Índice de Adaptabilidad Organizacional`

Bajada:
`Un instrumento de observación para hacer visible la capacidad adaptativa de una organización.`

Qué permite ver:
- señales de rigidez;
- brechas de aprendizaje;
- tensiones de adaptación;
- capacidad de anticipación;
- riesgo de pérdida de vigencia.

CTA:
`Solicitar lectura IAO`

Relacionados:
DIAGNOS, Inteligencia Adaptativa, Metodología.

### DIAGNOS

Título:
`DIAGNOS · Lectura adaptativa del sistema`

Bajada:
`Un dispositivo para revelar patrones, tensiones y prioridades cuando la organización necesita comprender qué está ocurriendo.`

Qué permite ver:
- fricciones invisibles;
- causas no evidentes;
- relaciones entre síntomas;
- prioridades de acción;
- mapa de tensión adaptativa.

CTA:
`Iniciar lectura DIAGNOS`

Relacionados:
IAO, Metodología, Lab.

### Training

Título:
`Training · Desarrollo de capacidades adaptativas`

Bajada:
`Experiencias diseñadas para entrenar percepción, comprensión, aprendizaje y respuesta.`

Evitar la palabra “capacitación” como eje principal.

CTA:
`Diseñar experiencia Training`

Relacionados:
Lab, Hub, Inteligencia Adaptativa.

### Lab

Título:
`Lab · Experimentación sobre desafíos reales`

Bajada:
`Un espacio para transformar problemas complejos en hipótesis, prototipos y aprendizaje situado.`

CTA:
`Activar un Lab`

Relacionados:
Training, Hub, DIAGNOS.

### Inteligencia Adaptativa

Título:
`Inteligencia Adaptativa`

Bajada:
`La capacidad de percibir, comprender, anticipar, responder y aprender en contextos complejos.`

Debe funcionar como página conceptual central, no como producto.

CTA:
`Evaluar capacidad adaptativa`

Relacionados:
IAO, Metodología, Observatorio.

### Metodología

Título:
`Sistema Protea`

Bajada:
`Una anatomía de funciones para observar, revelar, orientar, desarrollar, experimentar y sostener aprendizaje adaptativo.`

CTA:
`Conocer ruta Protea`

Relacionados:
IAO, DIAGNOS, Training, Lab, Hub.

### Observatorio

Título:
`Observatorio Adaptativo`

Bajada:
`Un espacio de lectura de señales, patrones y preguntas sobre organizaciones vivas.`

Debe ser estático por ahora.

CTA:
`Explorar señales`

Relacionados:
Hub, Insights, Inteligencia Adaptativa.

## Criterios de aceptación

- Todas las páginas existen.
- Todas cargan CSS correcto.
- Todas enlazan de vuelta al Home.
- Todas tienen bloque relacionado.
- No hay CMS ni preparación backend.
- El lenguaje no parece consultoría genérica.
