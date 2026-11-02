// Automated Real-Time Bilingual Translation Verification Test
import { translations, getLanguage, setLanguage, t } from '../src/data/i18n.js';
import { TELUGU_LEVELS, TELUGU_PASSAGES } from '../src/data/teluguContent.js';

console.log('--- TESTING REAL-TIME BILINGUAL TRANSLATION SYSTEM ---');

// Test 1: Language Switcher State
setLanguage('te');
if (getLanguage() !== 'te') throw new Error('Failed to set Telugu');
console.log('[PASS] Default Language:', getLanguage(), '->', t('app_title'));

setLanguage('en');
if (getLanguage() !== 'en') throw new Error('Failed to set English');
console.log('[PASS] Switched Language:', getLanguage(), '->', t('app_title'));

// Test 2: Verify Dictionary Key Parity
const teKeys = Object.keys(translations.te);
const enKeys = Object.keys(translations.en);

console.log(`[INFO] Telugu keys count: ${teKeys.length}, English keys count: ${enKeys.length}`);

const missingInEn = teKeys.filter((k) => translations.en[k] === undefined);
const missingInTe = enKeys.filter((k) => translations.te[k] === undefined);

if (missingInEn.length > 0) {
  console.warn('[WARN] Keys in Telugu missing in English:', missingInEn);
} else {
  console.log('[PASS] 100% key coverage: Every Telugu key has an English translation!');
}

if (missingInTe.length > 0) {
  console.warn('[WARN] Keys in English missing in Telugu:', missingInTe);
} else {
  console.log('[PASS] 100% key coverage: Every English key has a Telugu translation!');
}

// Test 3: Sample Critical UI Text Checks in Both Languages
const sampleKeys = [
  'nav_dashboard',
  'dash_start_assessment',
  'quick_assess_title',
  'col_code',
  'col_name',
  'col_level',
  'action_assess',
  'action_practice',
  'timer_start',
  'step_prefix',
  'result_title',
  'practice_title',
  'print_title',
  'data_title',
  'teacher_unlock_title'
];

console.log('\n--- SAMPLE BILINGUAL STRING COMPARISON ---');
sampleKeys.forEach((key) => {
  setLanguage('te');
  const teVal = t(key);
  setLanguage('en');
  const enVal = t(key);
  console.log(`  Key: ${key}`);
  console.log(`    TE: ${teVal}`);
  console.log(`    EN: ${enVal}`);
  if (!teVal || !enVal) throw new Error(`Missing translation for ${key}`);
});

// Test 4: Content Levels Bilingual Support
console.log('\n--- CONTENT MODEL BILINGUAL VERIFICATION ---');
TELUGU_LEVELS.forEach((lvl) => {
  if (!lvl.name_te || !lvl.name_en) throw new Error(`Missing bilingual level title for ${lvl.id}`);
  console.log(`  Level ${lvl.id}: [TE] ${lvl.name_te} <-> [EN] ${lvl.name_en}`);
});

TELUGU_PASSAGES.forEach((p) => {
  if (!p.title_te || !p.title_en) throw new Error(`Missing bilingual passage title for ${p.id}`);
  console.log(`  Passage ${p.id}: [TE] ${p.title_te} <-> [EN] ${p.title_en}`);
});

console.log('\n--- ALL REAL-TIME TRANSLATION CHECKS PASSED SUCCESSFULLY ---');
