// EduFree.AI - Settings View Component
// Comprehensive Device & Classroom Settings Page

import { t, getLanguage, setLanguage } from '../data/i18n.js';
import { getCurrentSessionUser, getFirebaseConfig, signOutUser } from '../services/firebaseAuth.js';
import { getSyncStats } from '../storage/syncQueue.js';
import { getAIStatus } from '../services/gemma4Offline.js';
import { getGeminiApiKey, setGeminiApiKey, isGeminiActive, isSimulatedOffline, setSimulatedOffline } from '../services/geminiService.js';
import { checkSupabaseStatus, syncBatchToSupabase } from '../services/supabaseService.js';
import { getAllFromStore } from '../storage/db.js';
import { icon } from '../utils/icons.js';

export async function renderSettingsView(container, {
  isTeacherMode,
  onTogglePin,
  onOpenAuth,
  onOpenSync,
  onLanguageToggle,
  onBack,
  onOpenDeveloper
}) {
  const user = getCurrentSessionUser();
  const config = getFirebaseConfig();
  const syncStats = await getSyncStats();
  const lang = getLanguage();
  const isSunlight = document.body.classList.contains('sunlight-mode');

  container.innerHTML = `
    <div class="settings-page-container animate-fade-in">
      <div class="card-header" style="margin-bottom: 24px;">
        <div>
          <button id="settings-back-btn" class="btn btn-outline btn-sm" style="margin-bottom: 12px;">
            ← ${lang === 'te' ? 'డ్యాష్‌బోర్డ్‌కి తిరిగి వెళ్ళు' : 'Back to Dashboard'}
          </button>
          <h2 class="card-title" style="font-size: 1.6rem; color: var(--primary-900);">
            <span>${icon('settings', { size: 26 })}</span> ${lang === 'te' ? 'సిస్టమ్ సెట్టింగ్స్ & నియంత్రణలు' : 'System Settings & Controls'}
          </h2>
          <p style="color: var(--text-muted); font-size: 0.88rem; margin-top: 4px;">
            ${lang === 'te'
      ? 'ఖాతా, భద్రత, కాంట్రాస్ట్, ఉపాధ్యాయ మోడ్ మరియు ఆఫ్‌లైన్ సింక్ నిర్వహణ'
      : 'Manage account, security, high contrast, teacher mode, and offline sync.'}
          </p>
        </div>
      </div>

      <!-- Quick Action Buttons Grid (Matching Mobile Specs) -->
      <div class="settings-action-grid">
        <!-- 1. Accounts -->
        <button id="set-btn-account" class="settings-tile-btn">
          <div class="tile-icon-wrap">
            <span class="tile-icon">${user ? icon('lock', { size: 24 }) : icon('user', { size: 24 })}</span>
          </div>
          <div class="tile-content">
            <span class="tile-title">${lang === 'te' ? 'ఖాతా వివరాలు' : 'Account'}</span>
            <span class="tile-status">${user ? (user.displayName || user.email) : (lang === 'te' ? 'గెస్ట్ సెషన్' : 'Guest Session')}</span>
          </div>
          <span class="tile-arrow">→</span>
        </button>

        <!-- 2. Practice / Teacher Mode -->
        <button id="set-btn-mode" class="settings-tile-btn ${isTeacherMode ? 'tile-teacher-active' : ''}">
          <div class="tile-icon-wrap">
            <span class="tile-icon">${isTeacherMode ? icon('unlock', { size: 24 }) : icon('lock', { size: 24 })}</span>
          </div>
          <div class="tile-content">
            <span class="tile-title">${lang === 'te' ? 'ఉపాధ్యాయ / సాధన మోడ్' : 'Teacher / Practice'}</span>
            <span class="tile-status" style="${isTeacherMode ? 'color: #b45309; font-weight: 700;' : ''}">
              ${isTeacherMode ? (lang === 'te' ? 'ఉపాధ్యాయ మోడ్ (పూర్తి యాక్సెస్)' : 'Teacher Mode (Active)') : (lang === 'te' ? 'విద్యార్థి సాధన (లాక్)' : 'Practice Mode (Student)')}
            </span>
          </div>
          <span class="tile-badge-pill">${isTeacherMode ? (lang === 'te' ? 'పిన్ సెట్ చేయండి' : 'Teacher') : (lang === 'te' ? 'లాక్' : 'Locked')}</span>
        </button>

        <!-- 3. Contrast (Sunlight Mode) -->
        <button id="set-btn-contrast" class="settings-tile-btn ${isSunlight ? 'tile-contrast-active' : ''}">
          <div class="tile-icon-wrap">
            <span class="tile-icon">${isSunlight ? icon('sun', { size: 24 }) : icon('contrast', { size: 24 })}</span>
          </div>
          <div class="tile-content">
            <span class="tile-title">${lang === 'te' ? 'పగటి వెలుతురు కాంట్రాస్ట్' : 'Contrast Mode'}</span>
            <span class="tile-status">
              ${isSunlight ? (lang === 'te' ? 'సూర్యరశ్మి కాంట్రాస్ట్ ఆన్ (అధిక దృశ్యత)' : 'High Contrast Sunlight (Active)') : (lang === 'te' ? 'సాధారణ రంగుల థీమ్' : 'Standard Green Palette')}
            </span>
          </div>
          <span class="tile-badge-pill">${isSunlight ? (lang === 'te' ? 'ఆన్' : 'ON') : (lang === 'te' ? 'ఆఫ్' : 'OFF')}</span>
        </button>

        <!-- 4. Language (Telugu / English) -->
        <button id="set-btn-lang" class="settings-tile-btn">
          <div class="tile-icon-wrap">
            <span class="tile-icon">${icon('globe', { size: 24 })}</span>
          </div>
          <div class="tile-content">
            <span class="tile-title">${lang === 'te' ? 'యాప్ భాష (Language)' : 'App Language'}</span>
            <span class="tile-status">${lang === 'te' ? 'తెలుగు (ప్రస్తుతం)' : 'English (Active)'}</span>
          </div>
          <span class="tile-badge-pill">${lang === 'te' ? 'Switch to English' : 'తెలుగులోకి మార్చు'}</span>
        </button>

        <!-- 5. Offline Data & Sync -->
        <button id="set-btn-sync" class="settings-tile-btn">
          <div class="tile-icon-wrap">
            <span class="tile-icon">${icon('sync', { size: 24 })}</span>
            ${syncStats.unsyncedCount > 0 ? `<span class="tile-count-badge">${syncStats.unsyncedCount}</span>` : ''}
          </div>
          <div class="tile-content">
            <span class="tile-title">${lang === 'te' ? 'ఆఫ్‌లైన్ నిల్వ & క్లౌడ్ సింక్' : 'Offline Storage & Sync'}</span>
            <span class="tile-status">
              ${syncStats.unsyncedCount > 0
      ? `${syncStats.unsyncedCount} ${lang === 'te' ? 'రికార్డులు సింక్ చేయవలసి ఉంది' : 'records pending sync'}`
      : (lang === 'te' ? 'అన్ని రికార్డులు సురక్షితంగా ఉన్నాయి' : 'All local data synced')}
            </span>
          </div>
          <span class="tile-arrow">→</span>
        </button>

        <!-- 6. Gemma 4 Offline AI Mode -->
        ${(() => {
          const ai = getAIStatus();
          const isOff = ai.isOffline;
          return `
        <div id="set-ai-status-tile" class="settings-tile-btn ${isOff ? 'tile-ai-offline' : 'tile-ai-online'}" style="cursor: default;">
          <div class="tile-icon-wrap">
            <span class="tile-icon">${isOff ? icon('bot', { size: 24 }) : icon('globe', { size: 24 })}</span>
            ${isOff ? '<span class="tile-ai-pulse"></span>' : ''}
          </div>
          <div class="tile-content">
            <span class="tile-title">${lang === 'te' ? 'AI మోడ్ స్థితి' : 'AI Engine Mode'}</span>
            <span class="tile-status" style="${isOff ? 'color: #a78bfa; font-weight: 700;' : 'color: #10b981; font-weight: 700;'}">
              ${isOff
                ? (lang === 'te' ? 'Gemma 4 Offline AI సక్రియం (ఆఫ్‌లైన్ మోడ్)' : 'Gemma 4 Offline AI Active')
                : (lang === 'te' ? 'Firebase Online సక్రియం' : 'Firebase Online Active')}
            </span>
          </div>
          <span class="tile-badge-pill" style="${isOff ? 'background: rgba(124,58,237,0.18); color: #a78bfa; border-color: rgba(124,58,237,0.3);' : 'background: rgba(16,185,129,0.18); color: #10b981; border-color: rgba(16,185,129,0.3);'}">
            ${isOff ? (lang === 'te' ? 'ఆఫ్‌లైన్' : 'OFFLINE') : (lang === 'te' ? 'ఆన్‌లైన్' : 'ONLINE')}
          </span>
        </div>`;
        })()}
      </div>

      <!-- About Developer Button -->
        <button id="set-btn-developer" class="settings-tile-btn tile-developer">
          <div class="tile-icon-wrap">
            <span class="tile-icon">${icon('developer', { size: 24 })}</span>
          </div>
          <div class="tile-content">
            <span class="tile-title">${lang === 'te' ? 'డెవలపర్ గురించి' : 'About Developer'}</span>
            <span class="tile-status">Muhammad Aman · EduFree.AI</span>
          </div>
          <span class="tile-arrow">→</span>
        </button>

      <!-- Detailed Info Card -->
      <div class="card" style="margin-top: 24px; padding: 22px;">
        <h3 style="font-size: 1.15rem; color: var(--primary-800); margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
          <span>${icon('flame', { size: 20, color: '#f59e0b' })}</span> Firebase Project Configuration
        </h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px;">
          <div class="settings-info-box">
            <span class="info-k">Project ID</span>
            <span class="info-v">edufree-ai-73e5f</span>
          </div>
          <div class="settings-info-box">
            <span class="info-k">Sender ID / Project Number</span>
            <span class="info-v">268969651642</span>
          </div>
          <div class="settings-info-box">
            <span class="info-k">Storage Bucket</span>
            <span class="info-v">edufree-ai-73e5f.firebasestorage.app</span>
          </div>
          <div class="settings-info-box">
            <span class="info-k">Status</span>
            <span class="info-v" style="color: #10b981; font-weight: 700;">● Active & Ready</span>
          </div>
        </div>

        <div style="margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
          <button id="set-manage-acc-btn" class="btn btn-primary btn-sm">
            ${icon('lock', { size: 15 })} ${user?.isGuest ? 'Sign In with Firebase' : 'Manage Account & Security'}
          </button>
          ${!user?.isGuest ? `
            <button id="set-signout-btn" class="btn btn-outline btn-sm" style="color: #f43f5e; border-color: #f43f5e;">
              ${icon('logout', { size: 15, color: '#f43f5e' })} Sign Out
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Google Gemini & Gemma 4 AI Assistant Card -->
      <div class="card" style="margin-top: 24px; padding: 22px;">
        <h3 style="font-size: 1.15rem; color: var(--primary-800); margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
          <span>${icon('sparkles', { size: 20, color: '#10b981' })}</span> ${lang === 'te' ? 'Google Gemini & Gemma 4 AI సహాయక ఇంజిన్' : 'Google Gemini & Gemma 4 AI Assistant'}
        </h3>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 16px;">
          ${lang === 'te'
            ? 'బోధనా మిత్ర చాట్‌బాట్ ఆన్‌లైన్‌లో Google Gemini ద్వారా మరియు ఆఫ్‌లైన్‌లో Gemma 4 AI ద్వారా విద్యార్థుల డేటాను విశ్లేషిస్తుంది.'
            : 'Teacher Mitra chatbot uses Google Gemini when online and Gemma 4 AI when offline to analyze all student reading data.'}
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; margin-bottom: 18px;">
          <div class="settings-info-box">
            <span class="info-k">${lang === 'te' ? 'ఆన్‌లైన్ ఇంజిన్' : 'Online AI Engine'}</span>
            <span class="info-v" style="color: #059669; font-weight: 700;">Google Gemini 3.8 Flash</span>
          </div>
          <div class="settings-info-box">
            <span class="info-k">${lang === 'te' ? 'ఆఫ్‌లైన్ ఇంజిన్' : 'Offline AI Engine'}</span>
            <span class="info-v" style="color: #7c3aed; font-weight: 700;">Gemma 4 Offline AI (Local)</span>
          </div>
          <div class="settings-info-box">
            <span class="info-k">${lang === 'te' ? 'ప్రస్తుత స్థితి' : 'Active Status'}</span>
            <span class="info-v" style="font-weight: 700; ${isGeminiActive() ? 'color: #10b981;' : 'color: #7c3aed;'}">
              ${isGeminiActive() ? '● Gemini Online Ready' : '● Gemma 4 Offline Active'}
            </span>
          </div>
        </div>

        <div style="background: var(--bg-card-subtle); padding: 16px; border-radius: 12px; border: 1.5px solid var(--border-light);">
          <label for="settings-gemini-key-input" style="display: block; font-size: 0.88rem; font-weight: 700; color: var(--primary-900); margin-bottom: 6px;">
            ${icon('key', { size: 16 })} Google Gemini API Key
          </label>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <input
              type="password"
              id="settings-gemini-key-input"
              class="form-control"
              style="flex: 1; min-width: 260px; font-family: monospace; padding: 8px 12px; border-radius: 8px; border: 1.5px solid var(--border-strong);"
              placeholder="AIzaSy..."
              value="${getGeminiApiKey()}"
            />
            <button id="settings-save-gemini-key-btn" class="btn btn-primary btn-sm">
              ${icon('save', { size: 15 })} ${lang === 'te' ? 'కీ సేవ్ చేయండి' : 'Save Gemini Key'}
            </button>
          </div>
          <div style="margin-top: 10px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <span style="font-size: 0.78rem; color: var(--text-muted);">
              ${lang === 'te'
                ? 'ఉచిత కీని Google AI Studio (aistudio.google.com) నుండి పొందవచ్చు.'
                : 'Get a free API key at Google AI Studio (aistudio.google.com).'}
            </span>
            <label style="display: flex; align-items: center; gap: 6px; font-size: 0.82rem; font-weight: 600; cursor: pointer;">
              <input type="checkbox" id="settings-sim-offline-checkbox" ${isSimulatedOffline() ? 'checked' : ''} style="width: 16px; height: 16px;" />
              ${lang === 'te' ? 'ఆఫ్‌లైన్ సిమ్యులేషన్ (Force Gemma 4)' : 'Simulate Offline (Force Gemma 4)'}
            </label>
          </div>
        </div>
      </div>

      <!-- Supabase Realtime Database Card -->
      <div class="card" style="margin-top: 24px; padding: 22px;">
        <h3 style="font-size: 1.15rem; color: var(--primary-800); margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
          <span>${icon('lightning', { size: 20, color: '#3ecf8e' })}</span> ${lang === 'te' ? 'Supabase రియల్‌టైమ్ డేటాబేస్' : 'Supabase Real-time Database'}
        </h3>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 16px;">
          ${lang === 'te'
            ? 'విద్యార్థుల మూల్యాంకనాలు, ప్రగతి మరియు అభ్యాస సమాచారాన్ని Supabase PostgreSQL డేటాబేస్‌లో రియల్‌టైమ్‌లో నిల్వ చేస్తుంది.'
            : 'Stores all students real-time reading assessments, progress, and practice metrics in Supabase PostgreSQL.'}
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; margin-bottom: 18px;">
          <div class="settings-info-box">
            <span class="info-k">${lang === 'te' ? 'డేటాబేస్ ఇంజిన్' : 'Database Engine'}</span>
            <span class="info-v" style="color: #3ecf8e; font-weight: 700;">Supabase (PostgreSQL)</span>
          </div>
          <div class="settings-info-box">
            <span class="info-k">${lang === 'te' ? 'ప్రాజెక్ట్' : 'Project'}</span>
            <span class="info-v" style="color: #3ecf8e; font-weight: 700; font-size: 0.82rem; font-family: monospace;">ifvgzvmxewdccudafsmm</span>
          </div>
          <div class="settings-info-box">
            <span class="info-k">${lang === 'te' ? 'సర్వర్ స్థితి' : 'Server Status'}</span>
            <span id="sb-status-badge" class="info-v" style="font-weight: 700; color: #6b7280;">
              ● ${lang === 'te' ? 'తనిఖీ చేస్తోంది...' : 'Checking...'}
            </span>
          </div>
        </div>

        <div style="background: var(--bg-card-subtle); padding: 16px; border-radius: 12px; border: 1.5px solid var(--border-light);">
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
            <button id="settings-test-sb-btn" class="btn btn-outline btn-sm">
              ${icon('lightning', { size: 15 })} ${lang === 'te' ? 'టెస్ట్ కనెక్షన్' : 'Test Connection'}
            </button>
            <button id="settings-sync-all-sb-btn" class="btn btn-outline btn-sm" style="color: #3ecf8e; border-color: #3ecf8e;">
              ${icon('sync', { size: 15, color: '#3ecf8e' })} ${lang === 'te' ? 'అన్ని డేటాను Supabase కి పంపండి' : 'Sync All to Supabase'}
            </button>
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px;">
            <span>${icon('link', { size: 14 })} ${lang === 'te' ? 'కనెక్ట్ అయింది:' : 'Connected to:'} https://ifvgzvmxewdccudafsmm.supabase.co</span>
          </div>
          <div id="sb-feedback-msg" style="margin-top: 10px; font-size: 0.82rem; font-weight: 600; display: none;"></div>
        </div>
      </div>
    </div>
  `;

  // Attach Handlers
  container.querySelector('#settings-back-btn').onclick = onBack;

  // Gemini API Key save handler
  const saveGeminiKeyBtn = container.querySelector('#settings-save-gemini-key-btn');
  if (saveGeminiKeyBtn) {
    saveGeminiKeyBtn.onclick = () => {
      const input = container.querySelector('#settings-gemini-key-input');
      const simCheckbox = container.querySelector('#settings-sim-offline-checkbox');
      setGeminiApiKey(input ? input.value : '');
      setSimulatedOffline(simCheckbox ? simCheckbox.checked : false);

      saveGeminiKeyBtn.textContent = lang === 'te' ? '✓ సేవ్ అయింది!' : '✓ Saved!';
      setTimeout(() => {
        renderSettingsView(container, {
          isTeacherMode,
          onTogglePin,
          onOpenAuth,
          onOpenSync,
          onLanguageToggle,
          onBack,
          onOpenDeveloper
        });
      }, 800);
    };
  }

  container.querySelector('#set-btn-account').onclick = onOpenAuth;
  const manageAccBtn = container.querySelector('#set-manage-acc-btn');
  if (manageAccBtn) manageAccBtn.onclick = onOpenAuth;

  const signoutBtn = container.querySelector('#set-signout-btn');
  if (signoutBtn) {
    signoutBtn.onclick = async () => {
      await signOutUser();
      onOpenAuth();
    };
  }

  container.querySelector('#set-btn-mode').onclick = onTogglePin;
  container.querySelector('#set-btn-contrast').onclick = () => {
    document.body.classList.toggle('sunlight-mode');
    const isNowSunlight = document.body.classList.contains('sunlight-mode');
    localStorage.setItem('edufree_sunlight', isNowSunlight ? '1' : '0');
    renderSettingsView(container, {
      isTeacherMode,
      onTogglePin,
      onOpenAuth,
      onOpenSync,
      onLanguageToggle,
      onBack,
      onOpenDeveloper
    });
  };

  container.querySelector('#set-btn-lang').onclick = () => {
    const nextLang = lang === 'te' ? 'en' : 'te';
    setLanguage(nextLang);
    onLanguageToggle();
  };

  container.querySelector('#set-btn-sync').onclick = onOpenSync;

  const devBtn = container.querySelector('#set-btn-developer');
  if (devBtn && onOpenDeveloper) devBtn.onclick = onOpenDeveloper;

  // -------------------------------------------------------------
  // Supabase Database Handlers
  // -------------------------------------------------------------
  const sbStatusBadge = container.querySelector('#sb-status-badge');
  const sbFeedbackMsg = container.querySelector('#sb-feedback-msg');

  // Check live status on load
  checkSupabaseStatus().then(status => {
    if (!sbStatusBadge) return;
    if (status.connected) {
      sbStatusBadge.style.color = '#10b981';
      sbStatusBadge.textContent = lang === 'te' 
        ? `● ఆన్‌లైన్ (${status.studentCount || 0} విద్యార్థులు)`
        : `● Online (${status.studentCount || 0} students)`;
    } else {
      sbStatusBadge.style.color = '#f59e0b';
      sbStatusBadge.textContent = lang === 'te'
        ? `● వేచి ఉంది / ఆఫ్‌లైన్ క్యూ`
        : `● Standby / Offline Queue`;
    }
  });

  // Test Supabase Connection
  const testSbBtn = container.querySelector('#settings-test-sb-btn');
  if (testSbBtn) {
    testSbBtn.onclick = async () => {
      testSbBtn.textContent = lang === 'te' ? 'తనిఖీ చేస్తోంది...' : 'Testing...';
      const status = await checkSupabaseStatus();
      testSbBtn.textContent = lang === 'te' ? '⚡ టెస్ట్ కనెక్షన్' : '⚡ Test Connection';

      if (sbFeedbackMsg) {
        sbFeedbackMsg.style.display = 'block';
        if (status.connected) {
          sbFeedbackMsg.style.color = '#10b981';
          sbFeedbackMsg.textContent = lang === 'te'
            ? `✓ కనెక్షన్ విజయవంతం! Supabase డేటాబేస్‌లో ${status.studentCount || 0} విద్యార్థుల రికార్డులు ఉన్నాయి.`
            : `✓ Connected to Supabase! ${status.studentCount || 0} student records verified.`;
          if (sbStatusBadge) {
            sbStatusBadge.style.color = '#10b981';
            sbStatusBadge.textContent = lang === 'te' ? `● ఆన్‌లైన్ (${status.studentCount || 0})` : `● Online (${status.studentCount || 0})`;
          }
        } else {
          sbFeedbackMsg.style.color = '#f43f5e';
          sbFeedbackMsg.textContent = lang === 'te'
            ? `⚠ సర్వర్ కనెక్ట్ కాలేదు (${status.error || 'ఆఫ్‌లైన్'}). దయచేసి Supabase లో tables సృష్టించబడ్డాయా లేదా చూడండి.`
            : `⚠ Cannot reach Supabase (${status.error || 'Offline'}). Please ensure schema tables are created in Supabase SQL editor.`;
        }
      }
    };
  }

  // Sync All Existing Students to Supabase
  const syncAllSbBtn = container.querySelector('#settings-sync-all-sb-btn');
  if (syncAllSbBtn) {
    syncAllSbBtn.onclick = async () => {
      syncAllSbBtn.textContent = lang === 'te' ? 'సింక్ అవుతోంది...' : 'Syncing...';
      const students = await getAllFromStore('students');
      const assessments = await getAllFromStore('assessments');

      const result = await syncBatchToSupabase({ students, assessments });
      syncAllSbBtn.textContent = lang === 'te' ? '🔄 అన్ని డేటాను Supabase కి పంపండి' : '🔄 Sync All to Supabase';

      if (sbFeedbackMsg) {
        sbFeedbackMsg.style.display = 'block';
        if (result.success) {
          sbFeedbackMsg.style.color = '#10b981';
          sbFeedbackMsg.textContent = lang === 'te'
            ? `✓ విజయవంతంగా ${result.syncedStudents || students.length} విద్యార్థులు & ${result.syncedAssessments || assessments.length} మూల్యాంకనాలు Supabase కు సింక్ అయ్యాయి!`
            : `✓ Successfully synced ${result.syncedStudents || students.length} students & ${result.syncedAssessments || assessments.length} assessments to Supabase!`;
        } else {
          sbFeedbackMsg.style.color = '#f59e0b';
          sbFeedbackMsg.textContent = lang === 'te'
            ? `⚠ సింక్ లోపం: ${result.error || result.reason}. డేటా స్థానికంగా సురక్షితంగా ఉంది.`
            : `⚠ Sync notice: ${result.error || result.reason}. Local records are preserved.`;
        }
      }
    };
  }
}
