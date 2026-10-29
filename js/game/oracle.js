/* ============================================================
   Motor solo: oráculo de sim/não, eventos e abertura de cenas
   ============================================================ */

import { uid } from '../core/rng.js';
import {
  LIKELIHOODS, COMPLICATIONS, TWISTS, EVENT_FOCUS,
  ACTION_WORDS, SUBJECT_WORDS, SENSES, SCENE_PROMPTS, LOCATIONS,
} from '../data/tables.js';

const PRESENCE = [
  'um guarda de turno, cansado demais para ser curioso',
  'uma criança descalça que observa de longe',
  'um bêbado que finge dormir',
  'uma mulher com um cesto vazio',
  'dois homens conversando baixo demais',
  'um cão magro que segue você',
  'um mensageiro sem pressa',
  'alguém que você já viu antes, mas não sabe onde',
  'um vendedor fechando a banca',
  'um casal discutindo em voz baixa',
  'um velho que conta moedas',
  'ninguém — e isso é estranho',
];

export function getLikelihood(key) {
  return LIKELIHOODS.find((l) => l.key === key) || LIKELIHOODS[2];
}

/** Sorteia um foco de evento com palavras de ação/assunto. */
export function rollEvent(rng) {
  const roll = rng.int(1, 100);
  const focus = EVENT_FOCUS.find((f) => roll >= f.min && roll <= f.max) || EVENT_FOCUS[0];
  return {
    roll,
    focus: { label: focus.label, desc: focus.desc },
    action: rng.pick(ACTION_WORDS),
    subject: rng.pick(SUBJECT_WORDS),
  };
}

/**
 * Responde uma pergunta ao oráculo.
 * @param {{question: string, likelihood: string, tension: number, rng: any}} cfg
 */
export function askOracle({ question, likelihood, tension = 1, rng }) {
  const like = getLikelihood(likelihood);
  const roll = rng.int(1, 100);
  const yes = roll <= like.target;

  let verdict;
  if (yes) {
    const strong = Math.max(3, Math.round(like.target * 0.2));
    if (roll <= strong) verdict = 'Sim, e...';
    else if (roll >= like.target - 8) verdict = 'Sim, mas...';
    else verdict = 'Sim.';
  } else {
    const strong = Math.max(3, Math.round((100 - like.target) * 0.2));
    if (roll >= 100 - strong) verdict = 'Não, e...';
    else if (roll <= like.target + 8) verdict = 'Não, mas...';
    else verdict = 'Não.';
  }

  const complicationChance = Math.min(70, 10 + Math.max(0, tension) * 7);
  const complication = rng.int(1, 100) <= complicationChance ? rng.pick(COMPLICATIONS) : null;

  const isDouble = roll % 11 === 0 && roll > 0 && roll < 100;
  const event = isDouble || roll <= 4 || roll >= 97 ? rollEvent(rng) : null;

  const tensionDelta = verdict.startsWith('Não') ? 1 : verdict === 'Sim, e...' ? -1 : 0;

  return {
    id: uid('orc'),
    at: Date.now(),
    question: String(question || '').trim(),
    likelihood: like.key,
    likelihoodLabel: like.label,
    target: like.target,
    roll,
    yes,
    verdict,
    complication,
    event,
    tensionDelta,
  };
}

/** Descreve a resposta em texto corrido para o diário. */
export function oracleNarrative(answer) {
  const parts = [`${answer.verdict} (${answer.roll} vs ${answer.target})`];
  if (answer.complication) parts.push(`Complicação: ${answer.complication}`);
  if (answer.event) {
    parts.push(
      `Evento — ${answer.event.focus.label}: ${answer.event.action} / ${answer.event.subject}. ${answer.event.focus.desc}`,
    );
  }
  return parts.join('\n');
}

/** Texto corrido de uma cena para o diário. */
export function sceneNarrative(scene) {
  const parts = [];
  if (scene.sense) parts.push(`O ar traz ${scene.sense}.`);
  if (scene.presence) parts.push(`Há ${scene.presence}.`);
  if (scene.prompt) parts.push(scene.prompt);
  return parts.join(' ');
}

/** Cria uma nova cena de abertura com ganchos sensoriais. */
export function openScene(rng) {
  const loc = rng.pick(LOCATIONS);
  const presence = rng.chance(0.62) ? rng.pick(PRESENCE) : null;
  return {
    id: uid('scn'),
    at: Date.now(),
    location: loc.label,
    kind: loc.kind,
    sense: rng.pick(SENSES),
    prompt: rng.pick(SCENE_PROMPTS),
    presence,
    question: '',
    answerId: null,
  };
}

/** Reviravolta maior, para virar a mesa quando a história empaca. */
export function rollTwist(rng) {
  return { text: rng.pick(TWISTS), at: Date.now() };
}

export { COMPLICATIONS, TWISTS };
