// EduFree.AI Telugu Targeted Practice & Literacy Center
import { t, getLanguage } from '../data/i18n.js';
import { TELUGU_LEVELS, TELUGU_LETTERS, TELUGU_GUNINTHALU_FAMILIES, TELUGU_SIMPLE_WORDS, TELUGU_OTTULU_WORDS, TELUGU_PASSAGES } from '../data/teluguContent.js';
import { speakTeluguText, stopSpeech, playTone } from '../utils/speechAudio.js';
import { putInStore } from '../storage/db.js';
import { generateId } from '../utils/helpers.js';
import { icon } from '../utils/icons.js';

export function renderPractice(container, { studentId = null, initialLevelId = 'level_1_letters', onBack, onOpenActivities }) {
  const lang = getLanguage();
  let activeLevelId = initialLevelId;
  let letterIndex = 0;
  let guninthamFamilyIndex = 0;
  let simpleWordIndex = 0;
  let ottuluIndex = 0;
  let readAlongWordIdx = 0;
  let isStoryPlaying = false;
  let playbackSpeed = 0.85;

  function render() {
    container.innerHTML = `
      <div style="max-width: 800px; margin: 0 auto;">
        <!-- Practice Header & Level Selector Tabs -->
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

          <!-- 5 Skill Level Switcher Pills -->
          <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;">
            ${TELUGU_LEVELS.map((lvl) => `
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

    // Attach level tab switches
    container.querySelectorAll('.practice-lvl-btn').forEach((btn) => {
      btn.onclick = () => {
        stopSpeech();
        activeLevelId = btn.dataset.levelId;
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
      return renderLettersMode();
    } else if (activeLevelId === 'level_2_guninthalu') {
      return renderGuninthaluMode();
    } else if (activeLevelId === 'level_3_simple_words') {
      return renderSimpleWordsMode();
    } else if (activeLevelId === 'level_4_ottulu') {
      return renderOttuluMode();
    } else {
      return renderReadAlongMode();
    }
  }

  // --- Mode 1: Letters & Sounds Flashcards ---
  function renderLettersMode() {
    const item = TELUGU_LETTERS[letterIndex];
    return `
      <div class="card" style="text-align: center; padding: 24px;">
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">
          ${t('letter_prefix')} ${letterIndex + 1} / ${TELUGU_LETTERS.length} (${item.type === 'vowel' ? t('vowel_type') : t('consonant_type')})
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
          <button id="btn-prev-letter" class="btn btn-outline" ${letterIndex === 0 ? 'disabled' : ''}>
            ← ${t('prev_btn')}
          </button>
          <button id="btn-speak-letter" class="btn btn-accent btn-lg">
            <span>${icon('volume', { size: 18 })}</span> ${t('audio_listen')}
          </button>
          <button id="btn-next-letter" class="btn btn-primary" ${letterIndex === TELUGU_LETTERS.length - 1 ? 'disabled' : ''}>
            ${t('next_btn')} →
          </button>
        </div>
      </div>
    `;
  }

  // --- Mode 2: Interactive Gunintham Wheel / Grid ---
  function renderGuninthaluMode() {
    const family = TELUGU_GUNINTHALU_FAMILIES[guninthamFamilyIndex];
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
              <button class="btn btn-sm ${idx === guninthamFamilyIndex ? 'btn-primary' : 'btn-outline'} btn-fam-select" data-idx="${idx}">
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

  // --- Mode 3: Simple Words Flashcards & Syllables ---
  function renderSimpleWordsMode() {
    const item = TELUGU_SIMPLE_WORDS[simpleWordIndex];
    return `
      <div class="card" style="text-align: center; padding: 24px;">
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">
          ${t('simple_word_prefix')} ${simpleWordIndex + 1} / ${TELUGU_SIMPLE_WORDS.length}
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
          <button id="btn-prev-simple" class="btn btn-outline" ${simpleWordIndex === 0 ? 'disabled' : ''}>
            ← ${t('prev_btn')}
          </button>
          <button id="btn-speak-simple" class="btn btn-accent btn-lg">
            <span>${icon('volume', { size: 18 })}</span> ${t('audio_listen')}
          </button>
          <button id="btn-next-simple" class="btn btn-primary" ${simpleWordIndex === TELUGU_SIMPLE_WORDS.length - 1 ? 'disabled' : ''}>
            ${t('next_btn')} →
          </button>
        </div>
      </div>
    `;
  }

  // --- Mode 4: Conjunct Words (Ottulu) ---
  function renderOttuluMode() {
    const item = TELUGU_OTTULU_WORDS[ottuluIndex];
    return `
      <div class="card" style="text-align: center; padding: 24px;">
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">
          ${t('stat_ottulu')} ${ottuluIndex + 1} / ${TELUGU_OTTULU_WORDS.length} (${item.type})
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
          <button id="btn-prev-ottulu" class="btn btn-outline" ${ottuluIndex === 0 ? 'disabled' : ''}>
            ← ${t('prev_btn')}
          </button>
          <button id="btn-speak-ottulu" class="btn btn-accent btn-lg">
            <span>${icon('volume', { size: 18 })}</span> ${t('audio_listen')}
          </button>
          <button id="btn-next-ottulu" class="btn btn-primary" ${ottuluIndex === TELUGU_OTTULU_WORDS.length - 1 ? 'disabled' : ''}>
            ${t('next_btn')} →
          </button>
        </div>
      </div>
    `;
  }

  // --- Mode 5: Read-Along Stories with Word Highlighting ---
  function renderReadAlongMode() {
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

  function attachModeInteractions() {
    // Mode 1: Letters
    if (activeLevelId === 'level_1_letters') {
      const item = TELUGU_LETTERS[letterIndex];
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
      if (prevBtn) prevBtn.onclick = () => { if (letterIndex > 0) { letterIndex--; render(); } };

      const nextBtn = container.querySelector('#btn-next-letter');
      if (nextBtn) nextBtn.onclick = () => { if (letterIndex < TELUGU_LETTERS.length - 1) { letterIndex++; render(); } };
    }

    // Mode 2: Guninthalu
    else if (activeLevelId === 'level_2_guninthalu') {
      const family = TELUGU_GUNINTHALU_FAMILIES[guninthamFamilyIndex];
      let selectedGlyph = family.series[0].glyph;

      container.querySelectorAll('.btn-fam-select').forEach((btn) => {
        btn.onclick = () => {
          guninthamFamilyIndex = parseInt(btn.dataset.idx, 10);
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
      const item = TELUGU_SIMPLE_WORDS[simpleWordIndex];
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
      if (prevBtn) prevBtn.onclick = () => { if (simpleWordIndex > 0) { simpleWordIndex--; render(); } };

      const nextBtn = container.querySelector('#btn-next-simple');
      if (nextBtn) nextBtn.onclick = () => { if (simpleWordIndex < TELUGU_SIMPLE_WORDS.length - 1) { simpleWordIndex++; render(); } };
    }

    // Mode 4: Ottulu
    else if (activeLevelId === 'level_4_ottulu') {
      const item = TELUGU_OTTULU_WORDS[ottuluIndex];
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
      if (prevBtn) prevBtn.onclick = () => { if (ottuluIndex > 0) { ottuluIndex--; render(); } };

      const nextBtn = container.querySelector('#btn-next-ottulu');
      if (nextBtn) nextBtn.onclick = () => { if (ottuluIndex < TELUGU_OTTULU_WORDS.length - 1) { ottuluIndex++; render(); } };
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
        // Highlight active word in DOM
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
