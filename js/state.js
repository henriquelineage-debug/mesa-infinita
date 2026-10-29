/* ============================================================
   Estado da aplicação (campanha ativa, salvamento automático)
   ============================================================ */

import { bus } from './core/bus.js';
import { loadSettings, saveSettings, saveCampaign } from './core/storage.js';
import { uid } from './core/rng.js';
import { normalizeCharacter } from './game/character.js';
export const state = {
  campaign: null,
  settings: loadSettings(),
  rolls: [],
  generated: {},
  route: 'campanha',
};

let saveTimer = null;

export function scheduleSave(delay = 400) {
  if (!state.campaign || !state.settings.autoSave) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveCampaign(state.campaign);
    bus.emit('saved');
  }, delay);
}

export function flushSave() {
  clearTimeout(saveTimer);
  if (state.campaign) saveCampaign(state.campaign);
}

export function touch(reason = 'change') {
  if (!state.campaign) return;
  state.campaign.meta = state.campaign.meta || {};
  state.campaign.meta.updatedAt = Date.now();
  scheduleSave();
  bus.emit('change', reason);
}

export function setCampaign(campaign) {
  state.campaign = campaign;
  if (campaign) {
    normalizeCharacter(campaign.character);
    state.settings.lastCampaignId = campaign.id;
    saveSettings(state.settings);
    saveCampaign(campaign);
  }
  bus.emit('campaign', campaign);
}

export function addJournal({ kind = 'nota', title = '', text = '', meta = null }) {
  const c = state.campaign;
  if (!c) return null;
  const entry = { id: uid('j'), at: Date.now(), kind, title, text, meta };
  c.journal.push(entry);
  touch('journal');
  return entry;
}

export function removeJournal(id) {
  const c = state.campaign;
  if (!c) return;
  c.journal = c.journal.filter((e) => e.id !== id);
  touch('journal');
}

export function setTension(value) {
  const c = state.campaign;
  if (!c) return;
  c.tension = Math.max(0, Math.min(5, value));
  touch('tension');
}

export function adjustTension(delta) {
  const c = state.campaign;
  if (!c) return;
  setTension((c.tension ?? 1) + delta);
}

export function addScene(scene) {
  const c = state.campaign;
  if (!c) return;
  c.scenes.push(scene);
  c.stats = c.stats || { scenes: 0, rolls: 0, oracles: 0 };
  c.stats.scenes = c.scenes.length;
  touch('scene');
}

export function currentScene() {
  const scenes = state.campaign?.scenes || [];
  return scenes.length ? scenes[scenes.length - 1] : null;
}

export function logRoll(entry) {
  state.rolls.unshift(entry);
  if (state.rolls.length > 40) state.rolls.length = 40;
  if (state.campaign) {
    state.campaign.stats = state.campaign.stats || { scenes: 0, rolls: 0, oracles: 0 };
    state.campaign.stats.rolls = (state.campaign.stats.rolls || 0) + 1;
    touch('roll');
  }
}

export function bumpOracle() {
  if (!state.campaign) return;
  state.campaign.stats = state.campaign.stats || { scenes: 0, rolls: 0, oracles: 0 };
  state.campaign.stats.oracles = (state.campaign.stats.oracles || 0) + 1;
}

export function updateSettings(patch) {
  state.settings = { ...state.settings, ...patch };
  saveSettings(state.settings);
  bus.emit('settings', state.settings);
}

export function isNew() {
  return !state.campaign;
}
