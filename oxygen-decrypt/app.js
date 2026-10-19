const $ = (id) => document.getElementById(id);

const reader = $('reader');
const puzzle = $('puzzle');
const status = $('status');
const swatches = [...document.querySelectorAll('.swatch')];

let selected = 'red';

function openPuzzle() {
  puzzle.hidden = false;
  reader.hidden = true;
  status.hidden = true;
}

function closePuzzle() {
  puzzle.hidden = true;
  reader.hidden = false;
  status.hidden = true;
}

function pickColour(color) {
  selected = color;
  swatches.forEach((swatch) => {
    swatch.setAttribute('aria-checked', swatch.dataset.color === color ? 'true' : 'false');
  });
}

$('open-puzzle').addEventListener('click', openPuzzle);
$('close-puzzle').addEventListener('click', closePuzzle);
$('select-colour').addEventListener('click', () => {
  status.hidden = false;
  status.textContent = `Locked ${selected}. Snap something nearby that matches.`;
});
swatches.forEach((swatch) => {
  swatch.addEventListener('click', () => pickColour(swatch.dataset.color));
});
