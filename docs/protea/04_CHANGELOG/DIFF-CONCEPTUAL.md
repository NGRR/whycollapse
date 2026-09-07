# Diff conceptual · PROTEA_v09_REVIEW

| Archivos | Componentes | Antes → Después | Efectos / límites |
| --- | --- | --- | --- |
| `protea_vivo/index.html` | Menú, rail, copy hero, cuerpo | Conceptos dispersos + test → cinco bloques y conversación directa | Orden y enlaces autorizados; estilo del rail preservado |
| `assets/css/protea-consolidacion.css` | `.consolidation-grid`, `.consolidation-content`, `.adaptive-step`, `.team-mosaic`, `.protea-contact-form` | Contenido previo → reserva 1/3 y contenido 2/3, recorrido continuo, equipo y formularios | Estilos acotados, no cambian variables globales |
| mismo CSS | `.protea-review .hero-title`, CTA del hero | Copy corto → copy largo con encaje local | Excepción de tamaño local documentada; canvas, familias y pesos intactos |
| `assets/js/protea-sections.js` | Navegación, aparición progresiva, CTA de formato | Señales y debrief automático → rail sincronizado, copy progresivo y selección de formato | Sin diagnóstico automático ni persistencia de datos |
| `adaptive-thinking/index.html` | Landing Marcelo | No existía → formatos, tesis, evidencia y contratación separada | Sin canal de envío configurado |
| `iao/index.html` | Landing IAO | Página conceptual anterior → material real y Plan Adaptativo | Información complementaria pendiente del cliente |
| `pages/iao.html`, `contacto.html`, `debrief.html`, `adaptive-thinking.html` | Entradas históricas | Rutas antiguas → rutas nuevas por redirección HTML | Conservan entrada directa sin reactivar el test |
| Otras páginas existentes en `pages/` | Navegación superior y anclas afectadas | Menú antiguo → navegación consolidada | Cuerpo de esas páginas no reinterpretado |
| `assets/img/client/` | Imágenes reales | Sin evidencia suficiente → Word y perfiles oficiales | Sin generación de imágenes ni alteración de los píxeles |
| `index.html` raíz | `a.featured` | `protea_vivov2/` → `protea_vivo/` | Fuera del botón, índice idéntico |
| `protea_vivo/index.html` | `#contacto-final [data-contact-form="protea"]` | Cuatro campos simultáneos → situación, organización, contacto y revisión progresiva | Misma información; sin test, clasificación ni recomendación |
| `assets/css/protea-consolidacion.css` | `.contact-progress`, `.contact-step`, `.contact-review` | Formulario plano → ritmo por etapas usando tokens existentes | Sin variables, componentes ni breakpoints nuevos |
| `assets/js/protea-sections.js` | `[data-progressive-contact]` | Envío directo inerte → avance, retroceso, validación y resumen literal | No persiste datos ni simula envío; Marcelo queda separado |
| `index.html` raíz | `a.featured` | `PROTEA_v02_REVIEW` → `PROTEA_v03_REVIEW` | Conserva destino `./protea_vivo/` |
| `protea_vivo/index.html` | `#protea-viva-canvas` | Primer tercio reservado vacío → plano animado de fondo | Se inserta después del hero; contenido y retícula no se mueven |
| `assets/css/protea-consolidacion.css` | `.protea-viva-background`, `.consolidation-section` | Cuerpo claro → azul Protea con contraste blanco/naranja | Canvas limitado al primer tercio; oculto bajo 960px |
| `assets/js/protea-viva-config.js`, `protea-viva-background.js` | Secuencia `Protea Vive v16` | Prototipo autónomo → progreso 0–100 % acotado al cuerpo | Sin editor, sin dependencia nueva y pausado fuera del recorrido visible |
| `assets/img/protea-viva/` | Capas de crecimiento | Activos sólo en prototipo → cuatro texturas válidas en Home | `stage-09-mature.webp` se excluye porque está vacío |
| `index.html` raíz | `a.featured` | `PROTEA_v03_REVIEW` → `PROTEA_v04_REVIEW` | Conserva destino `./protea_vivo/` |
| `assets/css/protea-consolidacion.css` | `.protea-viva-background` | Canvas reducido al tercio → escena completa recortada con `clip-path` | Ocupa el viewport fijo; sólo queda visible el primer tercio |
| `assets/js/protea-viva-background.js` | `resize()` | Ancho de canvas = 1/3 → ancho de la retícula completa | Restaura las coordenadas originales del componente |
| `assets/js/protea-viva-config.js` | Configuración desktop | Figura centrada en el tercio → centro X 0,235 y altura 0,96 | Equivalente al ejemplo `prototipos/protea_vive/` |
| `index.html` raíz | `a.featured` | `PROTEA_v04_REVIEW` → `PROTEA_v05_REVIEW` | Conserva destino `./protea_vivo/` |
| `AGENTS.md`, `docs/protea/` | Gobierno del proyecto | Reglas conversacionales → manifiesto y órdenes persistentes | Versión REVIEW, pendiente de aprobación visual |
| `package.json`, `tools/preview.mjs` | Revisión visual local | Sin servidor compatible → servidor estático usando Node integrado | Cero dependencias añadidas a la web |
| `assets/css/protea-consolidacion.css` | `.consolidation-grid`, `.consolidation-content` | Retícula 1/3–2/3 → retícula 1/4–3/4 | Rail exterior y breakpoint móvil intactos |
| mismo CSS | `.protea-viva-background` | Recorte al primer tercio → primer cuarto; altura exacta → 10 px extra arriba y abajo | En móvil conserva viewport completo sin recorte |
| `assets/js/protea-viva-config.js` | `centerXDesktop` | 0,235 → 0,13 | Organismo desplazado al cuarto izquierdo; parámetros móviles intactos |
| `assets/css/protea-consolidacion.css` | `.journey-photo`, `.thinking-photo`, `.iao-report` | Imágenes planas → integración azul, trama, acento naranja y cortes técnicos | Sólo CSS; píxeles fuente y contenido intactos |
| mismo CSS | `.team-person`, `.team-mosaic` | Retratos blancos sin módulo → tarjetas tecnológicas e interacción visual | Grid desktop preservado; carrusel móvil ajustado para mostrar tarjetas completas |
| `index.html` raíz | `a.featured` | `PROTEA_v08_REVIEW` → `PROTEA_v09_REVIEW` | Conserva destino `./protea_vivo/` |

## Protegido y verificado

Sin cambios por `CHANGE-005`: `assets/css/protea.css`, `assets/css/protea-live.css`, `assets/js/protea.js` y `components/hero/**`. El hero se conserva exactamente en el estado manual de GitHub `fa24f7c6`; su fragmento HTML mantiene la misma huella SHA-256. Assets preexistentes intactos. Mismos breakpoints 640/960px. Ninguna modificación en `protea/`, `protea_vivov2/`, `webProtea/`, `0001/`, `0002/`, `0003/` o `prototipos/`.

El resto del índice central se conserva byte-equivalente al reemplazar sólo el fragmento `a.featured`. Los archivos nuevos de metadatos de Sites sirven a la copia privada de revisión; el código también se guarda en GitHub por solicitud explícita.

## Ajuste de empaquetado

El empaquetador de la copia privada exige `dist/` como raíz estática. `tools/build-static.mjs` copia los archivos de `protea_vivo/` sin modificarlos; `dist/` se excluye de Git. Este ajuste no modifica la web ni el botón central.
