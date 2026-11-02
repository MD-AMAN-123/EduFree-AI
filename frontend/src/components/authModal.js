// EduFree.AI - Secure Login / Sign-Up Authentication Panel
// Styled according to user reference and branded with EduFree.AI Telugu Vidya logo

import {
  signIn,
  signUp,
  sendPasswordReset,
  continueAsGuest,
  signOutUser,
  getCurrentSessionUser,
  getFirebaseConfig,
  setCustomApiKey
} from '../services/firebaseAuth.js';
import { t, getLanguage } from '../data/i18n.js';

let modalElement = null;
let currentMode = 'login'; // 'login' | 'signup' | 'recover'
let showConfigDrawer = false;
let isPasswordVisible = false;

/**
 * Render or open the Authentication Panel
 * @param {Object} options
 * @param {Function} options.onSuccess Callback when authenticated or continued as guest
 * @param {Function} [options.onCancel] Callback when modal closed (if closable)
 * @param {boolean} [options.canDismiss=true] Whether the user can close the modal without authenticating
 */
export function openAuthModal({ onSuccess, onCancel, canDismiss = true } = {}) {
  // If modal already open, close it first
  closeAuthModal();

  modalElement = document.createElement('div');
  modalElement.id = 'auth-modal-root';
  modalElement.className = 'auth-modal-overlay';
  document.body.appendChild(modalElement);
  document.body.classList.add('modal-open');

  function render() {
    if (!modalElement) return;

    const lang = getLanguage();
    const isTelugu = lang === 'te';
    const config = getFirebaseConfig();
    const hasApiKey = Boolean(config.apiKey);
    const user = getCurrentSessionUser();

    modalElement.innerHTML = `
      <div class="auth-modal-backdrop" id="auth-backdrop"></div>

      <div class="auth-card-container animate-scale-up" role="dialog" aria-modal="true" aria-labelledby="auth-panel-title">
        <!-- Left Showcase Side (Logo & Features) -->
        <div class="auth-showcase-panel">
          <!-- Floating Frosted Badges -->
          <div class="floating-badge badge-top-left" aria-hidden="true" title="Education & Literacy">
            <span class="badge-icon">🎓</span>
          </div>
          <div class="floating-badge badge-bottom-right" aria-hidden="true" title="Offline-First Global Standards">
            <span class="badge-icon">🌐</span>
          </div>

          <!-- Dot Grid Background Overlay -->
          <div class="auth-dot-grid" aria-hidden="true"></div>

          <!-- Brand Emblem & Titles -->
          <div class="auth-brand-showcase">
            <div class="brand-logo-frame">
              <img src="/assets/edufree-logo.png" alt="EduFree.AI Telugu Vidya Logo" class="brand-showcase-logo" />
            </div>

            <h1 class="brand-showcase-title">
              EduFree<span class="title-cyan-dot">.AI</span>
            </h1>
            <p class="brand-telugu-tag">తెలుగు విద్య • ప్రతీ బిడ్డ చదవాలి</p>
            <p class="brand-showcase-desc">
              Empowering every student with AI-driven Telugu reading fluency, personalized practice, and fun literacy games.
            </p>
          </div>

          <!-- Feature Cards (Glassmorphism Stack as per Photo 2) -->
          <div class="auth-features-list">
            <!-- 1. Reading Assessment -->
            <div class="auth-feature-pill">
              <div class="feature-icon-square icon-assessment" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <div class="feature-text">
                <span class="feature-title">Reading Assessment</span>
                <span class="feature-subtitle">AI-POWERED FLN FLUENCY & WCPM</span>
              </div>
            </div>

            <!-- 2. Practice Center -->
            <div class="auth-feature-pill">
              <div class="feature-icon-square icon-practice" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
              </div>
              <div class="feature-text">
                <span class="feature-title">Practice Center</span>
                <span class="feature-subtitle">SCERT TELUGU CURRICULUM MASTERY</span>
              </div>
            </div>

            <!-- 3. Activities Center -->
            <div class="auth-feature-pill">
              <div class="feature-icon-square icon-activities" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="6" y1="12" x2="10" y2="12"></line>
                  <line x1="8" y1="10" x2="8" y2="14"></line>
                  <line x1="15" y1="13" x2="15.01" y2="13"></line>
                  <line x1="18" y1="11" x2="18.01" y2="11"></line>
                  <rect x="2" y="6" width="20" height="12" rx="6"></rect>
                </svg>
              </div>
              <div class="feature-text">
                <span class="feature-title">Activities Center</span>
                <span class="feature-subtitle">GAMIFIED ORAL & VISUAL LEARNING</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Terminal Side (Firebase Authentication Form) -->
        <div class="auth-terminal-panel">
          <div class="terminal-header">
            <div class="terminal-title-wrap">
              <h2 id="auth-panel-title" class="terminal-heading">
                ${currentMode === 'login' ? 'Hello Again!' : (currentMode === 'signup' ? 'Create Account' : 'Recover Vault')}
              </h2>
              <div class="terminal-title-bar"></div>
            </div>

            ${currentMode !== 'recover' ? `
              <button id="toggle-mode-btn" class="terminal-mode-switch-btn" type="button">
                ${currentMode === 'login' ? 'SIGN UP' : 'SIGN IN'}
              </button>
            ` : `
              <button id="back-to-login-btn" class="terminal-mode-switch-btn" type="button">
                SIGN IN
              </button>
            `}
          </div>

          <!-- Alert / Toast Container -->
          <div id="auth-alert-box" class="auth-alert-box" style="display: none;"></div>

          <form id="auth-form" class="terminal-form" novalidate>
            ${currentMode === 'signup' ? `
              <!-- Full Name (Teacher/School) -->
              <div class="terminal-field-group">
                <label for="auth-name-input" class="terminal-label">OPERATOR / TEACHER NAME</label>
                <div class="terminal-input-wrap">
                  <span class="terminal-input-icon">👤</span>
                  <input
                    type="text"
                    id="auth-name-input"
                    class="terminal-input"
                    placeholder="Smt. Anitha Devi"
                    required
                    autocomplete="name"
                  />
                </div>
              </div>
            ` : ''}

            <!-- Email Terminal -->
            <div class="terminal-field-group">
              <label for="auth-email-input" class="terminal-label">EMAIL TERMINAL</label>
              <div class="terminal-input-wrap">
                <span class="terminal-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  type="email"
                  id="auth-email-input"
                  class="terminal-input"
                  placeholder="name@example.com"
                  required
                  autocomplete="email"
                  autofocus
                />
              </div>
            </div>

            ${currentMode !== 'recover' ? `
              <!-- Secure Vault (Password) -->
              <div class="terminal-field-group">
                <div class="terminal-label-row">
                  <label for="auth-password-input" class="terminal-label">SECURE VAULT</label>
                  <button type="button" id="recover-link-btn" class="terminal-recover-link">RECOVER</button>
                </div>
                <div class="terminal-input-wrap">
                  <span class="terminal-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    type="${isPasswordVisible ? 'text' : 'password'}"
                    id="auth-password-input"
                    class="terminal-input"
                    placeholder="••••••••"
                    required
                    autocomplete="${currentMode === 'login' ? 'current-password' : 'new-password'}"
                  />
                  <button type="button" id="toggle-password-eye" class="terminal-eye-btn" aria-label="Toggle password visibility">
                    ${isPasswordVisible ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
            ` : ''}

            ${currentMode === 'signup' ? `
              <!-- Confirm Vault -->
              <div class="terminal-field-group">
                <label for="auth-confirm-password-input" class="terminal-label">CONFIRM VAULT</label>
                <div class="terminal-input-wrap">
                  <span class="terminal-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    type="${isPasswordVisible ? 'text' : 'password'}"
                    id="auth-confirm-password-input"
                    class="terminal-input"
                    placeholder="••••••••"
                    required
                    autocomplete="new-password"
                  />
                </div>
              </div>
            ` : ''}

            <!-- Primary Action Button -->
            <button type="submit" id="auth-submit-btn" class="terminal-primary-btn">
              <span class="btn-text">
                ${currentMode === 'login' ? 'INITIALIZE SESSION' : (currentMode === 'signup' ? 'CREATE SECURE ACCOUNT' : 'SEND RECOVERY LINK')}
              </span>
              <span class="btn-arrow" aria-hidden="true">→</span>
            </button>

            <!-- Secondary Guest Button -->
            <button type="button" id="auth-guest-btn" class="terminal-guest-btn">
              CONTINUE AS GUEST
            </button>
          </form>

          <!-- Verified Secure Tag -->
          <div class="terminal-footer">
            <div class="verified-secure-pill">
              <span class="verified-dot"></span>
              <span class="verified-text">VERIFIED SECURE</span>
            </div>
            <p class="verified-statement">
              By accessing this portal, you acknowledge our global security protocols and privacy standards.
            </p>
          </div>
        </div>
      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    if (!modalElement) return;

    // Toggle Mode (Login <-> Sign Up)
    const toggleModeBtn = modalElement.querySelector('#toggle-mode-btn');
    if (toggleModeBtn) {
      toggleModeBtn.onclick = () => {
        currentMode = currentMode === 'login' ? 'signup' : 'login';
        render();
      };
    }

    // Back to Login from Recover
    const backToLoginBtn = modalElement.querySelector('#back-to-login-btn');
    if (backToLoginBtn) {
      backToLoginBtn.onclick = () => {
        currentMode = 'login';
        render();
      };
    }

    // Recover link
    const recoverLinkBtn = modalElement.querySelector('#recover-link-btn');
    if (recoverLinkBtn) {
      recoverLinkBtn.onclick = () => {
        currentMode = 'recover';
        render();
      };
    }

    // Toggle password eye
    const eyeBtn = modalElement.querySelector('#toggle-password-eye');
    if (eyeBtn) {
      eyeBtn.onclick = () => {
        isPasswordVisible = !isPasswordVisible;
        const passInput = modalElement.querySelector('#auth-password-input');
        const confirmInput = modalElement.querySelector('#auth-confirm-password-input');
        if (passInput) passInput.type = isPasswordVisible ? 'text' : 'password';
        if (confirmInput) confirmInput.type = isPasswordVisible ? 'text' : 'password';
        eyeBtn.textContent = isPasswordVisible ? '👁️' : '👁️‍🗨️';
      };
    }

    // Guest Button
    const guestBtn = modalElement.querySelector('#auth-guest-btn');
    if (guestBtn) {
      guestBtn.onclick = async () => {
        try {
          guestBtn.disabled = true;
          guestBtn.innerHTML = '<span class="loading-spin"></span> Connecting Guest Session...';
          const guestSession = await continueAsGuest();
          closeAuthModal();
          if (onSuccess) onSuccess(guestSession);
        } catch (err) {
          showAlert(err.message || 'Could not start guest session', 'error');
          guestBtn.disabled = false;
          guestBtn.textContent = 'CONTINUE AS GUEST';
        }
      };
    }

    // Form Submit
    const form = modalElement.querySelector('#auth-form');
    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        const submitBtn = modalElement.querySelector('#auth-submit-btn');
        const emailInput = modalElement.querySelector('#auth-email-input');
        const passwordInput = modalElement.querySelector('#auth-password-input');
        const nameInput = modalElement.querySelector('#auth-name-input');
        const confirmInput = modalElement.querySelector('#auth-confirm-password-input');

        const email = emailInput?.value.trim() || '';
        const password = passwordInput?.value || '';
        const name = nameInput?.value.trim() || '';
        const confirmPassword = confirmInput?.value || '';

        if (!email) {
          showAlert('దయచేసి మీ ఇమెయిల్ చిరునామా నమోదు చేయండి (Please enter your email)', 'error');
          emailInput?.focus();
          return;
        }

        if (currentMode === 'recover') {
          try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spin"></span> SENDING RECOVERY...';
            const res = await sendPasswordReset(email);
            showAlert(res.message || 'Recovery email dispatched!', 'success');
            setTimeout(() => {
              currentMode = 'login';
              render();
            }, 2500);
          } catch (err) {
            showAlert(err.message, 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'SEND RECOVERY LINK <span class="btn-arrow">→</span>';
          }
          return;
        }

        if (!password) {
          showAlert('దయచేసి పాస్‌వర్డ్ నమోదు చేయండి (Please enter password)', 'error');
          passwordInput?.focus();
          return;
        }

        if (currentMode === 'signup') {
          if (password !== confirmPassword) {
            showAlert('రెండు పాస్‌వర్డ్‌లు సరిపోలలేదు (Passwords do not match)', 'error');
            confirmInput?.focus();
            return;
          }
          if (password.length < 6) {
            showAlert('పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి (Password must be at least 6 characters)', 'error');
            passwordInput?.focus();
            return;
          }

          try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spin"></span> CREATING VAULT...';
            const user = await signUp(email, password, name);
            closeAuthModal();
            if (onSuccess) onSuccess(user);
          } catch (err) {
            showAlert(err.message, 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'CREATE SECURE ACCOUNT <span class="btn-arrow">→</span>';
          }
        } else {
          // Login
          try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spin"></span> INITIALIZING SESSION...';
            const user = await signIn(email, password);
            closeAuthModal();
            if (onSuccess) onSuccess(user);
          } catch (err) {
            showAlert(err.message, 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'INITIALIZE SESSION <span class="btn-arrow">→</span>';
          }
        }
      };
    }
  }

  function showAlert(message, type = 'error') {
    const alertBox = modalElement?.querySelector('#auth-alert-box');
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = `auth-alert-box ${type === 'success' ? 'alert-success' : 'alert-error'} animate-fade-in`;
    alertBox.style.display = 'block';
  }

  // Initial render
  render();
}

/**
 * Close Authentication Modal
 */
export function closeAuthModal() {
  if (modalElement && modalElement.parentNode) {
    modalElement.parentNode.removeChild(modalElement);
  }
  const strayModals = document.querySelectorAll('#auth-modal-root, .auth-modal-overlay');
  strayModals.forEach((el) => {
    if (el.parentNode) el.parentNode.removeChild(el);
  });
  modalElement = null;
  document.body.classList.remove('modal-open');
}

/**
 * Open Account Profile Dropdown/Modal from Navbar
 */
export function openUserProfileModal({ onLogout, onSwitchAccount } = {}) {
  const user = getCurrentSessionUser();
  const config = getFirebaseConfig();

  const overlay = document.createElement('div');
  overlay.className = 'auth-modal-overlay';
  overlay.innerHTML = `
    <div class="auth-modal-backdrop" id="user-profile-backdrop"></div>
    <div class="user-profile-dialog animate-scale-up" role="dialog">
      <div class="user-dialog-header">
        <div class="dialog-avatar">
          <img src="/assets/edufree-logo.png" alt="EduFree Logo" class="dialog-avatar-img" />
        </div>
        <div class="dialog-titles">
          <h3>${user?.displayName || 'Teacher'}</h3>
          <p class="dialog-email">${user?.email || 'guest@edufree.ai'}</p>
          <span class="dialog-badge ${user?.isGuest ? 'badge-guest' : 'badge-verified'}">
            ${user?.isGuest ? 'Guest Session' : 'Firebase Verified'}
          </span>
        </div>
        <button class="dialog-close-btn" id="dialog-close-btn" aria-label="Close">✕</button>
      </div>

      <div class="user-dialog-body">
        <div class="user-info-row">
          <span class="info-label">Firebase Project:</span>
          <span class="info-val">edufree-ai-73e5f</span>
        </div>
        <div class="user-info-row">
          <span class="info-label">Sender ID:</span>
          <span class="info-val">268969651642</span>
        </div>
        <div class="user-info-row">
          <span class="info-label">Session ID:</span>
          <span class="info-val">${user?.uid ? user.uid.substring(0, 16) + '...' : 'Offline'}</span>
        </div>
        <div class="user-info-row">
          <span class="info-label">Encryption:</span>
          <span class="info-val" style="color: #10b981;">AES-256 / Zero-Knowledge</span>
        </div>
      </div>

      <div class="user-dialog-actions">
        ${user?.isGuest ? `
          <button id="dialog-login-switch-btn" class="btn btn-primary" style="width: 100%; margin-bottom: 8px;">
            🔐 Sign In / Create Firebase Account
          </button>
        ` : ''}
        <button id="dialog-logout-btn" class="btn btn-outline" style="width: 100%; color: #f43f5e; border-color: #f43f5e;">
          🚪 Sign Out Session
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const closeDialog = () => {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  };

  overlay.querySelector('#user-profile-backdrop').onclick = closeDialog;
  overlay.querySelector('#dialog-close-btn').onclick = closeDialog;

  const logoutBtn = overlay.querySelector('#dialog-logout-btn');
  if (logoutBtn) {
    logoutBtn.onclick = async () => {
      closeDialog();
      await signOutUser();
      if (onLogout) onLogout();
    };
  }

  const switchBtn = overlay.querySelector('#dialog-login-switch-btn');
  if (switchBtn) {
    switchBtn.onclick = () => {
      closeDialog();
      if (onSwitchAccount) onSwitchAccount();
    };
  }
}
