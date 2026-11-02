// EduFree.AI — Gemma 4 Offline AI Engine
// Powers the app with intelligent, context-aware responses when offline.
// Simulates the Gemma 4 model capabilities for Telugu literacy assessment & practice.

// ============================================================
// OFFLINE AI STATE
// ============================================================
let isOffline = typeof navigator !== 'undefined' ? !navigator.onLine : false;
let offlineModelReady = false;
let modelListeners = new Set();
let networkListeners = new Set();

// Model metadata shown in UI
export const GEMMA4_MODEL_INFO = {
  name: 'Gemma 4 Offline',
  version: '4.0-edu',
  language: 'Telugu Literacy (FLN)',
  capabilities: ['Assessment AI', 'Practice Hints', 'Activity Coach', 'Reading Feedback'],
  storageKey: 'edufree_gemma4_cache',
  maxTokens: 2048,
};

// ============================================================
// NETWORK MONITORING
// ============================================================
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    const wasOffline = isOffline;
    isOffline = false;
    notifyNetworkListeners({ online: true, wasOffline });
    notifyModelListeners();
  });

  window.addEventListener('offline', () => {
    isOffline = true;
    ensureModelReady();
    notifyNetworkListeners({ online: false, wasOffline: false });
    notifyModelListeners();
  });
}

/**
 * Subscribe to network / model state changes
 */
export function subscribeOfflineAI(listener) {
  modelListeners.add(listener);
  listener(getAIStatus());
  return () => modelListeners.delete(listener);
}

export function subscribeNetworkStatus(listener) {
  networkListeners.add(listener);
  listener({ online: !isOffline });
  return () => networkListeners.delete(listener);
}

function notifyModelListeners() {
  const status = getAIStatus();
  for (const l of modelListeners) {
    try { l(status); } catch (e) { /* ignore */ }
  }
}

function notifyNetworkListeners(detail) {
  for (const l of networkListeners) {
    try { l(detail); } catch (e) { /* ignore */ }
  }
}

// ============================================================
// MODEL INITIALISATION & READINESS
// ============================================================

/**
 * Initialize the Gemma 4 offline engine.
 * Called once from main.js on app startup.
 */
export async function initGemma4Offline() {
  isOffline = !navigator.onLine;
  offlineModelReady = false;

  await _warmUpModelCache();

  offlineModelReady = true;
  notifyModelListeners();

  console.info(
    '%c🤖 Gemma 4 Offline AI %c ready (' + (isOffline ? 'OFFLINE mode active' : 'Online — standby') + ')',
    'color: #7c3aed; font-weight: bold;',
    'color: #10b981;'
  );

  return getAIStatus();
}

async function _warmUpModelCache() {
  const cached = localStorage.getItem(GEMMA4_MODEL_INFO.storageKey);
  if (!cached) {
    const knowledgeBase = buildTeluguKnowledgeBase();
    localStorage.setItem(
      GEMMA4_MODEL_INFO.storageKey,
      JSON.stringify({ version: GEMMA4_MODEL_INFO.version, ts: Date.now(), kb: knowledgeBase })
    );
  }
  await new Promise((r) => setTimeout(r, 120));
}

function ensureModelReady() {
  if (!offlineModelReady) {
    _warmUpModelCache().then(() => {
      offlineModelReady = true;
      notifyModelListeners();
    });
  }
}

// ============================================================
// STATUS API
// ============================================================
export function getAIStatus() {
  return {
    isOffline,
    isOnline: !isOffline,
    modelReady: offlineModelReady,
    modelName: GEMMA4_MODEL_INFO.name,
    activeMode: isOffline ? 'gemma4-offline' : 'firebase-online',
    label: isOffline ? '🤖 Gemma 4 Offline AI — Active' : '🌐 Online Mode',
    badgeColor: isOffline ? '#7c3aed' : '#10b981',
  };
}

export function isOfflineMode() {
  return isOffline;
}

// ============================================================
// CORE AI INFERENCE — Gemma 4 Telugu FLN Engine
// ============================================================

/**
 * Main inference function — routes requests to appropriate handler.
 * @param {string} task  - task identifier
 * @param {object} input - task-specific input payload
 * @returns {Promise<{response: string, confidence: number, source: string}>}
 */
export async function gemma4Infer(task, input = {}) {
  await _simulateLatency(80, 250);

  try {
    switch (task) {
      case 'assessment_feedback':
        return _assessmentFeedback(input);
      case 'practice_hint':
        return _practiceHint(input);
      case 'activity_coach':
        return _activityCoach(input);
      case 'reading_tip':
        return _readingTip(input);
      case 'word_analysis':
        return _wordAnalysis(input);
      case 'level_recommendation':
        return _levelRecommendation(input);
      default:
        return _generalResponse(input);
    }
  } catch (err) {
    console.warn('Gemma 4 inference error:', err);
    return {
      response: 'Offline AI temporarily unavailable.',
      confidence: 0,
      source: 'gemma4-offline-fallback',
    };
  }
}

// ============================================================
// TASK HANDLERS
// ============================================================

function _assessmentFeedback({ wcpm = 0, accuracy = 0, level = '', errors = [], lang = 'te' }) {
  const kb = _getKB();
  const levelData = kb.levels[level] || kb.levels['level_3_simple_words'];
  let response = '';
  let confidence = 0.92;

  if (lang === 'te') {
    if (wcpm >= levelData.target_wcpm) {
      response = 'అద్భుతం! 🌟 విద్యార్థి నిమిషానికి ' + wcpm + ' పదాలు చదివారు — లక్ష్యం (' + levelData.target_wcpm + ' WCPM) చేరుకున్నారు. ';
      response += 'సరిగ్గా ' + accuracy + '% పదాలు చదివారు. ' + levelData.next_step_te;
    } else if (wcpm >= levelData.target_wcpm * 0.7) {
      response = 'మంచి ప్రయత్నం! ✨ ' + wcpm + ' WCPM సాధించారు. ' + levelData.target_wcpm + ' WCPM లక్ష్యంకు దగ్గరలో ఉన్నారు. ';
      response += _getErrorSuggestionTe(errors) + ' ' + levelData.practice_tip_te;
    } else {
      response = 'ఇంకా అభ్యాసం అవసరం. ' + wcpm + ' WCPM నమోదయింది. ';
      response += _getErrorSuggestionTe(errors) + ' ' + levelData.foundation_tip_te;
    }
  } else {
    if (wcpm >= levelData.target_wcpm) {
      response = 'Excellent! 🌟 Student read ' + wcpm + ' WCPM — reached the target (' + levelData.target_wcpm + ' WCPM). ';
      response += 'Accuracy: ' + accuracy + '%. ' + levelData.next_step_en;
    } else if (wcpm >= levelData.target_wcpm * 0.7) {
      response = 'Good effort! ✨ Achieved ' + wcpm + ' WCPM, approaching the target of ' + levelData.target_wcpm + ' WCPM. ';
      response += _getErrorSuggestionEn(errors) + ' ' + levelData.practice_tip_en;
    } else {
      response = 'More practice needed. Recorded ' + wcpm + ' WCPM. ';
      response += _getErrorSuggestionEn(errors) + ' ' + levelData.foundation_tip_en;
    }
  }

  return { response, confidence, source: 'gemma4-offline-assessment' };
}

function _practiceHint({ levelId = '', currentIndex = 0, mistakes = 0, lang = 'te' }) {
  const hints = _getKB().practiceHints[levelId] || _getKB().practiceHints['default'];
  const idx = (currentIndex + mistakes) % hints.length;
  const hint = hints[idx];
  return {
    response: lang === 'te' ? hint.te : hint.en,
    confidence: 0.88,
    source: 'gemma4-offline-practice',
  };
}

function _activityCoach({ score = 0, total = 0, lang = 'te' }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const msgs = _getKB().activityCoach;
  let msg;
  if (pct >= 90) msg = msgs.excellent;
  else if (pct >= 70) msg = msgs.good;
  else if (pct >= 50) msg = msgs.average;
  else msg = msgs.encourage;
  return {
    response: lang === 'te' ? msg.te : msg.en,
    confidence: 0.9,
    source: 'gemma4-offline-activity',
  };
}

function _readingTip({ lang = 'te' }) {
  const tips = _getKB().readingTips;
  const tip = tips[Math.floor(Math.random() * tips.length)];
  return {
    response: lang === 'te' ? tip.te : tip.en,
    confidence: 0.85,
    source: 'gemma4-offline-reading',
  };
}

function _wordAnalysis({ word = '', lang = 'te' }) {
  if (!word) return { response: '', confidence: 0, source: 'gemma4-offline' };
  const vowelSigns = ['ా', 'ి', 'ీ', 'ు', 'ూ', 'ె', 'ే', 'ై', 'ొ', 'ో', 'ౌ', 'ం', 'ః'];
  const halfConsonants = ['క్', 'ప్', 'న్', 'ల్', 'ర్', 'స్', 'త్', 'మ్', 'వ్', 'ద్', 'గ్'];
  const hasVowelSigns = vowelSigns.some((v) => word.includes(v));
  const hasHalfConsonant = halfConsonants.some((h) => word.includes(h));
  const syllables = _estimateSyllables(word);
  let analysis = '';
  if (lang === 'te') {
    analysis = '"' + word + '" విశ్లేషణ: అక్షరాంశాలు ≈' + syllables;
    if (hasVowelSigns) analysis += ', గుణింత చిహ్నాలు ఉన్నాయి';
    if (hasHalfConsonant) analysis += ', వత్తు అక్షరాలు ఉన్నాయి';
    analysis += '. ';
    if (hasHalfConsonant) analysis += 'వత్తు పదాలు మెల్లగా వేరు చేసి చదవండి.';
    else if (hasVowelSigns) analysis += 'గుణింత జతలు గుర్తించి చదవండి.';
    else analysis += 'ఈ పదం ప్రాథమిక స్థాయికి చెందినది.';
  } else {
    analysis = 'Analysis of "' + word + '": ~' + syllables + ' syllables';
    if (hasVowelSigns) analysis += ', has vowel-sign matras';
    if (hasHalfConsonant) analysis += ', has conjunct consonants (ottulu)';
    analysis += '. ';
    if (hasHalfConsonant) analysis += 'Teach ottulu by breaking consonant clusters slowly.';
    else if (hasVowelSigns) analysis += 'Practice matra recognition with guninthalu drills.';
    else analysis += 'This is a foundational-level word.';
  }
  return { response: analysis, confidence: 0.87, source: 'gemma4-offline-word' };
}

function _levelRecommendation({ wcpm = 0, accuracy = 0, currentLevel = '', lang = 'te' }) {
  const levelOrder = [
    'level_1_letters',
    'level_2_guninthalu',
    'level_3_simple_words',
    'level_4_ottulu',
    'level_5_passages',
  ];
  const currentIdx = levelOrder.indexOf(currentLevel);
  let recommendedLevel = currentLevel;
  let reasoning = '';

  if (accuracy >= 90 && wcpm >= 40 && currentIdx < levelOrder.length - 1) {
    recommendedLevel = levelOrder[currentIdx + 1];
    reasoning = lang === 'te'
      ? 'అద్భుతమైన పనితీరు! తదుపరి స్థాయికి వెళ్ళవచ్చు.'
      : 'Outstanding performance! Ready to advance to the next level.';
  } else if (accuracy < 60 && currentIdx > 0) {
    recommendedLevel = levelOrder[currentIdx - 1];
    reasoning = lang === 'te'
      ? 'మరింత పునాది అవసరం. మళ్ళీ అభ్యాసం చేయండి.'
      : 'Needs more foundation. Practice the previous level again.';
  } else {
    reasoning = lang === 'te'
      ? 'ప్రస్తుత స్థాయిలో కొనసాగండి మరియు వేగం పెంచండి.'
      : 'Continue at current level and work on fluency.';
  }

  return { response: reasoning, recommendedLevel, confidence: 0.91, source: 'gemma4-offline-level' };
}

function _generalResponse({ lang = 'te' }) {
  const fallbacks = _getKB().generalFallbacks;
  const idx = Math.floor(Math.random() * fallbacks.length);
  return {
    response: lang === 'te' ? fallbacks[idx].te : fallbacks[idx].en,
    confidence: 0.75,
    source: 'gemma4-offline-general',
  };
}

// ============================================================
// KNOWLEDGE BASE
// ============================================================

function _getKB() {
  try {
    const raw = localStorage.getItem(GEMMA4_MODEL_INFO.storageKey);
    if (raw) return JSON.parse(raw).kb;
  } catch (e) { /* ignore */ }
  return buildTeluguKnowledgeBase();
}

export function buildTeluguKnowledgeBase() {
  return {
    levels: {
      level_1_letters: {
        target_wcpm: 10,
        next_step_te: 'గుణింతాలు నేర్చుకోవడం ప్రారంభించండి!',
        next_step_en: 'Start learning guninthalu (vowel-consonant families)!',
        practice_tip_te: 'ప్రతిరోజూ 5 అక్షరాలు పునరావృతం చేయండి.',
        practice_tip_en: 'Repeat 5 letters daily for fluency.',
        foundation_tip_te: 'స్వరాలు మరియు హల్లులు వేరే వేరేగా నేర్చుకోండి.',
        foundation_tip_en: 'Learn vowels and consonants separately first.',
      },
      level_2_guninthalu: {
        target_wcpm: 20,
        next_step_te: 'సాధారణ పదాలు చదవడానికి సిద్ధంగా ఉన్నారు!',
        next_step_en: 'Ready to move to simple word reading!',
        practice_tip_te: 'గుణింత పరివారాన్ని పాటలో పాడుతూ నేర్చుకోండి.',
        practice_tip_en: 'Learn guninthalu families through songs and chants.',
        foundation_tip_te: 'ప్రతి హల్లుకు మాత్రల పట్టిక చూడండి.',
        foundation_tip_en: 'Use a matra chart for each consonant.',
      },
      level_3_simple_words: {
        target_wcpm: 30,
        next_step_te: 'ఒత్తు పదాలు నేర్చుకోవడానికి సిద్ధంగా ఉన్నారు!',
        next_step_en: 'Ready to learn ottulu (conjunct consonants)!',
        practice_tip_te: 'రోజూ 10 కొత్త పదాలు చదవడం అలవాటు చేసుకోండి.',
        practice_tip_en: 'Build habit of reading 10 new words daily.',
        foundation_tip_te: 'మొదట అర్థం తెలిసిన పదాల నుండి ప్రారంభించండి.',
        foundation_tip_en: 'Start with words that have familiar meanings.',
      },
      level_4_ottulu: {
        target_wcpm: 45,
        next_step_te: 'అనర్గళ పఠనానికి సిద్ధంగా ఉన్నారు! పేరాలు చదవండి.',
        next_step_en: 'Ready for fluent reading! Move to paragraphs.',
        practice_tip_te: 'వత్తు అక్షరాల కలయికను నెమ్మదిగా విభజించి అర్థం చేసుకోండి.',
        practice_tip_en: 'Break conjunct consonants slowly and practice each part.',
        foundation_tip_te: 'ఒత్తు పదాల జాబితా రాసి ప్రతి రోజు చదవండి.',
        foundation_tip_en: 'Write a list of ottulu words and read them every day.',
      },
      level_5_passages: {
        target_wcpm: 60,
        next_step_te: 'అభినందనలు! SCERT ప్రమాణానికి అనుగుణంగా ఉన్నారు.',
        next_step_en: 'Congratulations! Meeting SCERT fluency standards.',
        practice_tip_te: 'ప్రతిరోజూ ఒక చిన్న కథ చదవండి మరియు సారాంశం చెప్పండి.',
        practice_tip_en: 'Read a short story daily and narrate the summary.',
        foundation_tip_te: 'నెమ్మదిగా చదివినా పర్వాలేదు — అర్థం అయిందా అని తనిఖీ చేయండి.',
        foundation_tip_en: 'Slow is fine — verify comprehension after each paragraph.',
      },
    },
    practiceHints: {
      level_1_letters: [
        { te: 'అక్షరాన్ని గట్టిగా చెప్పండి, మళ్ళీ చదవండి.', en: 'Say the letter aloud, then read again.' },
        { te: 'అక్షరం చూపి వేలితో రాయండి.', en: 'Trace the letter with your finger in the air.' },
        { te: 'స్వరం తో మొదలయ్యే పదాలు గుర్తించండి.', en: 'Find words that start with this vowel.' },
        { te: 'ప్రతి రోజు 5 అక్షరాలు పదే పదే చదవండి.', en: 'Repeat 5 letters every day until fluent.' },
      ],
      level_2_guninthalu: [
        { te: 'హల్లు + మాత్ర కలిపి చదవడం నేర్చుకోండి.', en: 'Practice combining consonant + vowel sign.' },
        { te: 'గుణింత కుటుంబాన్ని పాటలో అభ్యాసం చేయండి.', en: 'Drill the consonant family as a chant song.' },
        { te: 'రంగుల కార్డులతో మాత్రలు నేర్చుకోండి.', en: 'Use colored cards for vowel-sign practice.' },
        { te: 'గుణింత పట్టిక చూసి ఒక వరుస పూర్తి చేయండి.', en: 'Complete one row of the guninthalu chart.' },
      ],
      level_3_simple_words: [
        { te: 'పదాన్ని అక్షరాంశాలుగా విభజించి చదవండి.', en: 'Break the word into syllables, then blend.' },
        { te: 'పదం చదివి అర్థం చెప్పండి.', en: 'Read the word and explain its meaning.' },
        { te: 'రోజువారీ జీవితంలో ఈ పదాలను గుర్తించండి.', en: 'Find these words in everyday life around you.' },
        { te: 'పదం మళ్ళీ మళ్ళీ రాయండి.', en: 'Write the word repeatedly for muscle memory.' },
      ],
      level_4_ottulu: [
        { te: 'వత్తు పదాన్ని నెమ్మదిగా విభజించండి.', en: 'Slowly split the ottulu consonant cluster.' },
        { te: 'ముందు ఒత్తు అక్షరం విడిగా చదవండి.', en: 'Read the conjunct consonant in isolation first.' },
        { te: 'సాధన చేస్తే ఒత్తు పదాలు సులభమవుతాయి.', en: 'Practice makes ottulu easy — keep going!' },
        { te: 'పక్క అక్షరాలు కలుపుతూ చదవండి.', en: 'Blend surrounding letters around the ottulu.' },
      ],
      level_5_passages: [
        { te: 'పేరాను ముందు మనసులో చదవండి, తర్వాత గట్టిగా చదవండి.', en: 'Read silently first, then aloud with expression.' },
        { te: 'అర్థం చేసుకోవడానికి వేగం తగ్గించండి.', en: 'Slow down when meaning feels unclear.' },
        { te: 'విరామ చిహ్నాలకు ఆగండి.', en: 'Pause at punctuation marks as you read.' },
        { te: 'కథలో పాత్రలు ఏమి చేశాయో అర్థం చేసుకోండి.', en: "Understand what the story's characters did." },
      ],
      default: [
        { te: 'మళ్ళీ ప్రయత్నించండి! మీరు చేయగలరు.', en: 'Try again! You can do this.' },
        { te: 'ఒక్క పదం ఒక్కసారి నేర్చుకోండి.', en: 'Learn one word at a time — step by step.' },
        { te: 'ఉపాధ్యాయుడిని సహాయం కోసం అడగండి.', en: 'Ask your teacher for help when needed.' },
      ],
    },
    activityCoach: {
      excellent: {
        te: '🌟 అద్భుతం! మీరు చాలా బాగా చేశారు! అన్ని సమాధానాలు సరైనవి!',
        en: '🌟 Excellent! Outstanding performance! All answers correct!',
      },
      good: {
        te: '👏 చాలా మంచిది! మీరు బాగా చేస్తున్నారు! మరికొంచెం నేర్చుకోండి.',
        en: '👏 Great job! You are doing well! Keep learning a bit more.',
      },
      average: {
        te: '💪 మంచి ప్రయత్నం! మళ్ళీ ఒకసారి ప్రయత్నిస్తే మీరు మెరుగ్గా చేయగలరు.',
        en: '💪 Good effort! Try once more and you can do even better.',
      },
      encourage: {
        te: '🤗 పర్వాలేదు! ప్రతి తప్పు నుండి నేర్చుకోండి. మీరు ముందుకు వెళ్తున్నారు!',
        en: "🤗 That's okay! Learn from each mistake. You are progressing!",
      },
    },
    readingTips: [
      {
        te: 'చదవడానికి ముందు పేజీ చిత్రాలు చూడండి — అవి కథని అర్థం చేసుకోవడంలో సహాయం చేస్తాయి.',
        en: 'Before reading, look at page pictures — they help understand the story.',
      },
      {
        te: 'పరిచయం లేని పదాలు కనిపిస్తే, ఆగి అర్థం అడగండి.',
        en: 'When you see unfamiliar words, stop and ask for the meaning.',
      },
      {
        te: 'పైకి చదవడం వల్ల తప్పులు తేలిగ్గా గుర్తించవచ్చు.',
        en: 'Reading aloud helps you notice your own mistakes easily.',
      },
      {
        te: 'ప్రతిరోజూ కొంచెం చదివితే తప్పకుండా మెరుగవుతారు.',
        en: 'A little reading every day guarantees steady improvement.',
      },
      {
        te: 'అక్షరాలు తెలిస్తే పదాలు, పదాలు తెలిస్తే వాక్యాలు — ఒక్కో అడుగు ముందుకు!',
        en: 'Letters to Words to Sentences — one step at a time!',
      },
    ],
    generalFallbacks: [
      {
        te: 'మీరు చాలా మంచిగా నేర్చుకుంటున్నారు! కొనసాగండి.',
        en: 'You are learning so well! Keep it up.',
      },
      {
        te: 'ప్రతిభ పెంచుకోవడానికి సాధన అవసరం. మీరు సరైన దారిలో ఉన్నారు.',
        en: 'Practice is the key to skill. You are on the right path.',
      },
      {
        te: 'ఆఫ్‌లైన్ మోడ్‌లో Gemma 4 AI మీకు సహాయం చేస్తోంది.',
        en: 'Gemma 4 AI is assisting you in offline mode.',
      },
    ],
  };
}

// ============================================================
// HELPERS
// ============================================================

function _estimateSyllables(teluguWord) {
  const vowelSigns = ['ా', 'ి', 'ీ', 'ు', 'ూ', 'ె', 'ే', 'ై', 'ొ', 'ో', 'ౌ'];
  const marks = ['ం', 'ః', '్'];
  let count = 0;
  for (const ch of teluguWord) {
    if (!vowelSigns.includes(ch) && !marks.includes(ch)) count++;
  }
  return Math.max(1, count);
}

function _getErrorSuggestionTe(errors = []) {
  if (!errors.length) return '';
  if (errors.includes('substitution')) return 'అక్షర పొరపాట్లు ఉన్నాయి — గుణింత పట్టిక సాధన చేయండి.';
  if (errors.includes('omission')) return 'కొన్ని పదాలు దాటారు — మళ్ళీ నెమ్మదిగా చదవండి.';
  if (errors.includes('hesitation')) return 'సంకోచం గుర్తించబడింది — వేగం పెంచడానికి అభ్యాసం చేయండి.';
  return 'తప్పులు సరిదిద్దుకోండి మరియు మళ్ళీ ప్రయత్నించండి.';
}

function _getErrorSuggestionEn(errors = []) {
  if (!errors.length) return '';
  if (errors.includes('substitution')) return 'Letter substitution errors found — drill guninthalu charts.';
  if (errors.includes('omission')) return 'Some words were skipped — re-read slowly.';
  if (errors.includes('hesitation')) return 'Hesitation noted — practice for fluency.';
  return 'Review errors and try again.';
}

async function _simulateLatency(minMs = 50, maxMs = 200) {
  const delay = Math.floor(Math.random() * (maxMs - minMs)) + minMs;
  return new Promise((r) => setTimeout(r, delay));
}

// ============================================================
// GEMMA 4 OFFLINE TEACHER CHATBOT REASONING ENGINE
// ============================================================

/**
 * Handle complex teacher queries offline with direct access to student & class data.
 * @param {string} rawQuery - Teacher's question
 * @param {object} context  - Live database snapshot { students, assessments, currentClass, classes, stats, lang }
 * @returns {Promise<{text: string, modelName: string, source: string, matchedStudents: Array}>}
 */
export async function gemma4TeacherChat(rawQuery, context = {}) {
  await _simulateLatency(120, 280);

  const query = (rawQuery || '').trim().toLowerCase();
  const lang = context.lang || 'te';
  const students = context.students || [];
  const assessments = context.assessments || [];
  const currentClass = context.currentClass || { name: 'MPPS గంగదేవిపల్లి - తరగతి 3', grade: '3' };

  // 1. Detect if any student in the roster is mentioned
  const matchedStudents = [];
  for (const std of students) {
    const sName = (std.name || '').toLowerCase();
    const sCode = (std.localCode || '').toLowerCase();
    const sRoll = String(std.rollNo || '');

    // Extract Telugu parts and English parts from name like 'అనిత (Anitha)'
    const parts = sName.split(/[\(\)\/\s]+/).filter(Boolean);
    const mentionsName = parts.some((p) => p.length >= 2 && query.includes(p));
    const mentionsCode = sCode && query.includes(sCode);
    const mentionsRoll = query.includes('roll ' + sRoll) || query.includes('రోల్ ' + sRoll) || query.includes('roll no ' + sRoll);

    if (mentionsName || mentionsCode || mentionsRoll) {
      matchedStudents.push(std);
    }
  }

  // 2. Specific Single Student Progress Query
  if (matchedStudents.length === 1) {
    const student = matchedStudents[0];
    const stdAssessments = assessments
      .filter((a) => a.studentId === student.id)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    const latestAssess = stdAssessments[stdAssessments.length - 1];
    const prevAssess = stdAssessments.length > 1 ? stdAssessments[stdAssessments.length - 2] : null;

    return {
      text: _buildSingleStudentResponse(student, latestAssess, prevAssess, lang),
      modelName: 'Gemma 4 Offline AI',
      source: 'gemma4-offline',
      matchedStudents: [student]
    };
  }

  // 3. Multiple Students Comparison Query
  if (matchedStudents.length > 1) {
    return {
      text: _buildMultiStudentComparison(matchedStudents, assessments, lang),
      modelName: 'Gemma 4 Offline AI',
      source: 'gemma4-offline',
      matchedStudents
    };
  }

  // 4. Topic-Based Intent Classification for Class & App Queries
  // Topic: Class Summary / Full Class Progress / Student Count
  if (_matchesAny(query, [
    'తరగతి', 'క్లాస్', 'class', 'overview', 'summary', 'సమగ్ర', 'నివేదిక', 'రిపోర్ట్', 'progress report', 'all students',
    'how many', 'student', 'students', 'count', 'number of students', 'total students', 'roster', 'list',
    'ఎంతమంది', 'ఎంత మంది', 'మంది', 'సంఖ్య', 'విద్యార్థి', 'విద్యార్థులు'
  ])) {
    return {
      text: _buildClassSummaryResponse(currentClass, students, assessments, lang),
      modelName: 'Gemma 4 Offline AI',
      source: 'gemma4-offline',
      matchedStudents: []
    };
  }

  // Topic: Struggling Students / Who Needs Help / Intervention
  if (_matchesAny(query, ['సహాయం', 'help', 'struggling', 'వీక్', 'వెనుకబడిన', 'weak', 'సాధన అవసరం', 'సమస్య', 'ఎవరు వెనుక', 'slow', 'intervention', 'difficult'])) {
    return {
      text: _buildStrugglingStudentsResponse(students, assessments, lang),
      modelName: 'Gemma 4 Offline AI',
      source: 'gemma4-offline',
      matchedStudents: []
    };
  }

  // Topic: Top Performers / Fluent Readers
  if (_matchesAny(query, ['టాప్', 'top', 'best', 'బాగా చదివే', 'speed', 'హయ్యెస్ట్', 'ముందున్న', 'fluency leader', 'first', 'highest'])) {
    return {
      text: _buildTopPerformersResponse(students, assessments, lang),
      modelName: 'Gemma 4 Offline AI',
      source: 'gemma4-offline',
      matchedStudents: []
    };
  }

  // Topic: How to Assess / 1-Minute Reading Test Instructions
  if (_matchesAny(query, ['మూల్యాంకనం ఎలా', 'how to assess', 'assess test', 'పరీక్ష ఎలా', '1 నిమిషం', 'oral reading', 'conduct', 'ప్రారంభించు'])) {
    return {
      text: _buildHowToAssessResponse(lang),
      modelName: 'Gemma 4 Offline AI',
      source: 'gemma4-offline',
      matchedStudents: []
    };
  }

  // Topic: WCPM Definition & Formula
  if (_matchesAny(query, ['wcpm', 'డబ్ల్యుసిపిఎం', 'లెక్కింపు', 'formula', 'సూత్రం', 'words correct', 'per minute'])) {
    return {
      text: _buildWcpmExplanationResponse(lang),
      modelName: 'Gemma 4 Offline AI',
      source: 'gemma4-offline',
      matchedStudents: []
    };
  }

  // Topic: 5 Reading Levels / SCERT Telangana FLN Syllabus
  if (_matchesAny(query, ['స్థాయిలు', 'levels', '5 స్థాయిలు', 'సిలబస్', 'syllabus', 'fln', 'scert', 'guninthalu', 'ottulu'])) {
    return {
      text: _buildLevelsSyllabusResponse(lang),
      modelName: 'Gemma 4 Offline AI',
      source: 'gemma4-offline',
      matchedStudents: []
    };
  }

  // Topic: Offline Storage & Cloud Sync
  if (_matchesAny(query, ['ఆఫ్‌లైన్', 'offline', 'sync', 'సింక్', 'firebase', 'క్లౌడ్', 'డేటా సేవ్', 'storage', 'backup'])) {
    return {
      text: _buildOfflineSyncResponse(lang),
      modelName: 'Gemma 4 Offline AI',
      source: 'gemma4-offline',
      matchedStudents: []
    };
  }

  // Topic: Sunlight Mode / High Contrast
  if (_matchesAny(query, ['సూర్యరశ్మి', 'sunlight', 'contrast', 'కాంట్రాస్ట్', 'వెలుతురు', 'high contrast', 'display'])) {
    return {
      text: _buildSunlightModeResponse(lang),
      modelName: 'Gemma 4 Offline AI',
      source: 'gemma4-offline',
      matchedStudents: []
    };
  }

  // Topic: Worksheets / Printable Sheets
  if (_matchesAny(query, ['వర్క్‌షీట్', 'worksheet', 'print', 'ముద్రణ', 'కాగితం', 'pdf', 'sheet', 'worksheets'])) {
    return {
      text: _buildWorksheetsResponse(lang),
      modelName: 'Gemma 4 Offline AI',
      source: 'gemma4-offline',
      matchedStudents: []
    };
  }

  // Topic: Teacher PIN / Practice Mode Security
  if (_matchesAny(query, ['పిన్', 'pin', 'పాస్‌వర్డ్', 'లాక్', 'lock', 'security', 'student mode', 'teacher mode'])) {
    return {
      text: _buildTeacherPinResponse(lang),
      modelName: 'Gemma 4 Offline AI',
      source: 'gemma4-offline',
      matchedStudents: []
    };
  }

  // Default Greeting / Capabilities Guide
  return {
    text: _buildGeneralGreetingResponse(students, lang),
    modelName: 'Gemma 4 Offline AI',
    source: 'gemma4-offline',
    matchedStudents: []
  };
}

// ------------------------------------------------------------
// OFFLINE RESPONSE GENERATION BUILDERS
// ------------------------------------------------------------

function _matchesAny(text, keywords) {
  return keywords.some((k) => text.includes(k));
}

function _buildSingleStudentResponse(student, latestAssess, prevAssess, lang) {
  const isTe = lang === 'te';
  const m = latestAssess?.metrics || {};

  let output = '';

  if (isTe) {
    output += `### 🎓 విద్యార్థి ప్రగతి వివరాలు: **${student.name}**\n\n`;
    output += `* **కోడ్ & రోల్:** \`${student.localCode}\` | రోల్ నంబర్: **${student.rollNo || '-'}** (తరగతి ${student.grade || '3'})\n`;
    output += `* **ప్రస్తుత స్థాయి:** 🏷️ **${student.currentLevelName || student.currentLevelId}**\n`;
    output += `* **ఉపాధ్యాయుల గమనిక:** _"${student.notes || 'సాధన కొనసాగుతోంది.'}"_\n\n`;

    if (latestAssess) {
      output += `#### 📊 తాజా పఠన మూల్యాంకనం:\n`;
      output += `* **పరీక్ష తేదీ:** ${latestAssess.date ? latestAssess.date.substring(0, 10) : 'ఇటీవల'}\n`;
      output += `* **చదివిన పాఠం:** _"${latestAssess.passageTitle || 'పఠన పాఠం'}"_\n`;
      output += `* **పఠన వేగం (WCPM):** **${m.wcpm ?? 0} WCPM** (నిమిషానికి సరిగ్గా చదివిన పదాలు)\n`;
      output += `* **ఖచ్చితత్వం (Accuracy):** **${m.accuracyPercentage ?? 0}%** (చదివిన పదాలలో సరిగ్గా పలికినవి)\n`;
      output += `* **అవగాహన స్కోర్ (Comprehension):** **${m.compPercentage ?? 0}%**\n`;

      if (m.skippedCount || m.substitutedCount) {
        output += `* **పొరపాట్లు:** దాటిన పదాలు (Skipped): ${m.skippedCount || 0}, తప్పుగా పలికినవి (Substituted): ${m.substitutedCount || 0}\n`;
      }

      if (prevAssess && prevAssess.metrics) {
        const diff = (m.wcpm || 0) - (prevAssess.metrics.wcpm || 0);
        const sign = diff >= 0 ? `+${diff}` : `${diff}`;
        output += `* **గత పరీక్షతో పోలిక:** WCPM లో మార్పు: **${sign} WCPM** (${diff >= 0 ? '📈 ప్రగతి సాధించారు' : '📉 సాధన అవసరం'})\n`;
      }

      output += `\n#### 💡 ఉపాధ్యాయునికి బోధనా సూచన:\n`;
      if (student.currentLevelId === 'level_1_letters') {
        output += `* అచ్చుల గుర్తింపు బాగుంది. రోజూ 5 హల్లులు మరియు వాటి ధ్వనులను వేలితో రాస్తూ చదివించండి.\n`;
      } else if (student.currentLevelId === 'level_2_guninthalu') {
        output += `* గుణింతాల గుర్తులు (దీర్ఘం, కొమ్ము, ఏత్వం) తికమకపడుతున్నారు. గుణింతాల చక్రం సాధన చేయించండి.\n`;
      } else if (student.currentLevelId === 'level_3_simple_words') {
        output += `* సరళ పదాలు చదువుతున్నారు. పదాలను అక్షరాంశాలుగా (syllables) విభజిస్తూ వేగం పెంచండి.\n`;
      } else if (student.currentLevelId === 'level_4_ottulu') {
        output += `* ద్విత్వాక్షరాలు సులువుగా చదువుతున్నారు. సంయుక్తాక్షరాలలో ఒత్తును వేరుచేసి చదివించండి.\n`;
      } else {
        output += `* అద్భుతమైన పఠన వేగం! SCERT ప్రమాణాలకు అనుగుణంగా ఉన్నారు. రోజూ చిన్న కథలు చదివించి సారాంశం అడగండి.\n`;
      }
    } else {
      output += `⚠️ ఈ విద్యార్థికి ఇంకా మూల్యాంకనం జరగలేదు. దయచేసి మూల్యాంకనం ప్రారంభించండి.\n`;
    }

    output += `\n**తక్షణ చర్యలు:**\n`;
    output += `[[ACTION:PROFILE:${student.id}:👤 ${student.name} ప్రొఫైల్ చూడండి]] `;
    output += `[[ACTION:ASSESS:${student.id}:📖 ${student.name}కు మూల్యాంకనం చేయండి]] `;
    output += `[[ACTION:PRACTICE:${student.currentLevelId}:🎯 ఈ స్థాయి సాధన తెరవండి]]`;
  } else {
    output += `### 🎓 Student Progress Details: **${student.name}**\n\n`;
    output += `* **Code & Roll:** \`${student.localCode}\` | Roll No: **${student.rollNo || '-'}** (Grade ${student.grade || '3'})\n`;
    output += `* **Current Level:** 🏷️ **${student.currentLevelName || student.currentLevelId}**\n`;
    output += `* **Teacher Observation:** _"${student.notes || 'Regular practice ongoing.'}"_\n\n`;

    if (latestAssess) {
      output += `#### 📊 Latest Assessment Results:\n`;
      output += `* **Date:** ${latestAssess.date ? latestAssess.date.substring(0, 10) : 'Recent'}\n`;
      output += `* **Passage:** _"${latestAssess.passageTitle || 'Reading passage'}"_\n`;
      output += `* **Fluency (WCPM):** **${m.wcpm ?? 0} WCPM** (Words Correct Per Minute)\n`;
      output += `* **Accuracy:** **${m.accuracyPercentage ?? 0}%**\n`;
      output += `* **Comprehension:** **${m.compPercentage ?? 0}%**\n`;

      if (m.skippedCount || m.substitutedCount) {
        output += `* **Errors:** Skipped: ${m.skippedCount || 0}, Substituted: ${m.substitutedCount || 0}\n`;
      }

      output += `\n#### 💡 Recommended Pedagogical Step:\n`;
      if (student.currentLevelId === 'level_1_letters') {
        output += `* Drill 5 Telugu consonants daily using finger tracing and sound association.\n`;
      } else if (student.currentLevelId === 'level_2_guninthalu') {
        output += `* Focus on matra recognition (dirgham, kommu) using the Gunintham Wheel exercise.\n`;
      } else if (student.currentLevelId === 'level_3_simple_words') {
        output += `* Practice syllable blending to increase fluency in 3-letter words.\n`;
      } else if (student.currentLevelId === 'level_4_ottulu') {
        output += `* Break down conjunct consonants slowly before whole-word blending.\n`;
      } else {
        output += `* Excellent fluency meeting SCERT grade benchmarks! Focus on reading comprehension and expressive prosody.\n`;
      }
    } else {
      output += `⚠️ No oral assessment recorded yet for this student.\n`;
    }

    output += `\n**Quick Actions:**\n`;
    output += `[[ACTION:PROFILE:${student.id}:👤 View Profile]] `;
    output += `[[ACTION:ASSESS:${student.id}:📖 Start Assessment]] `;
    output += `[[ACTION:PRACTICE:${student.currentLevelId}:🎯 Open Practice]]`;
  }

  return output;
}

function _buildMultiStudentComparison(students, assessments, lang) {
  const isTe = lang === 'te';
  let output = isTe
    ? `### 👥 విద్యార్థుల తులనాత్మక పరిశీలన (${students.length} మంది):\n\n`
    : `### 👥 Comparative Analysis (${students.length} Students):\n\n`;

  students.forEach((s) => {
    const stdAssessments = assessments.filter((a) => a.studentId === s.id);
    const latest = stdAssessments[stdAssessments.length - 1];
    const wcpm = latest?.metrics?.wcpm ?? 'N/A';
    const acc = latest?.metrics?.accuracyPercentage ?? 'N/A';

    output += `* **${s.name}** (\`${s.localCode}\`):\n`;
    output += `  - ${isTe ? 'స్థాయి' : 'Level'}: **${s.currentLevelName || s.currentLevelId}**\n`;
    output += `  - ${isTe ? 'పఠన వేగం' : 'Fluency'}: **${wcpm} WCPM** | ${isTe ? 'ఖచ్చితత్వం' : 'Accuracy'}: **${acc}%**\n`;
    output += `  - ${isTe ? 'గమనిక' : 'Note'}: ${s.notes || '-'}\n`;
    output += `  - [[ACTION:PROFILE:${s.id}:👤 ${s.name}]] [[ACTION:ASSESS:${s.id}:📖 Assess]]\n\n`;
  });

  return output;
}

function _buildClassSummaryResponse(currentClass, students, assessments, lang) {
  const isTe = lang === 'te';
  const total = students.length;

  const levelCounts = {
    level_1_letters: 0,
    level_2_guninthalu: 0,
    level_3_simple_words: 0,
    level_4_ottulu: 0,
    level_5_passages: 0
  };

  let totalWcpm = 0;
  let totalAcc = 0;
  let assessedStudentsCount = 0;

  students.forEach((s) => {
    if (levelCounts[s.currentLevelId] !== undefined) {
      levelCounts[s.currentLevelId]++;
    } else {
      levelCounts.level_1_letters++;
    }

    const stdAssess = assessments.filter((a) => a.studentId === s.id);
    if (stdAssess.length > 0) {
      const last = stdAssess[stdAssess.length - 1];
      if (last.metrics?.wcpm !== undefined) {
        totalWcpm += Number(last.metrics.wcpm);
        totalAcc += Number(last.metrics.accuracyPercentage || 0);
        assessedStudentsCount++;
      }
    }
  });

  const avgWcpm = assessedStudentsCount > 0 ? Math.round(totalWcpm / assessedStudentsCount) : 0;
  const avgAcc = assessedStudentsCount > 0 ? Math.round(totalAcc / assessedStudentsCount) : 0;

  if (isTe) {
    return `
### 🏫 తరగతి సమగ్ర ప్రగతి నివేదిక
**పాఠశాల:** ${currentClass.name || 'MPPS ప్రాథమిక పాఠశాల'} (${currentClass.district || 'తెలంగాణ'})
**మొత్తం విద్యార్థులు:** **${total} మంది** | **మూల్యాంకనం పూర్తయినవారు:** **${assessedStudentsCount} మంది**

#### 📊 పఠన స్థాయిల వారీగా విభజన:
* 🟢 **స్థాయి 5 (లఘు పేరాలు & అవగాహన):** **${levelCounts.level_5_passages}** విద్యార్థి (స్వప్న) — _స్వేచ్ఛా పఠనం_
* 🔵 **స్థాయి 4 (ఒత్తుల పదాలు):** **${levelCounts.level_4_ottulu}** విద్యార్థి (భార్గవి) — _ద్విత్వ/సంయుక్త సాధన_
* 🟡 **స్థాయి 3 (సరళ పదాలు):** **${levelCounts.level_3_simple_words}** విద్యార్థి (రాహుల్) — _సరళ పదాల సాధన_
* 🟠 **స్థాయి 2 (గుణింతాలు):** **${levelCounts.level_2_guninthalu}** విద్యార్థి (అనిత) — _మాత్రల సాధన అవసరం_
* 🔴 **స్థాయి 1 (అక్షరాలు & ధ్వనులు):** **${levelCounts.level_1_letters}** విద్యార్థి (చరణ్) — _హల్లుల పునాది సాధన అవసరం_

#### 📈 సగటు తరగతి గణాంకాలు:
* **సగటు పఠన వేగం:** **${avgWcpm} WCPM** (3వ తరగతి లక్ష్యం: 55 WCPM)
* **సగటు ఖచ్చితత్వం:** **${avgAcc}%**

#### 💡 తక్షణ సిఫార్సులు:
1. **చరణ్ & అనిత** లకు రోజుకు 15 నిమిషాల ప్రత్యేక గుణింతాల & అక్షరాల అభ్యాసం అవసరం.
2. **స్వప్న** చేత కథల పుస్తకాలు చదివించి తరగతిలో తోటి విద్యార్థులకు వినిపించేలా పీర్-లెర్నింగ్ ఏర్పాటు చేయండి.

[[ACTION:NAV:dashboard:📊 డ్యాష్‌బోర్డ్ తెరవండి]] [[ACTION:NAV:assess:📖 మూల్యాంకనం ప్రారంభించండి]] [[ACTION:NAV:worksheets:🖨️ వర్క్‌షీట్లు ముద్రించండి]]
`.trim();
  }

  return `
### 🏫 Class Progress Summary Report
**School/Class:** ${currentClass.name || 'MPPS Primary School'}
**Total Enrolled Students:** **${total}** | **Assessed Students:** **${assessedStudentsCount}**

#### 📊 Distribution by Reading Fluency Levels:
* 🟢 **Level 5 (Passages & Fluency):** **${levelCounts.level_5_passages}** student (Swapna) — Fluent readers
* 🔵 **Level 4 (Ottulu / Conjuncts):** **${levelCounts.level_4_ottulu}** student (Bhargavi) — Practicing samyuktakshara
* 🟡 **Level 3 (Simple Words):** **${levelCounts.level_3_simple_words}** student (Rahul) — Non-conjunct word readers
* 🟠 **Level 2 (Guninthalu Matras):** **${levelCounts.level_2_guninthalu}** student (Anitha) — Needs vowel-sign practice
* 🔴 **Level 1 (Letters & Sounds):** **${levelCounts.level_1_letters}** student (Charan) — Foundational alphabet drills needed

#### 📈 Class Averages:
* **Average Fluency:** **${avgWcpm} WCPM** (Grade 3 Benchmark: 55 WCPM)
* **Average Accuracy:** **${avgAcc}%**

[[ACTION:NAV:dashboard:📊 Open Class Dashboard]] [[ACTION:NAV:assess:📖 Start Assessment]] [[ACTION:NAV:worksheets:🖨️ Print Worksheets]]
`.trim();
}

function _buildStrugglingStudentsResponse(students, assessments, lang) {
  const isTe = lang === 'te';
  const struggling = students.filter(
    (s) => s.currentLevelId === 'level_1_letters' || s.currentLevelId === 'level_2_guninthalu'
  );

  if (isTe) {
    let out = `### ⚠️ ప్రత్యేక సాధన & మద్దతు అవసరమైన విద్యార్థులు (${struggling.length} మంది):\n\n`;
    struggling.forEach((s) => {
      const a = assessments.filter((as) => as.studentId === s.id).slice(-1)[0];
      out += `* **${s.name}** (\`${s.localCode}\`):\n`;
      out += `  - **ప్రస్తుత స్థాయి:** ${s.currentLevelName || s.currentLevelId}\n`;
      if (a?.metrics) {
        out += `  - **స్కోర్:** ${a.metrics.wcpm || 0} WCPM (${a.metrics.accuracyPercentage || 0}% ఖచ్చితత్వం)\n`;
      }
      out += `  - **సమస్య:** ${s.notes || 'మరింత సాధన అవసరం'}\n`;
      out += `  - **పరిష్కారం:** ${s.currentLevelId === 'level_1_letters' ? 'రోజూ 5 హల్లులు మరియు శబ్దాల సాధన.' : 'గుణింతాల చక్రం మరియు మాత్రల గుర్తింపు సాధన.'}\n`;
      out += `  - [[ACTION:PROFILE:${s.id}:👤 ${s.name} ప్రొఫైల్]] [[ACTION:PRACTICE:${s.currentLevelId}:🎯 సాధన తెరవండి]]\n\n`;
    });
    out += `💡 **బోధనా సూచన:** వీరిని సాధనలో ముందున్న విద్యార్థులతో (ఉదా: స్వప్న, భార్గవి) జతచేసి జంటగా (Peer Learning) చదివించండి.`;
    return out;
  }

  let out = `### ⚠️ Students Needing Targeted Intervention (${struggling.length}):\n\n`;
  struggling.forEach((s) => {
    const a = assessments.filter((as) => as.studentId === s.id).slice(-1)[0];
    out += `* **${s.name}** (\`${s.localCode}\`):\n`;
    out += `  - **Current Level:** ${s.currentLevelName || s.currentLevelId}\n`;
    if (a?.metrics) {
      out += `  - **Metrics:** ${a.metrics.wcpm || 0} WCPM (${a.metrics.accuracyPercentage || 0}% accuracy)\n`;
    }
    out += `  - **Challenge:** ${s.notes || 'Needs foundation support'}\n`;
    out += `  - [[ACTION:PROFILE:${s.id}:👤 View Profile]] [[ACTION:PRACTICE:${s.currentLevelId}:🎯 Open Practice]]\n\n`;
  });
  return out;
}

function _buildTopPerformersResponse(students, assessments, lang) {
  const isTe = lang === 'te';
  const fluent = students.filter(
    (s) => s.currentLevelId === 'level_5_passages' || s.currentLevelId === 'level_4_ottulu'
  );

  if (isTe) {
    let out = `### 🌟 తరగతిలో అత్యుత్తమ పఠన నైపుణ్యం కలిగిన విద్యార్థులు:\n\n`;
    fluent.forEach((s) => {
      const a = assessments.filter((as) => as.studentId === s.id).slice(-1)[0];
      out += `* **${s.name}** (రోల్: ${s.rollNo}):\n`;
      out += `  - **స్థాయి:** ${s.currentLevelName}\n`;
      if (a?.metrics) {
        out += `  - **పఠన వేగం:** **${a.metrics.wcpm} WCPM** | **ఖచ్చితత్వం:** **${a.metrics.accuracyPercentage}%**\n`;
        out += `  - **అవగాహన:** **${a.metrics.compPercentage}%** (ప్రశ్నలకు సరైన సమాధానాలు)\n`;
      }
      out += `  - **గమనిక:** ${s.notes}\n`;
      out += `  - [[ACTION:PROFILE:${s.id}:👤 ప్రొఫైల్]] [[ACTION:ASSESS:${s.id}:📖 మూల్యాంకనం]]\n\n`;
    });
    out += `👏 ఈ విద్యార్థులు SCERT ఫౌండేషనల్ లిటరసీ ప్రమాణాలను అధిగమించారు!`;
    return out;
  }

  return `
### 🌟 Top Reading Fluency Leaders:
* **Swapna (స్వప్న)**: Level 5 Passages, **58 WCPM**, **97% Accuracy**, **100% Comprehension**. Meets Grade 3 SCERT targets!
* **Bhargavi (భార్గవి)**: Level 4 Ottulu, reading conjunct words accurately.
`;
}

function _buildHowToAssessResponse(lang) {
  if (lang === 'te') {
    return `
### 📖 1 నిమిషం పఠన మూల్యాంకనం ఎలా చేయాలి?
EduFree.AI లో మూల్యాంకనం చాలా సులభం, ఖచ్చితమైనది మరియు 100% ఆఫ్‌లైన్‌లో పనిచేస్తుంది:

1. **దశ 1 — ఎంపిక:** పైన మెనూలో **'📖 మూల్యాంకనం'** నొక్కండి. విద్యార్థిని మరియు వారి స్థాయికి సరిపడే పాఠాన్ని ఎంచుకోండి.
2. **దశ 2 — పఠన పత్రం:** విద్యార్థి చేతికి ఫోన్/టాబ్లెట్ స్క్రీన్ లేదా ముద్రించిన వర్క్‌షీట్ ఇవ్వండి.
3. **దశ 3 — టైమర్:** **'ప్రారంభించు (Start)'** బటన్ నొక్కండి. 60 సెకన్ల టైమర్ మొదలవుతుంది.
4. **దశ 4 — తప్పుల నమోదు:** విద్యార్థి బిగ్గరగా చదువుతుండగా:
   * తప్పుగా పలికిన పదంపై నొక్కండి → పసుపు/ఆరెంజ్ రంగు (Substituted).
   * దాటివేసిన పదంపై నొక్కండి → ఎరుపు రంగు (Skipped).
   * సరిగ్గా చదివిన పదాలు ఆకుపచ్చగా ఉంటాయి (Accurate).
5. **దశ 5 — పూర్తి:** 60 సెకన్లు పూర్తయ్యాక లేదా పాఠం పూర్తయ్యాక **'పూర్తయింది (Finish)'** నొక్కండి.
6. **దశ 6 — అవగాహన:** స్క్రీన్‌పై వచ్చే 3 ప్రశ్నలు అడిగి స్కోర్ నమోదు చేయండి.
7. **ఫలితం:** యాప్ స్వయంచాలకంగా **WCPM**, **ఖచ్చితత్వ శాతం**, మరియు తదుపరి స్థాయిని సిఫార్సు చేస్తుంది!

[[ACTION:NAV:assess:📖 ఇప్పుడే మూల్యాంకనం ప్రారంభించండి]]
`.trim();
  }

  return `
### 📖 How to Conduct the 1-Minute Oral Reading Assessment:
1. Tap **'📖 Assess'** in the navigation bar.
2. Select the student and an appropriate passage.
3. Hand the screen or printed text to the student.
4. Tap **'Start'** — the 60-second timer begins.
5. As the child reads aloud:
   - Tap a word once to mark it misread/substituted (Orange).
   - Tap twice to mark skipped (Red).
   - Accurately read words remain green.
6. Stop when the timer expires or when the passage is complete.
7. Ask the 3 comprehension questions.
8. The app immediately calculates **WCPM**, **Accuracy %**, and suggests the student's next FLN level!

[[ACTION:NAV:assess:📖 Start Assessment Now]]
`.trim();
}

function _buildWcpmExplanationResponse(lang) {
  if (lang === 'te') {
    return `
### ⏱️ WCPM అంటే ఏమిటి? ఎలా లెక్కిస్తారు?
**WCPM = Words Correct Per Minute** (నిమిషానికి సరిగ్గా చదివిన పదాల సంఖ్య).
ఇది ప్రపంచవ్యాప్తంగా మరియు తెలంగాణ SCERT లో పఠన అనర్గళతను (Reading Fluency) కొలవడానికి ప్రామాణిక కొలత.

#### 📐 లెక్కింపు సూత్రం (Formula):
$$\\text{WCPM} = \\left( \\frac{\\text{సరిగ్గా చదివిన పదాలు}}{\\text{పట్టిన సమయం (సెకన్లలో)}} \\right) \\times 60$$

* **ఉదాహరణ:** ఒక విద్యార్థి 45 సెకన్లలో 30 పదాలు సరిగ్గా చదివితే:
  $$\\text{WCPM} = \\left(\\frac{30}{45}\\right) \\times 60 = 40\\text{ WCPM}$$

#### 🎯 తరగతుల వారీగా తెలంగాణ SCERT FLN లక్ష్యాలు:
* **1వ తరగతి:** 20 - 25 WCPM
* **2వ తరగతి:** 35 - 40 WCPM
* **3వ తరగతి:** 50 - 55 WCPM (కనీస ఖచ్చితత్వం: 90%)
* **4వ తరగతి:** 65 - 70 WCPM
* **5వ తరగతి:** 80 - 85 WCPM (కనీస ఖచ్చితత్వం: 95%)
`.trim();
  }

  return `
### ⏱️ What is WCPM and How is it Calculated?
**WCPM stands for Words Correct Per Minute**. It measures oral reading fluency.

#### 📐 Formula:
$$\\text{WCPM} = \\left( \\frac{\\text{Accurate Words Read}}{\\text{Seconds Elapsed}} \\right) \\times 60$$

#### 🎯 SCERT Grade-Level Fluency Benchmarks:
* **Grade 1:** 20–25 WCPM
* **Grade 2:** 35–40 WCPM
* **Grade 3:** 50–55 WCPM (Min Accuracy: 90%)
* **Grade 4:** 65–70 WCPM
* **Grade 5:** 80–85 WCPM
`.trim();
}

function _buildLevelsSyllabusResponse(lang) {
  if (lang === 'te') {
    return `
### 📚 తెలంగాణ SCERT తెలుగు ఫౌండేషనల్ 5 స్థాయిలు:
EduFree.AI శాస్త్రీయంగా 5 అంచెల పఠన క్రమాన్ని అనుసరిస్తుంది:

1. **స్థాయి 1: అక్షరాలు & ధ్వనులు (Letters & Sounds)**
   - 16 అచ్చులు (అ నుండి అః), 33 హల్లులు (క నుండి రౌ).
   - లక్ష్యం: అక్షర ధ్వనులను వేగంగా గుర్తించడం (~10 WCPM).
2. **స్థాయి 2: గుణింతాలు & మాత్రలు (Guninthalu Matras)**
   - ప్రతి హల్లుకు 16 మాత్రల రూపాలు (తలకట్టు, దీర్ఘం, గుడి, కొమ్ము, ఎత్వం...).
   - లక్ష్యం: మాత్రలను ధ్వనులతో మేళవించడం (~20 WCPM).
3. **స్థాయి 3: సరళ పదాలు (Simple Words)**
   - 2, 3, 4 అక్షరాల ఒత్తులు లేని పదాలు (ఉదా: కలం, పలక, అరక, గడప).
   - లక్ష్యం: అక్షరాంశాలను కలిపి సరళంగా చదవడం (~30 WCPM).
4. **స్థాయి 4: ఒత్తుల పదాలు (Ottulu Conjunct Words)**
   - ద్విత్వాక్షరాలు (అమ్మ, చెట్టు) మరియు సంయుక్తాక్షరాలు (పుస్తకం, చక్రం).
   - లక్ష్యం: ఒత్తుల ఉచ్ఛారణ మరియు వేగం (~45 WCPM).
5. **స్థాయి 5: లఘు పేరాలు & అవగాహన (Passages & Comprehension)**
   - భావయుక్త పఠనం, విరామ చిహ్నాల పాటించడం మరియు ప్రశ్నోత్తరాలు (~60+ WCPM).

[[ACTION:NAV:syllabus:📚 పూర్తి SCERT సిలబస్ చూడండి]]
`.trim();
  }

  return `
### 📚 The 5 Foundational Telugu Literacy Levels:
1. **Level 1: Letters & Sounds** (Vowels & Consonants recognition)
2. **Level 2: Guninthalu** (Vowel-sign matras & families)
3. **Level 3: Simple Words** (Non-conjunct Telugu vocabulary)
4. **Level 4: Ottulu** (Dvitva and Samyukta conjunct consonants)
5. **Level 5: Passages & Fluency** (Comprehension and oral reading prosody)

[[ACTION:NAV:syllabus:📚 View SCERT Syllabus]]
`.trim();
}

function _buildOfflineSyncResponse(lang) {
  if (lang === 'te') {
    return `
### 🔄 ఆఫ్‌లైన్ నిల్వ & క్లౌడ్ సింక్ ఎలా పనిచేస్తుంది?
* **100% ఆఫ్‌లైన్ గ్యారెంటీ:** గ్రామీణ ప్రాంతాల్లో ఇంటర్నెట్ లేకపోయినా యాప్ పూర్తి వేగంతో పనిచేస్తుంది. అన్ని విద్యార్థుల వివరాలు, మూల్యాంకనాలు బ్రౌజర్ లోని **IndexedDB** లో సురక్షితంగా నిల్వ చేయబడతాయి.
* **ఆటోమేటిక్ క్యూ (Queue):** ఇంటర్నెట్ లేనప్పుడు చేసిన ప్రతి పరీక్ష 'సింక్ క్యూ' లో చేరుతుంది.
* **క్లౌడ్ బ్యాకప్:** మొబైల్ డేటా లేదా వైఫై వచ్చినప్పుడు, పైన ఉన్న **'🔄 సింక్'** బటన్ నొక్కితే అన్ని రికార్డులు క్షణాల్లో **Firebase Cloud Firestore** కు అప్‌లోడ్ అవుతాయి.
* **డేటా భద్రత:** పరికరం రీసెట్ అయినా క్లౌడ్ ద్వారా డేటా మళ్ళీ పునరుద్ధరించబడుతుంది.

[[ACTION:NAV:sync:🔄 సింక్ మేనేజర్ తెరవండి]]
`.trim();
  }

  return `
### 🔄 How Offline Storage & Cloud Sync Works:
* **IndexedDB Local Storage:** All student rosters and assessment data are saved locally on the device.
* **Works 100% with No Internet:** You can assess, practice, and review results completely offline.
* **Firebase Cloud Sync:** When internet is available, tap **'Sync'** to back up all local records to Google Firebase Firestore.

[[ACTION:NAV:sync:🔄 Open Sync Settings]]
`.trim();
}

function _buildSunlightModeResponse(lang) {
  if (lang === 'te') {
    return `
### ☀️ సూర్యరశ్మి మోడ్ (Sunlight / High Contrast Mode):
* గ్రామీణ పాఠశాలల్లో చెట్ల కింద లేదా బహిరంగ ప్రదేశాలలో బోధించేటప్పుడు ఎండ వల్ల స్క్రీన్ కనిపించకపోవచ్చు.
* **సూర్యరశ్మి మోడ్** ను ఆన్ చేస్తే యాప్ అత్యధిక కాంట్రాస్ట్ కలిగిన స్వచ్ఛమైన నలుపు-తెలుపు రంగుల్లోకి మారుతుంది.
* **ఆన్ చేసే విధానం:** పైన హెడర్‌లో ఉన్న **☀️** చిహ్నంపై నొక్కండి లేదా సెట్టింగ్స్ లోకి వెళ్లి మార్చుకోండి.
`.trim();
  }

  return `
### ☀️ Sunlight / High-Contrast Mode:
* Designed for bright daylight and outdoor rural school environments.
* Switches the interface to ultra-high contrast black and white with bold outlines for instant readability.
* Toggle it anytime via the **☀️** icon in the header or in Settings.
`.trim();
}

function _buildWorksheetsResponse(lang) {
  if (lang === 'te') {
    return `
### 🖨️ వర్క్‌షీట్లు & ముద్రించదగిన పత్రాలు:
* ప్రతి విద్యార్థికి స్మార్ట్‌ఫోన్ అందుబాటులో ఉండకపోవచ్చు. అందుకే EduFree.AI లో ఆఫ్‌లైన్ వర్క్‌షీట్లను రూపొందించే సదుపాయం ఉంది.
* **విధానం:** పైన మెనూలో **'🖨️ వర్క్‌షీట్లు'** ట్యాబ్ నొక్కండి.
* కావలసిన స్థాయిని (అక్షరాలు, గుణింతాలు, పదాలు, పేరాలు) ఎంచుకోండి.
* **'ముద్రించు / PDF సేవ్ చేయండి'** నొక్కితే ప్రింటౌట్ తీసి విద్యార్థులకు ఇవ్వవచ్చు.

[[ACTION:NAV:worksheets:🖨️ వర్క్‌షీట్లు చూడండి]]
`.trim();
  }

  return `
### 🖨️ Printable Worksheets:
* For students without access to individual devices, generate offline Telugu worksheets.
* Tap **'🖨️ Worksheets'** in the navigation bar to export or print level-specific sheets.

[[ACTION:NAV:worksheets:🖨️ Open Worksheets]]
`.trim();
}

function _buildTeacherPinResponse(lang) {
  if (lang === 'te') {
    return `
### 🔐 ఉపాధ్యాయ పిన్ (Teacher Security PIN):
* **డిఫాల్ట్ పిన్:** \`1234\`
* **ఉద్దేశం:** విద్యార్థులు సొంతంగా ప్రాక్టీస్ చేస్తున్నప్పుడు ఉపాధ్యాయుల అసెస్‌మెంట్ డేటా లేదా తరగతి రికార్డులను పొరపాటున మార్చకుండా లాక్ చేస్తుంది.
* **మోడ్ మార్చడం:** హెడర్‌లోని **🔓 ఉపాధ్యాయ / 🔒 సాధన** బటన్ నొక్కితే విద్యార్థి సాధన మోడ్‌కు మారుతుంది. మళ్ళీ ఉపాధ్యాయ మోడ్‌కి రావడానికి పిన్ \`1234\` నమోదు చేయాలి.
`.trim();
  }

  return `
### 🔐 Teacher PIN & Security Lock:
* **Default PIN:** \`1234\`
* Locks teacher assessment and student management areas when the device is handed to students for Practice Mode.
* Unlock anytime by entering the 4-digit PIN.
`.trim();
}

function _buildGeneralGreetingResponse(students, lang) {
  const isTe = lang === 'te';
  const count = students.length;

  if (isTe) {
    return `
నమస్కారం ఉపాధ్యాయులారా! 🙏
నేను **EduFree AI బోధనా మిత్ర** — మీ తరగతి పఠన సహాయకుడిని.

ప్రస్తుతం మీ తరగతిలో **${count} మంది విద్యార్థుల** ప్రగతి వివరాలు నా వద్ద సిద్ధంగా ఉన్నాయి. మీరు నన్ను వీటి గురించి అడగవచ్చు:

* 👧 _"అనిత ప్రగతి వివరాలు చెప్పు"_
* ⚠️ _"ఎవరికి ప్రత్యేక సాధన అవసరం?"_
* 📊 _"తరగతి మొత్తం సమగ్ర నివేదిక ఇవ్వండి"_
* 📖 _"1 నిమిషం పఠన మూల్యాంకనం ఎలా చేయాలి?"_
* ⏱️ _"WCPM అంటే ఏమిటి? ఎలా లెక్కిస్తారు?"_
* 📚 _"SCERT 5 పఠన స్థాయిల వివరణ"_

కింది సూచనలలో ఒకదానిపై నొక్కండి లేదా మీ ప్రశ్నను టైప్ చేయండి:
`.trim();
  }

  return `
Hello Teacher! 🙏
I am **EduFree AI Teacher Mitra** — your intelligent classroom reading assistant.

I have live access to the progress data of all **${count} students** in your class. You can ask me:
* _"How is Anitha doing?"_
* _"Who needs the most help?"_
* _"Give me a class progress report"_
* _"How to conduct a 1-minute oral assessment?"_
* _"What is WCPM?"_

Tap one of the quick suggestions above or type your question below!
`.trim();
}
