# EduFree.AI — ప్రతీ బిడ్డ చదవాలి (Every Child Reads)
### AI-Powered Offline-First Telugu Reading Assessment, Targeted Literacy & Real-time Analytics Platform for Rural Telangana Schools

[![Platform](https://img.shields.io/badge/Platform-Progressive%20Web%20App%20(PWA)-047857?style=for-the-badge)](https://github.com/)
[![State](https://img.shields.io/badge/State-Telangana%20FLN%20Pilot-f59e0b?style=for-the-badge)](https://github.com/)
[![Storage](https://img.shields.io/badge/Storage-IndexedDB%20%2B%20PostgreSQL-0284c7?style=for-the-badge)](https://github.com/)
[![AI Engine](https://img.shields.io/badge/AI-Gemini%203.8%20Flash%20%2B%20Gemma%204-7c3aed?style=for-the-badge)](https://github.com/)
[![Privacy](https://img.shields.io/badge/Privacy-Zero%20Cloud%20PII-10b981?style=for-the-badge)](https://github.com/)
[![Language](https://img.shields.io/badge/Language-Bilingual%20(Telugu%20%2B%20English)-1e293b?style=for-the-badge)](https://github.com/)

---

## 📑 Table of Contents
1. [Project Overview & Rural Classroom Context](#1-project-overview--rural-classroom-context)
2. [Key Highlights & Unique Innovations](#2-key-highlights--unique-innovations)
3. [Pedagogical Framework (FLN & SCERT Aligned)](#3-pedagogical-framework-fln--scert-aligned)
4. [Dual-Engine AI Architecture (Gemini 3.8 Flash + Gemma 4 Local)](#4-dual-engine-ai-architecture)
5. [Storage & Real-Time Sync Architecture (IndexedDB + PostgreSQL)](#5-storage--real-time-sync-architecture)
6. [Feature Walkthrough & Modules](#6-feature-walkthrough--modules)
7. [Directory Structure & Codebase Map](#7-directory-structure--codebase-map)
8. [Setup, Local Development & Backend Guide](#8-setup-local-development--backend-guide)
9. [PostgreSQL Real-Time Database Setup & SQL Queries](#9-postgresql-real-time-database-setup--sql-queries)
10. [Test Suite & Quality Assurance](#10-test-suite--quality-assurance)
11. [Privacy by Design & Classroom Security](#11-privacy-by-design--classroom-security)
12. [About the Developer](#12-about-the-developer)

---

## 📌 1. Project Overview & Rural Classroom Context

**EduFree.AI** is built specifically for rural government primary schools in Telangana, India (MPPS / ZPHS) under the foundational literacy mission: **"Every Child Reads: Telugu AI Assessment" (ప్రతీ బిడ్డ చదవాలి / తెలుగు పఠన మూల్యాంకనం)**.

### The Real-World Classroom Challenge
In rural Telangana primary schools:
- **Shared Single Device**: Teachers frequently manage multi-grade classrooms (Classes 1 through 5) on a **single shared Android phone or tablet**.
- **Zero or Intermittent Connectivity**: Cellular data is expensive, spotty, or completely absent inside school buildings during teaching hours.
- **Power Cuts & Device Crashes**: Routine electricity outages and mid-session phone reboots must never cause loss of oral assessment progress.
- **Teacher Workload**: Single teachers handle multiple subjects and grades, leaving minimal time for complex paperwork or manual reading level calculations.
- **Diverse Early Literacy Levels**: Students within the same grade vary widely from letter confusion (అక్షర భేదం) to fluid multi-paragraph comprehension.

### The EduFree.AI Solution
EduFree.AI bridges this gap with an ultra-lightweight, 100% offline Progressive Web App (PWA). It empowers teachers with a standardized **1-Minute Oral Reading Fluency (ORF)** assessment, calculates instantaneous **Words Correct Per Minute (WCPM)** and accuracy metrics, provides transparent pedagogical diagnoses aligned with Telangana SCERT guidelines, and syncs all data seamlessly to **PostgreSQL** the moment connection is detected.

---

## ⚡ 2. Key Highlights & Unique Innovations

| Feature | Description |
| :--- | :--- |
| **100% Offline-First (Zero Net Req.)** | Full reading assessments, letter tracing, Gunintham practice, and scoring run locally inside browser IndexedDB. |
| **Dual AI Assistance** | Features **Google Gemini 3.8 Flash** when online for deep analytical reports, and automatically falls back to **Gemma 4 Local Engine** when offline. |
| **1-Minute Timed ORF Assessment** | Teacher-led oral reading fluency evaluation with real-time word-by-word tapping, automated error classification, and WCPM calculation. |
| **PostgreSQL Real-Time Database** | Real-time push synchronization of student records and assessment data to PostgreSQL with conflict-safe offline queueing. |
| **Teacher PIN Lock Mode** | Secure 4-digit PIN (default: `1234`) allows teachers to hand the tablet safely to students for Level 1–5 self-paced practice without risk of roster tampering. |
| **Sunlight High-Contrast Mode** | One-tap ultra-high contrast color palette specifically engineered for outdoor, veranda, and bright rural school classrooms. |
| **100% Complete Bilingual UI** | Instant seamless toggle between **Telugu (తెలుగు)** and **English** with complete 254-key translation coverage across every screen. |
| **Explainable Pedagogical Diagnoses** | Generates transparent, human-readable rule-based rationales explaining *why* a student was placed at a level, with teacher override authority. |
| **Printable Offline Registers** | Instant generation of A4 printable classroom assessment rubrics, letter handwriting tracing sheets, and Headmaster progress registers. |

---

## 📚 3. Pedagogical Framework (FLN & SCERT Aligned)

EduFree.AI strictly follows the **Foundational Literacy and Numeracy (FLN)** and **Telangana SCERT (State Council of Educational Research and Training)** curriculum milestones.

### Reading Proficiency Progression (Levels 1 to 5)

```mermaid
flowchart LR
    L1["స్థాయి 1: అక్షరాలు<br/>Letters & Sounds"] --> L2["స్థాయి 2: గుణింతాలు<br/>Matra Syllables"]
    L2 --> L3["స్థాయి 3: సరళ పదాలు<br/>Simple Non-Conjuncts"]
    L3 --> L4["స్థాయి 4: ఒత్తుల పదాలు<br/>Conjuncts (Ottulu)"]
    L4 --> L5["స్థాయి 5: లఘు పేరాలు<br/>Passage Fluency & Comp."]
```

| Level | Telugu Level Name | Pedagogical Focus | Core Competency & Sample Items |
| :--- | :--- | :--- | :--- |
| **Level 1** | **స్థాయి 1: అక్షరాలు & ధ్వనులు** | Letters & Initial Sounds | Phonemic discrimination of vowels (అచ్చులు: అ, ఆ, ఇ, ఈ...) and consonants (హల్లులు: క, గ, చ, ట...). |
| **Level 2** | **స్థాయి 2: గుణింతాలు (మాత్రలు)** | Diacritic Syllable Discrimination | Combining consonants with vowel signs (తలకట్టు, దీర్ఘం, గుడి, కొమ్ము: క, కా, కి, కీ, కు, కూ...). |
| **Level 3** | **స్థాయి 3: సరళ పదాలు** | Simple Non-Conjunct Words | Reading 2-to-4 letter non-conjunct words with zero diacritic clutter (పలక, కలము, అరక, ఆట, పడవ, నగ). |
| **Level 4** | **స్థాయి 4: ఒత్తుల పదాలు** | Geminates & Consonant Clusters | Dual consonant blends: Geminates (ద్విత్వాక్షరాలు: అమ్మ, చెట్టు) and Clusters (సంయుక్తాక్షరాలు: పుస్తకం, చక్రం). |
| **Level 5** | **స్థాయి 5: లఘు పేరాలు** | Passage Fluency & Comprehension | Fluid reading of graded contextual stories ("మా పల్లె చెరువు", "బడి తోట", "కొమురం భీమ్", "తెలంగాణ వైభవం") with literal & inferential Q&A. |

### Oral Reading Fluency (ORF) Mathematical Formulae

$$\text{Total Words Read} = \text{Accurate Words} + \text{Substituted} + \text{Skipped} + \text{Prompted}$$

$$\text{Words Correct Per Minute (WCPM)} = \frac{\text{Accurate Words}}{\text{Elapsed Time in Seconds} / 60}$$

$$\text{Accuracy Percentage} = \left( \frac{\text{Accurate Words}}{\text{Total Words Read}} \right) \times 100$$

### FLN Grade Benchmarks (End of Year Standards)
* **Class 1**: 15–20 WCPM (Letters & Simple Syllables)
* **Class 2**: 30–35 WCPM (Simple Words & Short Sentences)
* **Class 3**: 45–50 WCPM (Multi-paragraph passages with 90%+ accuracy)
* **Class 4 & 5**: 60+ WCPM (Expressive reading & critical comprehension)

---

## 🤖 4. Dual-Engine AI Architecture

EduFree.AI introduces an innovative hybrid AI model designed specifically for rural intermittent connectivity:

```mermaid
flowchart TD
    UserQuery["Teacher Query / Analytics Request"] --> NetCheck{"Is Device Online &<br/>Gemini Key Present?"}
    NetCheck -- "YES (Online)" --> Gemini["Google Gemini 3.8 Flash<br/>- Deep Class Synthesis<br/>- Pedagogical Strategy<br/>- Complex Longitudinal Analysis"]
    NetCheck -- "NO (Offline / Spurious Net)" --> GemmaLocal["Gemma 4 Local Engine<br/>- Client-side Rule & Pattern AI<br/>- Instant Student Metrics<br/>- Zero Network Required"]
    Gemini --> ChatUI["Teacher Mitra Chatbot<br/>(బోధనా మిత్ర)"]
    GemmaLocal --> ChatUI
```

### 1. Online Engine: Google Gemini 3.8 Flash
* **Model**: `gemini-3.8-flash` (via official REST endpoint `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent`).
* **Capabilities**:
  * Ingests full classroom rosters, historical assessment sessions, and WCPM distributions.
  * Formulates personalized lesson plans and intervention groups for struggling learners.
  * Responds fluently in either **Telugu (తెలుగు లిపి)** or **English**.
* **Sanitization**: Automatic `_cleanKey()` and role alternation validation ensure 100% reliable 200 OK responses with zero malformed payloads.

### 2. Offline Engine: Gemma 4 Local Offline AI
* **Execution**: 100% in-browser, instantaneous, zero network dependency.
* **Capabilities**:
  * Resolves specific student queries (e.g., *"How is Anitha doing?"*, *"అనిత ప్రగతి ఎలా ఉంది?"*).
  * Evaluates class summary stats (*"How many students are there?"*, *"తరగతి నివేదిక"*).
  * Automatically detects struggling readers needing remedial intervention.
  * Explains WCPM formulas, benchmark standards, and assessment administration guidelines.

---

## 🐘 5. Storage & Real-Time Sync Architecture

EduFree.AI treats local IndexedDB as the single source of truth for immediate classroom interactions, backed by a real-time PostgreSQL synchronization engine.

```mermaid
flowchart LR
    subgraph Browser ["Client PWA (Android / Laptop)"]
        UI["Teacher / Student UI"] --> DB[("IndexedDB<br/>edufree_offline_db")]
        DB --> SyncQueue["Sync Queue Engine"]
    end
    
    subgraph NetworkBridge ["Network Boundary"]
        SyncQueue -- "Realtime WebSocket / REST" --> PGServer["Node.js Sync Server<br/>(port 5000)"]
    end
    
    subgraph Database ["Cloud / Local Server"]
         "Supabase (sql)"
    end
```

### IndexedDB Object Stores (`edufree_offline_db`)
1. **`classes`**: Grade, section, academic year, and school ID.
2. **`students`**: Student UUID, roll code (e.g. `TS-3A-01`), name, current FLN reading level, notes.
3. **`assessments`**: Granular word-level interaction states, errors array, WCPM, accuracy, date.
4. **`practiceLogs`**: Flashcard attempts, gunintham completions, time spent.
5. **`syncQueue`**: Ordered FIFO queue of pending mutations (`create`, `update`, `delete`).
6. **`settings`**: PIN code, app mode, language, high contrast, API keys.

### Supabase(SQL) Real-Time Sync
* Whenever a student is added/updated or an assessment is conducted:
  1. The record is instantly committed to IndexedDB (0ms latency, works offline).
  2. If the device is online, `syncStudentRealtime()` and `syncAssessmentRealtime()` fire a direct REST/WebSocket push to the PostgreSQL backend.
  3. If offline, the mutation queues in `syncQueue` and automatically flushes in batch to PostgreSQL the moment connection returns.

---

## 🖥️ 6. Feature Walkthrough & Modules

### 1. Class Dashboard (`classDashboard.js`)
* **Live Roster Table**: Displays roll number, student name (Telugu/English), current FLN reading level, last assessed date, and quick action buttons.
* **Summary Metrics**: Real-time counter of total students, assessed students, class average WCPM, and accuracy rate.
* **Level Distribution Bar**: Visual representation of students across Levels 1 through 5.
* **Instant Search & Filter**: Filter by name, code, or level.

### 2. Oral Reading Assessment Module (`assessmentView.js`)
* **One-Minute Countdown Timer**: Starts with a tone; automatically stops at 60 seconds (or allows manual early finish).
* **Interactive Word-by-Word Marking**:
  * Tap once: **Accurate (గ్రీన్ - సరైనది)**
  * Tap twice: **Substituted / Mispronounced (ఎరుపు - మార్చిన పదం)**
  * Tap three times: **Skipped (పసుపు - వదిలేసిన పదం)**
  * Tap four times: **Teacher Prompted (నీలం - ఉపాధ్యాయ సహాయం)**
* **Auto-Save Draft Engine**: In-progress assessment state auto-saves to `localStorage` every 2 seconds. A phone call or accidental browser closure loses zero data!
* **Transparent Result Card**: Shows final WCPM, accuracy %, error count, provisional level, and explainable rationale.

### 3. Interactive Practice Module (`practiceModule.js`)
* **Level 1 (Letters)**: Visual flashcards with Telugu vowels, consonants, and harmonic audio feedback.
* **Level 2 (Gunintham Wheel)**: Interactive circular dial combining any consonant with any matra to pronounce and display the syllable.
* **Level 3 (Simple Words)**: High-frequency non-conjunct Telugu word cards with audio assistance.
* **Level 4 (Ottulu)**: Conjunct words with visual breakdown into root consonant and ottu.
* **Level 5 (Passages)**: Graded reading passages with sentence-by-sentence read-along and comprehension quiz.

### 4. Student Longitudinal Profile (`studentProfile.js`)
* Complete assessment history timeline with WCPM growth graphs over weeks and months.
* Detailed analysis of recurring error patterns (e.g., specific matra confusion, vowel length errors).
* Tailored remedial recommendations tailored to the child's exact weaknesses.

### 5. Floating AI Chatbot "Teacher Mitra" (`chatbot.js`)
* Circular floating avatar in the bottom-right corner.
* Quick-action chips: `📊 Class Report`, `⚠️ Who Needs Help?`, `👧 Student Progress`, `⏱️ WCPM Benchmarks`.
* Seamlessly calls **Google Gemini 3.8 Flash** when online and **Gemma 4 Local Engine** when offline.

### 6. Full Settings & System Controls (`settingsView.js`)
* **Teacher / Practice Mode**: Switch between student practice mode and full teacher mode with 4-digit PIN protection.
* **Sunlight Contrast Mode**: High-contrast theme toggle for daylight outdoor visibility.
* **Bilingual Switcher**: Switch instantly between Telugu and English.
* **Google Gemini API Key Config**: Input and save API key with a live offline simulator toggle.
* **Supabase(SQL) Real-Time Database Card**: Live server status indicator, connection string configuration, "Test Connection" button, and one-click "Sync All to Postgres" button.
* **Developer Tile**: One-click navigation to the Developer Profile page.

### 7. Developer Profile Page (`developerView.js`)
* Profile of the developer: **Muhammad Aman** (AI Powered Full Stack Developer & UI/UX Designer).
* Animated glowing multi-color ring photo container with Muhammad Aman's photograph.
* Direct links to **LinkedIn** (`https://www.linkedin.com/in/muhammadaman-`) and **GitHub** (`https://github.com/MD-AMAN-123`).
* Inspiring Developer Quote:
  > *"I believe that these children are the strong pillars for our whole country. Their education is our responsibility."*  
  > *(Telugu: "ఈ పిల్లలు మన దేశానికి బలమైన స్తంభాలు అని నేను నమ్ముతున్నాను. వారి విద్య మన బాధ్యత.")*
* **Free Education Resources Section**: Direct links to DIKSHA, SWAYAM, Khan Academy, freeCodeCamp, e-Pathshala, and YouTube Learning.
* **EduFree.AI Classroom & Usage Tips**: Practical recommendations for teachers using the application in rural schools.

---

## 📁 7. Directory Structure & Codebase Map

```text
EduFree.AI/
├── backend/                              # Backend PostgreSQL Bridge Server
│   ├── postgresServer.js                 # Node.js HTTP/REST/WebSocket server for PostgreSQL sync
│   └── schema.sql                        # Production PostgreSQL DDL schema & triggers
├── frontend/                             # Frontend Progressive Web App
│   ├── index.html                        # App HTML shell with viewport, fonts, and meta tags
│   ├── public/                           # Static assets served at root
│   │   ├── assets/
│   │   │   ├── developer.jpg             # Muhammad Aman developer photo
│   │   │   └── edufree-logo.png          # EduFree.AI official logo
│   │   ├── favicon.svg                   # Browser favicon
│   │   ├── manifest.webmanifest          # PWA installation manifest
│   │   └── sw.js                         # Service Worker for offline asset caching
│   └── src/
│       ├── main.js                       # Application router & bootstrap coordinator
│       ├── style.css                     # Complete design system, themes, and animations
│       ├── components/                   # UI View Components
│       │   ├── activitiesModule.js       # Remedial learning activities & games
│       │   ├── assessmentView.js         # 1-minute oral reading assessment engine
│       │   ├── authModal.js              # Firebase auth modal & user profiles
│       │   ├── chatbot.js                # Floating AI Teacher Mitra widget
│       │   ├── classDashboard.js         # Teacher dashboard with student roster & stats
│       │   ├── developerView.js          # Developer profile, links, & educational resources
│       │   ├── guidelinesModal.js        # ORF assessment administration guide
│       │   ├── navbar.js                 # Global navigation header with status indicators
│       │   ├── pinModal.js               # 4-digit security PIN modal
│       │   ├── practiceModule.js         # Student practice module (Levels 1 to 5)
│       │   ├── printableSheet.js         # A4 printable rubrics & registers
│       │   ├── rosterModal.js            # Add Student & Add Class dialogs
│       │   ├── scertSyllabusView.js      # Telangana SCERT curriculum reference
│       │   ├── settingsView.js           # Full settings page with PostgreSQL & Gemini cards
│       │   ├── studentProfile.js         # Individual student longitudinal analytics
│       │   └── syncModal.js              # Manual sync & queue inspect modal
│       ├── data/                         # Pedagogical Content & Rules
│       │   ├── assessmentRules.js        # WCPM & accuracy calculation formulas
│       │   ├── i18n.js                   # 254-key Telugu/English bilingual dictionary
│       │   ├── recommendations.js        # Explainable rule-based pedagogical rationale generator
│       │   ├── scertSyllabus.js          # SCERT competency mappings for Classes 1–5
│       │   └── teluguContent.js          # Telugu letters, guninthalu, words, and passages corpus
│       ├── services/                     # External Integrations & APIs
│       │   ├── firebaseAuth.js           # Firebase Auth & Firestore client
│       │   ├── geminiService.js          # Google Gemini 3.8 Flash API integration
│       │   ├── gemma4Offline.js          # Gemma 4 Local Offline AI engine
│       │   └── postgresService.js        # PostgreSQL client synchronization service
│       ├── storage/                      # Persistence & Storage
│       │   ├── db.js                     # IndexedDB offline storage layer with auto-seed
│       │   ├── exportImport.js           # JSON backup/restore & UTF-8 BOM CSV export
│       │   └── syncQueue.js              # Conflict-safe mutation sync queue
│       └── utils/                        # Audio & Helpers
│           ├── helpers.js                # String, date, and metrics utility functions
│           └── speechAudio.js            # Telugu TTS synthesis with Web Audio harmonic tones
├── tests/                                # Automated Test Suites
│   ├── verify_core.mjs                   # Assessment logic, WCPM, & FLN level checks
│   ├── verify_i18n.mjs                   # Bilingual key parity & translation coverage
│   ├── verify_chatbot.mjs                # Gemini 3.8 Flash & Gemma 4 offline query verification
│   ├── verify_postgres.mjs               # PostgreSQL configuration, schema, & sync tests
│   └── verify_audio.mjs                  # Web Audio harmonic synthesis verification
├── .env                                  # Environment variables (API keys, DB connection)
├── package.json                          # Dependencies & build scripts
└── README.md                             # Comprehensive project documentation
```

---

## 🚀 8. Setup, Local Development & Backend Guide

### Prerequisites
* **Node.js**: v18.0.0 or higher (tested and verified on Node.js v24.2.0)
* **npm**: v9.0.0 or higher
* **PostgreSQL** *(optional, for cloud sync)*: v14, v15, or v16 (local or cloud like Neon / Supabase)

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/MD-AMAN-123/EduFree.AI.git
cd EduFree.AI

# Install all dependencies
npm install
```

### 2. Environment Configuration
Create or edit `.env` in the project root:
```env
# Google Gemini API Key (get free from https://aistudio.google.com)
VITE_GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere

# PostgreSQL Connection String (default local: port 5432)
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/edufree_students
```

### 3. Start the Frontend Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Start the PostgreSQL Sync Server
In a separate terminal:
```bash
npm run server:pg
```
Server will start on `http://localhost:5000` and automatically connect to your PostgreSQL instance.

### 5. Production Build
```bash
npm run build
```
Creates an optimized, minified production build in the `dist/` directory.

---

## 🐘 9. SQL Real-Time Database Setup & SQL Queries

  Useful SQL Queries for School Analytics

#### 1. View all student reading levels:
```sql
SELECT id, name, local_code, current_level_name, last_assessed_date 
FROM students 
ORDER BY name ASC;
```

#### 2. Identify students who need extra reading support (Level 1 & 2):
```sql
SELECT name, local_code, current_level_name, notes 
FROM students 
WHERE current_level_id IN ('level_1_letters', 'level_2_guninthalu');
```

#### 3. View latest assessment scores with accuracy & WCPM:
```sql
SELECT 
  s.name, 
  s.local_code,
  a.wcpm, 
  a.accuracy, 
  a.errors, 
  a.provisional_level, 
  a.date 
FROM assessments a
JOIN students s ON a.student_id = s.id
ORDER BY a.date DESC;
```

#### 4. Calculate class-wide average WCPM & accuracy:
```sql
SELECT 
  COUNT(DISTINCT student_id) AS total_students_assessed,
  ROUND(AVG(wcpm), 1) AS class_avg_wcpm, 
  ROUND(AVG(accuracy), 1) AS class_avg_accuracy 
FROM assessments;
```

---

## 🧪 10. Test Suite & Quality Assurance

EduFree.AI includes an extensive automated verification test suite located in `tests/`:

```bash
# 1. Verify Core Assessment Logic & WCPM Calculations
node tests/verify_core.mjs

# 2. Verify 100% Bilingual Translation Key Parity
node tests/verify_i18n.mjs

# 3. Verify Gemini 3.8 Flash & Gemma 4 AI Chatbot
node tests/verify_chatbot.mjs

# 4. Verify PostgreSQL Schema, Configuration & Sync
node tests/verify_postgres.mjs
```

### Run All Tests Simultaneously:
```bash
node tests/verify_core.mjs; node tests/verify_i18n.mjs; node tests/verify_chatbot.mjs; node tests/verify_postgres.mjs
```
*Result: 100% pass across all test suites.*

---

## 🔒 11. Privacy by Design & Classroom Security

* **Zero Cloud PII Leakage**: No Aadhaar numbers, fingerprints, student face photos, parent phone numbers, or residential addresses are ever collected or stored.
* **Anonymous Identifiers**: Students are indexed by school roll codes (e.g., `TS-3A-01`, `TS-3A-02`).
* **Teacher PIN Gate**: Access to class rosters, student deletion, and assessment grading is locked behind a 4-digit PIN (default: `1234`).
* **Safe Handover to Children**: Teachers can safely hand their mobile phone or tablet to a student in "Student Practice Mode" with full confidence that class records cannot be altered.
* **Offline Data Sovereignty**: All data remains on the physical device unless the school administrator explicitly configures cloud sync or downloads a JSON backup.

---

## 👨‍💻 12. About the Developer

**EduFree.AI** is created and developed by:

### **Muhammad Aman**
* **Role**: AI Powered Full Stack Developer & UI/UX Designer
* **Location**: Telangana, India
* **LinkedIn**: [linkedin.com/in/muhammadaman-](https://www.linkedin.com/in/muhammadaman-)
* **GitHub**: [github.com/MD-AMAN-123](https://github.com/MD-AMAN-123)

> *"I believe that these children are the strong pillars for our whole country. Their education is our responsibility."*  
> — **Muhammad Aman**

---

### 📄 License
This project is dedicated to empowering rural education and foundational literacy under the **MIT License**. Free for all schools, teachers, and educational non-profits.
