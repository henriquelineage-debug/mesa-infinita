/* ============================================================
   View: Modo solo (oráculo, cenas e tensão)
   ============================================================ */

import { esc, toast } from '../../core/dom.js';
import {
  state, currentScene, addJournal, adjustTension, bumpOracle, updateSettings, removeJournal,
} from '../../state.js';
import { askOracle, oracleNarrative, rollEvent, openScene, sceneNarrative, getLikelihood } from '../../game/oracle.js';
import { makeRng } from '../../core/rng.js';
import { LIKELIHOODS } from '../../data/tables.js';
import { pageHead, icon, tensionControl, journalList, emptyState } from '../parts.js';

let likelihood = 'equilibrado';
let draft = '';

export function render(container) {
  const campaign = state.campaign;

  if (!campaign) {
    container.innerHTML = `<div class="v-solo">
      ${pageHead({ eyebrow: 'Modo solo', title: 'Oráculo' })}
      ${emptyState({
        iconName: 'eye',
        title: 'O oráculo precisa de uma campanha',
        text: 'Crie uma campanha para abrir cenas, fazer perguntas e registrar tudo no diário.',
        action: '<a class="btn btn--primary" href="#/campanha">Ir para a campanha</a>',
      })}
    </div>`;
    return;
  }

  const c = campaign;
  const scene = currentScene();
  const answer = c.lastOracle;
  const event = c.lastEvent;
  const autoLog = state.settings.oracleJournal !== false;
  const entries = c.journal.slice().reverse().slice(0, 8);

  container.innerHTML = `<div class="v-solo">
    ${pageHead({
      eyebrow: 'Modo solo',
      title: 'Oráculo',
      desc: 'Pergunte, interprete, registre. A tensão decide quanto o mundo vai complicar.',
      actions: `
        <button class="btn btn--sm" type="button" data-event>${icon('bolt')}Evento</button>
        <button class="btn btn--sm btn--primary" type="button" data-new-scene>${icon('map')}Nova cena</button>`,
    })}

    <section class="card ornate">
      <div class="row row--between" style="flex-wrap:wrap;gap:12px">
        ${tensionControl(c.tension)}
        <span class="tiny muted">${c.scenes.length} cena${c.scenes.length === 1 ? '' : 's'} · ${c.journal.length} registros</span>
      </div>
      <hr class="rule" />
      ${scene ? `
        <div class="scene">
          <p class="scene__where">Cena ${c.scenes.length} · ${esc(scene.location)}</p>
          <h2 class="scene__title">${esc(scene.prompt)}</h2>
          <p class="scene__text">${esc(scene.sense)}.</p>
          ${scene.presence ? `<p class="small muted" style="margin-top:8px">Presente: ${esc(scene.presence)}.</p>` : ''}
        </div>` : emptyState({
          iconName: 'map',
          title: 'Nenhuma cena aberta',
          text: 'Uma cena dá lugar, clima e um gancho para a próxima decisão.',
          action: '<button class="btn btn--sm btn--primary" type="button" data-new-scene>Abrir cena</button>',
        })}
    </section>

    <section class="section grid grid--2">
      <div class="card">
        <div class="card__head">
          <div class="card__title">${icon('eye', 'gold')}<h3>Pergunta ao oráculo</h3></div>
          <span class="tiny muted">d100</span>
        </div>
        <form id="oracle-form" class="oracle-form">
          <label class="field">
            <span>A pergunta</span>
            <textarea name="question" rows="3" maxlength="240" placeholder="O guarda acredita na minha história?">${esc(draft)}</textarea>
          </label>
          <div>
            <span class="tiny muted upper" style="display:block;margin-bottom:6px">Probabilidade</span>
            <div class="seg" role="group" aria-label="Probabilidade">
              ${LIKELIHOODS.map((l) => `<button type="button" data-like="${l.key}" aria-pressed="${likelihood === l.key}" title="${esc(l.hint)}">${esc(l.label)}</button>`).join('')}
            </div>
          </div>
          <div class="row row--between" style="flex-wrap:wrap;gap:10px">
            <label class="row" style="gap:7px;cursor:pointer">
              <input type="checkbox" id="auto-log" ${autoLog ? 'checked' : ''} />
              <span class="tiny muted">Registrar no diário</span>
            </label>
            <button class="btn btn--primary" type="submit">${icon('dice')}Perguntar</button>
          </div>
        </form>
      </div>

      <div class="card">
        <div class="card__head">
          <div class="card__title">${icon('scroll', 'gold')}<h3>Resposta</h3></div>
          ${answer ? `<span class="chip">${esc(answer.likelihoodLabel || getLikelihood(answer.likelihood).label)}</span>` : ''}
        </div>
        ${answer ? answerCard(answer) : emptyState({
          iconName: 'eye',
          title: 'O oráculo espera',
          text: 'Formule uma pergunta de sim ou não. Quanto mais específica, melhor a resposta.',
        })}
      </div>
    </section>

    ${event ? `<section class="section card">
      <div class="card__head">
        <div class="card__title">${icon('bolt', 'gold')}<h3>Evento em foco</h3></div>
        <span class="chip chip--violet">d100 ${event.roll ?? '—'}</span>
      </div>
      <div class="event-focus">
        <span class="event-focus__word">${esc(event.action)}</span>
        <span class="event-focus__sep">/</span>
        <span class="event-focus__word">${esc(event.subject)}</span>
      </div>
      <p class="small" style="margin:10px 0 0"><b>${esc(event.focus.label)}.</b> <span class="muted">${esc(event.focus.desc)}</span></p>
    </section>` : ''}

    <section class="section">
      <div class="section__head">
        <h2>Últimos registros</h2>
        <a class="linkbtn" href="#/campanha">ver diário completo</a>
      </div>
      ${entries.length ? journalList(entries) : `<p class="small muted">O diário ainda está em branco.</p>`}
    </section>
  </div>`;

  const root = container.firstElementChild;
  const form = root.querySelector('#oracle-form');

  root.addEventListener('click', (e) => {
    const t = e.target;

    if (t.closest('[data-tension]')) {
      adjustTension(Number(t.closest('[data-tension]').dataset.tension));
      render(container);
      return;
    }

    const like = t.closest('[data-like]');
    if (like) {
      likelihood = like.dataset.like;
      root.querySelectorAll('[data-like]').forEach((b) => b.setAttribute('aria-pressed', String(b === like)));
      return;
    }

    if (t.closest('[data-new-scene]')) {
      const scene2 = openScene(makeRng(`${c.seed}:cena:${c.scenes.length + 1}:${Date.now()}`));
      c.scenes.push(scene2);
      c.stats.scenes = c.scenes.length;
      addJournal({ kind: 'cena', title: `Cena ${c.scenes.length} — ${scene2.location}`, text: sceneNarrative(scene2) });
      draft = '';
      toast('Nova cena aberta', 'ok');
      render(container);
      return;
    }

    if (t.closest('[data-event]')) {
      const ev = rollEvent(makeRng(`${c.seed}:evento:${Date.now()}`));
      c.lastEvent = { ...ev, at: Date.now() };
      addJournal({
        kind: 'oraculo',
        title: 'Evento aleatório',
        text: `${ev.focus.label}: ${ev.action} / ${ev.subject}. ${ev.focus.desc}`,
      });
      render(container);
      return;
    }

    if (t.closest('[data-log-answer]') && answer) {
      addJournal({
        kind: 'oraculo',
        title: answer.question || 'Pergunta ao oráculo',
        text: oracleNarrative(answer),
      });
      toast('Resposta registrada', 'ok');
      render(container);
      return;
    }

    const del = t.closest('[data-del-journal]');
    if (del) {
      removeJournal(del.dataset.delJournal);
      render(container);
    }
  });

  form?.addEventListener('input', (e) => {
    if (e.target.name === 'question') draft = e.target.value;
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const question = form.elements.question.value.trim();
    if (!question) {
      toast('Escreva uma pergunta de sim ou não', 'bad');
      form.elements.question.focus();
      return;
    }

    const rng = makeRng(`${c.seed}:oraculo:${Date.now()}:${Math.random()}`);
    const result = askOracle({ question, likelihood, tension: c.tension ?? 1, rng });
    c.lastOracle = result;
    bumpOracle();

    const logIt = form.querySelector('#auto-log').checked;
    updateSettings({ oracleJournal: logIt });
    if (logIt) {
      addJournal({ kind: 'oraculo', title: question, text: oracleNarrative(result) });
    }
    if (result.tensionDelta) adjustTension(result.tensionDelta);

    draft = '';
    render(container);
    toast(result.verdict, result.yes ? 'ok' : 'bad');
  });
}

function answerCard(answer) {
  const delta = answer.tensionDelta
    ? `<span class="chip ${answer.tensionDelta > 0 ? 'chip--blood' : 'chip--moss'}">Tensão ${answer.tensionDelta > 0 ? '+1' : '−1'}</span>`
    : '';
  return `<div class="answer ${answer.yes ? '' : 'answer--no'}">
    <p class="answer__q">${esc(answer.question)}</p>
    <div class="answer__verdict">${esc(answer.verdict)}</div>
    ${answer.complication ? `<p class="answer__twist">${esc(answer.complication)}</p>` : ''}
    ${answer.event ? `<p class="answer__twist">Evento: ${esc(answer.event.focus.label)} — ${esc(answer.event.action)} / ${esc(answer.event.subject)}.</p>` : ''}
    <div class="answer__meta">
      <span class="chip">d100 ${answer.roll} vs ${answer.target}</span>
      ${delta}
    </div>
  </div>
  <div class="row" style="justify-content:center;margin-top:10px">
    <button class="linkbtn" type="button" data-log-answer>registrar esta resposta no diário</button>
  </div>`;
}
