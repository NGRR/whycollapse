# Protea V3 · Mapeo de activos y contrato estructural

Fecha de revisión: 2026-09-15

Fuente principal: carpeta Drive `1DEEt-dOb4iQLV43DFHLAic-08BTADegu`.

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