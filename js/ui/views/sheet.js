/* ============================================================
   View: Ficha de personagem
   ============================================================ */

import { esc, toast, openModal, confirmDialog } from '../../core/dom.js';
import { state, touch, addJournal, logRoll, adjustTension } from '../../state.js';
import { derive, xpProgress, levelUp, rerollAbilities } from '../../game/character.js';
import { ABILITIES, CONDITIONS, BACKGROUNDS, findBy } from '../../data/rules.js';
import { renderPortrait } from '../../art/portrait.js';
import { pageHead, icon, signed, emptyState, xpBar } from '../parts.js';
import { rollD20, rollExpression } from '../../core/dice.js';
import { makeRng } from '../../core/rng.js';
import { openNewCampaign } from '../newcampaign.js';

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export function render(container) {
  const campaign = state.campaign;

  if (!campaign || !campaign.character) {
    container.innerHTML = `<div class="v-sheet">
      ${pageHead({ eyebrow: 'Personagem', title: 'Ficha' })}
      ${emptyState({
        iconName: 'user',
        title: 'Nenhum personagem ainda',
        text: 'Crie uma campanha para gerar uma ficha completa — atributos, perícias, equipamento e retrato.',
        action: '<button class="btn btn--primary" type="button" data-new>Criar campanha</button>',
      })}
    </div>`;
    container.firstElementChild.addEventListener('click', (e) => {
      if (e.target.closest('[data-new]')) openNewCampaign();
    });
    return;
  }

  const c = campaign.character;
  const d = derive(c);
  const xp = xpProgress(c);
  const canLevel = d.xpNext !== null && d.xp >= d.xpNext && d.level < 20;
  const hpPct = Math.round((d.hpCurrent / d.maxHp) * 100);
  const bg = findBy(BACKGROUNDS, c.background);

  container.innerHTML = `<div class="v-sheet">
    ${pageHead({
      eyebrow: 'Ficha de personagem',
      title: c.name,
      desc: `${esc(d.cls.label)} ${esc(d.ancestry.label)} · ${esc(bg.label)} · Nível ${d.level}`,
      actions: `
        <button class="btn btn--sm" type="button" data-rest>${icon('heart')}Descanso</button>
        <button class="btn btn--sm btn--primary" type="button" data-edit>${icon('settings')}Editar</button>`,
    })}

    <section class="card ornate">
      <div class="sheet__top">
        <div class="sheet__art">${renderPortrait(c.portraitSeed, { ancestry: c.ancestry })}</div>
        <div class="sheet__id">
          <h2>${esc(c.name)}</h2>
          <p class="muted small" style="margin:0 0 8px">${esc(d.cls.blurb)}</p>
          <div class="sheet__meta">
            <span class="chip chip--gold">Nível ${d.level}</span>
            <span class="chip">${esc(d.ancestry.size)}</span>
            <span class="chip">${icon('compass')} ${d.speed} m</span>
            <span class="chip">${icon('shield')} Defesa ${d.defense}</span>
          </div>
          <div style="margin-top:14px;max-width:340px">${xpBar(xp.pct, xp.label)}</div>
          ${canLevel ? `<button class="btn btn--sm btn--primary" type="button" data-levelup style="margin-top:10px">${icon('bolt')}Subir para o nível ${d.level + 1}</button>` : ''}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="card">
        <div class="card__head">
          <div class="card__title">${icon('spark', 'gold')}<h3>Atributos</h3></div>
          <span class="tiny muted">clique para testar</span>
        </div>
        <div class="abilities">
          ${ABILITIES.map((a) => `
            <button class="ability" type="button" data-roll-ability="${a.key}" title="Teste de ${esc(a.label)}">
              <span class="ability__k">${a.short}</span>
              <span class="ability__mod">${signed(d.mods[a.key])}</span>
              <span class="ability__score">${esc(c.abilities[a.key])}</span>
            </button>`).join('')}
        </div>
      </div>
    </section>

    <section class="section grid grid--2">
      <div class="card">
        <div class="card__head"><h3>Combate e resistência</h3></div>
        <div class="statgrid">
          <div class="stat stat--wide">
            <div class="stat__k">Pontos de vida</div>
            <div class="row row--between" style="gap:8px">
              <div class="stat__v nums">${d.hpCurrent}<small>/${d.maxHp}</small></div>
              <div class="row" style="gap:3px">
                <button class="iconbtn" style="width:30px;height:30px" type="button" data-hp="-1" aria-label="Perder 1 PV">${icon('minus')}</button>
                <button class="iconbtn" style="width:30px;height:30px" type="button" data-hp="1" aria-label="Recuperar 1 PV">${icon('plus')}</button>
              </div>
            </div>
            <div class="hpbar" style="margin-top:8px"><i style="width:${hpPct}%"></i></div>
          </div>
          <div class="stat"><div class="stat__k">Defesa</div><div class="stat__v nums">${d.defense}</div></div>
          <div class="stat"><div class="stat__k">Iniciativa</div><div class="stat__v nums">${signed(d.initiative)}</div></div>
          <div class="stat"><div class="stat__k">Proficiência</div><div class="stat__v nums">${signed(d.prof)}</div></div>
          <div class="stat"><div class="stat__k">Perc. passiva</div><div class="stat__v nums">${d.passivePerception}</div></div>
        </div>

        <hr class="rule" />
        <table class="table">
          <thead><tr><th>Arma</th><th class="num">Ataque</th><th class="num">Dano</th><th></th></tr></thead>
          <tbody>
            ${d.attacks.map((w, i) => `<tr>
              <td>${esc(w.name)}${w.note ? `<div class="tiny dim">${esc(w.note)}</div>` : ''}</td>
              <td class="num">${signed(w.bonus)}</td>
              <td class="num">${esc(w.damage)}${w.damageBonus ? signed(w.damageBonus) : ''}</td>
              <td class="num" style="white-space:nowrap">
                <button class="btn btn--sm btn--ghost" type="button" data-roll-attack="${i}">atacar</button>
                <button class="btn btn--sm btn--ghost" type="button" data-roll-damage="${i}">dano</button>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="card__head">
          <div class="card__title">${icon('book', 'gold')}<h3>Perícias</h3></div>
          <span class="tiny muted">${d.skills.filter((s) => s.prof).length} com proficiência</span>
        </div>
        <div class="skills">
          ${d.skills.map((s) => `
            <button class="skill ${s.prof ? 'is-prof' : ''}" type="button" data-roll-skill="${s.key}" style="background:none;border-left:0;border-right:0;border-top:0;text-align:left;cursor:pointer;font:inherit">
              <span class="skill__mark"></span>
              <span class="skill__name">${esc(s.label)} <span class="tiny dim">${s.ability.toUpperCase()}</span></span>
              <span class="skill__val">${signed(s.total)}</span>
            </button>`).join('')}
        </div>
      </div>
    </section>

    <section class="section grid grid--2">
      <div class="card">
        <div class="card__head"><h3>Personalidade</h3></div>
        <dl class="kv">
          <dt>Traço</dt><dd>${esc(c.traits.personality || '—')}</dd>
          <dt>Ideal</dt><dd>${esc(c.traits.ideal || '—')}</dd>
          <dt>Vínculo</dt><dd>${esc(c.traits.bond || '—')}</dd>
          <dt>Defeito</dt><dd>${esc(c.traits.flaw || '—')}</dd>
        </dl>
        <hr class="rule" />
        <dl class="kv">
          <dt>Aparência</dt><dd>${esc(c.appearance.look || '—')}</dd>
          <dt>Voz</dt><dd>${esc(c.appearance.voice || '—')}</dd>
          <dt>Maneirismo</dt><dd>${esc(c.appearance.quirk || '—')}</dd>
        </dl>
      </div>

      <div class="card">
        <div class="card__head">
          <div class="card__title">${icon('mug', 'gold')}<h3>Equipamento</h3></div>
          <span class="tiny muted">${c.coins.po} po · ${c.coins.pp} pp · ${c.coins.pc} pc</span>
        </div>
        <ul class="bullets">
          ${c.gear.map((item) => `<li>${esc(item)}</li>`).join('') || '<li class="dim">Nada além da roupa do corpo.</li>'}
        </ul>
      </div>
    </section>

    <section class="section grid grid--2">
      <div class="card">
        <div class="card__head"><h3>Condições</h3><span class="tiny muted">clique para alternar</span></div>
        <div class="taglist">
          ${CONDITIONS.map((cond) => {
            const on = (c.conditions || []).includes(cond);
            return `<button class="chip ${on ? 'chip--blood' : ''}" type="button" data-condition="${esc(cond)}" aria-pressed="${on}">${on ? icon('check') : ''}${esc(cond)}</button>`;
          }).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card__head"><h3>Anotações</h3></div>
        <textarea id="pc-notes" rows="5" placeholder="Nomes, dívidas, pistas, promessas...">${esc(c.notes || '')}</textarea>
      </div>
    </section>
  </div>`;

  const root = container.firstElementChild;

  // Notas: salva sem re-renderizar
  let notesTimer = null;
  root.querySelector('#pc-notes')?.addEventListener('input', (e) => {
    clearTimeout(notesTimer);
    const value = e.target.value;
    notesTimer = setTimeout(() => {
      c.notes = value;
      touch('notes');
    }, 500);
  });

  root.addEventListener('click', async (e) => {
    const t = e.target;
    const abilityBtn = t.closest('[data-roll-ability]');
    const skillBtn = t.closest('[data-roll-skill]');
    const attackBtn = t.closest('[data-roll-attack]');
    const damageBtn = t.closest('[data-roll-damage]');

    if (abilityBtn) {
      const key = abilityBtn.dataset.rollAbility;
      const label = ABILITIES.find((a) => a.key === key)?.label || key;
      doCheck(`Teste de ${label}`, d.mods[key]);
      return;
    }

    if (skillBtn) {
      const key = skillBtn.dataset.rollSkill;
      const skill = d.skills.find((s) => s.key === key);
      doCheck(skill.label, skill.total, skill.prof);
      return;
    }

    if (attackBtn) {
      const w = d.attacks[Number(attackBtn.dataset.rollAttack)];
      if (!w) return;
      const r = doCheck(`Ataque — ${w.name}`, w.bonus);
      if (r) addJournal({
        kind: 'rolagem',
        title: `Ataque — ${w.name}`,
        text: `d20 ${r.dice[0].kept[0]} ${signed(w.bonus)} = ${r.total}${r.nat20 ? ' (crítico!)' : r.nat1 ? ' (falha crítica)' : ''}`,
      });
      return;
    }

    if (damageBtn) {
      const w = d.attacks[Number(damageBtn.dataset.rollDamage)];
      if (!w) return;
      try {
        const r = rollExpression(`${w.damage}${w.damageBonus ? (w.damageBonus > 0 ? `+${w.damageBonus}` : w.damageBonus) : ''}`);
        logRoll({ expr: `${w.name} (dano)`, total: r.total, at: Date.now() });
        toast(`Dano — ${w.name}: ${r.total}`, 'ok');
      } catch {
        toast('Não foi possível rolar o dano', 'bad');
      }
      return;
    }

    const hpBtn = t.closest('[data-hp]');
    if (hpBtn) {
      const delta = Number(hpBtn.dataset.hp);
      c.hp.current = clamp(d.hpCurrent + delta, 0, d.maxHp);
      touch('hp');
      render(container);
      return;
    }

    const condBtn = t.closest('[data-condition]');
    if (condBtn) {
      const cond = condBtn.dataset.condition;
      const list = c.conditions || [];
      c.conditions = list.includes(cond) ? list.filter((x) => x !== cond) : [...list, cond];
      touch('conditions');
      render(container);
      return;
    }

    if (t.closest('[data-rest]')) {
      c.hp.current = d.maxHp;
      c.conditions = [];
      adjustTension(-1);
      addJournal({ kind: 'marco', title: 'Descanso longo', text: `${c.name} descansa e recupera todas as forças.` });
      toast('Descanso longo: PV cheios, condições limpas', 'ok');
      render(container);
      return;
    }

    if (t.closest('[data-levelup]')) {
      const { character, gained } = levelUp(c);
      state.campaign.character = character;
      addJournal({
        kind: 'marco',
        title: `Nível ${character.level}`,
        text: `${character.name} alcança o nível ${character.level}. +${gained} PV.`,
      });
      toast(`Nível ${character.level}! +${gained} PV`, 'ok');
      render(container);
      return;
    }

    if (t.closest('[data-edit]')) {
      openEdit(container);
      return;
    }

    if (t.closest('[data-new]')) {
      openNewCampaign();
    }
  });
}

function doCheck(label, bonus, isProf = false) {
  const r = rollD20(bonus);
  const die = r.dice[0]?.kept[0] ?? 0;
  logRoll({ expr: label, total: r.total, at: Date.now() });
  const verdict = r.nat20 ? ' — crítico!' : r.nat1 ? ' — falha crítica' : '';
  toast(`${label}: ${r.total} (d20 ${die} ${signed(bonus)})${verdict}`, r.nat20 ? 'ok' : r.nat1 ? 'bad' : '');
  return r;
}

function openEdit(container) {
  const c = state.campaign.character;
  const { el, close } = openModal({
    title: 'Editar ficha',
    body: `<form class="stack">
      <label class="field"><span>Nome</span><input type="text" name="name" value="${esc(c.name)}" maxlength="60" /></label>
      <div class="grid grid--2 keep">
        <label class="field"><span>Nível</span><input type="number" name="level" min="1" max="20" value="${c.level}" /></label>
        <label class="field"><span>Experiência</span><input type="number" name="xp" min="0" step="50" value="${c.xp}" /></label>
      </div>
      <label class="field"><span>PV atual</span><input type="number" name="hp" min="0" value="${c.hp.current}" /></label>
      <div class="grid grid--3 keep">
        <label class="field"><span>Ouro</span><input type="number" name="po" min="0" value="${c.coins.po}" /></label>
        <label class="field"><span>Prata</span><input type="number" name="pp" min="0" value="${c.coins.pp}" /></label>
        <label class="field"><span>Cobre</span><input type="number" name="pc" min="0" value="${c.coins.pc}" /></label>
      </div>
      <hr class="rule" />
      <button class="btn btn--ghost" type="button" data-reroll>${icon('refresh')}Rolar atributos novamente</button>
      <p class="tiny muted" style="margin:0">Rolar os atributos mantém linhagem, classe e histórico, mas troca os valores e recalcula os PV.</p>
    </form>`,
    footer: `
      <button class="btn btn--ghost" type="button" data-close>Cancelar</button>
      <button class="btn btn--primary" type="button" data-save>Salvar</button>`,
  });

  el.querySelector('[data-save]').addEventListener('click', () => {
    const form = el.querySelector('form');
    c.name = form.elements.name.value.trim() || c.name;
    c.level = clamp(Number(form.elements.level.value) || 1, 1, 20);
    c.xp = Math.max(0, Number(form.elements.xp.value) || 0);
    c.coins = {
      po: Math.max(0, Number(form.elements.po.value) || 0),
      pp: Math.max(0, Number(form.elements.pp.value) || 0),
      pc: Math.max(0, Number(form.elements.pc.value) || 0),
    };
    const d = derive(c);
    c.hp.max = d.maxHp;
    c.hp.current = clamp(Number(form.elements.hp.value) || 0, 0, d.maxHp);
    touch('edit');
    close();
    render(container);
    toast('Ficha atualizada', 'ok');
  });

  el.querySelector('[data-reroll]').addEventListener('click', async () => {
    const ok = await confirmDialog({
      title: 'Rolar atributos',
      message: 'Os seis atributos serão sorteados de novo. O nível e o equipamento continuam.',
      confirmLabel: 'Rolar',
    });
    if (!ok) return;
    const next = rerollAbilities(c, makeRng(`reroll:${Date.now()}`));
    state.campaign.character = next;
    touch('reroll');
    close();
    render(container);
    toast('Novos atributos rolados', 'ok');
  });
}
