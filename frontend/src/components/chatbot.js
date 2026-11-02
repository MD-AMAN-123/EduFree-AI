// EduFree.AI - Circular Unique Logo Teacher Assistant Chatbot
// Direct real-time access to all students' data, assessments & Telugu FLN pedagogy.
// Powered by Google Gemini when online, and Gemma 4 AI when offline.

import { t, getLanguage } from '../data/i18n.js';
import { getAllFromStore, getSetting } from '../storage/db.js';
import { getAIStatus, subscribeNetworkStatus, gemma4TeacherChat } from '../services/gemma4Offline.js';
import {
  isGeminiActive,
  callGeminiTeacherChat,
  getGeminiApiKey,
  setGeminiApiKey,
  testGeminiApiKey,
  isSimulatedOffline,
  setSimulatedOffline
} from '../services/geminiService.js';
import { speakTeluguText, stopSpeech } from '../utils/speechAudio.js';

const CHAT_STORAGE_KEY = 'edufree_teacher_chat_history_v2';
const TEASER_SEEN_KEY = 'edufree_chat_teaser_seen';

let _isOpen = false;
let _isSettingsOpen = false;
let _isListening = false;
let _recognition = null;
let _chatContainer = null;
let _callbacks = {};

/**
 * Initialize and render the Floating Circular Chatbot
 * @param {HTMLElement} mountElement - Element to append chatbot to (e.g. document.body)
 * @param {object} callbacks - Navigation and interaction callbacks
 */
export function initTeacherChatbot(mountElement = document.body, callbacks = {}) {
  _callbacks = callbacks;

  // Remove existing instance if any
  const existing = document.getElementById('edufree-chatbot-wrapper');
  if (existing) existing.remove();

  _chatContainer = document.createElement('div');
  _chatContainer.id = 'edufree-chatbot-wrapper';
  _chatContainer.className = 'chatbot-wrapper';
  mountElement.appendChild(_chatContainer);

  _renderChatbotDOM();
  _setupSpeechRecognition();

  // Listen to network changes to update status badge in real-time
  subscribeNetworkStatus(() => {
    _updateStatusUI();
  });
}

/**
 * Render the Chatbot Floating Button, Teaser, and Modal Dialog
 */
function _renderChatbotDOM() {
  const lang = getLanguage();
  const isTe = lang === 'te';
  const teaserSeen = localStorage.getItem(TEASER_SEEN_KEY) === '1';
  const history = _loadHistory();

  _chatContainer.innerHTML = `
    <!-- Floating Greeting Teaser (Shows when not seen yet) -->
    <div id="chatbot-teaser" class="chatbot-teaser ${teaserSeen ? 'chatbot-teaser-hidden' : ''}">
      <span class="teaser-icon">✨</span>
      <div class="teaser-content">
        <strong class="teaser-title">${isTe ? 'బోధనా మిత్ర (Teacher AI)' : 'Teacher Mitra AI'}</strong>
        <span class="teaser-desc">${isTe ? 'విద్యార్థుల ప్రగతి & సహాయం కోసం ఇక్కడ నొక్కండి' : 'Tap to access student progress & app help'}</span>
      </div>
      <button id="chatbot-teaser-close" class="teaser-close-btn" aria-label="Close tooltip">✕</button>
    </div>

    <!-- Attractive Circular Unique Logo FAB Button -->
    <button id="chatbot-fab" class="chatbot-fab ${_isOpen ? 'fab-active' : ''}" aria-label="Open Teacher AI Assistant" title="${isTe ? 'EduFree AI బోధనా మిత్ర (Teacher Chatbot)' : 'EduFree AI Teacher Assistant'}">
      <div class="chatbot-fab-inner">
        <!-- Pulse Glow Rings -->
        <div class="chatbot-pulse-ring"></div>
        <div class="chatbot-pulse-ring-inner"></div>

        <!-- Custom Unique SVG Logo: Golden Telugu 'అ' with AI Neural Spark & Academic Cap -->
        <svg class="chatbot-logo-svg" viewBox="0 0 100 100" width="100%" height="100%">
          <defs>
            <linearGradient id="fab-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#04382c" />
              <stop offset="50%" stop-color="#064e3b" />
              <stop offset="100%" stop-color="#059669" />
            </linearGradient>
            <linearGradient id="fab-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fde68a" />
              <stop offset="40%" stop-color="#f59e0b" />
              <stop offset="100%" stop-color="#d97706" />
            </linearGradient>
            <linearGradient id="fab-teal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#a7f3d0" />
              <stop offset="100%" stop-color="#10b981" />
            </linearGradient>
            <filter id="fab-filter-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- Main circular base -->
          <circle cx="50" cy="50" r="47" fill="url(#fab-bg-grad)" stroke="url(#fab-gold-grad)" stroke-width="2.5" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(245, 158, 11, 0.4)" stroke-width="1.2" stroke-dasharray="3 3" class="fab-orbit-spin" />

          <!-- Logo Art Group -->
          <g class="fab-art-group">
            <!-- Academic Mortarboard Cap -->
            <polygon points="50,16 71,24 50,31 29,24" fill="url(#fab-gold-grad)" />
            <line x1="67" y1="25" x2="67" y2="34" stroke="#fbbf24" stroke-width="1.8" />
            <circle cx="67" cy="35" r="1.8" fill="#fbbf24" />

            <!-- Golden Telugu 'అ' glyph -->
            <text x="50" y="69" text-anchor="middle" font-family="'Noto Sans Telugu', 'Gautami', 'Vani', sans-serif" font-weight="900" font-size="39" fill="#ffffff" filter="url(#fab-filter-glow)">అ</text>

            <!-- AI Starburst Sparkle Right -->
            <path d="M75,39 Q75,44 80,44 Q75,44 75,49 Q75,44 70,44 Q75,44 75,39 Z" fill="url(#fab-gold-grad)" />
            <!-- AI Sparkle Left -->
            <path d="M25,51 Q25,54 28,54 Q25,54 25,57 Q25,54 22,54 Q25,54 25,51 Z" fill="url(#fab-teal-grad)" />
          </g>
        </svg>

        <!-- Live Status Dot Indicator (Gemini Online vs Gemma 4 Offline) -->
        <span id="chatbot-status-dot" class="chatbot-status-indicator" title="AI Status"></span>

        <!-- Rotating Close '✕' Icon (shown when open) -->
        <div class="chatbot-close-glyph" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </div>
      </div>
    </button>

    <!-- Chat Modal / Window Panel -->
    <div id="chatbot-panel" class="chatbot-panel ${_isOpen ? 'panel-open' : ''}" role="dialog" aria-label="EduFree AI Teacher Assistant Chat">
      <!-- Chat Header -->
      <div class="chatbot-header">
        <div class="header-brand-wrap">
          <div class="header-avatar-circle">
            <span class="avatar-letter">అ</span>
            <span class="avatar-badge-dot" id="header-avatar-dot"></span>
          </div>
          <div class="header-titles">
            <div class="header-main-title">
              <span>EduFree AI బోధనా మిత్ర</span>
            </div>
            <div class="header-model-badge" id="header-model-pill">
              <!-- Dynamically set: Gemini Flash or Gemma 4 Offline -->
            </div>
          </div>
        </div>

        <div class="header-controls">
          <button id="chatbot-settings-toggle-btn" class="header-ctrl-btn" title="${isTe ? 'AI ఇంజిన్ & API కీ సెట్టింగ్స్' : 'AI Engine & Gemini API Key Settings'}" aria-label="Settings">
            ⚙️
          </button>
          <button id="chatbot-clear-history-btn" class="header-ctrl-btn" title="${isTe ? 'సంభాషణను క్లియర్ చేయండి' : 'Clear Chat History'}" aria-label="Clear chat">
            🗑️
          </button>
          <button id="chatbot-close-panel-btn" class="header-ctrl-btn header-close-btn" title="${isTe ? 'మూసివేయి' : 'Close'}" aria-label="Close chat">
            ✕
          </button>
        </div>
      </div>

      <!-- Settings Sub-panel (Overlay) -->
      <div id="chatbot-settings-overlay" class="chatbot-settings-overlay ${_isSettingsOpen ? 'settings-open' : ''}">
        <div class="settings-modal-card">
          <div class="settings-modal-header">
            <h4>⚙️ AI ఇంజిన్ & మోడల్ కాన్ఫిగరేషన్</h4>
            <button id="chatbot-close-settings-btn" class="btn-icon-xs">✕</button>
          </div>
          <div class="settings-modal-body">
            <p class="settings-desc">
              ${isTe
      ? 'ఆన్‌లైన్‌లో ఉన్నప్పుడు Google Gemini తో వేగవంతమైన సమాధానాలు పొందండి. ఇంటర్నెట్ లేనప్పుడు లేదా ఆఫ్‌లైన్ లో Gemma 4 AI స్వయంచాలకంగా నడుస్తుంది.'
      : 'When online, Google Gemini powers advanced reasoning. When offline, Gemma 4 AI runs entirely on your device.'}
            </p>

            <div class="form-group-custom">
              <label for="gemini-key-input" class="form-label-custom">
                <span>🔑</span> Google Gemini API Key
              </label>
              <input
                type="password"
                id="gemini-key-input"
                class="form-input-custom"
                placeholder="AIzaSy..."
                value="${getGeminiApiKey()}"
                autocomplete="off"
              />
              <span class="form-hint-custom">
                ${isTe
      ? 'మీ వ్యక్తిగత ఉచిత కీని నమోదు చేయండి (Google AI Studio నుండి ఉచితంగా పొందవచ్చు).'
      : 'Enter your Gemini API key (Free tier supported via Google AI Studio).'}
              </span>
            </div>

            <div class="settings-toggle-row">
              <div>
                <strong>${isTe ? 'ఆఫ్‌లైన్ మోడ్ పరీక్ష (Simulate Offline)' : 'Simulate Offline Mode'}</strong>
                <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">
                  ${isTe ? 'వైఫై ఆన్‌లో ఉన్నా Gemma 4 AI ని పరీక్షించడానికి ఇది ఉపయోగపడుతుంది.' : 'Force Gemma 4 Offline AI even when connected to internet.'}
                </p>
              </div>
              <input type="checkbox" id="simulate-offline-checkbox" ${isSimulatedOffline() ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;" />
            </div>

            <div id="gemini-key-test-feedback" style="display: none; margin-top: 10px; font-size: 0.8rem; padding: 8px 12px; border-radius: 8px;"></div>

            <div style="margin-top: 14px; display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap;">
              <button id="test-gemini-key-btn" type="button" class="btn btn-outline btn-sm">
                ⚡ ${isTe ? 'కీ పరీక్షించండి' : 'Test Key'}
              </button>
              <button id="save-gemini-key-btn" type="button" class="btn btn-primary btn-sm">
                💾 ${isTe ? 'సెట్టింగ్స్ సేవ్ చేయండి' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Suggestion Chips Bar -->
      <div class="chatbot-chips-bar" id="chatbot-chips-bar">
        <button class="chat-chip" data-query="తరగతి సమగ్ర ప్రగతి నివేదిక ఇవ్వండి">
          📊 ${isTe ? 'తరగతి నివేదిక' : 'Class Report'}
        </button>
        <button class="chat-chip" data-query="ఎవరికి ప్రత్యేక సాధన మరియు సహాయం అవసరం?">
          ⚠️ ${isTe ? 'ఎవరికి సాధన అవసరం?' : 'Who Needs Help?'}
        </button>
        <button class="chat-chip" data-query="అనిత ప్రగతి వివరాలు ఏమిటి?">
          👧 ${isTe ? 'అనిత ప్రగతి' : 'Anitha Progress'}
        </button>
        <button class="chat-chip" data-query="స్వప్న పఠన వేగం మరియు స్కోర్ ఎంత?">
          🌟 ${isTe ? 'స్వప్న స్కోర్' : 'Swapna Score'}
        </button>
        <button class="chat-chip" data-query="1 నిమిషం పఠన మూల్యాంకనం ఎలా చేయాలి?">
          📖 ${isTe ? 'మూల్యాంకనం ఎలా చేయాలి?' : 'How to Assess?'}
        </button>
        <button class="chat-chip" data-query="WCPM అంటే ఏమిటి? ఎలా లెక్కిస్తారు?">
          ⏱️ ${isTe ? 'WCPM లెక్కింపు' : 'WCPM Formula'}
        </button>
        <button class="chat-chip" data-query="తెలంగాణ SCERT 5 పఠన స్థాయిలు ఏమిటి?">
          📚 ${isTe ? '5 స్థాయిల వివరాలు' : '5 FLN Levels'}
        </button>
      </div>

      <!-- Messages Stream -->
      <div class="chatbot-messages-container" id="chatbot-messages-container">
        <!-- Message bubbles dynamically populated -->
      </div>

      <!-- Typing indicator -->
      <div class="chatbot-typing-bar" id="chatbot-typing-bar" style="display: none;">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-label" id="typing-label">బోధనా మిత్ర ఆలోచిస్తోంది...</span>
      </div>

      <!-- Input Bar -->
      <form id="chatbot-input-form" class="chatbot-input-form">
        <div class="input-form-inner">
          <textarea
            id="chatbot-textarea"
            class="chatbot-textarea"
            placeholder="${isTe ? 'విద్యార్థుల ప్రగతి లేదా యాప్ గురించి అడగండి...' : 'Ask about student progress or app...'}"
            rows="1"
            aria-label="Ask chatbot"
          ></textarea>

          <!-- Voice Input Button (Mic) -->
          <button
            type="button"
            id="chatbot-mic-btn"
            class="chatbot-action-icon-btn ${_isListening ? 'mic-listening' : ''}"
            title="${isTe ? 'వాయిస్ ద్వారా మాట్లాడండి' : 'Speak with voice'}"
            aria-label="Voice input"
          >
            🎙️
          </button>

          <!-- Send Button -->
          <button
            type="submit"
            id="chatbot-send-btn"
            class="chatbot-send-btn"
            title="${isTe ? 'పంపండి' : 'Send'}"
            aria-label="Send message"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </form>
    </div>
  `;

  _attachEventListeners();
  _updateStatusUI();
  _renderMessages(history);
}

/**
 * Update Status UI across FAB, Header & Model Pills
 */
function _updateStatusUI() {
  const isSimOff = isSimulatedOffline();
  const isNetOff = !navigator.onLine;
  const isOffline = isNetOff || isSimOff;
  const hasGeminiKey = Boolean(getGeminiApiKey());
  const isGemini = !isOffline && hasGeminiKey;

  const fabDot = _chatContainer.querySelector('#chatbot-status-dot');
  const avatarDot = _chatContainer.querySelector('#header-avatar-dot');
  const modelPill = _chatContainer.querySelector('#header-model-pill');

  if (isGemini) {
    if (fabDot) {
      fabDot.className = 'chatbot-status-indicator status-online';
      fabDot.title = 'Online • Gemini AI Active';
    }
    if (avatarDot) avatarDot.className = 'avatar-badge-dot dot-online';
    if (modelPill) {
      modelPill.innerHTML = `
        <span class="model-pill-tag tag-gemini">✨ Gemini 3.8 Flash</span>
        <span class="model-pill-net">🌐 ఆన్‌లైన్</span>
      `;
    }
  } else {
    const reasonText = isSimOff ? 'సిమ్యులేటెడ్ ఆఫ్‌లైన్' : (isNetOff ? 'ఆఫ్‌లైన్' : 'కీ అవసరం');
    if (fabDot) {
      fabDot.className = 'chatbot-status-indicator status-offline';
      fabDot.title = `Gemma 4 Offline AI Active (${reasonText})`;
    }
    if (avatarDot) avatarDot.className = 'avatar-badge-dot dot-offline';
    if (modelPill) {
      modelPill.innerHTML = `
        <span class="model-pill-tag tag-gemma4">🤖 Gemma 4 AI</span>
        <span class="model-pill-net net-offline">${reasonText}</span>
      `;
    }
  }
}

/**
 * Attach UI Event Handlers
 */
function _attachEventListeners() {
  // Toggle FAB
  const fab = _chatContainer.querySelector('#chatbot-fab');
  const panel = _chatContainer.querySelector('#chatbot-panel');
  const teaser = _chatContainer.querySelector('#chatbot-teaser');
  const teaserClose = _chatContainer.querySelector('#chatbot-teaser-close');

  const toggleChat = () => {
    _isOpen = !_isOpen;
    if (_isOpen) {
      panel.classList.add('panel-open');
      fab.classList.add('fab-active');
      localStorage.setItem(TEASER_SEEN_KEY, '1');
      if (teaser) teaser.classList.add('chatbot-teaser-hidden');
      setTimeout(() => {
        const textarea = _chatContainer.querySelector('#chatbot-textarea');
        if (textarea) textarea.focus();
        _scrollToBottom();
      }, 150);
    } else {
      panel.classList.remove('panel-open');
      fab.classList.remove('fab-active');
      _isSettingsOpen = false;
      _chatContainer.querySelector('#chatbot-settings-overlay').classList.remove('settings-open');
      stopSpeech();
    }
  };

  fab.onclick = toggleChat;
  if (teaser) {
    teaser.onclick = (e) => {
      if (e.target !== teaserClose) {
        toggleChat();
      }
    };
  }
  if (teaserClose) {
    teaserClose.onclick = (e) => {
      e.stopPropagation();
      localStorage.setItem(TEASER_SEEN_KEY, '1');
      teaser.classList.add('chatbot-teaser-hidden');
    };
  }

  // Header Close
  _chatContainer.querySelector('#chatbot-close-panel-btn').onclick = toggleChat;

  // Settings Toggle
  const settingsOverlay = _chatContainer.querySelector('#chatbot-settings-overlay');
  _chatContainer.querySelector('#chatbot-settings-toggle-btn').onclick = () => {
    _isSettingsOpen = !_isSettingsOpen;
    settingsOverlay.classList.toggle('settings-open', _isSettingsOpen);
  };
  _chatContainer.querySelector('#chatbot-close-settings-btn').onclick = () => {
    _isSettingsOpen = false;
    settingsOverlay.classList.remove('settings-open');
  };

  // Test Gemini Key
  const testKeyBtn = _chatContainer.querySelector('#test-gemini-key-btn');
  const testFeedback = _chatContainer.querySelector('#gemini-key-test-feedback');
  if (testKeyBtn) {
    testKeyBtn.onclick = async () => {
      const keyVal = _chatContainer.querySelector('#gemini-key-input')?.value.trim();
      const isTe = getLanguage() === 'te';
      testKeyBtn.textContent = isTe ? 'తనిఖీ చేస్తోంది...' : 'Testing...';
      testKeyBtn.disabled = true;

      const res = await testGeminiApiKey(keyVal);
      testKeyBtn.textContent = isTe ? '⚡ కీ పరీక్షించండి' : '⚡ Test Key';
      testKeyBtn.disabled = false;

      if (testFeedback) {
        testFeedback.style.display = 'block';
        if (res.valid) {
          testFeedback.style.background = '#ecfdf5';
          testFeedback.style.color = '#065f46';
          testFeedback.style.border = '1px solid #10b981';
          testFeedback.textContent = isTe
            ? `✓ Gemini API విజయవంతంగా కనెక్ట్ అయింది! (${res.model})`
            : `✓ Connected to Gemini API successfully! (${res.model})`;
        } else {
          testFeedback.style.background = '#fef2f2';
          testFeedback.style.color = '#991b1b';
          testFeedback.style.border = '1px solid #ef4444';
          testFeedback.textContent = isTe
            ? `✗ కనెక్షన్ విఫలమైంది: ${res.error}`
            : `✗ Connection failed: ${res.error}`;
        }
      }
    };
  }

  // Save Settings
  _chatContainer.querySelector('#save-gemini-key-btn').onclick = () => {
    const keyVal = _chatContainer.querySelector('#gemini-key-input').value.trim();
    const simVal = _chatContainer.querySelector('#simulate-offline-checkbox').checked;

    setGeminiApiKey(keyVal);
    setSimulatedOffline(simVal);

    _isSettingsOpen = false;
    settingsOverlay.classList.remove('settings-open');
    _updateStatusUI();

    _appendMessage({
      role: 'assistant',
      text: getLanguage() === 'te'
        ? '✅ AI కాన్ఫిగరేషన్ విజయవంతంగా సేవ్ చేయబడింది. ప్రస్తుత మోడ్ అప్‌డేట్ అయింది.'
        : '✅ AI Configuration saved successfully.',
      model: isGeminiActive() ? 'Gemini Flash' : 'Gemma 4 Offline AI',
      timestamp: Date.now()
    });
  };

  // Clear History
  _chatContainer.querySelector('#chatbot-clear-history-btn').onclick = () => {
    const isTe = getLanguage() === 'te';
    if (confirm(isTe ? 'సంభాషణ చరిత్రను క్లియర్ చేయాలా?' : 'Clear all conversation history?')) {
      localStorage.removeItem(CHAT_STORAGE_KEY);
      _renderMessages([]);
    }
  };

  // Quick Chips
  const chipsBar = _chatContainer.querySelector('#chatbot-chips-bar');
  chipsBar.onclick = (e) => {
    const chip = e.target.closest('.chat-chip');
    if (chip && chip.dataset.query) {
      _handleUserQuery(chip.dataset.query);
    }
  };

  // Textarea auto-resize & enter to submit
  const textarea = _chatContainer.querySelector('#chatbot-textarea');
  textarea.oninput = () => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  textarea.onkeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      _submitForm();
    }
  };

  // Form submit
  _chatContainer.querySelector('#chatbot-input-form').onsubmit = (e) => {
    e.preventDefault();
    _submitForm();
  };

  // Voice Mic Button
  const micBtn = _chatContainer.querySelector('#chatbot-mic-btn');
  micBtn.onclick = () => _toggleSpeechRecognition();
}

/**
 * Handle form submission
 */
function _submitForm() {
  const textarea = _chatContainer.querySelector('#chatbot-textarea');
  const val = textarea.value.trim();
  if (!val) return;
  textarea.value = '';
  textarea.style.height = 'auto';
  _handleUserQuery(val);
}

/**
 * Core query processing pipeline
 */
async function _handleUserQuery(userText) {
  const lang = getLanguage();

  // 1. Append user message to UI & history
  _appendMessage({
    role: 'user',
    text: userText,
    timestamp: Date.now()
  });

  _setTyping(true, lang === 'te' ? 'సమాధానం విశ్లేషిస్తోంది...' : 'Analyzing response...');

  try {
    // 2. Fetch live freshest data directly from IndexedDB
    const contextData = await _gatherLiveContext(lang);

    let result = null;
    const history = _loadHistory();

    // 3. Check if Gemini Online should be invoked
    if (isGeminiActive()) {
      _setTyping(true, '✨ Gemini AI తో ప్రాసెస్ చేస్తోంది...');
      result = await callGeminiTeacherChat({
        query: userText,
        conversationHistory: history,
        contextData,
        lang
      });
    }

    // 4. If offline, or no Gemini key, or Gemini failed -> Fallback to Gemma 4 Offline Engine
    if (!result || !result.success) {
      const fallbackReason = result?.reason || '';
      _setTyping(true, '🤖 Gemma 4 Offline AI ఇంజిన్ లెక్కిస్తోంది...');
      const offlineRes = await gemma4TeacherChat(userText, contextData);

      let replyText = offlineRes.text;
      if (fallbackReason && isGeminiActive()) {
        const isTe = lang === 'te';
        const notice = isTe
          ? `> ⚠️ **Gemini ఆన్‌లైన్ గమనిక:** ${fallbackReason} — పరికరంలో ఉన్న Gemma 4 Offline AI ద్వారా సమాధానం రూపొందించబడింది.\n\n`
          : `> ⚠️ **Gemini Online Notice:** ${fallbackReason} — Answered using local Gemma 4 Offline AI.\n\n`;
        replyText = notice + replyText;
      }

      result = {
        success: true,
        text: replyText,
        modelName: offlineRes.modelName,
        source: offlineRes.source
      };
    }

    // 5. Append assistant reply to UI & history
    _appendMessage({
      role: 'assistant',
      text: result.text,
      model: result.modelName || 'Gemma 4 Offline AI',
      timestamp: Date.now()
    });
  } catch (err) {
    console.error('Chatbot execution error:', err);
    _appendMessage({
      role: 'assistant',
      text: lang === 'te'
        ? 'క్షమించండి, సమాధానం రూపొందించడంలో తాత్కాలిక సమస్య ఏర్పడింది. దయచేసి మళ్ళీ ప్రయత్నించండి.'
        : 'Sorry, an error occurred while processing your query. Please try again.',
      model: 'Gemma 4 Offline AI',
      timestamp: Date.now()
    });
  } finally {
    _setTyping(false);
  }
}

/**
 * Gather live data snapshot from IndexedDB
 */
async function _gatherLiveContext(lang) {
  const classes = await getAllFromStore('classes');
  const currentClassId = await getSetting('current_class_id', classes[0]?.id || null);
  const currentClass = classes.find((c) => c.id === currentClassId) || classes[0] || {};
  const allStudents = await getAllFromStore('students');
  const classStudents = allStudents.filter((s) => !currentClassId || s.classId === currentClassId);
  const assessments = await getAllFromStore('assessments');

  // Compute live statistics
  let totalWcpm = 0;
  let totalAcc = 0;
  let assessedCount = 0;
  const levelCounts = {
    level_1_letters: 0,
    level_2_guninthalu: 0,
    level_3_simple_words: 0,
    level_4_ottulu: 0,
    level_5_passages: 0
  };

  classStudents.forEach((std) => {
    if (levelCounts[std.currentLevelId] !== undefined) {
      levelCounts[std.currentLevelId]++;
    } else {
      levelCounts.level_1_letters++;
    }

    const stdAssess = assessments.filter((a) => a.studentId === std.id);
    if (stdAssess.length > 0) {
      const last = stdAssess[stdAssess.length - 1];
      if (last.metrics?.wcpm !== undefined) {
        totalWcpm += Number(last.metrics.wcpm);
        totalAcc += Number(last.metrics.accuracyPercentage || 0);
        assessedCount++;
      }
    }
  });

  return {
    lang,
    currentClass,
    classes,
    students: classStudents,
    assessments,
    stats: {
      totalStudents: classStudents.length,
      assessedCount,
      level1Count: levelCounts.level_1_letters,
      level2Count: levelCounts.level_2_guninthalu,
      level3Count: levelCounts.level_3_simple_words,
      level4Count: levelCounts.level_4_ottulu,
      level5Count: levelCounts.level_5_passages,
      avgWCPM: assessedCount > 0 ? Math.round(totalWcpm / assessedCount) : 0,
      avgAccuracy: assessedCount > 0 ? Math.round(totalAcc / assessedCount) : 0
    }
  };
}

/**
 * Message history storage
 */
function _loadHistory() {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }

  // Initial Welcome Message
  const lang = getLanguage();
  const isTe = lang === 'te';

  return [
    {
      role: 'assistant',
      text: isTe
        ? `నమస్కారం ఉపాధ్యాయులారా! 🙏 నేను **EduFree AI బోధనా మిత్ర**.\nమీ విద్యార్థుల పఠన ప్రగతి, WCPM స్కోర్లు, మరియు యాప్ వివరాలపై మీకు పూర్తి సమాచారం అందించడానికి సిద్ధంగా ఉన్నాను.\n\nపైనున్న సూచనలపై నొక్కండి లేదా మీ ప్రశ్నను టైప్ చేయండి!`
        : `Hello Teacher! 🙏 I am **EduFree AI Teacher Mitra**.\nI am here to give you instant, reliable access to all student reading progress, WCPM scores, and app guidance. Tap a prompt above or ask anything!`,
      model: isGeminiActive() ? 'Gemini 3.8 Flash' : 'Gemma 4 Offline AI',
      timestamp: Date.now()
    }
  ];
}

function _saveHistory(history) {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(history.slice(-30)));
  } catch (e) { /* ignore */ }
}

function _appendMessage(msg) {
  const history = _loadHistory();
  history.push(msg);
  _saveHistory(history);
  _renderSingleMessage(msg);
  _scrollToBottom();
}

/**
 * Render complete message list
 */
function _renderMessages(history) {
  const container = _chatContainer.querySelector('#chatbot-messages-container');
  if (!container) return;
  container.innerHTML = '';
  history.forEach((msg) => _renderSingleMessage(msg, false));
  _scrollToBottom();
}

/**
 * Render single message bubble with interactive action pills
 */
function _renderSingleMessage(msg, scroll = true) {
  const container = _chatContainer.querySelector('#chatbot-messages-container');
  if (!container) return;

  const isUser = msg.role === 'user';
  const bubble = document.createElement('div');
  bubble.className = `chatbot-message-row ${isUser ? 'row-user' : 'row-assistant'}`;

  const formattedContent = _formatMessageText(msg.text);

  bubble.innerHTML = `
    <div class="message-bubble ${isUser ? 'bubble-user' : 'bubble-assistant'}">
      ${!isUser ? `
        <div class="message-meta-header">
          <span class="meta-model-tag ${msg.model?.includes('Gemini') ? 'tag-meta-gemini' : 'tag-meta-gemma'}">
            ${msg.model?.includes('Gemini') ? '✨ ' + msg.model : '🤖 ' + (msg.model || 'Gemma 4 Offline AI')}
          </span>
          <div class="meta-actions">
            <button class="msg-ctrl-btn btn-tts" title="వాయిస్ చదవండి (Read aloud)" aria-label="Read aloud">🔊</button>
            <button class="msg-ctrl-btn btn-copy" title="కాపీ చేయండి (Copy)" aria-label="Copy message">📋</button>
          </div>
        </div>
      ` : ''}
      <div class="message-text-content">
        ${formattedContent}
      </div>
      <div class="message-time">
        ${new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  `;

  // Attach interactive Action Button Handlers (Profile, Assess, Practice, Nav)
  bubble.querySelectorAll('.chat-action-btn').forEach((btn) => {
    btn.onclick = () => {
      const type = btn.dataset.actionType;
      const target = btn.dataset.actionTarget;
      _handleActionClick(type, target);
    };
  });

  // TTS read aloud
  const ttsBtn = bubble.querySelector('.btn-tts');
  if (ttsBtn) {
    ttsBtn.onclick = () => {
      const cleanText = msg.text.replace(/\[\[ACTION:[^\]]+\]\]/g, '').replace(/[#*`_]/g, '');
      speakTeluguText(cleanText);
    };
  }

  // Copy text
  const copyBtn = bubble.querySelector('.btn-copy');
  if (copyBtn) {
    copyBtn.onclick = async () => {
      const cleanText = msg.text.replace(/\[\[ACTION:[^\]]+\]\]/g, '');
      try {
        await navigator.clipboard.writeText(cleanText);
        copyBtn.textContent = '✓';
        setTimeout(() => (copyBtn.textContent = '📋'), 1500);
      } catch (e) { /* ignore */ }
    };
  }

  container.appendChild(bubble);
  if (scroll) _scrollToBottom();
}

/**
 * Handle in-chat clickable action buttons
 */
function _handleActionClick(type, target) {
  if (type === 'PROFILE' && _callbacks.onViewStudentProfile) {
    _callbacks.onViewStudentProfile(target);
    _closeChatTemporary();
  } else if (type === 'ASSESS' && _callbacks.onStartAssessment) {
    _callbacks.onStartAssessment(target);
    _closeChatTemporary();
  } else if (type === 'PRACTICE' && _callbacks.onStartPractice) {
    _callbacks.onStartPractice(null, target);
    _closeChatTemporary();
  } else if (type === 'NAV' && _callbacks.onNavigateTab) {
    _callbacks.onNavigateTab(target);
    _closeChatTemporary();
  }
}

function _closeChatTemporary() {
  _isOpen = false;
  const panel = _chatContainer.querySelector('#chatbot-panel');
  const fab = _chatContainer.querySelector('#chatbot-fab');
  if (panel) panel.classList.remove('panel-open');
  if (fab) fab.classList.remove('fab-active');
  stopSpeech();
}

/**
 * Format markdown and interactive action tags
 */
function _formatMessageText(text = '') {
  let res = text;

  // Replace Action Tags: [[ACTION:TYPE:TARGET:LABEL]]
  res = res.replace(/\[\[ACTION:([A-Z_]+):([^:]+):([^\]]+)\]\]/g, (match, type, target, label) => {
    return `<button type="button" class="chat-action-btn" data-action-type="${type}" data-action-target="${target}"><span>${label}</span> →</button>`;
  });

  // Markdown Bold: **text**
  res = res.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Markdown Italic: _text_
  res = res.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Markdown Code: `text`
  res = res.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Markdown Headers: ### Header
  res = res.replace(/^### (.*$)/gim, '<h4 class="chat-md-h4">$1</h4>');
  res = res.replace(/^#### (.*$)/gim, '<h5 class="chat-md-h5">$1</h5>');

  // Bullet points
  res = res.replace(/^\* (.*$)/gim, '<div class="chat-bullet-row"><span class="chat-bullet-dot">•</span><span>$1</span></div>');

  // Line breaks
  res = res.replace(/\n\n/g, '<div class="chat-p-gap"></div>');
  res = res.replace(/\n/g, '<br/>');

  return res;
}

function _setTyping(isTyping, labelText = '') {
  const typingBar = _chatContainer.querySelector('#chatbot-typing-bar');
  const label = _chatContainer.querySelector('#typing-label');
  if (typingBar) {
    typingBar.style.display = isTyping ? 'flex' : 'none';
    if (label && labelText) label.textContent = labelText;
    if (isTyping) _scrollToBottom();
  }
}

function _scrollToBottom() {
  const container = _chatContainer.querySelector('#chatbot-messages-container');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

/**
 * Setup Web Speech API for Voice input
 */
function _setupSpeechRecognition() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    const micBtn = _chatContainer.querySelector('#chatbot-mic-btn');
    if (micBtn) micBtn.style.opacity = '0.4';
    return;
  }

  try {
    _recognition = new SpeechRec();
    _recognition.continuous = false;
    _recognition.interimResults = false;

    _recognition.onstart = () => {
      _isListening = true;
      const micBtn = _chatContainer.querySelector('#chatbot-mic-btn');
      if (micBtn) micBtn.classList.add('mic-listening');
    };

    _recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) {
        const textarea = _chatContainer.querySelector('#chatbot-textarea');
        if (textarea) {
          textarea.value = transcript;
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + 'px';
        }
      }
    };

    _recognition.onerror = () => {
      _isListening = false;
      const micBtn = _chatContainer.querySelector('#chatbot-mic-btn');
      if (micBtn) micBtn.classList.remove('mic-listening');
    };

    _recognition.onend = () => {
      _isListening = false;
      const micBtn = _chatContainer.querySelector('#chatbot-mic-btn');
      if (micBtn) micBtn.classList.remove('mic-listening');
    };
  } catch (err) {
    console.warn('Speech recognition not supported or denied:', err);
  }
}

function _toggleSpeechRecognition() {
  if (!_recognition) {
    alert(getLanguage() === 'te'
      ? 'ఈ బ్రౌజర్‌లో వాయిస్ గుర్తింపు సదుపాయం అందుబాటులో లేదు. దయచేసి టైప్ చేయండి.'
      : 'Speech recognition is not supported in this browser. Please type your query.');
    return;
  }

  if (_isListening) {
    _recognition.stop();
  } else {
    _recognition.lang = getLanguage() === 'te' ? 'te-IN' : 'en-IN';
    try {
      _recognition.start();
    } catch (e) {
      console.warn('Recognition start note:', e);
    }
  }
}
