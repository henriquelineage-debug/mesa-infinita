/* ============================================================
   Persistência local: slots de campanha, exportação e ajustes
   ============================================================ */

const PREFIX = 'mesa-infinita';
const SCHEMA = 1;
const KEY_INDEX = `${PREFIX}.index`;
const KEY_CAMPAIGN = (id) => `${PREFIX}.campaign.${id}`;
const KEY_SETTINGS = `${PREFIX}.settings`;

/** localStorage com fallback em memória (modo privado / cota estourada). */
const memory = new Map();
let usingMemory = false;

const store = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      usingMemory = true;
      return memory.get(key) ?? null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      usingMemory = true;
      memory.set(key, value);
      return false;
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      memory.delete(key);
    }
  },
};

export function storageInfo() {
  return { persistent: !usingMemory };
}

/* ---------------- ajustes ---------------- */

const DEFAULT_SETTINGS = {
  lastCampaignId: null,
  autoSave: true,
  showHints: true,
  compact: false,
};

export function loadSettings() {
  try {
    const raw = store.get(KEY_SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings) {
  store.set(KEY_SETTINGS, JSON.stringify(settings));
}

/* ---------------- índice de campanhas ---------------- */

export function listSaves() {
  try {
    const raw = store.get(KEY_INDEX);
    const list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) return [];
    return list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  } catch {
    return [];
  }
}

function writeIndex(list) {
  store.set(KEY_INDEX, JSON.stringify(list));
}

function indexEntry(campaign) {
  return {
    id: campaign.id,
    name: campaign.name,
    seed: campaign.seed,
    updatedAt: campaign.meta?.updatedAt || Date.now(),
    characterName: campaign.character?.name || 'Sem personagem',
    level: campaign.character?.level || 1,
    sceneCount: campaign.scenes?.length || 0,
    journalCount: campaign.journal?.length || 0,
  };
}

export function saveCampaign(campaign) {
  campaign.meta = campaign.meta || {};
  campaign.meta.updatedAt = Date.now();
  campaign.version = SCHEMA;

  const ok = store.set(KEY_CAMPAIGN(campaign.id), JSON.stringify(campaign));
  const list = listSaves().filter((s) => s.id !== campaign.id);
  list.unshift(indexEntry(campaign));
  writeIndex(list);

  return ok;
}

export function loadCampaign(id) {
  try {
    const raw = store.get(KEY_CAMPAIGN(id));
    if (!raw) return null;
    const campaign = JSON.parse(raw);
    return migrate(campaign);
  } catch (err) {
    console.error('Falha ao carregar campanha', err);
    return null;
  }
}

export function deleteCampaign(id) {
  store.remove(KEY_CAMPAIGN(id));
  writeIndex(listSaves().filter((s) => s.id !== id));
}

export function hasCampaign(id) {
  return Boolean(store.get(KEY_CAMPAIGN(id)));
}

/** Preenche campos ausentes de versões antigas sem perder dados. */
function migrate(campaign) {
  const c = campaign;
  c.version = SCHEMA;
  c.meta = c.meta || {};
  c.scenes = Array.isArray(c.scenes) ? c.scenes : [];
  c.journal = Array.isArray(c.journal) ? c.journal : [];
  c.tension = typeof c.tension === 'number' ? c.tension : 1;
  c.character = c.character || null;
  c.stats = c.stats || { scenes: 0, rolls: 0, oracles: 0 };
  return c;
}

/* ---------------- exportar / importar ---------------- */

export function campaignToJSON(campaign) {
  return JSON.stringify(
    {
      app: 'mesa-infinita',
      kind: 'campaign',
      version: SCHEMA,
      exportedAt: new Date().toISOString(),
      campaign,
    },
    null,
    2,
  );
}

export function downloadText(filename, text, mime = 'application/json') {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function readJSONFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(String(reader.result)));
      } catch {
        reject(new Error('O arquivo não é um JSON válido.'));
      }
    };
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
    reader.readAsText(file);
  });
}

/** Valida e normaliza um arquivo importado. */
export function parseImportedCampaign(data) {
  const campaign = data?.campaign || (data?.id && data?.character ? data : null);
  if (!campaign) throw new Error('Arquivo não contém uma campanha do Mesa Infinita.');
  if (!campaign.id || !campaign.character) throw new Error('Campanha incompleta ou corrompida.');
  const migrated = migrate(campaign);
  // evita sobrescrever uma campanha existente
  if (hasCampaign(migrated.id)) {
    migrated.id = `${migrated.id}-${Math.random().toString(36).slice(2, 6)}`;
    migrated.name = `${migrated.name} (importada)`;
  }
  return migrated;
}

export function clearAll() {
  listSaves().forEach((s) => store.remove(KEY_CAMPAIGN(s.id)));
  store.remove(KEY_INDEX);
  store.remove(KEY_SETTINGS);
  memory.clear();
}
