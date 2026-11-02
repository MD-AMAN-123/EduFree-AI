// EduFree.AI - SCERT & FLN Reading Assessment Guidelines Modal
// Telangana State FLN (Tholi Mettu) Assessment Standards & Rubric

import { t, getLanguage } from '../data/i18n.js';

let modalElement = null;

export function openGuidelinesModal({ onClose, onViewSyllabus } = {}) {
  closeGuidelinesModal();

  const lang = getLanguage();
  const isTe = lang === 'te';

  modalElement = document.createElement('div');
  modalElement.className = 'auth-modal-overlay';
  modalElement.innerHTML = `
    <div class="auth-modal-backdrop" id="guidelines-backdrop"></div>
    <div class="guidelines-modal-card animate-scale-up" role="dialog" aria-labelledby="guidelines-title">
      <div class="guidelines-modal-header">
        <div class="guidelines-title-wrap">
          <span class="guidelines-icon-badge">📋</span>
          <div>
            <h3 id="guidelines-title" class="guidelines-title">
              ${isTe ? 'తెలంగాణ FLN తొలి మెట్టు — పఠన మార్గదర్శకాలు' : 'Telangana FLN Guidelines & Reading Rubric'}
            </h3>
            <p class="guidelines-subtitle">
              ${isTe ? 'ప్రాథమిక పాఠశాలల తెలుగు భాషా అభ్యాస ప్రమాణాలు & మూల్యాంకన విధానం' : 'Foundational Literacy (FLN) Assessment Protocol & Benchmarks'}
            </p>
          </div>
        </div>
        <button id="guidelines-close-btn" class="dialog-close-btn" aria-label="Close">✕</button>
      </div>

      <div class="guidelines-modal-body">
        <!-- 1. The 1-Minute Oral Reading Fluency Protocol -->
        <div class="guideline-card">
          <div class="guideline-card-head">
            <span class="badge-num">1</span>
            <h4>${isTe ? '1-నిమిషం పఠన సమయ నియమం (1-Minute Oral Reading Protocol)' : '1-Minute Oral Reading Protocol'}</h4>
          </div>
          <p>${isTe 
            ? 'విద్యార్థికి స్పష్టమైన తెలుగు పాఠ్యాంశాన్ని అందించండి. ఉపాధ్యాయుడు టైమర్ ప్రారంభించిన వెంటనే బిడ్డ స్వయంగా బిగ్గరగా చదవడం మొదలుపెట్టాలి. ఖచ్చితంగా 60 సెకన్ల తర్వాత విద్యార్థి చివరిగా పలికిన పదం వద్ద గుర్తించండి.' 
            : 'Provide the student with the graded passage. Start the 60-second timer when the student speaks the first word. Stop tracking at exactly 60 seconds.'}</p>
        </div>

        <!-- 2. WCPM Speed & Benchmark Levels -->
        <div class="guideline-card">
          <div class="guideline-card-head">
            <span class="badge-num">2</span>
            <h4>${isTe ? 'FLN నిమిషానికి చదివే పదాల ప్రమాణాలు (WCPM Benchmarks)' : 'FLN Reading Benchmarks (WCPM)'}</h4>
          </div>
          <div class="guideline-table-wrap">
            <table class="guideline-table">
              <thead>
                <tr>
                  <th>${isTe ? 'స్థాయి / తరగతి' : 'Level / Grade'}</th>
                  <th>${isTe ? 'ఖచ్చితమైన పదాలు (WCPM)' : 'Target WCPM'}</th>
                  <th>${isTe ? 'నైపుణ్య వర్గం' : 'Competency Level'}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>${isTe ? 'స్థాయి 1 (అక్షరాలు)' : 'Level 1 (Letters)'}</strong></td>
                  <td>15 - 25 ${isTe ? 'అక్షరాలు/నిమి' : 'letters/min'}</td>
                  <td><span class="level-badge" style="background:#ecfdf5; color:#065f46;">వర్ణమాల గుర్తింపు</span></td>
                </tr>
                <tr>
                  <td><strong>${isTe ? 'స్థాయి 2 (గుణింతాలు)' : 'Level 2 (Guninthalu)'}</strong></td>
                  <td>20 - 35 ${isTe ? 'అక్షరాలు/నిమి' : 'letters/min'}</td>
                  <td><span class="level-badge" style="background:#eff6ff; color:#1e40af;">గుణింతాలు & సంకేతాలు</span></td>
                </tr>
                <tr>
                  <td><strong>${isTe ? 'స్థాయి 3 (పదాలు)' : 'Level 3 (Words)'}</strong></td>
                  <td>25 - 40 ${isTe ? 'పదాలు/నిమి' : 'words/min'}</td>
                  <td><span class="level-badge" style="background:#fef3c7; color:#92400e;">సరళ & ఒత్తు పదాలు</span></td>
                </tr>
                <tr>
                  <td><strong>${isTe ? 'స్థాయి 4 (వాక్యాలు/కథ)' : 'Level 4 (Fluent)'}</strong></td>
                  <td>40+ ${isTe ? 'పదాలు/నిమి' : 'words/min'}</td>
                  <td><span class="level-badge" style="background:#fdf2f8; color:#9d174d;">ధారాళంగా చదవడం & గ్రహింపు</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3. Error Classification Rubric -->
        <div class="guideline-card">
          <div class="guideline-card-head">
            <span class="badge-num">3</span>
            <h4>${isTe ? 'తప్పుల గుర్తింపు నియమావళి (Scoring Rubric)' : 'Error Scoring Rubric'}</h4>
          </div>
          <ul class="guideline-list">
            <li><strong>${isTe ? 'సరైన పదం (Accurate)' : 'Accurate'}:</strong> ${isTe ? '3 సెకన్లలోపు సరైన ఉచ్చారణతో పలికిన పదం.' : 'Correctly pronounced within 3 seconds.'}</li>
            <li><strong>${isTe ? 'వదిలేసిన పదం (Skipped)' : 'Skipped'}:</strong> ${isTe ? 'పదాన్ని చదవకుండా ముందుకు వెళ్ళినప్పుడు లేదా పూర్తిగా పలకనప్పుడు.' : 'Student skipped or omitted the word.'}</li>
            <li><strong>${isTe ? 'తప్పు పదం (Misread)' : 'Misread'}:</strong> ${isTe ? 'అక్షర దోషం, తప్పుడు గుణింతం లేదా మార్పు చేసిన ఉచ్చారణ.' : 'Incorrect vowel sign or substitute word spoken.'}</li>
            <li><strong>${isTe ? 'సహాయం చేసిన పదం (Prompted)' : 'Prompted'}:</strong> ${isTe ? 'విద్యార్థి 3 సెకన్లు ఆగినప్పుడు ఉపాధ్యాయుడు అందించిన సహాయం.' : 'Teacher provided verbal cue after 3-second pause.'}</li>
          </ul>
        </div>
      </div>

      <div class="guidelines-modal-footer">
        <button id="guidelines-view-syllabus-btn" class="btn btn-primary" style="flex: 1;">
          📚 ${isTe ? 'SCERT సిలబస్ వీక్షించండి (View Syllabus)' : 'Open Full SCERT Syllabus'}
        </button>
        <button id="guidelines-dismiss-btn" class="btn btn-outline">
          ${isTe ? 'మూసివేయి (Close)' : 'Close'}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modalElement);
  document.body.classList.add('modal-open');

  const close = () => {
    closeGuidelinesModal();
    if (onClose) onClose();
  };

  modalElement.querySelector('#guidelines-backdrop').onclick = close;
  modalElement.querySelector('#guidelines-close-btn').onclick = close;
  modalElement.querySelector('#guidelines-dismiss-btn').onclick = close;

  const viewSyllabusBtn = modalElement.querySelector('#guidelines-view-syllabus-btn');
  if (viewSyllabusBtn) {
    viewSyllabusBtn.onclick = () => {
      close();
      if (onViewSyllabus) onViewSyllabus();
    };
  }
}

export function closeGuidelinesModal() {
  if (modalElement && modalElement.parentNode) {
    modalElement.parentNode.removeChild(modalElement);
  }
  modalElement = null;
  document.body.classList.remove('modal-open');
}
