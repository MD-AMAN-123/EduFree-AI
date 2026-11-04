// EduFree.AI - SCERT Telangana Classes 1-10 Telugu Medium Syllabus Component
// Reference: https://scert.telangana.gov.in
import { t, getLanguage } from '../data/i18n.js';
import { SCERT_CLASSES_DATA, SCERT_STAGES, SCERT_ACADEMIC_STANDARDS, getSyllabusByClass, searchSyllabus } from '../data/scertSyllabus.js';
import { icon } from '../utils/icons.js';

let selectedClassNum = '3';
let selectedSubjectKey = 'all';
let searchQuery = '';

export function renderScertSyllabus(container, { onBack, onLaunchPractice }) {
  const lang = getLanguage();
  const isTe = lang === 'te';

  function render() {
    const classData = getSyllabusByClass(selectedClassNum);
    const searchResults = searchQuery ? searchSyllabus(searchQuery) : null;

    // Filter subjects
    const subjectsToDisplay = classData.subjects.filter((s) => {
      if (selectedSubjectKey === 'all') return true;
      return s.subjectKey === selectedSubjectKey;
    });

    container.innerHTML = `
      <div class="syllabus-view-container" style="max-width: 1100px; margin: 0 auto;">
        <!-- Top Navigation Header -->
        <div class="card" style="margin-bottom: 20px; border-top: 4px solid #059669;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px; margin-bottom: 12px;">
            <div>
              <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 9999px; background: rgba(5, 150, 105, 0.12); color: #047857; font-size: 0.78rem; font-weight: 700; margin-bottom: 8px;">
                ${icon('school', { size: 14, color: '#047857' })} ${t('scert_portal_badge')}
              </div>
              <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--primary-900); font-family: var(--font-telugu); display: flex; align-items: center; gap: 8px;">
                ${icon('syllabus', { size: 24, color: 'var(--primary-700)' })} ${t('scert_portal_title')}
              </h2>
              <p style="color: var(--text-muted); font-size: 0.88rem; margin-top: 4px;">
                ${t('scert_portal_subtitle')}
              </p>
            </div>

            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="https://scert.telangana.gov.in" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm" title="${t('scert_view_source')}">
                ${icon('globe', { size: 14 })} SCERT Portal ↗
              </a>
              <button id="syllabus-back-btn" class="btn btn-outline btn-sm">
                ← ${isTe ? 'డాష్‌బోర్డ్' : 'Dashboard'}
              </button>
            </div>
          </div>

          <!-- Quick Search Bar -->
          <div style="margin-top: 14px; position: relative;">
            <input 
              type="search" 
              id="scert-search-input" 
              class="form-input" 
              placeholder="${t('scert_search_placeholder')}"
              value="${searchQuery}" 
              style="padding-left: 38px; width: 100%; border-radius: 12px; font-size: 0.92rem;"
            />
            <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.6; display: flex; align-items: center;">${icon('search', { size: 16 })}</span>
            ${searchQuery ? `<button id="clear-search-btn" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 1rem;">✕</button>` : ''}
          </div>
        </div>

        ${searchQuery ? renderSearchResults(searchResults) : renderNormalCurriculum(classData, subjectsToDisplay)}

        <!-- SCERT Academic Standards Drawer (విద్యా ప్రమాణాలు) -->
        <div class="card" style="margin-top: 24px; background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%); border: 1.5px solid var(--border-light);">
          <details style="cursor: pointer;">
            <summary style="font-size: 1.05rem; font-weight: 700; color: var(--primary-900); font-family: var(--font-telugu); outline: none; padding: 4px 0; display: flex; align-items: center; gap: 6px;">
              ${icon('target', { size: 18, color: 'var(--primary-700)' })} ${t('scert_academic_standards_title')} (AS-1 to AS-6 CCE Framework)
            </summary>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; margin-top: 16px;">
              ${SCERT_ACADEMIC_STANDARDS.map((as) => `
                <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: 12px; padding: 12px 14px; box-shadow: var(--shadow-sm);">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                    <span style="font-weight: 800; color: #047857; font-size: 0.82rem; background: rgba(5, 150, 105, 0.1); padding: 2px 8px; border-radius: 6px;">
                      ${as.code}
                    </span>
                    <span style="font-weight: 700; font-size: 0.88rem; color: var(--text-main); font-family: var(--font-telugu);">
                      ${isTe ? as.name_te : as.name_en}
                    </span>
                  </div>
                  <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.45; font-family: var(--font-telugu);">
                    ${as.description_te}
                  </p>
                </div>
              `).join('')}
            </div>
          </details>
        </div>
      </div>
    `;

    attachEvents();
  }

  function renderSearchResults(results) {
    if (!results || results.length === 0) {
      return `
        <div class="card" style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">🔍</div>
          <h3 style="color: var(--text-muted); font-size: 1.1rem; font-family: var(--font-telugu);">
            ${t('scert_no_results')}
          </h3>
        </div>
      `;
    }

    return `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid var(--border-light); padding-bottom: 8px;">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--primary-900); font-family: var(--font-telugu);">
            ${t('scert_search_results')} (${results.length})
          </h3>
          <span style="font-size: 0.82rem; color: var(--text-muted);">
            "${searchQuery}"
          </span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${results.map((res) => `
            <div style="background: #ffffff; border: 1px solid var(--border-light); border-left: 4px solid var(--primary-600); border-radius: 8px; padding: 12px 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; margin-bottom: 4px;">
                <span style="font-size: 0.75rem; font-weight: 700; background: var(--bg-card-subtle); padding: 2px 8px; border-radius: 4px; color: var(--primary-800);">
                  ${res.classTitle_te} • ${res.subjectName_te}
                </span>
                <span style="font-size: 0.75rem; color: #047857; font-weight: 600;">
                  అధ్యాయం ${res.chapterNum}
                </span>
              </div>
              <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-main); font-family: var(--font-telugu);">
                ${res.title_te}
              </h4>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
                ${res.title_en}
              </p>
              <div style="margin-top: 6px; font-size: 0.76rem; color: var(--text-subtle);">
                <strong>విద్యా ప్రమాణం:</strong> ${res.competencies}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderNormalCurriculum(classData, subjectsToDisplay) {
    const isPrimary = ['1', '2', '3', '4', '5'].includes(selectedClassNum);
    const isUpperPrimary = ['6', '7', '8'].includes(selectedClassNum);
    const isSecondary = ['9', '10'].includes(selectedClassNum);

    const schemeTag = isPrimary ? t('scert_fln_focus') : (isUpperPrimary ? t('scert_unnathi_focus') : t('scert_ssc_focus'));

    return `
      <!-- Grade Selection Pills (Classes 1 - 10) -->
      <div class="card" style="padding: 14px 16px; margin-bottom: 20px;">
        <div style="font-size: 0.84rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px; font-family: var(--font-telugu);">
          ${t('scert_select_class')}
        </div>
        <div style="display: flex; gap: 8px; overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 4px;">
          ${['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((cNum) => `
            <button 
              class="btn ${selectedClassNum === cNum ? 'btn-primary' : 'btn-outline'} btn-sm class-select-btn" 
              data-class="${cNum}"
              style="min-width: 76px; flex-shrink: 0; font-weight: 700; border-radius: 10px;"
            >
              ${isTe ? `${cNum}వ తరగతి` : `Class ${cNum}`}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Current Class Overview Banner -->
      <div class="card" style="margin-bottom: 20px; background: linear-gradient(135deg, var(--primary-900) 0%, var(--primary-800) 100%); color: #ffffff;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px; border-radius: 6px; background: rgba(251, 191, 36, 0.2); color: #fbbf24; font-size: 0.74rem; font-weight: 700; margin-bottom: 6px;">
              ${icon('lightning', { size: 14, color: '#fbbf24' })} ${schemeTag}
            </div>
            <h3 style="font-size: 1.3rem; font-weight: 800; font-family: var(--font-telugu);">
              ${isTe ? classData.title_te : classData.title_en}
            </h3>
            <p style="font-size: 0.85rem; opacity: 0.9; margin-top: 4px; font-family: var(--font-telugu);">
              ${isTe ? classData.focus_te : classData.focus_en}
            </p>
          </div>

          ${isPrimary ? `
            <button id="class-jump-practice-btn" class="btn btn-accent btn-sm" style="font-size: 0.82rem;">
              <span>${icon('practice', { size: 14 })}</span> ${t('scert_jump_practice')}
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Subject Filter Tabs -->
      <div style="display: flex; gap: 8px; margin-bottom: 16px; overflow-x: auto; -webkit-overflow-scrolling: touch;">
        <button class="btn ${selectedSubjectKey === 'all' ? 'btn-primary' : 'btn-outline'} btn-sm subj-filter-btn" data-subj="all">
          ${t('scert_all_subjects')}
        </button>
        ${classData.subjects.map((s) => `
          <button class="btn ${selectedSubjectKey === s.subjectKey ? 'btn-primary' : 'btn-outline'} btn-sm subj-filter-btn" data-subj="${s.subjectKey}">
            ${s.subjectKey === 'telugu' ? '📖' : (s.subjectKey === 'maths' ? '📐' : (s.subjectKey === 'evs' || s.subjectKey === 'science' || s.subjectKey === 'physics' || s.subjectKey === 'biology' ? '🔬' : '🌍'))}
            ${isTe ? s.name_te.split('(')[0].trim() : s.name_en.split('(')[0].trim()}
          </button>
        `).join('')}
      </div>

      <!-- Subjects & Chapters Flow -->
      <div style="display: flex; flex-direction: column; gap: 18px;">
        ${subjectsToDisplay.map((subj) => `
          <div class="card" style="border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); border: 1.5px solid var(--border-light);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; border-bottom: 2px solid var(--border-light); padding-bottom: 12px; margin-bottom: 14px;">
              <div>
                <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--primary-900); font-family: var(--font-telugu);">
                  ${isTe ? subj.name_te : subj.name_en}
                </h4>
                <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">
                  SCERT Telangana Textbook • ${subj.chaptersCount} ${t('scert_chapters_count')}
                </span>
              </div>
            </div>

            <!-- Chapters Grid / Accordion -->
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 10px;">
              ${subj.chapters.map((chap) => `
                <div style="background: var(--bg-card-subtle); border: 1px solid var(--border-light); border-radius: 10px; padding: 12px 14px; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; transition: transform 0.15s ease, border-color 0.15s ease;">
                  <div style="display: flex; gap: 10px; align-items: flex-start;">
                    <span style="background: var(--primary-100); color: var(--primary-800); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.78rem; flex-shrink: 0;">
                      ${chap.num}
                    </span>
                    <div style="flex: 1;">
                      <h5 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); font-family: var(--font-telugu); line-height: 1.35;">
                        ${chap.title_te}
                      </h5>
                      <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">
                        ${chap.title_en}
                      </p>
                    </div>
                  </div>

                  <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-strong); padding-top: 6px; font-size: 0.74rem;">
                    <span style="color: #047857; font-weight: 600; font-family: var(--font-telugu);">
                      🎯 ${chap.competencies}
                    </span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function attachEvents() {
    const backBtn = container.querySelector('#syllabus-back-btn');
    if (backBtn) backBtn.onclick = onBack;

    const searchInput = container.querySelector('#scert-search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        searchQuery = e.target.value;
        render();
      };
    }

    const clearBtn = container.querySelector('#clear-search-btn');
    if (clearBtn) {
      clearBtn.onclick = () => {
        searchQuery = '';
        render();
      };
    }

    container.querySelectorAll('.class-select-btn').forEach((btn) => {
      btn.onclick = () => {
        selectedClassNum = btn.dataset.class;
        selectedSubjectKey = 'all';
        searchQuery = '';
        render();
      };
    });

    container.querySelectorAll('.subj-filter-btn').forEach((btn) => {
      btn.onclick = () => {
        selectedSubjectKey = btn.dataset.subj;
        render();
      };
    });

    const jumpPracticeBtn = container.querySelector('#class-jump-practice-btn');
    if (jumpPracticeBtn && onLaunchPractice) {
      jumpPracticeBtn.onclick = () => {
        // Map class 1-5 to foundational levels
        let targetLevel = 'level_1_letters';
        if (selectedClassNum === '2') targetLevel = 'level_2_guninthalu';
        if (selectedClassNum === '3') targetLevel = 'level_3_simple_words';
        if (selectedClassNum === '4') targetLevel = 'level_4_ottulu';
        if (selectedClassNum === '5') targetLevel = 'level_5_passages';
        onLaunchPractice(targetLevel);
      };
    }
  }

  render();
}
