/* ============================================================
   Mapa de masmorra em SVG a partir das células geradas
   ============================================================ */

const COLORS = {
  rock: '#0c0a08',
  floor: '#2a2118',
  floorAlt: '#241c14',
  wall: '#8a7454',
  gold: '#c9a227',
  blood: '#a33d3d',
  ink: '#ece0c8',
};

/**
 * @param {{grid:{w:number,h:number}, cells:number[], rooms:any[]}} dungeon
 * @param {{cell?: number}} opts
 */
export function renderDungeonMap(dungeon, opts = {}) {
  const cell = opts.cell || 22;
  const { w, h } = dungeon.grid;
  const pad = 12;
  const width = w * cell + pad * 2;
  const height = h * cell + pad * 2;
  const isFloor = (x, y) => x >= 0 && y >= 0 && x < w && y < h && dungeon.cells[y * w + x] === 1;

  const floors = [];
  const walls = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!isFloor(x, y)) continue;
      const px = pad + x * cell;
      const py = pad + y * cell;
      const shade = (x + y) % 2 === 0 ? COLORS.floor : COLORS.floorAlt;
      floors.push(`<rect x="${px}" y="${py}" width="${cell}" height="${cell}" fill="${shade}"/>`);

      const x1 = px;
      const y1 = py;
      const x2 = px + cell;
      const y2 = py + cell;
      if (!isFloor(x, y - 1)) walls.push(`<path d="M${x1} ${y1}h${cell}"/>`);
      if (!isFloor(x, y + 1)) walls.push(`<path d="M${x1} ${y2}h${cell}"/>`);
      if (!isFloor(x - 1, y)) walls.push(`<path d="M${x1} ${y1}v${cell}"/>`);
      if (!isFloor(x + 1, y)) walls.push(`<path d="M${x2} ${y1}v${cell}"/>`);
    }
  }

  const markers = dungeon.rooms
    .map((room) => {
      const cx = pad + (room.x + room.w / 2) * cell;
      const cy = pad + (room.y + room.h / 2) * cell;
      if (room.isEntrance) {
        return `<g><circle cx="${cx}" cy="${cy}" r="9" fill="${COLORS.rock}" stroke="${COLORS.gold}" stroke-width="1.4"/>
          <path d="M${cx - 4} ${cy + 4}v-8l7 4z" fill="${COLORS.gold}"/></g>`;
      }
      if (room.isBoss) {
        return `<g><circle cx="${cx}" cy="${cy}" r="10" fill="${COLORS.rock}" stroke="${COLORS.blood}" stroke-width="1.4"/>
          <path d="M${cx} ${cy - 5}l1.6 3.6 3.9.4-2.9 2.6.8 3.8-3.4-2-3.4 2 .8-3.8-2.9-2.6 3.9-.4z" fill="${COLORS.blood}"/></g>`;
      }
      return `<g><circle cx="${cx}" cy="${cy}" r="8.5" fill="${COLORS.rock}" fill-opacity=".82" stroke="${COLORS.wall}" stroke-width="1"/>
        <text x="${cx}" y="${cy + 3.4}" text-anchor="middle" font-family="Georgia, serif" font-size="9" fill="${COLORS.ink}">${room.index}</text></g>`;
    })
    .join('');

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mapa da masmorra gerada">
  <rect width="${width}" height="${height}" fill="${COLORS.rock}"/>
  <g opacity=".5">
    ${Array.from({ length: w + 1 }, (_, i) => `<line x1="${pad + i * cell}" y1="${pad}" x2="${pad + i * cell}" y2="${pad + h * cell}" stroke="#1a1510" stroke-width=".6"/>`).join('')}
    ${Array.from({ length: h + 1 }, (_, i) => `<line x1="${pad}" y1="${pad + i * cell}" x2="${pad + w * cell}" y2="${pad + i * cell}" stroke="#1a1510" stroke-width=".6"/>`).join('')}
  </g>
  ${floors.join('')}
  <g fill="none" stroke="${COLORS.wall}" stroke-width="2.6" stroke-linecap="square" opacity=".9">
    ${walls.join('')}
  </g>
  ${markers}
</svg>`;
}
