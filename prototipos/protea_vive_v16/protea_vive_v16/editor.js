(() => {
  "use strict";

  const api = window.OrganicAnimator;
  if (!api) throw new Error("OrganicAnimator no está disponible.");

  const $ = (selector) => document.querySelector(selector);
  const groupsHost = $("#controlGroups");
  const jsonEditor = $("#jsonEditor");
  const statusNode = $("#editorStatus");
  const progressInput = $("#previewProgress");
  const progressOutput = $("#previewProgressOutput");
  const durationInput = $("#previewDuration");
  const loopInput = $("#previewLoop");
  const playButton = $("#playPreview");
  const stopButton = $("#stopPreview");
  const configurator = $("#configurator");
  const reopenButton = $("#reopenEditor");

  let config = api.getConfig();
  let playing = false;
  let playStartedAt = 0;
  let playStartProgress = 0;
  let rebuildTimer = 0;
  let jsonTimer = 0;

  const groups = [
    {
      title: "Composición y posición",
      open: true,
      controls: [
        range("centerXDesktop", "Centro X desktop", 0, 0.7, 0.005),
        range("centerYDesktop", "Centro Y desktop", 0.1, 0.9, 0.005),
        range("heightDesktop", "Altura desktop", 0.3, 1.4, 0.005),
        range("centerXMobile", "Centro X móvil", 0, 1, 0.005),
        range("centerYMobile", "Centro Y móvil", 0.1, 0.9, 0.005),
        range("heightMobile", "Altura móvil", 0.3, 1.3, 0.005),
        range("maxDpr", "DPR máximo", 0.75, 3, 0.05, { resize: true })
      ]
    },
    {
      title: "Movimiento y respuesta",
      open: true,
      controls: [
        range("scrollSmoothing", "Suavizado de scroll", 0.005, 0.3, 0.005),
        range("pointerSmoothing", "Suavizado de puntero", 0.005, 0.3, 0.005),
        range("strandIdleTurnsPerMinute", "Giro idle strands", 0, 1, 0.005),
        range("strandScrollTurns", "Giro por scroll", 0, 2, 0.01),
        range("orbitalTurnsPerMinute", "Giro orbital", 0, 3, 0.01)
      ]
    },
    {
      title: "Generación procedural",
      open: false,
      controls: [
        number("seed", "Semilla", 1, 4294967295, 1, { rebuild: true }),
        range("strandCountDesktop", "Cantidad strands desktop", 8, 160, 1, { rebuild: true }),
        range("strandCountMobile", "Cantidad strands móvil", 6, 100, 1, { rebuild: true }),
        range("strandStepsDesktop", "Resolución strands desktop", 24, 240, 1, { rebuild: true }),
        range("strandStepsMobile", "Resolución strands móvil", 20, 160, 1, { rebuild: true }),
        range("initialRootStage", "Raíz visible al inicio", 0, 1, 0.01)
      ],
      extraButton: { id: "newSeed", label: "Nueva semilla" }
    },
    {
      title: "Visibilidad de sistemas",
      open: false,
      controls: [
        toggle("showGrowthLayers", "Frames intermedios"),
        toggle("showRoots", "Raíces"),
        toggle("showStrands", "Strands"),
        toggle("showPetals", "Pétalos procedurales"),
        toggle("showPod", "Cápsula porosa"),
        toggle("showClusters", "Núcleos celulares"),
        toggle("showOrbits", "Órbitas y nodos"),
        toggle("showFinalTexture", "Imagen final")
      ]
    },
    {
      title: "Balance de vectores",
      open: true,
      controls: [
        range("rootAlpha", "Raíces", 0, 1.5, 0.01),
        range("orbitBackAlpha", "Órbitas detrás", 0, 1.5, 0.01),
        range("strandBackAlpha", "Strands detrás", 0, 1.5, 0.01),
        range("petalBackAlpha", "Pétalos detrás", 0, 1.5, 0.01),
        range("podAlpha", "Cápsula", 0, 1.5, 0.01),
        range("clusterAlpha", "Núcleos", 0, 1.5, 0.01),
        range("strandFrontBaseAlpha", "Strands frontales base", 0, 1.5, 0.01),
        range("petalFrontBaseAlpha", "Pétalos frontales base", 0, 1.5, 0.01),
        range("orbitFrontBaseAlpha", "Órbitas frontales base", 0, 1.5, 0.01),
        range("accentStrandAlpha", "Strands hero finales", 0, 1.5, 0.01),
        range("accentOrbitalAlpha", "Orbitales finales", 0, 1.5, 0.01)
      ]
    },
    {
      title: "Imagen final",
      open: true,
      controls: [
        text("finalTexturePath", "Archivo final", { reloadTextures: true }),
        range("finalTextureStart", "Inicio de entrada", 0, 1, 0.005),
        range("finalTextureFull", "Asentamiento completo", 0, 1, 0.005),
        range("finalTextureScale", "Escala", 0.5, 1.5, 0.005),
        range("finalTextureYOffset", "Desplazamiento Y", -0.4, 0.4, 0.005),
        range("finalTextureBreathing", "Respiración", 0, 0.02, 0.0001),
        range("finalBaseAlpha", "Opacidad base", 0, 1.5, 0.01),
        range("finalFrontAlpha", "Capas frontales", 0, 1, 0.01),
        range("finalBackLowerAlpha", "Capa inferior", 0, 1, 0.01),
        range("finalBackMiddleAlpha", "Capa media", 0, 1, 0.01),
        range("finalBackUpperAlpha", "Capa superior", 0, 1, 0.01)
      ]
    }
  ];

  function range(field, label, min, max, step, options = {}) {
    return { type: "range", field, label, min, max, step, ...options };
  }

  function number(field, label, min, max, step, options = {}) {
    return { type: "number", field, label, min, max, step, ...options };
  }

  function toggle(field, label, options = {}) {
    return { type: "toggle", field, label, ...options };
  }

  function text(field, label, options = {}) {
    return { type: "text", field, label, ...options };
  }

  function setStatus(message, error = false) {
    statusNode.textContent = message;
    statusNode.style.color = error ? "#ff9a8d" : "";
  }

  function scheduleJsonUpdate() {
    clearTimeout(jsonTimer);
    jsonTimer = setTimeout(() => {
      jsonEditor.value = JSON.stringify(config, null, 2);
    }, 80);
  }

  function scheduleRebuild() {
    clearTimeout(rebuildTimer);
    rebuildTimer = setTimeout(() => api.rebuild(), 120);
  }

  function normalizeValue(control, raw) {
    if (control.type === "toggle") return Boolean(raw);
    if (control.type === "text") return String(raw);
    const numberValue = Number(raw);
    if (!Number.isFinite(numberValue)) return Number(config[control.field]) || 0;
    return Math.min(control.max, Math.max(control.min, numberValue));
  }

  async function applyScalar(control, raw) {
    const value = normalizeValue(control, raw);
    config[control.field] = value;
    await api.setConfig({ [control.field]: value }, {
      reloadTextures: Boolean(control.reloadTextures)
    });
    if (control.rebuild) scheduleRebuild();
    if (control.resize) api.resize();
    scheduleJsonUpdate();
    setStatus("Modificado");
  }

  function createControl(control) {
    const row = document.createElement("div");
    row.className = `control-row control-row--${control.type}`;

    if (control.type === "toggle") {
      const label = document.createElement("label");
      label.textContent = control.label;
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = Boolean(config[control.field]);
      input.addEventListener("change", () => applyScalar(control, input.checked));
      row.append(label, input);
      return row;
    }

    if (control.type === "text") {
      const label = document.createElement("label");
      label.textContent = control.label;
      const input = document.createElement("input");
      input.type = "text";
      input.value = config[control.field] ?? "";
      input.addEventListener("change", () => applyScalar(control, input.value));
      row.append(label, input);
      return row;
    }

    const label = document.createElement("span");
    label.className = "control-row__label";
    label.textContent = control.label;

    if (control.type === "number") {
      const input = document.createElement("input");
      input.type = "number";
      input.min = control.min;
      input.max = control.max;
      input.step = control.step;
      input.value = config[control.field];
      input.addEventListener("change", () => applyScalar(control, input.value));
      row.append(label, input);
      return row;
    }

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = control.min;
    slider.max = control.max;
    slider.step = control.step;
    slider.value = config[control.field];

    const numeric = document.createElement("input");
    numeric.type = "number";
    numeric.min = control.min;
    numeric.max = control.max;
    numeric.step = control.step;
    numeric.value = config[control.field];

    slider.addEventListener("input", () => {
      numeric.value = slider.value;
      applyScalar(control, slider.value);
    });
    numeric.addEventListener("change", () => {
      slider.value = numeric.value;
      applyScalar(control, numeric.value);
    });

    row.append(label, slider, numeric);
    return row;
  }

  function createGrowthLayersGroup() {
    const details = document.createElement("details");
    details.className = "control-group";
    details.open = true;
    const summary = document.createElement("summary");
    summary.textContent = "Frames intermedios";
    const body = document.createElement("div");
    body.className = "control-group__body";

    config.growthLayers.forEach((layer, index) => {
      const card = document.createElement("div");
      card.className = "layer-card";
      const title = document.createElement("div");
      title.className = "layer-card__title";
      title.innerHTML = `<span>Capa ${index + 1}</span><span>${layer.kind || "layer"}</span>`;
      const grid = document.createElement("div");
      grid.className = "layer-card__grid";

      const definitions = [
        ["path", "Archivo", "text", null, null, null],
        ["start", "Inicio", "number", 0, 1, 0.005],
        ["peak", "Pico", "number", 0, 1, 0.005],
        ["end", "Salida", "number", 0, 1, 0.005],
        ["opacity", "Opacidad", "number", 0, 1, 0.01],
        ["scale", "Escala", "number", 0.5, 1.5, 0.005],
        ["yOffset", "Offset Y", "number", -0.4, 0.4, 0.005],
        ["drift", "Deriva", "number", 0, 12, 0.1]
      ];

      definitions.forEach(([key, labelText, type, min, max, step]) => {
        const label = document.createElement("label");
        label.textContent = labelText;
        const input = document.createElement("input");
        input.type = type;
        if (type === "number") {
          input.min = min;
          input.max = max;
          input.step = step;
        }
        input.value = layer[key] ?? "";
        const eventName = key === "path" ? "change" : "input";
        input.addEventListener(eventName, async () => {
          const value = type === "number" ? Number(input.value) : input.value;
          config.growthLayers[index][key] = value;
          await api.setConfig({ growthLayers: config.growthLayers }, { reloadTextures: key === "path" });
          scheduleJsonUpdate();
          setStatus(`Capa ${index + 1} modificada`);
        });
        label.append(input);
        grid.append(label);
      });

      card.append(title, grid);
      body.append(card);
    });

    details.append(summary, body);
    return details;
  }

  function renderControls() {
    groupsHost.innerHTML = "";
    groups.forEach((group) => {
      const details = document.createElement("details");
      details.className = "control-group";
      details.open = Boolean(group.open);
      const summary = document.createElement("summary");
      summary.textContent = group.title;
      const body = document.createElement("div");
      body.className = "control-group__body";
      group.controls.forEach((control) => body.append(createControl(control)));
      if (group.extraButton) {
        const button = document.createElement("button");
        button.type = "button";
        button.id = group.extraButton.id;
        button.textContent = group.extraButton.label;
        button.addEventListener("click", async () => {
          const nextSeed = Math.floor(Math.random() * 4294967294) + 1;
          config.seed = nextSeed;
          await api.setConfig({ seed: nextSeed });
          api.rebuild();
          renderControls();
          scheduleJsonUpdate();
          setStatus("Nueva semilla aplicada");
        });
        body.append(button);
      }
      details.append(summary, body);
      groupsHost.append(details);
    });
    groupsHost.append(createGrowthLayersGroup());
  }

  function setPreviewProgress(value, updateInput = true) {
    const clamped = Math.min(1, Math.max(0, Number(value) || 0));
    api.setProgress(clamped);
    if (updateInput) progressInput.value = String(clamped);
    progressOutput.value = clamped.toFixed(3);
  }

  function stopPlayback(reset = false) {
    playing = false;
    playButton.textContent = "Reproducir";
    if (reset) setPreviewProgress(0);
  }

  function playTick(now) {
    if (!playing) return;
    const duration = Math.max(2, Number(durationInput.value) || 20) * 1000;
    let next = playStartProgress + (now - playStartedAt) / duration;
    if (next >= 1) {
      if (loopInput.checked) {
        next %= 1;
        playStartedAt = now;
        playStartProgress = next;
      } else {
        next = 1;
        stopPlayback(false);
      }
    }
    setPreviewProgress(next);
    if (playing) requestAnimationFrame(playTick);
  }

  function startPlayback() {
    if (playing) {
      stopPlayback(false);
      return;
    }
    playing = true;
    playButton.textContent = "Pausar";
    playStartProgress = Number(progressInput.value) || 0;
    if (playStartProgress >= 1) playStartProgress = 0;
    playStartedAt = performance.now();
    requestAnimationFrame(playTick);
  }

  function syncTimelineFromConfig() {
    durationInput.value = config.previewDurationSeconds ?? 20;
    loopInput.checked = config.previewLoop !== false;
  }

  async function replaceAll(nextConfig, persist = false) {
    stopPlayback(false);
    config = await api.replaceConfig(nextConfig, { persist });
    syncTimelineFromConfig();
    renderControls();
    jsonEditor.value = JSON.stringify(config, null, 2);
    setStatus(persist ? "JSON aplicado y guardado" : "JSON aplicado");
  }

  function downloadConfig() {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "organic-animation-config-v9.json";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus("JSON descargado");
  }

  async function copyConfig() {
    const text = JSON.stringify(config, null, 2);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      jsonEditor.select();
      document.execCommand("copy");
    }
    setStatus("JSON copiado");
  }

  progressInput.addEventListener("input", () => {
    stopPlayback(false);
    setPreviewProgress(progressInput.value, false);
  });

  durationInput.addEventListener("change", async () => {
    config.previewDurationSeconds = Math.max(2, Number(durationInput.value) || 20);
    await api.setConfig({ previewDurationSeconds: config.previewDurationSeconds });
    scheduleJsonUpdate();
  });

  loopInput.addEventListener("change", async () => {
    config.previewLoop = loopInput.checked;
    await api.setConfig({ previewLoop: config.previewLoop });
    scheduleJsonUpdate();
  });

  playButton.addEventListener("click", startPlayback);
  stopButton.addEventListener("click", () => stopPlayback(true));

  [0, 0.25, 0.5, 0.75, 1].forEach((point) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${Math.round(point * 100)}%`;
    button.addEventListener("click", () => {
      stopPlayback(false);
      setPreviewProgress(point);
    });
    $("#checkpoints").append(button);
  });

  $("#saveLocal").addEventListener("click", () => {
    api.persistConfig();
    setStatus("Configuración guardada en este navegador");
  });
  $("#copyJson").addEventListener("click", copyConfig);
  $("#downloadJson").addEventListener("click", downloadConfig);
  $("#resetConfig").addEventListener("click", async () => {
    localStorage.removeItem("organic-animation-config-v9");
    config = await api.resetConfig({ persist: false });
    syncTimelineFromConfig();
    renderControls();
    jsonEditor.value = JSON.stringify(config, null, 2);
    setStatus("Valores originales restaurados");
  });
  $("#applyJson").addEventListener("click", async () => {
    try {
      const parsed = JSON.parse(jsonEditor.value);
      await replaceAll(parsed, false);
    } catch (error) {
      setStatus(`JSON inválido: ${error.message}`, true);
    }
  });
  $("#importJson").addEventListener("change", async (event) => {
    const [file] = event.target.files;
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      await replaceAll(parsed, false);
    } catch (error) {
      setStatus(`No se pudo importar: ${error.message}`, true);
    }
    event.target.value = "";
  });

  $("#collapseEditor").addEventListener("click", () => {
    configurator.classList.add("is-collapsed");
    reopenButton.hidden = false;
  });
  reopenButton.addEventListener("click", () => {
    configurator.classList.remove("is-collapsed");
    reopenButton.hidden = true;
  });

  window.addEventListener("organic-config-change", (event) => {
    config = event.detail;
  });

  syncTimelineFromConfig();
  renderControls();
  jsonEditor.value = JSON.stringify(config, null, 2);
  setPreviewProgress(0);
})();
