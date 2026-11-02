// EduFree.AI Main Application Bootstrap & Router
import './style.css';
import { openDB, getSetting, setSetting } from './storage/db.js';
import { subscribeSyncState } from './storage/syncQueue.js';
import { renderNavbar } from './components/navbar.js';
import { renderDashboard } from './components/classDashboard.js';
import { renderAssessment } from './components/assessmentView.js';
import { renderPractice } from './components/practiceModule.js';
import { renderStudentProfile } from './components/studentProfile.js';
import { renderPrintableSheets } from './components/printableSheet.js';
import { renderScertSyllabus } from './components/scertSyllabusView.js';
import { renderSettingsView } from './components/settingsView.js';
import { renderSyncModal } from './components/syncModal.js';
import { openAddStudentModal, openAddClassModal } from './components/rosterModal.js';
import { openPinModal } from './components/pinModal.js';
import { openAuthModal, openUserProfileModal } from './components/authModal.js';
import { openGuidelinesModal } from './components/guidelinesModal.js';
import { renderActivities } from './components/activitiesModule.js';
import { renderDeveloperView } from './components/developerView.js';
import { initFirebase, getCurrentSessionUser, isAuthenticated, subscribeAuth, signOutUser } from './services/firebaseAuth.js';
import { initGemma4Offline, subscribeNetworkStatus, getAIStatus } from './services/gemma4Offline.js';
import { initTeacherChatbot } from './components/chatbot.js';

import { getLanguage } from './data/i18n.js';

// Application State
let activeTab = 'dashboard'; // 'dashboard' | 'assess' | 'practice' | 'worksheets' | 'syllabus' | 'profile' | 'settings' | 'activities'
const initialParams = new URLSearchParams(window.location.search);
const initialHash = window.location.hash.replace('#', '');
if (initialParams.get('tab') === 'activities' || initialHash === 'activities') {
  activeTab = 'activities';
}
let isTeacherMode = true;
let selectedStudentForProfile = null;
let selectedStudentForAssessment = null;
let selectedLevelForPractice = 'level_1_letters';

const navbarRoot = document.getElementById('navbar-root');
const appRoot = document.getElementById('app');

async function initApp() {
  try {
    // 1. Initialize IndexedDB & seed data if needed
    await openDB();
    document.documentElement.lang = getLanguage();

    // 2. Initialize Firebase authentication
    initFirebase();

    // 3. Initialize Gemma 4 Offline AI Engine
    await initGemma4Offline();

    // 4. Restore settings
    const savedSunlight = localStorage.getItem('edufree_sunlight');
    if (savedSunlight === '1') {
      document.body.classList.add('sunlight-mode');
    }

    const savedAppMode = await getSetting('app_mode', 'teacher');
    isTeacherMode = savedAppMode === 'teacher';

    // 5. Register Service Worker for offline PWA capabilities
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Service worker registration note:', err);
      });
    }

    // 6. Subscribe to sync and network changes
    subscribeSyncState(() => {
      updateNavbar();
    });

    // 7. Subscribe to auth changes
    subscribeAuth(() => {
      updateNavbar();
    });

    // 8. Subscribe to offline/online network changes — re-render navbar & show AI status
    subscribeNetworkStatus(({ online }) => {
      updateNavbar();
      _showNetworkToast(online);
    });

    // 8.1 Initialize Unique Circular Logo Teacher Assistant Chatbot (Gemini + Gemma 4)
    initTeacherChatbot(document.body, {
      onViewStudentProfile: (studentId) => {
        selectedStudentForProfile = studentId;
        activeTab = 'profile';
        renderCurrentState();
      },
      onStartAssessment: (studentId) => {
        selectedStudentForAssessment = studentId;
        activeTab = 'assess';
        renderCurrentState();
      },
      onStartPractice: (studentId, levelId) => {
        selectedLevelForPractice = levelId || 'level_1_letters';
        activeTab = 'practice';
        renderCurrentState();
      },
      onNavigateTab: (tab) => {
        activeTab = tab;
        renderCurrentState();
      }
    });

    // 9. Initial render of the app
    await renderCurrentState();

    // 10. If user is not yet logged in or guest, prompt the secure Firebase login panel
    if (!isAuthenticated()) {
      openAuthModal({
        onSuccess: () => {
          activeTab = 'dashboard';
          renderCurrentState();
        },
        canDismiss: false
      });
    }
  } catch (error) {
    console.error('Fatal initialization error:', error);
    appRoot.innerHTML = `
      <div class="card" style="text-align: center; padding: 40px;">
        <h2 style="color: #e11d48; margin-bottom: 12px;">యాప్ ప్రారంభంలో లోపం తలెత్తింది</h2>
        <p style="color: var(--text-muted); margin-bottom: 20px;">${error.message || 'దయచేసి పేజీని రీఫ్రెష్ చేయండి.'}</p>
        <button onclick="location.reload()" class="btn btn-primary">తిరిగి ప్రయత్నించండి (Reload)</button>
      </div>
    `;
  }
}

// ============================================================
// OFFLINE / ONLINE TOAST NOTIFICATION
// ============================================================
let _toastTimer = null;
function _showNetworkToast(isOnline) {
  // Remove existing toast
  const existing = document.getElementById('edufree-net-toast');
  if (existing) existing.remove();
  if (_toastTimer) clearTimeout(_toastTimer);

  const aiStatus = getAIStatus();
  const lang = getLanguage();

  const toast = document.createElement('div');
  toast.id = 'edufree-net-toast';
  toast.style.cssText = [
    'position: fixed',
    'bottom: 80px',
    'left: 50%',
    'transform: translateX(-50%) translateY(20px)',
    'z-index: 99999',
    'padding: 12px 22px',
    'border-radius: 40px',
    'font-size: 0.88rem',
    'font-weight: 600',
    'font-family: var(--font-sans, Inter, sans-serif)',
    'box-shadow: 0 8px 32px rgba(0,0,0,0.22)',
    'display: flex',
    'align-items: center',
    'gap: 10px',
    'opacity: 0',
    'transition: opacity 0.35s ease, transform 0.35s ease',
    isOnline
      ? 'background: linear-gradient(135deg, #059669, #10b981); color: #fff;'
      : 'background: linear-gradient(135deg, #5b21b6, #7c3aed); color: #fff;'
  ].join(';');

  if (isOnline) {
    toast.innerHTML = `<span>🌐</span><span>${lang === 'te' ? 'ఇంటర్నెట్ అందుబాటులో ఉంది — Firebase Sync సక్రియం' : 'Back Online — Firebase Sync Active'}</span>`;
  } else {
    toast.innerHTML = `<span>🤖</span><span>${lang === 'te' ? 'ఆఫ్‌లైన్ — Gemma 4 AI ఇప్పుడు యాప్‌కు శక్తి ఇస్తోంది' : 'Offline — Gemma 4 AI is now powering the app'}</span>`;
  }

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
  });

  // Auto-dismiss
  _toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

function updateNavbar() {
  renderNavbar(navbarRoot, {
    activeTab,
    isTeacherMode,
    onTabChange: (tab) => {
      if (tab === 'sync') {
        openSyncModal();
        return;
      }
      if (tab === 'activities') {
        activeTab = 'activities';
        renderCurrentState();
        return;
      }
      if (!isTeacherMode && (tab === 'dashboard' || tab === 'assess' || tab === 'worksheets')) {
        // Must unlock PIN first to access teacher areas
        promptTeacherUnlock(() => {
          activeTab = tab;
          renderCurrentState();
        });
        return;
      }
      activeTab = tab;
      renderCurrentState();
    },
    onOpenSync: openSyncModal,
    onTogglePin: handlePinToggle,
    onOpenAuth: handleOpenAuth,
    onOpenGuidelines: () => {
      openGuidelinesModal({
        onViewSyllabus: () => {
          activeTab = 'syllabus';
          renderCurrentState();
        }
      });
    },
    onLanguageToggle: () => {
      renderCurrentState();
    }
  });
}

function handleOpenAuth() {
  const user = getCurrentSessionUser();
  if (!user) {
    openAuthModal({
      onSuccess: () => renderCurrentState(),
      canDismiss: true
    });
  } else {
    openUserProfileModal({
      onLogout: async () => {
        await renderCurrentState();
        openAuthModal({
          onSuccess: () => renderCurrentState(),
          canDismiss: true
        });
      },
      onSwitchAccount: () => {
        openAuthModal({
          onSuccess: () => renderCurrentState(),
          canDismiss: true
        });
      }
    });
  }
}

async function renderCurrentState() {
  updateNavbar();

  if (activeTab === 'dashboard') {
    await renderDashboard(appRoot, {
      onStartAssessment: (studentId) => {
        selectedStudentForAssessment = studentId || null;
        activeTab = 'assess';
        renderCurrentState();
      },
      onViewProfile: (studentId) => {
        selectedStudentForProfile = studentId;
        activeTab = 'profile';
        renderCurrentState();
      },
      onStartPractice: (studentId, levelId) => {
        selectedLevelForPractice = levelId || 'level_1_letters';
        activeTab = 'practice';
        renderCurrentState();
      },
      onOpenAddStudent: (currentClassId) => {
        openAddStudentModal(currentClassId, () => renderCurrentState());
      },
      onOpenAddClass: () => {
        openAddClassModal(() => renderCurrentState());
      },
      onViewSyllabus: () => {
        activeTab = 'syllabus';
        renderCurrentState();
      },
      onOpenActivities: () => {
        activeTab = 'activities';
        renderCurrentState();
      }
    });
  } else if (activeTab === 'assess') {
    await renderAssessment(appRoot, {
      initialStudentId: selectedStudentForAssessment,
      onFinish: () => {
        activeTab = 'dashboard';
        renderCurrentState();
      },
      onLaunchPractice: (studentId, levelId) => {
        selectedLevelForPractice = levelId;
        activeTab = 'practice';
        renderCurrentState();
      }
    });
  } else if (activeTab === 'practice') {
    renderPractice(appRoot, {
      initialLevelId: selectedLevelForPractice,
      onBack: () => {
        activeTab = 'dashboard';
        renderCurrentState();
      },
      onOpenActivities: () => {
        activeTab = 'activities';
        renderCurrentState();
      }
    });
  } else if (activeTab === 'worksheets') {
    await renderPrintableSheets(appRoot, {
      onBack: () => {
        activeTab = 'dashboard';
        renderCurrentState();
      }
    });
  } else if (activeTab === 'syllabus') {
    renderScertSyllabus(appRoot, {
      onBack: () => {
        activeTab = 'dashboard';
        renderCurrentState();
      },
      onLaunchPractice: (levelId) => {
        selectedLevelForPractice = levelId;
        activeTab = 'practice';
        renderCurrentState();
      }
    });
  } else if (activeTab === 'profile') {
    await renderStudentProfile(appRoot, {
      studentId: selectedStudentForProfile,
      onBack: () => {
        activeTab = 'dashboard';
        renderCurrentState();
      },
      onStartAssessment: (studentId) => {
        selectedStudentForAssessment = studentId;
        activeTab = 'assess';
        renderCurrentState();
      },
      onStartPractice: (studentId, levelId) => {
        selectedLevelForPractice = levelId || 'level_1_letters';
        activeTab = 'practice';
        renderCurrentState();
      }
    });
  } else if (activeTab === 'settings') {
    await renderSettingsView(appRoot, {
      isTeacherMode,
      onTogglePin: handlePinToggle,
      onOpenAuth: handleOpenAuth,
      onOpenSync: openSyncModal,
      onLanguageToggle: () => {
        renderCurrentState();
      },
      onBack: () => {
        activeTab = 'dashboard';
        renderCurrentState();
      },
      onOpenDeveloper: () => {
        activeTab = 'developer';
        renderCurrentState();
      }
    });
  } else if (activeTab === 'developer') {
    renderDeveloperView(appRoot, {
      onBack: () => {
        activeTab = 'settings';
        renderCurrentState();
      }
    });
  } else if (activeTab === 'activities') {
    renderActivities(appRoot, {
      onBack: () => {
        activeTab = 'dashboard';
        renderCurrentState();
      }
    });
  }
}

function openSyncModal() {
  renderSyncModal(document.body, {
    onClose: () => {},
    onDataUpdated: () => {
      renderCurrentState();
    }
  });
}

function handlePinToggle() {
  if (isTeacherMode) {
    // Switch to Student Practice Mode
    isTeacherMode = false;
    setSetting('app_mode', 'student');
    activeTab = 'practice';
    renderCurrentState();
  } else {
    // Unlock Teacher Mode
    promptTeacherUnlock(() => {
      activeTab = 'dashboard';
      renderCurrentState();
    });
  }
}

function promptTeacherUnlock(onUnlocked) {
  openPinModal({
    onSuccess: async () => {
      isTeacherMode = true;
      await setSetting('app_mode', 'teacher');
      onUnlocked();
    },
    onCancel: () => {}
  });
}

// Kick off app
initApp();
