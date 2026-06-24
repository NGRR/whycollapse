# Protea Home UIkit Skeleton

Esqueleto web para Home inmersivo Protea basado en UIkit.

## Requisitos cubiertos

- UIkit por CDN.
- JS y CSS separados.
- Personalización mínima concentrada en `assets/css/protea.css`.
- Fuentes: Roboto y Montserrat por Google Fonts.
- Hero 100vh con `<canvas id="protea-canvas">` preparado para inyectar animación complementaria de lente/canvas.
- Segunda sección como slideshow UIkit, con objeto centrado y texto bajo/acompañando la card.
- Secciones responsivas con grid UIkit.
- Rail lateral de identificación de secciones preservado para uso futuro como navegación diagnóstica o cuestionario narrativo.
- Textos de ejemplo y comentarios planos para discutir diferencias de relato con el cliente.

## Estructura

```txt
index.html
assets/css/protea.css
assets/js/protea.js
assets/img/reference-home.png
pages/contacto.html
pages/insights.html
```

## Nota de implementación

El canvas actual es solo un placeholder liviano. El código definitivo de la lente magnética debe reemplazar o extender `assets/js/protea.js`, manteniendo el mismo contenedor `#protea-canvas`.
