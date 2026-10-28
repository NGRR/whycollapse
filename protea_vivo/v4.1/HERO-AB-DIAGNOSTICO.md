# V4 · Auditoría reproducible del parpadeo del hero (2026-10-20)

## Estado
Hipótesis técnica identificada, no demostrada todavía en la ejecución pública: el motor del hero original crea un contexto 2D con `{alpha:false, desynchronized:true}` y ejecuta `clearRect` antes de redibujar varias capas por fotograma. En Chromium, la composición desincronizada permite actualizaciones directas mientras el compositor muestra la página; esto puede exponer borrados o renderizados parciales en equipos con carga gráfica. V4 incluye más contenido y seis perfiles, aumentando la carga. V3 también usaba desynchronized: no atribuir una causalidad única sin prueba A/B en navegador.

## Corrección delimitada
Solo en `protea_vivo/v4/assets/js/protea.js`: `desynchronized: false` por defecto (composición sincronizada), sin cambiar assets, dibujos, temporización, geometría, FPS, colores, tipografía ni motores V3.
La opción `?legacy-canvas=1` restaura el comportamiento original para una comparación controlada en la misma V4.

## Diagnóstico incorporado
`protea_vivo/v4/hero-diagnostics.js` no instrumenta nada excepto cuando la URL incluye `hero-debug=1`. Añade un panel con botón «Copiar informe». Registra:
- Escrituras de ancho/alto del bitmap del canvas.
- Cambios geométricos del hero.
- Eventos resize de window y visualViewport.
- Long tasks de PerformanceObserver.
- Intervalos entre frames de requestAnimationFrame superiores a 70 y 150 ms.
- Cambios bruscos en muestras periódicas del color del canvas.
- Atributos del contexto 2D y telemetría del loader.

## Prueba A/B reproducible
1. Abrir en Chrome una pestaña nueva con `https://ngrr.github.io/whycollapse/protea_vivo/v4/?hero-debug=1`; observar al menos 15-20 segundos, hacer un scroll corto y regresar al hero. Pulsar «Copiar informe».
2. Repetir en otra pestaña con `https://ngrr.github.io/whycollapse/protea_vivo/v4/?hero-debug=1&legacy-canvas=1` (contexto original `desynchronized:true`).
3. Con la misma ventana, zoom y dispositivo, comparar aparición de parpadeos y contadores. Si el efecto aparece sólo en «legacy», se confirma el vínculo con el compositor. Si persiste igual en ambas, se debe investigar recarga de bitmap, capa CSS superpuesta o tiempos de carga.
4. La captura de Performance (Frames/Filmstrip) del navegador puede confirmar visualmente los fotogramas intermedios; el monitor por sí solo no detecta todas las fugas intra-frame del compositor.

## Restricciones / validación
No alterar ni aprobar V3. La lectura estática identifica riesgos concretos pero no sustituye el test visual real: esta sesión no dispone de acceso HTTP directo al GitHub Pages publicado. Conservar la etiqueta REVIEW hasta corroboración del A/B.
