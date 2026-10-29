/* ============================================================
   Retratos procedurais: silhueta com luz de contorno
   ============================================================ */

import { makeRng } from '../core/rng.js';

const BACKGROUNDS = [
  ['#2a1e33', '#0d0a08'],
  ['#1b2b30', '#0b0d0c'],
  ['#301c1c', '#0c0808'],
  ['#232a1c', '#0b0c08'],
  ['#1b2436', '#080a0d'],
  ['#2e2618', '#0c0a06'],
];

const ACCENTS = ['#c9a227', '#93aecb', '#c98f8f', '#9ec08a', '#b9a2d6', '#dcb96e'];

const HAIR = [
  // curto
  `M66 100C66 68 84 58 100 58C116 58 134 68 134 100C134 80 120 72 100 72C80 72 66 80 66 100Z`,
  // comprido
  `M64 100C64 62 84 54 100 54C116 54 136 62 136 100L136 156C130 146 128 124 126 102C118 86 82 86 74 102C72 124 70 146 64 156Z`,
  // topete
  `M68 96C68 66 86 58 100 58C114 58 132 66 132 96C130 82 118 76 100 76C82 76 70 82 68 96Z
   <circle cx="100" cy="50" r="11"/>`,
  // desgrenhado
  `M64 102 68 78 78 86 82 64 92 76 100 58 108 76 118 64 122 86 132 78 136 102 126 90 118 96 108 86 100 94 92 86 82 96 74 90Z`,
  // raspado
  `M70 96C74 74 86 66 100 66C114 66 126 74 130 96C124 84 112 80 100 80C88 80 76 84 70 96Z`,
  // franja
  `M64 98C64 64 84 56 100 56C116 56 136 64 136 98C136 84 126 78 116 84 108 76 92 76 84 84 74 78 64 84 64 98Z`,
];

const HOODS = [
  `M56 118C56 64 78 44 100 44C122 44 144 64 144 118L144 140C134 116 128 96 100 96C72 96 66 116 56 140Z`,
  `M52 132C52 66 76 42 100 42C124 42 148 66 148 132L148 168C138 138 130 108 100 108C70 108 62 138 52 168Z`,
];

const BEARDS = [
  `M80 120C82 148 92 158 100 158C108 158 118 148 120 120C114 132 86 132 80 120Z`,
  `M76 118C76 152 88 174 100 178C112 174 124 152 124 118C118 134 82 134 76 118Z`,
];

/**
 * Gera um retrato determinístico.
 * @param {string|number} seed
 * @param {{ancestry?: string}} opts
 */
export function renderPortrait(seed, opts = {}) {
  const rng = makeRng(seed);
  const ancestry = opts.ancestry || 'humano';
  const [bg1, bg2] = rng.pick(BACKGROUNDS);
  const accent = rng.pick(ACCENTS);

  const id = `pt${Math.abs(Number(seed) || 0)}${rng.int(100, 999)}`;
  const small = ancestry === 'pequenino' || ancestry === 'silfide';
  const broad = ancestry === 'anao' || ancestry === 'gigante';
  const scale = small ? 0.9 : broad ? 1.05 : 1;

  const headRx = (small ? 31 : 35) + rng.int(-1, 2);
  const headRy = (small ? 38 : 42) + rng.int(-1, 3);
  const headCy = 104;
  const shoulder = broad
    ? 'M12 240C16 192 50 166 100 166C150 166 184 192 188 240Z'
    : 'M20 240C24 196 54 172 100 172C146 172 176 196 180 240Z';

  const hood = rng.chance(0.26) ? rng.pick(HOODS) : '';
  const hair = !hood && rng.chance(0.86) ? rng.pick(HAIR) : '';
  const beard = rng.chance(ancestry === 'anao' ? 0.75 : ancestry === 'orc' ? 0.35 : 0.2)
    ? rng.pick(BEARDS)
    : '';
  const horns = ancestry === 'veu' && rng.chance(0.85);

  const pointedEars = ancestry === 'elfo' || ancestry === 'silfide';
  const ears = pointedEars
    ? `<path d="M66 96 50 84 56 112Z"/><path d="M134 96 150 84 144 112Z"/>`
    : `<circle cx="65" cy="108" r="8"/><circle cx="135" cy="108" r="8"/>`;

  const hornsSvg = horns
    ? `<path d="M78 66C70 48 74 36 86 28 82 42 86 54 92 62Z"/><path d="M122 66C130 48 126 36 114 28 118 42 114 54 108 62Z"/>`
    : '';

  const tusks = ancestry === 'orc'
    ? `<path d="M91 124l3 10 4-9Z" fill="#e8dcc0" opacity=".85"/><path d="M109 124l-3 10-4-9Z" fill="#e8dcc0" opacity=".85"/>`
    : '';

  const scar = rng.chance(0.28)
    ? `<path d="M84 92 78 120" stroke="${accent}" stroke-width="1.6" opacity=".55" stroke-linecap="round"/>`
    : '';

  const earring = rng.chance(0.35)
    ? `<circle cx="136" cy="120" r="3.4" fill="none" stroke="${accent}" stroke-width="1.4" opacity=".9"/>`
    : '';

  const specks = Array.from({ length: 16 }, () => {
    const x = rng.int(12, 188);
    const y = rng.int(14, 226);
    const r = (rng.next() * 1.4 + 0.3).toFixed(1);
    const o = (rng.next() * 0.35 + 0.08).toFixed(2);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${accent}" opacity="${o}"/>`;
  }).join('');

  const ticks = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    const x1 = 100 + Math.cos(a) * 72;
    const y1 = 108 + Math.sin(a) * 72;
    const x2 = 100 + Math.cos(a) * (i % 3 === 0 ? 78 : 76);
    const y2 = 108 + Math.sin(a) * (i % 3 === 0 ? 78 : 76);
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${accent}" stroke-width=".8" opacity=".28"/>`;
  }).join('');

  return `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Retrato gerado">
  <defs>
    <radialGradient id="${id}-bg" cx="50%" cy="34%" r="72%">
      <stop offset="0" stop-color="${bg1}"/>
      <stop offset="1" stop-color="${bg2}"/>
    </radialGradient>
    <radialGradient id="${id}-glow" cx="50%" cy="46%" r="46%">
      <stop offset="0" stop-color="${accent}" stop-opacity=".22"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${id}-rim" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${accent}" stop-opacity=".95"/>
      <stop offset=".55" stop-color="${accent}" stop-opacity=".25"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="${id}-clip"><rect width="200" height="240" rx="0"/></clipPath>
  </defs>
  <g clip-path="url(#${id}-clip)">
    <rect width="200" height="240" fill="url(#${id}-bg)"/>
    <circle cx="100" cy="108" r="86" fill="url(#${id}-glow)"/>
    <circle cx="100" cy="108" r="70" fill="none" stroke="${accent}" stroke-width="1" opacity=".3"/>
    <circle cx="100" cy="108" r="64" fill="none" stroke="${accent}" stroke-width=".7" opacity=".18" stroke-dasharray="2 5"/>
    ${ticks}
    ${specks}

    <g transform="translate(${100 - 100 * scale} ${240 - 240 * scale}) scale(${scale})">
      <path d="${shoulder}" fill="#120e0a"/>
      <path d="${shoulder}" fill="none" stroke="url(#${id}-rim)" stroke-width="2.2"/>
      <path d="M86 146h28v34h-28Z" fill="#100c09"/>
      <ellipse cx="100" cy="${headCy}" rx="${headRx}" ry="${headRy}" fill="#17120d"/>
      <g fill="#17120d">${ears}${hair}${hood}${hornsSvg}${beard}</g>
      <g fill="none" stroke="${accent}" stroke-width="1.6" opacity=".5">
        <ellipse cx="100" cy="${headCy}" rx="${headRx}" ry="${headRy}"/>
      </g>
      <path d="M100 ${headCy - headRy + 3}C${100 - headRx + 6} ${headCy - headRy + 8} ${100 - headRx - 2} ${headCy + 6} ${100 - headRx + 8} ${headCy + headRy - 8}" fill="none" stroke="url(#${id}-rim)" stroke-width="2.4" stroke-linecap="round"/>
      <g fill="${accent}">
        <ellipse cx="88" cy="${headCy - 2}" rx="4.6" ry="2.6" opacity=".95"/>
        <ellipse cx="112" cy="${headCy - 2}" rx="4.6" ry="2.6" opacity=".95"/>
      </g>
      <g fill="${accent}" opacity=".18">
        <circle cx="88" cy="${headCy - 2}" r="9"/>
        <circle cx="112" cy="${headCy - 2}" r="9"/>
      </g>
      <path d="M100 ${headCy + 8} 96 ${headCy + 16} 104 ${headCy + 16}" fill="none" stroke="${accent}" stroke-width="1.2" opacity=".35" stroke-linejoin="round"/>
      <path d="M93 ${headCy + 26}q7 4 14 0" fill="none" stroke="${accent}" stroke-width="1.3" opacity=".45" stroke-linecap="round"/>
      ${tusks}${scar}${earring}
      <path d="M70 240C76 212 86 198 100 198C114 198 124 212 130 240" fill="none" stroke="${accent}" stroke-width="1.2" opacity=".35"/>
      <circle cx="100" cy="206" r="3.6" fill="none" stroke="${accent}" stroke-width="1.4" opacity=".6"/>
    </g>

    <rect width="200" height="240" fill="none" stroke="#0b0907" stroke-width="2"/>
  </g>
</svg>`;
}
