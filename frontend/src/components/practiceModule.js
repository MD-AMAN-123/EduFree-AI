// EduFree.AI Bilingual Targeted Practice & Literacy Center (Telugu & English FLN)
import { t, getLanguage } from '../data/i18n.js';
import {
  TELUGU_LEVELS,
  TELUGU_LETTERS,
  TELUGU_GUNINTHALU_FAMILIES,
  TELUGU_SIMPLE_WORDS,
  TELUGU_OTTULU_WORDS,
  TELUGU_PASSAGES
} from '../data/teluguContent.js';
import {
  ENGLISH_LEVELS,
  ENGLISH_LETTERS,
  ENGLISH_BLENDS_FAMILIES,
  ENGLISH_SIMPLE_WORDS,
  ENGLISH_COMPLEX_WORDS,
  ENGLISH_PASSAGES
} from '../data/englishContent.js';
import { speakTeluguText, speakEnglishText, stopSpeech, playTone } from '../utils/speechAudio.js';
import { putInStore } from '../storage/db.js';
import { generateId } from '../utils/helpers.js';
import { icon } from '../utils/icons.js';

export function renderPractice(container, { studentId = null, initialLevelId = 'level_1_letters', initialLanguage = 'te', onBack, onOpenActivities }) {
  const lang = getLanguage();
  let practiceLanguage = initialLanguage || 'te'; // 'te' | 'en'
  let activeLevelId = initialLevelId;

  // Navigation indices for Telugu modes
  let teLetterIndex = 0;
  let teGuninthamFamilyIndex = 0;
  let teSimpleWordIndex = 0;
  let teOttuluIndex = 0;

  // Navigation indices for English modes
  let enLetterIndex = 0;
  let enBlendFamilyIndex = 0;
  let enSimpleWordIndex = 0;
  let enComplexWordIndex = 0;

  // Read-along story playback
  let readAlongWordIdx = 0;
  let isStoryPlaying = false;

  function render() {
    const currentLevels = practiceLanguage === 'en' ? ENGLISH_LEVELS : TELUGU_LEVELS;

    container.innerHTML = `
      <div style="max-width: 800px; margin: 0 auto;">
        <!-- Practice Header & Language Selector -->
        <div class="card" style="margin-bottom: 16px; padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
            <h2 class="card-title" style="font-size: 1.25rem;">
              <span>${icon('practice', { size: 20 })}</span> ${t('practice_title')}
            </h2>
            <div style="display: flex; gap: 8px; align-items: center;">
              ${onOpenActivities ? `
                <button id="btn-practice-goto-activities" class="btn btn-accent btn-sm" style="font-weight: 700; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);">
                  <span>${icon('activities', { size: 16 })}</span> ${lang === 'te' ? 'సరదా కృత్యాలు' : 'Activities'}
                </button>
              ` : ''}
              <button id="btn-practice-back" class="btn btn-outline btn-sm">
                ← ${t('btn_back_dashboard')}
              </button>
            </div>
          </div>

          <!-- Bilingual Language Switcher Tabs -->
          <div style="display: flex; gap: 8px; margin-bottom: 12px; align-items: center; flex-wrap: wrap;">
            <span style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted);">${t('practice_lang_label')}</span>
            <div style="display: flex; gap: 6px;">
              <button id="btn-practice-lang-te" class="btn btn-sm ${practiceLanguage === 'te' ? 'btn-primary' : 'btn-outline'}" style="font-size: 0.82rem; padding: 4px 12px; font-weight: 700;">
                🇮🇳 తెలుగు సాధన (Telugu)
              </button>
              <button id="btn-practice-lang-en" class="btn btn-sm ${practiceLanguage === 'en' ? 'btn-primary' : 'btn-outline'}" style="font-size: 0.82rem; padding: 4px 12px; font-weight: 700;">
                🇬🇧 English Practice (ఆంగ్లం)
              </button>
            </div>
          </div>

          <!-- 5 Skill Level Switcher Pills -->
          <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;">
            ${currentLevels.map((lvl) => `
              <button 
                class="btn btn-sm ${lvl.id === activeLevelId ? 'btn-primary' : 'btn-outline'} practice-lvl-btn" 
                data-level-id="${lvl.id}"
                style="white-space: nowrap; font-size: 0.82rem;"
              >
                ${lang === 'te' ? lvl.name_te : lvl.name_en}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Dynamic Practice Content Area -->
        <div id="practice-interactive-canvas">
          ${renderActivePracticeMode()}
        </div>
      </div>
    `;

    // Language Toggle Click Handlers
    container.querySelector('#btn-practice-lang-te').onclick = () => {
      if (practiceLanguage !== 'te') {
        stopSpeech();
        practiceLanguage = 'te';
        isStoryPlaying = false;
        render();
      }
    };

    container.querySelector('#btn-practice-lang-en').onclick = () => {
      if (practiceLanguage !== 'en') {
        stopSpeech();
        practiceLanguage = 'en';
        isStoryPlaying = false;
        render();
      }
    };

    // Attach level tab switches
    container.querySelectorAll('.practice-lvl-btn').forEach((btn) => {
      btn.onclick = () => {
        stopSpeech();
        activeLevelId = btn.dataset.levelId;
        isStoryPlaying = false;
        render();
      };
    });

    container.querySelector('#btn-practice-back').onclick = () => {
      stopSpeech();
      onBack();
    };

    const actBtn = container.querySelector('#btn-practice-goto-activities');
    if (actBtn && onOpenActivities) {
      actBtn.onclick = () => {
        stopSpeech();
        onOpenActivities();
      };
    }

    attachModeInteractions();
  }

  function renderActivePracticeMode() {
    if (activeLevelId === 'level_1_letters') {
      return practiceLanguage === 'en' ? renderEnglishLettersMode() : renderTeluguLettersMode();
    } else if (activeLevelId === 'level_2_guninthalu') {
      return practiceLanguage === 'en' ? renderEnglishBlendsMode() : renderTeluguGuninthaluMode();
    } else if (activeLevelId === 'level_3_simple_words') {
      return practiceLanguage === 'en' ? renderEnglishSimpleWordsMode() : renderTeluguSimpleWordsMode();
    } else if (activeLevelId === 'level_4_ottulu') {
      return practiceLanguage === 'en' ? renderEnglishComplexWordsMode() : renderTeluguOttuluMode();
    } else {
      return practiceLanguage === 'en' ? renderEnglishReadAlongMode() : renderTeluguReadAlongMode();
    }
  }

  // ==================== TELUGU PRACTICE MODES ====================

  // --- Telugu Mode 1: Letters & Sounds Flashcards ---
  function renderTeluguLettersMode() {
    const item = TELUGU_LETTERS[teLetterIndex];
    return `
      <div class="card" style="text-align: center; padding: 24px;">
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">
          ${t('letter_prefix')} ${teLetterIndex + 1} / ${TELUGU_LETTERS.length} (${item.type === 'vowel' ? t('vowel_type') : t('consonant_type')})
        </div>

        <div class="flashcard-wrap" style="padding: 10px 0;">
          <div class="flashcard" id="letter-flashcard" role="button" tabindex="0" aria-label="Telugu letter ${item.letter}">
            <div class="flashcard-big-telugu">${item.letter}</div>
            <div class="flashcard-word">${item.word}</div>
            <div class="flashcard-meaning">${item.wordMeaning} • /${item.phonetic}/</div>
            <div style="margin-top: 14px; font-size: 0.82rem; color: var(--primary-700); font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 4px;">
              ${icon('volume', { size: 16 })} ${t('tap_listen_pronunciation')}
            </div>
          </div>
        </div>

        <div class="flashcard-nav">
          <button id="btn-prev-letter" class="btn btn-outline" ${teLetterIndex === 0 ? 'disabled' : ''}>
            ← ${t('prev_btn')}
          </button>
          <button id="btn-speak-letter" class="btn btn-accent btn-lg">
            <span>${icon('volume', { size: 18 })}</span> ${t('audio_listen')}
          </button>
          <button id="btn-next-letter" class="btn btn-primary" ${teLetterIndex === TELUGU_LETTERS.length - 1 ? 'disabled' : ''}>
            ${t('next_btn')} →
          </button>
        </div>
      </div>
    `;
  }

  // --- Telugu Mode 2: Interactive Gunintham Wheel / Grid ---
  function renderTeluguGuninthaluMode() {
    const family = TELUGU_GUNINTHALU_FAMILIES[teGuninthamFamilyIndex];
    return `
      <div class="card" style="padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <div>
            <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--primary-900); font-family: var(--font-telugu);">
              ${family.name} ${t('gunintham_practice')}
            </h3>
            <p style="font-size: 0.82rem; color: var(--text-muted);">
              ${t('gunintham_hint')}
            </p>
          </div>
          <!-- Family Switcher -->
          <div style="display: flex; gap: 6px;">
            ${TELUGU_GUNINTHALU_FAMILIES.map((fam, idx) => `
              <button class="btn btn-sm ${idx === teGuninthamFamilyIndex ? 'btn-primary' : 'btn-outline'} btn-fam-select" data-idx="${idx}">
                ${fam.base}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="gunintham-grid">
          ${family.series.map((item, idx) => `
            <div class="gunintham-tile" data-glyph="${item.glyph}" data-sound="${item.sound}">
              <span class="tile-glyph">${item.glyph}</span>
              <span class="tile-sign">${item.sign}</span>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 20px; background: var(--bg-card-subtle); border-radius: var(--radius-md); padding: 14px; text-align: center;">
          <div id="gunintham-active-display" style="font-size: 2.2rem; font-weight: 800; font-family: var(--font-telugu); color: var(--primary-800);">
            ${family.series[0].glyph}
          </div>
          <div id="gunintham-active-label" style="font-size: 0.9rem; color: var(--text-muted);">
            ${family.series[0].sign} (${family.series[0].sound})
          </div>
          <button id="btn-speak-gunintham" class="btn btn-accent btn-sm" style="margin-top: 8px;">
            <span>${icon('volume', { size: 15 })}</span> ${t('listen_sound_btn')}
          </button>
        </div>
      </div>
    `;
  }

  // --- Telugu Mode 3: Simple Words Flashcards & Syllables ---
  function renderTeluguSimpleWordsMode() {
    const item = TELUGU_SIMPLE_WORDS[teSimpleWordIndex];
    return `
      <div class="card" style="text-align: center; padding: 24px;">
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">
          ${t('simple_word_prefix')} ${teSimpleWordIndex + 1} / ${TELUGU_SIMPLE_WORDS.length}
        </div>

        <div class="flashcard-wrap" style="padding: 10px 0;">
          <div class="flashcard" id="simple-word-flashcard">
            <div class="flashcard-big-telugu" style="font-size: 3.8rem;">${item.word}</div>
            <div style="font-size: 1.4rem; color: var(--primary-700); font-weight: 700; margin-top: 6px; font-family: var(--font-telugu);">
              ${item.breakdown}
            </div>
            <div class="flashcard-meaning" style="margin-top: 6px;">
              ${t('meaning_label')} ${item.meaning}
            </div>
          </div>
        </div>

        <div class="flashcard-nav">
          <button id="btn-prev-simple" class="btn btn-outline" ${teSimpleWordIndex === 0 ? 'disabled' : ''}>
            ← ${t('prev_btn')}
          </button>
          <button id="btn-speak-simple" class="btn btn-accent btn-lg">
            <span>${icon('volume', { size: 18 })}</span> ${t('audio_listen')}
          </button>
          <button id="btn-next-simple" class="btn btn-primary" ${teSimpleWordIndex === TELUGU_SIMPLE_WORDS.length - 1 ? 'disabled' : ''}>
            ${t('next_btn')} →
          </button>
        </div>
      </div>
    `;
  }

  // --- Telugu Mode 4: Conjunct Words (Ottulu) ---
  function renderTeluguOttuluMode() {
    const item = TELUGU_OTTULU_WORDS[teOttuluIndex];
    return `
      <div class="card" style="text-align: center; padding: 24px;">
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">
          ${t('stat_ottulu')} ${teOttuluIndex + 1} / ${TELUGU_OTTULU_WORDS.length} (${item.type})
        </div>

        <div class="flashcard-wrap" style="padding: 10px 0;">
          <div class="flashcard" id="ottulu-flashcard" style="border-color: #0284c7;">
            <div class="flashcard-big-telugu" style="font-size: 3.8rem; color: #0284c7;">${item.word}</div>
            <div style="font-size: 1.2rem; color: var(--text-main); font-weight: 700; margin-top: 6px; font-family: var(--font-telugu);">
              ${t('breakdown_label')} ${item.breakdown}
            </div>
            <div class="flashcard-meaning" style="margin-top: 6px;">
              ${t('meaning_label')} ${item.meaning}
            </div>
          </div>
        </div>

        <div class="flashcard-nav">
          <button id="btn-prev-ottulu" class="btn btn-outline" ${teOttuluIndex === 0 ? 'disabled' : ''}>
            ← ${t('prev_btn')}
          </button>
          <button id="btn-speak-ottulu" class="btn btn-accent btn-lg">
            <span>${icon('volume', { size: 18 })}</span> ${t('audio_listen')}
          </button>
          <button id="btn-next-ottulu" class="btn btn-primary" ${teOttuluIndex === TELUGU_OTTULU_WORDS.length - 1 ? 'disabled' : ''}>
            ${t('next_btn')} →
          </button>
        </div>
      </div>
    `;
  }

  // --- Telugu Mode 5: Read-Along Stories with Word Highlighting ---
  function renderTeluguReadAlongMode() {
    const story = TELUGU_PASSAGES[0];
    return `
      <div class="card" style="padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px;">
          <div>
            <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--primary-900); font-family: var(--font-telugu); display: flex; align-items: center; gap: 8px;">
              ${icon('assess', { size: 22, color: 'var(--primary-700)' })} ${lang === 'te' ? story.title_te : story.title_en} (Read-Along)
            </h3>
            <p style="font-size: 0.82rem; color: var(--text-muted);">
              ${t('read_along_hint')}
            </p>
          </div>

          <div style="display: flex; gap: 8px; align-items: center;">
            <button id="btn-toggle-story-audio" class="btn btn-accent btn-lg">
              ${isStoryPlaying ? `⏸️ ${t('pause_btn')}` : `▶️ ${t('read_aloud_btn')}`}
            </button>
          </div>
        </div>

        <!-- Highlightable Story Text Flow -->
        <div class="passage-box" style="margin-bottom: 16px;">
          <div class="words-flow" id="story-words-flow">
            ${story.words.map((w, idx) => `
              <span 
                class="word-chip ${idx === readAlongWordIdx && isStoryPlaying ? 'state-accurate' : ''}" 
                style="${idx === readAlongWordIdx && isStoryPlaying ? 'transform: scale(1.1); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);' : ''}"
                data-idx="${idx}"
              >
                ${w}
              </span>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ==================== ENGLISH PRACTICE MODES ====================

  // --- English Mode 1: Letters & Phonics Sounds ---
  function renderEnglishLettersMode() {
    const item = ENGLISH_LETTERS[enLetterIndex];
    return `
      <div class="card" style="text-align: center; padding: 24px;">
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">
          Letter ${enLetterIndex + 1} / ${ENGLISH_LETTERS.length} (${item.category.toUpperCase()})
        </div>

        <div class="flashcard-wrap" style="padding: 10px 0;">
          <div class="flashcard" id="en-letter-flashcard" role="button" tabindex="0" aria-label="English letter ${item.letter}">
            <div class="flashcard-big-telugu" style="font-size: 4rem; color: var(--primary-800);">${item.letter}</div>
            <div class="flashcard-word" style="font-size: 1.8rem; font-weight: 800;">${item.word}</div>
            <div class="flashcard-meaning" style="font-size: 1.1rem; color: var(--primary-700);">
              /${item.phonetic}/ • ${item.meaning_te}
            </div>
            <div style="font-size: 0.92rem; color: var(--text-muted); margin-top: 6px;">
              "${item.example}"
            </div>
            <div style="margin-top: 14px; font-size: 0.82rem; color: var(--primary-700); font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 4px;">
              ${icon('volume', { size: 16 })} Tap card or button to hear English pronunciation
            </div>
          </div>
        </div>

        <div class="flashcard-nav">
          <button id="btn-prev-en-letter" class="btn btn-outline" ${enLetterIndex === 0 ? 'disabled' : ''}>
            ← ${t('prev_btn')}
          </button>
          <button id="btn-speak-en-letter" class="btn btn-accent btn-lg">
            <span>${icon('volume', { size: 18 })}</span> ${t('audio_listen')}
          </button>
          <button id="btn-next-en-letter" class="btn btn-primary" ${enLetterIndex === ENGLISH_LETTERS.length - 1 ? 'disabled' : ''}>
            ${t('next_btn')} →
          </button>
        </div>
      </div>
    `;
  }

  // --- English Mode 2: Phonics Blends & Digraphs ---
  function renderEnglishBlendsMode() {
    const family = ENGLISH_BLENDS_FAMILIES[enBlendFamilyIndex];
    return `
      <div class="card" style="padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <div>
            <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--primary-900);">
              ${family.name}
            </h3>
            <p style="font-size: 0.82rem; color: var(--text-muted);">
              Tap any blend word to listen to its English sound and see Telugu meaning
            </p>
          </div>
          <!-- Family Switcher -->
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            ${ENGLISH_BLENDS_FAMILIES.map((fam, idx) => `
              <button class="btn btn-sm ${idx === enBlendFamilyIndex ? 'btn-primary' : 'btn-outline'} btn-en-fam-select" data-idx="${idx}">
                ${fam.base}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="gunintham-grid" style="grid-template-columns: repeat(auto-fill, minmax(85px, 1fr));">
          ${family.series.map((item, idx) => `
            <div class="gunintham-tile en-blend-tile" data-glyph="${item.glyph}" data-sound="${item.sound}">
              <span class="tile-glyph" style="font-size: 1.3rem;">${item.glyph}</span>
              <span class="tile-sign" style="font-size: 0.72rem;">${item.sign}</span>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 20px; background: var(--bg-card-subtle); border-radius: var(--radius-md); padding: 14px; text-align: center;">
          <div id="en-blend-active-display" style="font-size: 2.2rem; font-weight: 800; color: var(--primary-800);">
            ${family.series[0].glyph}
          </div>
          <div id="en-blend-active-label" style="font-size: 0.95rem; color: var(--text-muted);">
            ${family.series[0].sign} • ${family.series[0].meaning_te}
          </div>
          <button id="btn-speak-en-blend" class="btn btn-accent btn-sm" style="margin-top: 8px;">
            <span>${icon('volume', { size: 15 })}</span> ${t('listen_sound_btn')}
          </button>
        </div>
      </div>
    `;
  }

  // --- English Mode 3: Simple Words (CVC & Sight Words) ---
  function renderEnglishSimpleWordsMode() {
    const item = ENGLISH_SIMPLE_WORDS[enSimpleWordIndex];
    return `
      <div class="card" style="text-align: center; padding: 24px;">
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">
          Simple Word ${enSimpleWordIndex + 1} / ${ENGLISH_SIMPLE_WORDS.length} (CVC & Sight Words)
        </div>

        <div class="flashcard-wrap" style="padding: 10px 0;">
          <div class="flashcard" id="en-simple-flashcard">
            <div class="flashcard-big-telugu" style="font-size: 3.8rem; font-family: var(--font-sans); font-weight: 800; color: var(--primary-800);">${item.word}</div>
            <div style="font-size: 1.4rem; color: var(--primary-700); font-weight: 700; margin-top: 6px;">
              ${item.breakdown}
            </div>
            <div class="flashcard-meaning" style="margin-top: 6px;">
              ${t('meaning_label')} ${item.meaning}
            </div>
          </div>
        </div>

        <div class="flashcard-nav">
          <button id="btn-prev-en-simple" class="btn btn-outline" ${enSimpleWordIndex === 0 ? 'disabled' : ''}>
            ← ${t('prev_btn')}
          </button>
          <button id="btn-speak-en-simple" class="btn btn-accent btn-lg">
            <span>${icon('volume', { size: 18 })}</span> ${t('audio_listen')}
          </button>
          <button id="btn-next-en-simple" class="btn btn-primary" ${enSimpleWordIndex === ENGLISH_SIMPLE_WORDS.length - 1 ? 'disabled' : ''}>
            ${t('next_btn')} →
          </button>
        </div>
      </div>
    `;
  }

  // --- English Mode 4: Complex Words & Consonant Clusters ---
  function renderEnglishComplexWordsMode() {
    const item = ENGLISH_COMPLEX_WORDS[enComplexWordIndex];
    return `
      <div class="card" style="text-align: center; padding: 24px;">
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">
          Complex Word ${enComplexWordIndex + 1} / ${ENGLISH_COMPLEX_WORDS.length} (Clusters & Multi-Syllable)
        </div>

        <div class="flashcard-wrap" style="padding: 10px 0;">
          <div class="flashcard" id="en-complex-flashcard" style="border-color: #0284c7;">
            <div class="flashcard-big-telugu" style="font-size: 3.8rem; font-family: var(--font-sans); font-weight: 800; color: #0284c7;">${item.word}</div>
            <div style="font-size: 1.3rem; color: var(--text-main); font-weight: 700; margin-top: 6px;">
              ${item.breakdown}
            </div>
            <div class="flashcard-meaning" style="margin-top: 6px;">
              ${t('meaning_label')} ${item.meaning} (${item.hint_te})
            </div>
          </div>
        </div>

        <div class="flashcard-nav">
          <button id="btn-prev-en-complex" class="btn btn-outline" ${enComplexWordIndex === 0 ? 'disabled' : ''}>
            ← ${t('prev_btn')}
          </button>
          <button id="btn-speak-en-complex" class="btn btn-accent btn-lg">
            <span>${icon('volume', { size: 18 })}</span> ${t('audio_listen')}
          </button>
          <button id="btn-next-en-complex" class="btn btn-primary" ${enComplexWordIndex === ENGLISH_COMPLEX_WORDS.length - 1 ? 'disabled' : ''}>
            ${t('next_btn')} →
          </button>
        </div>
      </div>
    `;
  }

  // --- English Mode 5: English Read-Along Story ---
  function renderEnglishReadAlongMode() {
    const story = ENGLISH_PASSAGES[0];
    return `
      <div class="card" style="padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px;">
          <div>
            <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--primary-900); display: flex; align-items: center; gap: 8px;">
              ${icon('assess', { size: 22, color: 'var(--primary-700)' })} ${story.title_en} (Read-Along)
            </h3>
            <p style="font-size: 0.82rem; color: var(--text-muted);">
              Listen to natural English voice while words highlight in sync
            </p>
          </div>

          <div style="display: flex; gap: 8px; align-items: center;">
            <button id="btn-toggle-en-story-audio" class="btn btn-accent btn-lg">
              ${isStoryPlaying ? `⏸️ ${t('pause_btn')}` : `▶️ ${t('read_aloud_btn')}`}
            </button>
          </div>
        </div>

        <!-- Highlightable Story Text Flow -->
        <div class="passage-box" style="margin-bottom: 16px;">
          <div class="words-flow" id="en-story-words-flow">
            ${story.words.map((w, idx) => `
              <span 
                class="word-chip ${idx === readAlongWordIdx && isStoryPlaying ? 'state-accurate' : ''}" 
                style="${idx === readAlongWordIdx && isStoryPlaying ? 'transform: scale(1.1); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);' : ''}"
                data-idx="${idx}"
              >
                ${w}
              </span>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ==================== MODE INTERACTIONS ====================

  function attachModeInteractions() {
    if (practiceLanguage === 'en') {
      attachEnglishInteractions();
    } else {
      attachTeluguInteractions();
    }
  }

  function attachEnglishInteractions() {
    // Mode 1: English Letters
    if (activeLevelId === 'level_1_letters') {
      const item = ENGLISH_LETTERS[enLetterIndex];
      const speak = () => {
        const speakBtn = container.querySelector('#btn-speak-en-letter');
        const card = container.querySelector('#en-letter-flashcard');
        if (speakBtn) speakBtn.style.opacity = '0.8';
        if (card) {
          card.style.borderColor = 'var(--primary-500)';
          card.style.boxShadow = '0 0 18px rgba(16, 185, 129, 0.4)';
        }
        speakEnglishText(`${item.letter}. ${item.word}. ${item.example}`, {
          rate: 0.88,
          onEnd: () => {
            if (speakBtn) speakBtn.style.opacity = '1';
            if (card) {
              card.style.borderColor = '';
              card.style.boxShadow = '';
            }
          }
        });
      };

      const card = container.querySelector('#en-letter-flashcard');
      if (card) card.onclick = speak;

      const speakBtn = container.querySelector('#btn-speak-en-letter');
      if (speakBtn) speakBtn.onclick = speak;

      const prevBtn = container.querySelector('#btn-prev-en-letter');
      if (prevBtn) prevBtn.onclick = () => { if (enLetterIndex > 0) { enLetterIndex--; render(); } };

      const nextBtn = container.querySelector('#btn-next-en-letter');
      if (nextBtn) nextBtn.onclick = () => { if (enLetterIndex < ENGLISH_LETTERS.length - 1) { enLetterIndex++; render(); } };
    }

    // Mode 2: English Blends
    else if (activeLevelId === 'level_2_guninthalu') {
      const family = ENGLISH_BLENDS_FAMILIES[enBlendFamilyIndex];
      let selectedGlyph = family.series[0].glyph;

      container.querySelectorAll('.btn-en-fam-select').forEach((btn) => {
        btn.onclick = () => {
          enBlendFamilyIndex = parseInt(btn.dataset.idx, 10);
          render();
        };
      });

      container.querySelectorAll('.en-blend-tile').forEach((tile) => {
        tile.onclick = () => {
          const glyph = tile.dataset.glyph;
          selectedGlyph = glyph;
          tile.style.transform = 'scale(1.08)';
          setTimeout(() => { tile.style.transform = ''; }, 200);

          speakEnglishText(glyph, { rate: 0.85 });

          const disp = container.querySelector('#en-blend-active-display');
          const lbl = container.querySelector('#en-blend-active-label');
          if (disp) disp.textContent = glyph;
          if (lbl) lbl.textContent = tile.querySelector('.tile-sign').textContent;
        };
      });

      const speakBlendBtn = container.querySelector('#btn-speak-en-blend');
      if (speakBlendBtn) {
        speakBlendBtn.onclick = () => {
          speakBlendBtn.style.opacity = '0.8';
          speakEnglishText(selectedGlyph, {
            rate: 0.85,
            onEnd: () => { speakBlendBtn.style.opacity = '1'; }
          });
        };
      }
    }

    // Mode 3: English Simple Words
    else if (activeLevelId === 'level_3_simple_words') {
      const item = ENGLISH_SIMPLE_WORDS[enSimpleWordIndex];
      const speak = () => {
        const speakBtn = container.querySelector('#btn-speak-en-simple');
        const card = container.querySelector('#en-simple-flashcard');
        if (speakBtn) speakBtn.style.opacity = '0.8';
        if (card) card.style.borderColor = 'var(--primary-500)';

        speakEnglishText(item.word, {
          rate: 0.85,
          onEnd: () => {
            if (speakBtn) speakBtn.style.opacity = '1';
            if (card) card.style.borderColor = '';
          }
        });
      };

      const card = container.querySelector('#en-simple-flashcard');
      if (card) card.onclick = speak;

      const speakBtn = container.querySelector('#btn-speak-en-simple');
      if (speakBtn) speakBtn.onclick = speak;

      const prevBtn = container.querySelector('#btn-prev-en-simple');
      if (prevBtn) prevBtn.onclick = () => { if (enSimpleWordIndex > 0) { enSimpleWordIndex--; render(); } };

      const nextBtn = container.querySelector('#btn-next-en-simple');
      if (nextBtn) nextBtn.onclick = () => { if (enSimpleWordIndex < ENGLISH_SIMPLE_WORDS.length - 1) { enSimpleWordIndex++; render(); } };
    }

    // Mode 4: English Complex Words
    else if (activeLevelId === 'level_4_ottulu') {
      const item = ENGLISH_COMPLEX_WORDS[enComplexWordIndex];
      const speak = () => {
        const speakBtn = container.querySelector('#btn-speak-en-complex');
        const card = container.querySelector('#en-complex-flashcard');
        if (speakBtn) speakBtn.style.opacity = '0.8';
        if (card) card.style.borderColor = '#0284c7';

        speakEnglishText(item.word, {
          rate: 0.85,
          onEnd: () => {
            if (speakBtn) speakBtn.style.opacity = '1';
            if (card) card.style.borderColor = '';
          }
        });
      };

      const card = container.querySelector('#en-complex-flashcard');
      if (card) card.onclick = speak;

      const speakBtn = container.querySelector('#btn-speak-en-complex');
      if (speakBtn) speakBtn.onclick = speak;

      const prevBtn = container.querySelector('#btn-prev-en-complex');
      if (prevBtn) prevBtn.onclick = () => { if (enComplexWordIndex > 0) { enComplexWordIndex--; render(); } };

      const nextBtn = container.querySelector('#btn-next-en-complex');
      if (nextBtn) nextBtn.onclick = () => { if (enComplexWordIndex < ENGLISH_COMPLEX_WORDS.length - 1) { enComplexWordIndex++; render(); } };
    }

    // Mode 5: English Read-Along
    else if (activeLevelId === 'level_5_passages') {
      const story = ENGLISH_PASSAGES[0];
      const toggleBtn = container.querySelector('#btn-toggle-en-story-audio');

      if (toggleBtn) {
        toggleBtn.onclick = () => {
          if (isStoryPlaying) {
            stopSpeech();
            isStoryPlaying = false;
            render();
          } else {
            isStoryPlaying = true;
            readAlongWordIdx = 0;
            render();
            playNextEnStoryWord(story);
          }
        };
      }
    }
  }

  function playNextEnStoryWord(story) {
    if (!isStoryPlaying || readAlongWordIdx >= story.words.length) {
      isStoryPlaying = false;
      playTone('complete');
      render();
      return;
    }

    const currentWord = story.words[readAlongWordIdx];
    speakEnglishText(currentWord, {
      rate: 0.85,
      onEnd: () => {
        readAlongWordIdx++;
        container.querySelectorAll('#en-story-words-flow .word-chip').forEach((chip, i) => {
          if (i === readAlongWordIdx) {
            chip.className = 'word-chip state-accurate';
            chip.style.transform = 'scale(1.1)';
          } else {
            chip.className = 'word-chip';
            chip.style.transform = 'none';
          }
        });
        if (isStoryPlaying) {
          setTimeout(() => playNextEnStoryWord(story), 220);
        }
      }
    });
  }

  function attachTeluguInteractions() {
    // Mode 1: Letters
    if (activeLevelId === 'level_1_letters') {
      const item = TELUGU_LETTERS[teLetterIndex];
      const speak = () => {
        const speakBtn = container.querySelector('#btn-speak-letter');
        const card = container.querySelector('#letter-flashcard');
        if (speakBtn) {
          speakBtn.style.opacity = '0.8';
          speakBtn.style.transform = 'scale(0.97)';
        }
        if (card) {
          card.style.borderColor = 'var(--primary-500)';
          card.style.boxShadow = '0 0 18px rgba(16, 185, 129, 0.4)';
        }
        speakTeluguText(`${item.letter} ... ${item.word}`, {
          rate: 0.88,
          phonetic: item.phonetic,
          onEnd: () => {
            if (speakBtn) {
              speakBtn.style.opacity = '1';
              speakBtn.style.transform = 'none';
            }
            if (card) {
              card.style.borderColor = '';
              card.style.boxShadow = '';
            }
          }
        });
      };

      const card = container.querySelector('#letter-flashcard');
      if (card) card.onclick = speak;

      const speakBtn = container.querySelector('#btn-speak-letter');
      if (speakBtn) speakBtn.onclick = speak;

      const prevBtn = container.querySelector('#btn-prev-letter');
      if (prevBtn) prevBtn.onclick = () => { if (teLetterIndex > 0) { teLetterIndex--; render(); } };

      const nextBtn = container.querySelector('#btn-next-letter');
      if (nextBtn) nextBtn.onclick = () => { if (teLetterIndex < TELUGU_LETTERS.length - 1) { teLetterIndex++; render(); } };
    }

    // Mode 2: Guninthalu
    else if (activeLevelId === 'level_2_guninthalu') {
      const family = TELUGU_GUNINTHALU_FAMILIES[teGuninthamFamilyIndex];
      let selectedGlyph = family.series[0].glyph;

      container.querySelectorAll('.btn-fam-select').forEach((btn) => {
        btn.onclick = () => {
          teGuninthamFamilyIndex = parseInt(btn.dataset.idx, 10);
          render();
        };
      });

      container.querySelectorAll('.gunintham-tile').forEach((tile) => {
        tile.onclick = () => {
          const glyph = tile.dataset.glyph;
          selectedGlyph = glyph;
          tile.style.transform = 'scale(1.08)';
          setTimeout(() => { tile.style.transform = ''; }, 200);

          speakTeluguText(glyph, { rate: 0.8 });

          const disp = container.querySelector('#gunintham-active-display');
          const lbl = container.querySelector('#gunintham-active-label');
          if (disp) disp.textContent = glyph;
          if (lbl) lbl.textContent = tile.querySelector('.tile-sign').textContent;
        };
      });

      const speakGuninthamBtn = container.querySelector('#btn-speak-gunintham');
      if (speakGuninthamBtn) {
        speakGuninthamBtn.onclick = () => {
          speakGuninthamBtn.style.opacity = '0.8';
          speakTeluguText(selectedGlyph, {
            rate: 0.8,
            onEnd: () => { speakGuninthamBtn.style.opacity = '1'; }
          });
        };
      }
    }

    // Mode 3: Simple Words
    else if (activeLevelId === 'level_3_simple_words') {
      const item = TELUGU_SIMPLE_WORDS[teSimpleWordIndex];
      const speak = () => {
        const speakBtn = container.querySelector('#btn-speak-simple');
        const card = container.querySelector('#simple-word-flashcard');
        if (speakBtn) speakBtn.style.opacity = '0.8';
        if (card) card.style.borderColor = 'var(--primary-500)';

        speakTeluguText(item.word, {
          rate: 0.85,
          onEnd: () => {
            if (speakBtn) speakBtn.style.opacity = '1';
            if (card) card.style.borderColor = '';
          }
        });
      };

      const card = container.querySelector('#simple-word-flashcard');
      if (card) card.onclick = speak;

      const speakBtn = container.querySelector('#btn-speak-simple');
      if (speakBtn) speakBtn.onclick = speak;

      const prevBtn = container.querySelector('#btn-prev-simple');
      if (prevBtn) prevBtn.onclick = () => { if (teSimpleWordIndex > 0) { teSimpleWordIndex--; render(); } };

      const nextBtn = container.querySelector('#btn-next-simple');
      if (nextBtn) nextBtn.onclick = () => { if (teSimpleWordIndex < TELUGU_SIMPLE_WORDS.length - 1) { teSimpleWordIndex++; render(); } };
    }

    // Mode 4: Ottulu
    else if (activeLevelId === 'level_4_ottulu') {
      const item = TELUGU_OTTULU_WORDS[teOttuluIndex];
      const speak = () => {
        const speakBtn = container.querySelector('#btn-speak-ottulu');
        const card = container.querySelector('#ottulu-flashcard');
        if (speakBtn) speakBtn.style.opacity = '0.8';
        if (card) card.style.borderColor = '#0284c7';

        speakTeluguText(item.word, {
          rate: 0.85,
          onEnd: () => {
            if (speakBtn) speakBtn.style.opacity = '1';
            if (card) card.style.borderColor = '';
          }
        });
      };

      const card = container.querySelector('#ottulu-flashcard');
      if (card) card.onclick = speak;

      const speakBtn = container.querySelector('#btn-speak-ottulu');
      if (speakBtn) speakBtn.onclick = speak;

      const prevBtn = container.querySelector('#btn-prev-ottulu');
      if (prevBtn) prevBtn.onclick = () => { if (teOttuluIndex > 0) { teOttuluIndex--; render(); } };

      const nextBtn = container.querySelector('#btn-next-ottulu');
      if (nextBtn) nextBtn.onclick = () => { if (teOttuluIndex < TELUGU_OTTULU_WORDS.length - 1) { teOttuluIndex++; render(); } };
    }

    // Mode 5: Read-Along
    else if (activeLevelId === 'level_5_passages') {
      const story = TELUGU_PASSAGES[0];
      const toggleBtn = container.querySelector('#btn-toggle-story-audio');

      if (toggleBtn) {
        toggleBtn.onclick = () => {
          if (isStoryPlaying) {
            stopSpeech();
            isStoryPlaying = false;
            render();
          } else {
            isStoryPlaying = true;
            readAlongWordIdx = 0;
            render();
            playNextStoryWord(story);
          }
        };
      }
    }
  }

  function playNextStoryWord(story) {
    if (!isStoryPlaying || readAlongWordIdx >= story.words.length) {
      isStoryPlaying = false;
      playTone('complete');
      render();
      return;
    }

    const currentWord = story.words[readAlongWordIdx];
    speakTeluguText(currentWord, {
      rate: 0.85,
      onEnd: () => {
        readAlongWordIdx++;
        container.querySelectorAll('#story-words-flow .word-chip').forEach((chip, i) => {
          if (i === readAlongWordIdx) {
            chip.className = 'word-chip state-accurate';
            chip.style.transform = 'scale(1.1)';
          } else {
            chip.className = 'word-chip';
            chip.style.transform = 'none';
          }
        });
        if (isStoryPlaying) {
          setTimeout(() => playNextStoryWord(story), 250);
        }
      }
    });
  }

  // Initial render
  render();
}
