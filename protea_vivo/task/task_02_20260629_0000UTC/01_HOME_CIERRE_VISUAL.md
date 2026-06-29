# 01 · Cierre visual del Home

## Objetivo

Refinar el Home existente. No reconstruirlo.

La sección 02, 03 y 04 ya fueron intervenidas. Ahora deben quedar más limpias, navegables y preparadas para recibir arte final.

## Archivos esperados

- `index.html`
- `assets/css/protea-live.css`
- `assets/js/protea-sections.js`
- `README.md`

## No hacer

- No modificar el Hero.
- No modificar `#protea-canvas`.
- No alterar el storytelling.
- No introducir CMS.
- No crear páginas nuevas en esta tarea.
- No cambiar UIkit.

## Acciones concretas

### 1. Eliminar comentarios visibles para cliente

Eliminar del Home todos los textos visibles tipo:

```txt
Comentario para cliente:
```

Reemplazar por microcopy real o quitar el `<small>` si no aporta a la experiencia.

### 2. Sección 02 · Colapso silencioso

Mantener los 5 slides actuales, pero mejorar su intención visual y textual:

1. **Las señales siempre estuvieron ahí.**
   - Texto: “El entorno cambia antes de que la organización logre nombrarlo.”

2. **Lo que no vemos se acumula.**
   - Texto: “La fricción aparece mucho antes que la crisis.”

3. **La pérdida de sensibilidad.**
   - Texto: “Antes de perder adaptación, una organización pierde percepción.”

4. **El colapso silencioso.**
   - Texto: “La ruptura aparece tarde. La desconexión se instala mucho antes.”

5. **La pregunta.**
   - Texto: “¿Y si el problema no fuera la estrategia, sino la forma de mirar?”

### 3. Fondo vivo sección 02

Revisar `collapse-field` y `assets/js/protea-sections.js`.

Debe sentirse vivo, pero no decorativo.

Criterios:

- Movimiento lento.
- Puntos naranjas.
- Líneas finas.
- Profundidad sutil.
- Sin neón.
- Sin sci-fi.
- Sin video.
- Sin librerías.
- Mobile liviano.

### 4. Sección 03 · Capacidad Adaptativa

Mantener:

```txt
Percibir → Comprender → Aprender → Responder → Evolucionar
```

Mejorar:

- jerarquía visual;
- lectura secuencial;
- transición entre capacidades;
- CTA hacia `pages/inteligencia-adaptativa.html`.

Agregar enlace visible al final de la sección:

```html
<a href="pages/inteligencia-adaptativa.html">Profundizar en Inteligencia Adaptativa</a>
```

### 5. Sección 04 · Inteligencia Adaptativa

Mantener Triarquía:

```txt
Complejidad → Adaptabilidad → Innovación
```

Mejorar:

- composición del `triarchy-stage`;
- legibilidad;
- relación con secciones anteriores;
- CTA hacia `pages/metodologia.html`.

### 6. Sección 05 · Protea

Convertir cada `device-card` en enlace a página interna:

- IAO → `pages/iao.html`
- DIAGNOS → `pages/diagnos.html`
- Training → `pages/training.html`
- Lab → `pages/lab.html`
- Hub → `pages/hub.html`

Usar `<a>` semántico envolviendo contenido o link interno claro. No usar sólo JS.

## Criterios de aceptación

- No quedan comentarios para cliente visibles.
- Slideshow se entiende sin explicación externa.
- Secciones 03 y 04 tienen CTA.
- Cards de Protea enlazan a páginas internas.
- Mobile mantiene lectura.
- README registra cambios.
