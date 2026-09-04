# Sistema observado en la baseline

No constituye un rediseño ni una biblioteca nueva.

| Elemento | Valor de la construcción |
| --- | --- |
| Barra lateral | 132px, exterior al cuerpo; visible desde 960px |
| Cuerpo de contenido | Tres tercios iguales dentro del contenedor existente; primero reservado, segundo y tercero unidos |
| Breakpoints | 640 y 960px; sin nuevos umbrales |
| Tipografía de títulos | Montserrat; énfasis editorial Georgia en hero |
| Tipografía de lectura | Roboto |
| Azul activo | #0786f8 (override existente) |
| Acento | #ff5a00 |
| Tinta | #071226 |
| Hero | Fondo #020826, canvas y lente del ZIP |
| UI | UIkit 3.21.16 existente; mismos botones y menú móvil |

CSS original intacto. Reglas nuevas exclusivamente en `protea-consolidacion.css`. Ajuste local del titular para copy más largo; no se altera el sistema tipográfico. Márgenes de lectura 24px en los nuevos bloques apilados. Espacio de contenido en escritorio: segunda y tercera columnas con una entrada de 28px, sin ocupar el primer tercio. El fondo vertebral existente se conserva; no se añadió un diseño al tercio reservado.
