# Organic Scroll Background — v13 Configurado

Corrección del sistema de máscaras suaves introducido en v12.

## Problema corregido

La versión anterior aplicaba `destination-in` repetidamente sobre cada forma de la máscara. En Canvas 2D, cada aplicación vuelve a intersectar el contenido existente. Como las formas orgánicas estaban separadas, la intersección resultante era mínima y las imágenes prácticamente desaparecían.

## Solución

- Se separó la imagen y la máscara en dos canvases auxiliares.
- Todas las formas orgánicas se suman primero en una única máscara.
- La máscara completa se aplica una sola vez sobre la imagen.
- Los bordes suaves se conservan mediante tres niveles de expansión y blur.
- La opacidad final se limita correctamente al rango `0–1`.

## Resultado esperado

- Frames intermedios nuevamente visibles.
- Imagen final visible según el preset configurado.
- Recortes suaves y orgánicos, sin convertir las capas en paneles rectangulares.
- Persistencia del suavizado entre 93 y 100.

## Uso

```bash
cd organic-scroll-bg-v13-configured
python -m http.server 8080
```

Abrir:

- `http://localhost:8080/index.html`
- `http://localhost:8080/editor.html`
