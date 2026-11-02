// EduFree.AI Learner Profile & Reading Trajectory
import { t, getLanguage } from '../data/i18n.js';
import { getFromStore, getAllFromStore } from '../storage/db.js';
import { formatDate } from '../utils/helpers.js';
import { TELUGU_LEVELS } from '../data/teluguContent.js';

export async function renderStudentProfile(container, { studentId, onBack, onStartAssessment, onStartPractice }) {
  const lang = getLanguage();
  const student = await getFromStore('students', studentId);
  const allAssessments = await getAllFromStore('assessments');
  const studentAssessments = allAssessments
    .filter((a) => a.studentId === studentId)
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Chronological order

  if (!student) {
    container.innerHTML = `<div class="card"><p>${lang === 'te' ? 'విద్యార్థి వివరాలు లభించలేదు.' : 'Student details not found.'}</p><button id="btn-back" class="btn btn-outline">${t('back_btn')}</button></div>`;
    container.querySelector('#btn-back').onclick = onBack;
    return;
  }

  // Calculate level display
  const levelObj = TELUGU_LEVELS.find((l) => l.id === student.currentLevelId);
  const levelDisplay = levelObj ? (lang === 'te' ? levelObj.name_te : levelObj.name_en) : (student.currentLevelName || t('stat_letters'));

  container.innerHTML = `
    <div style="max-width: 800px; margin: 0 auto;">
      <!-- Profile Header -->
      <div class="card" style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--primary-100); display: flex; align-items: center; justify-content: center; font-size: 1.8rem;">
              🎓
            </div>
            <div>
              <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--primary-900); font-family: var(--font-telugu);">
                ${student.name}
              </h2>
              <div style="font-size: 0.85rem; color: var(--text-muted);">
                ${t('student_code')}: <strong>${student.localCode}</strong> • ${t('label_roll')}: ${student.rollNo || '-'} • ${t('grade_prefix')} ${student.grade || '3'}
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 8px;">
            <button id="btn-profile-assess-now" class="btn btn-primary btn-sm">
              <span>📖</span> ${t('action_assess')}
            </button>
            <button id="btn-profile-practice" class="btn btn-accent btn-sm">
              <span>🎯</span> ${t('action_practice')}
            </button>
            <button id="btn-profile-back" class="btn btn-outline btn-sm">
              ← ${t('back_btn')}
            </button>
          </div>
        </div>

        <!-- Current Status Chip -->
        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-light); display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 0.82rem; color: var(--text-muted); font-weight: 600;">${t('dash_current_level')}:</span>
          <span class="level-badge" style="background: var(--primary-100); color: var(--primary-800); font-size: 0.88rem;">
            ${levelDisplay}
          </span>
        </div>
      </div>

      <!-- Reading Fluency (WCPM) Trajectory Chart -->
      <div class="card">
        <h3 class="card-title" style="margin-bottom: 14px;">
          <span>📈</span> ${t('profile_chart_title')}
        </h3>

        ${studentAssessments.length === 0 ? `
          <p style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 20px;">
            ${t('profile_empty_history')}
          </p>
        ` : `
          <!-- Bar Graph Rendering for WCPM Progression -->
          <div style="display: flex; align-items: flex-end; gap: 20px; height: 180px; padding: 10px 10px 30px; border-bottom: 2px solid var(--border-strong); margin-bottom: 10px;">
            ${studentAssessments.map((as) => {
              const heightPct = Math.min(Math.round((as.metrics.wcpm / 80) * 100), 100);
              return `
                <div style="display: flex; flex-direction: column; align-items: center; flex: 1; height: 100%; justify-content: flex-end;">
                  <span style="font-size: 0.82rem; font-weight: 700; color: var(--primary-800); margin-bottom: 4px;">
                    ${as.metrics.wcpm}
                  </span>
                  <div 
                    style="width: 100%; max-width: 44px; height: ${Math.max(heightPct, 8)}%; background: linear-gradient(180deg, var(--primary-500) 0%, var(--primary-700) 100%); border-radius: 6px 6px 0 0;"
                    title="${as.passageTitle} • ${as.metrics.wcpm} WCPM • ${formatDate(as.date, lang)}"
                  ></div>
                  <span style="font-size: 0.72rem; color: var(--text-muted); margin-top: 6px; white-space: nowrap;">
                    ${formatDate(as.date, lang)}
                  </span>
                </div>
              `;
            }).join('')}
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-subtle);">
            <span>0 WCPM</span>
            <span>${t('target_wcpm_label')}</span>
            <span>80+ WCPM</span>
          </div>
        `}
      </div>

      <!-- Assessment History List -->
      <div class="card">
        <h3 class="card-title" style="margin-bottom: 12px;">
          <span>📋</span> ${t('profile_history')}
        </h3>

        ${studentAssessments.length === 0 ? `
          <p style="font-size: 0.85rem; color: var(--text-muted);">${t('profile_empty_history')}</p>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${studentAssessments.map((as) => `
              <div style="background: var(--bg-card-subtle); border-radius: var(--radius-md); padding: 14px; border: 1px solid var(--border-light);">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
                  <div style="font-weight: 700; font-size: 1rem; color: var(--primary-900); font-family: var(--font-telugu);">
                    ${as.passageTitle}
                  </div>
                  <span style="font-size: 0.82rem; color: var(--text-muted);">
                    📅 ${formatDate(as.date, lang)}
                  </span>
                </div>

                <div style="display: flex; gap: 14px; flex-wrap: wrap; font-size: 0.85rem; color: var(--text-main); margin-bottom: 6px;">
                  <span><strong>${t('speed_label')}</strong> ${as.metrics.wcpm} WCPM</span>
                  <span><strong>${t('accuracy_label_short')}</strong> ${as.metrics.accuracyPercentage}%</span>
                  <span><strong>${t('errors_label_short')}</strong> ${as.metrics.totalErrors}</span>
                  <span><strong>${t('comp_label_short')}</strong> ${as.metrics.compScore}/${as.metrics.totalCompQuestions}</span>
                </div>

                ${as.teacherNotes ? `
                  <div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic; background: #ffffff; padding: 6px 10px; border-radius: 4px; border-left: 3px solid var(--primary-600); margin-top: 6px;">
                    ${t('notes_label_short')} "${as.teacherNotes}"
                  </div>
                ` : ''}
              </div>
            `).reverse().join('')}
          </div>
        `}
      </div>
    </div>
  `;

  container.querySelector('#btn-profile-back').onclick = onBack;
  container.querySelector('#btn-profile-assess-now').onclick = () => onStartAssessment(studentId);
  container.querySelector('#btn-profile-practice').onclick = () => onStartPractice(studentId, student.currentLevelId);
}
