// EduFree.AI Telugu Literacy Content Pack (SCERT Telangana & FLN Inspired)
// Carefully reviewed pedagogical Telugu items for foundational reading and comprehension.

export const TELUGU_LEVELS = [
  {
    id: "level_1_letters",
    name_te: "స్థాయి 1: అక్షరాలు & ధ్వనులు",
    name_en: "Level 1: Letters & Sounds (Aksharamulu)",
    category: "letters",
    description_te: "అచ్చులు, హల్లులు మరియు వాటి ప్రారంభ ధ్వనుల గుర్తింపు",
    description_en: "Recognition of basic vowels, consonants and their initial phonemes",
    itemsCount: 50
  },
  {
    id: "level_2_guninthalu",
    name_te: "స్థాయి 2: గుణింతాలు (మాత్రలు)",
    name_en: "Level 2: Guninthalu (Matra Syllables)",
    category: "guninthalu",
    description_te: "హల్లులకు అచ్చుల గుర్తులు (తలకట్టు, దీర్ఘం, గుడి మొదలైనవి) చేర్చిన రూపాలు",
    description_en: "Consonant-vowel diacritic sign mastery and syllable discrimination",
    itemsCount: 60
  },
  {
    id: "level_3_simple_words",
    name_te: "స్థాయి 3: సరళ పదాలు (అచ్చులు & హల్లులు)",
    name_en: "Level 3: Simple Words (Non-conjuncts)",
    category: "simple_words",
    description_te: "ఒత్తులు లేని 2, 3, 4 అక్షరాల సరళ పదాలు (పలక, కలము, పడవ)",
    description_en: "2-to-4 letter familiar words without complex conjuncts",
    itemsCount: 40
  },
  {
    id: "level_4_ottulu",
    name_te: "స్థాయి 4: ఒత్తుల పదాలు (ద్విత్వ & సంయుక్త)",
    name_en: "Level 4: Conjunct Words (Ottulu)",
    category: "ottulu",
    description_te: "ద్విత్వాక్షరాలు (అమ్మ, చెట్టు) మరియు సంయుక్తాక్షరాలు (పుస్తకం, చక్రం)",
    description_en: "Geminate consonants and consonant cluster words",
    itemsCount: 36
  },
  {
    id: "level_5_passages",
    name_te: "స్థాయి 5: లఘు పేరాలు & అవగాహన",
    name_en: "Level 5: Passages & Comprehension (Fluency)",
    category: "passages",
    description_te: "40-70 పదాల లఘు పేరాలు, పఠన వేగం (WCPM) మరియు ప్రశ్నల అవగాహన",
    description_en: "Short graded passages with oral fluency timing and comprehension questions",
    itemsCount: 4
  }
];

// Level 1: Letters & Sounds
export const TELUGU_LETTERS = [
  // Vowels (అచ్చులు)
  { letter: "అ", type: "vowel", word: "అరక", wordMeaning: "Plough", phonetic: "a" },
  { letter: "ఆ", type: "vowel", word: "ఆవు", wordMeaning: "Cow", phonetic: "aa" },
  { letter: "ఇ", type: "vowel", word: "ఇల్లు", wordMeaning: "House", phonetic: "i" },
  { letter: "ఈ", type: "vowel", word: "ఈగ", wordMeaning: "Fly", phonetic: "ee" },
  { letter: "ఉ", type: "vowel", word: "ఉడత", wordMeaning: "Squirrel", phonetic: "u" },
  { letter: "ఊ", type: "vowel", word: "ఊయల", wordMeaning: "Swing", phonetic: "oo" },
  { letter: "ఋ", type: "vowel", word: "ఋషి", wordMeaning: "Sage", phonetic: "ru" },
  { letter: "ఎ", type: "vowel", word: "ఎలుక", wordMeaning: "Rat", phonetic: "e" },
  { letter: "ఏ", type: "vowel", word: "ఏనుగు", wordMeaning: "Elephant", phonetic: "ae" },
  { letter: "ఐ", type: "vowel", word: "ఐదు", wordMeaning: "Five", phonetic: "ai" },
  { letter: "ఒ", type: "vowel", word: "ఒంటె", wordMeaning: "Camel", phonetic: "o" },
  { letter: "ఓ", type: "vowel", word: "ఓడ", wordMeaning: "Ship", phonetic: "oh" },
  { letter: "ఔ", type: "vowel", word: "ఔషధం", wordMeaning: "Medicine", phonetic: "au" },
  { letter: "అం", type: "vowel", word: "అంగడి", wordMeaning: "Shop", phonetic: "am" },
  // Core Consonants (హల్లులు)
  { letter: "క", type: "consonant", word: "కలము", wordMeaning: "Pen", phonetic: "ka" },
  { letter: "గ", type: "consonant", word: "గడప", wordMeaning: "Threshold", phonetic: "ga" },
  { letter: "చ", type: "consonant", word: "చక్రం", wordMeaning: "Wheel", phonetic: "cha" },
  { letter: "జ", type: "consonant", word: "జలజ", wordMeaning: "Lotus", phonetic: "ja" },
  { letter: "ట", type: "consonant", word: "టపాకాయ", wordMeaning: "Firecracker", phonetic: "ta" },
  { letter: "డ", type: "consonant", word: "డమరుకం", wordMeaning: "Small Drum", phonetic: "da" },
  { letter: "త", type: "consonant", word: "తల", wordMeaning: "Head", phonetic: "tha" },
  { letter: "ద", type: "consonant", word: "దండ", wordMeaning: "Garland", phonetic: "dha" },
  { letter: "న", type: "consonant", word: "నగ", wordMeaning: "Ornament", phonetic: "na" },
  { letter: "ప", type: "consonant", word: "పలక", wordMeaning: "Slate", phonetic: "pa" },
  { letter: "బ", type: "consonant", word: "బంతి", wordMeaning: "Ball", phonetic: "ba" },
  { letter: "మ", type: "consonant", word: "మంచం", wordMeaning: "Cot", phonetic: "ma" },
  { letter: "య", type: "consonant", word: "యంత్రం", wordMeaning: "Machine", phonetic: "ya" },
  { letter: "ర", type: "consonant", word: "రవి", wordMeaning: "Sun", phonetic: "ra" },
  { letter: "ల", type: "consonant", word: "లత", wordMeaning: "Creeper", phonetic: "la" },
  { letter: "వ", type: "consonant", word: "వల", wordMeaning: "Net", phonetic: "va" },
  { letter: "శ", type: "consonant", word: "శంఖం", wordMeaning: "Conch", phonetic: "sha" },
  { letter: "స", type: "consonant", word: "సంచి", wordMeaning: "Bag", phonetic: "sa" },
  { letter: "హ", type: "consonant", word: "హంస", wordMeaning: "Swan", phonetic: "ha" }
];

// Level 2: Guninthalu Families (Consonant + Matras)
export const TELUGU_GUNINTHALU_FAMILIES = [
  {
    base: "క",
    name: "క-గుణింతం",
    series: [
      { glyph: "క", sign: "తలకట్టు", sound: "ka" },
      { glyph: "కా", sign: "దీర్ఘం", sound: "kaa" },
      { glyph: "కి", sign: "గుడి", sound: "ki" },
      { glyph: "కీ", sign: "గుడిదీర్ఘం", sound: "kee" },
      { glyph: "కు", sign: "కొమ్ము", sound: "ku" },
      { glyph: "కూ", sign: "కొమ్ముదీర్ఘం", sound: "koo" },
      { glyph: "కె", sign: "ఎత్వం", sound: "ke" },
      { glyph: "కే", sign: "ఏత్వం", sound: "kae" },
      { glyph: "కై", sign: "ఐత్వం", sound: "kai" },
      { glyph: "కొ", sign: "ఒత్వం", sound: "ko" },
      { glyph: "కో", sign: "ఓత్వం", sound: "koh" },
      { glyph: "కౌ", sign: "ఔత్వం", sound: "kau" },
      { glyph: "కం", sign: "సున్న", sound: "kam" }
    ]
  },
  {
    base: "గ",
    name: "గ-గుణింతం",
    series: [
      { glyph: "గ", sign: "తలకట్టు", sound: "ga" },
      { glyph: "గా", sign: "దీర్ఘం", sound: "gaa" },
      { glyph: "గి", sign: "గుడి", sound: "gi" },
      { glyph: "గీ", sign: "గుడిదీర్ఘం", sound: "gee" },
      { glyph: "గు", sign: "కొమ్ము", sound: "gu" },
      { glyph: "గూ", sign: "కొమ్ముదీర్ఘం", sound: "goo" },
      { glyph: "గె", sign: "ఎత్వం", sound: "ge" },
      { glyph: "గే", sign: "ఏత్వం", sound: "gae" },
      { glyph: "గై", sign: "ఐత్వం", sound: "gai" },
      { glyph: "గొ", sign: "ఒత్వం", sound: "go" },
      { glyph: "గో", sign: "ఓత్వం", sound: "goh" },
      { glyph: "గౌ", sign: "ఔత్వం", sound: "gau" },
      { glyph: "గం", sign: "సున్న", sound: "gam" }
    ]
  },
  {
    base: "త",
    name: "త-గుణింతం",
    series: [
      { glyph: "త", sign: "తలకట్టు", sound: "tha" },
      { glyph: "తా", sign: "దీర్ఘం", sound: "thaa" },
      { glyph: "తి", sign: "గుడి", sound: "thi" },
      { glyph: "తీ", sign: "గుడిదీర్ఘం", sound: "thee" },
      { glyph: "తు", sign: "కొమ్ము", sound: "thu" },
      { glyph: "తూ", sign: "కొమ్ముదీర్ఘం", sound: "thoo" },
      { glyph: "తె", sign: "ఎత్వం", sound: "the" },
      { glyph: "తే", sign: "ఏత్వం", sound: "thae" },
      { glyph: "తై", sign: "ఐత్వం", sound: "thai" },
      { glyph: "తొ", sign: "ఒత్వం", sound: "tho" },
      { glyph: "తో", sign: "ఓత్వం", sound: "thoh" },
      { glyph: "తౌ", sign: "ఔత్వం", sound: "thau" },
      { glyph: "తం", sign: "సున్న", sound: "tham" }
    ]
  },
  {
    base: "ప",
    name: "ప-గుణింతం",
    series: [
      { glyph: "ప", sign: "తలకట్టు", sound: "pa" },
      { glyph: "పా", sign: "దీర్ఘం", sound: "paa" },
      { glyph: "పి", sign: "గుడి", sound: "pi" },
      { glyph: "పీ", sign: "గుడిదీర్ఘం", sound: "pee" },
      { glyph: "పు", sign: "కొమ్ము", sound: "pu" },
      { glyph: "పూ", sign: "కొమ్ముదీర్ఘం", sound: "poo" },
      { glyph: "పె", sign: "ఎత్వం", sound: "pe" },
      { glyph: "పే", sign: "ఏత్వం", sound: "pae" },
      { glyph: "పై", sign: "ఐత్వం", sound: "pai" },
      { glyph: "పొ", sign: "ఒత్వం", sound: "po" },
      { glyph: "పో", sign: "ఓత్వం", sound: "poh" },
      { glyph: "పౌ", sign: "ఔత్వం", sound: "pau" },
      { glyph: "పం", sign: "సున్న", sound: "pam" }
    ]
  }
];

// Level 3: Simple Words (సరళ పదాలు)
export const TELUGU_SIMPLE_WORDS = [
  { word: "పలక", breakdown: "ప + ల + క", meaning: "Slate", length: 3 },
  { word: "కలము", breakdown: "క + ల + ము", meaning: "Pen", length: 3 },
  { word: "అరక", breakdown: "అ + ర + క", meaning: "Plough", length: 3 },
  { word: "ఆట", breakdown: "ఆ + ట", meaning: "Game/Play", length: 2 },
  { word: "ఈల", breakdown: "ఈ + ల", meaning: "Whistle", length: 2 },
  { word: "ఉడత", breakdown: "ఉ + డ + త", meaning: "Squirrel", length: 3 },
  { word: "పడవ", breakdown: "ప + డ + వ", meaning: "Boat", length: 3 },
  { word: "వల", breakdown: "వ + ల", meaning: "Net", length: 2 },
  { word: "నగ", breakdown: "న + గ", meaning: "Jewel", length: 2 },
  { word: "శనగ", breakdown: "శ + న + గ", meaning: "Gram", length: 3 },
  { word: "గడప", breakdown: "గ + డ + ప", meaning: "Doorstep", length: 3 },
  { word: "తామర", breakdown: "తా + మ + ర", meaning: "Lotus", length: 3 },
  { word: "కాకర", breakdown: "కా + క + ర", meaning: "Bitter gourd", length: 3 },
  { word: "చీర", breakdown: "చీ + ర", meaning: "Saree", length: 2 },
  { word: "కూర", breakdown: "కూ + ర", meaning: "Curry", length: 2 },
  { word: "మేక", breakdown: "మే + క", meaning: "Goat", length: 2 }
];

// Level 4: Conjunct Words (ఒత్తుల పదాలు - ద్విత్వ & సంయుక్త)
export const TELUGU_OTTULU_WORDS = [
  // Geminate (ద్విత్వాక్షరాలు)
  { word: "అమ్మ", type: "ద్విత్వాక్షరం", breakdown: "అ + మ్మ (మ-వత్తు)", meaning: "Mother" },
  { word: "అక్క", type: "ద్విత్వాక్షరం", breakdown: "అ + క్క (క-వత్తు)", meaning: "Elder Sister" },
  { word: "చెట్టు", type: "ద్విత్వాక్షరం", breakdown: "చె + ట్టు (ట-వత్తు)", meaning: "Tree" },
  { word: "పిట్ట", type: "ద్విత్వాక్షరం", breakdown: "పి + ట్ట (ట-వత్తు)", meaning: "Bird" },
  { word: "బస్సు", type: "ద్విత్వాక్షరం", breakdown: "బ + స్సు (స-వత్తు)", meaning: "Bus" },
  { word: "కన్ను", type: "ద్విత్వాక్షరం", breakdown: "క + న్ను (న-వత్తు)", meaning: "Eye" },
  { word: "గువ్వ", type: "ద్విత్వాక్షరం", breakdown: "గు + వ్వ (వ-వత్తు)", meaning: "Dove" },
  { word: "ముద్ద", type: "ద్విత్వాక్షరం", breakdown: "ము + ద్ద (ద-వత్తు)", meaning: "Morsel" },
  // Clusters (సంయుక్తాక్షరాలు)
  { word: "పుస్తకం", type: "సంయుక్తాక్షరం", breakdown: "పు + స్త (స+త) + కం", meaning: "Book" },
  { word: "సూర్యుడు", type: "సంయుక్తాక్షరం", breakdown: "సూ + ర్యు (ర+య) + డు", meaning: "Sun" },
  { word: "చక్రం", type: "సంయుక్తాక్షరం", breakdown: "చ + క్రం (క+ర)", meaning: "Wheel" },
  { word: "మిత్రుడు", type: "సంయుక్తాక్షరం", breakdown: "మి + త్రు (త+ర) + డు", meaning: "Friend" },
  { word: "శిల్పం", type: "సంయుక్తాక్షరం", breakdown: "శి + ల్పం (ల+ప)", meaning: "Sculpture" },
  { word: "పద్యం", type: "సంయుక్తాక్షరం", breakdown: "ప + ద్యం (ద+య)", meaning: "Poem" }
];

// Level 5: Graded Passages for Teacher-Led Assessment
export const TELUGU_PASSAGES = [
  {
    id: "passage_village_tank",
    title_te: "మా పల్లె చెరువు",
    title_en: "Our Village Tank",
    grade_recommendation: "Grade 2 - 3",
    difficulty: "సులభం (Beginner)",
    text: "మా ఊరి చెరువు చాలా పెద్దది. చెరువు గట్టున పెద్ద మర్రిచెట్టు ఉంది. ఆ చెట్టు నీడలో పిల్లలు ఆటలు ఆడుకుంటారు. ఉదయాన్నే తెల్లటి కొంగలు చెరువులోకి వస్తాయి. రైతులు పంట పొలాలకు చెరువు నీటిని వాడుకుంటారు. చెరువు నీరు స్వచ్ఛంగా, చల్లగా ఉంటుంది. మా పల్లె చెరువు మా ఊరికి జీవనాధారం.",
    words: [
      "మా", "ఊరి", "చెరువు", "చాలా", "పెద్దది.",
      "చెరువు", "గట్టున", "పెద్ద", "మర్రిచెట్టు", "ఉంది.",
      "ఆ", "చెట్టు", "నీడలో", "పిల్లలు", "ఆటలు", "ఆడుకుంటారు.",
      "ఉదయాన్నే", "తెల్లటి", "కొంగలు", "చెరువులోకి", "వస్తాయి.",
      "రైతులు", "పంట", "పొలాలకు", "చెరువు", "నీటిని", "వాడుకుంటారు.",
      "చెరువు", "నీరు", "స్వచ్ఛంగా,", "చల్లగా", "ఉంటుంది.",
      "మా", "పల్లె", "చెరువు", "మా", "ఊరికి", "జీవనాధారం."
    ],
    wordCount: 37,
    comprehensionQuestions: [
      {
        id: "q1",
        question_te: "చెరువు గట్టున ఏ చెట్టు ఉంది?",
        question_en: "Which tree is on the embankment of the tank?",
        expected_te: "మర్రిచెట్టు",
        type: "literal"
      },
      {
        id: "q2",
        question_te: "రైతులు చెరువు నీటిని దేనికి వాడుకుంటారు?",
        question_en: "What do farmers use the tank water for?",
        expected_te: "పంట పొలాలకు",
        type: "literal"
      },
      {
        id: "q3",
        question_te: "మీ ఊరిలో చెరువులు లేదా నీటి వనరులు శుభ్రంగా ఉండడం ఎందుకు ముఖ్యం?",
        question_en: "Why is it important to keep village water sources clean?",
        expected_te: "స్వీయ ఆలోచన (తాగునీరు, పంటలు, ఆరోగ్యం కొరకు)",
        type: "inferential"
      }
    ]
  },
  {
    id: "passage_school_garden",
    title_te: "బడి తోట — తాజా కూరగాయలు",
    title_en: "School Garden — Fresh Vegetables",
    grade_recommendation: "Grade 3 - 4",
    difficulty: "మధ్యస్థం (Intermediate)",
    text: "మా ప్రాథమిక పాఠశాలలో ఒక అందమైన తోట ఉంది. ఉపాధ్యాయుల మార్గదర్శకత్వంలో విద్యార్థులందరం కలిసి మొక్కలు నాటాము. తోటలో టమాటా, వంకాయ, బెండకాయ మొక్కలు ఉన్నాయి. మేము ప్రతిరోజూ మొక్కలకు నీరు పోస్తాము. బడి తోటలో పండిన తాజా కూరగాయలను మధ్యాహ్న భోజనంలో వండుతారు. మన చేతులతో పెంచిన కూరగాయలు తినడం మాకు చాలా సంతోషాన్ని ఇస్తుంది.",
    words: [
      "మా", "ప్రాథమిక", "పాఠశాలలో", "ఒక", "అందమైన", "తోట", "ఉంది.",
      "ఉపాధ్యాయుల", "మార్గదర్శకత్వంలో", "విద్యార్థులందరం", "కలిసి", "మొక్కలు", "నాటాము.",
      "తోటలో", "టమాటా,", "వంకాయ,", "బెండకాయ", "మొక్కలు", "ఉన్నాయి.",
      "మేము", "ప్రతిరోజూ", "మొక్కలకు", "నీరు", "పోస్తాము.",
      "బడి", "తోటలో", "పండిన", "తాజా", "కూరగాయలను", "మధ్యాహ్న", "భోజనంలో", "వండుతారు.",
      "మన", "చేతులతో", "పెంచిన", "కూరగాయలు", "తినడం", "మాకు", "చాలా", "సంతోషాన్ని", "ఇస్తుంది."
    ],
    wordCount: 43,
    comprehensionQuestions: [
      {
        id: "q1",
        question_te: "బడి తోటలో ఏయే కూరగాయల మొక్కలు ఉన్నాయి?",
        question_en: "Which vegetables are growing in the school garden?",
        expected_te: "టమాటా, వంకాయ, బెండకాయ",
        type: "literal"
      },
      {
        id: "q2",
        question_te: "పండిన తాజా కూరగాయలను ఎక్కడ ఉపయోగిస్తారు?",
        question_en: "Where are the harvested vegetables used?",
        expected_te: "పాఠశాల మధ్యాహ్న భోజనంలో",
        type: "literal"
      },
      {
        id: "q3",
        question_te: "మొక్కలు నాటడం వల్ల పర్యావరణానికి మరియు పిల్లలకు కలిగే లాభాలు ఏమిటి?",
        question_en: "What are the benefits of gardening for students and nature?",
        expected_te: "స్వీయ ఆలోచన (బాధ్యత, శ్రమ విలువ, తాజా పోషకాహారం)",
        type: "inferential"
      }
    ]
  },
  {
    id: "passage_komaram_bheem",
    title_te: "కొమురం భీమ్ ధైర్యం",
    title_en: "The Courage of Komaram Bheem",
    grade_recommendation: "Grade 4 - 5",
    difficulty: "ఉన్నతం (Advanced)",
    text: "తెలంగాణ నేల వీరుల గడ్డ. కొమురం భీమ్ ఆదివాసీల హక్కుల కోసం పోరాడిన గొప్ప యోధుడు. అడవి బిడ్డలకు 'జల్, జంగల్, జమీన్' స్వంతం కావాలని ఆయన నినదించాడు. అడవి సంపదను కాపాడుతూ, ప్రజల్లో ఆత్మవిశ్వాసం నింపాడు. భీమ్ చూపిన ధైర్యం, త్యాగం మన అందరికీ ఎల్లప్పుడూ ఆదర్శం. ఆయన పోరాట స్ఫూర్తిని మనం ఎప్పటికీ మరువలేము.",
    words: [
      "తెలంగాణ", "నేల", "వీరుల", "గడ్డ.",
      "కొమురం", "భీమ్", "ఆదివాసీల", "హక్కుల", "కోసం", "పోరాడిన", "గొప్ప", "యోధుడు.",
      "అడవి", "బిడ్డలకు", "'జల్,", "జంగల్,", "జమీన్'", "స్వంతం", "కావాలని", "ఆయన", "నినదించాడు.",
      "అడవి", "సంపదను", "కాపాడుతూ,", "ప్రజల్లో", "ఆత్మవిశ్వాసం", "నింపాడు.",
      "భీమ్", "చూపిన", "ధైర్యం,", "త్యాగం", "మన", "అందరికీ", "ఎల్లప్పుడూ", "ఆదర్శం.",
      "ఆయన", "పోరాట", "స్ఫూర్తిని", "మనం", "ఎప్పటికీ", "మరువలేము."
    ],
    wordCount: 42,
    comprehensionQuestions: [
      {
        id: "q1",
        question_te: "కొమురం భీమ్ ఇచ్చిన ప్రసిద్ధ నినాదం ఏమిటి?",
        question_en: "What was Komaram Bheem's famous slogan?",
        expected_te: "జల్, జంగల్, జమీన్ (నీరు, అడవి, భూమి)",
        type: "literal"
      },
      {
        id: "q2",
        question_te: "కొమురం భీమ్ ఎవరి హక్కుల కోసం పోరాటం చేశాడు?",
        question_en: "Whose rights did Komaram Bheem fight for?",
        expected_te: "ఆదివాసీల మరియు అడవి బిడ్డల హక్కుల కోసం",
        type: "literal"
      },
      {
        id: "q3",
        question_te: "అడవులను మరియు ప్రకృతి సంపదను కాపాడుకోవడం మన కర్తవ్యం ఎలా అవుతుంది?",
        question_en: "Why is conserving forests and nature our collective responsibility?",
        expected_te: "స్వీయ ఆలోచన (వర్షాలు, స్వచ్ఛమైన గాలి, భవిష్యత్ తరాల కొరకు)",
        type: "inferential"
      }
    ]
  },
  {
    id: "passage_telangana_vaibhavam",
    title_te: "తెలంగాణ వైభవం — సంస్కృతి & శిల్పకళ",
    title_en: "Glory of Telangana — Culture & Heritage",
    grade_recommendation: "Grade 3 - 5",
    difficulty: "మధ్యస్థం (SCERT Textbook Reader)",
    text: "తెలంగాణ రాష్ట్రం ఎంతో ఘనమైన సంస్కృతి, చరిత్ర కలిగిన నేల. మన రాష్ట్రంలో కాకతీయుల శిల్పకళా చాతుర్యం రామప్ప గుడి, వరంగల్ కోటలో కనిపిస్తుంది. గోదావరి, కృష్ణా నదులు మన నేలను సస్యశ్యామలం చేస్తున్నాయి. బతుకమ్మ, బోనాలు మన సంప్రదాయ పండుగలు. పోతన భాగవతం, దాశరథి కవిత్వం మన తెలుగు భాషకు వన్నె తెచ్చాయి. ప్రతీ ఒక్కరం మన సంస్కృతిని కాపాడుకోవాలి.",
    words: [
      "తెలంగాణ", "రాష్ట్రం", "ఎంతో", "ఘనమైన", "సంస్కృతి,",
      "చరిత్ర", "కలిగిన", "నేల.", "మన", "రాష్ట్రంలో",
      "కాకతీయుల", "శిల్పకళా", "చాతుర్యం", "రామప్ప", "గుడి,",
      "వరంగల్", "కోటలో", "కనిపిస్తుంది.", "గోదావరి,", "కృష్ణా",
      "నదులు", "మన", "నేలను", "సస్యశ్యామలం", "చేస్తున్నాయి.",
      "బతుకమ్మ,", "బోనాలు", "మన", "సంప్రదాయ", "పండుగలు.",
      "పోతన", "భాగవతం,", "దాశరథి", "కవిత్వం", "మన",
      "తెలుగు", "భాషకు", "వన్నె", "తెచ్చాయి.", "ప్రతీ",
      "ఒక్కరం", "మన", "సంస్కృతిని", "కాపాడుకోవాలి."
    ],
    wordCount: 43,
    comprehensionQuestions: [
      {
        id: "q1",
        question_te: "కాకతీయుల శిల్పకళా చాతుర్యం ఎక్కడ కనిపిస్తుంది?",
        question_en: "Where is the architectural skill of Kakatiyas visible?",
        expected_te: "రామప్ప గుడి, వరంగల్ కోటలో",
        type: "literal"
      },
      {
        id: "q2",
        question_te: "తెలంగాణలో జరుపుకునే ప్రసిద్ధ సంప్రదాయ పండుగలు ఏవి?",
        question_en: "What are the famous traditional festivals celebrated in Telangana?",
        expected_te: "బతుకమ్మ, బోనాలు",
        type: "literal"
      },
      {
        id: "q3",
        question_te: "మన రాష్ట్ర సంస్కృతిని మరియు నదులను కాపాడుకోవలసిన బాధ్యత ఎవరిది?",
        question_en: "Whose responsibility is it to conserve our state's culture and rivers?",
        expected_te: "ప్రజలందరి మరియు విద్యార్థుల బాధ్యత",
        type: "inferential"
      }
    ]
  }
];
