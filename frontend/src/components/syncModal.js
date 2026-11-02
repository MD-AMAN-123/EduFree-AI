// EduFree.AI Data Storage, Sync & Backup Inspector Modal
import { t, getLanguage } from '../data/i18n.js';
import { getSyncStats, executeSync } from '../storage/syncQueue.js';
import { exportClassDataToCSV, exportFullDatabaseJSON, importDatabaseJSON } from '../storage/exportImport.js';
import { formatDate } from '../utils/helpers.js';
import { getSetting, setSetting } from '../storage/db.js';

export async function renderSyncModal(container, { onClose, onDataUpdated }) {
  const lang = getLanguage();
  const syncStats = await getSyncStats();
  const currentPin = await getSetting('teacher_pin', '1234');

  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.setAttribute('role', 'dialog');
  modalOverlay.setAttribute('aria-modal', 'true');
  modalOverlay.setAttribute('aria-label', t('data_title'));

  modalOverlay.innerHTML = `
    <div class="modal-content" style="max-width: 580px;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 12px; margin-bottom: 16px;">
        <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--primary-900); font-family: var(--font-telugu);">
          🔄 ${t('data_title')}
        </h3>
        <button id="modal-close-btn" class="btn btn-outline btn-sm" aria-label="Close dialog">✕</button>
      </div>

      <!-- Offline Safety Assurance Banner -->
      <div style="background: var(--primary-50); border-radius: var(--radius-md); padding: 14px; margin-bottom: 16px; border: 1.5px solid var(--primary-100);">
        <div style="font-weight: 700; color: var(--primary-900); margin-bottom: 4px; font-size: 0.95rem;">
          🛡️ ${t('privacy_title')}
        </div>
        <p style="font-size: 0.82rem; color: var(--primary-800); line-height: 1.5;">
          ${t('data_summary')} ${t('privacy_desc')}
        </p>
      </div>

      <!-- Sync Status Card -->
      <div style="background: var(--bg-card-subtle); border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px; border: 1px solid var(--border-light);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <div>
            <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 600;">${t('connection_status')}</div>
            <div style="font-weight: 800; font-size: 1.05rem; color: ${syncStats.isOnline ? 'var(--primary-700)' : '#ea580c'};">
              ${syncStats.isOnline ? `🟢 ${t('status_online')}` : `🟡 ${t('status_offline')}`}
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 600;">${t('unsynced_badge')}:</div>
            <div style="font-weight: 800; font-size: 1.05rem; color: ${syncStats.unsyncedCount > 0 ? '#e11d48' : 'var(--primary-700)'};">
              ${syncStats.unsyncedCount} ${t('records_count_suffix')}
            </div>
          </div>
        </div>

        <div style="font-size: 0.78rem; color: var(--text-subtle); margin-bottom: 12px;">
          ${t('last_sync_label')} <strong>${syncStats.lastSyncTime ? formatDate(syncStats.lastSyncTime, lang) : t('never_synced')}</strong>
        </div>

        <button id="btn-run-sync" class="btn btn-primary btn-lg" style="width: 100%;">
          <span>🔄</span> ${t('simulate_sync')}
        </button>
        <div id="sync-feedback-msg" style="margin-top: 8px; font-size: 0.82rem; text-align: center; display: none;"></div>
      </div>

      <!-- Export & Backup Options -->
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
        <button id="btn-export-csv" class="btn btn-outline" style="justify-content: flex-start; padding: 12px 16px;">
          <span>📊</span>
          <div style="text-align: left;">
            <div style="font-weight: 700;">${t('export_csv')}</div>
            <div style="font-size: 0.76rem; color: var(--text-muted);">${t('csv_subtitle')}</div>
          </div>
        </button>

        <button id="btn-export-json" class="btn btn-outline" style="justify-content: flex-start; padding: 12px 16px;">
          <span>💾</span>
          <div style="text-align: left;">
            <div style="font-weight: 700;">${t('export_json_backup')}</div>
            <div style="font-size: 0.76rem; color: var(--text-muted);">${t('backup_subtitle')}</div>
          </div>
        </button>

        <label class="btn btn-outline" style="justify-content: flex-start; padding: 12px 16px; cursor: pointer; margin: 0;">
          <span>📥</span>
          <div style="text-align: left;">
            <div style="font-weight: 700;">${t('import_json_backup')}</div>
            <div style="font-size: 0.76rem; color: var(--text-muted);">${t('restore_subtitle')}</div>
          </div>
          <input type="file" id="json-backup-file-input" accept=".json" style="display: none;">
        </label>
      </div>

      <!-- Teacher PIN Security Config -->
      <div style="background: var(--bg-card-subtle); border-radius: var(--radius-md); padding: 14px; border: 1px solid var(--border-light);">
        <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-main); margin-bottom: 6px;">
          🔒 ${t('teacher_security_pin')}
        </div>
        <div style="display: flex; gap: 8px;">
          <input type="password" id="change-pin-input" value="${currentPin}" maxlength="6" class="form-input" style="max-width: 140px; min-height: 40px;">
          <button id="btn-save-pin" class="btn btn-outline btn-sm">
            ${t('change_pin_btn')}
          </button>
        </div>
        <span id="pin-saved-msg" style="font-size: 0.76rem; color: var(--primary-700); display: none; margin-top: 4px;">${t('pin_success_msg')}</span>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  // Close handlers
  const closeModal = () => {
    modalOverlay.remove();
  };
  modalOverlay.querySelector('#modal-close-btn').onclick = closeModal;
  modalOverlay.onclick = (e) => {
    if (e.target === modalOverlay) closeModal();
  };

  // Sync execution
  const syncBtn = modalOverlay.querySelector('#btn-run-sync');
  const syncMsg = modalOverlay.querySelector('#sync-feedback-msg');

  syncBtn.onclick = async () => {
    syncBtn.disabled = true;
    syncBtn.innerHTML = `<span>⏳</span> ${t('syncing_msg')}`;
    syncMsg.style.display = 'none';

    const result = await executeSync();
    syncBtn.disabled = false;
    syncBtn.innerHTML = `<span>🔄</span> ${t('simulate_sync')}`;

    syncMsg.style.display = 'block';
    if (result.success) {
      syncMsg.style.color = 'var(--primary-700)';
      syncMsg.textContent = lang === 'te' ? result.message_te : result.message_en;
      onDataUpdated();
    } else {
      syncMsg.style.color = '#e11d48';
      syncMsg.textContent = lang === 'te' ? result.message_te : result.message_en;
    }
  };

  // CSV Export
  modalOverlay.querySelector('#btn-export-csv').onclick = async () => {
    await exportClassDataToCSV();
  };

  // JSON Export
  modalOverlay.querySelector('#btn-export-json').onclick = async () => {
    await exportFullDatabaseJSON();
  };

  // JSON Import
  const fileInput = modalOverlay.querySelector('#json-backup-file-input');
  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target.result;
      const res = await importDatabaseJSON(content);
      alert(lang === 'te' ? res.message_te : res.message_en);
      if (res.success) {
        onDataUpdated();
        closeModal();
      }
    };
    reader.readAsText(file);
  };

  // PIN Save
  const pinInput = modalOverlay.querySelector('#change-pin-input');
  const savePinBtn = modalOverlay.querySelector('#btn-save-pin');
  const pinSavedMsg = modalOverlay.querySelector('#pin-saved-msg');

  savePinBtn.onclick = async () => {
    const newPin = pinInput.value.trim();
    if (newPin.length >= 4) {
      await setSetting('teacher_pin', newPin);
      pinSavedMsg.style.display = 'block';
      setTimeout(() => { pinSavedMsg.style.display = 'none'; }, 2000);
    } else {
      alert(t('pin_min_err'));
    }
  };
}
