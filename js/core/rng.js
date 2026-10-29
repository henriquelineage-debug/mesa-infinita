/* ============================================================
   RNG determinístico (mulberry32) + sementes legíveis
   ============================================================ */

/** Hash FNV-1a de string para uint32. */
export function hashSeed(input) {
  const s = String(input);
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Cria um gerador determinístico a partir de uma semente (string ou número).
 * A mesma semente sempre produz a mesma sequência.
 */
export function makeRng(seed) {
  let a = (typeof seed === 'number' ? seed : hashSeed(seed)) >>> 0;

  const next = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const rng = {
    next,
    /** inteiro entre min e max, inclusive */
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    /** um dado de N lados */
    die: (sides) => 1 + Math.floor(next() * sides),
    /** escolhe um item */
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    /** true com probabilidade p (0..1) */
    chance: (p) => next() < p,
    /** cópia embaralhada */
    shuffle(arr) {
      const out = arr.slice();
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    },
    /** n itens distintos */
    picks(arr, n) {
      return rng.shuffle(arr).slice(0, Math.min(n, arr.length));
    },
    /** n itens com repetição permitida */
    sample(arr, n) {
      const out = [];
      for (let i = 0; i < n; i++) out.push(rng.pick(arr));
      return out;
    },
    /** 4d6 descarta o menor (geração clássica de atributo) */
    stat() {
      const rolls = [rng.die(6), rng.die(6), rng.die(6), rng.die(6)].sort((x, y) => y - x);
      return rolls[0] + rolls[1] + rolls[2];
    },
    /** deriva um gerador independente, útil para sub-sistemas */
    fork(label) {
      return makeRng((a ^ hashSeed(String(label))) >>> 0);
    },
  };

  return rng;
}

const SEED_ADJ = [
  'sombrio', 'dourado', 'rachado', 'silente', 'eterno', 'vivo', 'partido', 'oculto',
  'errante', 'frio', 'rubro', 'antigo', 'vazio', 'torto', 'lunar', 'ferro',
  'cinza', 'verde', 'azul', 'negro', 'pálido', 'ardente', 'mudo', 'profundo',
  'esquecido', 'sagrado', 'torcido', 'brilhante', 'último', 'primeiro',
];

const SEED_NOUN = [
  'corvo', 'cálice', 'vela', 'portão', 'espinho', 'marca', 'sino', 'ponte',
  'lua', 'chave', 'cinza', 'raiz', 'fio', 'véu', 'osso', 'brasa',
  'canto', 'selo', 'poço', 'lanterna', 'espelho', 'tambor', 'jarro', 'dente',
  'asa', 'poeira', 'coração', 'limiar', 'juramento', 'eco',
];

/** Gera uma semente legível, tipo "corvo-rachado-4821". */
export function newSeed() {
  const r = makeRng(Date.now() ^ Math.floor(Math.random() * 0xffffffff));
  return `${r.pick(SEED_NOUN)}-${r.pick(SEED_ADJ)}-${String(r.int(1000, 9999))}`;
}

/** Id curto e razoavelmente único. */
export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}
