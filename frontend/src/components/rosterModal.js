// EduFree.AI Add Student & Add Class Modal
import { t, getLanguage } from '../data/i18n.js';
import { putInStore, getAllFromStore, setSetting } from '../storage/db.js';
import { generateId } from '../utils/helpers.js';
import { queueMutation } from '../storage/syncQueue.js';

export async function openAddStudentModal(currentClassId, onStudentAdded) {
  const lang = getLanguage();
  const allStudents = await getAllFromStore('students');
  const classStudents = allStudents.filter((s) => s.classId === currentClassId);
  const nextSeq = classStudents.length + 1;
  const autoCode = `TS-3A-${String(nextSeq).padStart(2, '0')}`;

  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.setAttribute('role', 'dialog');
  modalOverlay.setAttribute('aria-modal', 'true');
  modalOverlay.setAttribute('aria-label', t('add_student'));

  modalOverlay.innerHTML = `
    <div class="modal-content">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 10px; margin-bottom: 16px;">
        <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--primary-900); font-family: var(--font-telugu);">
          ➕ ${t('add_student')}
        </h3>
        <button id="modal-close-btn" class="btn btn-outline btn-sm" aria-label="Close dialog">✕</button>
      </div>

      <form id="add-student-form">
        <div class="form-group">
          <label class="form-label" for="std-local-code">${t('student_code')} (${t('auto_code_label')}):</label>
          <input type="text" id="std-local-code" class="form-input" value="${autoCode}" required>
          <span style="font-size: 0.72rem; color: var(--text-muted);">${t('privacy_code_hint')}</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="std-name">${t('student_name')} *:</label>
          <input type="text" id="std-name" class="form-input te-text" placeholder="${t('example_name_hint')}" required>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label class="form-label" for="std-roll">${t('roll_number')}:</label>
            <input type="text" id="std-roll" class="form-input" placeholder="${nextSeq}">
          </div>

          <div class="form-group">
            <label class="form-label" for="std-grade">${t('grade_level')}:</label>
            <select id="std-grade" class="form-input">
              <option value="1">1 ${t('grade_unit')}</option>
              <option value="2">2 ${t('grade_unit')}</option>
              <option value="3" selected>3 ${t('grade_unit')}</option>
              <option value="4">4 ${t('grade_unit')}</option>
              <option value="5">5 ${t('grade_unit')}</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">${t('gender')}:</label>
          <div style="display: flex; gap: 12px;">
            <label style="display: flex; align-items: center; gap: 4px; font-size: 0.88rem; cursor: pointer;">
              <input type="radio" name="std-gender" value="boy" checked> ${t('boy')}
            </label>
            <label style="display: flex; align-items: center; gap: 4px; font-size: 0.88rem; cursor: pointer;">
              <input type="radio" name="std-gender" value="girl"> ${t('girl')}
            </label>
            <label style="display: flex; align-items: center; gap: 4px; font-size: 0.88rem; cursor: pointer;">
              <input type="radio" name="std-gender" value="other"> ${t('other_gender')}
            </label>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" id="btn-cancel-add-std" class="btn btn-outline">
            ${t('cancel')}
          </button>
          <button type="submit" class="btn btn-primary">
            <span>💾</span> ${t('save')}
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  const closeModal = () => modalOverlay.remove();
  modalOverlay.querySelector('#modal-close-btn').onclick = closeModal;
  modalOverlay.querySelector('#btn-cancel-add-std').onclick = closeModal;

  modalOverlay.querySelector('#add-student-form').onsubmit = async (e) => {
    e.preventDefault();
    const localCode = modalOverlay.querySelector('#std-local-code').value.trim();
    const name = modalOverlay.querySelector('#std-name').value.trim();
    const rollNo = modalOverlay.querySelector('#std-roll').value.trim() || String(nextSeq);
    const grade = modalOverlay.querySelector('#std-grade').value;
    const gender = modalOverlay.querySelector('input[name="std-gender"]:checked')?.value || 'boy';

    if (!name) return;

    const newStudent = {
      id: generateId('std'),
      classId: currentClassId,
      localCode,
      name,
      rollNo,
      grade,
      gender,
      currentLevelId: 'level_1_letters',
      currentLevelName: 'స్థాయి 1: అక్షరాలు & ధ్వనులు',
      lastAssessedDate: null,
      notes: '',
      createdAt: new Date().toISOString()
    };

    await putInStore('students', newStudent);
    await queueMutation({ action: 'create', entity: 'student', entityId: newStudent.id, payload: newStudent });

    closeModal();
    onStudentAdded();
  };
}

export function openAddClassModal(onClassAdded) {
  const lang = getLanguage();
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.setAttribute('role', 'dialog');
  modalOverlay.setAttribute('aria-modal', 'true');
  modalOverlay.setAttribute('aria-label', t('add_class'));

  modalOverlay.innerHTML = `
    <div class="modal-content">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 10px; margin-bottom: 16px;">
        <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--primary-900); font-family: var(--font-telugu);">
          🏫 ${t('add_class')}
        </h3>
        <button id="modal-close-btn" class="btn btn-outline btn-sm" aria-label="Close dialog">✕</button>
      </div>

      <form id="add-class-form">
        <div class="form-group">
          <label class="form-label" for="cls-name">${t('class_name')} *:</label>
          <input type="text" id="cls-name" class="form-input te-text" placeholder="${t('example_class_hint')}" required>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label class="form-label" for="cls-grade">${t('grade_level')}:</label>
            <select id="cls-grade" class="form-input">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4" selected>4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="cls-section">${t('section_optional')}</label>
            <input type="text" id="cls-section" class="form-input" placeholder="A / B">
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" id="btn-cancel-add-cls" class="btn btn-outline">
            ${t('cancel')}
          </button>
          <button type="submit" class="btn btn-primary">
            <span>💾</span> ${t('save')}
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  const closeModal = () => modalOverlay.remove();
  modalOverlay.querySelector('#modal-close-btn').onclick = closeModal;
  modalOverlay.querySelector('#btn-cancel-add-cls').onclick = closeModal;

  modalOverlay.querySelector('#add-class-form').onsubmit = async (e) => {
    e.preventDefault();
    const name = modalOverlay.querySelector('#cls-name').value.trim();
    const grade = modalOverlay.querySelector('#cls-grade').value;
    const section = modalOverlay.querySelector('#cls-section').value.trim() || 'A';

    if (!name) return;

    const newClass = {
      id: generateId('class'),
      name,
      grade,
      section,
      createdAt: new Date().toISOString()
    };

    await putInStore('classes', newClass);
    await setSetting('current_class_id', newClass.id);
    await queueMutation({ action: 'create', entity: 'class', entityId: newClass.id, payload: newClass });

    closeModal();
    onClassAdded();
  };
}
