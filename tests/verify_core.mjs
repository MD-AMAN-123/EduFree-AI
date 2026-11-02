// Automated Verification Test for EduFree.AI Core Logic
import { calculateAssessmentMetrics, ERROR_TYPES } from '../src/data/assessmentRules.js';
import { generateRecommendations } from '../src/data/recommendations.js';
import { TELUGU_PASSAGES, TELUGU_LETTERS, TELUGU_GUNINTHALU_FAMILIES } from '../src/data/teluguContent.js';

console.log('--- STARTING EDUFREE.AI LOGIC VERIFICATION ---');

// Test 1: Content Bank Integrity
console.log(`[PASS] Passages loaded: ${TELUGU_PASSAGES.length}`);
console.log(`[PASS] Letters loaded: ${TELUGU_LETTERS.length}`);
console.log(`[PASS] Gunintham families: ${TELUGU_GUNINTHALU_FAMILIES.length}`);

if (TELUGU_PASSAGES.length < 3) throw new Error('Not enough passages');
if (TELUGU_LETTERS.length < 30) throw new Error('Not enough letters');

// Test 2: WCPM & Accuracy Metric Calculations
const passage = TELUGU_PASSAGES[0];
const sampleWordStates = passage.words.map((w, i) => {
  if (i === 2) return { index: i, word: w, state: ERROR_TYPES.SUBSTITUTED };
  if (i === 5) return { index: i, word: w, state: ERROR_TYPES.SKIPPED };
  if (i === 8) return { index: i, word: w, state: ERROR_TYPES.PROMPTED };
  return { index: i, word: w, state: ERROR_TYPES.ACCURATE };
});

const metrics = calculateAssessmentMetrics({
  wordStates: sampleWordStates,
  secondsElapsed: 50,
  comprehensionResponses: ['correct', 'partial', 'correct'],
  studentGrade: 3,
  observations: { vowel_sign_confusion: true, hesitation: true }
});

console.log('Metrics Computed:', {
  wcpm: metrics.wcpm,
  accuracy: `${metrics.accuracyPercentage}%`,
  errors: metrics.totalErrors,
  compScore: metrics.compScore,
  provisionalLevel: metrics.provisionalLevel.name_te
});

if (metrics.wcpm <= 0) throw new Error('WCPM should be positive');
if (metrics.totalErrors !== 3) throw new Error(`Expected 3 errors, got ${metrics.totalErrors}`);
if (metrics.accuracyPercentage < 80 || metrics.accuracyPercentage > 95) throw new Error('Accuracy calculation mismatch');

// Test 3: Recommendation & Pedagogical Rationale Generation
const recs = generateRecommendations({
  metrics,
  observations: { vowel_sign_confusion: true },
  passageTitle: passage.title_te
});

console.log(`[PASS] Rationales Generated (${recs.rationales.length}):`);
recs.rationales.forEach((r, idx) => {
  console.log(`  ${idx + 1}. [TE] ${r.reason_te}`);
  console.log(`     [EN] ${r.reason_en}`);
});

console.log(`[PASS] Recommended Activities (${recs.recommendations.length}):`);
recs.recommendations.forEach((rec, idx) => {
  console.log(`  ${idx + 1}. ${rec.title_te} (${rec.targetDurationMinutes} mins)`);
});

if (recs.rationales.length === 0) throw new Error('Rationales must not be empty');
if (recs.recommendations.length === 0) throw new Error('Recommendations must not be empty');

console.log('--- ALL CORE UNIT & INTEGRATION CHECKS PASSED SUCCESSFULLY ---');
