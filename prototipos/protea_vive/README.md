# Organic Scroll Background — v11 Configurado

Paquete regenerado con el JSON más reciente.

Cambios principales respecto al preset anterior:

- `previewDurationSeconds`: 10
- `previewLoop`: false
- `strandBackAlpha`: 0.7
- `petalBackAlpha`: 1.03
- `strandFrontBaseAlpha`: 0.69
- `petalFrontBaseAlpha`: 0.19

## Archivos clave

- `index.html` — demo configurada.
- `editor.html` — editor visual cargado con esta configuración.
- `config.js` — configuración aplicada en runtime.
- `organic-animation-config.user.json` — JSON base entregado.
- `organic-animation-config.default.json` — sincronizado con el mismo estado.

## Uso

```bash
cd organic-scroll-bg-v11-configured
python -m http.server 8080
```

Abrir:

- `http://localhost:8080/index.html`
- `http://localhost:8080/editor.html`
