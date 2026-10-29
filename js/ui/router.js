/* ============================================================
   Roteador por hash
   ============================================================ */

import { bus } from '../core/bus.js';
import { state } from '../state.js';
import { esc } from '../core/dom.js';
import * as campaign from './views/campaign.js';
import * as sheet from './views/sheet.js';
import * as dice from './views/dice.js';
import * as solo from './views/solo.js';
import * as generate from './views/generate.js';

const ROUTES = {
  campanha: campaign,
  ficha: sheet,
  dados: dice,
  solo,
  gerar: generate,
};

const DEFAULT_ROUTE = 'campanha';

export function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, '').split('?')[0];
  return ROUTES[raw] ? raw : DEFAULT_ROUTE;
}

export function initRouter() {
  window.addEventListener('hashchange', renderRoute);
  bus.on('campaign', () => renderRoute());
  renderRoute();
}

export function navigate(route) {
  location.hash = `#/${route}`;
}

export function renderRoute() {
  const route = parseRoute();
  const view = document.getElementById('view');
  if (!view) return;

  state.route = route;
  view.innerHTML = '';
  ROUTES[route].render(view);

  syncTabs(route);
  syncTopbar();
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function syncTabs(route) {
  document.querySelectorAll('[data-route]').forEach((link) => {
    const active = link.dataset.route === route;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function syncTopbar() {
  const host = document.getElementById('topbar-meta');
  if (!host) return;
  const c = state.campaign;
  host.innerHTML = c
    ? `<span class="chip chip--gold">${esc(c.name)}</span>`
    : '<span class="chip">sem campanha</span>';
}
