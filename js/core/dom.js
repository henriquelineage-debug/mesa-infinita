/* ============================================================
   Utilitários de DOM: escape, toasts, modais, datas
   ============================================================ */

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escapa texto para interpolação segura em HTML. */
export function esc(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

export function fmtDate(ts, opts = {}) {
  if (!ts) return '—';
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      ...opts,
    }).format(new Date(ts));
  } catch {
    return new Date(ts).toLocaleDateString('pt-BR');
  }
}

export function fmtTime(ts) {
  try {
    return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(ts));
  } catch {
    return '';
  }
}

export function fmtRelative(ts) {
  if (!ts) return '—';
  const diff = Date.now() - ts;
  const min = Math.round(diff / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `${min} min atrás`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h atrás`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} d atrás`;
  return fmtDate(ts);
}

/* ---------------- toasts ---------------- */

export function toast(message, kind = '') {
  const host = document.getElementById('toasts');
  if (!host) return;
  const node = document.createElement('div');
  node.className = `toast${kind ? ` toast--${kind}` : ''}`;
  node.textContent = message;
  host.appendChild(node);
  setTimeout(() => {
    node.style.transition = 'opacity .25s, transform .25s';
    node.style.opacity = '0';
    node.style.transform = 'translateY(6px)';
    setTimeout(() => node.remove(), 260);
  }, 2600);
}

/* ---------------- modais ---------------- */

let openCount = 0;

/**
 * Abre um modal. Retorna { el, close }.
 * @param {{title: string, body: string, footer?: string, wide?: boolean, onMount?: (el: HTMLElement, close: () => void) => void}} cfg
 */
export function openModal({ title, body, footer = '', wide = false, onMount }) {
  const root = document.getElementById('modal-root');
  const previousFocus = document.activeElement;

  const wrap = document.createElement('div');
  wrap.className = 'modal';
  wrap.innerHTML = `
    <div class="modal__box" role="dialog" aria-modal="true" aria-label="${esc(title)}" style="${wide ? 'width:min(760px,100%)' : ''}">
      <div class="modal__head">
        <h2>${esc(title)}</h2>
        <button class="iconbtn" type="button" data-close aria-label="Fechar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
      <div class="modal__body">${body}</div>
      ${footer ? `<div class="modal__foot">${footer}</div>` : ''}
    </div>`;

  const onKey = (e) => {
    if (e.key === 'Escape') close();
  };

  const close = () => {
    if (!wrap.isConnected) return;
    document.removeEventListener('keydown', onKey);
    wrap.remove();
    openCount = Math.max(0, openCount - 1);
    if (openCount === 0) document.body.style.overflow = '';
    if (previousFocus?.focus) previousFocus.focus({ preventScroll: true });
  };

  wrap.addEventListener('click', (e) => {
    if (e.target === wrap) close();
  });
  wrap.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) close();
  });

  document.addEventListener('keydown', onKey);

  root.appendChild(wrap);
  openCount++;
  document.body.style.overflow = 'hidden';

  const focusTarget = wrap.querySelector('input, textarea, select, button:not([data-close])');
  setTimeout(() => focusTarget?.focus({ preventScroll: true }), 30);

  onMount?.(wrap, close);
  return { el: wrap, close };
}

/** Confirmação com Promise<boolean>. */
export function confirmDialog({ title = 'Confirmar', message, confirmLabel = 'Confirmar', danger = false }) {
  return new Promise((resolve) => {
    let settled = false;
    const done = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    const { el, close } = openModal({
      title,
      body: `<p class="lead">${esc(message)}</p>`,
      footer: `
        <button class="btn btn--ghost" type="button" data-no>Cancelar</button>
        <button class="btn ${danger ? 'btn--danger' : 'btn--primary'}" type="button" data-yes>${esc(confirmLabel)}</button>`,
    });
    el.querySelector('[data-no]').addEventListener('click', () => {
      done(false);
      close();
    });
    el.querySelector('[data-yes]').addEventListener('click', () => {
      done(true);
      close();
    });
    el.addEventListener('click', (e) => {
      if (e.target === el) done(false);
    });
  });
}

/** Copia texto para a área de transferência com fallback. */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

export function scrollTop(smooth = true) {
  window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
}
