# Protea V4.2 — Monocromo


## V4.2 · Experimento creativo monocromático — 2026-11-16
Base inmutable: V4.1 en `4ff78db`. Copia completa en `protea_vivo/v4.2/`, estado REVIEW. V4.1 pasa a propuesta principal del índice; V4.2 ocupa tarjeta experimental; V3 y anteriores en recursos secundarios. V4 original se conserva en Git sin acceso visible desde el índice. Paleta del cuerpo: negro/blanco/grises, superficies oscuras, tipografía clara y controles inversos. Imágenes originales y logos a color (sin nuevos filtros); se neutralizan overlays de interfaz y canvas del cuerpo sin alterar su geometría o movimiento. Hero y precarga conservados, no se cambia código de sus motores. `v42.css` capa cromática local derivada de hojas V4.1; `v4.js` cambia únicamente la constante cromática del panel que se aplica inline. EAI, formularios, contenidos, rail, slideshows y recursos heredados. Pendiente revisión visual en navegador real y dirección de arte.

## Historial base V4.1
# PROTEA V4.1 · Primera pasada editorial (REVIEW)
Fecha: 2026-10-27
Referencia: `protea_vivo/v4/` en el commit previo a V4.1.
Motivo: feedback de Marcelo y Nicolás; reducir repetición, comunicar el trabajo con precisión, usar el sitio como biblioteca informativa y no como embudo comercial agresivo.

## Implementación
- Directorio completamente independiente `protea_vivo/v4.1/` con las mismas rutas de assets y componentes que V4.
- `index.html`: edición de hero copy, Protea, Quiénes somos, Qué hacemos, IAO, Conferencias, Actualidad, Experiencia y Conversemos. No sustituir nombres, marcas, testimonios ni métricas sin evidencia.
- `v41.css`: estilos de detalles accesibles, leyendas concisas, y referencias en carrusel CSS de desplazamiento horizontal.
- `comparar.html`: matriz visible de permanencias, reducciones y recursos pendientes.
- Página raíz: V4 y V4.1 bajo **una misma tarjeta** en proceso.
- Sin cambios de motor, JS, imágenes, paleta, fuentes, canvas o preloader.

## Conteos
- Texto visible aprox. V4: 2955 palabras; V4.1: 1696 palabras (−43 %; incluye etiquetas del formulario, navegación y pie).
- 7 áreas principales, 8 IDs de sección contando `colapso`, 6 perfiles, 4 etapas, 5 atributos IAO, 6 propuestas de conferencia.
- Los seis párrafos de tipo cita en el equipo, carentes de atribución externa verificable, se quitan de V4.1 sin borrar la fuente V4.
- Actualidad permanece como esquema editorial; no se simula una colección Squarespace ni un backend de formulario.

## Riesgos
- Visual QA pendiente con navegador real; validar carrusel CSS e interacciones con UIkit.
- Testimonios existentes en conferencias requieren confirmar selección 2,4,5,7 y autorizaciones.
- Foto «Cyborg» de Marcelo, imagen de evento, gráfico IAO, logos y brochure siguen pendientes.
- Formulario NO envía: requiere implementación en Squarespace Core y pruebas de recepción.
- V4.1 no debe marcarse APPROVED sin validación de dirección de arte.

## Actualización 2026-11-13 · Fotografía Constanza
- Solo V4.1: el segundo perfil usa `assets/img/client/constanza-tratamiento-v41-20261113.jpg`.
- Imagen suministrada por Nicolás (`coni2.png`), transferida al repositorio con codificación JPEG de alta calidad; sin generación de contenido ni cambio de composición.
- Clase `.v41-constanza-card` evita doble cromatización y doble capa gráfica en la fotografía ya intervenida.
- No se cambia V4 ni el resto de los perfiles.

## Revisión de fotografía y navegación (2026-11-13)
- El retrato de Constanza en V4.1 cambia a `assets/img/client/constanza-tratamiento-v41-20261113-v2.jpg` (segunda fotografía `coni3.png` suministrada por Nicolás; JPEG de alta calidad generado por el transporte de activos, no copia bit a bit del PNG). La fotografía anterior continúa como recurso histórico no utilizado.
- `v4.js`: el rail navega a la cabecera/etiqueta visible, no al inicio del bloque con padding; compensación de cabecera móvil. El scroll spy toma como referencia una banda superior de lectura.
- `v41.css`: se reducen los paddings exteriores e interiores de las secciones, y la separación del contacto; se actualizan scroll margins para saltos nativos y subetapas.
- No se modifica V4, los otros cinco perfiles, el hero ni el motor Protea Viva.
- Pendiente: comprobar visualmente la posición del contenido y el scroll en móvil/escritorio (390, 768, 1024, 1440 px), y corregir según resultados.

## Revisión 2026-11-13 · Instrumentos, retícula y navegación contextual

**Alcance:** solo `protea_vivo/v4.1/` (REVIEW). No modifica V4.

- Retícula de las secciones del cuerpo: **1/5 figura/marcador + 4/5 contenido** en escritorio. El motor local de Protea Viva calcula en cada redimensionamiento el centro del primer quinto de la grilla; no modifica parámetros del hero. Móvil mantiene lectura apilada y canvas actual.
- Cuatro ilustraciones suministradas, asociadas secuencialmente a Comprender (002), Entrenar (003), Experimentar (004) y Sostener (005). Se insertan sin máscara ni recorte intencional, con dos filetes naranjas (exterior punteado e interior continuo) separados por aire.
- Secciones con subnavegación: Protea (Qué es Protea, Conoce al equipo), Qué hacemos (cuatro etapas), IAO (atributos y método), Conferencias (otras conferencias, formatos, referencias). Las otras tres mantienen acceso simple.
- Rail en escritorio: apertura contextual a la derecha mediante hover/foco, desplazamiento de la tarjeta principal; al seleccionar un destino, permanece desplegado durante ocho segundos y vuelve a reposo. `Escape` cierra.
- Menú móvil: desplegables verticales controlados con botón independiente y `aria-expanded`. Los enlaces navegan después de cerrar el offcanvas.
- Un solo controlador de scroll para rail, subniveles, botones del contenido, subnav DIAGNOS/Training/Lab/Hub y footer. Mantiene `location.search`, hash e interpretación de `prefers-reduced-motion`.
- Nuevos anclajes: `#equipo`, `#atributos-iao`, `#metodo-iao`, `#formatos-conferencias`, `#referencias-conferencias`.
- QA estructural de anclajes, referencias y sintaxis JavaScript; **pendiente** validación visual en navegador real, especialmente z-index del rail, anclaje móvil, comportamiento del temporizador y centrado del organismo en 960/1440/1920 px.


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
