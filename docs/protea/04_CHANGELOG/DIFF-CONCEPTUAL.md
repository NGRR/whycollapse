# Diff conceptual · PROTEA_v02_REVIEW

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
| `AGENTS.md`, `docs/protea/` | Gobierno del proyecto | Reglas conversacionales → manifiesto y órdenes persistentes | Versión REVIEW, pendiente de aprobación visual |
| `package.json`, `tools/preview.mjs` | Revisión visual local | Sin servidor compatible → servidor estático usando Node integrado | Cero dependencias añadidas a la web |

## Protegido y verificado

Sin cambios byte a byte: `assets/css/protea.css`, `assets/css/protea-live.css`, `assets/js/protea.js` y `components/hero/**`. Assets existentes intactos. Mismos breakpoints 640/960px. Ninguna modificación en `protea/`, `protea_vivov2/`, `webProtea/`, `0001/`, `0002/`, `0003/` o `prototipos/`.

El resto del índice central se conserva byte-equivalente al reemplazar sólo el fragmento `a.featured`. Los archivos nuevos de metadatos de Sites sirven a la copia privada de revisión; el código también se guarda en GitHub por solicitud explícita.

## Ajuste de empaquetado

El empaquetador de la copia privada exige `dist/` como raíz estática. `tools/build-static.mjs` copia los archivos de `protea_vivo/` sin modificarlos; `dist/` se excluye de Git. Este ajuste no modifica la web ni el botón central.
