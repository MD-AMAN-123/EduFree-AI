// EduFree.AI Assessment Engine Rules & Metrics Calculation
// Grounded in Evidence-Informed Oral Reading Fluency (ORF / WCPM) and Foundational Telugu Literacy

export const ERROR_TYPES = {
  ACCURATE: 'accurate',       // Child read correctly with appropriate pronunciation
  SKIPPED: 'skipped',         // Word omitted or skipped over
  SUBSTITUTED: 'substituted', // Child read a different word or made phoneme error
  PROMPTED: 'prompted'        // Teacher provided phoneme or whole-word prompt
};

export const PROVISIONAL_BENCHMARKS = {
  grade1: { targetWCPM: 25, minAccuracy: 85 },
  grade2: { targetWCPM: 40, minAccuracy: 90 },
  grade3: { targetWCPM: 55, minAccuracy: 92 },
  grade4: { targetWCPM: 70, minAccuracy: 95 },
  grade5: { targetWCPM: 85, minAccuracy: 95 }
};

/**
 * Compute real-time and final assessment metrics
 */
export function calculateAssessmentMetrics({
  wordStates = [], // array of { word, state: 'accurate' | 'skipped' | 'substituted' | 'prompted', index }
  secondsElapsed = 60,
  comprehensionResponses = [], // array of 'correct' | 'partial' | 'incorrect'
  studentGrade = 3,
  observations = {}
}) {
  const totalWordsInPassage = wordStates.length;
  
  // Find last attempted word index (if child did not finish the passage within the timer)
  let lastAttemptedIndex = -1;
  for (let i = wordStates.length - 1; i >= 0; i--) {
    if (wordStates[i].state !== 'unattempted') {
      lastAttemptedIndex = i;
      break;
    }
  }

  const wordsAttempted = lastAttemptedIndex >= 0 ? lastAttemptedIndex + 1 : 0;
  
  let accurateCount = 0;
  let skippedCount = 0;
  let substitutedCount = 0;
  let promptedCount = 0;

  for (let i = 0; i < wordsAttempted; i++) {
    const s = wordStates[i].state;
    if (s === ERROR_TYPES.ACCURATE) accurateCount++;
    else if (s === ERROR_TYPES.SKIPPED) skippedCount++;
    else if (s === ERROR_TYPES.SUBSTITUTED) substitutedCount++;
    else if (s === ERROR_TYPES.PROMPTED) promptedCount++;
  }

  const totalErrors = skippedCount + substitutedCount + promptedCount;
  const timeClamped = Math.max(Number(secondsElapsed) || 1, 1);
  
  // WCPM = (Words correctly read / seconds) * 60
  const rawWCPM = (accurateCount / timeClamped) * 60;
  const wcpm = Math.round(rawWCPM);

  // Accuracy % = (Accurate Words / Words Attempted) * 100
  const accuracyPercentage = wordsAttempted > 0 
    ? Math.round((accurateCount / wordsAttempted) * 100) 
    : 0;

  // Comprehension score
  const totalCompQuestions = comprehensionResponses.length;
  let compScore = 0;
  comprehensionResponses.forEach((res) => {
    if (res === 'correct') compScore += 1;
    else if (res === 'partial') compScore += 0.5;
  });
  const compPercentage = totalCompQuestions > 0 
    ? Math.round((compScore / totalCompQuestions) * 100) 
    : 0;

  // Determine Provisional Suggested Skill Level
  const provisionalLevel = determineProvisionalLevel({
    wcpm,
    accuracyPercentage,
    compPercentage,
    wordsAttempted,
    totalErrors,
    observations
  });

  return {
    totalWordsInPassage,
    wordsAttempted,
    accurateCount,
    skippedCount,
    substitutedCount,
    promptedCount,
    totalErrors,
    secondsElapsed: timeClamped,
    wcpm,
    accuracyPercentage,
    compScore,
    totalCompQuestions,
    compPercentage,
    provisionalLevel,
    isProvisional: true
  };
}

/**
 * Transparent Rules-Based Level Determination
 */
function determineProvisionalLevel({
  wcpm,
  accuracyPercentage,
  compPercentage,
  wordsAttempted,
  totalErrors,
  observations = {}
}) {
  if (wordsAttempted < 5 || accuracyPercentage < 60 || wcpm < 15) {
    return {
      levelId: 'level_1_letters',
      name_te: 'స్థాయి 1: అక్షరాలు & ధ్వనుల సాధన',
      name_en: 'Level 1: Letter & Sound Recognition',
      stage: 'ప్రారంభ స్థాయి (Emergent Reader)',
      badgeColor: '#e11d48'
    };
  }

  if (observations.vowel_sign_confusion || (accuracyPercentage >= 60 && accuracyPercentage < 75) || wcpm < 30) {
    return {
      levelId: 'level_2_guninthalu',
      name_te: 'స్థాయి 2: గుణింతాల సాధన',
      name_en: 'Level 2: Guninthalu Syllable Discrimination',
      stage: 'వికాస స్థాయి (Developing Syllables)',
      badgeColor: '#ea580c'
    };
  }

  if ((accuracyPercentage >= 75 && accuracyPercentage < 85) || wcpm < 45) {
    return {
      levelId: 'level_3_simple_words',
      name_te: 'స్థాయి 3: సరళ పదాల అభ్యాసం',
      name_en: 'Level 3: Simple Familiar Words',
      stage: 'పద పఠన స్థాయి (Word Reader)',
      badgeColor: '#d97706'
    };
  }

  if (observations.vatthu_struggle || (accuracyPercentage >= 85 && accuracyPercentage < 92) || wcpm < 55) {
    return {
      levelId: 'level_4_ottulu',
      name_te: 'స్థాయి 4: ఒత్తులు (ద్విత్వ/సంయుక్త) సాధన',
      name_en: 'Level 4: Conjunct Consonants & Phrases',
      stage: 'వాక్య పఠన స్థాయి (Sentence & Conjunct Reader)',
      badgeColor: '#0284c7'
    };
  }

  // Fluent with good comprehension
  return {
    levelId: 'level_5_passages',
    name_te: 'స్థాయి 5: స్వేచ్ఛా పఠనం & అవగాహన',
    name_en: 'Level 5: Fluent Reading & Comprehension',
    stage: 'స్వేచ్ఛా పఠన స్థాయి (Fluent Reader)',
    badgeColor: '#059669'
  };
}
