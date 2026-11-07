// EduFree.AI English Foundational Literacy Content Pack (SCERT Telangana & FLN Aligned)
// Pedagogically crafted for Classes 1 to 5 foundational English reading proficiency.

export const ENGLISH_LEVELS = [
  {
    id: "level_1_letters",
    name_te: "స్థాయి 1: ఆంగ్ల అక్షరాలు & ధ్వనులు",
    name_en: "Level 1: Letters & Phonics Sounds (A-Z)",
    category: "letters",
    description_te: "A నుండి Z వరకు అక్షరాల గుర్తింపు, ఆకారాలు మరియు ప్రాథమిక ఫోనిక్స్ శబ్దాలు",
    description_en: "Uppercase and lowercase letter recognition and initial phonemic sounds",
    itemsCount: 26
  },
  {
    id: "level_2_guninthalu",
    name_te: "స్థాయి 2: ఫోనిక్స్ బ్లెండ్స్ & డయాగ్రాఫ్స్",
    name_en: "Level 2: Phonics Blends & Digraphs (sh, ch, th)",
    category: "guninthalu",
    description_te: "ద్వంద్వ శబ్దాలు మరియు అక్షర కలయికలు (sh, ch, th, bl, st మొదలైనవి)",
    description_en: "Consonant blends and digraphs sound mastery and syllable discrimination",
    itemsCount: 32
  },
  {
    id: "level_3_simple_words",
    name_te: "స్థాయి 3: సరళ ఆంగ్ల పదాలు (CVC & Sight Words)",
    name_en: "Level 3: Simple Words (CVC & Sight Words)",
    category: "simple_words",
    description_te: "3-అక్షరాల సరళ పదాలు (cat, dog, sun) మరియు ప్రాథమిక సైట్ వర్డ్స్ (the, is, and)",
    description_en: "3-to-4 letter regular phonics words and high-frequency sight words",
    itemsCount: 40
  },
  {
    id: "level_4_ottulu",
    name_te: "స్థాయి 4: సంక్లిష్ట పదాలు & క్లస్టర్స్",
    name_en: "Level 4: Complex Words & Consonant Clusters",
    category: "ottulu",
    description_te: "సంయుక్త శబ్దాలు, దీర్ఘ స్వరాలు మరియు బహుళ-అక్షరాల పదాలు (school, garden, friend)",
    description_en: "Multi-syllable vocabulary, long vowels, and consonant cluster words",
    itemsCount: 36
  },
  {
    id: "level_5_passages",
    name_te: "స్థాయి 5: ఆంగ్ల కథలు & పఠన ప్రవాహం",
    name_en: "Level 5: English Passages & Fluency",
    category: "passages",
    description_te: "సరళమైన ఆంగ్ల కథల పఠనం, నిమిషానికి వేగం (WCPM) మరియు గ్రహణశక్తి",
    description_en: "Connected passage oral reading, words correct per minute, and comprehension",
    itemsCount: 4
  }
];

// Level 1: English Alphabet & Phonics (A - Z)
export const ENGLISH_LETTERS = [
  { letter: "A a", phonetic: "æ", sound: "ae as in apple", word: "Apple", meaning_te: "యాపిల్ పండు", example: "A is for Apple", category: "vowel" },
  { letter: "B b", phonetic: "b", sound: "b as in bat", word: "Ball", meaning_te: "బంతి", example: "B is for Ball", category: "consonant" },
  { letter: "C c", phonetic: "k", sound: "k as in cat", word: "Cat", meaning_te: "పిల్లి", example: "C is for Cat", category: "consonant" },
  { letter: "D d", phonetic: "d", sound: "d as in dog", word: "Dog", meaning_te: "కుక్క", example: "D is for Dog", category: "consonant" },
  { letter: "E e", phonetic: "e", sound: "e as in egg", word: "Elephant", meaning_te: "ఏనుగు", example: "E is for Elephant", category: "vowel" },
  { letter: "F f", phonetic: "f", sound: "f as in fish", word: "Fish", meaning_te: "చేప", example: "F is for Fish", category: "consonant" },
  { letter: "G g", phonetic: "ɡ", sound: "g as in goat", word: "Grapes", meaning_te: "ద్రాక్ష", example: "G is for Grapes", category: "consonant" },
  { letter: "H h", phonetic: "h", sound: "h as in hat", word: "Hut", meaning_te: "గుడిసె", example: "H is for Hut", category: "consonant" },
  { letter: "I i", phonetic: "ɪ", sound: "i as in ink", word: "Inkpot", meaning_te: "సిరాబుడ్డి", example: "I is for Inkpot", category: "vowel" },
  { letter: "J j", phonetic: "dʒ", sound: "j as in jug", word: "Jug", meaning_te: "కూజా", example: "J is for Jug", category: "consonant" },
  { letter: "K k", phonetic: "k", sound: "k as in kite", word: "Kite", meaning_te: "గాలిపటం", example: "K is for Kite", category: "consonant" },
  { letter: "L l", phonetic: "l", sound: "l as in leaf", word: "Lion", meaning_te: "సింహం", example: "L is for Lion", category: "consonant" },
  { letter: "M m", phonetic: "m", sound: "m as in moon", word: "Mango", meaning_te: "మామిడి పండు", example: "M is for Mango", category: "consonant" },
  { letter: "N n", phonetic: "n", sound: "n as in net", word: "Nest", meaning_te: "పక్షి గూడు", example: "N is for Nest", category: "consonant" },
  { letter: "O o", phonetic: "ɒ", sound: "o as in ox", word: "Orange", meaning_te: "నారింజ పండు", example: "O is for Orange", category: "vowel" },
  { letter: "P p", phonetic: "p", sound: "p as in pen", word: "Parrot", meaning_te: "చిలుక", example: "P is for Parrot", category: "consonant" },
  { letter: "Q q", phonetic: "kw", sound: "qu as in queen", word: "Queen", meaning_te: "రాణి", example: "Q is for Queen", category: "consonant" },
  { letter: "R r", phonetic: "r", sound: "r as in rose", word: "Rabbit", meaning_te: "కుందేలు", example: "R is for Rabbit", category: "consonant" },
  { letter: "S s", phonetic: "s", sound: "s as in sun", word: "Sun", meaning_te: "సూర్యుడు", example: "S is for Sun", category: "consonant" },
  { letter: "T t", phonetic: "t", sound: "t as in tree", word: "Tiger", meaning_te: "పులి", example: "T is for Tiger", category: "consonant" },
  { letter: "U u", phonetic: "ʌ", sound: "u as in umbrella", word: "Umbrella", meaning_te: "గొడుగు", example: "U is for Umbrella", category: "vowel" },
  { letter: "V v", phonetic: "v", sound: "v as in van", word: "Van", meaning_te: "వ్యాను", example: "V is for Van", category: "consonant" },
  { letter: "W w", phonetic: "w", sound: "w as in watch", word: "Watch", meaning_te: "గడియారం", example: "W is for Watch", category: "consonant" },
  { letter: "X x", phonetic: "ks", sound: "x as in box", word: "Xylophone", meaning_te: "వాద్య పరికరం", example: "X is for Xylophone", category: "consonant" },
  { letter: "Y y", phonetic: "j", sound: "y as in yak", word: "Yellow", meaning_te: "పసుపు రంగు", example: "Y is for Yellow", category: "consonant" },
  { letter: "Z z", phonetic: "z", sound: "z as in zebra", word: "Zebra", meaning_te: "చారల గుర్రం", example: "Z is for Zebra", category: "consonant" }
];

// Level 2: Phonics Blends & Digraphs (Family groupings for Level 2 Practice)
export const ENGLISH_BLENDS_FAMILIES = [
  {
    base: "SH / CH",
    name: "SH & CH Digraphs",
    series: [
      { glyph: "Ship", sign: "sh- blend", sound: "ship", meaning_te: "ఓడ" },
      { glyph: "Shop", sign: "sh- blend", sound: "shop", meaning_te: "దుకాణం" },
      { glyph: "Fish", sign: "-sh end", sound: "fish", meaning_te: "చేప" },
      { glyph: "Wish", sign: "-sh end", sound: "wish", meaning_te: "కోరిక" },
      { glyph: "Chin", sign: "ch- blend", sound: "chin", meaning_te: "గడ్డం" },
      { glyph: "Chat", sign: "ch- blend", sound: "chat", meaning_te: "మాటలు" },
      { glyph: "Much", sign: "-ch end", sound: "much", meaning_te: "ఎక్కువ" },
      { glyph: "Rich", sign: "-ch end", sound: "rich", meaning_te: "ధనిక" }
    ]
  },
  {
    base: "TH / WH",
    name: "TH & WH Digraphs",
    series: [
      { glyph: "This", sign: "voiced th", sound: "this", meaning_te: "ఇది" },
      { glyph: "That", sign: "voiced th", sound: "that", meaning_te: "అది" },
      { glyph: "Thin", sign: "unvoiced th", sound: "thin", meaning_te: "సన్నని" },
      { glyph: "Path", sign: "-th end", sound: "path", meaning_te: "దారి" },
      { glyph: "When", sign: "wh- sound", sound: "when", meaning_te: "ఎప్పుడు" },
      { glyph: "Whip", sign: "wh- sound", sound: "whip", meaning_te: "కొరడా" },
      { glyph: "White", sign: "wh- sound", sound: "white", meaning_te: "తెలుపు" },
      { glyph: "Wheel", sign: "wh- sound", sound: "wheel", meaning_te: "చక్రం" }
    ]
  },
  {
    base: "BL / CL / FL",
    name: "L-Blends",
    series: [
      { glyph: "Blue", sign: "bl- blend", sound: "blue", meaning_te: "నీలం రంగు" },
      { glyph: "Blow", sign: "bl- blend", sound: "blow", meaning_te: "ఊదు" },
      { glyph: "Clap", sign: "cl- blend", sound: "clap", meaning_te: "చప్పట్లు" },
      { glyph: "Clay", sign: "cl- blend", sound: "clay", meaning_te: "మట్టి" },
      { glyph: "Flag", sign: "fl- blend", sound: "flag", meaning_te: "జెండా" },
      { glyph: "Fly", sign: "fl- blend", sound: "fly", meaning_te: "ఎగురు" },
      { glyph: "Play", sign: "pl- blend", sound: "play", meaning_te: "ఆడుకో" },
      { glyph: "Slow", sign: "sl- blend", sound: "slow", meaning_te: "నెమ్మదిగా" }
    ]
  },
  {
    base: "ST / SP / TR",
    name: "S & R Blends",
    series: [
      { glyph: "Star", sign: "st- blend", sound: "star", meaning_te: "నక్షత్రం" },
      { glyph: "Stop", sign: "st- blend", sound: "stop", meaning_te: "ఆగు" },
      { glyph: "Spin", sign: "sp- blend", sound: "spin", meaning_te: "తిరుగు" },
      { glyph: "Spot", sign: "sp- blend", sound: "spot", meaning_te: "మచ్చ" },
      { glyph: "Tree", sign: "tr- blend", sound: "tree", meaning_te: "చెట్టు" },
      { glyph: "Trip", sign: "tr- blend", sound: "trip", meaning_te: "యాత్ర" },
      { glyph: "Frog", sign: "fr- blend", sound: "frog", meaning_te: "కప్ప" },
      { glyph: "Green", sign: "gr- blend", sound: "green", meaning_te: "ఆకుపచ్చ" }
    ]
  }
];

// Level 3: Simple Words (CVC & High-Frequency Sight Words)
export const ENGLISH_SIMPLE_WORDS = [
  { word: "Cat", breakdown: "c + a + t", meaning: "పిల్లి", length: 3 },
  { word: "Dog", breakdown: "d + o + g", meaning: "కుక్క", length: 3 },
  { word: "Sun", breakdown: "s + u + n", meaning: "సూర్యుడు", length: 3 },
  { word: "Pen", breakdown: "p + e + n", meaning: "కలము", length: 3 },
  { word: "Bus", breakdown: "b + u + s", meaning: "బస్సు", length: 3 },
  { word: "Hut", breakdown: "h + u + t", meaning: "గుడిసె", length: 3 },
  { word: "Bat", breakdown: "b + a + t", meaning: "బ్యాట్ / గబ్బిలం", length: 3 },
  { word: "Red", breakdown: "r + e + d", meaning: "ఎరుపు రంగు", length: 3 },
  { word: "The", breakdown: "t + h + e", meaning: "ఆ / నిర్దిష్ట పదం", length: 3 },
  { word: "And", breakdown: "a + n + d", meaning: "మరియు", length: 3 },
  { word: "See", breakdown: "s + e + e", meaning: "చూడు", length: 3 },
  { word: "Big", breakdown: "b + i + g", meaning: "పెద్ద", length: 3 },
  { word: "Run", breakdown: "r + u + n", meaning: "పరుగెత్తు", length: 3 },
  { word: "Pot", breakdown: "p + o + t", meaning: "కుండ", length: 3 },
  { word: "Book", breakdown: "b + o + o + k", meaning: "పుస్తకం", length: 4 },
  { word: "Bird", breakdown: "b + i + r + d", meaning: "పక్షి", length: 4 }
];

// Level 4: Complex Words & Blends
export const ENGLISH_COMPLEX_WORDS = [
  { word: "School", breakdown: "sch + ool", meaning: "పాఠశాల / బడి", hint_te: "sch- ప్రారంభ శబ్దం" },
  { word: "Friend", breakdown: "fr + iend", meaning: "స్నేహితుడు", hint_te: "fr- బ్లెండ్" },
  { word: "Garden", breakdown: "gar + den", meaning: "తోట", hint_te: "రెండు సిలబుల్స్" },
  { word: "Water", breakdown: "wa + ter", meaning: "నీరు", hint_te: "నిత్యజీవిత పదం" },
  { word: "Clean", breakdown: "cl + ean", meaning: "శుభ్రమైన", hint_te: "cl- బ్లెండ్ + ea దీర్ఘ స్వరం" },
  { word: "Bright", breakdown: "br + ight", meaning: "ప్రకాశవంతమైన", hint_te: "br- బ్లెండ్ + ight శబ్దం" },
  { word: "Little", breakdown: "lit + tle", meaning: "చిన్న", hint_te: "ద్విత్వ l శబ్దం" },
  { word: "Flower", breakdown: "fl + ower", meaning: "పువ్వు", hint_te: "fl- బ్లెండ్" },
  { word: "Morning", breakdown: "mor + ning", meaning: "ఉదయం", hint_te: "mor-ning సిలబుల్స్" },
  { word: "Village", breakdown: "vil + lage", meaning: "గ్రామం / ఊరు", hint_te: "స్థానిక పరిసరం" },
  { word: "Happy", breakdown: "hap + py", meaning: "సంతోషం", hint_te: "hap-py" },
  { word: "Teacher", breakdown: "teach + er", meaning: "ఉపాధ్యాయుడు", hint_te: "teach-er" }
];

// Level 5: Graded Passages for Assessment & Practice
export const ENGLISH_PASSAGES = [
  {
    id: "passage_en_puppy",
    title_te: "చిన్న కుక్కపిల్ల (The Friendly Puppy)",
    title_en: "The Friendly Puppy",
    grade_recommendation: "Grade 1 - 2",
    difficulty: "సులభం (Beginner)",
    language: "en",
    text: "Ramu has a little brown puppy. The puppy runs fast in the yard. Ramu gives milk to the puppy every morning. The puppy wags its tail happily. They play with a soft red ball.",
    words: [
      "Ramu", "has", "a", "little", "brown", "puppy.",
      "The", "puppy", "runs", "fast", "in", "the", "yard.",
      "Ramu", "gives", "milk", "to", "the", "puppy", "every", "morning.",
      "The", "puppy", "wags", "its", "tail", "happily.",
      "They", "play", "with", "a", "soft", "red", "ball."
    ],
    wordCount: 34,
    comprehensionQuestions: [
      {
        id: "q1",
        question_te: "రాము దగ్గర ఎలాంటి పెంపుడు జంతువు ఉంది?",
        question_en: "What pet does Ramu have?",
        expected_te: "చిన్న గోధుమ రంగు కుక్కపిల్ల (A little brown puppy)",
        expected_en: "A little brown puppy",
        type: "literal"
      },
      {
        id: "q2",
        question_te: "రాము ప్రతి ఉదయం కుక్కపిల్లకు ఏమి ఇస్తాడు?",
        question_en: "What does Ramu give the puppy every morning?",
        expected_te: "పాలు (Milk)",
        expected_en: "Milk",
        type: "literal"
      },
      {
        id: "q3",
        question_te: "పెంపుడు జంతువులను ప్రేమగా చూసుకోవడం ఎందుకు ముఖ్యం?",
        question_en: "Why is it important to take good care of animals and pets?",
        expected_te: "స్వీయ ఆలోచన (మూగజీవులపై దయ, ప్రేమ, రక్షణ)",
        expected_en: "Personal reflection (kindness to living beings, companionship)",
        type: "inferential"
      }
    ]
  },
  {
    id: "passage_en_school_garden",
    title_te: "బడి ఆకుపచ్చ తోట (Our School Garden)",
    title_en: "Our Green School Garden",
    grade_recommendation: "Grade 2 - 3",
    difficulty: "మధ్యస్థం (Intermediate)",
    language: "en",
    text: "Our village school has a green garden. We planted tomato and chili plants with our teacher. Every day we water the plants during break time. Green leaves grow tall in the bright sunshine. Fresh vegetables are used in our midday meal.",
    words: [
      "Our", "village", "school", "has", "a", "green", "garden.",
      "We", "planted", "tomato", "and", "chili", "plants", "with", "our", "teacher.",
      "Every", "day", "we", "water", "the", "plants", "during", "break", "time.",
      "Green", "leaves", "grow", "tall", "in", "the", "bright", "sunshine.",
      "Fresh", "vegetables", "are", "used", "in", "our", "midday", "meal."
    ],
    wordCount: 42,
    comprehensionQuestions: [
      {
        id: "q1",
        question_te: "పాఠశాల తోటలో పిల్లలు ఏయే మొక్కలు నాటారు?",
        question_en: "Which plants did students grow in the school garden?",
        expected_te: "టమాటా మరియు మిరప మొక్కలు (Tomato and chili plants)",
        expected_en: "Tomato and chili plants",
        type: "literal"
      },
      {
        id: "q2",
        question_te: "తోటలో పండిన తాజా కూరగాయలను ఎక్కడ వాడతారు?",
        question_en: "Where are the fresh vegetables used?",
        expected_te: "పాఠశాల మధ్యాహ్న భోజనంలో (In school midday meal)",
        expected_en: "In the school midday meal",
        type: "literal"
      },
      {
        id: "q3",
        question_te: "మొక్కలు పెంచడం వల్ల విద్యార్థులకు ఎలాంటి మంచి అలవాట్లు అలవడుతాయి?",
        question_en: "What good values do children learn from gardening?",
        expected_te: "బాధ్యత, శ్రమ విలువ, పర్యావరణ పరిరక్షణ",
        expected_en: "Responsibility, teamwork, environmental care",
        type: "inferential"
      }
    ]
  },
  {
    id: "passage_en_village_water",
    title_te: "మన ఊరి చెరువు నీరు (Water in Our Village)",
    title_en: "Water in Our Village",
    grade_recommendation: "Grade 3 - 4",
    difficulty: "మధ్యస్థం (FLN Standard)",
    language: "en",
    text: "Water is precious for all living beings. In Telangana, our village lake fills with fresh water during rainy months. Farmers use lake water for paddy fields. White birds visit the quiet water every evening. We must keep our lake clean and avoid throwing plastic trash.",
    words: [
      "Water", "is", "precious", "for", "all", "living", "beings.",
      "In", "Telangana,", "our", "village", "lake", "fills", "with", "fresh", "water", "during", "rainy", "months.",
      "Farmers", "use", "lake", "water", "for", "paddy", "fields.",
      "White", "birds", "visit", "the", "quiet", "water", "every", "evening.",
      "We", "must", "keep", "our", "lake", "clean", "and", "avoid", "throwing", "plastic", "trash."
    ],
    wordCount: 45,
    comprehensionQuestions: [
      {
        id: "q1",
        question_te: "రైతులు చెరువు నీటిని దేని కోసం ఉపయోగిస్తారు?",
        question_en: "What do farmers use the village lake water for?",
        expected_te: "వరి పంట పొలాలకు (For paddy fields)",
        expected_en: "For paddy fields",
        type: "literal"
      },
      {
        id: "q2",
        question_te: "చెరువును పరిశుభ్రంగా ఉంచడానికి మనం ఏమి చేయకూడదు?",
        question_en: "What should we avoid doing to keep the lake clean?",
        expected_te: "ప్లాస్టిక్ చెత్త వేయకూడదు (Avoid throwing plastic trash)",
        expected_en: "Avoid throwing plastic trash",
        type: "literal"
      },
      {
        id: "q3",
        question_te: "గ్రామాలలో నీటి సంరక్షణ ఎందుకు చాలా అత్యవసరం?",
        question_en: "Why is water conservation vital for village communities?",
        expected_te: "తాగునీరు, వ్యవసాయం, జీవనోపాధి మరియు పర్యావరణ సమతుల్యత కొరకు",
        expected_en: "For drinking, agriculture, livelihood, and sustainability",
        type: "inferential"
      }
    ]
  },
  {
    id: "passage_en_telangana_heritage",
    title_te: "తెలంగాణ సంస్కృతి (The Glory of Telangana)",
    title_en: "The Glory of Telangana",
    grade_recommendation: "Grade 4 - 5",
    difficulty: "ఉన్నతం (Advanced Reader)",
    language: "en",
    text: "Telangana has a rich history and proud culture. The famous Ramappa Temple shines with beautiful stone carvings from Kakatiya times. Rivers Godavari and Krishna bring green life to our fertile farms. Children celebrate Bathukamma with colorful flowers. We feel great joy learning together in our school.",
    words: [
      "Telangana", "has", "a", "rich", "history", "and", "proud", "culture.",
      "The", "famous", "Ramappa", "Temple", "shines", "with", "beautiful", "stone", "carvings", "from", "Kakatiya", "times.",
      "Rivers", "Godavari", "and", "Krishna", "bring", "green", "life", "to", "our", "fertile", "farms.",
      "Children", "celebrate", "Bathukamma", "with", "colorful", "flowers.",
      "We", "feel", "great", "joy", "learning", "together", "in", "our", "school."
    ],
    wordCount: 46,
    comprehensionQuestions: [
      {
        id: "q1",
        question_te: "కాకతీయుల శిల్పకళా చాతుర్యం ఏ ప్రసిద్ధ ఆలయంలో కనిపిస్తుంది?",
        question_en: "Which famous temple is known for Kakatiya stone carvings?",
        expected_te: "రామప్ప దేవాలయం (Ramappa Temple)",
        expected_en: "Ramappa Temple",
        type: "literal"
      },
      {
        id: "q2",
        question_te: "తెలంగాణ నేలను సస్యశ్యామలం చేసే రెండు ప్రధాన నదులు ఏవి?",
        question_en: "Which two major rivers flow through Telangana farms?",
        expected_te: "గోదావరి మరియు కృష్ణా నదులు (Rivers Godavari and Krishna)",
        expected_en: "Rivers Godavari and Krishna",
        type: "literal"
      },
      {
        id: "q3",
        question_te: "మన రాష్ట్ర సంస్కృతిని, భాషను మనం ఎలా గౌరవించవచ్చు?",
        question_en: "How can students celebrate and respect their cultural heritage?",
        expected_te: "పండుగలను ఆనందంగా జరుపుకోవడం, చరిత్రను తెలుసుకోవడం, ఐక్యతను పాటించడం",
        expected_en: "Learning history, celebrating festivals together, respecting diversity",
        type: "inferential"
      }
    ]
  }
];

