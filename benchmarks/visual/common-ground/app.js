const observations = [
  { title: "The diagonal holds", place: "01 / AMSTERDAM, NETHERLANDS", image: "../shared/assets/eye-museum.jpg", alt: "Angular white facade and long dark stairs of the Eye Film Museum in Amsterdam", note: "The stair and the facade pull in the same direction. Their shared diagonal gives the photograph its momentum.", author: "John Unwin", source: "https://unsplash.com/photos/architectural-photograph-of-concrete-structure-clrS7NSsJLk" },
  { title: "Intervals of light", place: "02 / OTTAWA, CANADA", image: "../shared/assets/ottawa-colonnade.jpg", alt: "Repeated concrete columns, glass and long shadows along a building in Ottawa", note: "Concrete columns establish a beat; glass interrupts it with a second view of the sky. The shadows make that rhythm visible on the ground.", author: "Jonathan Lim", source: "https://unsplash.com/photos/concrete-pillars-line-the-exterior-of-a-modern-building-VQbpgDEstfU" },
  { title: "A shadow makes a room", place: "03 / DUSSELDORF, GERMANY", image: "../shared/assets/kunsthalle.jpg", alt: "Geometric concrete facade of Kunsthalle Dusseldorf against a clear blue sky", note: "The photograph of Kunsthalle Dusseldorf makes a solid wall feel hollow. A narrow opening and the changing shadow reveal its depth.", author: "Julia Taubitz", source: "https://unsplash.com/photos/modern-concrete-building-facade-with-geometric-shadows-wcdlRkLTtrg" },
];
const viewer = document.querySelector("#viewer");
const bookmark = document.querySelector("#bookmark");
let index = 0;
let opener = null;
let statusTimer;
let saved = new Set();
try { const values = JSON.parse(localStorage.getItem("common-ground-saved") || "[]"); if (Array.isArray(values)) saved = new Set(values.filter(value => Number.isInteger(value) && observations[value])); } catch {}
function notify(message) { clearTimeout(statusTimer); document.querySelector("#status").textContent = message; statusTimer = setTimeout(() => { document.querySelector("#status").textContent = ""; }, 4000); }
function updateCount() { document.querySelector("#saved-count").textContent = String(saved.size); }
function showObservation(value) {
  index = (value + observations.length) % observations.length;
  const item = observations[index];
  const image = document.querySelector("#viewer-image");
  image.src = item.image;
  image.alt = item.alt;
  document.querySelector("#viewer-position").textContent = `${String(index + 1).padStart(2, "0")} / 03`;
  document.querySelector("#viewer-place").textContent = item.place;
  document.querySelector("#viewer-title").textContent = item.title;
  document.querySelector("#viewer-note").textContent = item.note;
  const source = document.querySelector("#viewer-source");
  source.href = item.source;
  source.textContent = `Photography by ${item.author} / Unsplash`;
  bookmark.setAttribute("aria-pressed", String(saved.has(index)));
  bookmark.setAttribute("aria-label", saved.has(index) ? "Remove saved observation" : "Save observation");
  bookmark.title = bookmark.getAttribute("aria-label");
}
document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => {
  opener = button;
  showObservation(Number(button.dataset.view));
  viewer.showModal();
}));
document.querySelector("#close-viewer").addEventListener("click", () => viewer.close());
viewer.addEventListener("click", event => { if (event.target === viewer) { const rect = viewer.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) viewer.close(); } });
viewer.addEventListener("close", () => opener?.focus());
viewer.addEventListener("keydown", event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); showObservation(index + (event.key === "ArrowRight" ? 1 : -1)); } });
document.querySelector("#next").addEventListener("click", () => showObservation(index + 1));
document.querySelector("#previous").addEventListener("click", () => showObservation(index - 1));
bookmark.addEventListener("click", () => {
  const next = new Set(saved);
  if (next.has(index)) next.delete(index); else next.add(index);
  try { localStorage.setItem("common-ground-saved", JSON.stringify([...next])); saved = next; } catch { notify("This observation could not be saved."); return; }
  showObservation(index);
  updateCount();
});
document.querySelector("#saved-view").addEventListener("click", event => {
  if (!saved.size) { notify("No saved observations yet."); return; }
  opener = event.currentTarget;
  showObservation([...saved][0]);
  viewer.showModal();
});
updateCount();
lucide.createIcons();
