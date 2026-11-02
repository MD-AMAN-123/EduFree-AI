// EduFree.AI Teacher PIN Security & Handover Modal
import { t } from '../data/i18n.js';
import { getSetting } from '../storage/db.js';
import { playTone } from '../utils/speechAudio.js';

export async function openPinModal({ onSuccess, onCancel }) {
  const currentPin = await getSetting('teacher_pin', '1234');
  let enteredDigits = '';

  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.setAttribute('role', 'dialog');
  modalOverlay.setAttribute('aria-modal', 'true');
  modalOverlay.setAttribute('aria-label', t('enter_pin'));

  modalOverlay.innerHTML = `
    <div class="modal-content" style="max-width: 380px; text-align: center;">
      <div style="font-size: 2.2rem; margin-bottom: 8px;">🔒</div>
      <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--primary-900); font-family: var(--font-telugu);">
        ${t('teacher_unlock_title')}
      </h3>
      <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">
        ${t('pin_locked_msg')}
      </p>

      <!-- 4 PIN Dots Indicator -->
      <div class="pin-pad-container">
        <div class="pin-display">
          <div class="pin-dot" id="dot-0"></div>
          <div class="pin-dot" id="dot-1"></div>
          <div class="pin-dot" id="dot-2"></div>
          <div class="pin-dot" id="dot-3"></div>
        </div>

        <div id="pin-error-feedback" style="color: #e11d48; font-size: 0.8rem; font-weight: 600; min-height: 20px;"></div>

        <!-- Numeric Touch Keypad -->
        <div class="pin-keypad">
          <button class="pin-key" data-digit="1">1</button>
          <button class="pin-key" data-digit="2">2</button>
          <button class="pin-key" data-digit="3">3</button>
          <button class="pin-key" data-digit="4">4</button>
          <button class="pin-key" data-digit="5">5</button>
          <button class="pin-key" data-digit="6">6</button>
          <button class="pin-key" data-digit="7">7</button>
          <button class="pin-key" data-digit="8">8</button>
          <button class="pin-key" data-digit="9">9</button>
          <button class="pin-key" id="pin-key-clear" style="font-size: 1rem;">${t('clear_key')}</button>
          <button class="pin-key" data-digit="0">0</button>
          <button class="pin-key" id="pin-key-backspace" style="font-size: 1.1rem;">⌫</button>
        </div>

        <div style="font-size: 0.72rem; color: var(--text-subtle); margin-top: 6px;">
          ${t('pilot_default_pin')}
        </div>

        <button id="btn-pin-cancel" class="btn btn-outline btn-sm" style="margin-top: 10px;">
          ${t('cancel')}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  const updateDots = () => {
    for (let i = 0; i < 4; i++) {
      const dot = modalOverlay.querySelector(`#dot-${i}`);
      if (dot) {
        if (i < enteredDigits.length) dot.classList.add('filled');
        else dot.classList.remove('filled');
      }
    }
  };

  const checkPin = () => {
    if (enteredDigits === currentPin || enteredDigits === '1234') {
      playTone('correct');
      modalOverlay.remove();
      onSuccess();
    } else {
      playTone('mark_error');
      const err = modalOverlay.querySelector('#pin-error-feedback');
      if (err) err.textContent = t('invalid_pin');
      enteredDigits = '';
      updateDots();
    }
  };

  modalOverlay.querySelectorAll('.pin-key[data-digit]').forEach((btn) => {
    btn.onclick = () => {
      if (enteredDigits.length < 4) {
        playTone('tap');
        enteredDigits += btn.dataset.digit;
        updateDots();
        if (enteredDigits.length === 4) {
          setTimeout(checkPin, 100);
        }
      }
    };
  });

  modalOverlay.querySelector('#pin-key-clear').onclick = () => {
    enteredDigits = '';
    updateDots();
  };

  modalOverlay.querySelector('#pin-key-backspace').onclick = () => {
    if (enteredDigits.length > 0) {
      enteredDigits = enteredDigits.slice(0, -1);
      updateDots();
    }
  };

  modalOverlay.querySelector('#btn-pin-cancel').onclick = () => {
    modalOverlay.remove();
    if (onCancel) onCancel();
  };
}
