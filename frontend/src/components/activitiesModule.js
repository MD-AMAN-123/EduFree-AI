// EduFree.AI Activities Center — Oral Speaking & Visual Learning Games
// Exciting, gamified Telugu literacy activities for students
import { getLanguage } from '../data/i18n.js';
import { speakTeluguText, stopSpeech, playTone } from '../utils/speechAudio.js';

// ============================================================
// ACTIVITY DATA — Image-Word pairs (using vivid emoji as images)
// ============================================================
const IMAGE_WORD_PAIRS = [
  { emoji: '🐄', word: 'ఆవు', meaning: 'Cow', options: ['ఆవు', 'ఆట', 'ఆకు', 'ఆయన'] },
  { emoji: '🐘', word: 'ఏనుగు', meaning: 'Elephant', options: ['ఏనుగు', 'ఈగ', 'ఎలుక', 'ఏడు'] },
  { emoji: '🐦', word: 'పిట్ట', meaning: 'Bird', options: ['పిట్ట', 'పలక', 'పూల', 'పాట'] },
  { emoji: '🌳', word: 'చెట్టు', meaning: 'Tree', options: ['చెట్టు', 'చేప', 'చీర', 'చంద్ర'] },
  { emoji: '🏠', word: 'ఇల్లు', meaning: 'House', options: ['ఇల్లు', 'ఇసుక', 'ఇరుసు', 'ఇలా'] },
  { emoji: '🐟', word: 'చేప', meaning: 'Fish', options: ['చేప', 'చేయి', 'చేదు', 'చేర'] },
  { emoji: '🌺', word: 'పువ్వు', meaning: 'Flower', options: ['పువ్వు', 'పాలు', 'పాట', 'పండు'] },
  { emoji: '🦆', word: 'బాతు', meaning: 'Duck', options: ['బాతు', 'బస్సు', 'బంతి', 'బాల'] },
  { emoji: '🐍', word: 'పాము', meaning: 'Snake', options: ['పాము', 'పండు', 'పాట', 'పలక'] },
  { emoji: '🐒', word: 'కోతి', meaning: 'Monkey', options: ['కోతి', 'కాకి', 'కలము', 'కన్ను'] },
  { emoji: '🦁', word: 'సింహం', meaning: 'Lion', options: ['సింహం', 'సంచి', 'సీత', 'స్నేహం'] },
  { emoji: '🐢', word: 'తాబేలు', meaning: 'Turtle', options: ['తాబేలు', 'తామర', 'తలుపు', 'తాత'] },
  { emoji: '🌾', word: 'వరి', meaning: 'Rice paddy', options: ['వరి', 'వల', 'వాన', 'వాతు'] },
  { emoji: '🪔', word: 'దీపం', meaning: 'Lamp', options: ['దీపం', 'దండ', 'దారి', 'దోస'] },
  { emoji: '🏺', word: 'కుండ', meaning: 'Pot', options: ['కుండ', 'కాకి', 'కలము', 'కళ'] },
  { emoji: '🐓', word: 'కోడి', meaning: 'Chicken', options: ['కోడి', 'కోతి', 'కాకి', 'కాట'] },
];

// ============================================================
// SPELL-IT Data: hear a word, tap letters to form it
// ============================================================
const SPELL_IT_WORDS = [
  { word: 'అమ్మ', parts: ['అ', 'మ్మ'], allLetters: ['అ', 'మ్మ', 'న', 'ర', 'ల'], meaning: 'Mother' },
  { word: 'పలక', parts: ['ప', 'ల', 'క'], allLetters: ['ప', 'ల', 'క', 'మ', 'ర'], meaning: 'Slate' },
  { word: 'ఆవు', parts: ['ఆ', 'వు'], allLetters: ['ఆ', 'వు', 'క', 'మ', 'న'], meaning: 'Cow' },
  { word: 'ఇల్లు', parts: ['ఇ', 'ల్లు'], allLetters: ['ఇ', 'ల్లు', 'న', 'మ', 'క'], meaning: 'House' },
  { word: 'వాన', parts: ['వా', 'న'], allLetters: ['వా', 'న', 'క', 'మ', 'ల'], meaning: 'Rain' },
  { word: 'పాట', parts: ['పా', 'ట'], allLetters: ['పా', 'ట', 'న', 'స', 'క'], meaning: 'Song' },
  { word: 'చేప', parts: ['చే', 'ప'], allLetters: ['చే', 'ప', 'న', 'గ', 'స'], meaning: 'Fish' },
  { word: 'కాకి', parts: ['కా', 'కి'], allLetters: ['కా', 'కి', 'ప', 'స', 'మ'], meaning: 'Crow' },
];

// ============================================================
// ODD ONE OUT: find the word that doesn't belong
// ============================================================
const ODD_ONE_OUT_ROUNDS = [
  {
    words: ['కాకి', 'పిట్ట', 'బాతు', 'పాము'],
    oddIndex: 3,
    category: 'Birds',
    hint_te: 'పక్షులు కాని పదం గుర్తించండి',
    hint_en: 'Which one is NOT a bird?'
  },
  {
    words: ['పాలు', 'నీళ్లు', 'పులుసు', 'అమ్మ'],
    oddIndex: 3,
    category: 'Liquids',
    hint_te: 'ద్రవం కాని పదం గుర్తించండి',
    hint_en: 'Which one is NOT a liquid?'
  },
  {
    words: ['అమ్మ', 'నాన్న', 'అక్క', 'చెట్టు'],
    oddIndex: 3,
    category: 'Family',
    hint_te: 'కుటుంబ సభ్యుడు కాని పదం',
    hint_en: 'Which one is NOT a family member?'
  },
  {
    words: ['చేప', 'తాబేలు', 'ఏనుగు', 'పడవ'],
    oddIndex: 3,
    category: 'Animals',
    hint_te: 'జంతువు కాని పదం',
    hint_en: 'Which one is NOT an animal?'
  },
  {
    words: ['కలము', 'పుస్తకం', 'పలక', 'ఆవు'],
    oddIndex: 3,
    category: 'School items',
    hint_te: 'పాఠశాల వస్తువు కాని పదం',
    hint_en: 'Which one is NOT a school item?'
  },
  {
    words: ['మామిడి', 'అరటి', 'వంగ', 'అనాస'],
    oddIndex: 2,
    category: 'Fruits',
    hint_te: 'పండు కాని పదం',
    hint_en: 'Which one is NOT a fruit?'
  },
];

// Listen & Repeat words
const LISTEN_WORDS = [
  { word: 'అమ్మ', meaning: 'Mother' }, { word: 'నాన్న', meaning: 'Father' },
  { word: 'ఇల్లు', meaning: 'House' }, { word: 'పాట', meaning: 'Song' },
  { word: 'ఆవు', meaning: 'Cow' }, { word: 'ఏనుగు', meaning: 'Elephant' },
  { word: 'చెట్టు', meaning: 'Tree' }, { word: 'నీళ్లు', meaning: 'Water' },
  { word: 'పువ్వు', meaning: 'Flower' }, { word: 'పిట్ట', meaning: 'Bird' },
  { word: 'కలము', meaning: 'Pen' }, { word: 'పలక', meaning: 'Slate' },
  { word: 'వాన', meaning: 'Rain' }, { word: 'ఆట', meaning: 'Game' },
  { word: 'పాలు', meaning: 'Milk' }, { word: 'అన్నం', meaning: 'Rice/Food' },
  { word: 'కాకి', meaning: 'Crow' }, { word: 'చేప', meaning: 'Fish' },
  { word: 'మేక', meaning: 'Goat' }, { word: 'కుండ', meaning: 'Pot' },
];

// ============================================================
// MAIN EXPORT
// ============================================================
export function renderActivities(container, { onBack }) {
  const lang = getLanguage();
  let activeActivity = null;
  let score = 0;
  let totalAnswered = 0;
  let streak = 0;
  let bestStreak = 0;

  // Image-Word Match state
  let imgMatchIdx = 0;
  let imgMatchShuffled = [...IMAGE_WORD_PAIRS].sort(() => Math.random() - 0.5);
  let imgMatchResult = null;
  let imgMatchShuffledOptions = [];

  // Odd One Out state
  let oddIdx = 0;
  let oddShuffled = [...ODD_ONE_OUT_ROUNDS].sort(() => Math.random() - 0.5);
  let oddResult = null;

  // Spell-It state
  let spellIdx = 0;
  let spellShuffled = [...SPELL_IT_WORDS].sort(() => Math.random() - 0.5);
  let spellSelected = [];
  let spellResult = null;
  let spellShuffledLetters = [];

  // Listen state
  let listenIdx = 0;
  let listenPlaying = false;
  let listenMarked = null;

  function recordAnswer(isCorrect) {
    totalAnswered++;
    if (isCorrect) {
      score += 10;
      streak++;
      if (streak > bestStreak) bestStreak = streak;
      try { playTone('complete'); } catch(e) {}
    } else {
      streak = 0;
    }
  }

  // ---- HOME ----
  function renderHome() {
    return `
      <div class="activities-home">
        <div class="act-hero-banner">
          <div class="act-hero-content">
            <div class="act-hero-icon">🎮</div>
            <h2 class="act-hero-title">${lang === 'te' ? 'చదువు ఆటల కేంద్రం' : 'Learning Activities'}</h2>
            <p class="act-hero-sub">${lang === 'te' ? 'ఆడుతూ నేర్చుకోండి!' : 'Play & Learn Telugu!'}</p>
          </div>
        </div>

        <div class="act-score-bar">
          <div class="act-score-item">
            <span class="act-score-num">${score}</span>
            <span class="act-score-lbl">⭐ ${lang === 'te' ? 'పాయింట్లు' : 'Points'}</span>
          </div>
          <div class="act-score-divider"></div>
          <div class="act-score-item">
            <span class="act-score-num">${totalAnswered}</span>
            <span class="act-score-lbl">✅ ${lang === 'te' ? 'జవాబులు' : 'Answered'}</span>
          </div>
          <div class="act-score-divider"></div>
          <div class="act-score-item">
            <span class="act-score-num">${bestStreak}</span>
            <span class="act-score-lbl">🔥 ${lang === 'te' ? 'అత్యుత్తమ' : 'Best'}</span>
          </div>
        </div>

        ${streak >= 3 ? `<div class="act-streak-badge">🔥 ${streak} ${lang === 'te' ? 'వరుస సరైన సమాధానాలు!' : 'correct in a row!'}</div>` : ''}

        <div class="act-cards-grid">
          <button class="act-card act-card-match" id="act-btn-imgmatch">
            <div class="act-card-badge">⭐ Popular</div>
            <div class="act-card-emoji-row">🖼️</div>
            <div class="act-card-title">${lang === 'te' ? 'చిత్రం-పదం జతపరచు' : 'Image-Word Match'}</div>
            <div class="act-card-desc">${lang === 'te' ? 'చిత్రం చూసి సరైన తెలుగు పదం ఎంచుకో' : 'See the picture & pick the correct Telugu word'}</div>
            <div class="act-card-meta">
              <span class="act-card-count">${IMAGE_WORD_PAIRS.length} ${lang === 'te' ? 'స్థాయులు' : 'rounds'}</span>
              <span class="act-card-diff act-diff-easy">${lang === 'te' ? 'సులభం' : 'Easy'}</span>
            </div>
          </button>

          <button class="act-card act-card-odd" id="act-btn-oddout">
            <div class="act-card-badge act-badge-blue">🧠 Thinking</div>
            <div class="act-card-emoji-row">🔍</div>
            <div class="act-card-title">${lang === 'te' ? 'వేరుగా ఉన్న పదం' : 'Odd One Out'}</div>
            <div class="act-card-desc">${lang === 'te' ? 'ఇతరులకు సరిపోని పదాన్ని కనుగొను' : 'Find the word that does not belong'}</div>
            <div class="act-card-meta">
              <span class="act-card-count">${ODD_ONE_OUT_ROUNDS.length} ${lang === 'te' ? 'స్థాయులు' : 'rounds'}</span>
              <span class="act-card-diff act-diff-medium">${lang === 'te' ? 'మధ్యమం' : 'Medium'}</span>
            </div>
          </button>

          <button class="act-card act-card-spell" id="act-btn-spell">
            <div class="act-card-badge act-badge-purple">✍️ Spelling</div>
            <div class="act-card-emoji-row">🔊</div>
            <div class="act-card-title">${lang === 'te' ? 'పదం స్పెల్లింగ్' : 'Spell It!'}</div>
            <div class="act-card-desc">${lang === 'te' ? 'వినిన పదాన్ని అక్షరాలు నొక్కి రాయండి' : 'Hear the word & tap letters to spell it'}</div>
            <div class="act-card-meta">
              <span class="act-card-count">${SPELL_IT_WORDS.length} ${lang === 'te' ? 'స్థాయులు' : 'rounds'}</span>
              <span class="act-card-diff act-diff-hard">${lang === 'te' ? 'కష్టం' : 'Hard'}</span>
            </div>
          </button>

          <button class="act-card act-card-listen" id="act-btn-listen">
            <div class="act-card-badge act-badge-teal">👂 Oral</div>
            <div class="act-card-emoji-row">🗣️</div>
            <div class="act-card-title">${lang === 'te' ? 'వినండి & చెప్పండి' : 'Listen & Repeat'}</div>
            <div class="act-card-desc">${lang === 'te' ? 'పదం వినండి, పైకి చెప్పండి! ఉపాధ్యాయుడు గుర్తించండి' : 'Hear a word, say it aloud! Teacher marks result'}</div>
            <div class="act-card-meta">
              <span class="act-card-count">${LISTEN_WORDS.length} ${lang === 'te' ? 'పదాలు' : 'words'}</span>
              <span class="act-card-diff act-diff-easy">${lang === 'te' ? 'సులభం' : 'Easy'}</span>
            </div>
          </button>
        </div>

        <div style="text-align:center; margin-top:20px; padding-bottom: 100px;">
          <button id="act-back-btn" class="btn btn-outline" style="min-width:160px;">
            ← ${lang === 'te' ? 'వెనుకకు' : 'Back'}
          </button>
        </div>
      </div>
    `;
  }

  // ---- ACTIVITY 1: Image-Word Match ----
  function renderImageWordMatch() {
    const item = imgMatchShuffled[imgMatchIdx % imgMatchShuffled.length];
    if (!imgMatchShuffledOptions.length) {
      imgMatchShuffledOptions = [...item.options].sort(() => Math.random() - 0.5);
    }
    const progress = imgMatchIdx % imgMatchShuffled.length;
    const total = imgMatchShuffled.length;
    const percent = Math.round((progress / total) * 100);

    return `
      <div class="act-game-wrap">
        <div class="act-game-header">
          <button id="act-game-back" class="act-back-pill">← ${lang === 'te' ? 'ఆటలు' : 'Activities'}</button>
          <div class="act-progress-bar-wrap"><div class="act-progress-bar" style="width:${percent}%"></div></div>
          <div class="act-score-pill">⭐ ${score}</div>
        </div>
        <div class="act-game-body">
          <div class="act-game-title">🖼️ ${lang === 'te' ? 'చిత్రానికి తగిన పదం ఏది?' : 'Which word matches the image?'}</div>

          <div class="act-image-card ${imgMatchResult === 'correct' ? 'img-result-correct' : imgMatchResult === 'wrong' ? 'img-result-wrong' : ''}">
            <div class="act-big-emoji">${item.emoji}</div>
            <button class="act-listen-btn" id="act-img-speak-btn">🔊 ${lang === 'te' ? 'వినండి' : 'Listen'}</button>
            ${imgMatchResult === 'correct' ? `
              <div class="act-result-overlay correct">
                <span class="act-result-icon">✅</span>
                <span class="act-result-text">${lang === 'te' ? 'అద్భుతం! సరైనది!' : 'Amazing! Correct!'}</span>
                <span class="act-result-meaning">${item.word} = ${item.meaning}</span>
              </div>` : imgMatchResult === 'wrong' ? `
              <div class="act-result-overlay wrong">
                <span class="act-result-icon">❌</span>
                <span class="act-result-text">${lang === 'te' ? 'తప్పు. సరైన జవాబు:' : 'Wrong! Correct:'} <strong>${item.word}</strong></span>
              </div>` : ''}
          </div>

          <div class="act-options-grid">
            ${imgMatchShuffledOptions.map((opt) => `
              <button
                class="act-option-btn ${imgMatchResult ? (opt === item.word ? 'opt-correct' : 'opt-disabled') : ''}"
                data-option="${opt}"
                ${imgMatchResult ? 'disabled' : ''}>
                <span class="opt-telugu">${opt}</span>
              </button>
            `).join('')}
          </div>

          ${imgMatchResult ? `
            <div class="act-next-row">
              <button id="act-img-next" class="btn btn-primary" style="min-width:160px;">
                ${imgMatchIdx + 1 >= imgMatchShuffled.length ? '🏆 Play Again' : (lang === 'te' ? 'తదుపరి →' : 'Next →')}
              </button>
            </div>` : ''}

          <div class="act-round-indicator">${lang === 'te' ? 'స్థాయి' : 'Round'} ${(imgMatchIdx % imgMatchShuffled.length) + 1} / ${imgMatchShuffled.length}</div>
        </div>
      </div>
    `;
  }

  // ---- ACTIVITY 2: Odd One Out ----
  function renderOddOneOut() {
    const round = oddShuffled[oddIdx % oddShuffled.length];
    const progress = oddIdx % oddShuffled.length;
    const total = oddShuffled.length;
    const percent = Math.round((progress / total) * 100);

    return `
      <div class="act-game-wrap">
        <div class="act-game-header">
          <button id="act-game-back" class="act-back-pill">← ${lang === 'te' ? 'ఆటలు' : 'Activities'}</button>
          <div class="act-progress-bar-wrap"><div class="act-progress-bar" style="width:${percent}%"></div></div>
          <div class="act-score-pill">⭐ ${score}</div>
        </div>
        <div class="act-game-body">
          <div class="act-game-title">🔍 ${lang === 'te' ? round.hint_te : round.hint_en}</div>
          <div class="act-game-subtitle">${lang === 'te' ? 'వేరుగా ఉన్న పదాన్ని నొక్కండి!' : 'Tap the word that does NOT belong!'}</div>

          <div class="act-odd-grid">
            ${round.words.map((w, i) => `
              <button
                class="act-odd-btn ${oddResult !== null ? (i === round.oddIndex ? 'odd-correct' : 'odd-other') : ''}"
                data-idx="${i}"
                ${oddResult !== null ? 'disabled' : ''}>
                <span class="odd-word">${w}</span>
                ${oddResult !== null && i === round.oddIndex ? '<span class="odd-check">✅</span>' : ''}
              </button>
            `).join('')}
          </div>

          ${oddResult === 'correct' ? `<div class="act-feedback-banner feedback-correct">🎉 ${lang === 'te' ? 'చాలా బాగు! +10 ⭐' : 'Well done! +10 ⭐'}</div>` : ''}
          ${oddResult === 'wrong' ? `<div class="act-feedback-banner feedback-wrong">💡 ${lang === 'te' ? `సరైన జవాబు: "${round.words[round.oddIndex]}"` : `The odd one was: "${round.words[round.oddIndex]}"`}</div>` : ''}

          ${oddResult !== null ? `
            <div class="act-next-row">
              <button id="act-odd-next" class="btn btn-primary" style="min-width:160px;">
                ${oddIdx + 1 >= oddShuffled.length ? '🏆 Play Again' : (lang === 'te' ? 'తదుపరి →' : 'Next →')}
              </button>
            </div>` : ''}

          <div class="act-round-indicator">${lang === 'te' ? 'స్థాయి' : 'Round'} ${(oddIdx % oddShuffled.length) + 1} / ${oddShuffled.length}</div>
        </div>
      </div>
    `;
  }

  // ---- ACTIVITY 3: Spell It! ----
  function renderSpellIt() {
    const item = spellShuffled[spellIdx % spellShuffled.length];
    if (!spellShuffledLetters.length) {
      spellShuffledLetters = [...item.allLetters].sort(() => Math.random() - 0.5);
    }
    const progress = spellIdx % spellShuffled.length;
    const total = spellShuffled.length;
    const percent = Math.round((progress / total) * 100);

    const slots = item.parts.map((p, i) => {
      const filled = spellSelected[i] || '';
      return `<span class="spell-slot ${filled ? 'filled' : ''}">${filled || '—'}</span>`;
    }).join('');

    return `
      <div class="act-game-wrap">
        <div class="act-game-header">
          <button id="act-game-back" class="act-back-pill">← ${lang === 'te' ? 'ఆటలు' : 'Activities'}</button>
          <div class="act-progress-bar-wrap"><div class="act-progress-bar" style="width:${percent}%"></div></div>
          <div class="act-score-pill">⭐ ${score}</div>
        </div>
        <div class="act-game-body">
          <div class="act-game-title">✍️ ${lang === 'te' ? 'పదాన్ని రాయండి!' : 'Spell the word!'}</div>

          <div class="spell-listen-card">
            <button class="spell-big-listen-btn" id="spell-listen-btn">🔊 <span>${lang === 'te' ? 'వినండి' : 'Listen'}</span></button>
            <div class="spell-meaning">${item.meaning}</div>
          </div>

          <div class="spell-slots-row">${slots}</div>

          ${spellSelected.length > 0 && spellResult === null ? `
            <div style="text-align:center;margin-bottom:10px;">
              <button id="spell-backspace" class="act-back-pill">⌫ ${lang === 'te' ? 'తొలగించు' : 'Delete'}</button>
            </div>` : ''}

          ${spellResult === 'correct' ? `<div class="act-feedback-banner feedback-correct">🎉 ${lang === 'te' ? 'అద్భుతం! సరైన స్పెల్లింగ్!' : 'Excellent! Perfect spelling!'}</div>` : ''}
          ${spellResult === 'wrong' ? `<div class="act-feedback-banner feedback-wrong">💡 ${lang === 'te' ? `సరైన పదం: "${item.word}"` : `Correct: "${item.word}"`}</div>` : ''}

          ${spellResult === null ? `
            <div class="spell-tiles-row">
              ${spellShuffledLetters.map((letter, i) => `
                <button class="spell-tile" data-letter="${letter}" data-tile-idx="${i}">${letter}</button>
              `).join('')}
            </div>` : ''}

          ${spellResult === null && spellSelected.length === item.parts.length ? `
            <div class="act-next-row">
              <button id="spell-check-btn" class="btn btn-primary" style="min-width:160px;">✅ ${lang === 'te' ? 'తనిఖీ చేయి' : 'Check!'}</button>
            </div>` : ''}

          ${spellResult !== null ? `
            <div class="act-next-row">
              <button id="spell-next-btn" class="btn btn-primary" style="min-width:160px;">
                ${spellIdx + 1 >= spellShuffled.length ? '🏆 Play Again' : (lang === 'te' ? 'తదుపరి →' : 'Next →')}
              </button>
            </div>` : ''}

          <div class="act-round-indicator">${lang === 'te' ? 'స్థాయి' : 'Round'} ${(spellIdx % spellShuffled.length) + 1} / ${spellShuffled.length}</div>
        </div>
      </div>
    `;
  }

  // ---- ACTIVITY 4: Listen & Repeat ----
  function renderListenRepeat() {
    const item = LISTEN_WORDS[listenIdx % LISTEN_WORDS.length];
    const progress = listenIdx % LISTEN_WORDS.length;
    const total = LISTEN_WORDS.length;
    const percent = Math.round((progress / total) * 100);

    return `
      <div class="act-game-wrap">
        <div class="act-game-header">
          <button id="act-game-back" class="act-back-pill">← ${lang === 'te' ? 'ఆటలు' : 'Activities'}</button>
          <div class="act-progress-bar-wrap"><div class="act-progress-bar" style="width:${percent}%"></div></div>
          <div class="act-score-pill">⭐ ${score}</div>
        </div>
        <div class="act-game-body">
          <div class="act-game-title">👂 ${lang === 'te' ? 'వినండి మరియు చెప్పండి!' : 'Listen & Say Aloud!'}</div>
          <div class="act-game-subtitle">${lang === 'te' ? 'వినండి → పైకి చెప్పండి → ఉపాధ్యాయుడు ✅ లేదా ❌ నొక్కండి' : 'Listen → Say aloud → Teacher marks ✅ or ❌'}</div>

          <div class="listen-word-card ${listenPlaying ? 'listen-playing' : ''}">
            <div class="listen-telugu-word">${item.word}</div>
            <div class="listen-meaning">${item.meaning}</div>
          </div>

          <div style="text-align:center;margin:20px 0;">
            <button id="listen-speak-btn" class="listen-big-btn ${listenPlaying ? 'btn-playing' : ''}">
              <span class="listen-btn-icon">${listenPlaying ? '🔊' : '▶️'}</span>
              <span>${listenPlaying ? (lang === 'te' ? 'వింటున్నారు...' : 'Playing...') : (lang === 'te' ? 'వినండి' : 'Listen')}</span>
            </button>
          </div>

          <div style="text-align:center;font-size:0.88rem;color:var(--text-muted);margin-bottom:12px;">
            ${lang === 'te' ? 'విద్యార్థి సరిగ్గా చెప్పాడా?' : 'Did the student say it correctly?'}
          </div>
          <div class="listen-mark-row">
            <button id="listen-correct-btn" class="listen-mark-btn mark-correct ${listenMarked === 'correct' ? 'marked' : ''}">
              ✅ ${lang === 'te' ? 'సరైనది' : 'Correct'}
            </button>
            <button id="listen-wrong-btn" class="listen-mark-btn mark-wrong ${listenMarked === 'wrong' ? 'marked' : ''}">
              ❌ ${lang === 'te' ? 'తప్పు' : 'Wrong'}
            </button>
          </div>

          ${listenMarked ? `
            <div class="act-feedback-banner ${listenMarked === 'correct' ? 'feedback-correct' : 'feedback-wrong'}" style="margin-top:16px;">
              ${listenMarked === 'correct' ? `🎉 ${lang === 'te' ? 'అద్భుతం!' : 'Excellent!'} +10 ⭐` : `💪 ${lang === 'te' ? 'మళ్ళీ ప్రయత్నించు!' : 'Keep practicing!'}`}
            </div>
            <div class="act-next-row">
              <button id="listen-next-btn" class="btn btn-primary" style="min-width:160px;">
                ${listenIdx + 1 >= LISTEN_WORDS.length ? '🏆 Play Again' : (lang === 'te' ? 'తదుపరి →' : 'Next →')}
              </button>
            </div>` : ''}

          <div class="act-round-indicator">${lang === 'te' ? 'పదం' : 'Word'} ${(listenIdx % LISTEN_WORDS.length) + 1} / ${LISTEN_WORDS.length}</div>
        </div>
      </div>
    `;
  }

  // ---- MAIN RENDER ----
  function render() {
    stopSpeech();
    let html = '';
    if (!activeActivity) html = renderHome();
    else if (activeActivity === 'imgmatch') html = renderImageWordMatch();
    else if (activeActivity === 'odd') html = renderOddOneOut();
    else if (activeActivity === 'spell') html = renderSpellIt();
    else if (activeActivity === 'listen') html = renderListenRepeat();

    container.innerHTML = `<div class="activities-root">${html}</div>`;
    attachEvents();
  }

  function attachEvents() {
    // Common: back to home from any game
    const gameBackBtn = container.querySelector('#act-game-back');
    if (gameBackBtn) {
      gameBackBtn.onclick = () => {
        stopSpeech();
        activeActivity = null;
        imgMatchResult = null; imgMatchShuffledOptions = [];
        oddResult = null;
        spellResult = null; spellSelected = []; spellShuffledLetters = [];
        listenMarked = null; listenPlaying = false;
        render();
      };
    }

    // Home: back to app
    const actBackBtn = container.querySelector('#act-back-btn');
    if (actBackBtn) actBackBtn.onclick = () => { stopSpeech(); onBack(); };

    // Home: launch activities
    const imgBtn = container.querySelector('#act-btn-imgmatch');
    if (imgBtn) imgBtn.onclick = () => {
      activeActivity = 'imgmatch'; imgMatchIdx = 0; imgMatchResult = null;
      imgMatchShuffledOptions = [];
      imgMatchShuffled = [...IMAGE_WORD_PAIRS].sort(() => Math.random() - 0.5);
      render();
    };

    const oddBtn = container.querySelector('#act-btn-oddout');
    if (oddBtn) oddBtn.onclick = () => {
      activeActivity = 'odd'; oddIdx = 0; oddResult = null;
      oddShuffled = [...ODD_ONE_OUT_ROUNDS].sort(() => Math.random() - 0.5);
      render();
    };

    const spellBtn = container.querySelector('#act-btn-spell');
    if (spellBtn) spellBtn.onclick = () => {
      activeActivity = 'spell'; spellIdx = 0; spellResult = null;
      spellSelected = []; spellShuffledLetters = [];
      spellShuffled = [...SPELL_IT_WORDS].sort(() => Math.random() - 0.5);
      render();
    };

    const listenBtn = container.querySelector('#act-btn-listen');
    if (listenBtn) listenBtn.onclick = () => {
      activeActivity = 'listen'; listenIdx = 0; listenMarked = null; listenPlaying = false;
      render();
    };

    // ---- Image-Word Match ----
    if (activeActivity === 'imgmatch') {
      const item = imgMatchShuffled[imgMatchIdx % imgMatchShuffled.length];
      const speakBtn = container.querySelector('#act-img-speak-btn');
      if (speakBtn) speakBtn.onclick = () => speakTeluguText(item.word, { rate: 0.82 });
      setTimeout(() => speakTeluguText(item.word, { rate: 0.82 }), 400);

      container.querySelectorAll('.act-option-btn').forEach(btn => {
        btn.onclick = () => {
          if (imgMatchResult) return;
          const chosen = btn.dataset.option;
          const isCorrect = chosen === item.word;
          imgMatchResult = isCorrect ? 'correct' : 'wrong';
          recordAnswer(isCorrect);
          render();
          setTimeout(() => speakTeluguText(item.word, { rate: 0.8 }), 300);
        };
      });

      const nextBtn = container.querySelector('#act-img-next');
      if (nextBtn) nextBtn.onclick = () => {
        imgMatchIdx++;
        if (imgMatchIdx >= imgMatchShuffled.length) {
          imgMatchShuffled = [...IMAGE_WORD_PAIRS].sort(() => Math.random() - 0.5);
          imgMatchIdx = 0;
        }
        imgMatchResult = null; imgMatchShuffledOptions = [];
        render();
      };
    }

    // ---- Odd One Out ----
    if (activeActivity === 'odd') {
      const round = oddShuffled[oddIdx % oddShuffled.length];
      container.querySelectorAll('.act-odd-btn').forEach(btn => {
        btn.onclick = () => {
          if (oddResult) return;
          const i = parseInt(btn.dataset.idx, 10);
          const isCorrect = i === round.oddIndex;
          oddResult = isCorrect ? 'correct' : 'wrong';
          recordAnswer(isCorrect);
          speakTeluguText(round.words[round.oddIndex], { rate: 0.8 });
          render();
        };
      });

      const nextBtn = container.querySelector('#act-odd-next');
      if (nextBtn) nextBtn.onclick = () => {
        oddIdx++;
        if (oddIdx >= oddShuffled.length) {
          oddShuffled = [...ODD_ONE_OUT_ROUNDS].sort(() => Math.random() - 0.5);
          oddIdx = 0;
        }
        oddResult = null;
        render();
      };
    }

    // ---- Spell It ----
    if (activeActivity === 'spell') {
      const item = spellShuffled[spellIdx % spellShuffled.length];
      const listenSpellBtn = container.querySelector('#spell-listen-btn');
      if (listenSpellBtn) listenSpellBtn.onclick = () => speakTeluguText(item.word, { rate: 0.75 });
      setTimeout(() => speakTeluguText(item.word, { rate: 0.75 }), 400);

      container.querySelectorAll('.spell-tile').forEach(tile => {
        tile.onclick = () => {
          if (spellResult) return;
          const letter = tile.dataset.letter;
          spellSelected.push(letter);
          tile.disabled = true; tile.style.opacity = '0.4';
          render();
        };
      });

      const backspace = container.querySelector('#spell-backspace');
      if (backspace) backspace.onclick = () => {
        spellSelected.pop();
        render();
      };

      const checkBtn = container.querySelector('#spell-check-btn');
      if (checkBtn) checkBtn.onclick = () => {
        const typed = spellSelected.join('');
        const isCorrect = typed === item.word;
        spellResult = isCorrect ? 'correct' : 'wrong';
        recordAnswer(isCorrect);
        if (isCorrect) speakTeluguText(item.word, { rate: 0.8 });
        render();
      };

      const nextSpellBtn = container.querySelector('#spell-next-btn');
      if (nextSpellBtn) nextSpellBtn.onclick = () => {
        spellIdx++;
        if (spellIdx >= spellShuffled.length) {
          spellShuffled = [...SPELL_IT_WORDS].sort(() => Math.random() - 0.5);
          spellIdx = 0;
        }
        spellResult = null; spellSelected = []; spellShuffledLetters = [];
        render();
      };
    }

    // ---- Listen & Repeat ----
    if (activeActivity === 'listen') {
      const item = LISTEN_WORDS[listenIdx % LISTEN_WORDS.length];

      const speakBtn = container.querySelector('#listen-speak-btn');
      if (speakBtn) speakBtn.onclick = () => {
        listenPlaying = true; render();
        speakTeluguText(item.word, { rate: 0.75, onEnd: () => { listenPlaying = false; render(); } });
      };

      const correctBtn = container.querySelector('#listen-correct-btn');
      if (correctBtn) correctBtn.onclick = () => {
        if (listenMarked) return;
        listenMarked = 'correct'; recordAnswer(true); render();
      };

      const wrongBtn = container.querySelector('#listen-wrong-btn');
      if (wrongBtn) wrongBtn.onclick = () => {
        if (listenMarked) return;
        listenMarked = 'wrong'; recordAnswer(false); render();
      };

      const nextListenBtn = container.querySelector('#listen-next-btn');
      if (nextListenBtn) nextListenBtn.onclick = () => {
        listenIdx++;
        if (listenIdx >= LISTEN_WORDS.length) listenIdx = 0;
        listenMarked = null; listenPlaying = false;
        render();
        setTimeout(() => speakTeluguText(LISTEN_WORDS[listenIdx % LISTEN_WORDS.length].word, { rate: 0.78 }), 500);
      };

      // Auto-play
      setTimeout(() => speakTeluguText(item.word, { rate: 0.78 }), 500);
    }
  }

  render();
}
