// EduFree.AI Offline Printable Worksheets & Classroom Assessment Rubric
import { t, getLanguage } from '../data/i18n.js';
import { getAllFromStore, getSetting } from '../storage/db.js';
import { TELUGU_PASSAGES, TELUGU_LETTERS, TELUGU_LEVELS } from '../data/teluguContent.js';
import { formatDate } from '../utils/helpers.js';

export async function renderPrintableSheets(container, { onBack }) {
  const lang = getLanguage();
  const currentClassId = await getSetting('current_class_id');
  const classes = await getAllFromStore('classes');
  const currentClass = classes.find((c) => c.id === currentClassId) || classes[0];
  const students = await getAllFromStore('students');
  const classStudents = students.filter((s) => !currentClassId || s.classId === currentClassId);
  const assessments = await getAllFromStore('assessments');

  container.innerHTML = `
    <div style="max-width: 820px; margin: 0 auto;">
      <!-- Controls Bar (Hidden during actual print) -->
      <div class="card" style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div>
          <h2 class="card-title">
            <span>🖨️</span> ${t('nav_worksheets')}
          </h2>
          <p style="font-size: 0.82rem; color: var(--text-muted);">
            ${t('print_desc')}
          </p>
        </div>

        <div style="display: flex; gap: 8px;">
          <button id="btn-trigger-print" class="btn btn-primary btn-lg">
            <span>🖨️</span> ${t('print_btn')}
          </button>
          <button id="btn-print-back" class="btn btn-outline">
            ← ${t('back_btn')}
          </button>
        </div>
      </div>

      <!-- Printable Document Container (Styled for A4 page fit) -->
      <div class="card" style="padding: 28px; background: #ffffff; border: 2px solid #000000; box-shadow: none;">
        <!-- Header for School Records -->
        <div style="text-align: center; border-bottom: 2px solid #000000; padding-bottom: 12px; margin-bottom: 16px;">
          <h1 style="font-size: 1.4rem; font-weight: 800; color: #000000; font-family: var(--font-telugu);">
            ${t('print_title')}
          </h1>
          <p style="font-size: 0.95rem; font-weight: 600; color: #000000; margin-top: 4px;">
            ${t('school_label')} ${currentClass?.name || 'మండల ప్రాథమిక పాఠశాల'} • ${t('date_label')} ${formatDate(new Date().toISOString(), lang)}
          </p>
        </div>

        <!-- Section 1: Official Class Literacy Roster -->
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 1.05rem; font-weight: 800; border-bottom: 1px solid #000000; padding-bottom: 4px; margin-bottom: 8px; font-family: var(--font-telugu);">
            ${t('section_1_title')}
          </h3>
          <div class="worksheet-table-wrap">
            <table class="worksheet-table" style="width: 100%; min-width: 500px; border-collapse: collapse; font-size: 0.85rem; border: 1px solid #000000;">
              <thead>
                <tr style="background: #f1f5f9; border-bottom: 1px solid #000000;">
                  <th style="border: 1px solid #000000; padding: 6px 8px; text-align: left;">${t('col_code')}</th>
                  <th style="border: 1px solid #000000; padding: 6px 8px; text-align: left;">${t('col_name')}</th>
                  <th style="border: 1px solid #000000; padding: 6px 8px; text-align: left;">${t('col_level')}</th>
                  <th style="border: 1px solid #000000; padding: 6px 8px; text-align: center;">${t('speed_unit')} WCPM</th>
                  <th style="border: 1px solid #000000; padding: 6px 8px; text-align: center;">${t('accuracy_label')} %</th>
                  <th style="border: 1px solid #000000; padding: 6px 8px; text-align: left;">${t('notes_label_short')}</th>
                </tr>
              </thead>
              <tbody>
                ${classStudents.map((std) => {
    const stdAss = assessments
      .filter((a) => a.studentId === std.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    const levelObj = TELUGU_LEVELS.find((l) => l.id === std.currentLevelId);
    const levelDisplay = levelObj ? (lang === 'te' ? levelObj.name_te : levelObj.name_en) : (std.currentLevelName || t('stat_letters'));
    return `
                    <tr>
                      <td style="border: 1px solid #000000; padding: 6px 8px; font-weight: bold;">${std.localCode}</td>
                      <td style="border: 1px solid #000000; padding: 6px 8px;">${std.name}</td>
                      <td style="border: 1px solid #000000; padding: 6px 8px;">${levelDisplay}</td>
                      <td style="border: 1px solid #000000; padding: 6px 8px; text-align: center;">${stdAss?.metrics?.wcpm || '-'}</td>
                      <td style="border: 1px solid #000000; padding: 6px 8px; text-align: center;">${stdAss?.metrics?.accuracyPercentage ? `${stdAss.metrics.accuracyPercentage}%` : '-'}</td>
                      <td style="border: 1px solid #000000; padding: 6px 8px;">${stdAss?.teacherNotes || std.notes || ''}</td>
                    </tr>
                  `;
  }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 2: Student Handwriting & Telugu Letter Practice Grid -->
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 1.05rem; font-weight: 800; border-bottom: 1px solid #000000; padding-bottom: 4px; margin-bottom: 8px; font-family: var(--font-telugu);">
            ${t('section_2_title')}
          </h3>
          <p style="font-size: 0.8rem; margin-bottom: 8px;">
            ${t('writing_hint')}
          </p>
          <div class="worksheet-grid">
            ${TELUGU_LETTERS.slice(0, 16).map((item) => `
              <div style="border: 1px solid #000000; padding: 8px 4px; text-align: center; border-radius: 4px;">
                <div style="font-size: 1.4rem; font-weight: bold; font-family: var(--font-telugu);">${item.letter}</div>
                <div style="height: 24px; border-top: 1px dashed #64748b; margin-top: 4px;"></div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Section 3: Reading Passage Oral Diagnostic Rubric -->
        <div>
          <h3 style="font-size: 1.05rem; font-weight: 800; border-bottom: 1px solid #000000; padding-bottom: 4px; margin-bottom: 8px; font-family: var(--font-telugu);">
            ${t('section_3_title')}: "${lang === 'te' ? TELUGU_PASSAGES[0].title_te : TELUGU_PASSAGES[0].title_en}"
          </h3>
          <div style="font-size: 1.05rem; line-height: 2; padding: 12px; border: 1px dashed #000000; font-family: var(--font-telugu); margin-bottom: 12px;">
            ${TELUGU_PASSAGES[0].text}
          </div>
          <div style="font-size: 0.8rem; display: flex; justify-content: space-between; border-top: 1px solid #000000; padding-top: 6px;">
            <span>${t('total_words_label')} ${TELUGU_PASSAGES[0].wordCount}</span>
            <span>${t('teacher_sig')}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#btn-trigger-print').onclick = () => {
    window.print();
  };

  container.querySelector('#btn-print-back').onclick = onBack;
}
