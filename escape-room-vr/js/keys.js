// The six Chrono Decoder keys. Each key carries a Roman numeral, a hole shape,
// a letter, a digit and an arrow, like the physical keys from the base game.
export const KEYS = [
  { id: 'I', letter: 'F', digit: '3', arrow: 'right', hole: 'triL' },
  { id: 'II', letter: 'D', digit: '2', arrow: 'down', hole: 'paraR' },
  { id: 'III', letter: 'B', digit: '6', arrow: 'leftright', hole: 'circle' },
  { id: 'V', letter: 'E', digit: '4', arrow: 'left', hole: 'triR' },
  { id: 'X', letter: 'C', digit: '5', arrow: 'up', hole: 'paraL' },
  { id: 'L', letter: 'A', digit: '1', arrow: 'updown', hole: 'square' },
];

const HOLES = {
  triL: '<polygon points="38,30 38,68 72,68"/>',
  triR: '<polygon points="70,30 70,68 30,68"/>',
  paraR: '<polygon points="38,36 76,36 64,64 26,64"/>',
  paraL: '<polygon points="24,36 62,36 74,64 36,64"/>',
  circle: '<circle cx="50" cy="50" r="17"/>',
  square: '<rect x="33" y="33" width="34" height="34"/>',
};

const ARROWS = {
  right: 'M38 0 H62 M54 -7 L62 0 L54 7',
  left: 'M38 0 H62 M46 -7 L38 0 L46 7',
  up: 'M50 -12 V12 M43 -4 L50 -12 L57 -4',
  down: 'M50 -12 V12 M43 4 L50 12 L57 4',
  leftright: 'M34 0 H66 M42 -7 L34 0 L42 7 M58 -7 L66 0 L58 7',
  updown: 'M50 -14 V14 M43 -6 L50 -14 L57 -6 M43 6 L50 14 L57 6',
};

// Returns an SVG string for a key. viewBox is 100 x 220.
export function keySvg(key, { idSuffix = '' } = {}) {
  const gid = `brass-${key.id}${idSuffix}`;
  const teeth = [];
  const seed = key.id.length * 7 + key.letter.charCodeAt(0);
  for (let i = 0; i < 5; i++) {
    const depth = 5 + ((seed * (i + 3)) % 9);
    teeth.push(`L${24 - depth} ${128 + i * 13} L24 ${134 + i * 13}`);
  }
  return `<svg viewBox="0 0 100 220" xmlns="http://www.w3.org/2000/svg" class="key-svg">
  <defs>
    <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f3d38a"/><stop offset="0.45" stop-color="#d4a24a"/><stop offset="1" stop-color="#9a6a22"/>
    </linearGradient>
    <mask id="m-${gid}"><rect width="100" height="220" fill="#fff"/><g fill="#000">${HOLES[key.hole]}</g></mask>
  </defs>
  <g mask="url(#m-${gid})" fill="url(#${gid})" stroke="#7a521a" stroke-width="1.5">
    <path d="M50 4 A46 46 0 0 1 80 85 L76 96 L76 196 L60 196 L60 214 L46 214 L46 196 L24 196 L24 122 ${teeth.join(' ')} L24 96 L20 85 A46 46 0 0 1 50 4 Z"/>
  </g>
  <g fill="#4a3210" font-family="Georgia, serif" text-anchor="middle">
    <text x="50" y="25" font-size="17" font-weight="bold">${key.id}</text>
    <circle cx="${key.hole === 'triR' ? 18 : 82}" cy="${key.hole === 'triR' ? 72 : 30}" r="3"/>
    <text x="50" y="${key.arrow === 'up' || key.arrow === 'down' || key.arrow === 'updown' ? 118 : 160}" font-size="20" font-family="sans-serif">${key.letter}</text>
    <text x="54" y="188" font-size="22" font-family="sans-serif">${key.digit}</text>
  </g>
  <g transform="translate(${key.arrow === 'up' || key.arrow === 'down' || key.arrow === 'updown' ? 6 : 0} ${key.arrow === 'up' || key.arrow === 'down' || key.arrow === 'updown' ? 150 : 118})" stroke="#4a3210" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="${ARROWS[key.arrow]}"/>
  </g>
</svg>`;
}
