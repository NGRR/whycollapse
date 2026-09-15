# Protea V3 · Mapeo de activos y contrato estructural

Fecha de revisión: 2026-09-15

Fuente principal: carpeta Drive `1DEEt-dOb4iQLV43DFHLAic-08BTADegu`.

## Contrato estructural de V3

La V3 no sustituye la arquitectura de la consolidada. Se preservan como elementos protegidos:

1. `protea-shell` y el rail narrativo externo `section-rail`.
2. Hero `#observatorio`, su retícula 2/5 + 3/5 y el canvas `#protea-canvas`.
3. El cuerpo posterior al Hero organizado como retícula de cuatro columnas: primer cuarto reservado al organismo; contenido en columnas 2–4.
4. `#protea-viva-canvas` como plano fijo del cuerpo. Su contenedor mide `100dvh + 10px`, tiene 5 px de sangrado arriba y abajo, queda desplazado 125 px a la izquierda y no usa `clip-path`.
5. El motor de Protea Viva sigue ligado al progreso entre `#colapso` y `.consolidation-footer`.

La expansión de dirección de arte ocurre dentro de ese contrato: composición editorial, tratamiento de imágenes, capas gráficas, sistema de cards, tipografía, color, ritmos y recursos conceptuales.

## Dirección de uso de activos

| Área V3 | Recurso Drive | Función visual | Implementación |
| --- | --- | --- | --- |
| Entrenar / Training | `03_sistema_neuronal_color_transparente.png` (`1knbNEZiGLpRHyou2H0HzXJ1UQox3OdYL`) | conexión, transmisión, aprendizaje | capa conceptual transparente dentro del tercio de contenido |
| Arraigar / Lab | `04_flor_raiz_color_transparente.png` (`1b2b2hSAcEdAf6tbv8ytp-qsFI5ZwArxE`) | crecimiento con soporte, experimentación que arraiga | capa conceptual transparente dentro del recorrido |
| Sostener / Hub | `05_red_cognitiva_color_transparente.png` (`1WDXSr83Tawm714Ei4OhpQXTqyPfHC82v`) | red, circulación, inteligencia distribuida | capa conceptual transparente dentro del recorrido |
| Equipo / referencia | `imagen_2026-09-11_2.png` (`1PBvTdSMzXc5hCvhDzd0B6fvCQKiBJzQS`) | composición horizontal maestra de cinco personas | referencia compositiva; no se usa como banner rígido |
| Equipo / card 01 | `imagen_2026-09-11_7.png` (`1jTwzd4pM6fMrtyTbUK1TQJJD2JRBvX70`) | retrato independiente | card responsive |
| Equipo / card 02 | `imagen_2026-09-11_6.png` (`1xC2abeBj47Caa0N89rb4vqR7mMymD_-f`) | retrato independiente | card responsive |
| Equipo / card 03 | `imagen_2026-09-11_5.png` (`1NIxv1J3HD8jyOyw21L9VLH1CLa5riM3f`) | retrato independiente | card responsive |
| Equipo / card 04 | `imagen_2026-09-11_4.png` (`1UFqkj40VflTPL9AWFBznsXpXDn8yo52D`) | retrato independiente | card responsive |
| Equipo / card 05 | `imagen_2026-09-11_3.png` (`1rb5HWVqp258624NWeq7ZZzMXHI3PvjmU`) | retrato independiente | card responsive |
| Equipo / fuente editable | `equipo_protea_msk11092026.psd` | referencia de capas y lenguaje gráfico | la gráfica flotante se reconstruye como capas DOM/CSS para conservar independencia y respuesta móvil |
| Protea viva | `assets/img/protea-viva/*` | continuidad orgánica durante el scroll | canvas existente; anclaje al cuarto izquierdo sin recorte rígido |

## Criterio de composición

La identidad se divide en capas reutilizables: fondo azul Protea, fotografía o visualización, campo cromático naranja/violeta, gráfica científica lineal y organismo vivo. La retícula no se altera para acomodar esas capas; las capas se adaptan a la retícula.

En escritorio, las cinco cards visuales del equipo mantienen pequeños desfases verticales para recuperar la tensión de la composición horizontal original. Bajo 960 px esos desfases se eliminan y el conjunto pasa a carrusel horizontal con `scroll-snap` y controles.

Los seis perfiles textuales anteriores se conservan: Marcelo Lasagna, Constanza Collarte, Jimena Espinoza, Madis Ilstav, Adriana Arciniega y Estefanía Merino. El conjunto visual de cinco retratos de Drive se trata como una capa gráfica independiente para no atribuir identidades sin una correspondencia documental explícita.
