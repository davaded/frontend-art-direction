const root = document.documentElement;
const instrument = document.querySelector('.image-instrument');
const image = document.querySelector('#reading-image');
const viewIndex = document.querySelector('#view-index');
const viewName = document.querySelector('#view-name');
const viewCopy = document.querySelector('#view-copy');
const viewCredit = document.querySelector('#view-credit');
const viewSource = document.querySelector('#view-source');
const viewButtons = [...document.querySelectorAll('[data-view-target]')];

const hubble = {
  source: '../shared/assets/m51-hubble.jpg',
  credit: 'NASA, ESA, S. Beckwith (STScI), and The Hubble Heritage Team (STScI/AURA)',
  record: 'https://www.astropix.org/image/esahubble/heic0506a',
  recordName: 'heic0506a / Hubble ACS',
};
const views = {
  wide: {
    index: 'A', name: 'WIDE FIELD', source: '../shared/assets/m51-galaxy.jpg',
    copy: 'M51 sits among a much wider field of stars. This DSS2 image supplies context, rather than Hubble detail.',
    alt: 'The DSS2 wide field, with M51 and its companion near the centre',
    credit: 'ESA/Hubble and Digitized Sky Survey 2. Acknowledgements: Mahdi Zamani (ESA/Hubble)',
    record: 'https://esahubble.org/images/heic0506c/', recordName: 'heic0506c / DSS2 wide field',
  },
  companion: {
    ...hubble, index: 'B', name: 'THE PAIR',
    copy: 'The blue spiral and golden companion share the frame. The smaller galaxy passes behind M51.',
    alt: "Hubble's complete view of M51 and its companion",
  },
  core: {
    ...hubble, index: 'C', name: 'SPIRAL CORE',
    copy: 'Dark dust lanes follow the inner edges of the arms. Pink star-forming regions and blue clusters trace the spiral outward.',
    alt: "A closer crop of the bright core and dust lanes in Hubble's M51 image",
  },
};

function bindImageState(target) {
  const region = target.closest('[data-image-region]');
  const error = region.querySelector('.image-error');
  function update(failed) {
    region.classList.toggle('is-error', failed);
    target.hidden = failed;
    error.hidden = !failed;
    if (target === image) viewButtons.forEach((button) => { button.disabled = failed; });
  }
  target.addEventListener('error', () => update(true));
  target.addEventListener('load', () => update(false));
  if (target.complete) update(target.naturalWidth === 0);
}

function setView(name, updateHash = true, bringIntoView = false) {
  const selected = views[name] ? name : 'companion';
  const next = views[selected];
  instrument.dataset.view = selected;
  viewIndex.textContent = next.index;
  viewName.textContent = next.name;
  viewCopy.textContent = next.copy;
  viewCredit.textContent = next.credit;
  viewSource.href = next.record;
  viewSource.textContent = next.recordName;
  image.alt = next.alt;
  if (image.getAttribute('src') !== next.source) image.src = next.source;
  viewButtons.forEach((button) => {
    const active = button.dataset.viewTarget === selected;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (updateHash) history.replaceState(null, '', '#reading-' + selected);
  if (bringIntoView) {
    // Keep the subject in view when a control changes the reading distance.
    const stage = instrument.querySelector('.view-stage');
    const compact = stage.getBoundingClientRect().height + 180 <= innerHeight;
    stage.scrollIntoView({ block: compact ? 'center' : 'start', behavior: 'instant' });
  }
}

[image, ...document.querySelectorAll('[data-source-image]')].forEach(bindImageState);
viewButtons.forEach((button) => button.addEventListener('click', () => setView(button.dataset.viewTarget, true, true)));
document.querySelector('.note-link').addEventListener('click', (event) => {
  event.preventDefault();
  setView('core', true, true);
});
window.addEventListener('hashchange', () => {
  const name = location.hash.replace('#reading-', '');
  if (views[name]) setView(name, false, true);
});

root.classList.add('is-ready');
const initial = location.hash.replace('#reading-', '');
setView(views[initial] ? initial : 'companion', false, Boolean(views[initial]));
