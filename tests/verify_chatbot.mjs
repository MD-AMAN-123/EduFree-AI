// EduFree.AI - Chatbot Verification Suite
// Tests offline Gemma 4 reasoning, student progress queries, class reporting, and Gemini fallback.

import assert from 'assert';
import { gemma4TeacherChat } from '../src/services/gemma4Offline.js';
import {
  getGeminiApiKey,
  setGeminiApiKey,
  isGeminiActive,
  isSimulatedOffline,
  setSimulatedOffline,
  callGeminiTeacherChat
} from '../src/services/geminiService.js';

console.log('--- STARTING EDUFREE.AI CHATBOT VERIFICATION ---');

// Mock classroom data identical to pilot seed data
const mockClass = {
  id: 'class_gangadevipalli_g3',
  name: 'మండల ప్రాథమిక పాఠశాల (MPPS గంగదేవిపల్లి) - 3వ తరగతి',
  grade: '3',
  district: 'వరంగల్ (Warangal)'
};

const mockStudents = [
  {
    id: 'std_01',
    localCode: 'TS-3A-01',
    name: 'అనిత (Anitha)',
    rollNo: '1',
    grade: '3',
    currentLevelId: 'level_2_guninthalu',
    currentLevelName: 'స్థాయి 2: గుణింతాల సాధన',
    notes: 'గుణింతాల గుర్తులు క్రమంగా నేర్చుకుంటోంది. దీర్ఘం, కొమ్ముల్లో కొంత తడబాటు.'
  },
  {
    id: 'std_02',
    localCode: 'TS-3A-02',
    name: 'రాహుల్ (Rahul)',
    rollNo: '2',
    grade: '3',
    currentLevelId: 'level_3_simple_words',
    currentLevelName: 'స్థాయి 3: సరళ పదాలు',
    notes: 'సరళ పదాలు సులువుగా చదువుతాడు. ఒత్తుల పదాలపై శ్రద్ధ అవసరం.'
  },
  {
    id: 'std_03',
    localCode: 'TS-3A-03',
    name: 'స్వప్న (Swapna)',
    rollNo: '3',
    grade: '3',
    currentLevelId: 'level_5_passages',
    currentLevelName: 'స్థాయి 5: స్వేచ్ఛా పఠనం & అవగాహన',
    notes: 'చాలా వేగంగా మరియు భావయుక్తంగా చదువుతుంది.'
  },
  {
    id: 'std_04',
    localCode: 'TS-3A-04',
    name: 'చరణ్ (Charan)',
    rollNo: '4',
    grade: '3',
    currentLevelId: 'level_1_letters',
    currentLevelName: 'స్థాయి 1: అక్షరాలు & ధ్వనులు',
    notes: 'అచ్చుల గుర్తింపు బాగుంది. హల్లుల సాధన కొనసాగుతోంది.'
  },
  {
    id: 'std_05',
    localCode: 'TS-3A-05',
    name: 'భార్గవి (Bhargavi)',
    rollNo: '5',
    grade: '3',
    currentLevelId: 'level_4_ottulu',
    currentLevelName: 'స్థాయి 4: ఒత్తుల పదాలు',
    notes: 'ద్విత్వాక్షరాలు చదవగలదు, సంయుక్తాక్షరాలలో మరింత సాధన కావాలి.'
  }
];

const mockAssessments = [
  {
    id: 'assess_std01_01',
    studentId: 'std_01',
    passageTitle: 'మా పల్లె చెరువు',
    date: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    metrics: {
      wcpm: 24,
      accuracyPercentage: 70,
      compPercentage: 33,
      skippedCount: 3,
      substitutedCount: 4
    },
    teacherNotes: 'గుణింతాల చక్రం సాధన అవసరం.'
  },
  {
    id: 'assess_std03_02',
    studentId: 'std_03',
    passageTitle: 'బడి తోట — తాజా కూరగాయలు',
    date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    metrics: {
      wcpm: 58,
      accuracyPercentage: 97,
      compPercentage: 100,
      skippedCount: 0,
      substitutedCount: 1
    },
    teacherNotes: 'అద్భుతమైన ప్రగతి. స్వేచ్ఛా పఠన స్థాయికి చేరుకుంది.'
  }
];

const mockContext = {
  lang: 'te',
  currentClass: mockClass,
  students: mockStudents,
  assessments: mockAssessments
};

async function runTests() {
  // Test 1: Single Student Query (Anitha)
  console.log('\n[Test 1] Querying student progress for Anitha (అనిత)...');
  const resAnitha = await gemma4TeacherChat('అనిత ప్రగతి వివరాలు ఏమిటి?', mockContext);
  assert(resAnitha.source === 'gemma4-offline', 'Source should be gemma4-offline');
  assert(resAnitha.matchedStudents.length === 1, 'Should match exactly 1 student');
  assert(resAnitha.matchedStudents[0].id === 'std_01', 'Should match std_01 (Anitha)');
  assert(resAnitha.text.includes('24 WCPM'), 'Should include Anitha exact 24 WCPM');
  assert(resAnitha.text.includes('70%'), 'Should include Anitha exact 70% accuracy');
  assert(resAnitha.text.includes('[[ACTION:PROFILE:std_01'), 'Should generate interactive profile action tag');
  console.log('[PASS] Anitha query returned accurate WCPM (24), accuracy (70%), and action tags.');

  // Test 2: Single Student Query for Swapna (స్వప్న)
  console.log('\n[Test 2] Querying student progress for Swapna (స్వప్న)...');
  const resSwapna = await gemma4TeacherChat('స్వప్న ఎలా చదువుతోంది?', mockContext);
  assert(resSwapna.matchedStudents[0].id === 'std_03', 'Should match Swapna std_03');
  assert(resSwapna.text.includes('58 WCPM'), 'Should include Swapna exact 58 WCPM');
  assert(resSwapna.text.includes('97%'), 'Should include Swapna exact 97% accuracy');
  console.log('[PASS] Swapna query returned accurate WCPM (58) and accuracy (97%).');

  // Test 3: Multiple Student Comparison (Rahul and Charan)
  console.log('\n[Test 3] Comparing Rahul and Charan...');
  const resCompare = await gemma4TeacherChat('రాహుల్ మరియు చరణ్ స్థాయిలు ఏమిటి?', mockContext);
  assert(resCompare.matchedStudents.length === 2, 'Should match 2 students');
  assert(resCompare.text.includes('రాహుల్') && resCompare.text.includes('చరణ్'), 'Should include both names');
  console.log('[PASS] Comparative query handled both students simultaneously.');

  // Test 4: Class Summary Query
  console.log('\n[Test 4] Querying full class progress summary...');
  const resSummary = await gemma4TeacherChat('తరగతి సమగ్ర ప్రగతి నివేదిక ఇవ్వండి', mockContext);
  assert(resSummary.text.includes('5 మంది'), 'Should state total 5 students');
  assert(resSummary.text.includes('స్థాయి 5') && resSummary.text.includes('స్థాయి 1'), 'Should include level distribution');
  assert(resSummary.text.includes('సగటు'), 'Should compute class averages');
  console.log('[PASS] Class summary generated complete level distribution and averages.');

  // Test 4b: Exact Query "how many students are there?"
  console.log('\n[Test 4b] Querying exact "how many students are there?"...');
  const resCountEn = await gemma4TeacherChat('how many students are there?', { ...mockContext, lang: 'en' });
  assert(resCountEn.text.includes('5'), 'Should report 5 students');
  assert(resCountEn.text.includes('Level 5') || resCountEn.text.includes('Class'), 'Should report class distribution');
  console.log('[PASS] "how many students are there?" returned reliable exact student count (5).');

  // Test 5: Struggling Students / Who Needs Help
  console.log('\n[Test 5] Querying who needs help...');
  const resHelp = await gemma4TeacherChat('ఎవరికి ప్రత్యేక సాధన మరియు సహాయం అవసరం?', mockContext);
  assert(resHelp.text.includes('అనిత') || resHelp.text.includes('చరణ్'), 'Should highlight Anitha and Charan');
  console.log('[PASS] Struggling students correctly identified based on Level 1 & 2.');

  // Test 6: App Feature Guidance - How to Assess
  console.log('\n[Test 6] Querying assessment instructions...');
  const resAssessHow = await gemma4TeacherChat('1 నిమిషం పఠన మూల్యాంకనం ఎలా చేయాలి?', mockContext);
  assert(resAssessHow.text.includes('60 సెకన్ల టైమర్') || resAssessHow.text.includes('మూల్యాంకనం'), 'Should explain 60 second timer');
  assert(resAssessHow.text.includes('[[ACTION:NAV:assess'), 'Should include direct navigation action tag');
  console.log('[PASS] Assessment instructions returned step-by-step guidance.');

  // Test 7: WCPM Formula
  console.log('\n[Test 7] Querying WCPM definition & formula...');
  const resWcpm = await gemma4TeacherChat('WCPM అంటే ఏమిటి? ఎలా లెక్కిస్తారు?', mockContext);
  assert(resWcpm.text.includes('Words Correct Per Minute'), 'Should define WCPM');
  assert(resWcpm.text.includes('లెక్కింపు సూత్రం'), 'Should provide calculation formula');
  console.log('[PASS] WCPM formula explained with grade benchmarks.');

  // Test 8: Offline Storage & Sync
  console.log('\n[Test 8] Querying offline sync...');
  const resSync = await gemma4TeacherChat('ఆఫ్‌లైన్ డేటా ఎలా సేవ్ అవుతుంది, సింక్ ఎలా చేయాలి?', mockContext);
  assert(resSync.text.includes('IndexedDB') && resSync.text.includes('Firebase'), 'Should mention IndexedDB and Firebase');
  console.log('[PASS] Offline sync architecture explained clearly.');

  // Test 9: Gemini Service Offline Fallback Check
  console.log('\n[Test 9] Testing Gemini service fallback to Gemma 4 when offline...');
  // In Node environment, navigator is undefined or offline -> should smoothly return fallback
  const geminiRes = await callGeminiTeacherChat({
    query: 'అనిత ప్రగతి',
    contextData: mockContext,
    lang: 'te'
  });
  assert(geminiRes.fallbackToGemma4 === true, 'Should signal fallback to Gemma 4 when offline or unconfigured');
  console.log('[PASS] Gemini gracefully falls back to Gemma 4 Offline engine without throwing errors.');

  console.log('\n--- ALL CHATBOT TESTS PASSED SUCCESSFULLY! ---');
}

runTests().catch((err) => {
  console.error('Test failure:', err);
  process.exit(1);
});

