# PROTEA_v08_REVIEW

Fecha: 2026-09-06. Construcción: `protea_vivo/`. Baseline anterior aprobada: `PROTEA_v03_APPROVED`, fijada en `00_BASELINE/PROTEA_v03_APPROVED.md`.

## Implementado

- Home de cinco bloques; menú de cinco destinos conservando el sistema visual.
- Barra lateral exterior a la retícula. Primer tercio del cuerpo reservado y contenido continuo en los dos tercios derechos. Apilado móvil con margen interior.
- Hero original con texto del informe, salto al recorrido y ajuste tipográfico exclusivamente local para evitar líneas huérfanas.
- Nuestra mirada con cuatro afirmaciones progresivas.
- Recorrido continuo Comprender → Entrenar → Arraigar → Sostener, con DIAGNOS/IAO y visualización real.
- Adaptive Thinking independiente: tres formatos, tesis, libro secundario, perfil, evidencia y contratación.
- Landing IAO y seis perfiles reales de equipo con mosaico y detalles.
- Formularios distintos para Protea, IAO y Marcelo. El formato se preselecciona desde cada CTA de Marcelo.
- Contacto Protea progresivo en cuatro momentos: situación, organización, contacto y revisión literal. No diagnostica, clasifica ni recomienda servicios.
- Fondo azul Protea aplicado desde Nuestra mirada hasta el cierre del cuerpo.
- Componente `Protea Vive v16` integrado como fondo progresivo del primer tercio reservado, sin invadir los dos tercios de contenido.
- Progreso del organismo vinculado al recorrido del cuerpo; cuatro texturas válidas reutilizadas y activo vacío excluido.
- En móvil se conserva el apilado sin reservar el tercio; Protea viva ocupa el viewport completo como plano de fondo detrás del contenido.
- Corrección `CHANGE-006`: la escena vuelve a calcularse a ancho de viewport de la retícula y se recorta al primer tercio; ya no se comprime el sistema de coordenadas dentro de esa columna.
- Corrección `CHANGE-007`: el equipo conserva el grid de tres columnas en escritorio y funciona como carrusel táctil nativo en móvil, sin duplicar perfiles ni añadir dependencias.
- Corrección `CHANGE-008`: se retiró la regla que ocultaba Protea viva bajo 960 px y se activó su composición móvil de viewport completo, sin recorte lateral.
- Corrección `CHANGE-009`: el centro móvil de Protea viva se desplaza al 75 % del viewport para despejar la zona izquierda de lectura.
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
| P06 | Aprobación visual explícita de `PROTEA_v08_REVIEW` | Construcción completa | Nueva baseline APPROVED; no inferirla del permiso para hacer commit |

Los formularios están maquetados y validan campos obligatorios, pero NO envían. La interfaz lo declara y nunca muestra una confirmación falsa. No se guardan datos personales en almacenamiento local. No se publicaron precios ni métricas ficticias.
