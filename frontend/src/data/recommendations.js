// EduFree.AI Pedagogical Recommendations Engine
// Maps observed errors, WCPM, accuracy, and observations into actionable, transparent practice activities.

export function generateRecommendations({
  metrics,
  observations = {},
  passageTitle = "",
  language = "te"
}) {
  const recommendations = [];
  const rationales = [];
  const isEn = language === 'en';

  const {
    wcpm,
    accuracyPercentage,
    skippedCount,
    substitutedCount,
    promptedCount,
    compPercentage,
    provisionalLevel
  } = metrics;

  // 1. Analyze Specific Error Patterns and Construct Transparent Rationales
  if (observations.vowel_sign_confusion || (substitutedCount >= 3 && accuracyPercentage < 75)) {
    rationales.push({
      reason_te: isEn
        ? "విద్యార్థి ఆంగ్ల ఫోనిక్స్ శబ్దాలు మరియు బ్లెండ్స్ (sh, ch, th) పలకడంలో తికమకపడినట్లు గమనించబడింది."
        : "విద్యార్థి పఠనంలో గుణింతాల గుర్తులను (మాత్రలను) తికమకపడినట్లు గమనించబడింది.",
      reason_en: isEn
        ? "Student showed confusion with English phonics digraphs and letter blends (sh, ch, th) during oral reading."
        : "Student showed confusion between vowel signs (Gunintham matras) during oral reading.",
      category: "guninthalu"
    });
    recommendations.push({
      id: isEn ? "rec_blends_drill" : "rec_gunintham_wheel",
      levelId: "level_2_guninthalu",
      title_te: isEn ? "ఫోనిక్స్ బ్లెండ్స్ & శబ్దాల సాధన (sh, ch, th)" : "గుణింతాల చక్రం & శబ్దాల సాధన",
      title_en: isEn ? "Phonics Blends & Digraphs Drill (sh, ch, th)" : "Gunintham Wheel & Sound Drill",
      description_te: isEn ? "ద్వంద్వ శబ్దాలు (sh, ch, th, bl) వేరుచేసి పలికే ఇంటరాక్టివ్ అభ్యాసం." : "తలకట్టు, దీర్ఘం, గుడి, కొమ్ములను స్వయంగా మార్చి పలికే ఇంటరాక్టివ్ అభ్యాసం.",
      description_en: isEn ? "Interactive digraph and blend substitution to build phonetic awareness." : "Interactive matra substitution to reinforce vowel sign discrimination.",
      practiceMode: "guninthalu",
      targetDurationMinutes: 10
    });
  }

  if (observations.vatthu_struggle || (substitutedCount >= 2 && provisionalLevel.levelId === 'level_4_ottulu')) {
    rationales.push({
      reason_te: isEn
        ? "సంక్లిష్ట ఆంగ్ల పదాలు మరియు బ్లెండ్స్ (school, friend, clean) చదవడంలో సహాయం అవసరమైంది."
        : "ద్విత్వాక్షరాలు మరియు సంయుక్తాక్షరాలు (ఒత్తులు) ఉన్న పదాలను పలకడంలో సహాయం అవసరమైంది.",
      reason_en: isEn
        ? "Student hesitated or required prompts when reading complex consonant clusters (school, friend, clean)."
        : "Student hesitated or required prompts when reading conjunct consonants (Ottulu).",
      category: "ottulu"
    });
    recommendations.push({
      id: isEn ? "rec_complex_clusters" : "rec_ottulu_pairs",
      levelId: "level_4_ottulu",
      title_te: isEn ? "సంక్లిష్ట ఆంగ్ల పదాల కార్డులు (Clusters & Blends)" : "ఒత్తుల జతల కార్డులు (ద్విత్వ/సంయుక్త)",
      title_en: isEn ? "Complex Vocabulary & Cluster Cards" : "Ottulu Flashcard Pairs (Geminate & Clusters)",
      description_te: isEn ? "School, friend, garden వంటి రోజువారీ పదాలను విడదీసి నేర్చుకునే కార్డులు." : "అమ్మ, చెట్టు, పుస్తకం వంటి నిత్యజీవిత పదాలను విడదీసి నేర్చుకునే కార్డులు.",
      description_en: isEn ? "Word decomposition cards highlighting multi-syllable clusters and long vowels." : "Word decomposition cards highlighting subscript consonants.",
      practiceMode: "ottulu",
      targetDurationMinutes: 10
    });
  }

  if (skippedCount >= 3) {
    rationales.push({
      reason_te: `పేరా చదివేటప్పుడు విద్యార్థి ${skippedCount} పదాలను వదిలివేశారు (Skipped). వేలితో చూపిస్తూ చదివించడం లేదా లయబద్ధ పఠనం అవసరం.`,
      reason_en: `Student skipped ${skippedCount} words in the passage. Guided finger-tracking or rhythm reading is advised.`,
      category: "pacing"
    });
    recommendations.push({
      id: "rec_paced_reading",
      levelId: "level_5_passages",
      title_te: "లయబద్ధ పఠనం (Read-Along Story)",
      title_en: "Read-Along Story with Word Tracking",
      description_te: "పదం తర్వాత పదం హైలైట్ అవుతూ వినిపించే ఆడియోతో కలిసి చదవడం.",
      description_en: "Follow audio-synchronized word highlighting to prevent word skipping.",
      practiceMode: "read_along",
      targetDurationMinutes: 8
    });
  }

  if (observations.finger_point || observations.letter_by_letter) {
    rationales.push({
      reason_te: isEn
        ? "పదాలను అక్షరాల వారీగా విడదీసి చదువుతున్నారు. ఆంగ్ల సైట్ వర్డ్స్ (Sight Words: the, and, see) సాధన సూచించబడింది."
        : "పదాలను మొత్తం ఒకేసారి గుర్తించే బదులు అక్షరాల వారీగా విడదీసి చదువుతున్నారు. దృశ్య పదాల (Sight Words) సాధన సూచించబడింది.",
      reason_en: isEn
        ? "Reads letter-by-letter rather than fluent word recognition. English high-frequency sight words flashcards recommended."
        : "Reads letter-by-letter rather than fluent word recognition. Sight word flashcards recommended.",
      category: "fluency"
    });
    recommendations.push({
      id: isEn ? "rec_en_sight_words" : "rec_sight_words",
      levelId: "level_3_simple_words",
      title_te: isEn ? "సరళ ఆంగ్ల పదాల ఫ్లాష్‌కార్డులు (CVC & Sight Words)" : "సరళ పదాల వేగవంతమైన ఫ్లాష్‌కార్డులు",
      title_en: isEn ? "Rapid English Sight Words & CVC Flashcards" : "Rapid Sight Word Flashcards",
      description_te: isEn ? "Cat, dog, sun, the, and వంటి ప్రాథమిక పదాలను క్షణాల్లో గుర్తించే అభ్యాసం." : "పలక, కలము, పడవ వంటి సరళ పదాలను క్షణాల్లో గుర్తించే అభ్యాసం.",
      description_en: isEn ? "Rapid-fire visual recognition of common high-frequency English CVC and sight words." : "Rapid-fire visual recognition of common high-frequency words.",
      practiceMode: "simple_words",
      targetDurationMinutes: 5
    });
  }

  if (compPercentage < 60) {
    rationales.push({
      reason_te: `పఠించిన పేరాకు సంబంధించి అవగాహన ప్రశ్నలలో స్కోరు ${compPercentage}% గా ఉంది. చదివిన అంశంపై ఉపాధ్యాయుల చర్చ అవసరం.`,
      reason_en: `Comprehension score was ${compPercentage}%. Dialogue reading and teacher questioning recommended.`,
      category: "comprehension"
    });
    recommendations.push({
      id: "rec_story_comprehension",
      levelId: "level_5_passages",
      title_te: "చిత్ర కథా చర్చ & ప్రశ్నల సాధన",
      title_en: "Picture Story Dialogue & Guided Discussion",
      description_te: "కథలోని ప్రధాన పాత్రలు, సంఘటనలపై చిన్న చిన్న ప్రశ్నలతో కూడిన చర్చ.",
      description_en: "Guided discussion prompts focusing on sequence of events and personal connection.",
      practiceMode: "comprehension",
      targetDurationMinutes: 12
    });
  }

  // Fallback default recommendation if reading was strong or generic
  if (recommendations.length === 0) {
    if (accuracyPercentage >= 90 && wcpm >= 50) {
      rationales.push({
        reason_te: "విద్యార్థి చాలా స్పష్టంగా, మంచి వేగంతో చదివారు. తదుపరి స్థాయి ఉన్నత కథలను సాధన చేయవచ్చు.",
        reason_en: "Student read accurately with solid pace. Ready for advanced expressive passages.",
        category: "advancement"
      });
      recommendations.push({
        id: "rec_advanced_stories",
        levelId: "level_5_passages",
        title_te: "ఉన్నత స్థాయి కథలు & భావయుక్త పఠనం",
        title_en: "Advanced Stories & Expressive Reading",
        description_te: "విరామ చిహ్నాలు, హావభావాలతో కూడిన పఠనాభ్యాసం.",
        description_en: "Expressive oral reading with proper intonation and phrasing.",
        practiceMode: "read_along",
        targetDurationMinutes: 15
      });
    } else {
      rationales.push({
        reason_te: `పఠన ఖచ్చితత్వం ${accuracyPercentage}% మరియు వేగం ${wcpm} WCPM ఆధారంగా పునాది పదాల సాధన సూచించబడింది.`,
        reason_en: `Based on oral reading accuracy (${accuracyPercentage}%) and speed (${wcpm} WCPM), foundational practice is recommended.`,
        category: "general"
      });
      recommendations.push({
        id: "rec_general_flashcards",
        levelId: provisionalLevel.levelId,
        title_te: `${provisionalLevel.name_te} - సాధనా కార్యాచరణ`,
        title_en: `${provisionalLevel.name_en} - Practice Drill`,
        description_te: "మౌలిక పదాలు మరియు ధ్వనుల పునశ్చరణ.",
        description_en: "Reinforcement of foundational letter-sound combinations.",
        practiceMode: provisionalLevel.levelId.replace('level_', ''),
        targetDurationMinutes: 10
      });
    }
  }

  return {
    rationales,
    recommendations,
    generatedAt: new Date().toISOString()
  };
}
