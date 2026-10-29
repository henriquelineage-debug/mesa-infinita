/* ============================================================
   Geradores: NPCs, tavernas, missões, masmorras e tabelas
   ============================================================ */

import { uid } from '../core/rng.js';
import {
  NAME_POOLS, EPITHETS, TAVERN_NAMES, PLACE_PREFIX, PLACE_SUFFIX,
  FACTION_ADJ, FACTION_NOUN, NPC_OCCUPATION, NPC_DESIRE, NPC_SECRET,
  NPC_QUIRK, NPC_VOICE, NPC_LOOK,
} from '../data/names.js';
import {
  TAVERN, QUEST, DUNGEON, TREASURE, ENCOUNTERS, WEATHER, RUMORS,
  COMPLICATIONS, TWISTS, LOCATIONS,
} from '../data/tables.js';

const ANCESTRY_WEIGHTS = [
  'humano', 'humano', 'humano', 'humano', 'anao', 'elfo', 'elfo',
  'pequenino', 'orc', 'veu', 'silfide', 'gigante',
];

const ANCESTRY_LABEL = {
  humano: 'Humano', anao: 'Anão', elfo: 'Elfo', pequenino: 'Pequenino',
  orc: 'Orc', veu: 'Nascido do Véu', silfide: 'Silfide', gigante: 'Gigante',
};

const AGES = ['jovem, ainda com pressa', 'de meia-idade e cansado', 'idoso, com olhos atentos', 'idade impossível de dizer'];

const placeName = (rng) => `${rng.pick(PLACE_PREFIX)} ${rng.pick(PLACE_SUFFIX)}`;
const factionName = (rng) => `${rng.pick(FACTION_ADJ)} ${rng.pick(FACTION_NOUN)}`;

function npcName(rng, ancestryKey) {
  const pool = NAME_POOLS[ancestryKey] || NAME_POOLS.humano;
  return `${rng.pick(pool.first)} ${rng.pick(pool.last)}`;
}

/* ---------------- NPC ---------------- */

export function generateNPC(rng, opts = {}) {
  const ancestryKey = opts.ancestry || rng.pick(ANCESTRY_WEIGHTS);
  const withEpithet = rng.chance(0.22);
  const name = opts.name || npcName(rng, ancestryKey);

  return {
    id: uid('npc'),
    name,
    epithet: withEpithet ? rng.pick(EPITHETS) : '',
    ancestry: ancestryKey,
    ancestryLabel: ANCESTRY_LABEL[ancestryKey] || 'Humano',
    occupation: rng.pick(NPC_OCCUPATION),
    age: rng.pick(AGES),
    look: rng.pick(NPC_LOOK),
    voice: rng.pick(NPC_VOICE),
    quirk: rng.pick(NPC_QUIRK),
    desire: rng.pick(NPC_DESIRE),
    secret: rng.pick(NPC_SECRET),
    faction: rng.chance(0.45) ? factionName(rng) : null,
    portraitSeed: rng.int(1, 2147483000),
    sigilSeed: rng.int(1, 2147483000),
    createdAt: Date.now(),
  };
}

/* ---------------- taverna ---------------- */

const TAVERN_WHERE = [
  'no porto, perto dos armazéns', 'na praça do mercado', 'na estrada norte, fora da muralha',
  'no bairro dos tintureiros', 'junto ao portão sul', 'no cruzamento das duas ruas principais',
  'na cidade baixa, onde as ruas não têm nome', 'no caminho do templo', 'atrás do cartório',
  'num beco que só tem uma entrada',
];

export function generateTavern(rng) {
  const owner = generateNPC(rng);
  const name = rng.pick(TAVERN_NAMES);

  return {
    id: uid('tav'),
    name,
    where: rng.pick(TAVERN_WHERE),
    ambience: rng.pick(TAVERN.ambience),
    owner: {
      name: owner.name,
      epithet: owner.epithet,
      mood: rng.pick(TAVERN.ownerMood),
      portraitSeed: owner.portraitSeed,
      quirk: owner.quirk,
    },
    food: rng.pick(TAVERN.food),
    drink: rng.pick(TAVERN.drink),
    price: rng.pick(TAVERN.price),
    houseRule: rng.pick(TAVERN.houseRule),
    music: rng.pick(TAVERN.music),
    event: rng.pick(TAVERN.event),
    rumors: rng.picks(RUMORS, 3),
    sigilSeed: rng.int(1, 2147483000),
    createdAt: Date.now(),
  };
}

/* ---------------- missão ---------------- */

const QUEST_TITLE_PATTERNS = [
  (t, p) => `${t} em ${p}`,
  (t, p) => `O Preço de ${p}`,
  (t, p) => `Sombras sobre ${p}`,
  (t, p) => `O Que Resta de ${p}`,
  (t, p) => `${p} Não Esquece`,
];

export function generateQuest(rng) {
  const type = rng.pick(QUEST.type);
  const place = placeName(rng);
  const title = rng.pick(QUEST_TITLE_PATTERNS)(type.label, place);
  const location = rng.pick(LOCATIONS);

  return {
    id: uid('qst'),
    title,
    type: type.label,
    goal: type.goal,
    place,
    location: location.label,
    patron: rng.pick(QUEST.patron),
    target: rng.pick(QUEST.target),
    obstacle: rng.pick(QUEST.obstacle),
    twist: rng.pick(QUEST.twist),
    reward: rng.pick(QUEST.reward),
    gold: rng.int(3, 18) * 10,
    deadline: rng.pick(QUEST.deadline),
    hook: rng.pick(QUEST.hook),
    createdAt: Date.now(),
  };
}

/* ---------------- masmorra ---------------- */

const GRID_W = 21;
const GRID_H = 15;

function carveRect(cells, { x, y, w, h }) {
  for (let j = y; j < y + h; j++) {
    for (let i = x; i < x + w; i++) cells[j * GRID_W + i] = 1;
  }
}

function carveCorridor(cells, a, b, rng) {
  const ax = Math.floor(a.x + a.w / 2);
  const ay = Math.floor(a.y + a.h / 2);
  const bx = Math.floor(b.x + b.w / 2);
  const by = Math.floor(b.y + b.h / 2);
  const horizontalFirst = rng.chance(0.5);

  const hLine = (x1, x2, y) => {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) cells[y * GRID_W + x] = 1;
  };
  const vLine = (y1, y2, x) => {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) cells[y * GRID_W + x] = 1;
  };

  if (horizontalFirst) {
    hLine(ax, bx, ay);
    vLine(ay, by, bx);
  } else {
    vLine(ay, by, ax);
    hLine(ax, bx, by);
  }
}

const overlaps = (a, b, margin = 1) =>
  a.x - margin < b.x + b.w &&
  a.x + a.w + margin > b.x &&
  a.y - margin < b.y + b.h &&
  a.y + a.h + margin > b.y;

function tryLayout(rng) {
  const cells = new Uint8Array(GRID_W * GRID_H);
  const rooms = [];

  for (let attempt = 0; attempt < 90 && rooms.length < 8; attempt++) {
    const w = rng.int(2, 4);
    const h = rng.int(2, 3);
    const x = rng.int(1, GRID_W - w - 2);
    const y = rng.int(1, GRID_H - h - 2);
    const rect = { x, y, w, h };
    if (rooms.some((r) => overlaps(r, rect, 1))) continue;
    rooms.push(rect);
  }

  rooms.sort((a, b) => a.x - b.x);
  rooms.forEach((r) => carveRect(cells, r));
  for (let i = 1; i < rooms.length; i++) carveCorridor(cells, rooms[i - 1], rooms[i], rng);

  if (rooms.length > 2) {
    const extra = rng.int(1, rooms.length - 2);
    carveCorridor(cells, rooms[0], rooms[extra], rng);
  }

  return { cells, rooms };
}

export function generateDungeon(rng) {
  const theme = rng.pick(DUNGEON.theme);
  let layout = null;

  for (let attempt = 0; attempt < 30; attempt++) {
    const candidate = tryLayout(rng);
    if (candidate.rooms.length >= 5) {
      layout = candidate;
      break;
    }
    layout = layout || candidate;
  }

  const { cells, rooms } = layout;
  const boss = rng.pick(theme.boss);
  const name = rng.pick(DUNGEON.name).replace('{place}', placeName(rng));
  const types = rng.shuffle(theme.rooms);

  const content = rooms.map((room, index) => {
    const isEntrance = index === 0;
    const isBoss = index === rooms.length - 1;
    return {
      ...room,
      index: index + 1,
      isEntrance,
      isBoss,
      type: isEntrance ? 'Entrada' : isBoss ? 'Câmara final' : types[index % types.length],
      feature: rng.chance(0.62) ? rng.pick(DUNGEON.feature) : null,
      danger: !isEntrance && rng.chance(0.4) ? rng.pick(DUNGEON.danger) : null,
      loot: rng.chance(0.5) ? rng.pick(DUNGEON.loot) : null,
    };
  });

  return {
    id: uid('dgn'),
    name,
    theme: { key: theme.key, label: theme.label, motif: theme.motif },
    boss,
    grid: { w: GRID_W, h: GRID_H },
    cells: Array.from(cells),
    rooms: content,
    createdAt: Date.now(),
  };
}

/* ---------------- tabelas avulsas ---------------- */

export const TABLE_OPTIONS = [
  { key: 'rumor', label: 'Rumor' },
  { key: 'tesouro', label: 'Tesouro' },
  { key: 'encontro', label: 'Encontro' },
  { key: 'clima', label: 'Clima' },
  { key: 'complicacao', label: 'Complicação' },
  { key: 'reviravolta', label: 'Reviravolta' },
  { key: 'lugar', label: 'Lugar' },
  { key: 'faccao', label: 'Facção' },
  { key: 'npc', label: 'Nome de NPC' },
];

export function rollTable(rng, key) {
  switch (key) {
    case 'rumor':
      return { label: 'Rumor', text: rng.pick(RUMORS) };
    case 'tesouro': {
      const t = rng.pick(TREASURE);
      return { label: `Tesouro (${t.value})`, text: t.item };
    }
    case 'encontro':
      return { label: 'Encontro', text: rng.pick(ENCOUNTERS) };
    case 'clima':
      return { label: 'Clima', text: rng.pick(WEATHER) };
    case 'complicacao':
      return { label: 'Complicação', text: rng.pick(COMPLICATIONS) };
    case 'reviravolta':
      return { label: 'Reviravolta', text: rng.pick(TWISTS) };
    case 'lugar':
      return { label: 'Lugar', text: placeName(rng) };
    case 'faccao':
      return { label: 'Facção', text: factionName(rng) };
    case 'npc': {
      const key2 = rng.pick(ANCESTRY_WEIGHTS);
      return { label: `Nome (${ANCESTRY_LABEL[key2]})`, text: npcName(rng, key2) };
    }
    default:
      return { label: 'Resultado', text: '—' };
  }
}
