# Protea Web — manifiesto central

## Intención

Protea debe expresar ciencia y transformación orgánica: la construcción biológica como vía para comprender la conducta de las organizaciones. Su imagen combina criterio ético, filosófico y estratégico con una sensibilidad artística hacia los sistemas vivos. La sofisticación reside en la composición, la precisión y las relaciones entre contenidos; no exige aumentar efectos, marcas ni recursos.

La web debe permitir comprender quién es Protea, reconocer un problema organizacional y entender cómo desarrollar capacidad adaptativa. Becoming Adaptive articula comprender, entrenar, arraigar y sostener. DIAGNOS es la capacidad diagnóstica; IAO es su instrumento principal. El Plan Adaptativo convierte esa lectura en decisiones. Adaptive Thinking abre una vía diferenciada para las conferencias, seminarios y conversaciones estratégicas de Marcelo Lasagna.

## Autoridad y continuidad

Nicolás ejerce la dirección de arte. La construcción suministrada en el ZIP es la baseline visual aprobada, con las limitaciones de contenido que motivan esta intervención. Una versión aprobada no se reinterpreta por conveniencia técnica. El informe dirige el contenido dentro de los límites expresamente establecidos por Nicolás.

Precedencia: instrucción explícita vigente → orden de cambio autorizada → decisiones visuales de la baseline → informe del cliente → convenciones técnicas. Un ejemplo de estado LOCKED no bloquea un cambio que el usuario pide expresamente: en CHANGE-001 están autorizados los textos y destinos de navegación, no su rediseño.

## Contrato de diseño

| Estado | Alcance vigente | Regla |
| --- | --- | --- |
| LOCKED | Canvas del hero, lente, capas, movimiento, assets, familias tipográficas, tokens de color, estilo de botones, etiquetas laterales, breakpoints 640/960 | Conservar; registrar cualquier excepción necesaria antes de ejecutarla. |
| EDITABLE | Copy del hero, textos y destinos del menú y rail, contenido y medios dentro de los bloques autorizados | Modificar sólo por instrucción concreta. |
| REPLACE | Relato del cuerpo, test y debrief; páginas IAO y contacto; nueva Adaptive Thinking | Reconstruir sólo con componentes y lenguaje visual existentes. |

La distribución en tercios es la excepción estructural autorizada para el cuerpo: la barra lateral de navegación queda fuera de la retícula; a su derecha, el cuerpo tiene tres tercios iguales. El primero queda libre para una intervención de diseño posterior y el segundo y tercero contienen el contenido como un único bloque. Los rótulos acompañan al contenido, nunca ocupan el tercio reservado. En móvil se elimina la reserva y se apila el contenido. No se extiende al canvas ni habilita el rediseño global. Mantener el estilo de las etiquetas laterales, aunque el informe proponga otro tratamiento. No añadir plugins, librerías, iconografía ni marcas.

## Método de intervención

1. Fijar versión, fuente y selector. Toda revisión parte de un estado identificable, no de memoria.
2. REVIEW: describir problema, causa, archivo, selector, modificación y riesgo. No editar si la petición es sólo diagnóstico.
3. APPLY: ejecutar exclusivamente las decisiones autorizadas. Una instrucción de implementación concreta autoriza este paso sin confirmación adicional.
4. Validar integridad, enlaces, comportamiento y composición a tamaños acordados. Distinguir verificaciones realizadas de pendientes.
5. Presentar el diff conceptual y conservar una versión REVIEW hasta la aprobación expresa de Nicolás.

Una orden debe contener ID, objetivo, alcance, cambios observables, restricciones, referencia visual y aceptación. Expresiones como «más aire» se traducen a un elemento y una medida antes de aplicar. No extender una corrección local al grid o CSS global.

La equivalencia byte a byte se exige a archivos o fragmentos protegidos, no al documento completo cuando su contenido está autorizado para reemplazo. Para comparar el ZIP con Git se normalizan únicamente CRLF/LF; los binarios se comparan exactos.

## Memoria operativa

- `00_BASELINE/`: referencia inmutable, huellas y decisiones aprobadas.
- `01_BRIEF/`: fuente del cliente y alcance editorial.
- `02_DESIGN_SYSTEM/`: tokens y componentes observados, no un sistema alternativo.
- `03_REFERENCIAS/`: fuentes visuales identificables y procedencia de activos.
- `04_CHANGELOG/`: órdenes, diagnósticos y diff conceptual.
- `05_CURRENT_BUILD/`: estado, validaciones y solicitudes pendientes. Código único en `protea_vivo/`.

Usar `PROTEA_vNN_APPROVED` y `PROTEA_vNN_REVIEW`; nunca «final_final». APPROVED sólo se asigna tras aprobación explícita. Ante regresión, comparar con la referencia y portar únicamente el cambio autorizado. No reemplazar de nuevo el sitio entero.

## Solicitudes para continuar

Cada pendiente debe identificar qué decisión o material falta, dónde se usa y qué permite cerrar. Evitar pedir de nuevo información ya disponible. No bloquear implementación autorizada por pendientes independientes. No fabricar respuestas del cliente ni completar integraciones con destinos supuestos.

La unidad de confianza es el cambio verificable. La IA no sustituye la dirección de arte ni la intención del proyecto.
