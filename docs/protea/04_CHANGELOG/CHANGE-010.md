# CHANGE-010 — retícula 1/4–3/4 y tratamiento visual integrado

Estado: APPLY autorizado por la solicitud de Nicolás del 2026-09-07. Resultado esperado: `PROTEA_v09_REVIEW`.

## Objetivo

Reequilibrar el cuerpo de la Home para separar con mayor claridad el organismo vivo del contenido y fundir las imágenes y el equipo con el lenguaje tecnológico del hero.

## Cambios

1. En escritorio, convertir la retícula del cuerpo de tres a cuatro columnas iguales.
2. Reservar el primer cuarto para Protea viva y asignar los tres cuartos restantes al contenido.
3. Extender el canvas fijo 10 px sobre los límites superior e inferior del viewport.
4. Desplazar el centro del organismo al 13 % del ancho de la retícula para mantenerlo dentro del cuarto izquierdo.
5. Recortar el canvas al primer 25 % de la retícula en escritorio.
6. Aplicar a las fotografías de Lab, Hub y Adaptive Thinking un tratamiento azul, trama técnica, acento naranja y esquinas recortadas mediante CSS.
7. Integrar el informe IAO mediante un marco oscuro técnico, conservando su legibilidad documental.
8. Convertir las fichas del equipo en módulos azul profundo con retrato fundido, señal gráfica y estados de interacción.
9. Corregir el carrusel móvil para que cada ficha quede completa dentro del viewport y las fotografías no pierdan contenido por recorte.

## LOCKED

- Hero manual, canvas del hero y todos sus assets.
- Barra lateral y navegación.
- Copy, perfiles, formularios y recorrido narrativo.
- Comportamiento móvil aprobado de Protea viva: viewport completo y centro X al 75 %.
- Breakpoints existentes.

## Aceptación

- Escritorio: canvas fijo a altura completa +20 px, organismo dentro del primer cuarto y contenido en los tres cuartos derechos.
- Las imágenes se leen como parte del mismo sistema visual sin alterar sus archivos fuente.
- Equipo: grid de tres columnas en escritorio y carrusel táctil sin fichas cortadas en móvil.
- No aparece desbordamiento horizontal global.
- El hero queda fuera del diff.

## Validación visual

- La primera revisión confirmó el viewport de 956 px para una ventana de 936 px y el recorte exacto del 75 % derecho.
- Se retiró `mix-blend-mode: luminosity` de los retratos después de comprobar que oscurecía en exceso algunas fuentes; el tratamiento definitivo conserva rostros mediante saturación, contraste y luminosidad controlados.
