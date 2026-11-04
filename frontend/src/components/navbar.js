// EduFree.AI Navigation & Header Component
import { t, getLanguage, setLanguage } from '../data/i18n.js';
import { getSyncStats } from '../storage/syncQueue.js';
import { getCurrentSessionUser } from '../services/firebaseAuth.js';
import { getAIStatus } from '../services/gemma4Offline.js';
import { icon } from '../utils/icons.js';

// Track drawer state to preserve across re-renders
let _drawerOpen = false;

export async function renderNavbar(container, {
  activeTab,
  onTabChange,
  onOpenSync,
  onTogglePin,
  isTeacherMode,
  onLanguageToggle,
  onOpenAuth,
  onOpenGuidelines
}) {
  const syncStats = await getSyncStats();
  const lang = getLanguage();
  const user = getCurrentSessionUser();

  const isSunlight = document.body.classList.contains('sunlight-mode');

  container.innerHTML = `
    <header class="app-header" role="banner">
      <div class="header-top">
        <!-- Logo on the left side of the content -->
        <div class="brand-area" id="brand-home-btn" role="button" tabindex="0" aria-label="EduFree Home">
          <div class="brand-logo-img-badge" aria-hidden="true">
            <img src="/assets/edufree-logo.png" alt="EduFree Telugu Vidya Logo" onerror="this.parentElement.innerHTML='అ'" />
          </div>
          <div class="brand-titles">
            <h1>EduFree.AI <span class="pilot-tag">${t('pilot_badge')}</span></h1>
            <p>${t('app_subtitle')}</p>
          </div>
        </div>

        <!-- Desktop-Only Header Controls (Hidden on Mobile) -->
        <div class="header-controls desktop-only-controls">
          <!-- User / Firebase Auth Status Button -->
          <button id="auth-account-btn" class="control-icon-btn ${user?.isGuest ? 'is-guest-badge' : (user ? 'is-auth-active' : '')}" title="${user?.email || 'Login / Firebase Account'}" aria-label="User Account">
            <span class="ctrl-icon-wrap">
              <span class="ctrl-icon" aria-hidden="true">${user?.isGuest ? icon('user', { size: 16 }) : (user ? icon('lock', { size: 16 }) : icon('key', { size: 16 }))}</span>
            </span>
            <span class="ctrl-label">
              <span class="desktop-text">${user ? (user.displayName || user.email?.split('@')[0]) : 'Login'}</span>
            </span>
          </button>

          <!-- Connectivity & Sync Pill -->
          <button id="sync-status-pill" class="status-pill" title="${t('nav_sync_settings')}" aria-label="Sync and offline status">
            <span class="ctrl-icon-wrap sync-icon-wrap">
              <span class="status-dot ${syncStats.isOnline ? '' : 'offline'}"></span>
              <span class="ctrl-icon mobile-dock-icon" aria-hidden="true">${icon('sync', { size: 15 })}</span>
              ${syncStats.unsyncedCount > 0 ? `<span class="dock-badge-pill" aria-label="${syncStats.unsyncedCount} unsynced">${syncStats.unsyncedCount}</span>` : ''}
            </span>
            <span class="ctrl-label">
              <span class="desktop-text">${syncStats.isOnline ? (syncStats.unsyncedCount > 0 ? `${syncStats.unsyncedCount} ${t('unsynced_badge')}` : t('status_online')) : t('status_offline')}</span>
            </span>
          </button>

          <!-- Gemma 4 Offline AI Status Badge -->
          ${(() => {
            const ai = getAIStatus();
            return ai.isOffline ? `
            <div id="gemma4-ai-badge" class="gemma4-badge" title="Gemma 4 Offline AI is powering the app" aria-label="Gemma 4 AI active">
              <span class="gemma4-pulse"></span>
              <span class="gemma4-icon">${icon('bot', { size: 16 })}</span>
              <span class="gemma4-label">${lang === 'te' ? 'Gemma 4 AI' : 'Gemma 4 AI'}</span>
            </div>` : `
            <div id="gemma4-ai-badge" class="gemma4-badge gemma4-badge-online" title="Online mode — Firebase active" aria-label="Online mode">
              <span class="gemma4-dot-online"></span>
              <span class="gemma4-icon">${icon('globe', { size: 16 })}</span>
              <span class="gemma4-label">${lang === 'te' ? 'ఆన్‌లైన్' : 'Online'}</span>
            </div>`;
          })()}

          <!-- Sunlight / High Contrast Mode Toggle -->
          <button id="sunlight-toggle-btn" class="control-icon-btn ${isSunlight ? 'is-active-sunlight' : ''}" title="${t('high_contrast_toggle')}" aria-label="${t('high_contrast_toggle')}">
            <span class="ctrl-icon-wrap">
              <span class="ctrl-icon" aria-hidden="true">${isSunlight ? icon('sun', { size: 16 }) : icon('contrast', { size: 16 })}</span>
            </span>
            <span class="ctrl-label">
              <span class="desktop-text">${isSunlight ? t('sunlight_normal') : t('sunlight_contrast')}</span>
            </span>
          </button>

          <!-- Bilingual Language Toggle Button -->
          <button id="lang-toggle-btn" class="control-icon-btn" title="Toggle Telugu / English" aria-label="Toggle language">
            <span class="ctrl-icon-wrap">
              <span class="ctrl-icon" aria-hidden="true">${icon('globe', { size: 16 })}</span>
              <span class="lang-indicator-badge" aria-hidden="true">${lang === 'te' ? 'TE' : 'EN'}</span>
            </span>
            <span class="ctrl-label">
              <span class="desktop-text">${lang === 'te' ? 'English' : 'తెలుగు'}</span>
            </span>
          </button>

          <!-- Teacher Mode / Student Practice Mode PIN Lock Toggle -->
          <button id="teacher-pin-toggle-btn" class="control-icon-btn ${isTeacherMode ? 'is-teacher-active' : 'is-student-locked'}" style="${isTeacherMode ? 'background: rgba(245, 158, 11, 0.25); border-color: #f59e0b;' : ''}" title="${isTeacherMode ? t('lock_to_practice') : t('unlock')}" aria-label="Teacher security lock">
            <span class="ctrl-icon-wrap">
              <span class="ctrl-icon" aria-hidden="true">${isTeacherMode ? icon('unlock', { size: 16 }) : icon('lock', { size: 16 })}</span>
            </span>
            <span class="ctrl-label">
              <span class="desktop-text">${isTeacherMode ? t('teacher_btn_label') : t('student_btn_label')}</span>
            </span>
          </button>
        </div>

        <!-- Hamburger button for mobile navigation drawer (placed on the right) -->
        <button id="hamburger-btn" class="hamburger-btn" aria-label="Open navigation menu" aria-expanded="false">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>

      <!-- Desktop Navigation Tabs (horizontal bar) -->
      <nav class="nav-tabs-bar" role="navigation" aria-label="Main Navigation">
        <button class="nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
          <span>${icon('dashboard', { size: 17 })}</span> ${t('nav_dashboard')}
        </button>
        <button class="nav-tab-btn ${activeTab === 'assess' ? 'active' : ''}" data-tab="assess">
          <span>${icon('assess', { size: 17 })}</span> ${t('nav_assess')}
        </button>
        <button class="nav-tab-btn ${activeTab === 'practice' ? 'active' : ''}" data-tab="practice">
          <span>${icon('practice', { size: 17 })}</span> ${t('nav_practice')}
        </button>
        <button class="nav-tab-btn ${activeTab === 'activities' ? 'active' : ''}" data-tab="activities" style="${activeTab === 'activities' ? 'background: rgba(245, 158, 11, 0.2); border-bottom-color: #f59e0b;' : ''}">
          <span>${icon('activities', { size: 17 })}</span> ${lang === 'te' ? 'కృత్యాలు' : 'Activities'}
        </button>
        <button class="nav-tab-btn ${activeTab === 'worksheets' ? 'active' : ''}" data-tab="worksheets">
          <span>${icon('worksheets', { size: 17 })}</span> ${t('nav_worksheets')}
        </button>
        <button class="nav-tab-btn ${activeTab === 'syllabus' ? 'active' : ''}" data-tab="syllabus">
          <span>${icon('syllabus', { size: 17 })}</span> ${t('nav_syllabus')}
        </button>
        <button class="nav-tab-btn ${activeTab === 'sync' ? 'active' : ''}" data-tab="sync">
          <span>${icon('sync', { size: 17 })}</span> ${t('nav_sync_settings')}
        </button>
        <button class="nav-tab-btn ${activeTab === 'settings' ? 'active' : ''}" data-tab="settings">
          <span>${icon('settings', { size: 17 })}</span> ${lang === 'te' ? 'సెట్టింగ్స్' : 'Settings'}
        </button>
      </nav>

      <!-- Mobile Slide-In Navigation Drawer (Opened via Hamburger) -->
      <div id="drawer-overlay" class="drawer-overlay${_drawerOpen ? ' open' : ''}"></div>
      <nav id="nav-drawer" class="nav-drawer${_drawerOpen ? ' open' : ''}" role="navigation" aria-label="Mobile Navigation">
        <div class="drawer-header">
          <div class="drawer-brand">
            <div class="brand-logo-img-badge" aria-hidden="true">
              <img src="/assets/edufree-logo.png" alt="EduFree Logo" onerror="this.parentElement.innerHTML='అ'" />
            </div>
            <div class="drawer-brand-text">
              <span class="drawer-brand-name">EduFree.AI</span>
              <span class="drawer-brand-sub">${t('app_subtitle')}</span>
            </div>
          </div>
          <button id="drawer-close-btn" class="drawer-close-btn" aria-label="Close navigation menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Dedicated Settings Buttons Section (Accounts, Practice/Teacher, Contrast, Language, Sync) -->
        <div class="drawer-settings-card">
          <div class="drawer-settings-header">
            <span class="settings-header-icon">${icon('settings', { size: 18 })}</span>
            <span class="settings-header-title">${lang === 'te' ? 'సెట్టింగ్స్ & నియంత్రణలు' : 'Settings & Controls'}</span>
          </div>

          <!-- Buttons Grid matching user screenshot tiles -->
          <div class="drawer-settings-grid">
            <!-- 1. Accounts Button -->
            <button id="drawer-btn-account" class="drawer-tile-btn ${user?.isGuest ? 'tile-guest' : 'tile-auth'}" title="Account & Firebase Security">
              <div class="tile-icon-box">
                <span class="tile-icon">${user?.isGuest ? icon('user', { size: 20 }) : icon('lock', { size: 20 })}</span>
              </div>
              <span class="tile-label">${lang === 'te' ? 'ఖాతా' : 'Account'}</span>
            </button>

            <!-- 2. Practice / Teacher Mode Button -->
            <button id="drawer-btn-mode" class="drawer-tile-btn ${isTeacherMode ? 'tile-teacher-active' : 'tile-student'}" title="Toggle Teacher PIN / Student Practice Mode">
              <div class="tile-icon-box">
                <span class="tile-icon">${isTeacherMode ? icon('unlock', { size: 20 }) : icon('lock', { size: 20 })}</span>
              </div>
              <span class="tile-label">${isTeacherMode ? (lang === 'te' ? 'ఉపాధ్యాయ' : 'Teacher') : (lang === 'te' ? 'సాధన' : 'Practice')}</span>
            </button>

            <!-- 3. Contrast Button -->
            <button id="drawer-btn-contrast" class="drawer-tile-btn ${isSunlight ? 'tile-sunlight-active' : ''}" title="Sunlight / High Contrast Mode">
              <div class="tile-icon-box">
                <span class="tile-icon">${isSunlight ? icon('sun', { size: 20 }) : icon('contrast', { size: 20 })}</span>
              </div>
              <span class="tile-label">${lang === 'te' ? 'కాంట్రాస్ట్' : 'Contrast'}</span>
            </button>

            <!-- 4. Language Button -->
            <button id="drawer-btn-lang" class="drawer-tile-btn" title="Toggle Telugu / English">
              <div class="tile-icon-box">
                <span class="tile-icon">${icon('globe', { size: 20 })}</span>
                <span class="tile-badge-lang">${lang === 'te' ? 'EN' : 'TE'}</span>
              </div>
              <span class="tile-label">${lang === 'te' ? 'English' : 'తెలుగు'}</span>
            </button>

            <!-- 5. Sync Button -->
            <button id="drawer-btn-sync" class="drawer-tile-btn" title="Data Sync">
              <div class="tile-icon-box">
                <span class="tile-icon">${icon('sync', { size: 20 })}</span>
                ${syncStats.unsyncedCount > 0 ? `<span class="tile-badge-count">${syncStats.unsyncedCount}</span>` : ''}
              </div>
              <span class="tile-label">${syncStats.unsyncedCount > 0 ? `${syncStats.unsyncedCount} Sync` : 'Sync'}</span>
            </button>
          </div>
        </div>

        <div class="drawer-nav-items">
          <div class="drawer-nav-section-title">${lang === 'te' ? 'ప్రధాన విభాగాలు' : 'Main Navigation'}</div>
          
          <button class="drawer-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
            <span class="drawer-nav-icon">${icon('dashboard', { size: 18 })}</span>
            <span class="drawer-nav-label">${t('nav_dashboard')}</span>
            ${activeTab === 'dashboard' ? '<span class="drawer-active-dot"></span>' : ''}
          </button>
          <button class="drawer-nav-btn ${activeTab === 'assess' ? 'active' : ''}" data-tab="assess">
            <span class="drawer-nav-icon">${icon('assess', { size: 18 })}</span>
            <span class="drawer-nav-label">${t('nav_assess')}</span>
            ${activeTab === 'assess' ? '<span class="drawer-active-dot"></span>' : ''}
          </button>
          <button class="drawer-nav-btn ${activeTab === 'practice' ? 'active' : ''}" data-tab="practice">
            <span class="drawer-nav-icon">${icon('practice', { size: 18 })}</span>
            <span class="drawer-nav-label">${t('nav_practice')}</span>
            ${activeTab === 'practice' ? '<span class="drawer-active-dot"></span>' : ''}
          </button>
          <button class="drawer-nav-btn ${activeTab === 'activities' ? 'active' : ''}" data-tab="activities">
            <span class="drawer-nav-icon">${icon('activities', { size: 18 })}</span>
            <span class="drawer-nav-label">${lang === 'te' ? 'కృత్యాలు (Activities)' : 'Activities Center'}</span>
            ${activeTab === 'activities' ? '<span class="drawer-active-dot"></span>' : ''}
          </button>
          <button class="drawer-nav-btn ${activeTab === 'worksheets' ? 'active' : ''}" data-tab="worksheets">
            <span class="drawer-nav-icon">${icon('worksheets', { size: 18 })}</span>
            <span class="drawer-nav-label">${t('nav_worksheets')}</span>
            ${activeTab === 'worksheets' ? '<span class="drawer-active-dot"></span>' : ''}
          </button>
          <button class="drawer-nav-btn ${activeTab === 'syllabus' ? 'active' : ''}" data-tab="syllabus">
            <span class="drawer-nav-icon">${icon('syllabus', { size: 18 })}</span>
            <span class="drawer-nav-label">${t('nav_syllabus')}</span>
            ${activeTab === 'syllabus' ? '<span class="drawer-active-dot"></span>' : ''}
          </button>
          <button class="drawer-nav-btn ${activeTab === 'sync' ? 'active' : ''}" data-tab="sync">
            <span class="drawer-nav-icon">${icon('sync', { size: 18 })}</span>
            <span class="drawer-nav-label">${t('nav_sync_settings')}</span>
            ${activeTab === 'sync' ? '<span class="drawer-active-dot"></span>' : ''}
          </button>
          <button class="drawer-nav-btn ${activeTab === 'settings' ? 'active' : ''}" data-tab="settings">
            <span class="drawer-nav-icon">${icon('settings', { size: 18 })}</span>
            <span class="drawer-nav-label">${lang === 'te' ? 'పూర్తి సెట్టింగ్స్ పేజీ' : 'Full Settings Page'}</span>
            ${activeTab === 'settings' ? '<span class="drawer-active-dot"></span>' : ''}
          </button>
        </div>

        <div class="drawer-footer">
          <div class="drawer-footer-text">
            EduFree.AI • Telangana FLN Early Literacy • Offline First
          </div>
        </div>
      </nav>

      <!-- =====================================================================
           Mobile Bottom Dock (Fixed, 5 Buttons in Single Row)
           [Accounts] [Language] [Sync] [Activities] [Guidelines]
           ===================================================================== -->
      <nav id="mobile-bottom-bar" class="mobile-bottom-bar" role="navigation" aria-label="Mobile Navigation Dock">
        <!-- 1. Accounts Button -->
        <button id="mobile-dock-account" class="mobile-dock-btn ${user?.isGuest ? 'dock-guest' : 'dock-auth'}" aria-label="Account">
          <div class="dock-icon-wrap">
            <span class="dock-icon">${user?.isGuest ? icon('user', { size: 20 }) : icon('lock', { size: 20 })}</span>
          </div>
          <span class="dock-label">${lang === 'te' ? 'ఖాతా' : 'Account'}</span>
        </button>

        <!-- 2. Language Button -->
        <button id="mobile-dock-lang" class="mobile-dock-btn" aria-label="Language Toggle">
          <div class="dock-icon-wrap">
            <span class="dock-icon">${icon('globe', { size: 20 })}</span>
            <span class="dock-badge-lang">${lang === 'te' ? 'EN' : 'TE'}</span>
          </div>
          <span class="dock-label">${lang === 'te' ? 'English' : 'తెలుగు'}</span>
        </button>

        <!-- 3. Sync Button -->
        <button id="mobile-dock-sync" class="mobile-dock-btn" aria-label="Data Sync">
          <div class="dock-icon-wrap">
            <span class="dock-icon">${icon('sync', { size: 20 })}</span>
            ${syncStats.unsyncedCount > 0 ? `<span class="dock-badge-count">${syncStats.unsyncedCount}</span>` : ''}
          </div>
          <span class="dock-label">${syncStats.unsyncedCount > 0 ? `${syncStats.unsyncedCount} Sync` : (lang === 'te' ? 'సింక్' : 'Sync')}</span>
        </button>

        <!-- 4. Activities Button (Stylish Practice & Activities Center) -->
        <button id="mobile-dock-activities" class="mobile-dock-btn dock-btn-highlight ${activeTab === 'activities' ? 'dock-active' : ''}" aria-label="Activities">
          <div class="dock-icon-wrap dock-icon-special">
            <span class="dock-icon">${icon('activities', { size: 22 })}</span>
          </div>
          <span class="dock-label dock-label-special">${lang === 'te' ? 'కృత్యాలు' : 'Activities'}</span>
        </button>

        <!-- 5. Guidelines Button (Telangana FLN Assessment Rubric & Guidelines) -->
        <button id="mobile-dock-guidelines" class="mobile-dock-btn ${activeTab === 'syllabus' ? 'dock-active' : ''}" aria-label="Guidelines">
          <div class="dock-icon-wrap">
            <span class="dock-icon">${icon('clipboard', { size: 20 })}</span>
          </div>
          <span class="dock-label">${lang === 'te' ? 'మార్గదర్శకాలు' : 'Guidelines'}</span>
        </button>
      </nav>
    </header>
  `;

  // ── Helper: open / close the drawer ──
  function openDrawer() {
    _drawerOpen = true;
    const drawer = container.querySelector('#nav-drawer');
    const overlay = container.querySelector('#drawer-overlay');
    const hamburger = container.querySelector('#hamburger-btn');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    if (hamburger) {
      hamburger.classList.add('is-open');
      hamburger.setAttribute('aria-expanded', 'true');
    }
  }

  function closeDrawer() {
    _drawerOpen = false;
    const drawer = container.querySelector('#nav-drawer');
    const overlay = container.querySelector('#drawer-overlay');
    const hamburger = container.querySelector('#hamburger-btn');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    if (hamburger) {
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  }

  // ── Attach event handlers ──
  container.querySelector('#brand-home-btn').onclick = () => onTabChange('dashboard');

  // Desktop horizontal nav tabs
  container.querySelectorAll('.nav-tab-btn').forEach((btn) => {
    btn.onclick = () => {
      const targetTab = btn.dataset.tab;
      onTabChange(targetTab);
    };
  });

  // Mobile drawer nav buttons
  container.querySelectorAll('.drawer-nav-btn').forEach((btn) => {
    btn.onclick = () => {
      closeDrawer();
      const targetTab = btn.dataset.tab;
      onTabChange(targetTab);
    };
  });

  // Hamburger toggle
  const hamburgerBtn = container.querySelector('#hamburger-btn');
  if (hamburgerBtn) {
    hamburgerBtn.onclick = () => {
      if (_drawerOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    };
  }

  // Close button inside drawer
  const drawerCloseBtn = container.querySelector('#drawer-close-btn');
  if (drawerCloseBtn) {
    drawerCloseBtn.onclick = closeDrawer;
  }

  // Overlay click closes drawer
  const overlay = container.querySelector('#drawer-overlay');
  if (overlay) {
    overlay.onclick = closeDrawer;
  }

  // Desktop Controls
  const syncBtn = container.querySelector('#sync-status-pill');
  if (syncBtn) syncBtn.onclick = onOpenSync;

  const pinBtn = container.querySelector('#teacher-pin-toggle-btn');
  if (pinBtn) pinBtn.onclick = onTogglePin;

  const authAccountBtn = container.querySelector('#auth-account-btn');
  if (authAccountBtn && onOpenAuth) {
    authAccountBtn.onclick = onOpenAuth;
  }

  const langBtn = container.querySelector('#lang-toggle-btn');
  if (langBtn) {
    langBtn.onclick = () => {
      const nextLang = lang === 'te' ? 'en' : 'te';
      setLanguage(nextLang);
      onLanguageToggle();
    };
  }

  const sunlightBtn = container.querySelector('#sunlight-toggle-btn');
  if (sunlightBtn) {
    sunlightBtn.onclick = () => {
      document.body.classList.toggle('sunlight-mode');
      const isNowSunlight = document.body.classList.contains('sunlight-mode');
      localStorage.setItem('edufree_sunlight', isNowSunlight ? '1' : '0');
      renderNavbar(container, { activeTab, onTabChange, onOpenSync, onTogglePin, isTeacherMode, onLanguageToggle, onOpenAuth, onOpenGuidelines });
    };
  }

  // --- Mobile Drawer Settings Grid Buttons ---
  const drawerBtnAccount = container.querySelector('#drawer-btn-account');
  if (drawerBtnAccount && onOpenAuth) {
    drawerBtnAccount.onclick = () => {
      closeDrawer();
      onOpenAuth();
    };
  }

  const drawerBtnMode = container.querySelector('#drawer-btn-mode');
  if (drawerBtnMode && onTogglePin) {
    drawerBtnMode.onclick = () => {
      closeDrawer();
      onTogglePin();
    };
  }

  const drawerBtnContrast = container.querySelector('#drawer-btn-contrast');
  if (drawerBtnContrast) {
    drawerBtnContrast.onclick = () => {
      document.body.classList.toggle('sunlight-mode');
      const isNowSunlight = document.body.classList.contains('sunlight-mode');
      localStorage.setItem('edufree_sunlight', isNowSunlight ? '1' : '0');
      renderNavbar(container, { activeTab, onTabChange, onOpenSync, onTogglePin, isTeacherMode, onLanguageToggle, onOpenAuth, onOpenGuidelines });
    };
  }

  const drawerBtnLang = container.querySelector('#drawer-btn-lang');
  if (drawerBtnLang) {
    drawerBtnLang.onclick = () => {
      const nextLang = lang === 'te' ? 'en' : 'te';
      setLanguage(nextLang);
      onLanguageToggle();
    };
  }

  const drawerBtnSync = container.querySelector('#drawer-btn-sync');
  if (drawerBtnSync && onOpenSync) {
    drawerBtnSync.onclick = () => {
      closeDrawer();
      onOpenSync();
    };
  }

  // --- Mobile Fixed Bottom Bar (5 buttons in 1 line) ---
  const dockAccount = container.querySelector('#mobile-dock-account');
  if (dockAccount && onOpenAuth) {
    dockAccount.onclick = onOpenAuth;
  }

  const dockLang = container.querySelector('#mobile-dock-lang');
  if (dockLang) {
    dockLang.onclick = () => {
      const nextLang = lang === 'te' ? 'en' : 'te';
      setLanguage(nextLang);
      onLanguageToggle();
    };
  }

  const dockSync = container.querySelector('#mobile-dock-sync');
  if (dockSync && onOpenSync) {
    dockSync.onclick = onOpenSync;
  }

  const dockActivities = container.querySelector('#mobile-dock-activities');
  if (dockActivities) {
    dockActivities.onclick = () => {
      onTabChange('activities');
    };
  }

  const dockGuidelines = container.querySelector('#mobile-dock-guidelines');
  if (dockGuidelines) {
    dockGuidelines.onclick = () => {
      if (onOpenGuidelines) {
        onOpenGuidelines();
      } else {
        onTabChange('syllabus');
      }
    };
  }
}
