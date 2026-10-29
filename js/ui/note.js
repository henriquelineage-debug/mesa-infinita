/* ============================================================
   Modal: nota rápida no diário
   ============================================================ */

import { openModal } from '../core/dom.js';
import { addJournal } from '../state.js';

export function openNoteModal(onDone) {
  const { el, close } = openModal({
    title: 'Nota no diário',
    body: `<div class="stack">
      <label class="field">
        <span>Título</span>
        <input type="text" name="title" maxlength="80" placeholder="O que aconteceu?" />
      </label>
      <label class="field">
        <span>Nota</span>
        <textarea name="text" rows="6" placeholder="Escreva em suas palavras. O diário aceita tudo."></textarea>
      </label>
    </div>`,
    footer: `
      <button class="btn btn--ghost" type="button" data-close>Cancelar</button>
      <button class="btn btn--primary" type="button" data-save>Registrar</button>`,
  });

  const save = () => {
    const title = el.querySelector('[name="title"]').value.trim();
    const text = el.querySelector('[name="text"]').value.trim();
    if (!title && !text) return;
    addJournal({ kind: 'nota', title: title || 'Nota', text });
    close();
    onDone?.();
  };

  el.querySelector('[data-save]').addEventListener('click', save);
  el.querySelector('[name="text"]').addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') save();
  });
}
