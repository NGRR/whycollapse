# GitHub — acceso operativo, commits y verificación (Protea)

**Referencia:** `GITHUB_CONECTOR_Y_COMMITS.md`  
**Fecha de comprobación:** 2026-11-13  
**Repositorio:** `NGRR/whycollapse` · <https://github.com/NGRR/whycollapse>  
**Rama habitual:** `main`  
**Sitio de revisiones:** <https://ngrr.github.io/whycollapse/>  
**Estado de esta fuente:** protocolo operativo; no aprobación visual ni editorial.

## Por qué existe este documento

En las conversaciones de Protea se ha trabajado y commiteado directamente en GitHub con el **conector de GitHub** disponible entre las herramientas de la sesión, aunque una terminal aislada no pueda acceder a `github.com` por DNS o red. Un fallo de `git ls-remote` en el contenedor **no demuestra** que GitHub carezca de acceso de lectura/escritura a través del conector.

Antes de afirmar que no se puede hacer un commit, descubrir y probar el conector GitHub disponible. El acceso no está garantizado en todas las sesiones: se confirma al leer el repositorio y, para escritura, al efectuar la operación autorizada.

## Acceso desde ChatGPT

- Orquestador: `functions.exec`. Descubrir herramientas disponibles con `ALL_TOOLS.filter(t => t.name.startsWith("mcp__GitHub__"))`.
- Lectura de archivos: `tools.mcp__GitHub__fetch_file({repository_full_name:"NGRR/whycollapse",path:"...",ref:"main"})`. Devuelve `result.content` (texto) y `result.sha` (blob SHA).
- Consulta de repositorio y estado: `tools.mcp__GitHub__fetch({url:"https://api.github.com/repos/NGRR/whycollapse/branches/main"})`; utilizar `result.content` como JSON.
- Actualización de un texto: `mcp__GitHub__update_file` con `path`, `content` completo, `sha` del archivo existente, `branch:"main"` y `message`. Escribir secuencialmente cuando se modifique el mismo archivo.
- Commit con varios archivos: `create_blob` por contenido; `create_tree` usando `base_tree_sha` del commit de `main`; `create_commit` con `parent_sha` del HEAD; `update_ref` con `branch_name:"main"`, `sha` del commit y `expected_sha` igual al HEAD inicial. Esta última comprobación evita sobrescribir cambios ajenos.
- Verificación: volver a leer `branches/main` y cada archivo con `fetch_file` / árbol Git, comparar SHAs, rutas, referencias de imagen y ausencia de cambios en versiones protegidas. Un commit creado sin actualizar el ref **no equivale** a publicación en `main`.

Las operaciones deben hacerse usando los esquemas reales de las herramientas disponibles en la sesión, sin suponer que sus nombres, privilegios o resultados serán idénticos en todas las ejecuciones.

## Activos binarios: atención a la integridad

GitHub admite un blob con `create_blob({repository_full_name,content:"<base64>",encoding:"base64"})` cuando la codificación contiene **los bytes del archivo original**. Para llevar esos bytes a la herramienta de escritura hace falta una fuente accesible en ese entorno.

Existe un procedimiento que **sí se ejecutó** con una imagen de la conversación: archivo enviado a Adobe mediante `asset_openai_file_upload` → vista de imagen mediante `asset_inline_preview` → campo `content_items[].data` en base64 → blob de GitHub `encoding:"base64"` → árbol/commit/ref. **Límite importante:** la vista previa devolvió `image/jpeg` recodificado, no los bytes originales del PNG. El fichero de GitHub se guardó por tanto como `.jpg`. No llamar a esto preservación binaria del original ni usarlo cuando sean imprescindibles transparencia, 300 ppp, fidelidad sin pérdidas o conservación pixel a pixel. Preferir una transferencia directa de los bytes originales cuando se disponga de ella; comprobar MIME real, tamaño y extensión antes de commitear.

No publicar presigned URLs temporales ni credenciales en el repositorio. Los enlaces públicos usados en HTML deben ser rutas de assets estables, no URLs de sesión.

## Estado verificable al crear esta referencia

- Último commit de contenido confirmado antes de esta documentación: `f50088a9a5cd2df59b341b03a7cc769416dd549c` (`fix(protea-v4.1): replace Constanza portrait with supplied processed photograph`).
- Ese commit incorporó `protea_vivo/v4.1/assets/img/client/constanza-tratamiento-v41-20261113.jpg` (128.711 bytes, blob SHA `7a5e7175b785bedba5c155fe5f3dfb02eb97eda5`) y la referencia en la tarjeta de Constanza de V4.1; V4 permaneció inalterada en esa revisión.
- **Pendiente sin commit en ese estado:** sustituirla por la segunda imagen entregada `coni3.png`, y corregir el anclaje/posición del scroll spy y, si las mediciones lo requieren, los espacios entre secciones. La respuesta en conversación que describió parches no implica que se hayan aplicado.
- La versión editable para estas correcciones es `protea_vivo/v4.1/`, no `protea_vivo/v4/`. Conservar V4 como comparación.

## Regla para próximas intervenciones

1. Leer `AGENTS.md`, `docs/protea/MANIFIESTO.md`, la baseline y la orden de cambio vigente.
2. Identificar el HEAD real de `main` y la versión/selector que pide Nicolás; jamás asumir estado desde una respuesta previa.
3. Aplicar solo los cambios autorizados. Para imágenes ya intervenidas, no duplicar filtros ni capas; conservar las otras tarjetas y los motores protegidos.
4. Verificar la referencia resultante y el ref `main`; indicar qué se probó mediante lectura de código y qué requiere revisión visual.
5. Responder con el enlace a la página y el **SHA real del commit**; no anunciar un commit que no se haya creado y publicado.

**Esta fuente es conocimiento operativo de Protea almacenado en Git.** Es recuperable directamente por ruta desde el conector, siempre que esté disponible en la sesión.
