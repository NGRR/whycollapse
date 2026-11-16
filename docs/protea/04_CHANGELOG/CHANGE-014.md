# CHANGE-014 — V4.2 · restauración de figura animada y acentos

Fecha: 2026-11-16. Estado REVIEW. Base: `0b384ded9524255fd57c8e4f2e79b2261fa84d4c`.

## Orden
Recuperar la figura animada del canvas en el primer quinto, añadir detalles de azul/naranja Protea (letras, signos, cotas) y dar alto contraste a las reseñas. Mantener blanco plano, imágenes originales, CTA naranja y composición vigente.

## Causa y diff
- `v42-scientific.css`: cambio de opacity:0 a opacity:1 en #protea-viva-canvas de escritorio. Filtro brightness(.73) saturate(1.12) para adaptar luminancia del dibujo original al fondo blanco, sin alterar geometría, animación, etapas ni motor. En móvil se conserva ocultación, porque no existe franja lateral de 1/5.
- Acentos #0066FF y #FF5A00 en índices, signos, cabeceras, cotas y marcadores; no se alteran datos ni contenidos.
- `scientific-guide-v42.svg`: marcas y símbolos ornamentales de color, sin magnitudes ni significado cuantitativo.
- Reseñas de Conferencias: panel plano azul noche #001133, cita blanca, atribución azul claro, detalles de esquina y borde naranja. Cinco citas, atribuciones, UIkit y controles se conservan.
- `index.html`: versión de caché de CSS actualizada; `README.md`: registro.

## Validación
Revisión estática: motor de Protea Viva y JS de fondo blanco sin cambios, contenido HTML equivalente salvo URL CSS, cotas SVG existentes, reglas de reseñas acotadas a #conferencias. Pendiente QA visual/funcional y despliegue Pages: especialmente contraste de la animación a través de sus etapas, posible cruce de cotas y figura y legibilidad del slideshow en móvil. No es aprobación.
