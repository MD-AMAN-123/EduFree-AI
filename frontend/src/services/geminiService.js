// EduFree.AI - Google Gemini AI Service
// Handles cloud-based multimodal reasoning for Teacher Assistant when online.
// Seamlessly delegates to Gemma 4 Offline AI when offline or when no API key is set.

const GEMINI_API_KEY_STORAGE = 'edufree_gemini_api_key';
const GEMINI_SIMULATE_OFFLINE_STORAGE = 'edufree_gemini_simulate_offline';
const PRIMARY_MODEL = 'gemini-3.5-flash-lite';
const FALLBACK_MODEL = 'gemini-3.5-flash-lite';

function _cleanKey(key) {
  if (!key) return '';
  return key.trim().replace(/^['"]|['";]+$/g, '').trim();
}

/**
 * Retrieve saved Gemini API key (from localStorage or environment)
 */
export function getGeminiApiKey() {
  try {
    const stored = localStorage.getItem(GEMINI_API_KEY_STORAGE);
    const cleaned = _cleanKey(stored);
    if (cleaned) return cleaned;
  } catch (e) { /* ignore */ }

  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
      const envKey = _cleanKey(import.meta.env.VITE_GEMINI_API_KEY);
      if (envKey) return envKey;
    }
  } catch (e) { /* ignore */ }

  return '';
}

/**
 * Save custom Gemini API key
 */
export function setGeminiApiKey(key) {
  try {
    const cleaned = _cleanKey(key);
    if (cleaned) {
      localStorage.setItem(GEMINI_API_KEY_STORAGE, cleaned);
    } else {
      localStorage.removeItem(GEMINI_API_KEY_STORAGE);
    }
  } catch (e) { /* ignore */ }
}

/**
 * Check if teacher has simulated offline mode turned on
 */
export function isSimulatedOffline() {
  try {
    return localStorage.getItem(GEMINI_SIMULATE_OFFLINE_STORAGE) === '1';
  } catch (e) {
    return false;
  }
}

/**
 * Set simulated offline mode (allows testing Gemma 4 even with live Wi-Fi)
 */
export function setSimulatedOffline(enabled) {
  try {
    if (enabled) {
      localStorage.setItem(GEMINI_SIMULATE_OFFLINE_STORAGE, '1');
    } else {
      localStorage.removeItem(GEMINI_SIMULATE_OFFLINE_STORAGE);
    }
  } catch (e) { /* ignore */ }
}

/**
 * Check if Gemini is currently active & reachable
 */
export function isGeminiActive() {
  if (isSimulatedOffline()) return false;
  if (typeof navigator !== 'undefined' && !navigator.onLine) return false;
  return Boolean(getGeminiApiKey());
}

/**
 * Format conversation history into valid Gemini multi-turn contents.
 * Rules enforced by Gemini API:
 * 1. The first message MUST have role: "user".
 * 2. Roles MUST strictly alternate: user -> model -> user -> model...
 * 3. Ends with the current user query.
 */
function _buildValidGeminiContents(conversationHistory = [], query = '') {
  const contents = [];
  let expectedRole = 'user';

  // Take recent turns (up to 8)
  const recentHistory = conversationHistory.slice(-8);

  for (const msg of recentHistory) {
    if (!msg || !msg.text || !msg.text.trim()) continue;

    const role = msg.role === 'user' ? 'user' : 'model';
    if (role === expectedRole) {
      contents.push({
        role,
        parts: [{ text: msg.text.trim() }]
      });
      expectedRole = expectedRole === 'user' ? 'model' : 'user';
    }
  }

  // Ensure current user query is appended as user turn
  if (expectedRole === 'user') {
    contents.push({
      role: 'user',
      parts: [{ text: query.trim() }]
    });
  } else {
    // If the last added message was also a user message, append text to it
    if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
      contents[contents.length - 1].parts[0].text += '\n\n' + query.trim();
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: query.trim() }]
      });
    }
  }

  return contents;
}

/**
 * Call Gemini API with live student and app context
 */
export async function callGeminiTeacherChat({
  query,
  conversationHistory = [],
  contextData = {},
  lang = 'te'
}) {
  const isNetOffline = typeof navigator !== 'undefined' ? !navigator.onLine : false;

  // If offline or offline simulation active
  if (isNetOffline || isSimulatedOffline()) {
    return {
      success: false,
      fallbackToGemma4: true,
      reason: isSimulatedOffline() ? 'Simulated Offline Mode Active' : 'Device is Offline'
    };
  }

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return {
      success: false,
      fallbackToGemma4: true,
      reason: 'No Gemini API Key configured. Using Gemma 4 Offline Engine.'
    };
  }

  const systemInstruction = buildSystemPrompt(contextData, lang);
  const contents = _buildValidGeminiContents(conversationHistory, query);

  // Attempt with primary model (gemini-3.8-flash), then fallback model (gemini-2.5-flash)
  const modelsToTry = [PRIMARY_MODEL, FALLBACK_MODEL];
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 14000); // 14-second timeout

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }]
          },
          contents,
          generationConfig: {
            temperature: 0.35,
            maxOutputTokens: 1024,
            topP: 0.95
          }
        })
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData.error?.message || `HTTP ${response.status} from Gemini API`;
        console.warn(`Gemini API error with model ${model}:`, errMsg);
        lastError = errMsg;
        continue; // Try fallback model
      }

      const data = await response.json();

      // Extract answer text from parts (handling potential reasoning/thought parts)
      let text = '';
      if (data.candidates && data.candidates[0]?.content?.parts) {
        const parts = data.candidates[0].content.parts;
        const textParts = parts.filter((p) => !p.thought && p.text).map((p) => p.text);
        text = textParts.length > 0 ? textParts.join('\n') : (parts[0]?.text || '');
      }

      if (!text || !text.trim()) {
        lastError = 'Empty response text from Gemini API';
        continue;
      }

      const readableModelName = model === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : `Gemini (${model})`;

      console.info(`%c✨ ${readableModelName} responded successfully`, 'color: #059669; font-weight: bold;');

      return {
        success: true,
        text: text.trim(),
        modelName: readableModelName,
        source: 'gemini-online'
      };
    } catch (err) {
      console.warn(`Gemini network or execution exception with ${model}:`, err.message);
      lastError = err.message;
    }
  }

  // All Gemini attempts failed -> Fall back gracefully to Gemma 4
  console.warn('Falling back to Gemma 4 Offline AI:', lastError);
  return {
    success: false,
    fallbackToGemma4: true,
    reason: lastError || 'Gemini connection failed'
  };
}

/**
 * Build rich system prompt with all live students and classroom data
 */
function buildSystemPrompt(contextData, lang) {
  const {
    currentClass = {},
    students = [],
    assessments = [],
    stats = {}
  } = contextData;

  const currentLangName = lang === 'te' ? 'Telugu (తెలుగు)' : 'English';

  return `
You are "EduFree AI బోధనా మిత్ర (Teacher Mitra)" — an intelligent, empathetic, and highly accurate pedagogical AI copilot for primary school teachers in Telangana, India.
Your mission is to provide teachers with instant, reliable, and grounded data access to their students' reading progress and provide expert guidance on foundational Telugu literacy (FLN).

CURRENT CONTEXT & LIVE DATABASE:
- Active Class: "${currentClass.name || 'MPPS గంగదేవిపల్లి - తరగతి 3'}" (Grade: ${currentClass.grade || '3'}, District: ${currentClass.district || 'వరంగల్'})
- Total Students Enrolled: ${students.length}
- Class Level Breakdown:
  * స్థాయి 1: అక్షరాలు (Letters): ${stats.level1Count ?? 0} students
  * స్థాయి 2: గుణింతాలు (Guninthalu): ${stats.level2Count ?? 0} students
  * స్థాయి 3: సరళ పదాలు (Simple Words): ${stats.level3Count ?? 0} students
  * స్థాయి 4: ఒత్తుల పదాలు (Ottulu): ${stats.level4Count ?? 0} students
  * స్థాయి 5: లఘు పేరాలు (Passages/Comprehension): ${stats.level5Count ?? 0} students
- Class Average WCPM: ${stats.avgWCPM ?? 'N/A'} WCPM | Average Accuracy: ${stats.avgAccuracy ?? 'N/A'}%

STUDENT ROSTER & LATEST RECORDS:
${students.map((s, idx) => {
    const studentAssessments = assessments.filter(a => a.studentId === s.id);
    const latest = studentAssessments[studentAssessments.length - 1];
    return `[${idx + 1}] ID: ${s.id} | Roll: ${s.rollNo} | Code: ${s.localCode} | Name: ${s.name}
    Current Level: ${s.currentLevelName || s.currentLevelId}
    Last Assessed: ${s.lastAssessedDate ? s.lastAssessedDate.substring(0, 10) : 'Not assessed yet'}
    Notes: ${s.notes || 'None'}
    ${latest ? `Latest Test: "${latest.passageTitle}" | WCPM: ${latest.metrics?.wcpm} | Accuracy: ${latest.metrics?.accuracyPercentage}% | Comp: ${latest.metrics?.compPercentage}% | Errors: Skipped ${latest.metrics?.skippedCount || 0}, Substituted ${latest.metrics?.substitutedCount || 0} | Teacher Notes: ${latest.teacherNotes || 'None'}` : 'No assessment records yet.'}`;
  }).join('\n')}

APP & PEDAGOGY GUIDELINES:
1. FLN Telugu 5 Levels (SCERT Telangana Alignment):
   - Level 1: అక్షరాలు & ధ్వనులు (Letters & Sounds - Vowels & Consonants, target ~10 WCPM)
   - Level 2: గుణింతాలు (Gunintham matras/vowel-signs, target ~20 WCPM)
   - Level 3: సరళ పదాలు (Simple non-conjunct words, target ~30 WCPM)
   - Level 4: ఒత్తుల పదాలు (Conjunct consonants - dvitva & samyukta, target ~45 WCPM)
   - Level 5: లఘు పేరాలు & అవగాహన (Passages & Comprehension, target 60+ WCPM)
2. WCPM Benchmark Formula: WCPM = (Accurate words read ÷ seconds elapsed) × 60.
3. App Features:
   - 1-minute oral reading test with real-time error tagging (Substituted, Skipped, Prompted).
   - Practice Module with audio pronunciation and interactive flashcards.
   - Offline-First PWA architecture: All data is saved locally in IndexedDB and works with zero internet.
   - Cloud Sync: Pushes unsynced assessments to Firebase when back online.
   - Sunlight Mode: High contrast B&W display for outdoor village school reading.
   - Teacher PIN Lock (default: 1234): Protects assessment and student records from student modification.
   - Printable Worksheets: Generates downloadable Telugu reading assessment sheets.

RESPONSE RULES:
- Language: Answer primarily in ${currentLangName}. If asked in Telugu, answer warmly in natural, grammatically correct Telugu. If asked in English, answer in English.
- Absolute Grounding: ALWAYS state the exact numbers, levels, and notes from the student database above. NEVER hallucinate scores or student names.
- When answering about a specific student, clearly state their current level, latest WCPM, accuracy, error patterns, and next pedagogical step.
- You can include clickable action tags for the app:
  * To view a student's profile: [[ACTION:PROFILE:studentId:View Name Profile]]
  * To start an assessment: [[ACTION:ASSESS:studentId:Assess Name Now]]
  * To open practice: [[ACTION:PRACTICE:levelId:Practice Level Name]]
- Keep answers formatted with markdown: bullet points, bold key figures, and concise paragraphs.
`.trim();
}
