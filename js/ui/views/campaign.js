/* ============================================================
   View: Campanha (painel principal e diário)
   ============================================================ */

import { esc, fmtRelative, toast } from '../../core/dom.js';
import { state, currentScene, addJournal, adjustTension } from '../../state.js';
import { derive, xpProgress } from '../../game/character.js';
import { sceneNarrative } from '../../game/oracle.js';
import { renderPortrait } from '../../art/portrait.js';
import { tensionControl, journalList, pageHead, emptyState, icon, xpBar, artFrame } from '../parts.js';
import { openNewCampaign } from '../newcampaign.js';

let journalVisible = 8;

export function render(container) {
  const campaign = state.campaign;

  if (!campaign) {
    container.innerHTML = `<div class="v-campaign">${welcome()}</div>`;
    const root = container.firstElementChild;
    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-new]')) openNewCampaign();
    });
    return;
  }

  const c = campaign;
  const d = derive(c.character);
  const scene = currentScene();
  const xp = xpProgress(c.character);
  const entries = c.journal.slice().reverse();

  container.innerHTML = `<div class="v-campaign">
    ${pageHead({
      eyebrow: 'Crônica ativa',
      title: c.name,
      desc: `Semente <button class="linkbtn" type="button" data-copy-seed title="Copiar semente">${esc(c.seed)}</button> · atualizada ${esc(fmtRelative(c.meta?.updatedAt))}`,
      actions: `<button class="btn btn--primary" type="button" data-new-scene>${icon('spark')}Nova cena</button>`,
    })}

    <section class="hero ornate">
      <div class="hero__inner">
        <div class="hero__art">${renderPortrait(c.character.portraitSeed, { ancestry: c.character.ancestry })}</div>
        <div>
          <p class="eyebrow" style="margin-bottom:4px">Seu personagem</p>
          <h2 class="hero__name">${esc(c.character.name)}</h2>
          <p class="hero__sub">${esc(d.cls.label)} ${esc(d.ancestry.label)} · Nível ${d.level}</p>
          <div class="hero__tags">
            <span class="chip chip--gold">${icon('heart')} ${d.hpCurrent}/${d.maxHp} PV</span>
            <span class="chip">${icon('shield')} Defesa ${d.defense}</span>
            <span class="chip">${icon('compass')} ${esc(d.ancestry.size)}</span>
          </div>
          <div style="margin-top:12px;max-width:320px">${xpBar(xp.pct, xp.label)}</div>
        </div>
      </div>
      <div class="hero__foot">
        ${tensionControl(c.tension)}
        <div class="row" style="gap:8px">
          <a class="btn btn--sm btn--ghost" href="#/ficha">${icon('user')}Ficha</a>
          <a class="btn btn--sm btn--primary" href="#/solo">${icon('play')}Continuar</a>
        </div>
      </div>
    </section>

    <section class="section grid grid--2">
      <div class="card ornate">
        <div class="card__head">
          <div class="card__title">${icon('map', 'gold')}<h2 style="font-size:1.05rem">Cena atual</h2></div>
          ${scene ? `<span class="chip">${esc(scene.kind || 'cena')}</span>` : ''}
        </div>
        ${scene ? sceneCard(scene) : emptyState({
          iconName: 'map',
          title: 'Nenhuma cena aberta',
          text: 'Abra uma cena para receber um lugar, um detalhe sensorial e um gancho.',
          action: '<button class="btn btn--sm btn--primary" type="button" data-new-scene>Abrir cena</button>',
        })}
      </div>

      <div class="card">
        <div class="card__head">
          <div class="card__title">${icon('bolt', 'gold')}<h2 style="font-size:1.05rem">Mesa rápida</h2></div>
        </div>
        <div class="grid grid--2 keep" style="gap:8px">
          <a class="btn" href="#/dados">${icon('dice')}Rolar dados</a>
          <a class="btn" href="#/solo">${icon('eye')}Oráculo</a>
          <a class="btn" href="#/gerar">${icon('wand')}Gerar NPC</a>
          <a class="btn" href="#/gerar">${icon('flag')}Missão</a>
        </div>
        <hr class="rule" style="margin:14px 0" />
        <div class="statgrid" style="grid-template-columns:repeat(3,1fr)">
          <div class="stat"><div class="stat__k">Cenas</div><div class="stat__v nums">${c.stats?.scenes || 0}</div></div>
          <div class="stat"><div class="stat__k">Rolagens</div><div class="stat__v nums">${c.stats?.rolls || 0}</div></div>
          <div class="stat"><div class="stat__k">Oráculos</div><div class="stat__v nums">${c.stats?.oracles || 0}</div></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section__head">
        <h2>Diário da campanha</h2>
        <span class="small muted">${entries.length} registro${entries.length === 1 ? '' : 's'}</span>
      </div>
      ${entries.length
        ? journalList(entries.slice(0, journalVisible))
        : emptyState({
            iconName: 'book',
            title: 'O diário está em branco',
            text: 'Cada rolagem, resposta do oráculo e cena aberta pode ser registrada aqui.',
            action: '<button class="btn btn--sm" type="button" data-add-note>Escrever uma nota</button>',
          })}
      ${entries.length > journalVisible
        ? `<div class="center" style="margin-top:14px"><button class="btn btn--sm btn--ghost" type="button" data-more>Mostrar mais (${entries.length - journalVisible})</button></div>`
        : ''}
    </section>
  </div>`;

  const root = container.firstElementChild;

  root.addEventListener('click', async (e) => {
    const target = e.target;

    if (target.closest('[data-new-scene]')) {
      const { openScene } = await import('../../game/oracle.js');
      const { makeRng } = await import('../../core/rng.js');
      const scene2 = openScene(makeRng(`${c.seed}:cena:${c.scenes.length + 1}:${Date.now()}`));
      c.scenes.push(scene2);
      c.stats.scenes = c.scenes.length;
      addJournal({ kind: 'cena', title: `Cena ${c.scenes.length} — ${scene2.location}`, text: sceneNarrative(scene2) });
      toast('Nova cena aberta', 'ok');
      render(container);
      return;
    }

    if (target.closest('[data-tension]')) {
      adjustTension(Number(target.closest('[data-tension]').dataset.tension));
      render(container);
      return;
    }

    if (target.closest('[data-more]')) {
      journalVisible += 10;
      render(container);
      return;
    }

    if (target.closest('[data-copy-seed]')) {
      const { copyText } = await import('../../core/dom.js');
      const ok = await copyText(c.seed);
      toast(ok ? 'Semente copiada' : 'Não foi possível copiar', ok ? 'ok' : 'bad');
      return;
    }

    if (target.closest('[data-add-note]')) {
      const { openNoteModal } = await import('../note.js');
      openNoteModal(() => render(container));
      return;
    }

    const del = target.closest('[data-del-journal]');
    if (del) {
      const { confirmDialog } = await import('../../core/dom.js');
      const ok = await confirmDialog({
        title: 'Apagar registro',
        message: 'Este registro será removido do diário. Não dá para desfazer.',
        confirmLabel: 'Apagar',
        danger: true,
      });
      if (!ok) return;
      const { removeJournal } = await import('../../state.js');
      removeJournal(del.dataset.delJournal);
      render(container);
    }
  });
}

function sceneCard(scene) {
  return `<div class="scene">
    <p class="scene__where">${esc(scene.location)}</p>
    <h3 class="scene__title">${esc(scene.prompt)}</h3>
    <p class="scene__text">${esc(scene.sense)}.</p>
    ${scene.presence ? `<p class="small muted" style="margin-top:8px">Presente: ${esc(scene.presence)}.</p>` : ''}
  </div>`;
}

function welcome() {
  return `
    <div class="center" style="padding:26px 0 10px">
      <div style="display:inline-grid;place-items:center;width:76px;height:76px;border:1px solid var(--line-2);border-radius:20px;background:var(--panel);color:var(--gold);margin-bottom:16px">
        <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round">
          <path d="M12 2.6 20.6 7.8v8.4L12 21.4 3.4 16.2V7.8z"/>
          <path d="M12 2.6v18.8M3.4 7.8l17.2 8.4M20.6 7.8 3.4 16.2" opacity=".5"/>
          <path d="M12 7.4 16.4 14.6H7.6z"/>
        </svg>
      </div>
      <p class="eyebrow">RPG de mesa, sozinho ou com amigos</p>
      <h1 class="balance" style="max-width:18ch;margin:0 auto 10px">Um grimório que gera mundos inteiros</h1>
      <p class="lead balance" style="max-width:52ch;margin:0 auto 22px">
        Ficha de personagem, rolador de dados, oráculo solo, NPCs, tavernas, missões e masmorras.
        Tudo é salvo no seu navegador — sem conta, sem servidor, sem pressa.
      </p>
      <div class="row" style="justify-content:center;gap:10px;flex-wrap:wrap">
        <button class="btn btn--lg btn--primary" type="button" data-new>${icon('spark')}Começar uma campanha</button>
      </div>
      <p class="tiny dim" style="margin-top:14px">Já tem um arquivo? Use o botão de ajustes no topo para importar.</p>
    </div>

    <section class="section grid grid--3">
      <div class="card">
        <p class="eyebrow">Personagens</p>
        <h3>Ficha viva</h3>
        <p class="small muted">Atributos, perícias, PV, condições e progressão de nível em um sistema d20 leve — com geração aleatória completa.</p>
      </div>
      <div class="card">
        <p class="eyebrow">Solo</p>
        <h3>Oráculo com tensão</h3>
        <p class="small muted">Perguntas de sim/não, complicações, reviravoltas e eventos. A tensão sobe quando as coisas dão errado.</p>
      </div>
      <div class="card">
        <p class="eyebrow">Mesa</p>
        <h3>Geradores com arte</h3>
        <p class="small muted">NPCs com retrato, tavernas com brasão, missões com gancho e masmorras com mapa — tudo por semente.</p>
      </div>
    </section>
  `;
}
