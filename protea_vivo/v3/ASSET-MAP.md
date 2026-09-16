# Protea V3 · Mapeo de activos y contrato estructural

Fecha de revisión: 2026-09-16

Fuente principal: carpeta Drive `1DEEt-dOb4iQLV43DFHLAic-08BTADegu`.

## Arquitectura de mantenimiento R13

La V3 quedó consolidada para reducir deuda de revisión. Dentro de `protea_vivo/v3/` sólo existen cinco archivos:

- `index.html`: estructura y contenido de la propuesta.
- `v3.css`: layout, composición editorial y estilos base de V3.
- `v3-ui.css`: rail, marcadores, optimizaciones de composición, responsive, CTA y preloader.
- `v3.js`: comportamiento, navegación, carrusel, contacto, controlador del preloader y reconstrucción del viewport móvil.
- `ASSET-MAP.md`: contrato estructural, activos y guía de auditoría.

Las antiguas capas incrementales `v3-r4.css` a `v3-r10.css` y `v3-r9.js` fueron absorbidas y eliminadas. No deben volver a introducirse archivos de revisión numerados para ajustes normales: las nuevas correcciones deben hacerse en el archivo semántico que corresponda.

### Control de tiempos del preloader

Existe una sola fuente de verdad, al inicio de `v3.js`:

```js
const PRELOADER_TIMING = Object.freeze({
  load: 2000,
  align: 850,
  settle: 60,
  fade: 360,
  segment: 100,
  failSafePadding: 1200
});
```

`load` controla la carga perimetral; `align`, el viaje de la lente al Hero; `settle`, el ajuste final; `fade`, la revelación; `segment`, el encendido de cada `|` o `/`. El timeout de seguridad se calcula automáticamente a partir de esos valores. `v3-ui.css` recibe los tiempos mediante variables CSS, por lo que no es necesario sincronizar números en varios archivos.

### Preloader actual

- Gráfica monocroma: anillos, scan y marcas de carga en blanco.
- Barra perimetral compuesta por 96 caracteres `|` y `/`, distribuidos de forma continua alrededor de la lente.
- Las marcas se ubican a aproximadamente 3 px fuera de la circunferencia exterior.
- El wordmark `protea` ahora vive dentro de `.v3-preloader__lens`, por lo que comparte exactamente el centro geométrico de la circunferencia y no depende del centro del overlay.
- El viaje al Hero dura 850 ms y usa exclusivamente `transform: translate3d(...)` para evitar recalcular `left`, `top`, `width` y `height` en cada fotograma.
- Durante el desplazamiento se pausan las rotaciones internas de los anillos y del scan para reducir trabajo de composición y estabilizar los fotogramas.

### Reconstrucción responsive en móviles

La solución R13 no depende sólo de media queries. `v3.js` mide `window.visualViewport` y reconstruye las variables y layout móviles cuando cambia el viewport:

- recalcula `--mobile-nav-h`, `--mobile-story-h` y `--mobile-critical-h` usando el viewport visible real;
- en portrait desplaza el bloque de copy del Hero hacia arriba proporcionalmente al alto disponible, reduciendo aproximadamente a la mitad el vacío inicial observado en iPhone;
- en landscape transforma el Hero a una retícula horizontal de dos columnas, reduce tipografía y navegación superior, y amplía el rail inferior al ancho útil disponible;
- el rail móvil deja de conservar el máximo de 370 px en landscape y pasa a ocupar el ancho entre los safe areas laterales;
- escucha `resize`, `orientationchange` y `visualViewport.resize`;
- tras una rotación espera a que Safari estabilice el viewport y emite un `resize` final para que los motores compartidos de `#protea-canvas` y `#protea-viva-canvas` recalculen sus dimensiones con el tamaño definitivo.

Esta reconstrucción evita que el sitio conserve medidas de portrait al pasar a landscape —o viceversa— sin recargar la página. No se modifica el motor compartido del Hero ni Protea Viva.

## Contrato estructural de V3

La V3 no sustituye la arquitectura de la consolidada. Se preservan como elementos protegidos:

1. `protea-shell` y el rail narrativo externo `section-rail`.
2. Hero `#observatorio`, su retícula 2/5 + 3/5 y el canvas `#protea-canvas`.
3. El cuerpo posterior al Hero organizado como retícula de cuatro columnas: primer cuarto reservado como campo visual; contenido en columnas 2–4.
4. `#protea-viva-canvas` como plano fijo del cuerpo. Su contenedor ocupa todo el viewport visible, mide `100dvh + 10px`, conserva 5 px de sangrado arriba y abajo, añade 125 px hacia la izquierda y no usa `clip-path`.
5. El motor de Protea Viva sigue ligado al progreso entre `#colapso` y `.consolidation-footer`.
6. El contacto final reutiliza el flujo progresivo de la consolidada y deja explícita la ausencia de integración de envío real.

La expansión de dirección de arte ocurre dentro de ese contrato: composición editorial, tratamiento de imágenes, capas gráficas, sistema de cards, tipografía, color, ritmos y recursos conceptuales.

## Dirección de uso de activos

| Área V3 | Recurso Drive | Función visual | Implementación |
| --- | --- | --- | --- |
| Entrenar / Training | `03_sistema_neuronal_color_transparente.png` (`1knbNEZiGLpRHyou2H0HzXJ1UQox3OdYL`) | conexión, transmisión, aprendizaje | capa conceptual transparente dentro del contenido |
| Arraigar / Lab | `04_flor_raiz_color_transparente.png` (`1b2b2hSAcEdAf6tbv8ytp-qsFI5ZwArxE`) | crecimiento con soporte, experimentación que arraiga | capa conceptual transparente dentro del recorrido |
| Sostener / Hub | `05_red_cognitiva_color_transparente.png` (`1WDXSr83Tawm714Ei4OhpQXTqyPfHC82v`) | red, circulación, inteligencia distribuida | capa conceptual transparente dentro del recorrido |
| Equipo / referencia | `imagen_2026-09-11_2.png` (`1PBvTdSMzXc5hCvhDzd0B6fvCQKiBJzQS`) | composición horizontal maestra de cinco personas | referencia compositiva |
| Equipo / card 01 | `imagen_2026-09-11_7.png` (`1jTwzd4pM6fMrtyTbUK1TQJJD2JRBvX70`) | Constanza Collarte | card responsive + nombre inferior |
| Equipo / card 02 | `imagen_2026-09-11_6.png` (`1xC2abeBj47Caa0N89rb4vqR7mMymD_-f`) | Madis Ilstav | card responsive + nombre inferior |
| Equipo / card 03 | `imagen_2026-09-11_5.png` (`1NIxv1J3HD8jyOyw21L9VLH1CLa5riM3f`) | Aina Lasagna | card responsive + nombre inferior |
| Equipo / card 04 | `imagen_2026-09-11_4.png` (`1UFqkj40VflTPL9AWFBznsXpXDn8yo52D`) | Marilyn Masbernat | card responsive + nombre inferior |
| Equipo / card 05 | `imagen_2026-09-11_3.png` (`1rb5HWVqp258624NWeq7ZZzMXHI3PvjmU`) | Marcelo Lasagna | card responsive + nombre inferior |
| Equipo / fuente editable | `equipo_protea_msk11092026.psd` | referencia de capas y lenguaje gráfico | gráfica flotante tratada como capa independiente en UI |
| Equipo / fuente nominal | `ProteaIV.pptx` | lista y correspondencia vigente de cinco miembros | confirma orden y nombres utilizados en V3 |
| Protea viva | `assets/img/protea-viva/*` | continuidad orgánica durante el scroll | canvas existente reutilizado a viewport completo |

## Equipo vigente en V3

La V3 usa exactamente cinco personas, en este orden visual:

1. Constanza Collarte
2. Madis Ilstav
3. Aina Lasagna
4. Marilyn Masbernat
5. Marcelo Lasagna

Bajo las cards se muestran únicamente los nombres. No se incorporan cargos, biografías ni un sexto perfil.

## Criterio de composición

La identidad se divide en capas reutilizables: fondo azul Protea, fotografía o visualización, campo cromático naranja/violeta, gráfica científica lineal y organismo vivo. La retícula no se altera para acomodar esas capas; las capas se adaptan a la retícula.

En escritorio, las cinco cards visuales del equipo mantienen pequeños desfases verticales. Bajo 960 px esos desfases se eliminan y el conjunto pasa a carrusel horizontal con `scroll-snap` y controles.

El campo cromático adicional de la interfaz se reduce respecto de la primera V3 para no cubrir en exceso los retratos ni competir con la gráfica ya presente en los archivos raster.
