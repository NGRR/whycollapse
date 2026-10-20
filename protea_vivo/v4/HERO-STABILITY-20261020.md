# Corrección de estabilidad del hero — V4

Fecha: 2026-10-20. Estado: REVIEW (revisión técnica, sin aprobación visual).

## Incidencia
La V4 presentaba saltos perceptibles en la lente y parpadeos del hero que no se manifestaban previamente según reporte de usuario. Se identifican dos mecanismos capaces de causarlos en código:

1. `assets/js/protea.js`: ante cada cambio real de tamaño se reasignaba el tamaño del bitmap del canvas y se forzaba la lente al punto de anclaje, perdiendo su desplazamiento y objetivo actual. Si la geometría variaba, el salto resultaba visible. Ahora se mantiene el desplazamiento relativo y el puntero al ajustar el bitmap.
2. `v4.js`: el `visualViewport.resize` móvil (que puede emitirse al mostrar u ocultar barras del navegador) volvía a imponer tamaños y estilos del hero. Ahora sólo reconstruye cuando cambia la anchura o la orientación; no reserva espacio para la barra narrativa inferior retirada en V4.
3. `v4-loader.js`: se usaba carga `eager` de todas las imágenes de un documento significativamente mayor al de V3, incluso por debajo del primer viewport. Ahora el gate inicial considera los recursos gráficos del hero, Protea Viva, fuentes y primer frame; las imágenes editoriales mantienen su lazy loading.
4. `v4.css`: se elimina en escritorio la reserva superior del header que ya no existe y se estabiliza la altura mínima del hero.
5. `index.html`: cache busting de las cuatro fuentes alteradas.

## Integridad
No se modificaron V3, la página índice del repositorio, el CSS/UI del rail, los activos gráficos ni las imágenes. Se mantiene la misma técnica del canvas, sus assets, paleta, tipografías, lente y temporización de animación.

## Validación
Se verificó sintaxis de los JavaScript modificados, existencia de anclas de parcheo, y separación de paths de V3 y V4. **No se ha realizado una prueba gráfica con un navegador conectado al sitio en vivo**: sigue pendiente confirmar ausencia de saltos en dispositivos reales, especialmente Safari iOS en scroll/orientación y Chrome escritorio.
