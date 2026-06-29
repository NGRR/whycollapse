# 03 · Hub estático

## Objetivo

Crear el Hub como maqueta estática editorial y comunitaria. No CMS. No backend. No filtros funcionales obligatorios.

## Crear

- `pages/hub.html`
- `pages/hub-articulo.html`
- `pages/hub-caso.html`
- `pages/hub-comunidad.html`
- `pages/hub-biblioteca.html`

## Tesis

El Hub es un espacio vivo de comunidad, memoria y aprendizaje adaptativo.

No es blog.
No es sección de noticias.
No es repositorio técnico.

## `pages/hub.html`

Debe contener:

1. Hero:
   - Título: `Hub Adaptativo`
   - Bajada: `Un espacio vivo para comunidades que aprenden, comparten avances y sostienen capacidad adaptativa.`

2. Bloque editorial:
   - Últimos avances.
   - Comunidades activas.
   - Radar de señales.
   - Biblioteca.
   - Casos.
   - Eventos.

3. Cards estáticas:
   Al menos 8 cards de muestra.

Tipos:
- Avance
- Caso
- Comunidad
- Recurso
- Evento
- Radar

Cada card:
- tipo;
- título;
- resumen;
- fecha placeholder;
- comunidad placeholder;
- link a página detalle.

## Páginas detalle

### `hub-articulo.html`

Plantilla editorial:
- título;
- bajada;
- metadatos;
- cuerpo;
- relacionados;
- CTA.

### `hub-caso.html`

Plantilla:
- contexto;
- tensión;
- aprendizaje;
- resultado observado;
- relacionados.

### `hub-comunidad.html`

Plantilla:
- nombre comunidad;
- propósito;
- avances;
- publicaciones;
- próximos hitos.

### `hub-biblioteca.html`

Plantilla:
- recursos;
- documentos;
- guías;
- matrices;
- referencias.

## No hacer

- No implementar CMS.
- No crear formulario real.
- No crear buscador funcional.
- No crear filtros JS obligatorios.
- No usar datos externos.

Los filtros pueden ser etiquetas visuales estáticas para mostrar intención.

## Criterios de aceptación

- Hub se entiende como comunidad viva.
- No parece blog genérico.
- Navega hacia plantillas detalle.
- Puede migrarse conceptualmente a Squarespace después.
- Mantiene sistema visual Protea.
