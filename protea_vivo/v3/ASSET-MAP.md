# Protea V3 · Mapeo de activos

Fecha de revisión: 2026-09-15

Fuente principal: carpeta Drive `1DEEt-dOb4iQLV43DFHLAic-08BTADegu`.

## Dirección de uso

| Área V3 | Recurso Drive | Función visual | Implementación |
| --- | --- | --- | --- |
| Entrenar / Training | `03_sistema_neuronal_color_transparente.png` (`1knbNEZiGLpRHyou2H0HzXJ1UQox3OdYL`) | conexión, transmisión, aprendizaje | capa conceptual transparente sobre campo azul; fallback local `entrenamiento.jpg` |
| Arraigar / Lab | `04_flor_raiz_color_transparente.png` (`1b2b2hSAcEdAf6tbv8ytp-qsFI5ZwArxE`) | crecimiento con soporte, experimentación que arraiga | capa conceptual transparente; fallback local `arraigo.jpg` |
| Sostener / Hub | `05_red_cognitiva_color_transparente.png` (`1WDXSr83Tawm714Ei4OhpQXTqyPfHC82v`) | red, circulación, inteligencia distribuida | capa conceptual transparente; fallback local `life-system.jpg` |
| Equipo / referencia | `imagen_2026-09-11_2.png` (`1PBvTdSMzXc5hCvhDzd0B6fvCQKiBJzQS`) | composición horizontal maestra de cinco personas | no se usa como tarjeta plana; funciona como referencia de composición |
| Equipo / card 01 | `imagen_2026-09-11_7.png` (`1jTwzd4pM6fMrtyTbUK1TQJJD2JRBvX70`) | retrato independiente | card responsive |
| Equipo / card 02 | `imagen_2026-09-11_6.png` (`1xC2abeBj47Caa0N89rb4vqR7mMymD_-f`) | retrato independiente | card responsive |
| Equipo / card 03 | `imagen_2026-09-11_5.png` (`1NIxv1J3HD8jyOyw21L9VLH1CLa5riM3f`) | retrato independiente | card responsive |
| Equipo / card 04 | `imagen_2026-09-11_4.png` (`1UFqkj40VflTPL9AWFBznsXpXDn8yo52D`) | retrato independiente | card responsive |
| Equipo / card 05 | `imagen_2026-09-11_3.png` (`1rb5HWVqp258624NWeq7ZZzMXHI3PvjmU`) | retrato independiente | card responsive |
| Equipo / fuente editable | `equipo_protea_msk11092026.psd` | referencia de capas y lenguaje gráfico | la V3 recrea la gráfica flotante como capa DOM/CSS independiente para que no dependa de una composición raster fija |
| Protea viva | assets locales `assets/img/protea-viva/*` | continuidad orgánica durante el scroll | canvas existente reusado con rutas V3 y contenedor desplazado 125 px a la izquierda en desktop |

## Criterio de composición

La V3 evita convertir la identidad en una sucesión de banners. El sistema se divide en cuatro capas reutilizables: fondo Protea, imagen/fotografía, campo cromático naranja-violeta y gráfica científica lineal. En escritorio las unidades pueden desplazarse y superponerse; bajo 760 px se elimina esa flotación y el conjunto de equipo pasa a carrusel horizontal con snap y controles explícitos.

Los seis perfiles textuales anteriores se conservan: Marcelo Lasagna, Constanza Collarte, Jimena Espinoza, Madis Ilstav, Adriana Arciniega y Estefanía Merino. El nuevo sistema visual de Drive contiene cinco retratos y se trata como un conjunto gráfico independiente de ese roster editorial.
