# Home por secciones

Este prototipo esta separado para que la edicion no dependa de un unico bloque HTML enorme dentro de Squarespace.

## Estructura

- `home.html`: version completa ensamblada, util para previsualizar o pegar como inserto unico.
- `secciones/00-header.html`: navegacion y menu offcanvas.
- `secciones/01-lanzamiento.html` a `secciones/10-comunidad.html`: secciones principales de la home.
- `secciones/11-footer.html`: pie de pagina.
- `secciones/99-hero-canvas-script.html`: script del canvas del hero.
- `build-home.ps1`: recompone `home.html` desde los archivos de `secciones/`.

## Flujo recomendado

1. Editar la seccion puntual en `secciones/`.
2. Ejecutar desde esta carpeta:

```powershell
.\build-home.ps1
```

3. Usar `home.html` si necesitas el bloque completo, o copiar cada archivo de `secciones/` en su bloque de codigo de Squarespace.

## Nota para Squarespace

Si implementas por secciones, pega cada archivo `01-...` a `10-...` como bloque independiente en el orden numerado. El header, footer y script pueden ir en bloques separados o en las zonas globales que uses para codigo. El script `99-hero-canvas-script.html` debe cargarse despues de `01-lanzamiento.html`, porque busca el canvas `cellCanvas`.
