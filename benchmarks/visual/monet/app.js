const works = [
  { title: "Cliff Walk at Pourville", date: "1882", dimensions: "66.5 x 82.3 cm", image: "monet-cliff.jpg", alt: "Two figures and a red parasol on a flower-covered cliff, with small sails on the turquoise sea", record: "https://www.artic.edu/artworks/14620", source: "https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Cliff_Walk_at_Pourville_-_Google_Art_Project.jpg", note: "A red parasol gathers the eye. Around it, small marks of blue, rose and green make the hillside feel less solid than it first appears.", position: "68% 58%" },
  { title: "Stacks of Wheat (End of Summer)", date: "1890 - 91", dimensions: "60 x 100.5 cm", image: "monet-wheat.jpg", alt: "Two rounded wheat stacks in a field, painted in pink, lavender, green and gold", record: "https://www.artic.edu/artworks/64818", source: "https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Stacks_of_Wheat_(End_of_Summer)_-_1985.1103_-_Art_Institute_of_Chicago.jpg", note: "The larger stack carries rose and lavender into the field. Up close, its edge is made of separate touches rather than a single outline.", position: "72% 55%" },
  { title: "Water Lilies", date: "1906", dimensions: "89.9 x 94.1 cm", image: "monet-lilies.jpg", alt: "Pink and white water lilies on blue and violet water, with soft reflected clouds", record: "https://www.artic.edu/artworks/16568", source: "https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Water_Lilies_-_1933.1157_-_Art_Institute_of_Chicago.jpg", note: "The lilies float above a reflected sky. Thick touches of pink and white meet softer blue marks without a line separating water from air.", position: "60% 70%" },
];
const viewer = document.querySelector("#painting-viewer");
const image = document.querySelector("#viewer-image");
const stage = document.querySelector("#viewer-stage");
let selected = 0;
let detail = false;
let opener = null;

function setMode(nextDetail) {
  detail = nextDetail;
  stage.classList.toggle("detail", detail);
  document.querySelector("#whole-view").setAttribute("aria-pressed", String(!detail));
  document.querySelector("#detail-view").setAttribute("aria-pressed", String(detail));
  document.querySelector("#viewer-mode").textContent = detail ? "BRUSHWORK DETAIL / CROP" : "WHOLE PAINTING";
  image.alt = `${detail ? "Brushwork crop of " : ""}${works[selected].alt}`;
}

function renderWork() {
  const work = works[selected];
  document.querySelector("#viewer-position").textContent = `${String(selected + 1).padStart(2, "0")} / 03`;
  document.querySelector("#viewer-title").textContent = work.title;
  document.querySelector("#viewer-facts").textContent = `${work.date}. Oil on canvas. ${work.dimensions}.`;
  document.querySelector("#viewer-observation").textContent = work.note;
  document.querySelector("#viewer-record").href = work.record;
  document.querySelector("#viewer-source").href = work.source;
  document.querySelector("#image-error").hidden = true;
  image.hidden = false;
  stage.style.setProperty("--detail-position", work.position);
  image.src = `../shared/assets/${work.image}`;
  setMode(detail);
}

function openWork(index, button) {
  selected = index;
  detail = button.dataset.detail === "true";
  opener = button;
  renderWork();
  viewer.showModal();
}

function step(offset) {
  selected = (selected + offset + works.length) % works.length;
  renderWork();
}

document.querySelectorAll("[data-work]").forEach((button) => button.addEventListener("click", () => openWork(Number(button.dataset.work), button)));
document.querySelector("#whole-view").addEventListener("click", () => setMode(false));
document.querySelector("#detail-view").addEventListener("click", () => setMode(true));
document.querySelector("#previous").addEventListener("click", () => step(-1));
document.querySelector("#next").addEventListener("click", () => step(1));
document.querySelector("#close-viewer").addEventListener("click", () => viewer.close());
viewer.addEventListener("close", () => opener?.focus({ preventScroll: true }));
viewer.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    event.preventDefault();
    step(event.key === "ArrowRight" ? 1 : -1);
  }
});
image.addEventListener("error", () => {
  image.hidden = true;
  document.querySelector("#image-error").hidden = false;
  document.querySelector("#whole-view").disabled = true;
  document.querySelector("#detail-view").disabled = true;
});
image.addEventListener("load", () => {
  document.querySelector("#whole-view").disabled = false;
  document.querySelector("#detail-view").disabled = false;
});
if (window.lucide) window.lucide.createIcons();
