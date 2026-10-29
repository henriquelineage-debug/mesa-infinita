/* ============================================================
   Brasões heráldicos procedurais em SVG
   ============================================================ */

import { makeRng } from '../core/rng.js';

const TINCTURES = [
  { field: '#c9a227', ink: '#1b1410' },
  { field: '#8e2f2f', ink: '#ecdcb8' },
  { field: '#33506b', ink: '#ecdcb8' },
  { field: '#1b1712', ink: '#c9a227' },
  { field: '#3f5a38', ink: '#ecdcb8' },
  { field: '#cfc4ad', ink: '#2a2018' },
  { field: '#5a3f6b', ink: '#ecdcb8' },
  { field: '#6b4a2a', ink: '#f0e2c4' },
];

const SHIELD = 'M100 12 172 34 V112 C172 156 138 186 100 204 C62 186 28 156 28 112 V34 Z';
const SHIELD_INNER = 'M100 22 162 41 V112 C162 149 133 175 100 192 C67 175 38 149 38 112 V41 Z';

const CHARGES = {
  estrela: `<path d="M50 16 58.5 39.5 83 40 63.5 54.5 70.5 78 50 63.5 29.5 78 36.5 54.5 17 40 41.5 39.5Z" fill="currentColor"/>`,
  lua: `<path d="M62 16a34 34 0 1 0 0 68 27 27 0 1 1 0-68Z" fill="currentColor"/>`,
  espada: `<path d="M50 10 58 26v30H42V26Z" fill="currentColor"/><rect x="33" y="58" width="34" height="6" rx="1.5" fill="currentColor"/><rect x="46" y="64" width="8" height="20" rx="2" fill="currentColor"/><circle cx="50" cy="88" r="5" fill="currentColor"/>`,
  chave: `<circle cx="50" cy="30" r="11" fill="none" stroke="currentColor" stroke-width="6"/><rect x="47" y="40" width="6" height="44" fill="currentColor"/><rect x="53" y="66" width="14" height="6" fill="currentColor"/><rect x="53" y="76" width="10" height="6" fill="currentColor"/>`,
  torre: `<path d="M34 88V42h7V30h7v12h4V30h7v12h4V30h7v12h7v46Z" fill="currentColor"/><path d="M45 88V70a5 5 0 0 1 10 0v18Z" fill="#0b0907" opacity=".75"/>`,
  chama: `<path d="M50 10c16 20 20 27 20 40a20 20 0 0 1-40 0c0-9 5-16 12-25 0 9 5 13 9 13 2-11 0-19-1-28Z" fill="currentColor"/>`,
  olho: `<path d="M14 50c10-16 22-24 36-24s26 8 36 24c-10 16-22 24-36 24S24 66 14 50Z" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="50" cy="50" r="11" fill="currentColor"/><circle cx="50" cy="50" r="4" fill="#0b0907"/>`,
  serpente: `<path d="M32 84c0-16 36-16 36-32S32 36 32 20" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round"/><path d="M32 84l-6-8M32 84l8-5" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,
  arvore: `<path d="M46 88V58H34l16-22 16 22H54v30Z" fill="currentColor"/><circle cx="50" cy="30" r="16" fill="currentColor" opacity=".9"/>`,
  corvo: `<path d="M16 60c12-5 19-16 30-18 5-9 16-11 23-6l11-7-5 14c7 5 9 12 7 19-7 2-14 0-18-5-9 5-21 5-30 2l-18 9Z" fill="currentColor"/>`,
  calice: `<path d="M28 18h44v18a22 22 0 0 1-44 0Z" fill="currentColor"/><rect x="46" y="56" width="8" height="26" fill="currentColor"/><path d="M32 88h36v6H32Z" fill="currentColor"/>`,
  ampulheta: `<path d="M28 14h44v6L56 50l16 30v6H28v-6l16-30L28 20Z" fill="currentColor"/>`,
  cruz: `<path d="M43 12h14v26h26v14H57v36H43V52H17V38h26Z" fill="currentColor"/>`,
  roda: `<circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="50" cy="50" r="10" fill="currentColor"/><path d="M50 16v18M50 66v18M16 50h18M66 50h18M26 26l13 13M61 61l13 13M74 26 61 39M39 61 26 74" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`,
  ancora: `<circle cx="50" cy="18" r="8" fill="none" stroke="currentColor" stroke-width="5"/><path d="M50 26v58M32 44h36M28 66c4 14 12 20 22 20s18-6 22-20" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>`,
  arco: `<path d="M34 12c26 8 40 22 40 38S60 80 34 88" fill="none" stroke="currentColor" stroke-width="6"/><path d="M34 12 34 88" stroke="currentColor" stroke-width="2"/><path d="M24 50h34M50 42l10 8-10 8" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>`,
};

const CHARGE_KEYS = Object.keys(CHARGES);

const DIVISIONS = ['pleno', 'partido', 'cortado', 'faixa', 'banda', 'quarteado', 'aspa', 'sautoir'];

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function divisionSvg(kind, color) {
  const c = color;
  switch (kind) {
    case 'partido':
      return `<rect x="100" y="0" width="100" height="240" fill="${c}"/>`;
    case 'cortado':
      return `<rect x="0" y="120" width="200" height="120" fill="${c}"/>`;
    case 'faixa':
      return `<rect x="0" y="88" width="200" height="52" fill="${c}"/>`;
    case 'banda':
      return `<path d="M0 0 200 0 0 200Z" fill="${c}"/>`;
    case 'quarteado':
      return `<rect x="100" y="0" width="100" height="120" fill="${c}"/><rect x="0" y="120" width="100" height="120" fill="${c}"/>`;
    case 'aspa':
      return `<path d="M0 96 100 40 200 96 200 132 100 76 0 132Z" fill="${c}"/>`;
    case 'sautoir':
      return `<path d="M0 0 26 0 200 214 200 240 174 240 0 26Z" fill="${c}"/><path d="M200 0 174 0 0 214 0 240 26 240 200 26Z" fill="${c}"/>`;
    default:
      return '';
  }
}

/**
 * Gera um brasão determinístico.
 * @param {string|number} seed
 * @param {{size?: number, id?: string}} opts
 */
export function renderSigil(seed, opts = {}) {
  const rng = makeRng(seed);
  const t1 = rng.pick(TINCTURES);
  const t2 = rng.pick(TINCTURES.filter((t) => t.field !== t1.field));
  const division = rng.pick(DIVISIONS);
  const chargeKey = rng.pick(CHARGE_KEYS);
  const charge = CHARGES[chargeKey];
  const hasChief = rng.chance(0.3);

  const ink =
    Math.abs(luminance(t1.field) - luminance(t1.ink)) > 0.35
      ? t1.ink
      : luminance(t1.field) > 0.5
        ? '#1b1410'
        : '#ecdcb8';

  const id = `sg${Math.abs(Number(seed) || 0)}${Math.floor(rng.next() * 9999)}`;
  const scale = rng.chance(0.5) ? 1 : 0.82;
  const cx = 100;
  const cy = hasChief ? 118 : 108;
  const tx = cx - 50 * scale;
  const ty = cy - 50 * scale;

  return `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Brasão gerado" class="sigil">
  <defs>
    <clipPath id="${id}"><path d="${SHIELD}"/></clipPath>
    <linearGradient id="${id}-sheen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".16"/>
      <stop offset=".45" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity=".22"/>
    </linearGradient>
  </defs>
  <g clip-path="url(#${id})">
    <rect width="200" height="240" fill="${t1.field}"/>
    ${divisionSvg(division, t2.field)}
    ${hasChief ? `<rect x="0" y="0" width="200" height="34" fill="${t2.field}"/><rect x="0" y="34" width="200" height="3" fill="${ink}" opacity=".55"/>` : ''}
    <g color="${ink}" transform="translate(${tx} ${ty}) scale(${scale})">${charge}</g>
    <rect width="200" height="240" fill="url(#${id}-sheen)"/>
  </g>
  <path d="${SHIELD}" fill="none" stroke="#0b0907" stroke-width="7" stroke-linejoin="round"/>
  <path d="${SHIELD}" fill="none" stroke="#c9a227" stroke-width="1.4" opacity=".65" stroke-linejoin="round"/>
  <path d="${SHIELD_INNER}" fill="none" stroke="#0b0907" stroke-width="1" opacity=".45" stroke-linejoin="round"/>
</svg>`;
}
