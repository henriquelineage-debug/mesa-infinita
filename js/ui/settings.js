/* ============================================================
   Modal: ajustes, partidas salvas, importar/exportar
   ============================================================ */

import { openModal, confirmDialog, toast, fmtRelative, esc } from '../core/dom.js';
import {
  listSaves, loadCampaign, deleteCampaign, campaignToJSON, downloadText,
  readJSONFile, parseImportedCampaign, saveCampaign, clearAll, storageInfo,
} from '../core/storage.js';
import { state, setCampaign, updateSettings, flushSave } from '../state.js';
import { icon } from './parts.js';
import { openNewCampaign } from './newcampaign.js';

export function openSettings() {
  const { el, close } = openModal({
    title: 'Ajustes e partidas',
    wide: true,
    body: `<div id="settings-body">${bodyHtml()}</div>`,
  });

  const refresh = () => {
    const body = el.querySelector('#settings-body');
    if (body) body.innerHTML = bodyHtml();
  };

  el.addEventListener('click', async (e) => {
    const t = e.target;

    if (t.closest('[data-new]')) {
      close();
      openNewCampaign();
      return;
    }

    if (t.closest('[data-import]')) {
      el.querySelector('#import-file')?.click();
      return;
    }

    if (t.closest('[data-toggle-autosave]')) {
      updateSettings({ autoSave: !state.settings.autoSave });
      refresh();
      return;
    }

    if (t.closest('[data-rename]')) {
      const input = el.querySelector('#campaign-name');
      const name = input?.value.trim();
      if (!name || !state.campaign) return;
      state.campaign.name = name;
      state.campaign.meta = state.campaign.meta || {};
      state.campaign.meta.updatedAt = Date.now();
      setCampaign(state.campaign);
      toast('Campanha renomeada', 'ok');
      refresh();
      return;
    }

    if (t.closest('[data-export-current]') && state.campaign) {
      downloadText(
        `mesa-infinita-${slug(state.campaign.name)}.json`,
        campaignToJSON(state.campaign),
      );
      toast('Campanha exportada', 'ok');
      return;
    }

    const loadId = t.closest('[data-load]')?.dataset.load;
    if (loadId) {
      flushSave();
      const campaign = loadCampaign(loadId);
      if (!campaign) {
        toast('Não foi possível abrir esta partida', 'bad');
        return;
      }
      setCampaign(campaign);
      close();
      toast('Partida carregada', 'ok');
      return;
    }

    const exportId = t.closest('[data-export]')?.dataset.export;
    if (exportId) {
      const campaign = loadCampaign(exportId);
      if (!campaign) return;
      downloadText(`mesa-infinita-${slug(campaign.name)}.json`, campaignToJSON(campaign));
      toast('Partida exportada', 'ok');
      return;
    }

    const delId = t.closest('[data-delete]')?.dataset.delete;
    if (delId) {
      const entry = listSaves().find((s) => s.id === delId);
      const ok = await confirmDialog({
        title: 'Excluir partida',
        message: `"${entry?.name || 'Esta partida'}" será apagada deste navegador. Exporte antes se quiser guardar.`,
        confirmLabel: 'Excluir',
        danger: true,
      });
      if (!ok) return;
      deleteCampaign(delId);
      if (state.campaign?.id === delId) setCampaign(null);
      refresh();
      toast('Partida excluída');
      return;
    }

    if (t.closest('[data-clear-all]')) {
      const ok = await confirmDialog({
        title: 'Apagar tudo',
        message: 'Todas as partidas e ajustes serão apagados deste navegador. Isso não pode ser desfeito.',
        confirmLabel: 'Apagar tudo',
        danger: true,
      });
      if (!ok) return;
      clearAll();
      setCampaign(null);
      close();
      toast('Tudo apagado');
    }
  });

  el.addEventListener('change', async (e) => {
    if (e.target.id !== 'import-file') return;
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await readJSONFile(file);
      const campaign = parseImportedCampaign(data);
      saveCampaign(campaign);
      setCampaign(campaign);
      close();
      toast('Campanha importada', 'ok');
    } catch (err) {
      toast(err.message || 'Falha ao importar', 'bad');
    }
  });
}

function bodyHtml() {
  const campaign = state.campaign;
  const saves = listSaves();
  const info = storageInfo();

  return `
    <section>
      <div class="section__head" style="margin-bottom:8px">
        <h3 style="margin:0">Campanha atual</h3>
        <button class="btn btn--sm btn--ghost" type="button" data-new>${icon('plus')}Nova</button>
      </div>
      ${campaign ? `
        <div class="panel-inset">
          <label class="field">
            <span>Nome</span>
            <div class="row" style="gap:8px">
              <input id="campaign-name" type="text" value="${esc(campaign.name)}" maxlength="60" />
              <button class="btn btn--sm" type="button" data-rename>Salvar</button>
            </div>
          </label>
          <div class="row row--between" style="margin-top:12px;flex-wrap:wrap;gap:8px">
            <span class="tiny muted">Semente: ${esc(campaign.seed)}</span>
            <button class="btn btn--sm btn--ghost" type="button" data-export-current>${icon('download')}Exportar JSON</button>
          </div>
        </div>` : `<p class="small muted" style="margin:0">Nenhuma campanha aberta. Crie uma nova ou carregue uma partida abaixo.</p>`}
    </section>

    <section class="section">
      <div class="section__head" style="margin-bottom:8px">
        <h3 style="margin:0">Partidas salvas</h3>
        <span class="tiny muted">${saves.length} ${saves.length === 1 ? 'arquivo' : 'arquivos'}</span>
      </div>
      ${saves.length ? saves.map((s) => saveRow(s, campaign?.id === s.id)).join('') : `<p class="small muted">Nada salvo ainda.</p>`}
    </section>

    <section class="section">
      <div class="section__head" style="margin-bottom:4px"><h3 style="margin:0">Preferências</h3></div>
      <div class="setting-row">
        <div>
          <div class="setting-row__label">Salvar automaticamente</div>
          <div class="setting-row__hint">Grava a cada alteração, com atraso curto.</div>
        </div>
        <button class="switch" type="button" role="switch" aria-checked="${state.settings.autoSave}" aria-label="Salvar automaticamente" data-toggle-autosave></button>
      </div>
    </section>

    <section class="section">
      <div class="section__head" style="margin-bottom:8px"><h3 style="margin:0">Dados</h3></div>
      <div class="row row--wrap" style="gap:8px">
        <button class="btn btn--sm" type="button" data-import>${icon('upload')}Importar JSON</button>
        <button class="btn btn--sm btn--danger" type="button" data-clear-all>${icon('trash')}Apagar tudo</button>
      </div>
      <input id="import-file" type="file" accept=".json,application/json" hidden />
      <p class="tiny ${info.persistent ? 'dim' : 'blood'}" style="margin:12px 0 0">
        ${info.persistent
          ? 'Armazenamento local ativo. Limpar os dados do navegador apaga as partidas — exporte para guardar.'
          : 'O navegador bloqueou o armazenamento local. As partidas existem só nesta aba e serão perdidas ao fechar.'}
      </p>
      <p class="tiny dim" style="margin:6px 0 0">Mesa Infinita · versão 0.1 · sem servidor, sem conta, sem rastreamento.</p>
    </section>
  `;
}

function saveRow(save, isCurrent) {
  return `<div class="save-row${isCurrent ? ' is-current' : ''}">
    <div class="save-row__main">
      <div class="save-row__name">${esc(save.name)}${isCurrent ? ' <span class="chip chip--gold" style="margin-left:6px">aberta</span>' : ''}</div>
      <div class="save-row__meta">${esc(save.characterName)} · Nv ${save.level} · ${save.sceneCount} cenas · ${esc(fmtRelative(save.updatedAt))}</div>
    </div>
    <div class="row" style="gap:4px">
      <button class="iconbtn" style="width:34px;height:34px" type="button" data-load="${esc(save.id)}" aria-label="Abrir" title="Abrir">${icon('play')}</button>
      <button class="iconbtn" style="width:34px;height:34px" type="button" data-export="${esc(save.id)}" aria-label="Exportar" title="Exportar">${icon('download')}</button>
      <button class="iconbtn" style="width:34px;height:34px" type="button" data-delete="${esc(save.id)}" aria-label="Excluir" title="Excluir">${icon('trash')}</button>
    </div>
  </div>`;
}

function slug(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 48) || 'campanha';
}
