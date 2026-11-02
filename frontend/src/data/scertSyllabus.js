// Telangana SCERT (State Council of Educational Research & Training) Syllabus Repository
// Official Curriculum Reference: https://scert.telangana.gov.in
// Covers Telugu Medium Classes 1 to 10 Across All Subjects

export const SCERT_STAGES = [
  {
    id: "primary",
    name_te: "ప్రాథమిక స్థాయి (తరగతులు 1 - 5)",
    name_en: "Primary Stage (Classes 1 - 5)",
    scheme: "తొలి మెట్టు (FLN - Foundational Literacy & Numeracy)",
    classes: ["1", "2", "3", "4", "5"]
  },
  {
    id: "upper_primary",
    name_te: "ప్రాథమికోన్నత స్థాయి (తరగతులు 6 - 8)",
    name_en: "Upper Primary Stage (Classes 6 - 8)",
    scheme: "ఉన్నతి (LIP - Learning Improvement Programme)",
    classes: ["6", "7", "8"]
  },
  {
    id: "secondary",
    name_te: "ఉన్నత పాఠశాల స్థాయి (తరగతులు 9 - 10)",
    name_en: "Secondary Stage (Classes 9 - 10 / SSC)",
    scheme: "బోర్డ్ ఆఫ్ సెకండరీ ఎడ్యుకేషన్ (SSC Curriculum & Public Exams)",
    classes: ["9", "10"]
  }
];

export const SCERT_ACADEMIC_STANDARDS = [
  {
    id: "as_1",
    name_te: "విషయ అవగాహన",
    name_en: "Conceptual Understanding",
    code: "AS-1",
    description_te: "పాఠ్యాంశాల భావనలను సొంత మాటలలో వివరించడం, కారణాలు తెలపడం, ఉదాహరణలివ్వడం."
  },
  {
    id: "as_2",
    name_te: "ప్రశ్నించడం & పరికల్పనలు చేయడం",
    name_en: "Questioning & Making Hypotheses",
    code: "AS-2",
    description_te: "సందేహాల నివృత్తికి ఆలోచనాత్మక ప్రశ్నలు వేయడం, ఫలితాలను ఊహించడం."
  },
  {
    id: "as_3",
    name_te: "ప్రయోగాలు & క్షేత్ర పరిశీలనలు",
    name_en: "Experimentation & Field Work",
    code: "AS-3",
    description_te: "ప్రయోగ పరికరాల నిర్వహణ, పరిశీలనలు నమోదు చేయడం, నివేదికలు రాయడం."
  },
  {
    id: "as_4",
    name_te: "సమాచార నైపుణ్యాలు & ప్రాజెక్టు పనులు",
    name_en: "Information Skills & Projects",
    code: "AS-4",
    description_te: "వివిధ వనరుల నుండి సమాచారాన్ని సేకరించడం, విశ్లేషించడం, పట్టికల రూపంలో ప్రదర్శించడం."
  },
  {
    id: "as_5",
    name_te: "బొమ్మలు గీయడం, నమూనాలు రూపొందించడం",
    name_en: "Drawing, Modeling & Visual Expression",
    code: "AS-5",
    description_te: "రేఖాచిత్రాలు, పటాలు, ప్రవాహ పట్టికలు మరియు నమూనాలను స్పష్టంగా గీయడం."
  },
  {
    id: "as_6",
    name_te: "ప్రశంస, విలువలు & నిజజీవిత అనువర్తనం",
    name_en: "Appreciation, Values & Real-Life Application",
    code: "AS-6",
    description_te: "ప్రకృతి పట్ల, శ్రమ పట్ల గౌరవం, పర్యావరణ పరిరక్షణ, నిత్యజీవితంలో విజ్ఞానాన్ని వినియోగించడం."
  }
];

export const SCERT_CLASSES_DATA = [
  {
    classNumber: "1",
    stageId: "primary",
    title_te: "1వ తరగతి (Class 1)",
    title_en: "Class 1 (Grade 1)",
    focus_te: "అక్షరమాల, శబ్ద అవగాహన, పూర్వ గణిత భావనలు, సరళ పదాలు (FLN తొలి మెట్టు)",
    focus_en: "Alphabet phonemes, sound awareness, pre-math concepts, simple words (FLN Tholi Mettu)",
    subjects: [
      {
        id: "c1_telugu",
        name_te: "తెలుగు వాచకం (వెన్నెల - 1)",
        name_en: "Telugu Reader (Vennela - 1)",
        subjectKey: "telugu",
        chaptersCount: 16,
        chapters: [
          { num: 1, title_te: "బడికి పోదాం (గేయం)", title_en: "Let's Go to School (Rhyme)", competencies: "శ్రవణం & మౌఖిక వ్యక్తీకరణ" },
          { num: 2, title_te: "అరక - అమ్మ (అ, ఆ, క, ర)", title_en: "Plough & Mother (Letters a, aa, ka, ra)", competencies: "అక్షరాల గుర్తింపు & శబ్దం" },
          { num: 3, title_te: "పలక - బలపం (ప, ల, బ, ప)", title_en: "Slate & Slate Pencil", competencies: "సరళ పదాల పఠనం" },
          { num: 4, title_te: "ఉడత - ఊయల (ఉ, ఊ, డ, త)", title_en: "Squirrel & Swing", competencies: "చిత్రాల ద్వారా పద గుర్తింపు" },
          { num: 5, title_te: "ఈగ - ఇల్లు (ఇ, ఈ, గ)", title_en: "Fly & House", competencies: "పదాలు పేర్చడం" },
          { num: 6, title_te: "దండ - నగ (ద, న, గ)", title_en: "Garland & Ornament", competencies: "సరళ వాక్యాల పఠనం" },
          { num: 7, title_te: "కలము - ఆట (మ, ట)", title_en: "Pen & Play", competencies: "మౌఖిక కథలు చెప్పడం" },
          { num: 8, title_te: "చందమామ రావే (అభినయ గేయం)", title_en: "Come Moon (Action Song)", competencies: "సంగీతం & శబ్ద సౌందర్యం" }
        ]
      },
      {
        id: "c1_maths",
        name_te: "గణితం (గణిత తోట - 1)",
        name_en: "Mathematics (Ganitha Thota - 1)",
        subjectKey: "maths",
        chaptersCount: 12,
        chapters: [
          { num: 1, title_te: "పూర్వ గణిత భావనలు (దగ్గర-దూరం, పెద్ద-చిన్న)", title_en: "Pre-Math Concepts (Near-Far, Big-Small)", competencies: "పరిశీలన & పోలిక" },
          { num: 2, title_te: "1 నుండి 9 వరకు సంఖ్యలు", title_en: "Numbers 1 to 9", competencies: "వస్తువులను లెక్కించడం, రాయడం" },
          { num: 3, title_te: "సున్నా భావన (0)", title_en: "Concept of Zero", competencies: "సంఖ్యా భావన" },
          { num: 4, title_te: "సంకలనం (కూడిక - 9 వరకు)", title_en: "Addition up to 9", competencies: "వస్తువులను కలపడం" },
          { num: 5, title_te: "వ్యవకలనం (తీసివేత - 9 వరకు)", title_en: "Subtraction up to 9", competencies: "వస్తువులను వేరుచేయడం" },
          { num: 6, title_te: "10 నుండి 20 వరకు సంఖ్యలు", title_en: "Numbers 10 to 20", competencies: "పదులు & ఒకట్లు" }
        ]
      },
      {
        id: "c1_evs",
        name_te: "పరిసరాల విజ్ఞానం (సమీకృత అభ్యాసం)",
        name_en: "Environmental Studies (Integrated)",
        subjectKey: "evs",
        chaptersCount: 8,
        chapters: [
          { num: 1, title_te: "నా కుటుంబం - మా ఇల్లు", title_en: "My Family & My Home", competencies: "సంబంధాల అవగాహన" },
          { num: 2, title_te: "మా బడి - పరిశుభ్రత", title_en: "Our School & Cleanliness", competencies: "వ్యక్తిగత పరిశుభ్రత అలవాట్లు" },
          { num: 3, title_te: "మొక్కలు - పూలు - పండ్లు", title_en: "Plants, Flowers & Fruits", competencies: "ప్రకృతి పరిశీలన" },
          { num: 4, title_te: "జంతువులు - పక్షులు", title_en: "Animals & Birds", competencies: "జీవవైవిధ్య పట్ల ఆసక్తి" }
        ]
      }
    ]
  },
  {
    classNumber: "2",
    stageId: "primary",
    title_te: "2వ తరగతి (Class 2)",
    title_en: "Class 2 (Grade 2)",
    focus_te: "గుణింతాలు, సరళ వాక్యాలు, 1-100 సంఖ్యలు, ప్రాథమిక కూడికలు & తీసివేతలు",
    focus_en: "Guninthalu matras, simple sentences, numbers 1-100, basic addition and subtraction",
    subjects: [
      {
        id: "c2_telugu",
        name_te: "తెలుగు వాచకం (వెన్నెల - 2)",
        name_en: "Telugu Reader (Vennela - 2)",
        subjectKey: "telugu",
        chaptersCount: 15,
        chapters: [
          { num: 1, title_te: "వాన వాన వల్లప్ప (గేయం)", title_en: "Rain Rain Song", competencies: "గేయాలాపన & శ్రవణం" },
          { num: 2, title_te: "చిలకల్లారా రండి (గుణింతాల పరిచయం)", title_en: "Come Parrots (Introduction to Matras)", competencies: "తలకట్టు, దీర్ఘం, గుడి గుర్తులు" },
          { num: 3, title_te: "కొమ్ము, కొమ్ముదీర్ఘం పదాలు", title_en: "Kommu & Kommu Deergham Words", competencies: "గుణింత పదాల పఠనం" },
          { num: 4, title_te: "ఎత్వం, ఏత్వం, ఐత్వం పదాలు", title_en: "Etvam, Aetvam, Aitvam Words", competencies: "మాత్రా భేదాల గుర్తింపు" },
          { num: 5, title_te: "ఒత్వం, ఓత్వం, ఔత్వం పదాలు", title_en: "Otvam, Otvam, Autvam Words", competencies: "ధ్వని-లిపి సమన్వయం" },
          { num: 6, title_te: "సున్న, విసర్గ పదాలు", title_en: "Sunna & Visarga Words", competencies: "పూర్ణానుస్వారం సాధన" },
          { num: 7, title_te: "కాకి - నక్క (నీతి కథ)", title_en: "The Crow and the Fox (Fable)", competencies: "ధారాళంగా చదవడం & గ్రహింపు" }
        ]
      },
      {
        id: "c2_maths",
        name_te: "గణితం (గణిత తోట - 2)",
        name_en: "Mathematics (Ganitha Thota - 2)",
        subjectKey: "maths",
        chaptersCount: 14,
        chapters: [
          { num: 1, title_te: "1 నుండి 100 వరకు సంఖ్యలు", title_en: "Numbers 1 to 100", competencies: "స్థాన విలువ (పదులు, ఒకట్లు)" },
          { num: 2, title_te: "రెండు అంకెల సంఖ్యల కూడిక (దశకంతో సహా)", title_en: "2-Digit Addition with Regrouping", competencies: "సంకలన నైపుణ్యం" },
          { num: 3, title_te: "రెండు అంకెల తీసివేత (అప్పు తెచ్చుకోవడం)", title_en: "2-Digit Subtraction with Borrowing", competencies: "వ్యవకలన నైపుణ్యం" },
          { num: 4, title_te: "ఆకారాలు & రేఖాగణిత రీతులు (వృత్తం, చతురస్రం)", title_en: "2D Shapes & Geometry (Circle, Square)", competencies: "ఆకారాల వర్గీకరణ" },
          { num: 5, title_te: "గుణకార పరిచయం (పునరావృత సంకలనం)", title_en: "Introduction to Multiplication", competencies: "సమూహాల లెక్కింపు" }
        ]
      },
      {
        id: "c2_evs",
        name_te: "పరిసరాల విజ్ఞానం (మన చుట్టూ ఉన్న ప్రపంచం)",
        name_en: "Environmental Studies (World Around Us)",
        subjectKey: "evs",
        chaptersCount: 8,
        chapters: [
          { num: 1, title_te: "మా ఊరు - మా గ్రామం", title_en: "Our Village & Community", competencies: "పరిసరాల అవగాహన" },
          { num: 2, title_te: "వివిధ వృత్తులు - సేవకులు", title_en: "Community Helpers & Occupations", competencies: "శ్రమ పట్ల గౌరవం" },
          { num: 3, title_te: "ఆహారం - మంచి అలవాట్లు", title_en: "Food & Healthy Habits", competencies: "పోషకాహార అవగాహన" },
          { num: 4, title_te: "నీరు - దాని వినియోగం", title_en: "Water & Conservation", competencies: "వనరుల పొదుపు" }
        ]
      }
    ]
  },
  {
    classNumber: "3",
    stageId: "primary",
    title_te: "3వ తరగతి (Class 3)",
    title_en: "Class 3 (Grade 3)",
    focus_te: "ఒత్తులు (ద్విత్వ & సంయుక్తాక్షరాలు), పేరా పఠనం (WCPM 30-45), 3-అంకెల సంఖ్యలు, పరిసరాల పరిశీలన",
    focus_en: "Ottulu conjuncts, passage reading fluency (WCPM 30-45), 3-digit operations, environmental observation",
    subjects: [
      {
        id: "c3_telugu",
        name_te: "తెలుగు వాచకం (తెలుగు తోట - 3)",
        name_en: "Telugu Reader (Telugu Thota - 3)",
        subjectKey: "telugu",
        chaptersCount: 12,
        chapters: [
          { num: 1, title_te: "తెలంగాణ వైభవం (గేయం - దాశరథి కృష్ణమాచార్య)", title_en: "Glory of Telangana (Poem by Dasarathi)", competencies: "దేశభక్తి & గేయాలాపన" },
          { num: 2, title_te: "మర్యాద చేద్దాం (హాస్య కథ)", title_en: "Let's Show Hospitality (Humor Story)", competencies: "చదవడం - గ్రహించడం" },
          { num: 3, title_te: "మంచి బాలుడు (నీతి కథ)", title_en: "The Good Boy (Value Story)", competencies: "సహాయ గుణం & వ్యక్తిత్వ వికాసం" },
          { num: 4, title_te: "ఉడుత సాయం (రామాయణ ఘట్టం)", title_en: "Squirrel's Help (Ramayana)", competencies: "కథా పఠనం & ఒత్తుల సాధన" },
          { num: 5, title_te: "మేలుకొలుపు (గేయం)", title_en: "The Awakening Call", competencies: "ఉచ్ఛారణ & ప్రాస పదాలు" },
          { num: 6, title_te: "తోటమాలి (శ్రమ విలువ)", title_en: "The Gardener (Dignity of Labor)", competencies: "భాషాంశాలు (నామవాచకం)" },
          { num: 7, title_te: "వేమన శతక పద్యాలు", title_en: "Vemana Moral Verses", competencies: "పద్య పఠనం & భావ గ్రహణ" },
          { num: 8, title_te: "మా పల్లె చెరువు", title_en: "Our Village Tank", competencies: "లఘు పేరా పఠనం (WCPM)" }
        ]
      },
      {
        id: "c3_maths",
        name_te: "గణితం (గణిత తోట - 3)",
        name_en: "Mathematics (Ganitha Thota - 3)",
        subjectKey: "maths",
        chaptersCount: 12,
        chapters: [
          { num: 1, title_te: "3-అంకెల సంఖ్యలు (100 - 999)", title_en: "3-Digit Numbers (100 - 999)", competencies: "విస్తరణ రూపం & స్థాన విలువలు" },
          { num: 2, title_te: "3-అంకెల సంకలనం & వ్యవకలనం", title_en: "3-Digit Addition & Subtraction", competencies: "సమస్య పరిష్కార నైపుణ్యం" },
          { num: 3, title_te: "గుణకారం (ఎక్కాలు 1 నుండి 10)", title_en: "Multiplication Tables (1 to 10)", competencies: "గుణకార సమస్యలు" },
          { num: 4, title_te: "భాగహార భావన (సమ పంపిణీ)", title_en: "Division Concept (Equal Sharing)", competencies: "భాగహార పరిచయం" },
          { num: 5, title_te: "ద్రవ్యం - రూపాయలు & పైసలు", title_en: "Money - Rupees & Paise", competencies: "రోజువారీ లెక్కలు" },
          { num: 6, title_te: "సమయం - గడియారం చూడటం", title_en: "Time - Reading the Clock", competencies: "గంటలు & నిమిషాలు" }
        ]
      },
      {
        id: "c3_evs",
        name_te: "పరిసరాల విజ్ఞానం (మన చుట్టూ ఉన్న ప్రపంచం)",
        name_en: "Environmental Studies (Our Surroundings)",
        subjectKey: "evs",
        chaptersCount: 11,
        chapters: [
          { num: 1, title_te: "కుటుంబం - మార్పులు", title_en: "Family & Changes", competencies: "కుటుంబ అనుబంధాలు" },
          { num: 2, title_te: "ఆటలు - నియమాలు", title_en: "Games & Rules", competencies: "క్రీడాస్ఫూర్తి" },
          { num: 3, title_te: "మన చుట్టూ ఉన్న జంతువులు", title_en: "Animals Around Us", competencies: "ఆహార అలవాట్లు & ఆవాసాలు" },
          { num: 4, title_te: "మన చుట్టూ ఉన్న మొక్కలు", title_en: "Plants Around Us", competencies: "మొక్కల భాగాలు & ఉపయోగాలు" },
          { num: 5, title_te: "నీరు - అమూల్యమైన వనరు", title_en: "Water - Precious Resource", competencies: "నీటి సంరక్షణ" },
          { num: 6, title_te: "బడి తోట - కూరగాయలు", title_en: "School Garden - Vegetables", competencies: "సేంద్రియ సేద్యం & పోషణ" }
        ]
      }
    ]
  },
  {
    classNumber: "4",
    stageId: "primary",
    title_te: "4వ తరగతి (Class 4)",
    title_en: "Class 4 (Grade 4)",
    focus_te: "సంయుక్తాక్షరాలు, వ్యాకరణ ప్రాథమిక భావనలు (నామవాచకం, సర్వనామం, క్రియ), 4-అంకెల సంఖ్యలు, పర్యావరణ వ్యవస్థలు",
    focus_en: "Grammar basics (parts of speech), 4-digit numbers, environmental systems",
    subjects: [
      {
        id: "c4_telugu",
        name_te: "తెలుగు వాచకం (తెలుగు తోట - 4)",
        name_en: "Telugu Reader (Telugu Thota - 4)",
        subjectKey: "telugu",
        chaptersCount: 12,
        chapters: [
          { num: 1, title_te: "వినాయక చవితి (పండుగలు)", title_en: "Vinayaka Chavithi (Festivals)", competencies: "సాంస్కృతిక అవగాహన" },
          { num: 2, title_te: "పరమానందయ్య శిష్యుల కథ", title_en: "Paramanandayya's Disciples (Folktale)", competencies: "హాస్య రస గ్రహణ & ధారాళ పఠనం" },
          { num: 3, title_te: "దేశమును ప్రేమించుమన్నా (గురజాడ అప్పారావు)", title_en: "Love Thy Nation (Gurajada)", competencies: "జాతీయ సమైక్యత & పద్యాలాపన" },
          { num: 4, title_te: "సుమతీ శతకం", title_en: "Sumati Satakam Verses", competencies: "నీతి సూక్తులు & భాషా ప్రయోగం" },
          { num: 5, title_te: "కొమురం భీమ్ ధైర్యం (వీరగాథ)", title_en: "Courage of Komaram Bheem", competencies: "తెలంగాణ చారిత్రక స్పృహ" },
          { num: 6, title_te: "బతుకమ్మ పండుగ", title_en: "Bathukamma Floral Festival", competencies: "తెలంగాణ జానపద సంప్రదాయం" }
        ]
      },
      {
        id: "c4_maths",
        name_te: "గణితం (గణిత తోట - 4)",
        name_en: "Mathematics (Ganitha Thota - 4)",
        subjectKey: "maths",
        chaptersCount: 13,
        chapters: [
          { num: 1, title_te: "4-అంకెల సంఖ్యలు (1000 - 9999)", title_en: "4-Digit Numbers", competencies: "సంఖ్యల పోలిక & అమరిక" },
          { num: 2, title_te: "4-అంకెల సంకలనం & వ్యవకలనం", title_en: "4-Digit Addition & Subtraction", competencies: "సమస్యల సాధన" },
          { num: 3, title_te: "గుణకారం (2-అంకెల సంఖ్యలతో)", title_en: "Multiplication by 2-Digit Numbers", competencies: "గుణకార వ్యూహాలు" },
          { num: 4, title_te: "భాగహారం & శేషం", title_en: "Division and Remainder", competencies: "భాగహార నియమాలు" },
          { num: 5, title_te: "భిన్నాల ప్రాథమిక భావన (1/2, 1/4, 3/4)", title_en: "Basic Fractions (Half, Quarter, 3/4)", competencies: "భాగాల వర్గీకరణ" },
          { num: 6, title_te: "పొడవు, బరువు & పాత్రల పరిమాణం", title_en: "Length, Weight & Capacity", competencies: "ప్రామాణిక కొలతలు (మీటర్, కేజీ, లీటర్)" }
        ]
      },
      {
        id: "c4_evs",
        name_te: "పరిసరాల విజ్ఞానం (మన పరిసరాలు)",
        name_en: "Environmental Studies (Our Environment)",
        subjectKey: "evs",
        chaptersCount: 12,
        chapters: [
          { num: 1, title_te: "జంతువులు - వాటి ఇంద్రియాలు", title_en: "Animals & Their Senses", competencies: "జీవ లక్షణాల పరిశీలన" },
          { num: 2, title_te: "గూళ్ళు - ఆవాసాలు", title_en: "Nests & Habitats", competencies: "పక్షుల జీవన రీతులు" },
          { num: 3, title_te: "వ్యవసాయం - పంటలు", title_en: "Agriculture & Crops", competencies: "రైతుల శ్రమ & ఆహార ఉత్పత్తి" },
          { num: 4, title_te: "మన ఊరి చెరువులు - జల సంరక్షణ", title_en: "Village Tanks & Water Conservation", competencies: "మిషన్ కాకతీయ స్ఫూర్తి" }
        ]
      }
    ]
  },
  {
    classNumber: "5",
    stageId: "primary",
    title_te: "5వ తరగతి (Class 5)",
    title_en: "Class 5 (Grade 5)",
    focus_te: "ధారాళ పఠనం (WCPM 60+), సంక్లిష్ట అవగాహన, భిన్నాలు & దశాంశాలు, జీవావరణం & సాంఘిక స్పృహ",
    focus_en: "Reading fluency (WCPM 60+), comprehension, fractions & decimals, ecosystem & civic sense",
    subjects: [
      {
        id: "c5_telugu",
        name_te: "తెలుగు వాచకం (తెలుగు తోట - 5)",
        name_en: "Telugu Reader (Telugu Thota - 5)",
        subjectKey: "telugu",
        chaptersCount: 12,
        chapters: [
          { num: 1, title_te: "మన జెండా (గేయం - పోతులూరి వీరబ్రహ్మం)", title_en: "Our National Flag", competencies: "జాతీయ గౌరవం & దేశభక్తి" },
          { num: 2, title_te: "యాదగిరిగుట్ట (పుణ్యక్షేత్రం)", title_en: "Yadagirigutta Heritage", competencies: "తెలంగాణ దేవాలయ చరిత్ర & శిల్పకళ" },
          { num: 3, title_te: "భాస్కర శతకం", title_en: "Bhaskara Satakam Verses", competencies: "ఉదాహరణ పద్యాల రసాస్వాదన" },
          { num: 4, title_te: "పల్లెటూరి పిల్లగాడా (సుద్దాల హనుమంతు)", title_en: "Palleturi Pillagada (Suddala Hanmanthu)", competencies: "సామాజిక స్పృహ & బాలకార్మిక నిర్మూలన" },
          { num: 5, title_te: "చిట్యాల ఐలమ్మ (తెలంగాణ వీరవనిత)", title_en: "Chityala Ailamma (Telangana Heroine)", competencies: "చారిత్రక పోరాట స్ఫూర్తి" },
          { num: 6, title_te: "నీడ ఖరీదు (హాస్య కథ)", title_en: "Cost of the Shadow (Folk Tale)", competencies: "హాస్యం & లోక జ్ఞానం" }
        ]
      },
      {
        id: "c5_maths",
        name_te: "గణితం (గణిత తోట - 5)",
        name_en: "Mathematics (Ganitha Thota - 5)",
        subjectKey: "maths",
        chaptersCount: 14,
        chapters: [
          { num: 1, title_te: "పెద్ద సంఖ్యలు (లక్ష వరకు)", title_en: "Large Numbers up to 1,00,000", competencies: "భారతీయ సంఖ్యామానం" },
          { num: 2, title_te: "నాలుగు ప్రాథమిక ప్రక్రియలు", title_en: "Four Fundamental Operations", competencies: "సంకలనం, వ్యవకలనం, గుణకారం, భాగహారం" },
          { num: 3, title_te: "సాధారణ భిన్నాలు & దశాంశ భిన్నాలు", title_en: "Common & Decimal Fractions", competencies: "భిన్నాల కూడికలు & తీసివేతలు" },
          { num: 4, title_te: "చుట్టుకొలత & వైశాల్యం", title_en: "Perimeter and Area", competencies: "చతురస్రం & దీర్ఘచతురస్రం" },
          { num: 5, title_te: "దత్తాంశ నిర్వహణ (బార్ గ్రాఫ్‌లు)", title_en: "Data Handling & Bar Graphs", competencies: "సమాచార విశ్లేషణ" }
        ]
      },
      {
        id: "c5_evs",
        name_te: "పరిసరాల విజ్ఞానం (మన పరిసరాలు)",
        name_en: "Environmental Studies (Our Surroundings)",
        subjectKey: "evs",
        chaptersCount: 12,
        chapters: [
          { num: 1, title_te: "మన శరీరం - ఇంద్రియాలు", title_en: "Our Body & Sense Organs", competencies: "శరీర నిర్మాణం & ఆరోగ్యం" },
          { num: 2, title_te: "అడవులు - గిరిజనుల జీవనం", title_en: "Forests & Tribal Life", competencies: "పర్యావరణ సమతుల్యత" },
          { num: 3, title_te: "వ్యవసాయం - ఆహార భద్రత", title_en: "Agriculture & Food Security", competencies: "ఆహార ధాన్యాలు & సంరక్షణ" },
          { num: 4, title_te: "చారిత్రక కట్టడాలు - తెలంగాణ వైభవం", title_en: "Historical Monuments of Telangana", competencies: "చారిత్రక వారసత్వ పరిరక్షణ" }
        ]
      }
    ]
  },
  {
    classNumber: "6",
    stageId: "upper_primary",
    title_te: "6వ తరగతి (Class 6)",
    title_en: "Class 6 (Grade 6)",
    focus_te: "నవవసంతం-1, ఉపవాచకం రామాయణం, బీజగణిత ప్రాథమికాలు, సామాన్య శాస్త్ర పరిశోధనలు (ఉన్నతి LIP)",
    focus_en: "Navavasantham-1, Ramayana, pre-algebra, general science experiments (Unnathi LIP)",
    subjects: [
      {
        id: "c6_telugu",
        name_te: "ప్రథమ భాష తెలుగు (నవవసంతం - 1)",
        name_en: "First Language Telugu (Navavasantham - 1)",
        subjectKey: "telugu",
        chaptersCount: 12,
        chapters: [
          { num: 1, title_te: "అభినందన (గేయం - శేషం లక్ష్మీనారాయణాచార్య)", title_en: "Felicitation (Farmers & Soldiers)", competencies: "రైతు, జవాన్ల పట్ల కృతజ్ఞత" },
          { num: 2, title_te: "స్నేహబంధం (కథ - చిన్నయసూరి)", title_en: "Bond of Friendship (Panchatantra)", competencies: "స్నేహ విలువ & పఠన గ్రహణం" },
          { num: 3, title_te: "వర్షం (పద్యం - పల్లదుర్గయ్య)", title_en: "Rain (Classical Telugu Poetry)", competencies: "వర్ణన & శ్రవణ రసాస్వాదన" },
          { num: 4, title_te: "లేఖ (జాబు - స్నేహితునికి ఉత్తరం)", title_en: "Letter Writing Format", competencies: "సృజనాత్మక లేఖారచన" },
          { num: 5, title_te: "శతక సుధ (సుమతీ, వేమన, కుమార శతకాలు)", title_en: "Nectar of Satakas (Moral Verses)", competencies: "కంఠస్థీకరణ & తాత్పర్యం" },
          { num: 6, title_te: "ఉపవాచకం: రామాయణం (బాలకాండ & అయోధ్యాకాండ)", title_en: "Supplementary: Ramayana Epics", competencies: "పాత్ర చిత్రణ & కథనం" }
        ]
      },
      {
        id: "c6_maths",
        name_te: "గణితం (Mathematics - తెలుగు మాధ్యమం)",
        name_en: "Mathematics (Telugu Medium)",
        subjectKey: "maths",
        chaptersCount: 14,
        chapters: [
          { num: 1, title_te: "మన సంఖ్యలను తెలుసుకుందాం (కోట్ల వరకు)", title_en: "Knowing Our Numbers up to Crores", competencies: "భారతీయ & అంతర్జాతీయ సంఖ్యామానాలు" },
          { num: 2, title_te: "పూర్ణాంకాలు (Whole Numbers)", title_en: "Whole Numbers & Properties", competencies: "సంవృత, స్థిత్యంతర, సహచర ధర్మాలు" },
          { num: 3, title_te: "సంఖ్యలతో ఆడుకుందాం (కారణాంకాలు, గుణిజాలు)", title_en: "Playing with Numbers (Factors, Multiples)", competencies: "క.సా.గు & గ.సా.భా (LCM & HCF)" },
          { num: 4, title_te: "ప్రాథమిక రేఖాగణిత భావనలు", title_en: "Basic Geometrical Ideas", competencies: "బిందువు, సరళరేఖ, కిరణం, కోణాలు" },
          { num: 5, title_te: "పూర్ణసంఖ్యలు (Integers: ధన, ఋణ సంఖ్యలు)", title_en: "Integers (Positive and Negative)", competencies: "సంఖ్యా రేఖపై కూడికలు" },
          { num: 6, title_te: "బీజగణిత పరిచయం (చరరాశులు)", title_en: "Introduction to Algebra", competencies: "బీజీయ సమాసాల నిర్మాణం" }
        ]
      },
      {
        id: "c6_science",
        name_te: "సామాన్య శాస్త్రం (General Science)",
        name_en: "General Science",
        subjectKey: "science",
        chaptersCount: 16,
        chapters: [
          { num: 1, title_te: "మనకు కావలసిన ఆహారం", title_en: "Our Food Components", competencies: "పిండిపదార్థాలు, మాంసకృత్తులు, విటమిన్లు" },
          { num: 2, title_te: "పదార్థాలు - వస్తువులు (లక్షణాలు)", title_en: "Materials and Things", competencies: "పారదర్శక, అపారదర్శక పదార్థాలు" },
          { num: 3, title_te: "దూరాలను - కొలతలను కొలుద్దాం", title_en: "Measurement of Distances", competencies: "SI ప్రామాణిక ప్రమాణాలు" },
          { num: 4, title_te: "కాంతి - నీడలు - ప్రతిబింబాలు", title_en: "Light, Shadows and Reflections", competencies: "కాంతి రుజుమార్గ ప్రయాణం" },
          { num: 5, title_te: "జీవుల ఆవాసం", title_en: "Habitat of Living Organisms", competencies: "భౌమ, జల ఆవాసాలు" },
          { num: 6, title_te: "మొక్కల భాగాలు - వాటి విధులు", title_en: "Plant Parts and Their Functions", competencies: "వేరు వ్యవస్థ, కిరణజన్య సంయోగక్రియ" }
        ]
      },
      {
        id: "c6_social",
        name_te: "సాంఘిక శాస్త్రం (Social Studies)",
        name_en: "Social Studies",
        subjectKey: "social",
        chaptersCount: 12,
        chapters: [
          { num: 1, title_te: "పటాల పఠనం - విశ్లేషణ", title_en: "Reading and Making Maps", competencies: "దిక్కులు, స్కేలు, సంకేతాలు" },
          { num: 2, title_te: "భూగోళం - భూమి నమూనా", title_en: "Globe - Model of the Earth", competencies: "అక్షాంశాలు & రేఖాంశాలు" },
          { num: 3, title_te: "తెలంగాణ భౌగోళిక స్వరూపం", title_en: "Landforms of Telangana", competencies: "పీఠభూమి, నదులు, కొండలు" },
          { num: 4, title_te: "తొలి మానవుల జీవనం", title_en: "Early Human Life", competencies: "వేట-సేకరణ నుండి వ్యవసాయం వరకు" }
        ]
      }
    ]
  },
  {
    classNumber: "7",
    stageId: "upper_primary",
    title_te: "7వ తరగతి (Class 7)",
    title_en: "Class 7 (Grade 7)",
    focus_te: "నవవసంతం-2, అకరణీయ సంఖ్యలు, జీవుల్లో పోషణ & శ్వాసక్రియ, మధ్యయుగ చరిత్ర (కాకతీయులు)",
    focus_en: "Navavasantham-2, rational numbers, nutrition & respiration, medieval history",
    subjects: [
      {
        id: "c7_telugu",
        name_te: "ప్రథమ భాష తెలుగు (నవవసంతం - 2)",
        name_en: "First Language Telugu (Navavasantham - 2)",
        subjectKey: "telugu",
        chaptersCount: 12,
        chapters: [
          { num: 1, title_te: "చదువు (పద్యం - కొఱవి గోపరాజు)", title_en: "Importance of Education (Poem)", competencies: "విద్య ఆవశ్యకత & పద్య ధారణ" },
          { num: 2, title_te: "నాయనమ్మ (కథ - కథా సాహిత్యం)", title_en: "Grandmother (Emotional Story)", competencies: "వృద్ధుల పట్ల ఆదరణ & సంభాషణ" },
          { num: 3, title_te: "మేలిమి ముత్యాలు (శతక పద్యాలు)", title_en: "Precious Pearls (Sataka Verses)", competencies: "తాత్పర్యం & నైతిక విలువలు" },
          { num: 4, title_te: "అమ్మ జ్ఞాపకాలు (ఆధునిక కవిత్వం)", title_en: "Memories of Mother", competencies: "మాతృప్రేమ & భావవ్యక్తీకరణ" },
          { num: 5, title_te: "పల్లె అందాలు (శ్రావ్యమైన పద్యాలు)", title_en: "Village Beauties", competencies: "ప్రకృతి వర్ణన" },
          { num: 6, title_te: "ఉపవాచకం: భారతంలో నీతికథలు", title_en: "Supplementary: Mahabharata Moral Tales", competencies: "ధర్మనిష్ఠ & విశ్లేషణ" }
        ]
      },
      {
        id: "c7_maths",
        name_te: "గణితం (Mathematics - తెలుగు మాధ్యమం)",
        name_en: "Mathematics (Telugu Medium)",
        subjectKey: "maths",
        chaptersCount: 15,
        chapters: [
          { num: 1, title_te: "పూర్ణసంఖ్యల గుణకారం & భాగహారం", title_en: "Multiplication and Division of Integers", competencies: "సంజ్ఞా నియమాలు (+, -)" },
          { num: 2, title_te: "భిన్నాలు, దశాంశాలు & అకరణీయ సంఖ్యలు", title_en: "Fractions, Decimals & Rational Numbers", competencies: "భిన్నాల ప్రక్రియలు" },
          { num: 3, title_te: "సాధారణ సమీకరణాలు", title_en: "Simple Equations", competencies: "ఏక చరరాశి రేఖీయ సమీకరణాలు" },
          { num: 4, title_te: "రేఖలు & కోణాలు (ఆసన్న, శీర్షాభిముఖ కోణాలు)", title_en: "Lines and Angles (Adjacent, Vertically Opposite)", competencies: "సమాంతర రేఖలు, తిర్యగ్రేఖ" },
          { num: 5, title_te: "త్రిభుజం - దాని ధర్మాలు", title_en: "Triangle and Its Properties", competencies: "కోణాల మొత్తం సిద్ధాంతం (180°)" }
        ]
      },
      {
        id: "c7_science",
        name_te: "సామాన్య శాస్త్రం (General Science)",
        name_en: "General Science",
        subjectKey: "science",
        chaptersCount: 17,
        chapters: [
          { num: 1, title_te: "ఆహారంలోని అంశాలు (పోషకాలు)", title_en: "Food Components & Nutrition", competencies: "సంతులిత ఆహారం" },
          { num: 2, title_te: "ఆమ్లాలు - క్షారాలు - లవణాలు", title_en: "Acids, Bases and Salts", competencies: "లిట్మస్ సూచికలు & తటస్థీకరణం" },
          { num: 3, title_te: "పట్టు - ఉన్ని (జంతు సంబంధ దారాలు)", title_en: "Silk and Wool (Animal Fibres)", competencies: "పట్టుపురుగు జీవిత చక్రం" },
          { num: 4, title_te: "చలనం - కాలం (సమచలనం)", title_en: "Motion and Time (Uniform Motion)", competencies: "వేగం = దూరం / కాలం" },
          { num: 5, title_te: "ఉష్ణం - ఉష్ణోగ్రత", title_en: "Heat and Temperature", competencies: "ఉష్ణ ప్రసార పద్ధతులు (వహనం, సంవహనం)" }
        ]
      },
      {
        id: "c7_social",
        name_te: "సాంఘిక శాస్త్రం (Social Studies)",
        name_en: "Social Studies",
        subjectKey: "social",
        chaptersCount: 14,
        chapters: [
          { num: 1, title_te: "పటాల విశ్లేషణ - ఎత్తులు చూపడం", title_en: "Maps Reading & Contours", competencies: "భూతల స్వరూపాలు" },
          { num: 2, title_te: "వర్షం - నదులు - చెరువులు", title_en: "Rain, Rivers and Tanks", competencies: "జల చక్రం & కరువు నివారణ" },
          { num: 3, title_te: "కాకతీయులు - తెలంగాణ సామ్రాజ్యం", title_en: "Kakatiyas - Golden Age of Telangana", competencies: "రుద్రమదేవి, గొలుసుకట్టు చెరువుల నిర్మాణం" },
          { num: 4, title_te: "విజయనగర సామ్రాజ్యం", title_en: "Vijayanagara Empire", competencies: "శ్రీకృష్ణదేవరాయలు & సాంస్కృతిక వికాసం" }
        ]
      }
    ]
  },
  {
    classNumber: "8",
    stageId: "upper_primary",
    title_te: "8వ తరగతి (Class 8)",
    title_en: "Class 8 (Grade 8)",
    focus_te: "నవవసంతం-3, బీజగణిత సర్వసమీకరణాలు, భౌతిక & జీవ శాస్త్రాలు వేర్వేరుగా అధ్యయనం, భారత రాజ్యాంగం",
    focus_en: "Navavasantham-3, algebraic identities, physics & biology separation, Indian Constitution",
    subjects: [
      {
        id: "c8_telugu",
        name_te: "ప్రథమ భాష తెలుగు (నవవసంతం - 3)",
        name_en: "First Language Telugu (Navavasantham - 3)",
        subjectKey: "telugu",
        chaptersCount: 12,
        chapters: [
          { num: 1, title_te: "త్యాగనిరతి (నన్నయ - మహాభారతం)", title_en: "Spirit of Sacrifice (Nannaya)", competencies: "శిబి చక్రవర్తి కథ, ప్రాచీన పద్య శైలి" },
          { num: 2, title_te: "సముద్ర లంఘనం (అయ్యలరాజు రామభద్రుడు)", title_en: "Crossing the Ocean (Hanuman)", competencies: "రూపక కల్పన & ఛందస్సు" },
          { num: 3, title_te: "బండారి బసవన్న (పాల్కురికి సోమనాథుడు)", title_en: "Bandari Basavanna (Dwipada)", competencies: "ద్విపద ఛందస్సు & భక్తి భావం" },
          { num: 4, title_te: "చిన్నప్పుడే (వచన కవిత)", title_en: "Childhood Memories", competencies: "సమకాలీన కవితా శైలి" },
          { num: 5, title_te: "శతక సుధ (సుభాషితాలు)", title_en: "Sataka Sudha", competencies: "నీతి సూక్తుల వ్యాఖ్యానం" },
          { num: 6, title_te: "వ్యాకరణం: సంధులు (సవర్ణదీర్ఘ, గుణ, వృద్ధి సంధులు)", title_en: "Grammar: Sandhi Rules", competencies: "పద విడదీత & సంధి సూత్రాలు" }
        ]
      },
      {
        id: "c8_maths",
        name_te: "గణితం (Mathematics - తెలుగు మాధ్యమం)",
        name_en: "Mathematics (Telugu Medium)",
        subjectKey: "maths",
        chaptersCount: 15,
        chapters: [
          { num: 1, title_te: "అకరణీయ సంఖ్యలు (Rational Numbers)", title_en: "Rational Numbers & Operations", competencies: "సాంద్రతా ధర్మం" },
          { num: 2, title_te: "ఏక చరరాశిలో రేఖీయ సమీకరణాలు", title_en: "Linear Equations in One Variable", competencies: "పక్షాంతరం & సాధన" },
          { num: 3, title_te: "చతుర్భుజాల నిర్మాణాలు", title_en: "Construction of Quadrilaterals", competencies: "స్కేల్ & కంపాస్ నిర్మాణం" },
          { num: 4, title_te: "వర్గాలు, వర్గమూలాలు & ఘనాలు", title_en: "Squares, Square Roots & Cubes", competencies: "ప్రధాన కారణాంకాల పద్ధతి, భాగాహార పద్ధతి" },
          { num: 5, title_te: "బీజీయ సమాసాలు & సర్వసమీకరణాలు", title_en: "Algebraic Expressions & Identities", competencies: "(a+b)², (a-b)², a²-b² అనువర్తనాలు" }
        ]
      },
      {
        id: "c8_physics",
        name_te: "భౌతిక రసాయన శాస్త్రాలు (Physical Sciences)",
        name_en: "Physical Sciences",
        subjectKey: "physics",
        chaptersCount: 12,
        chapters: [
          { num: 1, title_te: "బలం (Force) - బలం రకాలు", title_en: "Force & Types of Forces", competencies: "స్పర్శా బలాలు, క్షేత్ర బలాలు" },
          { num: 2, title_te: "ఘర్షణ (Friction) - లాభాలు, నష్టాలు", title_en: "Friction - Advantages & Disadvantages", competencies: "ఘర్షణను తగ్గించే పద్ధతులు" },
          { num: 3, title_te: "కృత్రిమ దారాలు & ప్లాస్టిక్‌లు", title_en: "Synthetic Fibres and Plastics", competencies: "4R సూత్రం & పర్యావరణ పరిరక్షణ" },
          { num: 4, title_te: "లోహాలు - అలోహాలు", title_en: "Metals and Non-Metals", competencies: "భౌతిక & రసాయన ధర్మాలు" },
          { num: 5, title_te: "ధ్వని (Sound) - ఉత్పత్తి, ప్రసారం", title_en: "Sound - Production & Propagation", competencies: "శ్రవ్య అవధి (20 Hz - 20,000 Hz)" }
        ]
      },
      {
        id: "c8_biology",
        name_te: "జీవ శాస్త్రం (Biological Sciences)",
        name_en: "Biological Sciences",
        subjectKey: "biology",
        chaptersCount: 11,
        chapters: [
          { num: 1, title_te: "కణం - జీవుల ప్రాథమిక ప్రమాణం", title_en: "Cell - The Basic Unit of Life", competencies: "వృక్ష & జంతు కణాల నిర్మాణం" },
          { num: 2, title_te: "సూక్ష్మజీవుల ప్రపంచం (బ్యాక్టీరియా, వైరస్, శిలీంధ్రాలు)", title_en: "Microbial World", competencies: "ఉపయోగకర & హానికర సూక్ష్మజీవులు" },
          { num: 3, title_te: "జంతువులలో ప్రత్యుత్పత్తి", title_en: "Reproduction in Animals", competencies: "లైంగిక & అలైంగిక విధానాలు" },
          { num: 4, title_te: "కౌమార దశ - శారీరక మార్పులు", title_en: "Adolescence & Growth", competencies: "హార్మోన్లు & సమతుల్య జీవనం" }
        ]
      },
      {
        id: "c8_social",
        name_te: "సాంఘిక శాస్త్రం (Social Studies)",
        name_en: "Social Studies",
        subjectKey: "social",
        chaptersCount: 14,
        chapters: [
          { num: 1, title_te: "పటాల పఠనం - అనువర్తనాలు", title_en: "Reading and Analysis of Maps", competencies: "విషయ సంబంధిత పటాలు" },
          { num: 2, title_te: "భూమి - సూర్యుడు - రుతువులు", title_en: "Sun, Earth and Seasons", competencies: "భూభ్రమణం & పరిభ్రమణం" },
          { num: 3, title_te: "భారత రాజ్యాంగం - మూలస్తంభాలు", title_en: "Indian Constitution - Core Pillars", competencies: "ప్రాథమిక హక్కులు & విధులు" },
          { num: 4, title_te: "పార్లమెంటు - కేంద్ర ప్రభుత్వం", title_en: "Parliament & Central Government", competencies: "చట్టాల తయారీ విధానం" }
        ]
      }
    ]
  },
  {
    classNumber: "9",
    stageId: "secondary",
    title_te: "9వ తరగతి (Class 9)",
    title_en: "Class 9 (Grade 9)",
    focus_te: "సింగిడి-1, బహుపదులు, నిరూపక రేఖాగణితం, పరమాణు నిర్మాణం, కణజాలాలు, ప్రజాస్వామ్య వ్యవస్థలు",
    focus_en: "Singidi-1, polynomials, coordinate geometry, atomic structure, tissues, democratic systems",
    subjects: [
      {
        id: "c9_telugu",
        name_te: "ప్రథమ భాష తెలుగు (సింగిడి - 1)",
        name_en: "First Language Telugu (Singidi - 1)",
        subjectKey: "telugu",
        chaptersCount: 12,
        chapters: [
          { num: 1, title_te: "ధర్మార్జునులు (చేమకూర వేంకటకవి)", title_en: "Dharmarjunulu (Classical Epics)", competencies: "పాండవుల సుగుణాలు & ప్రాచీన పద్య ధారణ" },
          { num: 2, title_te: "నేనెరిగిన బూర్గుల (పి.వి. నరసింహారావు)", title_en: "Burgula As I Knew Him (PV Narasimha Rao)", competencies: "వ్యక్తిత్వ చిత్రణ & వచన శైలి" },
          { num: 3, title_te: "వలస (కవిత - ముకుంద రామారావు)", title_en: "Migration (Valasa - Modern Poetry)", competencies: "వలస కార్మికుల వేదన & సామాజిక స్పృహ" },
          { num: 4, title_te: "కోకిలమ్మ పెళ్ళి (ఆధునిక కవిత్వం)", title_en: "Koki lamma Wedding", competencies: "శబ్దాలంకారాలు & శైలి" },
          { num: 5, title_te: "శతక మధురిమ (నీతి శతకాలు)", title_en: "Sweetness of Satakas", competencies: "పద్య పద విభజన & తాత్పర్య రచన" },
          { num: 6, title_te: "వ్యాకరణం: సమాసాలు & ఛందస్సు (ఉత్పలమాల, చంపకమాల)", title_en: "Grammar: Samasalu & Chandassu", competencies: "గణ విభజన & యతి-ప్రాస నియమాలు" }
        ]
      },
      {
        id: "c9_maths",
        name_te: "గణితం (Mathematics - తెలుగు మాధ్యమం)",
        name_en: "Mathematics (Telugu Medium)",
        subjectKey: "maths",
        chaptersCount: 15,
        chapters: [
          { num: 1, title_te: "వాస్తవ సంఖ్యలు (Real Numbers)", title_en: "Real Numbers & Irrational Numbers", competencies: "కరణీయ సంఖ్యలు (√2, √3) నిరూపణ" },
          { num: 2, title_te: "బహుపదులు & కారణాంక విభజన", title_en: "Polynomials & Factorization", competencies: "శేష సిద్ధాంతం & కారణాంక సిద్ధాంతం" },
          { num: 3, title_te: "నిరూపక రేఖాగణితం (కార్టీసియన్ తలం)", title_en: "Coordinate Geometry (Cartesian Plane)", competencies: "బిందువుల గుర్తింపు (x, y)" },
          { num: 4, title_te: "రెండు చరరాశులలో రేఖీయ సమీకరణాలు", title_en: "Linear Equations in Two Variables", competencies: "గ్రాఫ్ గీయడం & సాధనలు" },
          { num: 5, title_te: "సరూప త్రిభుజాలు & పైథాగరస్ సిద్ధాంతం", title_en: "Triangles & Geometric Proofs", competencies: "సర్వసమానత & సరూపత" },
          { num: 6, title_te: "సాంఖ్యకశాస్త్రం (సగటు, మధ్యగతం, బాహుళకం)", title_en: "Statistics (Mean, Median, Mode)", competencies: "కేంద్ర స్థానపు కొలతలు" }
        ]
      },
      {
        id: "c9_physics",
        name_te: "భౌతిక రసాయన శాస్త్రాలు (Physical Sciences)",
        name_en: "Physical Sciences",
        subjectKey: "physics",
        chaptersCount: 12,
        chapters: [
          { num: 1, title_te: "చలనం (Kinematics - స్థానభ్రంశం, వేగం, త్వరణం)", title_en: "Motion (Displacement, Velocity, Acceleration)", competencies: "చలన సమీకరణాలు (v = u + at)" },
          { num: 2, title_te: "చలన నియమాలు (న్యూటన్ గమన నియమాలు)", title_en: "Newton's Laws of Motion", competencies: "ద్రవ్యవేగ పరిరక్షణ సిద్ధాంతం" },
          { num: 3, title_te: "గురుత్వాకర్షణ (సార్వత్రిక గురుత్వాకర్షణ నియమం)", title_en: "Gravitation & Free Fall", competencies: "గురుత్వ త్వరణం (g = 9.8 m/s²)" },
          { num: 4, title_te: "పని - శక్తి (గతిజ శక్తి & స్థితిజ శక్తి)", title_en: "Work and Energy (KE and PE)", competencies: "శక్తి నిత్యత్వ నియమం" },
          { num: 5, title_te: "పరమాణువులు - అణువులు (రసాయన సంయోగ నియమాలు)", title_en: "Atoms and Molecules", competencies: "మోల్ భావన & పరమాణు ద్రవ్యరాశి" }
        ]
      },
      {
        id: "c9_biology",
        name_te: "జీవ శాస్త్రం (Biological Sciences)",
        name_en: "Biological Sciences",
        subjectKey: "biology",
        chaptersCount: 11,
        chapters: [
          { num: 1, title_te: "కణ నిర్మాణం - కణాంగాలు", title_en: "Cell Structure and Organelles", competencies: "మైటోకాండ్రియా, క్లోరోప్లాస్ట్, రైబోజోములు" },
          { num: 2, title_te: "వృక్ష కణజాలాలు (విభాజ్య, సరళ, సంక్లిష్ట కణజాలాలు)", title_en: "Plant Tissues (Xylem, Phloem)", competencies: "దారువు & పోషక కణజాలం విధులు" },
          { num: 3, title_te: "జంతు కణజాలాలు (ఉపకళ, సంయోజక, కండర, నాడీ)", title_en: "Animal Tissues (Connective, Nervous)", competencies: "రక్తము, ఎముక, న్యూరాన్ నిర్మాణం" },
          { num: 4, title_te: "జీవ వైవిధ్యం - వర్గీకరణ (5 రాజ్యాల వర్గీకరణ)", title_en: "Diversity in Living Organisms", competencies: "విట్టేకర్ వర్గీకరణ పద్ధతి" }
        ]
      },
      {
        id: "c9_social",
        name_te: "సాంఘిక శాస్త్రం (Social Studies)",
        name_en: "Social Studies",
        subjectKey: "social",
        chaptersCount: 15,
        chapters: [
          { num: 1, title_te: "మన భూమి - అంతర్భాగ నిర్మాణం", title_en: "Our Earth - Interior Structure", competencies: "భూపటలం, భూప్రావారం, భూకేంద్రం" },
          { num: 2, title_te: "శీతోష్ణస్థితి - వాతావరణం", title_en: "Climate and Weather", competencies: "ఉష్ణోగ్రత, పీడనం, వర్షపాతం" },
          { num: 3, title_te: "భారతదేశంలో వ్యవసాయం - ఆహార భద్రత", title_en: "Agriculture & Food Security in India", competencies: "హరిత విప్లవం & ప్రజా పంపిణీ వ్యవస్థ" },
          { num: 4, title_te: "ప్రజాస్వామ్యం - ఎన్నికల ప్రక్రియ", title_en: "Democratic Politics & Elections", competencies: "సార్వజనీన వయోజన ఓటుహక్కు" }
        ]
      }
    ]
  },
  {
    classNumber: "10",
    stageId: "secondary",
    title_te: "10వ తరగతి (Class 10 / SSC)",
    title_en: "Class 10 (Grade 10 / SSC Public Exam)",
    focus_te: "సింగిడి-2, వాస్తవ సంఖ్యలు, త్రికోణమితి, కాంతి & విద్యుత్, పోషణ-శ్వాసక్రియ, భారత జాతీయోద్యమం (బోర్డు పరీక్షల లక్ష్యాలు)",
    focus_en: "Singidi-2, trigonometry, optics & electromagnetism, life processes, Indian freedom movement (SSC Board Exams)",
    subjects: [
      {
        id: "c10_telugu",
        name_te: "ప్రథమ భాష తెలుగు (సింగిడి - 2)",
        name_en: "First Language Telugu (Singidi - 2 / SSC Core)",
        subjectKey: "telugu",
        chaptersCount: 12,
        chapters: [
          { num: 1, title_te: "దానశీలము (బమ్మెర పోతన - భాగవతం)", title_en: "Virtue of Charity (Pothana - Bhagavatam)", competencies: "బలి చక్రవర్తి దాన గుణం, ప్రాచీన పద్యాలు" },
          { num: 2, title_te: "ఎవరి భాష వాళ్ళది (డా॥ సామల సదాశివ)", title_en: "One's Own Language (Samala Sadasiva)", competencies: "తెలంగాణ మాండలిక సౌందర్యం & వ్యాస శైలి" },
          { num: 3, title_te: "వీర తెలంగాణ (దాశరథి కృష్ణమాచార్య)", title_en: "Heroic Telangana (Poem by Dasarathi)", competencies: "తెలంగాణ పోరాట పటిమ & భావోద్వేగ పఠనం" },
          { num: 4, title_te: "కొత్తబాట (డా॥ పాకాల యశోదారెడ్డి)", title_en: "New Path (Dr. P. Yashoda Reddy)", competencies: "తెలంగాణ పల్లె జీవనం & భాషా ప్రయోగం" },
          { num: 5, title_te: "శతక మధురిమ (వివిధ నీతి శతకాలు)", title_en: "Nectar of Satakas (Vemana, Sumati, etc.)", competencies: "ప్రతిపదార్థం, తాత్పర్యం & కంఠస్థం" },
          { num: 6, title_te: "భాగ్యోదయం (కృష్ణస్వామి ముదిరాజ్)", title_en: "Dawn of Fortune (Bhagya Reddy Varma)", competencies: "సామాజిక సంస్కరణ & దళితోద్ధరణ" },
          { num: 7, title_te: "లక్ష్యసిద్ధి (సంపాదకీయం - తెలంగాణ ఏర్పాటు)", title_en: "Achievement of Goal (Telangana Formation)", competencies: "సంపాదకీయ శైలి & భాషా విశేషాలు" },
          { num: 8, title_te: "ఉపవాచకం: రామాయణం (కాండాల వారీగా)", title_en: "Non-Detail: Sri Ramayanam (All Kandas)", competencies: "పాత్ర స్వభావాలు, సందర్భోచిత వాక్యాలు" },
          { num: 9, title_te: "వ్యాకరణం: ఛందస్సు, అలంకారాలు, సమాసాలు", title_en: "Grammar: Prosody, Figures of Speech, Compounds", competencies: "ఉత్పలమాల, చంపకమాల, ఉపమా, రూపక అలంకారాలు" }
        ]
      },
      {
        id: "c10_maths",
        name_te: "గణితం (Mathematics - తెలుగు మాధ్యమం)",
        name_en: "Mathematics (Telugu Medium / SSC Board)",
        subjectKey: "maths",
        chaptersCount: 14,
        chapters: [
          { num: 1, title_te: "వాస్తవ సంఖ్యలు (యూక్లిడ్ భాగహార న్యాయం)", title_en: "Real Numbers & Euclid's Division Lemma", competencies: "అంకగణిత ప్రాథమిక సిద్ధాంతం, లాగరిథమ్స్" },
          { num: 2, title_te: "సమితులు (Sets - వెన్ చిత్రాలు)", title_en: "Sets (Venn Diagrams, Subsets)", competencies: "సమితుల సమ్మేళనం, ఛేదనం, వ్యవకలనం" },
          { num: 3, title_te: "బహుపదులు (Polynomials)", title_en: "Polynomials & Quadratic Equations", competencies: "శూన్య విలువలు & రేఖాచిత్రాలు" },
          { num: 4, title_te: "రెండు చరరాశులలో రేఖీయ సమీకరణాల జత", title_en: "Pair of Linear Equations in 2 Variables", competencies: "గ్రాఫ్ పద్ధతి, ప్రతిక్షేపణ, చరరాశి తొలగింపు" },
          { num: 5, title_te: "వర్గ సమీకరణాలు (Quadratic Equations)", title_en: "Quadratic Equations (Quadratic Formula)", competencies: "విచక్షణి (b² - 4ac) స్వభావం" },
          { num: 6, title_te: "శ్రేఢులు (అంక శ్రేఢి & గుణ శ్రేఢి)", title_en: "Progressions (AP and GP)", competencies: "n-వ పదం & మొదటి n పదాల మొత్తం" },
          { num: 7, title_te: "నిరూపక రేఖాగణితం (దూర సూత్రం, విభజన సూత్రం)", title_en: "Coordinate Geometry (Distance & Section Formula)", competencies: "త్రిభుజ వైశాల్యం = 1/2|x₁(y₂-y₃)+...|" },
          { num: 8, title_te: "సరూప త్రిభుజాలు (థేల్స్ సిద్ధాంతం)", title_en: "Similar Triangles (Basic Proportionality)", competencies: "పైథాగరస్ సిద్ధాంతం నిరూపణ" },
          { num: 9, title_te: "స్పర్శరేఖలు & ఛేదనరేఖలు", title_en: "Tangents and Secants to a Circle", competencies: "వృత్త సిద్ధాంతాలు" },
          { num: 10, title_te: "క్షేత్రమితి (ఘనపరిమాణాలు & ఉపరితల వైశాల్యాలు)", title_en: "Mensuration (Surface Areas & Volumes)", competencies: "శంకువు, గోళం, స్తూపం సూత్రాలు" },
          { num: 11, title_te: "త్రికోణమితి పరిచయం (sin, cos, tan నిష్పత్తులు)", title_en: "Trigonometry (Ratios and Identities)", competencies: "త్రికోణమితి సర్వసమీకరణాలు (sin²θ + cos²θ = 1)" },
          { num: 12, title_te: "త్రికోణమితి అనువర్తనాలు (ఎత్తులు & దూరాలు)", title_en: "Applications of Trigonometry (Heights & Distances)", competencies: "ఊర్ధ్వ కోణం, నిమ్న కోణం సమస్యలు" },
          { num: 13, title_te: "సంభావ్యత (Probability)", title_en: "Probability (Theoretical Probability)", competencies: "యాదృచ్ఛిక ప్రయోగాలు & అనుకూల పర్యవసానాలు" },
          { num: 14, title_te: "సాంఖ్యకశాస్త్రం (వర్గీకృత దత్తాంశం)", title_en: "Statistics (Grouped Data)", competencies: "సగటు, మధ్యగతం, బాహుళకం & ఓజివ్ వక్రాలు" }
        ]
      },
      {
        id: "c10_physics",
        name_te: "భౌతిక రసాయన శాస్త్రాలు (Physical Sciences)",
        name_en: "Physical Sciences (SSC Board)",
        subjectKey: "physics",
        chaptersCount: 14,
        chapters: [
          { num: 1, title_te: "గోళాకార దర్పణాలలో కాంతి పరావర్తనం", title_en: "Reflection of Light at Curved Surfaces", competencies: "దర్పణ సూత్రం (1/f = 1/v + 1/u), కిరణ చిత్రాలు" },
          { num: 2, title_te: "రసాయన చర్యలు - సమీకరణాలు", title_en: "Chemical Reactions and Equations", competencies: "సంయోగ, వియోగ, స్థానభ్రంశ, ద్వంద్వ స్థానభ్రంశ చర్యలు" },
          { num: 3, title_te: "ఆమ్లాలు, క్షారాలు మరియు లవణాలు", title_en: "Acids, Bases and Salts", competencies: "pH స్కేలు, క్లోర్-ఆల్కలీ ప్రక్రియ, ప్లాస్టర్ ఆఫ్ ప్యారిస్" },
          { num: 4, title_te: "వక్రతలాల వద్ద కాంతి వక్రీభవనం (కటకాలు)", title_en: "Refraction of Light at Curved Surfaces (Lenses)", competencies: "కటక సూత్రం & కంటి లోపాలు (హ్రస్వదృష్టి, దూరదృష్టి)" },
          { num: 5, title_te: "మానవుని కన్ను - రంగుల ప్రపంచం", title_en: "Human Eye and Colourful World", competencies: "ఇంద్రధనస్సు, కాంతి విక్షేపణం, రామన్ ప్రభావం" },
          { num: 6, title_te: "పరమాణు నిర్మాణం (బోర్ నమూనా, క్వాంటమ్ సంఖ్యలు)", title_en: "Structure of Atom (Quantum Numbers)", competencies: "ఆఫ్‌బౌ, హుండ్, పౌలీ వర్జన నియమాలు" },
          { num: 7, title_te: "మూలకాల వర్గీకరణ - ఆవర్తన పట్టిక", title_en: "Classification of Elements - Periodic Table", competencies: "ఆధునిక ఆవర్తన నియమం, గ్రూపులు & పీరియడ్లు" },
          { num: 8, title_te: "రసాయన బంధం (అయానిక & సమయోజనీయ బంధం)", title_en: "Chemical Bonding (Ionic and Covalent)", competencies: "లూయిస్ బిందు నిర్మాణాలు, వేలన్సీ సిద్ధాంతం" },
          { num: 9, title_te: "విద్యుత్ ప్రవాహం (ఓమ్ నియమం)", title_en: "Electric Current (Ohm's Law: V = IR)", competencies: "శ్రేణి & సమాంతర సంధానం, విద్యుత్ సామర్థ్యం" },
          { num: 10, title_te: "విద్యుదయస్కాంతత్వం (ఫారడే విద్యుదయస్కాంత ప్రేరణ)", title_en: "Electromagnetism (Faraday's Laws)", competencies: "మోటారు & డైనమో పనిచేసే సూత్రాలు" },
          { num: 11, title_te: "లోహ సంగ్రహణ శాస్త్రం (ధాతువులు, భర్జనం, భస్మీకరణం)", title_en: "Principles of Metallurgy", competencies: "లోహాల శుద్ధి & క్షయ నివారణ" },
          { num: 12, title_te: "కార్బన్ - దాని సమ్మేళనాలు", title_en: "Carbon and its Compounds", competencies: "కాటనేషన్, హైడ్రోకార్బన్లు, IUPAC నామకరణం" }
        ]
      },
      {
        id: "c10_biology",
        name_te: "జీవ శాస్త్రం (Biological Sciences)",
        name_en: "Biological Sciences (SSC Board)",
        subjectKey: "biology",
        chaptersCount: 10,
        chapters: [
          { num: 1, title_te: "పోషణ - ఆహార సరఫరా వ్యవస్థ", title_en: "Nutrition - Food Supplying System", competencies: "కిరణజన్య సంయోగక్రియ, జీర్ణవ్యవస్థ, పోషకాహార లోపాలు" },
          { num: 2, title_te: "శ్వాసక్రియ - శక్తి ఉత్పాదక వ్యవస్థ", title_en: "Respiration - Energy Producing System", competencies: "వాయు సహిత & వాయు రహిత శ్వాసక్రియ, ఊపిరితిత్తుల నిర్మాణం" },
          { num: 3, title_te: "ప్రసరణ - పదార్థాల రవాణా వ్యవస్థ", title_en: "Transportation - Circulatory System", competencies: "గుండె నిర్మాణం, రక్త ప్రసరణ, రక్తపీడనం (BP)" },
          { num: 4, title_te: "విసర్జన - వ్యర్థాల తొలగింపు వ్యవస్థ", title_en: "Excretion - Waste Disposing System", competencies: "మూత్రపిండం నిర్మాణం, నెఫ్రాన్ విధి, డయాలసిస్" },
          { num: 5, title_te: "నియంత్రణ - సమన్వయ వ్యవస్థ", title_en: "Control and Coordination", competencies: "మెదడు నిర్మాణం, నాడీ వ్యవస్థ, వృక్ష హార్మోన్లు" },
          { num: 6, title_te: "ప్రత్యుత్పత్తి - పునరుత్పాదక వ్యవస్థ", title_en: "Reproduction - Generating System", competencies: "పుష్పంలో లైంగిక ప్రత్యుత్పత్తి, కణ విభజన (మైటాసిస్, మియాసిస్)" },
          { num: 7, title_te: "జీవక్రియలలో సమన్వయం", title_en: "Coordination in Life Processes", competencies: "ఆకలి సంకేతాలు, రుచి & వాసనల సమన్వయం" },
          { num: 8, title_te: "అనువంశికత - పరిణామ క్రమం (మెండెల్ ప్రయోగాలు)", title_en: "Heredity & Evolution (Mendel's Laws)", competencies: "ఏక సంకర సంకరణం, లింగ నిర్ధారణ" },
          { num: 9, title_te: "మన పర్యావరణం - మన బాధ్యత", title_en: "Our Environment - Our Concern", competencies: "ఆహారపు గొలుసు, పోషక స్థాయిలు, జీవ సంచయనం" },
          { num: 10, title_te: "సహజ వనరులు - వాటి సంరక్షణ", title_en: "Natural Resources & Conservation", competencies: "స్థిరమైన అభివృద్ధి, వర్షపు నీటి సంరక్షణ" }
        ]
      },
      {
        id: "c10_social",
        name_te: "సాంఘిక శాస్త్రం (Social Studies)",
        name_en: "Social Studies (SSC Board)",
        subjectKey: "social",
        chaptersCount: 22,
        chapters: [
          { num: 1, title_te: "భారతదేశం: భౌగోళిక స్వరూపాలు", title_en: "India: Relief Features", competencies: "హిమాలయాలు, గంగా-సింధు మైదానం, ద్వీపకల్ప పీఠభూమి" },
          { num: 2, title_te: "అభివృద్ధి భావనలు (ఆదాయం, మానవ అభివృద్ధి సూచిక)", title_en: "Ideas of Development", competencies: "HDI సూచిక, తలసరి ఆదాయం లెక్కలు" },
          { num: 3, title_te: "ఉత్పత్తి - ఉపాధి (వ్యవసాయం, పరిశ్రమలు, సేవలు)", title_en: "Production and Employment", competencies: "ప్రాథమిక, ద్వితీయ, తృతీయ రంగాలు" },
          { num: 4, title_te: "భారతదేశ శీతోష్ణస్థితి (నైరుతి, ఈశాన్య రుతుపవనాలు)", title_en: "Climate of India", competencies: "రుతుపవనాల ప్రభావం & గ్లోబల్ వార్మింగ్" },
          { num: 5, title_te: "భారతదేశ నదులు - నీటి వనరులు", title_en: "Indian Rivers and Water Resources", competencies: "హిమాలయ నదులు, ద్వీపకల్ప నదులు" },
          { num: 6, title_te: "భారతదేశ జనాభా (జనసాంద్రత, లింగ నిష్పత్తి)", title_en: "The People - Population of India", competencies: "జనాభా పెరుగుదల & అక్షరాస్యత" },
          { num: 7, title_te: "ప్రపంచ యుద్ధాల కాలంలో ప్రపంచం (1914 - 1945)", title_en: "The World Between Wars (1914-1945)", competencies: "మొదటి & రెండవ ప్రపంచ యుద్ధాల కారణాలు, లీగ్ ఆఫ్ నేషన్స్" },
          { num: 8, title_te: "భారతదేశ జాతీయోద్యమం - దేశ విభజన", title_en: "National Movement in India & Partition", competencies: "గాంధీజీ సత్యాగ్రహాలు, క్విట్ ఇండియా ఉద్యమం, 1947 స్వాతంత్ర్యం" },
          { num: 9, title_te: "భారత రాజ్యాంగ నిర్మాణం (రాజ్యాంగ పరిషత్)", title_en: "Making of Independent India's Constitution", competencies: "డా॥ బి.ఆర్. అంబేద్కర్ పాత్ర & పీఠిక" },
          { num: 10, title_te: "స్వతంత్ర భారతదేశం (మొదటి 30 సంవత్సరాలు 1947-77)", title_en: "Independent India (First 30 Years 1947-77)", competencies: "పంచవర్ష ప్రణాళికలు, రాష్ట్రాల పునర్వ్యవస్థీకరణ, అత్యవసర పరిస్థితి" }
        ]
      }
    ]
  }
];

// Helper to query syllabus by Class Number
export function getSyllabusByClass(classNum) {
  return SCERT_CLASSES_DATA.find((c) => c.classNumber === String(classNum)) || SCERT_CLASSES_DATA[2]; // default class 3
}

// Helper to search syllabus across classes 1-10
export function searchSyllabus(query) {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();

  const results = [];
  SCERT_CLASSES_DATA.forEach((cls) => {
    cls.subjects.forEach((subj) => {
      subj.chapters.forEach((chap) => {
        if (
          chap.title_te.toLowerCase().includes(q) ||
          chap.title_en.toLowerCase().includes(q) ||
          subj.name_te.toLowerCase().includes(q) ||
          subj.name_en.toLowerCase().includes(q) ||
          chap.competencies.toLowerCase().includes(q)
        ) {
          results.push({
            classNumber: cls.classNumber,
            classTitle_te: cls.title_te,
            classTitle_en: cls.title_en,
            subjectName_te: subj.name_te,
            subjectName_en: subj.name_en,
            chapterNum: chap.num,
            title_te: chap.title_te,
            title_en: chap.title_en,
            competencies: chap.competencies
          });
        }
      });
    });
  });

  return results;
}
