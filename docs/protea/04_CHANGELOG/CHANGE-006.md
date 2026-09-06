# CHANGE-006 — restaurar viewport de Protea viva

Estado: APPLY autorizado por la observación de Nicolás del 2026-09-06. Resultado esperado: `PROTEA_v05_REVIEW`.

## Problema

`CHANGE-005` redujo el canvas al ancho físico del tercio reservado y centró la figura dentro de ese espacio. El ejemplo autoritativo `prototipos/protea_vive/` calcula una escena de viewport completo con el organismo situado en `centerXDesktop: 0.235`. Al reducir el sistema de coordenadas se perdió la relación espacial del componente y el fondo dejó de percibirse como en la referencia.

## Corrección

1. Mantener la escena fija a la altura y al ancho completo de la retícula principal en escritorio.
2. Restaurar la configuración observable del ejemplo: centro X 23,5 %, altura 96 %, DPR y opacidades de la referencia.
3. Confinar el resultado mediante recorte al primer tercio, en vez de redimensionar la escena a un tercio.
4. Hacer visible el canvas procedural desde que el cuerpo entra en pantalla; las texturas siguen apareciendo según el progreso.
5. Mantener el progreso asociado al cuerpo y no al documento completo.

## LOCKED

- Hero manual y todos sus assets.
- Rail, retícula, contenido, componentes y formularios.
- Fondo azul y contraste aprobados para revisión en `CHANGE-005`.
- Comportamiento móvil sin tercio reservado.

## Aceptación

- En escritorio, el plano animado permanece fijo al viewport y sólo se ve dentro del primer tercio libre.
- La composición coincide con las coordenadas del ejemplo `prototipos/protea_vive/`.
- El contenido de los dos tercios derechos no se desplaza ni recibe superposición del canvas.
- El hero no forma parte del diff.

## Validación ejecutada

- Configuración cotejada con `prototipos/protea_vive/config.js`: centro X 0,235, altura 0,96, DPR 1,85, escala y opacidades finales equivalentes.
- Canvas fijo del ancho total de la retícula, con recorte CSS exacto de 66,666666 % a la derecha.
- Fragmento HTML del hero con huella SHA-256 idéntica antes/después; sin cambios en scripts, estilos ni assets del hero.
- Sintaxis JavaScript, referencias, build estático y `git diff --check`: correctos.
- Revisión visual en navegador: pendiente de dirección de arte.
