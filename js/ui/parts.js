/* ============================================================
   Peças de interface reutilizáveis
   ============================================================ */

import { esc, fmtDate, fmtTime } from '../core/dom.js';

const ICONS = {
  dice: '<path d="M12 2.8 20.4 7.9v8.2L12 21.2 3.6 16.1V7.9z"/><path d="M12 2.8v18.4M3.6 7.9l16.8 8.2M20.4 7.9 3.6 16.1" opacity=".5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 4v5h-5"/>',
  trash: '<path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M15 5H6a2 2 0 0 0-2 2v9"/>',
  download: '<path d="M12 3v12M7 11l5 5 5-5M4 20h16"/>',
  upload: '<path d="M12 17V5M7 9l5-5 5 5M4 20h16"/>',
  wand: '<path d="M4 20 16 8M14 6l2-2M18 10l2-2M16 14l2 2M10 4l1 2"/>',
  eye: '<path d="M2.5 12s3.6-6.2 9.5-6.2S21.5 12 21.5 12s-3.6 6.2-9.5 6.2S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.6"/>',
  scroll: '<path d="M6 3h10a2 2 0 0 1 2 2v16l-6-3-6 3V3z"/><path d="M9 8h4M9 11.5h4"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="M4 12.5 9 18 20 6"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  play: '<path d="M7 4.5v15l13-7.5z"/>',
  user: '<circle cx="12" cy="8" r="3.4"/><path d="M5 20c.6-3.6 3.5-5.6 7-5.6s6.4 2 7 5.6"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2z"/><path d="M8 3v18"/>',
  map: '<path d="M9 4 3 6v15l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v15M15 6v15"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  mug: '<path d="M5 8h11v9a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/><path d="M16 10h2a2 2 0 0 1 0 5h-2"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  spark: '<path d="M12 3.2 13.7 9l5.8 1.7-5.8 1.7L12 18.2 10.3 12.4 4.5 10.7 10.3 9z"/>',
  settings: '<path d="M4 7h10M18 7h2M4 12h4M12 12h8M4 17h12M20 17h0"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="17" r="2"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  bolt: '<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>',
  heart: '<path d="M12 20s-7-4.3-7-9.3A4 4 0 0 1 12 7a4 4 0 0 1 7 3.7c0 5-7 9.3-7 9.3z"/>',
  shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
};

export function icon(name, extra = '') {
  return `<svg class="ic ${extra}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}

export const signed = (n) => (n >= 0 ? `+${n}` : `−${Math.abs(n)}`);

export function pageHead({ eyebrow = '', title, desc = '', actions = '' }) {
  return `<div class="view__head">
    <div>
      ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
      <h1>${esc(title)}</h1>
      ${desc ? `<p class="lead" style="margin:0">${desc}</p>` : ''}
    </div>
    ${actions ? `<div class="view__actions">${actions}</div>` : ''}
  </div>`;
}

export function emptyState({ iconName = 'scroll', title, text = '', action = '' }) {
  return `<div class="empty">
    <div class="empty__icon">${icon(iconName, 'ic--lg')}</div>
    <h3 style="margin-bottom:4px">${esc(title)}</h3>
    ${text ? `<p class="small muted" style="max-width:42ch;margin:0 auto 12px">${esc(text)}</p>` : ''}
    ${action}
  </div>`;
}

export function tensionMeter(value) {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  const segs = Array.from({ length: 5 }, (_, i) => `<i class="tension__seg${i < v ? ' is-on' : ''}"></i>`).join('');
  return `<div class="tension" title="Tensão da história: ${v} de 5">
    <span class="tension__label">Tensão</span>
    <div class="tension__segs">${segs}</div>
    <b class="small nums">${v}/5</b>
  </div>`;
}

export function tensionControl(value) {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  const segs = Array.from({ length: 5 }, (_, i) => `<i class="tension__seg${i < v ? ' is-on' : ''}"></i>`).join('');
  return `<div class="row" style="gap:10px;flex-wrap:wrap">
    <div class="tension" aria-label="Tensão da história">
      <span class="tension__label">Tensão</span>
      <div class="tension__segs">${segs}</div>
      <b class="small nums">${v}/5</b>
    </div>
    <div class="row" style="gap:4px">
      <button class="iconbtn" style="width:32px;height:32px" type="button" data-tension="-1" aria-label="Diminuir tensão" ${v <= 0 ? 'disabled' : ''}>${icon('minus')}</button>
      <button class="iconbtn" style="width:32px;height:32px" type="button" data-tension="1" aria-label="Aumentar tensão" ${v >= 5 ? 'disabled' : ''}>${icon('plus')}</button>
    </div>
  </div>`;
}

export function artFrame(svg, cls = '') {
  return `<div class="artframe ${cls}">${svg}</div>`;
}

export const JOURNAL_KIND = {
  nota: 'Nota',
  rolagem: 'Rolagem',
  oraculo: 'Oráculo',
  cena: 'Cena',
  gerador: 'Gerado',
  marco: 'Marco',
};

export function journalItem(entry, { tools = true } = {}) {
  const time = `${fmtDate(entry.at, { day: '2-digit', month: '2-digit' })} ${fmtTime(entry.at)}`;
  return `<article class="jitem jitem--${esc(entry.kind)}">
    <div class="jitem__head">
      <span class="jitem__kind">${esc(JOURNAL_KIND[entry.kind] || 'Nota')}</span>
      <span class="jitem__time">${esc(time)}</span>
    </div>
    ${entry.title ? `<h3 class="jitem__title">${esc(entry.title)}</h3>` : ''}
    ${entry.text ? `<div class="jitem__body">${esc(entry.text)}</div>` : ''}
    ${tools ? `<div class="jitem__tools"><button class="linkbtn" type="button" data-del-journal="${esc(entry.id)}">apagar</button></div>` : ''}
  </article>`;
}

export function journalList(entries, { tools = true } = {}) {
  if (!entries.length) return '';
  return `<div class="journal">${entries.map((e) => journalItem(e, { tools })).join('')}</div>`;
}

export function xpBar(pct, label) {
  return `<div>
    <div class="row row--between" style="margin-bottom:4px">
      <span class="tiny muted upper">Experiência</span>
      <span class="tiny muted nums">${esc(label)}</span>
    </div>
    <div class="hpbar" style="background:#1c1710;border-color:#2a2218"><i style="width:${Math.max(0, Math.min(100, pct))}%;background:linear-gradient(90deg,#8a6f1c,#e8c968)"></i></div>
  </div>`;
}

export function field({ label, name, value = '', type = 'text', placeholder = '', hint = '', attrs = '' }) {
  return `<label class="field">
    <span>${esc(label)}</span>
    <input type="${type}" name="${esc(name)}" value="${esc(value)}" placeholder="${esc(placeholder)}" ${attrs}/>
    ${hint ? `<span class="tiny muted">${esc(hint)}</span>` : ''}
  </label>`;
}

export function selectField({ label, name, options, value, hint = '' }) {
  const opts = options
    .map((o) => `<option value="${esc(o.value)}" ${String(o.value) === String(value) ? 'selected' : ''}>${esc(o.label)}</option>`)
    .join('');
  return `<label class="field">
    <span>${esc(label)}</span>
    <select name="${esc(name)}">${opts}</select>
    ${hint ? `<span class="tiny muted">${esc(hint)}</span>` : ''}
  </label>`;
}

export function copyButton(text, label = 'Copiar') {
  return `<button class="btn btn--sm btn--ghost" type="button" data-copy="${esc(text)}">${icon('copy')}${esc(label)}</button>`;
}
