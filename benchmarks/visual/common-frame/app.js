const films = {
  steel: { title:"Tears of Steel", type:"Live action + visual effects / 2012", runtimeMinutes:12, image:"assets/tears-of-steel.jpg", alt:"Thom and Celia speak on an Amsterdam bridge; Celia has a robotic hand.", screening:"Friday 06 November 2026 / 19:00", start:"20261106T190000", end:"20261106T200000", synopsis:"Set in Amsterdam, Tears of Steel brings live action and an imagined future into the same frame. The film was created by the Mango Open Movie project and released with open production materials.", discussion:"Look at the bridge scene. Which details keep the city familiar, and which make you believe in a different future?", source:"https://mango.blender.org/download/", credit:"Final-render image: (CC) Blender Foundation | mango.blender.org. CC BY 3.0." },
  sintel: { title:"Sintel", type:"Animation / 2010", runtimeMinutes:15, image:"assets/sintel.jpg", alt:"Sintel looks around a stone doorway in an official production image.", screening:"Friday 13 November 2026 / 19:00", start:"20261113T190000", end:"20261113T200000", synopsis:"Sintel follows a young traveller searching for a dragon she once helped. Produced by the Durian Open Movie project, the film and its production materials were released under an open license.", discussion:"When does a place feel like a lived-in world? Find one small material detail that tells you more than the landscape does.", source:"https://durian.blender.org/download/", credit:"Official production image: copyright Blender Foundation | durian.blender.org. CC BY 3.0." },
};
const storageKey = "common-frame-programme-v1";
const dialog = document.querySelector(".film-dialog");
const filters = [...document.querySelectorAll("[data-filter]")];
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
let saved = new Set();
let persistent = true;
let view = "all";
let activeFilm = null;
let returnTarget = null;
let closeTimer = null;
let openingFrame = null;
try {
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    const values = stored.length < 4096 ? JSON.parse(stored) : null;
    if (!Array.isArray(values)) throw new Error("Invalid programme");
    saved = new Set(values.filter((id) => Object.hasOwn(films, id)));
  }
} catch { persistent = false; }

function status(message) {
  const feedback = `${message}${persistent ? "" : `${message ? " " : ""}This plan is kept for this visit only.`}`;
  document.querySelector("[data-programme-status]").textContent = feedback;
  document.querySelector("[data-detail-status]").textContent = feedback;
}
function render() {
  document.querySelectorAll("[data-saved-count]").forEach((node) => { node.textContent = saved.size; });
  document.querySelector("[data-my-programme]").setAttribute("aria-label", `My programme, ${saved.size} saved screenings`);
  filters.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === view)));
  document.querySelectorAll("[data-screening]").forEach((row) => { row.hidden = view === "saved" && !saved.has(row.dataset.screening); });
  document.querySelectorAll("[data-save]").forEach((button) => {
    const selected = saved.has(button.dataset.save);
    const label = `${selected ? "Remove" : "Save"} ${films[button.dataset.save].title}`;
    button.setAttribute("aria-pressed", String(selected)); button.setAttribute("aria-label", label); button.title = label;
  });
  document.querySelector("[data-empty]").hidden = view !== "saved" || saved.size > 0;
  if (activeFilm) {
    const button = document.querySelector("[data-detail-save]");
    button.querySelector("span").textContent = saved.has(activeFilm) ? "Remove screening" : "Save screening";
    button.setAttribute("aria-pressed", String(saved.has(activeFilm)));
  }
}
function returnToProgramme() {
  document.querySelector(".programme-tools").scrollIntoView({ behavior:"instant", block:"start" });
  filters.find((button) => button.dataset.filter === view)?.focus({ preventScroll:true });
}
function toggleSave(id) {
  if (!Object.hasOwn(films, id)) return;
  saved.has(id) ? saved.delete(id) : saved.add(id);
  try { localStorage.setItem(storageKey, JSON.stringify([...saved])); persistent = true; } catch { persistent = false; }
  render();
  status(`${films[id].title} ${saved.has(id) ? "saved" : "removed"}.`);
  if (!activeFilm && view === "saved" && !saved.has(id)) returnToProgramme();
}
function selectView(next, scroll = false) {
  const leavingEmpty = document.querySelector("[data-empty]").contains(document.activeElement);
  view = next; render();
  status(next === "saved" ? `${saved.size} saved ${saved.size === 1 ? "screening" : "screenings"}.` : "Showing both November screenings.");
  if (scroll || leavingEmpty) returnToProgramme();
}
function openFilm(id, trigger) {
  if (!Object.hasOwn(films, id) || dialog.open) return;
  clearTimeout(closeTimer); cancelAnimationFrame(openingFrame);
  dialog.classList.remove("is-closing", "is-open"); activeFilm = id; returnTarget = trigger;
  const film = films[id];
  document.querySelector("#detail-title").textContent = film.title;
  document.querySelector("[data-detail-type]").textContent = `${film.type} / ${film.runtimeMinutes} min`;
  document.querySelector("[data-detail-synopsis]").textContent = film.synopsis;
  document.querySelector("#detail-screening").textContent = film.screening;
  document.querySelector("[data-detail-discussion]").textContent = film.discussion;
  document.querySelector("[data-detail-credit]").textContent = film.credit;
  document.querySelector("[data-detail-source]").href = film.source;
  const image = document.querySelector("[data-detail-image]");
  image.alt = film.alt; image.src = film.image;
  image.closest(".media-frame").removeAttribute("data-failed"); image.closest(".media-frame").querySelector(".media-feedback").hidden = true;
  document.querySelector("[data-detail-status]").textContent = persistent ? "" : "This plan is kept for this visit only."; render();
  dialog.showModal(); dialog.scrollTop = 0; document.body.style.overflow = "hidden";
  openingFrame = requestAnimationFrame(() => { if (dialog.open && !dialog.classList.contains("is-closing")) dialog.classList.add("is-open"); });
}
function closeFilm() {
  if (!dialog.open || dialog.classList.contains("is-closing")) return;
  cancelAnimationFrame(openingFrame); dialog.classList.remove("is-open"); dialog.classList.add("is-closing");
  const duration = reduce.matches ? 0 : parseFloat(getComputedStyle(dialog).getPropertyValue("--modal-close-dur")) || 150;
  closeTimer = setTimeout(() => {
    dialog.close(); dialog.classList.remove("is-closing"); document.body.style.overflow = "";
    if (returnTarget?.getClientRects().length) returnTarget.focus({ preventScroll:true });
    else returnToProgramme();
    activeFilm = null;
  }, duration);
}
function exportCalendar() {
  const film = films[activeFilm]; if (!film) return;
  const escape = (text) => text.replaceAll("\\", "\\\\").replaceAll(";", "\\;").replaceAll(",", "\\,").replaceAll("\n", "\\n");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Common Frame//Sample Programme//EN", "CALSCALE:GREGORIAN", "BEGIN:VEVENT", `UID:${activeFilm}-202611@common-frame.example`, `DTSTAMP:${stamp}`, `DTSTART:${film.start}`, `DTEND:${film.end}`, `SUMMARY:${escape(`Common Frame: ${film.title} (sample screening)`)}`, "DESCRIPTION:Sample film-club programme. This calendar entry is a personal plan; no seat is reserved.", "END:VEVENT", "END:VCALENDAR"];
  const bytes = new TextEncoder();
  const folded = lines.flatMap((line) => {
    const parts = []; let part = "";
    for (const char of line) { if (bytes.encode(part + char).length > 75) { parts.push(part); part = " "; } part += char; }
    parts.push(part); return parts;
  });
  const url = URL.createObjectURL(new Blob([folded.join("\r\n") + "\r\n"], { type:"text/calendar;charset=utf-8" }));
  const link = document.createElement("a"); link.href = url; link.download = `common-frame-${activeFilm}.ics`;
  document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  status("Calendar download requested. The date is a sample screening.");
}
document.querySelectorAll("[data-film]").forEach((button) => button.addEventListener("click", () => openFilm(button.dataset.film, button)));
document.querySelectorAll("[data-save]").forEach((button) => button.addEventListener("click", () => toggleSave(button.dataset.save)));
filters.forEach((button) => button.addEventListener("click", () => selectView(button.dataset.filter)));
document.querySelector("[data-my-programme]").addEventListener("click", () => selectView("saved", true));
document.querySelector("[data-show-all]").addEventListener("click", () => selectView("all"));
document.querySelector("[data-detail-save]").addEventListener("click", () => toggleSave(activeFilm));
document.querySelector("[data-calendar]").addEventListener("click", exportCalendar);
document.querySelector("[data-close-dialog]").addEventListener("click", closeFilm);
dialog.addEventListener("cancel", (event) => { event.preventDefault(); closeFilm(); });
dialog.addEventListener("keydown", (event) => {
  if (event.key !== "Tab" || !dialog.open) return;
  const controls = [...dialog.querySelectorAll("button:not([disabled]), a[href]")].filter((node) => node.getClientRects().length);
  const first = controls[0], last = controls.at(-1);
  const edge = event.shiftKey ? first : last;
  if (document.activeElement === edge || document.activeElement === dialog) {
    event.preventDefault(); (event.shiftKey ? last : first)?.focus();
  }
});
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeFilm();
});
document.querySelectorAll(".media-frame img").forEach((image) => {
  const frame = image.closest(".media-frame");
  image.addEventListener("error", () => { frame.dataset.failed = "true"; frame.querySelector(".media-feedback").hidden = false; });
  image.addEventListener("load", () => { frame.removeAttribute("data-failed"); frame.querySelector(".media-feedback").hidden = true; });
  frame.querySelector("[data-retry-image]").addEventListener("click", () => {
    frame.removeAttribute("data-failed"); frame.querySelector(".media-feedback").hidden = true;
    const source = new URL(image.src); source.searchParams.set("retry", String(Date.now())); image.src = source.href;
  });
  if (image.getAttribute("src") && image.complete && image.naturalWidth === 0) { frame.dataset.failed = "true"; frame.querySelector(".media-feedback").hidden = false; }
});
window.lucide?.createIcons(); render();
if (!persistent) status("");
