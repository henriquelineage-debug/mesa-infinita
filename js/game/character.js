/* ============================================================
   Personagens: geração, derivação de estatísticas e progressão
   ============================================================ */

import { uid } from '../core/rng.js';
import {
  ABILITIES, SKILLS, ANCESTRIES, CLASSES, BACKGROUNDS, TRAITS,
  MOD, proficiency, xpForLevel, findBy,
} from '../data/rules.js';
import {
  NAME_POOLS, EPITHETS, NPC_LOOK, NPC_VOICE, NPC_QUIRK,
} from '../data/names.js';

const ANCESTRY_SKILL_MODS = {
  elfo: { percepcao: 2 },
  orc: { intimidacao: 1 },
};

const uniq = (arr) => Array.from(new Set(arr));

/** Ordena os atributos rolados segundo a prioridade da classe. */
function assignStats(rolls, cls) {
  const priority = uniq([cls.primary, cls.secondary, 'con', 'des', 'sab', 'int', 'for', 'car']).slice(0, 6);
  const sorted = rolls.slice().sort((a, b) => b - a);
  const abilities = {};
  priority.forEach((key, i) => { abilities[key] = sorted[i]; });
  ABILITIES.forEach(({ key }) => { if (!abilities[key]) abilities[key] = 10; });
  return abilities;
}

/** Gera um personagem completo e coerente a partir de um RNG. */
export function generateCharacter(rng, opts = {}) {
  const ancestry = opts.ancestryKey ? findBy(ANCESTRIES, opts.ancestryKey) : rng.pick(ANCESTRIES);
  const cls = opts.classKey ? findBy(CLASSES, opts.classKey) : rng.pick(CLASSES);
  const background = rng.pick(BACKGROUNDS);

  const rolls = Array.from({ length: 6 }, () => rng.stat());
  const abilities = assignStats(rolls, cls);
  for (const [key, value] of Object.entries(ancestry.bonuses || {})) {
    abilities[key] = Math.min(20, (abilities[key] || 10) + value);
  }

  const pool = NAME_POOLS[ancestry.key] || NAME_POOLS.humano;
  let name = (opts.name || '').trim();
  if (!name) {
    name = `${rng.pick(pool.first)} ${rng.pick(pool.last)}`;
    if (rng.chance(0.28)) name += `, ${rng.pick(EPITHETS)}`;
  }

  const skills = uniq([...rng.picks(cls.skills, 2), ...background.skills]);
  const traits = { ...background.trait };
  for (const key of Object.keys(TRAITS)) {
    if (rng.chance(0.3)) traits[key] = rng.pick(TRAITS[key]);
  }

  const level = 1;
  const conMod = MOD(abilities.con);
  const maxHp = cls.hpBase + conMod + (ancestry.key === 'anao' ? 2 : 0);

  return {
    id: uid('pc'),
    name,
    ancestry: ancestry.key,
    class: cls.key,
    background: background.key,
    level,
    xp: 0,
    abilities,
    skills,
    skillMods: { ...(ANCESTRY_SKILL_MODS[ancestry.key] || {}) },
    hp: { current: maxHp, max: maxHp, temp: 0 },
    conditions: [],
    coins: { po: rng.int(2, 14), pp: rng.int(0, 24), pc: rng.int(0, 40) },
    gear: [...cls.gear, background.item],
    traits,
    appearance: {
      look: rng.pick(NPC_LOOK),
      voice: rng.pick(NPC_VOICE),
      quirk: rng.pick(NPC_QUIRK),
    },
    notes: '',
    portraitSeed: rng.int(1, 2147483000),
    sigilSeed: rng.int(1, 2147483000),
    createdAt: Date.now(),
  };
}

/** Recalcula tudo que é derivado dos atributos/nível. */
export function derive(character) {
  const c = character;
  const cls = findBy(CLASSES, c.class);
  const ancestry = findBy(ANCESTRIES, c.ancestry);
  const level = Math.max(1, Number(c.level) || 1);
  const prof = proficiency(level);

  const mods = {};
  for (const { key } of ABILITIES) mods[key] = MOD(c.abilities?.[key]);

  const conMod = mods.con;
  const maxHp = Math.max(
    1,
    cls.hpBase + conMod + (level - 1) * (4 + conMod) + (ancestry.key === 'anao' ? 2 * level : 0),
  );

  const skills = SKILLS.map((s) => {
    const isProf = (c.skills || []).includes(s.key);
    const extra = c.skillMods?.[s.key] || 0;
    const total = mods[s.ability] + (isProf ? prof : 0) + extra;
    return { ...s, prof: isProf, extra, total };
  });
  const skillTotal = (key) => skills.find((s) => s.key === key)?.total ?? 0;

  const attacks = cls.weapons.map((w) => ({
    ...w,
    bonus: prof + mods[w.ability],
    damageBonus: mods[w.ability],
  }));

  return {
    cls,
    ancestry,
    level,
    prof,
    mods,
    maxHp,
    hpCurrent: Math.min(Number(c.hp?.current ?? maxHp), maxHp),
    defense: 10 + mods.des + cls.armor,
    initiative: mods.des,
    speed: ancestry.speed,
    passivePerception: 10 + skillTotal('percepcao'),
    skills,
    skillTotal,
    attacks,
    xp: Number(c.xp) || 0,
    xpNext: level < 20 ? xpForLevel(level + 1) : null,
    xpPrev: xpForLevel(level),
  };
}

export function rerollAbilities(character, rng) {
  const cls = findBy(CLASSES, character.class);
  const ancestry = findBy(ANCESTRIES, character.ancestry);
  const rolls = Array.from({ length: 6 }, () => rng.stat());
  const abilities = assignStats(rolls, cls);
  for (const [key, value] of Object.entries(ancestry.bonuses || {})) {
    abilities[key] = Math.min(20, (abilities[key] || 10) + value);
  }
  const next = { ...character, abilities };
  const d = derive(next);
  next.hp = { current: d.maxHp, max: d.maxHp, temp: character.hp?.temp || 0 };
  return next;
}

/** Sobe de nível e devolve o personagem atualizado + PV ganho. */
export function levelUp(character) {
  const level = Math.max(1, Number(character.level) || 1);
  if (level >= 20) return { character, gained: 0 };
  const before = derive(character).maxHp;
  const next = { ...character, level: level + 1, xp: Math.max(character.xp || 0, xpForLevel(level + 1)) };
  const after = derive(next).maxHp;
  const gained = Math.max(0, after - before);
  next.hp = { current: Math.min((character.hp?.current || 0) + gained, after), max: after, temp: character.hp?.temp || 0 };
  return { character: next, gained };
}

export function xpProgress(character) {
  const d = derive(character);
  if (!d.xpNext) return { pct: 100, label: 'Nível máximo' };
  const span = d.xpNext - d.xpPrev;
  const pct = Math.max(0, Math.min(100, ((d.xp - d.xpPrev) / span) * 100));
  return { pct, label: `${d.xp} / ${d.xpNext} XP` };
}

export function characterLabel(character) {
  if (!character) return 'Sem personagem';
  const cls = findBy(CLASSES, character.class);
  const ancestry = findBy(ANCESTRIES, character.ancestry);
  return `${character.name} — ${cls.label} ${ancestry.label} ${character.level}`;
}

/** Garante campos que possam faltar em fichas antigas/importadas. */
export function normalizeCharacter(c) {
  if (!c) return c;
  c.abilities = c.abilities || { for: 10, des: 10, con: 10, int: 10, sab: 10, car: 10 };
  c.skills = Array.isArray(c.skills) ? c.skills : [];
  c.skillMods = c.skillMods || {};
  c.gear = Array.isArray(c.gear) ? c.gear : [];
  c.conditions = Array.isArray(c.conditions) ? c.conditions : [];
  c.traits = c.traits || {};
  c.appearance = c.appearance || {};
  c.coins = c.coins || { po: 0, pp: 0, pc: 0 };
  c.level = Number(c.level) || 1;
  c.xp = Number(c.xp) || 0;
  const d = derive(c);
  c.hp = c.hp || {};
  c.hp.max = d.maxHp;
  c.hp.current = Math.min(Number(c.hp.current ?? d.maxHp), d.maxHp);
  c.portraitSeed = c.portraitSeed || Math.floor(Math.random() * 1e9);
  c.sigilSeed = c.sigilSeed || Math.floor(Math.random() * 1e9);
  return c;
}
