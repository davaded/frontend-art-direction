const fonts = { Newsreader: { min: 200, max: 800 }, Sora: { min: 100, max: 800 }, "Space Mono": { min: 400, max: 400 } };
const palettes = { mint: { foreground: "#263b31", background: "#e8f4de" }, ink: { foreground: "#f3f2e9", background: "#29272a" }, rose: { foreground: "#562941", background: "#f7dfe8" }, paper: { foreground: "#353127", background: "#ffedbd" } };
const samples = { study: "A little\nless ordinary.", alphabet: "Aa Bb Cc\nDd Ee Ff", numbers: "01234\n56789" };
const initial = { font: "Sora", text: "Make it\nyours.", weight: 500, size: 96, leading: 1.05, align: "center", fit: true, ...palettes.rose };
let state = { ...initial };
let fittedSize = state.size;
let studies = [];
let undo = [];
let redo = [];
let statusTimer;
const editing = new Set();
const artboard = document.querySelector("#artboard");
const artwork = document.querySelector("#artboard-content");
const specimen = document.querySelector("#specimen");
const measure = document.createElement("canvas").getContext("2d");
const wordSegments = new Intl.Segmenter(undefined, { granularity: "word" });
const glyphSegments = new Intl.Segmenter(undefined, { granularity: "grapheme" });
function typeLayout(value) {
  const atSize = size => {
    measure.font = `${value.weight} ${size}px "${value.font}", sans-serif`;
    if (!value.fit) return { size, lines: (value.text || " ").split("\n") };
    const lines = [];
    for (const paragraph of (value.text || " ").split("\n")) {
      let line = "";
      for (const { segment } of wordSegments.segment(paragraph)) {
        if (measure.measureText(line + segment).width <= 480) { line += segment; continue; }
        if (line.trim()) { lines.push(line.trimEnd()); line = ""; }
        if (!segment.trim()) continue;
        for (const { segment: glyph } of glyphSegments.segment(segment)) {
          if (line && measure.measureText(line + glyph).width > 480) { lines.push(line); line = ""; }
          line += glyph;
        }
      }
      lines.push(line.trimEnd());
    }
    return { size, lines };
  };
  if (!value.fit) return atSize(value.size);
  const requested = atSize(value.size);
  if (requested.lines.length * value.size * value.leading <= 460) return requested;
  let low = 1;
  let high = value.size;
  for (let i = 0; i < 12; i++) {
    const size = (low + high) / 2;
    const layout = atSize(size);
    if (layout.lines.length * size * value.leading <= 460) low = size;
    else high = size;
  }
  return atSize(Math.floor(low * 10) / 10);
}
function notify(message) { clearTimeout(statusTimer); document.querySelector("#status").textContent = message; statusTimer = setTimeout(() => { document.querySelector("#status").textContent = ""; }, 4000); }
function validStudy(value) { const s = value?.state; return typeof value?.id === "string" && typeof value?.name === "string" && s && fonts[s.font] && typeof s.text === "string" && s.text.length <= 400 && [s.weight, s.size, s.leading].every(Number.isFinite) && s.size >= 24 && s.size <= 180 && s.weight >= fonts[s.font].min && s.weight <= fonts[s.font].max && s.leading >= .85 && s.leading <= 1.6 && ["left", "center", "right"].includes(s.align) && typeof s.fit === "boolean" && /^#[\da-f]{6}$/i.test(s.foreground) && /^#[\da-f]{6}$/i.test(s.background); }
try { const saved = JSON.parse(localStorage.getItem("type-lab-studies") || "[]"); if (Array.isArray(saved)) studies = saved.filter(validStudy).slice(0, 30); } catch {}
function commit(next) { undo.push({ ...state }); if (undo.length > 40) undo.shift(); redo = []; state = { ...state, ...next }; render(); }
function luminosity(color) { const channels = color.match(/[\da-f]{2}/gi).map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4); return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722; }
function renderArtwork() {
  artwork.style.transform = `scale(${artboard.clientWidth / 600})`;
  artwork.style.color = state.foreground;
  artboard.style.backgroundColor = state.background;
  const layout = typeLayout(state);
  fittedSize = layout.size;
  specimen.style.fontFamily = `"${state.font}", sans-serif`;
  specimen.style.fontSize = `${fittedSize}px`;
  specimen.style.fontWeight = state.weight;
  specimen.style.lineHeight = state.leading;
  specimen.style.textAlign = state.align;
  specimen.textContent = layout.lines.join("\n");
  artboard.setAttribute("aria-label", `${state.font} artwork: ${state.text || "empty specimen"}`);
  document.querySelector("#artwork-family").textContent = `${state.font.toUpperCase()} / ${state.weight}`;
  document.querySelector("#type-caption").textContent = `${state.font} / ${state.weight}`;
  document.querySelector("#actual-size").textContent = `${Math.round(fittedSize)} px`;
}
function render() {
  renderArtwork();
  document.querySelector("#copy").value = state.text;
  for (const key of ["size", "weight", "leading"]) { document.querySelector(`#${key}`).value = state[key]; document.querySelector(`#${key}-value`).value = key === "size" ? `${state[key]} px` : key === "leading" ? state[key].toFixed(2) : String(state[key]); }
  const weight = document.querySelector("#weight");
  weight.min = fonts[state.font].min;
  weight.max = fonts[state.font].max;
  weight.disabled = fonts[state.font].min === fonts[state.font].max;
  document.querySelector("#weight-min").textContent = String(fonts[state.font].min);
  document.querySelector("#weight-max").textContent = String(fonts[state.font].max);
  document.querySelector("#fit").checked = state.fit;
  for (const key of ["foreground", "background"]) { document.querySelector(`#${key}`).value = state[key]; document.querySelector(`#${key}-value`).value = state[key].toUpperCase(); }
  document.querySelectorAll("[data-font]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.font === state.font)));
  document.querySelectorAll("[data-align]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.align === state.align)));
  document.querySelectorAll("[data-palette]").forEach(button => { const palette = palettes[button.dataset.palette]; button.setAttribute("aria-pressed", String(palette.foreground === state.foreground && palette.background === state.background)); });
  document.querySelector("#character-count").value = `${state.text.length} characters`;
  document.querySelector("#sample").value = Object.keys(samples).find(key => samples[key] === state.text) || "custom";
  document.querySelector("#undo").disabled = !undo.length;
  document.querySelector("#redo").disabled = !redo.length;
  const values = [luminosity(state.foreground), luminosity(state.background)].sort((a, b) => b - a);
  const ratio = (values[0] + .05) / (values[1] + .05);
  document.querySelector("#contrast").textContent = `Contrast ${ratio.toFixed(1)}:1`;
  document.querySelector("#edit-status").textContent = !state.text.trim() ? "Empty specimen" : ratio < 4.5 ? "Low contrast" : "Ready";
  document.querySelector("#export").disabled = !state.text.trim();
}
function renderStudies() {
  const container = document.querySelector("#studies");
  container.replaceChildren();
  studies.forEach(study => {
    const row = document.createElement("div"); row.className = "saved-study";
    const restore = document.createElement("button"); restore.type = "button"; restore.className = "restore-study";
    const name = document.createElement("strong"); name.textContent = study.name;
    const caption = document.createElement("small"); caption.textContent = `${study.state.font} / ${study.state.text.replaceAll("\n", " ")}`;
    restore.append(name, caption);
    restore.addEventListener("click", () => { commit(study.state); document.querySelector("#document-name").textContent = study.name; notify(`${study.name} restored`); });
    const remove = document.createElement("button"); remove.type = "button"; remove.className = "icon-button"; remove.setAttribute("aria-label", `Remove ${study.name}`); remove.title = `Remove ${study.name}`;
    const icon = document.createElement("i"); icon.dataset.lucide = "trash-2"; icon.setAttribute("aria-hidden", "true"); remove.append(icon);
    remove.addEventListener("click", () => { const next = studies.filter(item => item.id !== study.id); if (persist(next)) { studies = next; renderStudies(); notify(`${study.name} removed`); } });
    row.append(restore, remove); container.append(row);
  });
  document.querySelector("#saved-empty").hidden = studies.length > 0;
  document.querySelector("#study-count").textContent = String(studies.length).padStart(2, "0");
  lucide.createIcons();
}
function persist(values) { try { localStorage.setItem("type-lab-studies", JSON.stringify(values)); return true; } catch { notify("This study could not be saved."); return false; } }
const compactEditor = matchMedia("(max-width: 520px)");
const panelTabs = [...document.querySelectorAll(".mobile-panels [role=tab]")];
let activePanel = "property-panel";
function showPanels() {
  for (const tab of panelTabs) {
    const selected = tab.getAttribute("aria-controls") === activePanel;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    const panel = document.querySelector(`#${tab.getAttribute("aria-controls")}`);
    panel.hidden = compactEditor.matches && !selected;
    if (compactEditor.matches) { panel.setAttribute("role", "tabpanel"); panel.setAttribute("aria-labelledby", tab.id); }
    else { panel.removeAttribute("role"); panel.setAttribute("aria-labelledby", panel.id === "family-panel" ? "families-title" : "properties-title"); }
  }
}
panelTabs.forEach((tab, i) => {
  tab.addEventListener("click", () => { activePanel = tab.getAttribute("aria-controls"); showPanels(); });
  tab.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? panelTabs.length - 1 : (i + (event.key === "ArrowRight" ? 1 : -1) + panelTabs.length) % panelTabs.length;
    panelTabs[next].click(); panelTabs[next].focus();
  });
});
compactEditor.addEventListener("change", showPanels);
showPanels();
document.querySelectorAll("[data-font]").forEach(button => button.addEventListener("click", () => { const font = button.dataset.font; commit({ font, weight: Math.min(fonts[font].max, Math.max(fonts[font].min, state.weight)) }); }));
document.querySelectorAll("[data-align]").forEach(button => button.addEventListener("click", () => commit({ align: button.dataset.align })));
document.querySelectorAll("[data-palette]").forEach(button => button.addEventListener("click", () => commit(palettes[button.dataset.palette])));
for (const key of ["copy", "size", "weight", "leading", "foreground", "background"]) {
  const control = document.querySelector(`#${key}`);
  control.addEventListener("input", () => {
    if (!editing.has(key)) { undo.push({ ...state }); if (undo.length > 40) undo.shift(); redo = []; editing.add(key); }
    const property = key === "copy" ? "text" : key;
    state[property] = ["size", "weight", "leading"].includes(key) ? Number(control.value) : control.value;
    render();
  });
  control.addEventListener("change", () => editing.delete(key));
  control.addEventListener("blur", () => editing.delete(key));
}
document.querySelector("#fit").addEventListener("change", event => commit({ fit: event.target.checked }));
document.querySelector("#sample").addEventListener("change", event => { if (samples[event.target.value]) commit({ text: samples[event.target.value] }); });
document.querySelector("#undo").addEventListener("click", () => { if (!undo.length) return; redo.push({ ...state }); state = undo.pop(); editing.clear(); render(); });
document.querySelector("#redo").addEventListener("click", () => { if (!redo.length) return; undo.push({ ...state }); state = redo.pop(); editing.clear(); render(); });
document.querySelector("#reset").addEventListener("click", () => { commit(initial); document.querySelector("#document-name").textContent = "Untitled study"; notify("Study reset"); });
document.querySelector("#save").addEventListener("click", () => {
  if (studies.length >= 30) { notify("Saved studies are full. Remove a study before saving another."); return; }
  const number = studies.reduce((max, study) => Math.max(max, Number(study.name.replace("Study ", "")) || 0), 0) + 1;
  const study = { id: crypto.randomUUID(), name: `Study ${String(number).padStart(2, "0")}`, state: { ...state } };
  const next = [...studies, study];
  if (persist(next)) { studies = next; document.querySelector("#document-name").textContent = study.name; renderStudies(); notify(`${study.name} saved`); }
});
document.querySelector("#export").addEventListener("click", async () => {
  const button = document.querySelector("#export");
  const snapshot = { ...state };
  button.disabled = true;
  try {
    await document.fonts.load(`${snapshot.weight} ${snapshot.size}px "${snapshot.font}"`);
    const { size: exportSize, lines } = typeLayout(snapshot);
    const canvas = document.createElement("canvas"); canvas.width = 1200; canvas.height = 1500;
    const context = canvas.getContext("2d"); context.scale(2, 2);
    context.fillStyle = snapshot.background; context.fillRect(0, 0, 600, 750);
    context.fillStyle = snapshot.foreground; context.font = '10px "Sora"'; context.textAlign = "left"; context.fillText("A TYPE STUDY", 60, 58); context.textAlign = "right"; context.fillText("01", 540, 58);
    context.font = `${snapshot.weight} ${exportSize}px "${snapshot.font}", sans-serif`;
    context.textAlign = snapshot.align;
    const lineHeight = exportSize * snapshot.leading;
    const metrics = context.measureText("Ag"); const ascent = metrics.fontBoundingBoxAscent ?? exportSize * .8; const descent = metrics.fontBoundingBoxDescent ?? exportSize * .2;
    const baseline = (750 - lines.length * lineHeight) / 2 + (lineHeight - ascent - descent) / 2 + ascent;
    const x = snapshot.align === "center" ? 300 : snapshot.align === "right" ? 540 : 60;
    lines.forEach((line, index) => context.fillText(line, x, baseline + index * lineHeight));
    context.font = '8px "Sora"'; context.textAlign = "left"; context.fillText("TYPE / LAB", 60, 706); context.textAlign = "right"; context.fillText(`${snapshot.font.toUpperCase()} / ${snapshot.weight}`, 540, 706);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("No image produced");
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "type-lab-study.png"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("PNG exported");
  } catch { notify("The image could not be exported. Please try again."); }
  finally { render(); }
});
new ResizeObserver(renderArtwork).observe(artboard);
document.fonts.ready.then(render);
render();
renderStudies();
