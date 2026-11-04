// EduFree.AI Teacher-Led Telugu Reading Assessment ("ప్రతీ బిడ్డ చదవాలి")
import { t, getLanguage } from '../data/i18n.js';
import { getAllFromStore, putInStore, getSetting } from '../storage/db.js';
import { TELUGU_PASSAGES, TELUGU_LEVELS } from '../data/teluguContent.js';
import { calculateAssessmentMetrics, ERROR_TYPES } from '../data/assessmentRules.js';
import { generateRecommendations } from '../data/recommendations.js';
import { queueMutation } from '../storage/syncQueue.js';
import { playTone } from '../utils/speechAudio.js';
import { generateId } from '../utils/helpers.js';
import { icon } from '../utils/icons.js';

let draftAutoSaveTimer = null;

export async function renderAssessment(container, { initialStudentId = null, onFinish, onLaunchPractice }) {
  const lang = getLanguage();
  const currentClassId = await getSetting('current_class_id');
  const allStudents = await getAllFromStore('students');
  const classStudents = allStudents.filter((s) => !currentClassId || s.classId === currentClassId);

  // Restore draft if exists
  let savedDraft = null;
  try {
    const raw = localStorage.getItem('edufree_assessment_draft');
    if (raw) savedDraft = JSON.parse(raw);
  } catch (e) {}

  let selectedStudentId = initialStudentId || savedDraft?.studentId || classStudents[0]?.id || null;
  let selectedPassageId = savedDraft?.passageId || TELUGU_PASSAGES[0].id;

  let currentStep = savedDraft ? (savedDraft.currentStep || 2) : 1; // 1: Setup, 2: Reading Observation, 3: Comprehension, 4: Summary

  let currentPassage = TELUGU_PASSAGES.find((p) => p.id === selectedPassageId) || TELUGU_PASSAGES[0];
  
  // Initialize word states
  let wordStates = savedDraft?.wordStates || currentPassage.words.map((w, idx) => ({
    index: idx,
    word: w,
    state: ERROR_TYPES.ACCURATE // Default accurate, teacher taps to mark errors
  }));

  // Timer state
  let timerSeconds = savedDraft?.timerSeconds || 60;
  let timerMode = savedDraft?.timerMode || '60s'; // '60s' | 'teacher_paced'
  let isTimerRunning = false;
  let timerInterval = null;
  let elapsedSeconds = savedDraft?.elapsedSeconds || 0;

  // Qualitative Observations
  let observations = savedDraft?.observations || {
    hesitation: false,
    finger_point: false,
    letter_by_letter: false,
    vowel_sign_confusion: false,
    vatthu_struggle: false,
    expressive: false,
    self_correction: false
  };

  let teacherNotes = savedDraft?.teacherNotes || '';
  let comprehensionResponses = savedDraft?.comprehensionResponses || currentPassage.comprehensionQuestions.map(() => 'correct');
  let teacherOverrideLevel = null;

  // Auto-save draft every 2 seconds
  if (draftAutoSaveTimer) clearInterval(draftAutoSaveTimer);
  draftAutoSaveTimer = setInterval(() => {
    if (currentStep === 2 || currentStep === 3) {
      const draft = {
        currentStep,
        studentId: selectedStudentId,
        passageId: selectedPassageId,
        wordStates,
        timerSeconds,
        timerMode,
        elapsedSeconds,
        observations,
        teacherNotes,
        comprehensionResponses
      };
      localStorage.setItem('edufree_assessment_draft', JSON.stringify(draft));
    }
  }, 2000);

  function clearDraft() {
    if (draftAutoSaveTimer) clearInterval(draftAutoSaveTimer);
    localStorage.removeItem('edufree_assessment_draft');
  }

  function render() {
    if (currentStep === 1) {
      renderSetupStep();
    } else if (currentStep === 2) {
      renderReadingStep();
    } else if (currentStep === 3) {
      renderComprehensionStep();
    } else if (currentStep === 4) {
      renderSummaryStep();
    }
  }

  // --- Step 1: Student & Passage Selection ---
  function renderSetupStep() {
    const student = classStudents.find((s) => s.id === selectedStudentId);

    container.innerHTML = `
      <div class="card" style="max-width: 680px; margin: 0 auto;">
        <div class="card-header">
          <h2 class="card-title">
            <span>${icon('assess', { size: 20 })}</span> ${t('assess_title')}
          </h2>
          <span style="font-size: 0.82rem; background: var(--primary-100); color: var(--primary-800); padding: 4px 10px; border-radius: var(--radius-full); font-weight: 700;">
            ${t('step_prefix')} 1/4: ${t('step_1_title')}
          </span>
        </div>

        <div class="form-group">
          <label class="form-label" for="select-student">${t('select_student_label')}</label>
          <select id="select-student" class="form-input te-text">
            ${classStudents.map((std) => `
              <option value="${std.id}" ${std.id === selectedStudentId ? 'selected' : ''}>
                ${std.localCode} — ${std.name} (${std.currentLevelName || t('stat_letters')})
              </option>
            `).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="select-passage">${t('select_passage_label')}</label>
          <select id="select-passage" class="form-input te-text">
            ${TELUGU_PASSAGES.map((p) => `
              <option value="${p.id}" ${p.id === selectedPassageId ? 'selected' : ''}>
                ${lang === 'te' ? p.title_te : p.title_en} (${p.difficulty} • ${p.wordCount} ${t('words_suffix')} • ${p.grade_recommendation})
              </option>
            `).join('')}
          </select>
        </div>

        <!-- Passage Preview Card -->
        <div style="background: var(--bg-card-subtle); border-radius: var(--radius-md); padding: 16px; margin-bottom: 20px; border: 1.5px dashed var(--border-strong);">
          <div style="font-weight: 700; color: var(--primary-800); margin-bottom: 6px; font-family: var(--font-telugu);">
            ${t('passage_preview_title')} "${lang === 'te' ? currentPassage.title_te : currentPassage.title_en}"
          </div>
          <p class="te-text" style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.8;">
            ${currentPassage.text}
          </p>
        </div>

        <!-- Instructions Box -->
        <div style="background: var(--primary-50); border-left: 4px solid var(--primary-600); padding: 12px 16px; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; margin-bottom: 24px;">
          <h4 style="font-size: 0.92rem; font-weight: 700; color: var(--primary-900); margin-bottom: 4px; font-family: var(--font-telugu); display: flex; align-items: center; gap: 6px;">
            ${icon('bulb', { size: 16, color: '#b45309' })} ${t('teacher_guidance')}
          </h4>
          <p style="font-size: 0.85rem; color: var(--primary-800);">
            ${t('instructions_text')}
          </p>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <button id="btn-cancel-assess" class="btn btn-outline">
            ${t('cancel')}
          </button>
          <button id="btn-start-reading-step" class="btn btn-primary btn-lg">
            <span>${icon('rocket', { size: 18 })}</span> ${t('start_reading_btn')}
          </button>
        </div>
      </div>
    `;

    container.querySelector('#select-student').onchange = (e) => {
      selectedStudentId = e.target.value;
    };

    container.querySelector('#select-passage').onchange = (e) => {
      selectedPassageId = e.target.value;
      currentPassage = TELUGU_PASSAGES.find((p) => p.id === selectedPassageId) || TELUGU_PASSAGES[0];
      wordStates = currentPassage.words.map((w, idx) => ({
        index: idx,
        word: w,
        state: ERROR_TYPES.ACCURATE
      }));
      comprehensionResponses = currentPassage.comprehensionQuestions.map(() => 'correct');
      renderSetupStep();
    };

    container.querySelector('#btn-cancel-assess').onclick = () => {
      clearDraft();
      onFinish();
    };

    container.querySelector('#btn-start-reading-step').onclick = () => {
      currentStep = 2;
      render();
    };
  }

  // --- Step 2: Live Reading Observation with Word Chips & Timer ---
  function renderReadingStep() {
    const student = classStudents.find((s) => s.id === selectedStudentId);
    const metrics = calculateAssessmentMetrics({
      wordStates,
      secondsElapsed: elapsedSeconds > 0 ? elapsedSeconds : (timerMode === '60s' ? 60 - timerSeconds : 60),
      comprehensionResponses,
      studentGrade: Number(student?.grade || 3),
      observations
    });

    container.innerHTML = `
      <div class="assessment-container">
        <!-- Top Toolbar: Student Info & Timer -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--primary-100); display: flex; align-items: center; justify-content: center;">
              ${icon('user', { size: 22, color: 'var(--primary-700)' })}
            </div>
            <div>
              <div style="font-weight: 800; font-size: 1.15rem; font-family: var(--font-telugu); color: var(--text-main);">
                ${student?.name || t('student_name')}
              </div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">
                ${t('student_code')}: <strong>${student?.localCode || ''}</strong> • ${t('grade_prefix')} ${student?.grade || ''}
              </div>
            </div>
          </div>

          <!-- Timer Mode Toggle & Control -->
          <div class="timer-panel" style="padding: 10px 16px;">
            <div class="timer-display">
              <span class="timer-digits" id="timer-number">${timerSeconds}</span>
              <span class="timer-unit">${t('seconds_unit')}</span>
            </div>

            <div class="timer-controls">
              <button id="btn-timer-toggle" class="btn btn-accent btn-sm" aria-label="Toggle timer">
                ${isTimerRunning ? `⏸️ ${t('timer_pause')}` : `▶️ ${t('timer_start')}`}
              </button>
              <button id="btn-timer-reset" class="btn btn-outline btn-sm" style="color: #ffffff; border-color: rgba(255,255,255,0.4);" aria-label="Reset timer">
                ${icon('refresh', { size: 13, color: '#ffffff' })} ${t('timer_reset')}
              </button>
            </div>
          </div>
        </div>

        <!-- Live Metrics Bar -->
        <div class="assessment-live-stats">
          <div class="live-stat-box">
            <div class="live-stat-val" id="stat-wcpm">${metrics.wcpm}</div>
            <div class="live-stat-lbl">WCPM (${t('speed_unit')})</div>
          </div>
          <div class="live-stat-box">
            <div class="live-stat-val" id="stat-acc" style="color: ${metrics.accuracyPercentage >= 85 ? 'var(--primary-700)' : '#e11d48'};">${metrics.accuracyPercentage}%</div>
            <div class="live-stat-lbl">${t('accuracy_label')}</div>
          </div>
          <div class="live-stat-box">
            <div class="live-stat-val" id="stat-err" style="color: #e11d48;">${metrics.totalErrors}</div>
            <div class="live-stat-lbl">${t('total_errors')}</div>
          </div>
          <div class="live-stat-box">
            <div class="live-stat-val" id="stat-att">${metrics.wordsAttempted} / ${currentPassage.wordCount}</div>
            <div class="live-stat-lbl">${t('words_read')}</div>
          </div>
        </div>

        <!-- Interactive Telugu Passage Box with Tap-to-Mark Words -->
        <div class="passage-box">
          <div class="passage-header-meta">
            <span class="passage-title">${lang === 'te' ? currentPassage.title_te : currentPassage.title_en}</span>
            <span style="font-size: 0.82rem; color: var(--text-muted);">${t('tap_word_hint')}</span>
          </div>

          <div class="words-flow" id="words-flow-container" role="region" aria-label="Passage reading words">
            ${wordStates.map((item, idx) => `
              <button 
                class="word-chip state-${item.state}" 
                data-index="${idx}"
                id="word-chip-${idx}"
                aria-label="${item.word} (${item.state})"
                title="${t('tap_to_change_state')}"
              >
                ${item.word}
              </button>
            `).join('')}
          </div>

          <!-- Color Marker Legend -->
          <div class="marker-legend">
            <div class="legend-item">
              <span class="legend-swatch" style="background: var(--mark-accurate-border);"></span>
              <span>${t('mark_accurate')}</span>
            </div>
            <div class="legend-item">
              <span class="legend-swatch" style="background: var(--mark-skipped-border);"></span>
              <span>${t('mark_skipped')}</span>
            </div>
            <div class="legend-item">
              <span class="legend-swatch" style="background: var(--mark-misread-border); border: 1px dashed #d97706;"></span>
              <span>${t('mark_substituted')}</span>
            </div>
            <div class="legend-item">
              <span class="legend-swatch" style="background: var(--mark-prompted-border);"></span>
              <span>${t('mark_prompted')}</span>
            </div>
          </div>
        </div>

        <!-- Qualitative Observations Panel (SCERT FLN Indicators) -->
        <div class="card" style="margin-bottom: 0;">
          <div class="card-header" style="margin-bottom: 8px; padding-bottom: 6px;">
            <h3 class="card-title" style="font-size: 1rem;">
              <span>${icon('search', { size: 16 })}</span> ${t('obs_title')}
            </h3>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px; margin-bottom: 14px;">
            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; cursor: pointer;">
              <input type="checkbox" id="obs-hesitation" ${observations.hesitation ? 'checked' : ''}>
              <span>${t('obs_hesitation')}</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; cursor: pointer;">
              <input type="checkbox" id="obs-finger-point" ${observations.finger_point ? 'checked' : ''}>
              <span>${t('obs_finger_point')}</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; cursor: pointer;">
              <input type="checkbox" id="obs-letter-by-letter" ${observations.letter_by_letter ? 'checked' : ''}>
              <span>${t('obs_letter_by_letter')}</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; cursor: pointer;">
              <input type="checkbox" id="obs-vowel-sign" ${observations.vowel_sign_confusion ? 'checked' : ''}>
              <span>${t('obs_vowel_sign_confusion')}</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; cursor: pointer;">
              <input type="checkbox" id="obs-vatthu" ${observations.vatthu_struggle ? 'checked' : ''}>
              <span>${t('obs_vatthu_struggle')}</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; cursor: pointer;">
              <input type="checkbox" id="obs-expressive" ${observations.expressive ? 'checked' : ''}>
              <span>${t('obs_expressive')}</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; cursor: pointer;">
              <input type="checkbox" id="obs-self-correction" ${observations.self_correction ? 'checked' : ''}>
              <span>${t('obs_self_correction')}</span>
            </label>
          </div>

          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" style="font-size: 0.82rem;">${t('teacher_notes_label')}</label>
            <textarea id="teacher-notes-input" rows="2" class="form-input" placeholder="${t('teacher_notes_placeholder')}">${teacherNotes}</textarea>
          </div>
        </div>

        <!-- Bottom Action Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-top: 8px;">
          <button id="btn-back-to-step1" class="btn btn-outline">
            ← ${t('back_btn')}
          </button>
          <button id="btn-go-to-comp" class="btn btn-primary btn-lg">
            <span>${icon('arrowRight', { size: 18 })}</span> ${t('next_comp_btn')}
          </button>
        </div>
      </div>
    `;

    // Attach Word Tap Cycle Handler (Accurate -> Substituted -> Skipped -> Prompted -> Accurate)
    container.querySelectorAll('.word-chip').forEach((chip) => {
      chip.onclick = () => {
        const idx = parseInt(chip.dataset.index, 10);
        const current = wordStates[idx].state;
        let next = ERROR_TYPES.ACCURATE;

        if (current === ERROR_TYPES.ACCURATE) {
          next = ERROR_TYPES.SUBSTITUTED;
          playTone('mark_error');
        } else if (current === ERROR_TYPES.SUBSTITUTED) {
          next = ERROR_TYPES.SKIPPED;
          playTone('mark_error');
        } else if (current === ERROR_TYPES.SKIPPED) {
          next = ERROR_TYPES.PROMPTED;
          playTone('tap');
        } else if (current === ERROR_TYPES.PROMPTED) {
          next = ERROR_TYPES.ACCURATE;
          playTone('correct');
        }

        wordStates[idx].state = next;
        chip.className = `word-chip state-${next}`;
        chip.setAttribute('aria-label', `${wordStates[idx].word} (${next})`);

        // Recalculate live stats
        const updatedMetrics = calculateAssessmentMetrics({
          wordStates,
          secondsElapsed: elapsedSeconds > 0 ? elapsedSeconds : (timerMode === '60s' ? 60 - timerSeconds : 60),
          comprehensionResponses,
          studentGrade: Number(student?.grade || 3),
          observations
        });

        const wcpmEl = container.querySelector('#stat-wcpm');
        const accEl = container.querySelector('#stat-acc');
        const errEl = container.querySelector('#stat-err');
        const attEl = container.querySelector('#stat-att');

        if (wcpmEl) wcpmEl.textContent = updatedMetrics.wcpm;
        if (accEl) {
          accEl.textContent = `${updatedMetrics.accuracyPercentage}%`;
          accEl.style.color = updatedMetrics.accuracyPercentage >= 85 ? 'var(--primary-700)' : '#e11d48';
        }
        if (errEl) errEl.textContent = updatedMetrics.totalErrors;
        if (attEl) attEl.textContent = `${updatedMetrics.wordsAttempted} / ${currentPassage.wordCount}`;
      };
    });

    // Timer Controls
    const timerNumberEl = container.querySelector('#timer-number');
    const timerToggleBtn = container.querySelector('#btn-timer-toggle');
    const timerResetBtn = container.querySelector('#btn-timer-reset');

    timerToggleBtn.onclick = () => {
      if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        timerToggleBtn.textContent = `▶️ ${t('timer_start')}`;
      } else {
        isTimerRunning = true;
        timerToggleBtn.textContent = `⏸️ ${t('timer_pause')}`;
        timerInterval = setInterval(() => {
          if (timerSeconds > 0) {
            timerSeconds--;
            elapsedSeconds++;
            if (timerNumberEl) timerNumberEl.textContent = timerSeconds;
            if (timerSeconds === 0) {
              clearInterval(timerInterval);
              isTimerRunning = false;
              playTone('complete');
              timerToggleBtn.textContent = t('timer_completed');
            }
          }
        }, 1000);
      }
    };

    timerResetBtn.onclick = () => {
      clearInterval(timerInterval);
      isTimerRunning = false;
      timerSeconds = 60;
      elapsedSeconds = 0;
      if (timerNumberEl) timerNumberEl.textContent = '60';
      timerToggleBtn.textContent = `▶️ ${t('timer_start')}`;
    };

    // Observations Checkboxes Handlers
    ['hesitation', 'finger-point', 'letter-by-letter', 'vowel-sign', 'vatthu', 'expressive', 'self-correction'].forEach((key) => {
      const el = container.querySelector(`#obs-${key}`);
      if (el) {
        const propMap = {
          'hesitation': 'hesitation',
          'finger-point': 'finger_point',
          'letter-by-letter': 'letter_by_letter',
          'vowel-sign': 'vowel_sign_confusion',
          'vatthu': 'vatthu_struggle',
          'expressive': 'expressive',
          'self-correction': 'self_correction'
        };
        el.onchange = () => {
          observations[propMap[key]] = el.checked;
        };
      }
    });

    const notesInput = container.querySelector('#teacher-notes-input');
    if (notesInput) {
      notesInput.oninput = () => {
        teacherNotes = notesInput.value;
      };
    }

    container.querySelector('#btn-back-to-step1').onclick = () => {
      clearInterval(timerInterval);
      isTimerRunning = false;
      currentStep = 1;
      render();
    };

    container.querySelector('#btn-go-to-comp').onclick = () => {
      clearInterval(timerInterval);
      isTimerRunning = false;
      currentStep = 3;
      render();
    };
  }

  // --- Step 3: Comprehension Verification Questions ---
  function renderComprehensionStep() {
    container.innerHTML = `
      <div class="card" style="max-width: 720px; margin: 0 auto;">
        <div class="card-header">
          <h2 class="card-title">
            <span>${icon('help', { size: 20 })}</span> ${t('comp_title')}
          </h2>
          <span style="font-size: 0.82rem; background: var(--primary-100); color: var(--primary-800); padding: 4px 10px; border-radius: var(--radius-full); font-weight: 700;">
            ${t('step_prefix')} 3/4: ${t('step_3_title')}
          </span>
        </div>

        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 16px;">
          ${t('comp_subtitle')}
        </p>

        <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px;">
          ${currentPassage.comprehensionQuestions.map((q, idx) => `
            <div style="background: var(--bg-card-subtle); border-radius: var(--radius-md); padding: 16px; border: 1px solid var(--border-light);">
              <div style="font-weight: 700; font-size: 1.02rem; color: var(--primary-900); margin-bottom: 4px; font-family: var(--font-telugu);">
                ${t('question_prefix')} ${idx + 1}: ${lang === 'te' ? q.question_te : q.question_en}
              </div>
              <div style="font-size: 0.82rem; color: var(--text-subtle); margin-bottom: 10px;">
                ${t('expected_meaning')}: <em>${lang === 'te' ? q.expected_te : q.expected_en}</em> (${q.type === 'literal' ? t('literal_type') : t('inferential_type')})
              </div>

              <!-- 3-Choice Response Buttons -->
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button 
                  class="btn btn-sm comp-opt-btn ${comprehensionResponses[idx] === 'correct' ? 'btn-primary' : 'btn-outline'}" 
                  data-idx="${idx}" 
                  data-val="correct"
                >
                  <span>${icon('checkCircle', { size: 14 })}</span> ${t('comp_correct')}
                </button>
                <button 
                  class="btn btn-sm comp-opt-btn ${comprehensionResponses[idx] === 'partial' ? 'btn-accent' : 'btn-outline'}" 
                  data-idx="${idx}" 
                  data-val="partial"
                >
                  <span>${icon('alert', { size: 14 })}</span> ${t('comp_partial')}
                </button>
                <button 
                  class="btn btn-sm comp-opt-btn ${comprehensionResponses[idx] === 'incorrect' ? 'btn-danger' : 'btn-outline'}" 
                  data-idx="${idx}" 
                  data-val="incorrect"
                >
                  <span>${icon('crossCircle', { size: 14 })}</span> ${t('comp_incorrect')}
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <button id="btn-back-to-reading" class="btn btn-outline">
            ← ${t('back_to_reading_btn')}
          </button>
          <button id="btn-view-summary" class="btn btn-primary btn-lg">
            <span>${icon('chart', { size: 18 })}</span> ${t('view_results_btn')}
          </button>
        </div>
      </div>
    `;

    container.querySelectorAll('.comp-opt-btn').forEach((btn) => {
      btn.onclick = () => {
        const qIdx = parseInt(btn.dataset.idx, 10);
        const val = btn.dataset.val;
        comprehensionResponses[qIdx] = val;
        playTone('tap');
        renderComprehensionStep();
      };
    });

    container.querySelector('#btn-back-to-reading').onclick = () => {
      currentStep = 2;
      render();
    };

    container.querySelector('#btn-view-summary').onclick = () => {
      currentStep = 4;
      render();
    };
  }

  // --- Step 4: Final Assessment Summary, Pedagogical Rationale & Next Actions ---
  async function renderSummaryStep() {
    const student = classStudents.find((s) => s.id === selectedStudentId);
    const finalSeconds = elapsedSeconds > 0 ? elapsedSeconds : (60 - timerSeconds || 60);

    const metrics = calculateAssessmentMetrics({
      wordStates,
      secondsElapsed: finalSeconds,
      comprehensionResponses,
      studentGrade: Number(student?.grade || 3),
      observations
    });

    const recResult = generateRecommendations({
      metrics,
      observations,
      passageTitle: lang === 'te' ? currentPassage.title_te : currentPassage.title_en
    });

    const assignedLevelId = teacherOverrideLevel || metrics.provisionalLevel.levelId;
    const assignedLevel = TELUGU_LEVELS.find((l) => l.id === assignedLevelId) || TELUGU_LEVELS[0];

    // Persist assessment result immediately to IndexedDB
    const assessmentRecord = {
      id: generateId('assess'),
      studentId: selectedStudentId,
      classId: currentClassId,
      passageId: selectedPassageId,
      passageTitle: lang === 'te' ? currentPassage.title_te : currentPassage.title_en,
      date: new Date().toISOString(),
      metrics,
      observations,
      comprehensionResponses,
      teacherOverrideLevel,
      teacherNotes,
      recommendations: recResult,
      synced: false,
      createdAt: new Date().toISOString()
    };

    await putInStore('assessments', assessmentRecord);

    // Update Student record with new level and last assessed date
    if (student) {
      student.currentLevelId = assignedLevelId;
      student.currentLevelName = lang === 'te' ? assignedLevel.name_te : assignedLevel.name_en;
      student.lastAssessedDate = assessmentRecord.date;
      if (teacherNotes) student.notes = teacherNotes;
      await putInStore('students', student);
    }

    // Queue for sync safely
    await queueMutation({
      action: 'create',
      entity: 'assessment',
      entityId: assessmentRecord.id,
      payload: assessmentRecord
    });

    // Clear active draft since record is now saved
    clearDraft();
    playTone('complete');

    container.innerHTML = `
      <div class="card" style="max-width: 760px; margin: 0 auto;">
        <div class="card-header">
          <div>
            <h2 class="card-title">
              <span>${icon('trophy', { size: 22, color: '#f59e0b' })}</span> ${t('result_title')}
            </h2>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 2px;">
              ${t('student_name')}: <strong>${student?.name}</strong> (${student?.localCode}) • "${lang === 'te' ? currentPassage.title_te : currentPassage.title_en}"
            </p>
          </div>
          <span style="font-size: 0.78rem; background: var(--primary-100); color: var(--primary-800); padding: 4px 10px; border-radius: var(--radius-full); font-weight: 700; display: flex; align-items: center; gap: 4px;">
            ${icon('save', { size: 14 })} ${t('saved_locally_badge')}
          </span>
        </div>

        <!-- Metrics Overview Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-bottom: 20px;">
          <div class="stat-card">
            <div class="stat-number" style="color: var(--primary-800);">${metrics.wcpm}</div>
            <div class="stat-label">WCPM (${t('speed_unit')})</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" style="color: ${metrics.accuracyPercentage >= 85 ? 'var(--primary-700)' : '#e11d48'};">${metrics.accuracyPercentage}%</div>
            <div class="stat-label">${t('accuracy_label')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" style="color: #0284c7;">${metrics.compScore}/${metrics.totalCompQuestions}</div>
            <div class="stat-label">${t('comp_score_label')}</div>
          </div>
          <div class="stat-card alert">
            <div class="stat-number" style="color: #e11d48;">${metrics.totalErrors}</div>
            <div class="stat-label">${t('total_errors')}</div>
          </div>
        </div>

        <!-- Assigned / Provisional Level & Teacher Override -->
        <div style="background: var(--bg-card-subtle); border-radius: var(--radius-md); padding: 18px; margin-bottom: 20px; border: 1.5px solid var(--border-light);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
            <div>
              <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
                ${t('result_computed_level')}
              </span>
              <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                <span class="level-badge" style="background: ${metrics.provisionalLevel.badgeColor}; color: #ffffff; font-size: 0.95rem; padding: 6px 14px;">
                  ${lang === 'te' ? metrics.provisionalLevel.name_te : metrics.provisionalLevel.name_en}
                </span>
                <span style="font-size: 0.85rem; color: var(--text-muted);">(${metrics.provisionalLevel.stage})</span>
              </div>
            </div>
          </div>

          <!-- Teacher Level Override Dropdown -->
          <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-light);">
            <label for="select-teacher-override" style="font-size: 0.82rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 4px;">
              ${t('teacher_override_label')}
            </label>
            <p style="font-size: 0.76rem; color: var(--text-subtle); margin-bottom: 6px;">
              ${t('teacher_override_hint')}
            </p>
            <select id="select-teacher-override" class="form-input te-text" style="padding: 6px 12px; font-size: 0.88rem;">
              ${TELUGU_LEVELS.map((lvl) => `
                <option value="${lvl.id}" ${lvl.id === assignedLevelId ? 'selected' : ''}>
                  ${lang === 'te' ? lvl.name_te : lvl.name_en}
                </option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- Transparent Pedagogical Rationale Box -->
        <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: var(--radius-md); padding: 16px; margin-bottom: 20px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: #92400e; margin-bottom: 8px; font-family: var(--font-telugu); display: flex; align-items: center; gap: 6px;">
            ${icon('bulb', { size: 18, color: '#92400e' })} ${t('rec_rationale_title')}
          </h4>
          <ul style="padding-left: 20px; font-size: 0.88rem; color: #78350f; line-height: 1.8;">
            ${recResult.rationales.map((r) => `
              <li>${lang === 'te' ? r.reason_te : r.reason_en}</li>
            `).join('')}
          </ul>
        </div>

        <!-- Recommended Targeted Practice Activities List -->
        <div style="margin-bottom: 24px;">
          <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-main); margin-bottom: 12px; font-family: var(--font-telugu); display: flex; align-items: center; gap: 6px;">
            ${icon('target', { size: 18, color: 'var(--primary-700)' })} ${t('rec_activities_title')}:
          </h4>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${recResult.recommendations.map((rec) => `
              <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-card); border-radius: var(--radius-md); padding: 12px 16px; border: 1px solid var(--border-light); box-shadow: var(--shadow-sm); flex-wrap: wrap; gap: 8px;">
                <div>
                  <div style="font-weight: 700; font-size: 0.95rem; color: var(--primary-900); font-family: var(--font-telugu);">
                    ${lang === 'te' ? rec.title_te : rec.title_en}
                  </div>
                  <div style="font-size: 0.82rem; color: var(--text-muted);">
                    ${lang === 'te' ? rec.description_te : rec.description_en} • <strong>${rec.targetDurationMinutes} ${t('minutes_unit')}</strong>
                  </div>
                </div>
                <button class="btn btn-accent btn-sm btn-launch-rec" data-level-id="${rec.levelId}" data-practice-mode="${rec.practiceMode}">
                  <span>▶️</span> ${t('launch_practice_btn')}
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Sequential Student Workflow & Return Buttons -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; border-top: 1px solid var(--border-light); padding-top: 16px;">
          <button id="btn-summary-done" class="btn btn-outline">
            ${t('btn_save_finish')}
          </button>
          
          <button id="btn-next-student-flow" class="btn btn-primary btn-lg">
            <span>${icon('userPlus', { size: 18 })}</span> ${t('btn_next_student')}
          </button>
        </div>
      </div>
    `;

    // Teacher Override Listener
    container.querySelector('#select-teacher-override').onchange = async (e) => {
      teacherOverrideLevel = e.target.value;
      const updatedLevel = TELUGU_LEVELS.find((l) => l.id === teacherOverrideLevel);
      if (student && updatedLevel) {
        student.currentLevelId = teacherOverrideLevel;
        student.currentLevelName = lang === 'te' ? updatedLevel.name_te : updatedLevel.name_en;
        await putInStore('students', student);
      }
    };

    // Launch Practice Button Listener
    container.querySelectorAll('.btn-launch-rec').forEach((btn) => {
      btn.onclick = () => {
        onLaunchPractice(selectedStudentId, btn.dataset.levelId);
      };
    });

    container.querySelector('#btn-summary-done').onclick = () => {
      onFinish();
    };

    // Sequential Assessment ("Assess Next Student")
    container.querySelector('#btn-next-student-flow').onclick = () => {
      // Find index of current student and move to next
      const currentIdx = classStudents.findIndex((s) => s.id === selectedStudentId);
      const nextIdx = (currentIdx + 1) % classStudents.length;
      const nextStudent = classStudents[nextIdx];

      selectedStudentId = nextStudent.id;
      wordStates = currentPassage.words.map((w, idx) => ({
        index: idx,
        word: w,
        state: ERROR_TYPES.ACCURATE
      }));
      timerSeconds = 60;
      elapsedSeconds = 0;
      observations = {
        hesitation: false,
        finger_point: false,
        letter_by_letter: false,
        vowel_sign_confusion: false,
        vatthu_struggle: false,
        expressive: false,
        self_correction: false
      };
      teacherNotes = '';
      comprehensionResponses = currentPassage.comprehensionQuestions.map(() => 'correct');
      teacherOverrideLevel = null;

      currentStep = 2; // Jump directly to reading observation for next student!
      render();
    };
  }

  // Initial render
  render();
}
