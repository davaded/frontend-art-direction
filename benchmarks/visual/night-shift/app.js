const root = document.documentElement;
const instrument = document.querySelector('.image-instrument');
const image = document.querySelector('#reading-image');
const imageError = document.querySelector('.image-error');
const viewIndex = document.querySelector('#view-index');
const viewName = document.querySelector('#view-name');
const viewCopy = document.querySelector('#view-copy');
const viewButtons = [...document.querySelectorAll('[data-view-target]')];

const views = {
  wide: { index: 'A', name: 'WIDE FIELD', copy: 'The spiral holds its companion, its surrounding stars, and the quiet scale of the frame.' },
  companion: { index: 'B', name: 'COMPANION', copy: 'The smaller galaxy interrupts the symmetry. The relationship becomes the subject.' },
  core: { index: 'C', name: 'CORE', copy: 'Dust lanes bend the light around the centre. Detail changes the tempo, not the object.' },
};

function setView(name, updateHash = true, bringIntoView = false) {
  const next = views[name] || views.wide;
  instrument.dataset.view = name;
  viewIndex.textContent = next.index;
  viewName.textContent = next.name;
  viewCopy.textContent = next.copy;
  viewButtons.forEach((button) => {
    const active = button.dataset.viewTarget === name;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (updateHash) history.replaceState(null, '', `#reading-${name}`);
  if (bringIntoView) {
    // Keep the changed instrument visible immediately; the image itself carries the meaningful transition.
    instrument.scrollIntoView({ block: 'center', behavior: 'auto' });
  }
}

viewButtons.forEach((button) => button.addEventListener('click', () => setView(button.dataset.viewTarget, true, true)));
window.addEventListener('hashchange', () => {
  const name = location.hash.replace('#reading-', '');
  if (views[name]) setView(name, false);
});

image.addEventListener('error', () => {
  instrument.classList.add('is-error');
  image.hidden = true;
  imageError.hidden = false;
  viewButtons.forEach((button) => { button.disabled = true; });
});
image.addEventListener('load', () => {
  instrument.classList.remove('is-error');
  image.hidden = false;
  imageError.hidden = true;
  viewButtons.forEach((button) => { button.disabled = false; });
});

root.classList.add('is-ready');
const initial = location.hash.replace('#reading-', '');
if (views[initial]) setView(initial, false);
