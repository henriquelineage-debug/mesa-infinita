/* ============================================================
   View: Geradores (NPC, taverna, missão, masmorra, tabelas)
   ============================================================ */

import { esc, toast, copyText } from '../../core/dom.js';
import { state, addJournal } from '../../state.js';
import { makeRng, newSeed } from '../../core/rng.js';
import {
  generateNPC, generateTavern, generateQuest, generateDungeon, rollTable, TABLE_OPTIONS,
} from '../../game/generator.js';
import { renderPortrait } from '../../art/portrait.js';
import { renderSigil } from '../../art/sigil.js';
import { renderDungeonMap } from '../../art/dungeonmap.js';
import { pageHead, icon, emptyState, artFrame } from '../parts.js';

const TABS = [
  { key: 'npc', label: 'NPC', icon: 'user', gen: generateNPC, title: 'NPC', cta: 'Gerar NPC' },
  { key: 'taverna', label: 'Taverna', icon: 'mug', gen: generateTavern, title: 'Taverna', cta: 'Gerar taverna' },
  { key: 'missao', label: 'Missão', icon: 'flag', gen: generateQuest, title: 'Missão', cta: 'Gerar missão' },
  { key: 'masmorra', label: 'Masmorra', icon: 'map', gen: generateDungeon, title: 'Masmorra', cta: 'Gerar masmorra' },
  { key: 'tabelas', label: 'Tabelas', icon: 'grid', title: 'Tabelas', cta: 'Sortear' },
];

let tab = 'npc';
let tableKey = 'rumor';
let tableResult = null;
let tableHistory = [];

export function render(container) {
  const current = TABS.find((t) => t.key === tab) || TABS[0];

  container.innerHTML = `<div class="v-generate">
    ${pageHead({
      eyebrow: 'Mesa',
      title: 'Geradores',
      desc: 'Cada resultado nasce de uma semente. Salve no diário o que valer a pena.',
      actions: `<button class="btn btn--sm btn--primary" type="button" data-generate>${icon('wand')}${esc(current.cta)}</button>`,
    })}

    <div class="genbar" role="tablist" aria-label="Tipo de gerador">
      ${TABS.map((t) => `<button type="button" role="tab" data-tab="${t.key}" aria-selected="${t.key === tab}">${esc(t.label)}</button>`).join('')}
    </div>

    <div id="gen-out">${content()}</div>
  </div>`;

  const root = container.firstElementChild;

  root.addEventListener('change', (e) => {
    if (e.target.id === 'table-select') rollTableNow(e.target.value, container);
  });

  root.addEventListener('click', async (e) => {
    const t = e.target;

    const tabBtn = t.closest('[data-tab]');
    if (tabBtn) {
      tab = tabBtn.dataset.tab;
      render(container);
      return;
    }

    if (t.closest('[data-generate]')) {
      if (tab === 'tabelas') {
        rollTableNow(tableKey, container);
      } else {
        generate(container);
      }
      return;
    }

    const tableBtn = t.closest('[data-table]');
    if (tableBtn) {
      tableKey = tableBtn.dataset.table;
      rollTableNow(tableKey, container);
      return;
    }

    if (t.closest('[data-save-gen]')) {
      const payload = journalPayload();
      if (!payload) return;
      addJournal({ kind: 'gerador', title: payload.title, text: payload.text });
      toast('Salvo no diário', 'ok');
      return;
    }

    if (t.closest('[data-copy-gen]')) {
      const payload = journalPayload();
      if (!payload) return;
      const ok = await copyText(`${payload.title}\n\n${payload.text}`);
      toast(ok ? 'Copiado' : 'Não foi possível copiar', ok ? 'ok' : 'bad');
    }
  });
}

function generate(container) {
  const entry = TABS.find((t) => t.key === tab);
  if (!entry || !entry.gen) return;
  const seed = newSeed();
  const rng = makeRng(seed);
  const result = entry.gen(rng);
  result.seed = seed;
  state.generated[tab] = result;
  render(container);
}

function rollTableNow(key, container) {
  tableKey = key;
  const seed = newSeed();
  tableResult = { ...rollTable(makeRng(seed), key), seed };
  tableHistory = [tableResult, ...tableHistory].slice(0, 8);
  render(container);
}

/* ---------------- conteúdo por aba ---------------- */

function content() {
  if (tab === 'tabelas') return tablesTab();
  const data = state.generated[tab];
  if (!data) return emptyState({
    iconName: TABS.find((t) => t.key === tab)?.icon || 'wand',
    title: `Nada gerado ainda`,
    text: 'Um clique cria um resultado completo — com arte procedural quando faz sentido.',
    action: `<button class="btn btn--primary" type="button" data-generate>${icon('wand')}${esc(TABS.find((t) => t.key === tab)?.cta)}</button>`,
  });

  switch (tab) {
    case 'npc': return npcCard(data);
    case 'taverna': return tavernCard(data);
    case 'missao': return questCard(data);
    case 'masmorra': return dungeonCard(data);
    default: return '';
  }
}

function actions() {
  return `<div class="row row--wrap" style="gap:8px;margin-top:16px">
    <button class="btn btn--sm btn--primary" type="button" data-generate>${icon('refresh')}Gerar outro</button>
    <button class="btn btn--sm" type="button" data-save-gen>${icon('scroll')}Salvar no diário</button>
    <button class="btn btn--sm btn--ghost" type="button" data-copy-gen>${icon('copy')}Copiar</button>
  </div>`;
}

function npcCard(n) {
  return `<div class="gen-out grid grid--2">
    <div>${artFrame(renderPortrait(n.portraitSeed, { ancestry: n.ancestry }), 'artframe--sm')}</div>
    <div>
      <h2 class="gen-title">${esc(n.name)}${n.epithet ? `, ${esc(n.epithet)}` : ''}</h2>
      <p class="gen-sub">${esc(n.ancestryLabel)} · ${esc(n.occupation)}</p>
      <div class="row row--wrap" style="gap:6px;margin-bottom:12px">
        <span class="chip chip--gold">${esc(n.age)}</span>
        ${n.faction ? `<span class="chip chip--violet">${esc(n.faction)}</span>` : ''}
      </div>
      <dl class="dl">
        <dt>Aparência</dt><dd>${esc(n.look)}</dd>
        <dt>Voz</dt><dd>${esc(n.voice)}</dd>
        <dt>Maneirismo</dt><dd>${esc(n.quirk)}</dd>
        <dt>Desejo</dt><dd>${esc(n.desire)}</dd>
        <dt>Segredo</dt><dd>${esc(n.secret)}</dd>
      </dl>
      ${actions()}
      <p class="tiny dim" style="margin:12px 0 0">semente: ${esc(n.seed || '—')}</p>
    </div>
  </div>`;
}

function tavernCard(t) {
  return `<div class="gen-out">
    <div class="grid grid--2">
      <div>${artFrame(renderSigil(t.sigilSeed), 'artframe--sm')}</div>
      <div>
        <h2 class="gen-title">${esc(t.name)}</h2>
        <p class="gen-sub">${esc(t.where)}</p>
        <p class="quote">${esc(t.ambience)}</p>
        <div class="row row--wrap" style="gap:6px;margin-top:12px">
          <span class="chip chip--gold">${esc(t.price)}</span>
          <span class="chip">${esc(t.owner.name)}${t.owner.epithet ? `, ${esc(t.owner.epithet)}` : ''}</span>
        </div>
      </div>
    </div>
    <hr class="rule" />
    <div class="grid grid--2">
      <dl class="dl">
        <dt>Dono</dt><dd>${esc(t.owner.name)} — ${esc(t.owner.mood)}</dd>
        <dt>Comida</dt><dd>${esc(t.food)}</dd>
        <dt>Bebida</dt><dd>${esc(t.drink)}</dd>
        <dt>Música</dt><dd>${esc(t.music)}</dd>
      </dl>
      <dl class="dl">
        <dt>Regra da casa</dt><dd>${esc(t.houseRule)}</dd>
        <dt>Acontecendo</dt><dd>${esc(t.event)}</dd>
      </dl>
    </div>
    <div class="panel-inset" style="margin-top:14px">
      <p class="eyebrow" style="margin-bottom:6px">Rumores no balcão</p>
      <ul class="bullets">${t.rumors.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
    </div>
    ${actions()}
    <p class="tiny dim" style="margin:12px 0 0">semente: ${esc(t.seed || '—')}</p>
  </div>`;
}

function questCard(q) {
  return `<div class="gen-out">
    <h2 class="gen-title">${esc(q.title)}</h2>
    <p class="gen-sub">${esc(q.type)} · ${esc(q.place)}</p>
    <div class="row row--wrap" style="gap:6px;margin-bottom:14px">
      <span class="chip chip--gold">${q.gold} po</span>
      <span class="chip chip--blood">${esc(q.deadline)}</span>
      <span class="chip">${esc(q.location)}</span>
    </div>
    <p class="quote">${esc(q.hook)}</p>
    <p style="margin-top:14px">${esc(q.goal)}</p>
    <dl class="dl">
      <dt>Patrono</dt><dd>${esc(q.patron)}</dd>
      <dt>Alvo</dt><dd>${esc(q.target)}</dd>
      <dt>Obstáculo</dt><dd>${esc(q.obstacle)}</dd>
      <dt>Recompensa</dt><dd>${esc(q.reward)}</dd>
      <dt class="blood">Reviravolta</dt><dd class="blood">${esc(q.twist)}</dd>
    </dl>
    ${actions()}
    <p class="tiny dim" style="margin:12px 0 0">semente: ${esc(q.seed || '—')}</p>
  </div>`;
}

function dungeonCard(dg) {
  return `<div class="gen-out">
    <h2 class="gen-title">${esc(dg.name)}</h2>
    <p class="gen-sub">${esc(dg.theme.label)} · ${esc(dg.theme.motif)}</p>
    <div class="row row--wrap" style="gap:6px;margin-bottom:14px">
      <span class="chip chip--gold">${dg.rooms.length} salas</span>
      <span class="chip chip--blood">Guardião: ${esc(dg.boss)}</span>
    </div>
    ${artFrame(renderDungeonMap(dg))}
    <div style="margin-top:16px">
      <table class="table">
        <thead><tr><th>#</th><th>Sala</th><th>Detalhe</th></tr></thead>
        <tbody>
          ${dg.rooms.map((r) => `<tr>
            <td class="num">${r.index}${r.isEntrance ? ' <span class="chip chip--moss">entrada</span>' : ''}${r.isBoss ? ' <span class="chip chip--blood">final</span>' : ''}</td>
            <td><b>${esc(r.type)}</b>${r.danger ? `<div class="tiny blood">Perigo: ${esc(r.danger)}</div>` : ''}</td>
            <td class="small">${esc(r.feature || '—')}${r.loot ? `<div class="tiny dim">Tesouro: ${esc(r.loot)}</div>` : ''}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    ${actions()}
    <p class="tiny dim" style="margin:12px 0 0">semente: ${esc(dg.seed || '—')}</p>
  </div>`;
}

function tablesTab() {
  const result = tableResult;
  return `<div class="gen-out">
    <div class="card">
      <div class="card__head">
        <div class="card__title">${icon('grid', 'gold')}<h3>Sortear uma tabela</h3></div>
        <span class="tiny muted">${TABLE_OPTIONS.length} tabelas</span>
      </div>
      <div class="row" style="gap:8px;flex-wrap:wrap">
        <select id="table-select" style="flex:1 1 200px" aria-label="Tabela">
          ${TABLE_OPTIONS.map((o) => `<option value="${o.key}" ${o.key === tableKey ? 'selected' : ''}>${esc(o.label)}</option>`).join('')}
        </select>
        <button class="btn btn--primary" type="button" data-generate>${icon('dice')}Sortear</button>
      </div>
      <div class="row row--wrap" style="gap:6px;margin-top:12px">
        ${TABLE_OPTIONS.map((o) => `<button class="chip" type="button" data-table="${o.key}" style="cursor:pointer">${esc(o.label)}</button>`).join('')}
      </div>
      ${result ? `<div class="answer" style="margin-top:16px;text-align:left">
        <p class="eyebrow" style="margin-bottom:6px">${esc(result.label)}</p>
        <p class="serif" style="font-size:1.15rem;margin:0">${esc(result.text)}</p>
      </div>
      <div class="row" style="margin-top:12px;gap:8px">
        <button class="btn btn--sm" type="button" data-save-gen>${icon('scroll')}Salvar no diário</button>
        <button class="btn btn--sm btn--ghost" type="button" data-copy-gen>${icon('copy')}Copiar</button>
      </div>` : ''}
    </div>

    ${tableHistory.length > 1 ? `<div class="card" style="margin-top:14px">
      <div class="card__head"><h3>Sorteados agora</h3></div>
      <div class="rollog">
        ${tableHistory.slice(1).map((r) => `<div class="rollog__item">
          <span class="rollog__expr">${esc(r.label)}</span>
          <span class="small" style="text-align:right">${esc(r.text)}</span>
        </div>`).join('')}
      </div>
    </div>` : ''}
  </div>`;
}

/* ---------------- texto para diário / cópia ---------------- */

function journalPayload() {
  if (tab === 'tabelas') {
    if (!tableResult) return null;
    return { title: tableResult.label, text: tableResult.text };
  }

  const data = state.generated[tab];
  if (!data) return null;

  switch (tab) {
    case 'npc':
      return {
        title: `NPC — ${data.name}${data.epithet ? `, ${data.epithet}` : ''}`,
        text: [
          `${data.ancestryLabel} · ${data.occupation}`,
          `Idade: ${data.age}`,
          `Aparência: ${data.look}`,
          `Voz: ${data.voice}`,
          `Maneirismo: ${data.quirk}`,
          `Desejo: ${data.desire}`,
          `Segredo: ${data.secret}`,
          data.faction ? `Facção: ${data.faction}` : '',
        ].filter(Boolean).join('\n'),
      };
    case 'taverna':
      return {
        title: `Taverna — ${data.name}`,
        text: [
          data.where,
          data.ambience,
          `Dono: ${data.owner.name} (${data.owner.mood})`,
          `Comida: ${data.food}`,
          `Bebida: ${data.drink} · Preço: ${data.price}`,
          `Regra da casa: ${data.houseRule}`,
          `Música: ${data.music}`,
          `Acontecendo: ${data.event}`,
          `Rumores:\n- ${data.rumors.join('\n- ')}`,
        ].join('\n'),
      };
    case 'missao':
      return {
        title: `Missão — ${data.title}`,
        text: [
          `${data.type} · ${data.place} · ${data.deadline}`,
          data.goal,
          `Gancho: ${data.hook}`,
          `Patrono: ${data.patron}`,
          `Alvo: ${data.target}`,
          `Obstáculo: ${data.obstacle}`,
          `Recompensa: ${data.reward} (${data.gold} po)`,
          `Reviravolta: ${data.twist}`,
        ].join('\n'),
      };
    case 'masmorra':
      return {
        title: `Masmorra — ${data.name}`,
        text: [
          `${data.theme.label} · ${data.theme.motif}`,
          `Guardião: ${data.boss}`,
          ...data.rooms.map((r) => `${r.index}. ${r.type}${r.feature ? ` — ${r.feature}` : ''}${r.danger ? ` (perigo: ${r.danger})` : ''}`),
        ].join('\n'),
      };
    default:
      return null;
  }
}
