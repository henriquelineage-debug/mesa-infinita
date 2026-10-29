/* ============================================================
   Rolador de dados — expressões tipo "2d6+3", vantagem em d20
   ============================================================ */

const LIMITS = { dice: 40, sides: 1000, mod: 999 };

/** Interpreta "2d6+1d4-2" em termos. Lança erro em expressão inválida. */
export function parseExpression(input) {
  const clean = String(input ?? '').toLowerCase().replace(/\s+/g, '');
  if (!clean) throw new Error('Digite uma expressão, ex.: 1d20+3');
  if (!/^[+-]?(\d*d\d+|\d+)([+-](\d*d\d+|\d+))*$/.test(clean)) {
    throw new Error('Expressão inválida. Use o formato 2d6+3.');
  }

  const raw = clean.match(/[+-]?[^+-]+/g) || [];
  const terms = raw.map((token) => {
    const sign = token.startsWith('-') ? -1 : 1;
    const body = token.replace(/^[+-]/, '');
    if (body.includes('d')) {
      const [countRaw, sidesRaw] = body.split('d');
      const count = countRaw === '' ? 1 : Number(countRaw);
      const sides = Number(sidesRaw);
      if (!Number.isFinite(count) || !Number.isFinite(sides)) throw new Error('Dado inválido.');
      if (count < 1 || count > LIMITS.dice) throw new Error(`Máximo de ${LIMITS.dice} dados por termo.`);
      if (sides < 2 || sides > LIMITS.sides) throw new Error(`Dado deve ter entre 2 e ${LIMITS.sides} lados.`);
      return { sign, count, sides, kind: 'dice' };
    }
    const value = Number(body);
    if (!Number.isFinite(value) || value > LIMITS.mod) throw new Error('Modificador inválido.');
    return { sign, value, kind: 'flat' };
  });

  return { terms, normalized: clean };
}

/**
 * Rola uma expressão.
 * @param {string} expr
 * @param {{advantage?: 'normal'|'vantagem'|'desvantagem', rng?: () => number}} opts
 */
export function rollExpression(expr, opts = {}) {
  const { terms, normalized } = parseExpression(expr);
  const advantage = opts.advantage || 'normal';
  const rng = opts.rng || Math.random;

  const dice = [];
  let total = 0;
  let usedAdvantage = false;
  let nat20 = false;
  let nat1 = false;

  for (const term of terms) {
    if (term.kind === 'flat') {
      total += term.sign * term.value;
      continue;
    }

    const rolls = [];
    const isSingleD20 = term.sides === 20 && term.count === 1;

    if (isSingleD20 && advantage !== 'normal' && !usedAdvantage) {
      usedAdvantage = true;
      const a = 1 + Math.floor(rng() * 20);
      const b = 1 + Math.floor(rng() * 20);
      const keepHigh = advantage === 'vantagem';
      const kept = keepHigh ? Math.max(a, b) : Math.min(a, b);
      const dropped = keepHigh ? Math.min(a, b) : Math.max(a, b);
      rolls.push(kept);
      dice.push({ sides: 20, rolls: [a, b], kept: [kept], dropped: [dropped], advantage: true });
      total += term.sign * kept;
      if (kept === 20) nat20 = true;
      if (kept === 1) nat1 = true;
    } else {
      const kept = [];
      for (let i = 0; i < term.count; i++) {
        const r = 1 + Math.floor(rng() * term.sides);
        kept.push(r);
        total += term.sign * r;
        if (isSingleD20) {
          if (r === 20) nat20 = true;
          if (r === 1) nat1 = true;
        }
      }
      dice.push({ sides: term.sides, rolls: kept, kept, dropped: [], advantage: false });
    }
  }

  return {
    expr: normalized,
    total,
    dice,
    advantage: usedAdvantage ? advantage : 'normal',
    nat20: nat20 && advantage !== 'desvantagem',
    nat1: nat1 && advantage !== 'vantagem',
  };
}

/** Texto legível da rolagem: "[12] + 3". */
export function describeRoll(roll) {
  const parts = [];
  for (const d of roll.dice) {
    if (d.advantage) {
      parts.push(`d${d.sides} [${d.rolls[0]}|${d.rolls[1]} → ${d.kept[0]}]`);
    } else {
      parts.push(`${d.kept.length}d${d.sides} [${d.kept.join(', ')}]`);
    }
  }
  return parts.join(' + ');
}

/** Detalhe completo, incluindo modificadores fixos. */
export function describeFull(roll) {
  const parts = roll.dice.map((d) =>
    d.advantage
      ? `d${d.sides} [${d.rolls[0]}|${d.rolls[1]} → ${d.kept[0]}]`
      : `${d.kept.length}d${d.sides} [${d.kept.join(', ')}]`,
  );
  const diceSum = roll.dice.reduce((sum, d) => sum + d.kept.reduce((a, b) => a + b, 0), 0);
  const flat = roll.total - diceSum;
  if (flat > 0) parts.push(`+ ${flat}`);
  if (flat < 0) parts.push(`− ${Math.abs(flat)}`);
  return parts.join(' ');
}

/** Soma dos modificadores fixos de uma expressão (para exibir "1d20 + 5"). */
export function flatBonus(expr) {
  try {
    return parseExpression(expr).terms
      .filter((t) => t.kind === 'flat')
      .reduce((sum, t) => sum + t.sign * t.value, 0);
  } catch {
    return 0;
  }
}

export function rollDie(sides, rng = Math.random) {
  return 1 + Math.floor(rng() * sides);
}

export function rollD20(mod = 0, advantage = 'normal', rng = Math.random) {
  return rollExpression(`1d20${mod >= 0 ? '+' : ''}${mod}`, { advantage, rng });
}
