// EduFree.AI - Developer Profile View
// About the developer page with free education resources

import { getLanguage } from '../data/i18n.js';

export function renderDeveloperView(container, { onBack }) {
  const lang = getLanguage();

  container.innerHTML = `
    <div class="developer-page-container animate-fade-in">

      <!-- Back Button -->
      <button id="dev-back-btn" class="btn btn-outline btn-sm dev-back-btn">
        ← ${lang === 'te' ? 'సెట్టింగ్స్‌కి తిరిగి వెళ్ళు' : 'Back to Settings'}
      </button>

      <!-- Hero Card -->
      <div class="dev-hero-card">
        <!-- Decorative background orbs -->
        <div class="dev-orb dev-orb-1"></div>
        <div class="dev-orb dev-orb-2"></div>
        <div class="dev-orb dev-orb-3"></div>

        <!-- Photo -->
        <div class="dev-photo-ring">
          <div class="dev-photo-wrapper">
            <img
              src="/assets/developer.png"
              alt="Muhammad Aman"
              class="dev-photo"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            />
            <div class="dev-photo-fallback" style="display:none;">👨‍💻</div>
          </div>
        </div>

        <!-- Name & Title -->
        <div class="dev-name-block">
          <h1 class="dev-name">Muhammad Aman</h1>
          <div class="dev-title-badge">
            <span class="dev-title-icon">⚡</span>
            <span>${lang === 'te' ? 'AI పవర్డ్ ఫుల్ స్టాక్ డెవలపర్ & UI/UX డిజైనర్' : 'AI Powered Full Stack Developer & UI/UX Designer'}</span>
          </div>
          <div class="dev-location-badge">
            <span>📍</span>
            <span>${lang === 'te' ? 'తెలంగాణ, భారత్' : 'Telangana, India'}</span>
          </div>
        </div>

        <!-- Social Links -->
        <div class="dev-social-row">
          <a
            href="https://www.linkedin.com/in/muhammadaman-"
            target="_blank"
            rel="noopener noreferrer"
            class="dev-social-btn dev-linkedin-btn"
          >
            <svg class="dev-social-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
            LinkedIn
          </a>
          <a
            href="https://github.com/MD-AMAN-123"
            target="_blank"
            rel="noopener noreferrer"
            class="dev-social-btn dev-github-btn"
          >
            <svg class="dev-social-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
            </svg>
            GitHub
          </a>
        </div>
      </div>

      <!-- Developer Quote Card -->
      <div class="dev-quote-card">
        <div class="dev-quote-mark dev-quote-open">"</div>
        <blockquote class="dev-quote-text">
          ${lang === 'te'
      ? 'ఈ పిల్లలు మన దేశానికి బలమైన స్తంభాలు అని నేను నమ్ముతున్నాను. వారి విద్య మన బాధ్యత.'
      : 'I believe that these children are the strong pillars for our whole country. Their education is our responsibility.'}
        </blockquote>
        <div class="dev-quote-mark dev-quote-close">"</div>
        <div class="dev-quote-author">— Muhammad Aman</div>
        <div class="dev-quote-sub">
          ${lang === 'te' ? 'EduFree.AI వ్యవస్థాపకుడు & డెవలపర్' : 'Founder & Developer, EduFree.AI'}
        </div>
      </div>

      <!-- Mission Card -->
      <div class="dev-mission-card">
        <div class="dev-mission-icon">🎯</div>
        <div class="dev-mission-text">
          <h3>${lang === 'te' ? 'మిషన్' : 'Mission'}</h3>
          <p>
            ${lang === 'te'
      ? 'తెలంగాణ గ్రామీణ విద్యార్థులకు నాణ్యమైన, AI-ఆధారిత, ఉచిత విద్యను అందించడం — ఇంటర్నెట్ లేకపోయినా కూడా!'
      : 'Deliver quality, AI-powered, free education to rural Telangana students — even without internet!'}
          </p>
        </div>
      </div>

      <!-- Free Education Resources Section -->
      <div class="dev-section-header">
        <span class="dev-section-icon">📚</span>
        <div>
          <h2 class="dev-section-title">${lang === 'te' ? 'ఉచిత విద్యా వనరులు' : 'Free Education Resources'}</h2>
          <p class="dev-section-sub">${lang === 'te' ? 'విద్యార్థులకు ఉపయోగపడే ఉత్తమ ఉచిత వెబ్‌సైట్లు & యాప్‌లు' : 'Best free websites & apps for students to learn'}</p>
        </div>
      </div>

      <div class="dev-edu-grid">

        <!-- DIKSHA -->
        <div class="dev-edu-card dev-edu-card--green">
          <div class="dev-edu-card-top">
            <span class="dev-edu-emoji">🇮🇳</span>
            <div class="dev-edu-badge">Government</div>
          </div>
          <h3 class="dev-edu-title">DIKSHA Portal</h3>
          <p class="dev-edu-desc">${lang === 'te' ? 'భారత ప్రభుత్వ అధికారిక ఉచిత పాఠ్యపుస్తకాలు, వీడియో పాఠాలు 1–12 తరగతి వరకు.' : 'Official Government of India free textbooks, video lessons for Classes 1–12. Supports Telugu medium.'}</p>
          <a href="https://diksha.gov.in" target="_blank" rel="noopener noreferrer" class="dev-edu-link">
            diksha.gov.in →
          </a>
        </div>

        <!-- SWAYAM -->
        <div class="dev-edu-card dev-edu-card--blue">
          <div class="dev-edu-card-top">
            <span class="dev-edu-emoji">🎓</span>
            <div class="dev-edu-badge">Gov. Courses</div>
          </div>
          <h3 class="dev-edu-title">SWAYAM</h3>
          <p class="dev-edu-desc">${lang === 'te' ? 'MHRD ద్వారా ఉచిత ఆన్‌లైన్ కోర్సులు — గణితం, సైన్స్, కంప్యూటర్ సైన్స్ మొదలైనవి.' : 'Free online courses by MHRD — Math, Science, Computer Science and more for school students.'}</p>
          <a href="https://swayam.gov.in" target="_blank" rel="noopener noreferrer" class="dev-edu-link">
            swayam.gov.in →
          </a>
        </div>

        <!-- Khan Academy -->
        <div class="dev-edu-card dev-edu-card--orange">
          <div class="dev-edu-card-top">
            <span class="dev-edu-emoji">🌟</span>
            <div class="dev-edu-badge">World Class</div>
          </div>
          <h3 class="dev-edu-title">Khan Academy</h3>
          <p class="dev-edu-desc">${lang === 'te' ? 'ప్రపంచ స్థాయి ఉచిత విద్య — గణితం, సైన్స్, చదవడం. పూర్తిగా ఉచితం!' : 'World-class free education — Math, Science, Reading. 100% free with practice exercises.'}</p>
          <a href="https://khanacademy.org" target="_blank" rel="noopener noreferrer" class="dev-edu-link">
            khanacademy.org →
          </a>
        </div>

        <!-- freeCodeCamp -->
        <div class="dev-edu-card dev-edu-card--purple">
          <div class="dev-edu-card-top">
            <span class="dev-edu-emoji">💻</span>
            <div class="dev-edu-badge">Coding</div>
          </div>
          <h3 class="dev-edu-title">freeCodeCamp</h3>
          <p class="dev-edu-desc">${lang === 'te' ? 'కోడింగ్ ఉచితంగా నేర్చుకోండి — వెబ్ డెవలప్‌మెంట్, పైథాన్, డేటా సైన్స్ అన్నీ ఉచితం!' : 'Learn coding free — Web Development, Python, Data Science. Get certifications for free!'}</p>
          <a href="https://freecodecamp.org" target="_blank" rel="noopener noreferrer" class="dev-edu-link">
            freecodecamp.org →
          </a>
        </div>

        <!-- e-Pathshala -->
        <div class="dev-edu-card dev-edu-card--teal">
          <div class="dev-edu-card-top">
            <span class="dev-edu-emoji">📖</span>
            <div class="dev-edu-badge">NCERT</div>
          </div>
          <h3 class="dev-edu-title">e-Pathshala (NCERT)</h3>
          <p class="dev-edu-desc">${lang === 'te' ? 'NCERT పాఠ్యపుస్తకాలు, వీడియోలు, ఆడియో పాఠాలు — అన్నీ ఉచితంగా డౌన్‌లోడ్ చేయవచ్చు.' : 'NCERT textbooks, videos, audio lessons — all downloadable free. Works offline too!'}</p>
          <a href="https://epathshala.nic.in" target="_blank" rel="noopener noreferrer" class="dev-edu-link">
            epathshala.nic.in →
          </a>
        </div>

        <!-- YouTube Learning -->
        <div class="dev-edu-card dev-edu-card--red">
          <div class="dev-edu-card-top">
            <span class="dev-edu-emoji">▶️</span>
            <div class="dev-edu-badge">Video</div>
          </div>
          <h3 class="dev-edu-title">YouTube Learning</h3>
          <p class="dev-edu-desc">${lang === 'te' ? 'తెలుగు మీడియం పాఠాలు YouTube లో ఉచితంగా చూడవచ్చు — Mana Badi, Vidya TV మొదలైనవి.' : 'Watch Telugu medium lessons free on YouTube — Mana Badi, Vidya TV, and government channels.'}</p>
          <a href="https://youtube.com/c/VidyaTV" target="_blank" rel="noopener noreferrer" class="dev-edu-link">
            youtube.com/VidyaTV →
          </a>
        </div>

      </div>

      <!-- Tips Card -->
      <div class="dev-tips-card">
        <h3 class="dev-tips-title">
          <span>💡</span>
          ${lang === 'te' ? 'EduFree.AI తరగతి గది & వినియోగ చిట్కాలు' : 'EduFree.AI Classroom & Usage Tips'}
        </h3>
        <ul class="dev-tips-list">
          <li>📴 <strong>${lang === 'te' ? '100% ఆఫ్‌లైన్ సాధన:' : '100% Offline Ready:'}</strong> ${lang === 'te' ? 'EduFree.AI పూర్తిగా ఆఫ్‌లైన్‌లో పనిచేస్తుంది — గ్రామీణ బడుల్లో ఇంటర్నెట్ లేకపోయినా పఠన మూల్యాంకనాలు, అక్షర సాధన నిరంతరాయంగా చేయవచ్చు.' : 'EduFree.AI works 100% offline — conduct reading assessments and student practice in rural schools without any internet connection.'}</li>
          <li>🤖 <strong>${lang === 'te' ? 'AI బోధనా మిత్ర చాట్‌బాట్:' : 'AI Teacher Mitra Chatbot:'}</strong> ${lang === 'te' ? 'దిగువ కుడివైపు ఉన్న చాట్‌బాట్‌తో విద్యార్థుల WCPM, కచ్చితత్వం, వెనుకబడిన విద్యార్థులు మరియు తరగతి నివేదికల గురించి నేరుగా తెలుసుకోండి.' : 'Ask the bottom-right AI Chatbot any question about student WCPM, reading accuracy, struggling learners, or class progress reports.'}</li>
          <li>☀️ <strong>${lang === 'te' ? 'సూర్యరశ్మి కాంట్రాస్ట్ మోడ్:' : 'Sunlight Contrast Mode:'}</strong> ${lang === 'te' ? 'పగటి వెలుతురు లేదా ఆరుబయట తరగతి గదుల్లో స్క్రీన్ స్పష్టంగా కనిపించడానికి సెట్టింగ్స్‌లో "పగటి వెలుతురు కాంట్రాస్ట్" ఆన్ చేయండి.' : 'Toggle Sunlight Mode in Settings for ultra-high contrast visibility during bright daytime or outdoor classroom sessions.'}</li>
          <li>🔒 <strong>${lang === 'te' ? 'ఉపాధ్యాయ పిన్ & విద్యార్థి లాక్:' : 'Teacher PIN & Practice Mode:'}</strong> ${lang === 'te' ? 'విద్యార్థులకు మొబైల్ ఇచ్చే ముందు టీచర్ పిన్‌తో లాక్ చేయండి; పిల్లలు స్థాయి 1–5 పఠన అభ్యాసాలను మాత్రమే సురక్షితంగా సాధన చేస్తారు.' : 'Lock the app with Teacher PIN before handing the device to students so they can focus on Level 1–5 reading practice safely.'}</li>
          <li>🔄 <strong>${lang === 'te' ? 'ఆటోమేటిక్ క్లౌడ్ సింక్:' : 'Automatic Cloud Sync:'}</strong> ${lang === 'te' ? 'ఆఫ్‌లైన్ టెస్ట్ రికార్డులు స్థానికంగా సురక్షితంగా నిల్వ చేయబడతాయి; ఇంటర్నెట్ లేదా హాట్‌స్పాట్ దొరికినప్పుడు ఆటోమేటిక్‌గా సింక్ అవుతాయి.' : 'All offline assessment records are stored safely in local storage and automatically sync to Firebase Cloud whenever internet is connected.'}</li>
        </ul>
      </div>

      <!-- Footer -->
      <div class="dev-footer">
        <div class="dev-footer-heart">
          Built with <span class="dev-heart">❤️</span> for Telangana's children
        </div>
        <div class="dev-footer-sub">
          EduFree.AI © 2026 · ${lang === 'te' ? 'అన్ని హక్కులు రక్షించబడ్డాయి' : 'All rights reserved'}
        </div>
      </div>

    </div>
  `;

  container.querySelector('#dev-back-btn').onclick = onBack;
}

