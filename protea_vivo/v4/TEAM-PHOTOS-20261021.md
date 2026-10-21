# V4 · Homologación de fotografías del equipo — 2026-10-21

Estado: REVIEW; cambio autorizado por instrucción editorial y fotográfica.

## Alcance
Sólo la sección de equipo de `protea_vivo/v4/index.html` y estilos específicos de `protea_vivo/v4/v4.css`. Sin alteraciones de nombres, cargos, descripciones, enlaces, orden, hero, motor, navegación ni V3.

## Correspondencia de fotografías
- Marcelo Lasagna: igual imagen de V3 (`https://drive.google.com/thumbnail?id=1rb5HWVqp258624NWeq7ZZzMXHI3PvjmU&sz=w1200`). Ya estaba integrada desde el commit anterior, sin reemplazo adicional.
- Constanza Collarte: retrato PNG entregado por dirección de arte. Se conservan los bytes originales en `assets/img/client/constanza-original-20261021.png` (1320 × 1598, 1.558.202 bytes; Git SHA `d8785a189d57a3e1bd7d5426892db4e300341e84`).
- Madis Ilstav: misma imagen de V3 (`https://drive.google.com/thumbnail?id=1xC2abeBj47Caa0N89rb4vqR7mMymD_-f&sz=w1200`).
- Jimena Espinoza, Adriana Arciniega y Estefanía Merino: permanecen sus fotografías V4. Se homologan cromática, contraste, recorte y superposición de cuadrado/diagrama exclusivamente con CSS; no hay sustitución ni síntesis de identidad.
- Aina Lasagna y Marilyn Masbernat: aparecen en la nómina V3, pero no en el equipo editorial de V4; no se agregan perfiles nuevos para evitar un cambio de contenido no solicitado.

## Validación
- Seis cards y sus textos intactos, orden de equipo preservado.
- Referencias V3 por nombre revisadas y utilizadas.
- Foto PNG de Constanza verificada byte a byte contra archivo entregado (Git hash coincide).
- Cascada CSS aislada bajo `.protea-v4 .v4-team-visual`.
- Pendiente comprobación visual en navegador publicado (móvil y escritorio), ya que las imágenes V3 de Google Drive dependen de que la URL siga accesible.
