/* ============================================================
   Ponto de entrada
   ============================================================ */

import { initRouter } from './ui/router.js';
import { loadCampaign } from './core/storage.js';
import { state, flushSave } from './state.js';
import { normalizeCharacter } from './game/character.js';
import { openSettings } from './ui/settings.js';

window.__mesaInfinita = true;

function boot() {
  // retoma a última campanha aberta, se existir
  const lastId = state.settings.lastCampaignId;
  if (lastId) {
    const campaign = loadCampaign(lastId);
    if (campaign) {
      state.campaign = campaign;
      normalizeCharacter(campaign.character);
    }
  }

  document.getElementById('btn-settings')?.addEventListener('click', openSettings);

  initRouter();

  window.addEventListener('beforeunload', flushSave);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) flushSave();
  });

  // atalhos: 1..5 trocam de aba quando não se está digitando
  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (document.querySelector('.modal')) return;
    const routes = ['campanha', 'ficha', 'dados', 'solo', 'gerar'];
    const index = Number(e.key) - 1;
    if (index >= 0 && index < routes.length) {
      location.hash = `#/${routes[index]}`;
    }
  });

  registerServiceWorker();
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (!location.protocol.startsWith('http')) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      /* offline indisponível: o jogo continua funcionando online */
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
