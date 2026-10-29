/* ============================================================
   View: Rolador de dados e testes
   ============================================================ */

import { esc, toast } from '../../core/dom.js';
import { state, logRoll, addJournal } from '../../state.js';
import { rollExpression, describeFull } from '../../core/dice.js';
import { derive } from '../../game/character.js';
import { SKILLS } from '../../data/rules.js';
import { pageHead, icon, signed } from '../parts.js';

const QUICK = [4, 6, 8, 10, 12, 20, 100];

let expr = '1d20';
let advantage = 'normal';
let lastRoll = null;
let lastExpr = '';
let testBonus = 0;

export function render(container) {
  const campaign = state.campaign;
  const d = campaign ? derive(campaign.character) : null;
  const skills = d ? d.skills : SKILLS.map((s) => ({ ...s, total: 0, prof: false }));

  container.innerHTML = `<div class="v-dice">
    ${pageHead({
      eyebrow: 'Mesa',
      title: 'Dados',
      desc: 'Expressões livres, vantagem em d20 e testes ligados à ficha.',
    })}

    <section class="card ornate">
      <div id="dice-stage"></div>

      <div class="row" style="margin-top:14px;gap:8px;flex-wrap:wrap">
        <input id="dice-expr" type="text" value="${esc(expr)}" placeholder="ex.: 2d6+3" aria-label="Expressão de dados" style="flex:1 1 160px" />
        <button class="btn btn--primary" type="button" data-roll>${icon('dice')}Rolar</button>
      </div>

      <div class="row row--between" style="margin-top:10px;flex-wrap:wrap;gap:10px">
        <div class="seg" role="group" aria-label="Vantagem">
          ${['normal', 'vantagem', 'desvantagem'].map((v) => `<button type="button" data-adv="${v}" aria-pressed="${advantage === v}">${v === 'normal' ? 'Normal' : v === 'vantagem' ? 'Vantagem' : 'Desvantagem'}</button>`).join('')}
        </div>
        <button class="linkbtn" type="button" data-log-last ${lastRoll ? '' : 'disabled'}>registrar no diário</button>
      </div>
    </section>

    <section class="section grid grid--2">
      <div class="card">
        <div class="card__head">
          <div class="card__title">${icon('dice', 'gold')}<h3>Dados rápidos</h3></div>
          <span class="tiny muted">rola na hora</span>
        </div>
        <div class="quickdice">
          ${QUICK.map((s) => `<button class="qdie" type="button" data-die="${s}">d${s}<span>${s === 100 ? 'percentil' : '1 dado'}</span></button>`).join('')}
        </div>
        <p class="tiny dim" style="margin:12px 0 0">Aceita <code>2d6+3</code>, <code>1d8+1d4</code>, <code>4d6-1</code>. Vantagem vale para o primeiro d20 da expressão.</p>
      </div>

      <div class="card">
        <div class="card__head">
          <div class="card__title">${icon('eye', 'gold')}<h3>Teste de perícia</h3></div>
          ${d ? `<span class="chip chip--gold">${esc(campaign.character.name.split(' ')[0])}</span>` : `<span class="chip">sem ficha</span>`}
        </div>
        <div class="grid grid--2 keep" style="gap:8px">
          <label class="field">
            <span>Perícia</span>
            <select id="test-skill">
              ${skills.map((s) => `<option value="${s.key}">${esc(s.label)} (${signed(s.total)})</option>`).join('')}
            </select>
          </label>
          <label class="field">
            <span>Dificuldade (CD)</span>
            <input id="test-dc" type="number" value="13" min="1" max="40" />
          </label>
        </div>
        <button class="btn btn--block" type="button" data-test style="margin-top:10px">Rolar teste</button>
        <div id="test-result" style="margin-top:12px"></div>
      </div>
    </section>

    <section class="section card">
      <div class="card__head">
        <div class="card__title">${icon('scroll', 'gold')}<h3>Histórico desta sessão</h3></div>
        <span class="tiny muted" id="roll-count">${rollCountLabel()}</span>
      </div>
      <div id="roll-history"></div>
    </section>
  </div>`;

  const root = container.firstElementChild;
  const stage = root.querySelector('#dice-stage');
  const history = root.querySelector('#roll-history');
  const input = root.querySelector('#dice-expr');

  paintStage(stage);
  paintHistory(history);

  const roll = (expression) => {
    try {
      const r = rollExpression(expression, { advantage });
      lastRoll = r;
      lastExpr = expression;
      expr = expression;
      paintStage(stage);
      paintHistory(history);
      logRoll({ expr: `${expression}${advantage !== 'normal' ? ` (${advantage})` : ''}`, total: r.total, at: Date.now() });
      root.querySelector('[data-log-last]').disabled = false;
    } catch (err) {
      toast(err.message || 'Expressão inválida', 'bad');
    }
  };

  root.addEventListener('click', async (e) => {
    const t = e.target;

    if (t.closest('[data-roll]')) {
      roll(input.value.trim() || '1d20');
      return;
    }

    const dieBtn = t.closest('[data-die]');
    if (dieBtn) {
      const sides = Number(dieBtn.dataset.die);
      input.value = `1d${sides}`;
      roll(`1d${sides}`);
      return;
    }

    const advBtn = t.closest('[data-adv]');
    if (advBtn) {
      advantage = advBtn.dataset.adv;
      root.querySelectorAll('[data-adv]').forEach((b) => b.setAttribute('aria-pressed', String(b === advBtn)));
      return;
    }

    if (t.closest('[data-test]')) {
      const skillKey = root.querySelector('#test-skill').value;
      const dc = Math.max(1, Number(root.querySelector('#test-dc').value) || 13);
      const skill = skills.find((s) => s.key === skillKey);
      testBonus = skill.total;
      const r = rollExpression(`1d20${skill.total >= 0 ? '+' : ''}${skill.total}`);
      const ok = r.total >= dc;
      const nat20 = r.nat20;
      const nat1 = r.nat1;
      const success = nat20 || (!nat1 && ok);
      root.querySelector('#test-result').innerHTML = `<div class="panel-inset">
        <div class="row row--between">
          <span class="small muted">${esc(skill.label)} · CD ${dc}</span>
          <b class="${success ? 'moss' : 'blood'}">${success ? 'Sucesso' : 'Falha'}</b>
        </div>
        <div class="row" style="align-items:baseline;gap:8px;margin-top:4px">
          <span class="dice-total" style="font-size:2rem">${r.total}</span>
          <span class="tiny muted">d20 ${r.dice[0].kept[0]} ${signed(skill.total)}</span>
        </div>
        ${nat20 ? '<p class="tiny gold" style="margin:4px 0 0">20 natural — sucesso crítico</p>' : ''}
        ${nat1 ? '<p class="tiny blood" style="margin:4px 0 0">1 natural — falha crítica</p>' : ''}
      </div>`;
      logRoll({ expr: `Teste de ${skill.label} (CD ${dc})`, total: r.total, at: Date.now() });
      paintHistory(history);
      return;
    }

    if (t.closest('[data-log-last]') && lastRoll) {
      addJournal({
        kind: 'rolagem',
        title: `Rolagem — ${lastExpr}`,
        text: `${describeFull(lastRoll)} = ${lastRoll.total}`,
      });
      toast('Rolagem registrada no diário', 'ok');
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      roll(input.value.trim() || '1d20');
    }
  });
}

function paintStage(stage) {
  if (!stage) return;
  if (!lastRoll) {
    stage.innerHTML = `<div class="dice-stage">
      <div class="dice-total" style="color:var(--faint)">—</div>
      <div class="dice-detail">Escolha um dado acima ou digite uma expressão</div>
    </div>`;
    return;
  }
  const r = lastRoll;
  const verdict = r.nat20
    ? '<div class="dice-verdict crit">20 natural — crítico</div>'
    : r.nat1
      ? '<div class="dice-verdict fumble">1 natural — falha crítica</div>'
      : r.advantage !== 'normal'
        ? `<div class="dice-verdict" style="color:var(--muted)">${esc(r.advantage)}</div>`
        : '';
  stage.innerHTML = `<div class="dice-stage">
    <div class="dice-total">${r.total}</div>
    <div class="dice-detail">${esc(describeFull(r))}</div>
    ${verdict}
  </div>`;
}

function rollCountLabel() {
  const n = state.rolls.length;
  return `${n} ${n === 1 ? 'rolagem' : 'rolagens'}`;
}

function paintHistory(host) {
  if (!host) return;
  const count = host.parentElement?.querySelector('#roll-count');
  if (count) count.textContent = rollCountLabel();
  if (!state.rolls.length) {
    host.innerHTML = '<p class="small muted" style="margin:0">Nenhuma rolagem ainda. O histórico vive só nesta sessão.</p>';
    return;
  }
  host.innerHTML = `<div class="rollog">
    ${state.rolls.slice(0, 12).map((r) => `<div class="rollog__item">
      <span class="rollog__expr">${esc(r.expr)}</span>
      <span class="rollog__val">${r.total}</span>
    </div>`).join('')}
  </div>`;
}
