// EduFree.AI Teacher Class Dashboard Component
import { t, getLanguage } from '../data/i18n.js';
import { getAllFromStore, putInStore, getSetting, setSetting } from '../storage/db.js';
import { formatDate, getDaysAgo } from '../utils/helpers.js';
import { TELUGU_LEVELS } from '../data/teluguContent.js';
import { icon } from '../utils/icons.js';

export async function renderDashboard(container, { onStartAssessment, onViewProfile, onStartPractice, onOpenAddStudent, onOpenAddClass, onViewSyllabus, onOpenActivities }) {
  const lang = getLanguage();
  const classes = await getAllFromStore('classes');
  let currentClassId = await getSetting('current_class_id', classes[0]?.id || null);

  // If no classes exist, create a default one
  if (!currentClassId && classes.length === 0) {
    const defaultCls = {
      id: 'class_default',
      name: 'ప్రాథమిక పాఠశాల - తరగతి 3 (Primary School - Grade 3)',
      grade: '3',
      createdAt: new Date().toISOString()
    };
    await putInStore('classes', defaultCls);
    currentClassId = defaultCls.id;
    await setSetting('current_class_id', currentClassId);
    classes.push(defaultCls);
  }

  const allStudents = await getAllFromStore('students');
  const classStudents = allStudents.filter((s) => s.classId === currentClassId);
  const assessments = await getAllFromStore('assessments');

  // Compute metrics
  const totalStudents = classStudents.length;
  let assessedCount = 0;
  let needsFollowupCount = 0;

  const levelDistribution = {
    level_1_letters: 0,
    level_2_guninthalu: 0,
    level_3_simple_words: 0,
    level_4_ottulu: 0,
    level_5_passages: 0
  };

  classStudents.forEach((std) => {
    const daysSince = getDaysAgo(std.lastAssessedDate);
    if (std.lastAssessedDate && daysSince <= 30) {
      assessedCount++;
    }
    if (!std.lastAssessedDate || daysSince > 7 || std.currentLevelId === 'level_1_letters') {
      needsFollowupCount++;
    }

    if (levelDistribution[std.currentLevelId] !== undefined) {
      levelDistribution[std.currentLevelId]++;
    } else {
      levelDistribution['level_1_letters']++;
    }
  });

  const unsyncedAssessments = assessments.filter((a) => !a.synced);

  container.innerHTML = `
    <!-- Class Selector Bar -->
    <div class="class-bar">
      <div class="class-picker-wrap">
        <label for="class-select-dropdown" class="class-picker-label">${t('select_class')}:</label>
        <select id="class-select-dropdown" class="class-select" aria-label="${t('select_class')}">
          ${classes.map((cls) => `
            <option value="${cls.id}" ${cls.id === currentClassId ? 'selected' : ''}>
              ${cls.name} (${cls.grade ? `${t('grade_prefix')} ${cls.grade}` : ''})
            </option>
          `).join('')}
        </select>
      </div>

      <div class="class-actions">
        <button id="add-student-btn" class="btn btn-primary btn-sm">
          <span>${icon('userPlus', { size: 15 })}</span> ${t('add_student')}
        </button>
        <button id="add-class-btn" class="btn btn-outline btn-sm">
          <span>${icon('school', { size: 15 })}</span> ${t('add_class')}
        </button>
        <button id="view-scert-btn" class="btn btn-outline btn-sm" title="${t('nav_syllabus')}">
          <span>${icon('syllabus', { size: 15 })}</span> ${t('nav_syllabus')}
        </button>
      </div>
    </div>

    <!-- 4 Stats Cards Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">${totalStudents}</div>
        <div class="stat-label">${t('dash_total_students')}</div>
      </div>

      <div class="stat-card">
        <div class="stat-number" style="color: var(--primary-700);">${assessedCount}</div>
        <div class="stat-label">${t('dash_assessed')}</div>
      </div>

      <div class="stat-card alert">
        <div class="stat-number" style="color: #e11d48;">${needsFollowupCount}</div>
        <div class="stat-label">${t('dash_needs_review')}</div>
      </div>

      <div class="stat-card accent">
        <div class="stat-number" style="color: #d97706;">${unsyncedAssessments.length}</div>
        <div class="stat-label">${t('dash_unsynced')}</div>
      </div>
    </div>

    <!-- Class Skill Level Distribution Bar -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">
          <span>${icon('trending', { size: 20 })}</span> ${t('dash_skill_overview')}
        </h2>
        <span style="font-size: 0.8rem; color: var(--text-muted);">${totalStudents} ${t('students_count')}</span>
      </div>

      <div style="display: flex; height: 18px; border-radius: var(--radius-full); overflow: hidden; background: #e2e8f0; margin-bottom: 12px;" role="progressbar" aria-label="Skill level distribution">
        <div style="width: ${totalStudents ? (levelDistribution.level_1_letters / totalStudents) * 100 : 0}%; background: #e11d48;" title="${t('stat_letters')}: ${levelDistribution.level_1_letters}"></div>
        <div style="width: ${totalStudents ? (levelDistribution.level_2_guninthalu / totalStudents) * 100 : 0}%; background: #ea580c;" title="${t('stat_guninthalu')}: ${levelDistribution.level_2_guninthalu}"></div>
        <div style="width: ${totalStudents ? (levelDistribution.level_3_simple_words / totalStudents) * 100 : 0}%; background: #d97706;" title="${t('stat_simple_words')}: ${levelDistribution.level_3_simple_words}"></div>
        <div style="width: ${totalStudents ? (levelDistribution.level_4_ottulu / totalStudents) * 100 : 0}%; background: #0284c7;" title="${t('stat_ottulu')}: ${levelDistribution.level_4_ottulu}"></div>
        <div style="width: ${totalStudents ? (levelDistribution.level_5_passages / totalStudents) * 100 : 0}%; background: #059669;" title="${t('stat_fluent')}: ${levelDistribution.level_5_passages}"></div>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 0.78rem;">
        <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; border-radius: 50%; background: #e11d48;"></span> ${t('stat_letters')} (${levelDistribution.level_1_letters})</span>
        <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; border-radius: 50%; background: #ea580c;"></span> ${t('stat_guninthalu')} (${levelDistribution.level_2_guninthalu})</span>
        <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; border-radius: 50%; background: #d97706;"></span> ${t('stat_simple_words')} (${levelDistribution.level_3_simple_words})</span>
        <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; border-radius: 50%; background: #0284c7;"></span> ${t('stat_ottulu')} (${levelDistribution.level_4_ottulu})</span>
        <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; border-radius: 50%; background: #059669;"></span> ${t('stat_fluent')} (${levelDistribution.level_5_passages})</span>
      </div>
    </div>

    <!-- Quick Assessment Banner Call-to-Action -->
    <div style="background: linear-gradient(135deg, var(--primary-800) 0%, var(--primary-700) 100%); color: #ffffff; border-radius: var(--radius-lg); padding: 18px 20px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; box-shadow: var(--shadow-md);">
      <div>
        <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 4px; font-family: var(--font-telugu); display: flex; align-items: center; gap: 8px;">
          ${icon('assess', { size: 20, color: '#fde68a' })} ${t('quick_assess_title')}
        </h3>
        <p style="font-size: 0.85rem; opacity: 0.9;">
          ${t('quick_assess_desc')}
        </p>
      </div>
      <button id="quick-start-assess-btn" class="btn btn-accent btn-lg">
        <span>${icon('rocket', { size: 18 })}</span> ${t('dash_start_assessment')}
      </button>
    </div>

    <!-- Exciting Oral & Visual Activities Center CTA Banner -->
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%); color: #ffffff; border-radius: var(--radius-lg); padding: 18px 20px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; box-shadow: 0 4px 14px rgba(16,185,129,0.3); border: 1px solid rgba(255,255,255,0.2);">
      <div style="display: flex; align-items: center; gap: 14px;">
        <span style="display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; background: rgba(255,255,255,0.2); border-radius: 12px;">${icon('activities', { size: 28, color: '#ffffff' })}</span>
        <div>
          <h3 style="font-size: 1.18rem; font-weight: 800; margin-bottom: 4px; font-family: var(--font-telugu), var(--font-body); display: flex; align-items: center; gap: 8px;">
            ${lang === 'te' ? 'విద్యార్థుల కృత్యాల కేంద్రం (Activities Center)' : 'Telugu Oral & Visual Activities Center'}
            <span style="background: #f59e0b; color: #1e1b4b; font-size: 0.7rem; font-weight: 800; padding: 2px 8px; border-radius: 999px; text-transform: uppercase;">NEW</span>
          </h3>
          <p style="font-size: 0.86rem; opacity: 0.95; margin: 0;">
            ${lang === 'te' 
              ? 'చిత్రం-పదం సరిపోల్చడం, తేడా గుర్తించడం, పదాల నిర్మాణం మరియు ఉచ్చారణ కృత్యాలు!'
              : 'Image-Word Matching, Odd One Out, Spell It!, and Oral Listen & Repeat speaking activities!'}
          </p>
        </div>
      </div>
      <button id="dashboard-open-activities-btn" class="btn" style="background: #ffffff; color: #065f46; font-weight: 800; padding: 12px 22px; border-radius: var(--radius-full); border: none; font-size: 0.95rem; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 8px; transition: transform 0.15s;">
        <span>${icon('practice', { size: 18, color: '#065f46' })}</span> ${lang === 'te' ? 'కృత్యాలు ఆడండి' : 'Play Activities'} →
      </button>
    </div>

    <!-- Student Roster Section -->
    <div class="card">
      <div class="card-header roster-header">
        <h2 class="card-title">
          <span>${icon('users', { size: 20 })}</span> ${t('dash_student_roster')}
        </h2>
        <div class="roster-search-wrap">
          <input type="text" id="roster-search-input" placeholder="${t('search_placeholder')}" class="roster-search-field" aria-label="${t('search_placeholder')}">
        </div>
      </div>

      <div class="roster-table-wrap">
        <table class="roster-table" aria-label="Student Roster">
          <thead>
            <tr>
              <th>${t('col_code')}</th>
              <th>${t('col_name')}</th>
              <th>${t('col_level')}</th>
              <th>${t('col_last_assessed')}</th>
              <th style="text-align: right;">${t('col_actions')}</th>
            </tr>
          </thead>
          <tbody id="roster-tbody">
            ${classStudents.map((std) => renderStudentRow(std, assessments, lang)).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Attach event handlers
  container.querySelector('#class-select-dropdown').onchange = async (e) => {
    await setSetting('current_class_id', e.target.value);
    renderDashboard(container, { onStartAssessment, onViewProfile, onStartPractice, onOpenAddStudent, onOpenAddClass });
  };

  container.querySelector('#add-student-btn').onclick = () => onOpenAddStudent(currentClassId);
  container.querySelector('#add-class-btn').onclick = onOpenAddClass;
  container.querySelector('#quick-start-assess-btn').onclick = () => onStartAssessment();

  const scertBtn = container.querySelector('#view-scert-btn');
  if (scertBtn && onViewSyllabus) {
    scertBtn.onclick = onViewSyllabus;
  }

  const actBtn = container.querySelector('#dashboard-open-activities-btn');
  if (actBtn && onOpenActivities) {
    actBtn.onclick = onOpenActivities;
  }

  // Search filter
  const searchInput = container.querySelector('#roster-search-input');
  searchInput.oninput = () => {
    const query = searchInput.value.toLowerCase().trim();
    const rows = container.querySelectorAll('.roster-row');
    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? '' : 'none';
    });
  };

  // Row Action buttons
  container.querySelectorAll('.btn-assess-std').forEach((btn) => {
    btn.onclick = () => onStartAssessment(btn.dataset.studentId);
  });

  container.querySelectorAll('.btn-profile-std').forEach((btn) => {
    btn.onclick = () => onViewProfile(btn.dataset.studentId);
  });

  container.querySelectorAll('.btn-practice-std').forEach((btn) => {
    btn.onclick = () => onStartPractice(btn.dataset.studentId, btn.dataset.levelId);
  });
}

function renderStudentRow(std, assessments, lang = 'te') {
  const stdAssessments = assessments
    .filter((a) => a.studentId === std.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const latest = stdAssessments[0];
  const daysAgo = getDaysAgo(std.lastAssessedDate);
  const needsAttention = !std.lastAssessedDate || daysAgo > 7;

  // Resolve localized level name
  const levelObj = TELUGU_LEVELS.find((l) => l.id === std.currentLevelId);
  const levelDisplay = levelObj ? (lang === 'te' ? levelObj.name_te : levelObj.name_en) : (std.currentLevelName || t('stat_letters'));

  return `
    <tr class="roster-row">
      <td class="roster-col-code" data-label="${t('col_code')}">
        <strong class="roster-code-tag">${std.localCode}</strong>
        ${std.rollNo ? `<span class="roster-roll" style="font-size: 0.78rem; color: var(--text-muted); display: block;">${t('label_roll')}: ${std.rollNo}</span>` : ''}
      </td>
      <td class="roster-col-name" data-label="${t('col_name')}">
        <span class="roster-student-name" style="font-weight: 700; font-size: 0.98rem; font-family: var(--font-telugu);">${std.name}</span>
        ${std.gender ? `<span class="roster-gender-badge" style="font-size: 0.74rem; background: var(--bg-card-subtle); padding: 1px 6px; border-radius: 4px; margin-left: 6px;">${std.gender === 'girl' ? t('girl') : t('boy')}</span>` : ''}
      </td>
      <td class="roster-col-level" data-label="${t('col_level')}">
        <span class="level-badge" style="background: var(--primary-100); color: var(--primary-800);">
          ${levelDisplay}
        </span>
        ${latest?.metrics?.wcpm ? `<span class="roster-wcpm-stat" style="font-size: 0.78rem; color: var(--text-muted); display: block; margin-top: 2px;">${latest.metrics.wcpm} WCPM (${latest.metrics.accuracyPercentage}%)</span>` : ''}
      </td>
      <td class="roster-col-date" data-label="${t('col_last_assessed')}">
        <span style="font-size: 0.85rem; color: ${needsAttention ? '#e11d48' : 'var(--text-muted)'}; font-weight: ${needsAttention ? '700' : 'normal'};">
          ${formatDate(std.lastAssessedDate, lang)}
        </span>
        ${needsAttention ? `<span class="roster-attention-flag" style="font-size: 0.72rem; color: #e11d48; display: block;">${t('needs_attention')}</span>` : ''}
      </td>
      <td class="roster-col-actions" data-label="${t('col_actions')}">
        <div class="roster-action-btns">
          <button class="btn btn-primary btn-sm btn-assess-std" data-student-id="${std.id}" title="${t('action_assess')}">
            <span>${icon('assess', { size: 14 })}</span> ${t('action_assess')}
          </button>
          <button class="btn btn-outline btn-sm btn-profile-std" data-student-id="${std.id}" title="${t('action_view_profile')}">
            <span>${icon('trending', { size: 14 })}</span> ${t('action_view_profile')}
          </button>
          <button class="btn btn-accent btn-sm btn-practice-std" data-student-id="${std.id}" data-level-id="${std.currentLevelId || 'level_1_letters'}" title="${t('action_practice')}">
            <span>${icon('practice', { size: 14 })}</span> ${t('action_practice')}
          </button>
        </div>
      </td>
    </tr>
  `;
}
