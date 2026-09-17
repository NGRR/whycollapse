# Protea V3 · Mapeo de activos y contrato estructural

Fecha de revisión: 2026-09-17

Fuente principal: carpeta Drive `1DEEt-dOb4iQLV43DFHLAic-08BTADegu`.

## Arquitectura de mantenimiento R16

La V3 mantiene una arquitectura reducida y semántica. Dentro de `protea_vivo/v3/` los archivos activos son:

- `index.html`: estructura y contenido de la propuesta.
- `v3.css`: layout, composición editorial y estilos base de V3.
- `v3-ui.css`: rail, marcadores, responsive, CTA y estilos compartidos de interfaz.
- `v3.js`: navegación, carrusel, contacto y reconstrucción del viewport móvil.
- `v3-loader.js`: componente autocontenido del loader real: readiness gate, progreso, precarga, telemetría y animación de entrada/salida.
- `ASSET-MAP.md`: contrato estructural, activos y guía de auditoría.

Las antiguas capas incrementales `v3-r4.css` a `v3-r10.css` y `v3-r9.js` fueron absorbidas y eliminadas. No deben volver a introducirse archivos de revisión numerados para ajustes normales. `v3-loader.js` es una separación funcional deliberada: evita mezclar el ciclo de carga con navegación, formularios y responsive.

### Loader real R16

El loader dejó de usar una duración fija como sustituto del estado de carga. Su secuencia actual es:

1. Se mantiene una presencia mínima de 3 segundos para que la introducción no desaparezca instantáneamente en caché caliente.
2. En paralelo se crea un manifiesto real de recursos: ocho capas del Hero, texturas de Protea Viva, todas las imágenes visibles del documento, fuentes y el primer frame verificable del canvas del Hero.
3. Cada recurso sólo incrementa el progreso cuando termina su evento de carga y, en imágenes, se intenta además `HTMLImageElement.decode()`.
4. Los spokes exteriores representan el porcentaje acumulado de tareas resueltas. Ya no avanzan según `setTimeout`.
5. El loader no inicia el docking hasta que se cumplen simultáneamente el mínimo visual y el readiness gate.
6. Existe un fail-safe de 30 segundos exclusivamente para evitar un bloqueo permanente causado por un recurso roto o una conexión suspendida.
7. `PerformanceObserver` registra `resource` entries en `window.__PROTEA_V3_LOAD_REPORT__` para auditoría de tiempos, `transferSize`/`decodedBodySize` cuando el navegador y el origen lo permiten. No controla por sí solo la liberación del loader.

El objeto `window.__PROTEA_V3_LOAD_REPORT__` permite revisar desde DevTools:

- `timedOut`: si se utilizó el fail-safe;
- `progress`: progreso real final alcanzado;
- `tasks`: recursos lógicos y momento de resolución;
- `resources`: telemetría Resource Timing observada por el navegador;
- `completedAt`: duración total del loader en milisegundos.

### Imágenes responsive durante la carga

Antes de esperar las imágenes alojadas en Google Drive, `v3-loader.js` ajusta el parámetro `sz` según viewport y tipo de recurso:

- gráficas conceptuales: `w960` en móvil y `w1600` en escritorio;
- retratos del equipo: `w720` en móvil y `w1200` en escritorio.

Los `<img>` del documento se cambian a `loading="eager"` mientras opera el readiness gate y se espera su carga real. Esto evita que la animación termine para luego dejar imágenes vacías al hacer scroll, sin obligar al móvil a descargar las versiones de 1800 px usadas anteriormente para las gráficas orgánicas.

### Primer frame del Hero

El gate incluye una tarea específica `hero:first-frame`. Se verifica que `#protea-canvas` tenga dimensiones efectivas y que una muestra de píxeles ya contenga información visual. El loader no considera al Hero listo únicamente porque los PNG hayan finalizado su transferencia.

### Salida R16

El viaje al Hero conserva 850 ms, pero la salida se hizo deliberadamente más evidente:

- los anillos exteriores se expanden hasta varias veces su diámetro y aceleran su rotación;
- los anillos interiores implosionan hacia el núcleo;
- scans y órbitas se separan con rotaciones amplias;
- el compás de spokes se expande y desaparece;
- las partículas orgánicas reciben vectores radiales individuales y salen despedidas;
- cuatro ondas de choque concéntricas atraviesan el campo;
- en el último tramo dos anillos se reconstruyen en la posición final del Hero.

La fase de salida utiliza principalmente `transform` y `opacity` para mantenerla en composición GPU y no volver a introducir transiciones de `left`, `top`, `width` o `height` por fotograma.

### Spokes / compás

Las marcas exteriores son geométricas, no caracteres tipográficos. Cada marca apunta radialmente al centro del círculo y comienza 3 px fuera de su borde. Se incluyen marcas mayores cada división del compás y marcas cardinales aún más largas. La densidad se calcula a partir de la circunferencia real, dentro del rango configurado en `v3-loader.js`.

### Reconstrucción responsive en móviles

La solución móvil no depende sólo de media queries. `v3.js` mide `window.visualViewport` y reconstruye variables y layout cuando cambia el viewport:

- recalcula `--mobile-nav-h`, `--mobile-story-h` y `--mobile-critical-h` usando el viewport visible real;
- en portrait desplaza el bloque de copy del Hero hacia arriba proporcionalmente al alto disponible;
- en landscape transforma el Hero a una retícula horizontal de dos columnas, reduce tipografía y navegación superior, y amplía el rail inferior al ancho útil disponible;
- el rail móvil ocupa el ancho entre los safe areas laterales;
- escucha `resize`, `orientationchange` y `visualViewport.resize`;
- tras una rotación espera a que Safari estabilice el viewport y emite un `resize` final para que `#protea-canvas` y `#protea-viva-canvas` recalculen dimensiones.

Esta reconstrucción evita que el sitio conserve medidas de portrait al pasar a landscape —o viceversa— sin recargar la página. No se modifica el motor compartido del Hero ni Protea Viva.

## Contrato estructural de V3

La V3 no sustituye la arquitectura de la consolidada. Se preservan como elementos protegidos:

1. `protea-shell` y el rail narrativo externo `section-rail`.
2. Hero `#observatorio`, su retícula 2/5 + 3/5 y el canvas `#protea-canvas`.
3. El cuerpo posterior al Hero organizado como retícula de cuatro columnas: primer cuarto reservado como campo visual; contenido en columnas 2–4.
4. `#protea-viva-canvas` como plano fijo del cuerpo. Su contenedor ocupa todo el viewport visible, conserva el desplazamiento de 125 px hacia la izquierda y no usa `clip-path`.
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
