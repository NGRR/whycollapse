# PROTEA_v09_REVIEW

Fecha: 2026-09-07. Construcción: `protea_vivo/`. Baseline anterior aprobada: `PROTEA_v03_APPROVED`, fijada en `00_BASELINE/PROTEA_v03_APPROVED.md`.

## Implementado

- Home de cinco bloques; menú de cinco destinos conservando el sistema visual.
- Barra lateral exterior a la retícula. Primer cuarto del cuerpo reservado y contenido continuo en los tres cuartos derechos. Apilado móvil con margen interior.
- Hero original con texto del informe, salto al recorrido y ajuste tipográfico exclusivamente local para evitar líneas huérfanas.
- Nuestra mirada con cuatro afirmaciones progresivas.
- Recorrido continuo Comprender → Entrenar → Arraigar → Sostener, con DIAGNOS/IAO y visualización real.
- Adaptive Thinking independiente: tres formatos, tesis, libro secundario, perfil, evidencia y contratación.
- Landing IAO y seis perfiles reales de equipo con mosaico y detalles.
- Formularios distintos para Protea, IAO y Marcelo. El formato se preselecciona desde cada CTA de Marcelo.
- Contacto Protea progresivo en cuatro momentos: situación, organización, contacto y revisión literal. No diagnostica, clasifica ni recomienda servicios.
- Fondo azul Protea aplicado desde Nuestra mirada hasta el cierre del cuerpo.
- Componente `Protea Vive v16` integrado como fondo progresivo del primer cuarto reservado, sin invadir los tres cuartos de contenido.
- Progreso del organismo vinculado al recorrido del cuerpo; cuatro texturas válidas reutilizadas y activo vacío excluido.
- En móvil se conserva el apilado sin reservar el tercio; Protea viva ocupa el viewport completo como plano de fondo detrás del contenido.
- Corrección `CHANGE-006`: la escena vuelve a calcularse a ancho de viewport de la retícula y se recorta al primer tercio; ya no se comprime el sistema de coordenadas dentro de esa columna.
- Corrección `CHANGE-007`: el equipo conserva el grid de tres columnas en escritorio y funciona como carrusel táctil nativo en móvil, sin duplicar perfiles ni añadir dependencias.
- Corrección `CHANGE-008`: se retiró la regla que ocultaba Protea viva bajo 960 px y se activó su composición móvil de viewport completo, sin recorte lateral.
- Corrección `CHANGE-009`: el centro móvil de Protea viva se desplaza al 75 % del viewport para despejar la zona izquierda de lectura.
- Revisión `CHANGE-010`: retícula 1/4–3/4 en escritorio, canvas extendido 10 px por borde, organismo centrado dentro del cuarto izquierdo, imágenes con tratamiento tecnológico y módulos de equipo integrados al entorno azul.
- Retiro del test activo y debrief. Compatibilidad de URLs antiguas hacia contacto directo o nueva landing.
- Botón azul del índice central como único acceso a esta construcción; se retiró el enlace histórico que duplicaba el mismo destino.
- Manifiesto, reglas AGENTS y CHANGE-001/002 guardados con el código.

## Validación

- Hero manual íntegro: fragmento HTML con la misma huella SHA-256; `protea.js`, `protea-live.css` y `components/hero/**` conservan el estado remoto `fa24f7c6` indicado por Nicolás y no fueron modificados por `CHANGE-005`.
- Cuatro activos de Protea viva comprobados, todos válidos y no vacíos; peso conjunto 1.582.538 bytes.
- Parámetros espaciales y de composición cotejados con `prototipos/protea_vive/`: centro X 0,235, altura 0,96, DPR 1,85 y opacidades finales equivalentes.
- 103 referencias locales de las tres páginas principales comprobadas, sin destinos ni anclas rotos.
- Un H1 por página y sin IDs duplicados.
- Sintaxis JavaScript y `git diff --check` correctos.
- Revisión visual de Home en escritorio y en marcos de 390/768/1440px. Se corrigieron márgenes del nuevo cuerpo y ajuste del titular/CTA. Sin desbordamiento horizontal detectado en las vistas inspeccionadas.
- Verificados los CTA de formato hacia el formulario de Marcelo: Conferencia, Seminario y Conversación estratégica.
- Verificada la estructura del contacto Protea: cuatro momentos, cinco campos autorizados, validación por momento y ausencia de lenguaje diagnóstico.
- No se enviaron datos de prueba ni se configuró un canal comercial supuesto.

La comprobación visual se realizó con navegador Chrome, mediante un servidor local de revisión sin dependencias de producto. No constituye una auditoría exhaustiva de todas las combinaciones de dispositivo, tamaño de texto o navegador. La animación existente conserva su comportamiento y limitaciones originales.

La comprobación visual anterior corresponde a CHANGE-001. `CHANGE-006` fue validado estructuralmente y queda pendiente de revisión visual de dirección de arte. El commit y la publicación de revisión no constituyen aprobación.

## Solicitudes pendientes para cerrar la publicación comercial

| ID | Qué debe definir o aportar Nicolás / cliente | Destino | Qué permite cerrar |
| --- | --- | --- | --- |
| P02 | Canal real de recepción y mecanismo de envío para Protea/IAO y para Marcelo | Formularios | Envío real, errores de servidor y confirmación comprobable |
| P03 | Confirmar actualidad de los seis perfiles y autorización de uso comercial de materiales | Equipo, IAO, Marcelo | Validación editorial final |
| P04 | Validar títulos, duraciones, disponibilidad, idiomas y personalización con Marcelo | Adaptive Thinking | Cierre de la oferta comercial; cifras actuales proceden del informe |
| P05 | Información complementaria y preguntas frecuentes definitivas del IAO | Landing IAO | Sustituir o ampliar exclusivamente la información validada; no se inventan detalles |
| P06 | Aprobación visual explícita de `PROTEA_v09_REVIEW` | Construcción completa | Nueva baseline APPROVED; no inferirla del permiso para hacer commit |

Los formularios están maquetados y validan campos obligatorios, pero NO envían. La interfaz lo declara y nunca muestra una confirmación falsa. No se guardan datos personales en almacenamiento local. No se publicaron precios ni métricas ficticias.


## Nota operativa posterior — V4.1 (2026-11-13)

Este archivo contiene principalmente el estado histórico PROTEA_v09_REVIEW. La referencia para trabajar con versiones posteriores es `docs/protea/03_REFERENCIAS/GITHUB_CONECTOR_Y_COMMITS.md`, enlazada desde `AGENTS.md`. No confundir los estados anteriores con V4.1.

- Último commit funcional confirmado antes de esta nota: `f50088a9a5cd2df59b341b03a7cc769416dd549c` (retrato de Constanza en V4.1, JPEG procedente de la imagen suministrada).
- **Pendientes aún no aplicados:** nueva foto `coni3.png`; corregir el offset de navegación / scroll spy de V4.1 y, tras medir, el espaciado de las secciones. Los ajustes descritos en la conversación no constituyen cambios en Git.
- V4 base permanece como comparación. Toda nueva modificación requiere validación por lectura de archivos y un SHA de commit real publicado en `main`.


## Seguimiento V4.1 · 2026-11-13 (fotografía y scroll)

Después del estado histórico anterior, la revisión de V4.1 incorpora la fotografía `coni3.png` como recurso JPEG de alta calidad en `protea_vivo/v4.1/assets/img/client/constanza-tratamiento-v41-20261113-v2.jpg`, la referencia HTML, el alineamiento del scroll por cabecera visible y la compactación del espacio entre secciones. Se conserva V4 como comparación; sigue pendiente la comprobación visual en navegador real.

## V4.1 · Revisión de navegación contextual y recursos (2026-11-13)

Se añaden cuatro ilustraciones de instrumentos de trabajo, retícula 1/5–4/5, centraje dinámico de Protea Viva en primer quinto, navegación secundaria del rail con persistencia de ocho segundos, menú móvil en acordeón y scroll unificado para todas las anclas internas. **Versión REVIEW**; pendiente revisión visual y funcional de dirección de arte. El envío de contacto y la colección de Actualidad siguen pendientes de integración en Squarespace; no anunciar como operativos.


## Logos de clientes · UIkit Switcher + Slideshow (2026-11-13)

- Fuente documental: correo de Marcelo Lasagna, **«Logos clientes»**, recibido 10/11/2026; adjunto `Clientes_Protea_logos.pptx`.
- Se extrajeron **71 logos PNG independientes**, directamente de los objetos de imagen embebidos (no capturas de páginas): 21 empresas, 7 universidades, 40 administraciones públicas, 3 organismos internacionales.
- Cada PNG se conserva binariamente idéntico al objeto del PPTX; ver `assets/img/clientes/manifest.json` con procedencia de lámina/objeto y `assets/img/clientes/README.md` con inventario.
- En `#experiencia`, el placeholder se reemplazó con un componente de diseño propio: cuatro tabs **UIkit Switcher** y 10 páginas **UIkit Slideshow** de hasta 8 logos en una retícula de 4×2 (móvil 2×4). Transición animada tipo slide, autoplay de 7 segundos, pausa en hover, botones y dotnav; sin overflow-x/scroll horizontal.
- Logos sin filtros ni deformaciones, sobre tarjetas blancas y marco cromático coherente con Protea. No se inventaron clientes ni se alteraron identidades originales.
- Se conservaron las marcas históricas proporcionadas; no afirmar contratos actualmente vigentes. Debe confirmarse el alcance de autorización antes del despliegue comercial definitivo.
- V4 original intacta; V4.1 conserva sus otras secciones. **Pendiente QA visual y responsive** del switcher/slideshow en navegador real.


## Revisión de recursos EAI y Marcelo · 2026-11-14
- Sección IAO: sustituido `iao-mapa.png` por `assets/img/client/iao-eai-esquema-v41.png`, mapa de Estilo de Adaptabilidad Individual (EAI) suministrado por Nicolás. El pie identifica EAI, no lo presenta como gráfica de resultados del IAO. Conservados los cinco atributos y las 21 variables del texto.
- Equipo y semblanza de Conferencias: `assets/img/client/marcelo-retrato-v41.png` (retrato B/N). Cabecera de Conferencias: `assets/img/client/marcelo-conferencia-v41.png` (escenario). Se actualizan las tres apariciones con dos fotografías. Se conserva el tratamiento gráfico de las tarjetas y se centra la imagen de escenario.
- Tres PNG originales, verificados mediante SHA de blob Git contra los bytes locales: EAI `ad0a2b42fc7bf13635fd618230a5c03e53254162`; conferencia `2cf155c4fe8096d62fe17f39a4faa1377815e365`; retrato `e88bde2669a49553ad08aa63bc0a27059e6a6698`. No se recodificaron ni generaron imágenes.
- Alcance: V4.1 exclusivamente; V4, los otros perfiles, canvas, navegación y slideshow de clientes permanecen intactos. Pendiente inspección visual en navegador.


## Corrección de alcance · 2026-11-14
Por indicación expresa de Nicolás, se restaura exclusivamente la tarjeta de Marcelo Lasagna en el equipo a su estado anterior (`5751a39`): imagen de V3, referencia original de Drive y capas cromáticas originales. El retrato nuevo en blanco y negro permanece en la semblanza de Conferencias y la fotografía nueva de escenario en su cabecera. El esquema EAI y el resto del sitio permanecen sin cambios. Se incorpora la regla de commit obligatorio en `AGENTS.md`. Estado REVIEW; comprobación visual pendiente.


## Limpieza editorial de cara al público · 2026-11-14
Por solicitud expresa se retiran las notas y advertencias internas visibles del título, Conferencias, Actualidad, Experiencia, contacto y enlaces legales sin destino; el comparador de versiones y las fuentes de trabajo conservan su función y no se editan. Se mantienen los testimonios suministrados, cuya selección y atribución requieren confirmación editorial antes del despliegue definitivo; las marcas son referencias de trayectoria, no prueba de contratos actuales. Actualidad sigue sin colección dinámica. Conversemos mantiene sus campos y pasos, pero el botón final abre un borrador en la aplicación de correo del visitante, usando la dirección existente contacto@protea.blue; no envía automáticamente, no almacena datos y no simula confirmación de envío. Integración nativa Squarespace pendiente. Sin JS se ofrece enlace de correo. Los rótulos de contingencia del precargador se sustituyen por «INICIANDO» sin modificar los tiempos, estados ni diagnósticos internos. IAO, imágenes, identidad, rail, canvas y slideshow no se rediseñan. QA de código realizado; prueba visual y apertura del cliente de correo pendientes.


## Referencias y ampliación EAI · 2026-11-14
- Conferencias: reemplazado el scroll horizontal de `.v4-testimonials` por `.v41-reference-slideshow`, UIkit Slideshow (slide manual, una cita por página, flechas, cinco puntos, gestos del componente). Se preservan las cinco citas y atribuciones sin alteración; reproducción automática desactivada para facilitar la lectura. Se elimina el override CSS de scroll-snap.
- IAO: `.v41-eai-lightbox` abre el PNG original a tamaño adaptado a la pantalla mediante UIkit Lightbox, con enlace a la misma imagen, rótulo de ampliación y cierre nativo. Sin recorte del esquema ni imágenes nuevas.
- Cambios limitados a V4.1. No se añaden dependencias. Pendiente QA visual en navegador (tamaño de citas, controles, ampliación y cierre); la revisión editorial de atribuciones sigue documentada.


## EAI interactivo integrado en IAO · 2026-11-16
Se reemplaza el esquema estático y su lightbox por el componente SVG de la segunda revisión del prototipo (`4e8194b`). Mismas dos composiciones, 23 conceptos, once fichas y doce etiquetas no interactivas; dimensiones y descriptores sin cambios. CSS/JS propios en `components/eai/`, IDs prefijados. Adaptación por ancho disponible y ampliación nativa del mismo mapa, sin duplicar nodos; PNG original como respaldo cuando JS no inicia. Sin cambios fuera de IAO y su integración. Descriptores interpretativos pendientes de validación por Protea. Estado REVIEW, QA visual en navegador pendiente.
