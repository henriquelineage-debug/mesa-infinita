/* ============================================================
   Modal: nova campanha
   ============================================================ */

import { openModal, esc, toast } from '../core/dom.js';
import { makeRng, newSeed, uid } from '../core/rng.js';
import { ANCESTRIES, CLASSES } from '../data/rules.js';
import { generateCharacter } from '../game/character.js';
import { openScene, sceneNarrative } from '../game/oracle.js';
import { setCampaign } from '../state.js';
import { field, selectField, icon } from './parts.js';

const ancestryOptions = [
  { value: '', label: 'Aleatória' },
  ...ANCESTRIES.map((a) => ({ value: a.key, label: a.label })),
];
const classOptions = [
  { value: '', label: 'Aleatória' },
  ...CLASSES.map((c) => ({ value: c.key, label: c.label })),
];

export function openNewCampaign({ onDone } = {}) {
  const suggestedSeed = newSeed();

  const { el, close } = openModal({
    title: 'Nova campanha',
    wide: true,
    body: `<form id="nc-form" novalidate>
      <div class="stack">
        ${field({
          label: 'Nome da campanha',
          name: 'name',
          placeholder: 'Deixe vazio para usar a semente',
          attrs: 'maxlength="60" autocomplete="off"',
        })}
        ${field({
          label: 'Semente',
          name: 'seed',
          value: suggestedSeed,
          hint: 'A mesma semente gera o mesmo herói e a mesma cena de abertura. Guarde-a para compartilhar.',
          attrs: 'maxlength="60" autocomplete="off"',
        })}
        <div class="panel-inset">
          <div class="row row--between" style="flex-wrap:wrap">
            <div>
              <div class="setting-row__label">Seu herói</div>
              <div class="setting-row__hint">Gerar cria uma ficha completa em um clique.</div>
            </div>
            <div class="seg" role="group" aria-label="Como criar o personagem">
              <button type="button" data-mode="auto" aria-pressed="true">Gerar</button>
              <button type="button" data-mode="pick" aria-pressed="false">Escolher</button>
            </div>
          </div>
          <div class="grid grid--2" id="pick-fields" hidden style="margin-top:14px">
            ${selectField({ label: 'Linhagem', name: 'ancestry', options: ancestryOptions, value: '' })}
            ${selectField({ label: 'Classe', name: 'class', options: classOptions, value: '' })}
          </div>
        </div>
        <p class="tiny muted" style="margin:0">
          Nada sai do seu navegador. A campanha fica salva localmente e pode ser exportada a qualquer momento.
        </p>
      </div>
    </form>`,
    footer: `
      <button class="btn btn--ghost" type="button" data-close>Cancelar</button>
      <button class="btn btn--primary" type="button" data-create>${icon('spark')}Começar</button>`,
  });

  const form = el.querySelector('#nc-form');
  const pickFields = el.querySelector('#pick-fields');
  const modeButtons = el.querySelectorAll('[data-mode]');

  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      modeButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      pickFields.hidden = btn.dataset.mode !== 'pick';
    });
  });

  el.querySelector('[data-create]').addEventListener('click', () => {
    const nameInput = form.elements.name;
    const seedInput = form.elements.seed;
    const seed = (seedInput.value || '').trim() || newSeed();
    const name = (nameInput.value || '').trim() || `Crônica de ${seed}`;

    const rng = makeRng(seed);
    const usePick = pickFields.hidden === false;
    const character = generateCharacter(rng.fork('heroi'), {
      ancestryKey: usePick ? form.elements.ancestry.value || undefined : undefined,
      classKey: usePick ? form.elements.class.value || undefined : undefined,
    });

    const scene = openScene(rng.fork('abertura'));
    const now = Date.now();
    const campaign = {
      id: uid('camp'),
      name,
      seed,
      createdAt: now,
      meta: { updatedAt: now },
      tension: 1,
      character,
      journal: [
        {
          id: uid('j'),
          at: now,
          kind: 'marco',
          title: 'A campanha começa',
          text: `${character.name} chega a ${scene.location.toLowerCase()}.`,
        },
        {
          id: uid('j'),
          at: now + 1,
          kind: 'cena',
          title: `Cena 1 — ${scene.location}`,
          text: sceneNarrative(scene),
        },
      ],
      scenes: [scene],
      stats: { scenes: 1, rolls: 0, oracles: 0 },
      notes: '',
    };

    setCampaign(campaign);
    close();
    toast('Campanha criada. Boa sorte.', 'ok');
    onDone?.();
  });

  // Enter envia o formulário
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    el.querySelector('[data-create]').click();
  });
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
      e.preventDefault();
      el.querySelector('[data-create]').click();
    }
  });
}
