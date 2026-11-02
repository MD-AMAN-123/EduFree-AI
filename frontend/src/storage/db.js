// EduFree.AI IndexedDB Local Database Layer
// Fast, robust, offline-capable storage engine with auto-seeding for rural school pilots.

const DB_NAME = 'edufree_offline_db';
const DB_VERSION = 1;

let dbInstance = null;

export function openDB() {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 1. Classes Store
      if (!db.objectStoreNames.contains('classes')) {
        const classStore = db.createObjectStore('classes', { keyPath: 'id' });
        classStore.createIndex('name', 'name', { unique: false });
      }

      // 2. Students Store
      if (!db.objectStoreNames.contains('students')) {
        const studentStore = db.createObjectStore('students', { keyPath: 'id' });
        studentStore.createIndex('classId', 'classId', { unique: false });
        studentStore.createIndex('localCode', 'localCode', { unique: true });
      }

      // 3. Assessments Store
      if (!db.objectStoreNames.contains('assessments')) {
        const assessStore = db.createObjectStore('assessments', { keyPath: 'id' });
        assessStore.createIndex('studentId', 'studentId', { unique: false });
        assessStore.createIndex('classId', 'classId', { unique: false });
        assessStore.createIndex('synced', 'synced', { unique: false });
        assessStore.createIndex('date', 'date', { unique: false });
      }

      // 4. Practice Logs Store
      if (!db.objectStoreNames.contains('practiceLogs')) {
        const practiceStore = db.createObjectStore('practiceLogs', { keyPath: 'id' });
        practiceStore.createIndex('studentId', 'studentId', { unique: false });
      }

      // 5. Offline Sync Queue
      if (!db.objectStoreNames.contains('syncQueue')) {
        const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
        syncStore.createIndex('status', 'status', { unique: false });
      }

      // 6. Settings Key-Value Store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };

    request.onsuccess = async (event) => {
      dbInstance = event.target.result;
      await seedInitialDataIfEmpty(dbInstance);
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('IndexedDB open error:', event.target.error);
      reject(event.target.error);
    };
  });
}

/**
 * Generic Promisified IndexedDB Helpers
 */
export async function getAllFromStore(storeName, indexName = null, query = null) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const source = indexName ? store.index(indexName) : store;
    const request = query ? source.getAll(query) : source.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function getFromStore(storeName, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function putInStore(storeName, item) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.put(item);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteFromStore(storeName, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.delete(key);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

export async function clearStore(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Settings Store Helpers
 */
export async function getSetting(key, defaultValue = null) {
  try {
    const record = await getFromStore('settings', key);
    return record ? record.value : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

export async function setSetting(key, value) {
  return putInStore('settings', { key, value, updatedAt: new Date().toISOString() });
}

/**
 * Seed Sample Telangana Pilot Data on First Load
 */
async function seedInitialDataIfEmpty(db) {
  const existingClasses = await getAllFromStore('classes');
  if (existingClasses && existingClasses.length > 0) {
    return; // Already populated
  }

  console.info('EduFree.AI: Seeding initial Telangana pilot data for demo...');

  // Default Settings
  await putInStore('settings', { key: 'teacher_pin', value: '1234', updatedAt: new Date().toISOString() });
  await putInStore('settings', { key: 'app_mode', value: 'teacher', updatedAt: new Date().toISOString() });
  await putInStore('settings', { key: 'last_sync_time', value: null, updatedAt: new Date().toISOString() });

  // 1. Sample Pilot Class
  const sampleClassId = 'class_gangadevipalli_g3';
  await putInStore('classes', {
    id: sampleClassId,
    name: 'మండల ప్రాథమిక పాఠశాల (MPPS గంగదేవిపల్లి) - 3వ తరగతి',
    grade: '3',
    section: 'A',
    district: 'వరంగల్ (Warangal)',
    mandal: 'గీసుకొండ (Geesugonda)',
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
  });

  await putInStore('settings', { key: 'current_class_id', value: sampleClassId, updatedAt: new Date().toISOString() });

  // 2. Sample Students
  const sampleStudents = [
    {
      id: 'std_01',
      classId: sampleClassId,
      localCode: 'TS-3A-01',
      name: 'అనిత (Anitha)',
      rollNo: '1',
      gender: 'girl',
      grade: '3',
      currentLevelId: 'level_2_guninthalu',
      currentLevelName: 'స్థాయి 2: గుణింతాల సాధన',
      lastAssessedDate: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      notes: 'గుణింతాల గుర్తులు క్రమంగా నేర్చుకుంటోంది. దీర్ఘం, కొమ్ముల్లో కొంత తడబాటు.',
      createdAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'std_02',
      classId: sampleClassId,
      localCode: 'TS-3A-02',
      name: 'రాహుల్ (Rahul)',
      rollNo: '2',
      gender: 'boy',
      grade: '3',
      currentLevelId: 'level_3_simple_words',
      currentLevelName: 'స్థాయి 3: సరళ పదాలు',
      lastAssessedDate: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      notes: 'సరళ పదాలు సులువుగా చదువుతాడు. ఒత్తుల పదాలపై శ్రద్ధ అవసరం.',
      createdAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'std_03',
      classId: sampleClassId,
      localCode: 'TS-3A-03',
      name: 'స్వప్న (Swapna)',
      rollNo: '3',
      gender: 'girl',
      grade: '3',
      currentLevelId: 'level_5_passages',
      currentLevelName: 'స్థాయి 5: స్వేచ్ఛా పఠనం & అవగాహన',
      lastAssessedDate: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      notes: 'చాలా వేగంగా మరియు భావయుక్తంగా చదువుతుంది. ప్రశ్నలకు చక్కని సమాధానాలు.',
      createdAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'std_04',
      classId: sampleClassId,
      localCode: 'TS-3A-04',
      name: 'చరణ్ (Charan)',
      rollNo: '4',
      gender: 'boy',
      grade: '3',
      currentLevelId: 'level_1_letters',
      currentLevelName: 'స్థాయి 1: అక్షరాలు & ధ్వనులు',
      lastAssessedDate: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
      notes: 'అచ్చుల గుర్తింపు బాగుంది. హల్లుల సాధన కొనసాగుతోంది.',
      createdAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'std_05',
      classId: sampleClassId,
      localCode: 'TS-3A-05',
      name: 'భార్గవి (Bhargavi)',
      rollNo: '5',
      gender: 'girl',
      grade: '3',
      currentLevelId: 'level_4_ottulu',
      currentLevelName: 'స్థాయి 4: ఒత్తుల పదాలు (ద్విత్వ/సంయుక్త)',
      lastAssessedDate: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
      notes: 'ద్విత్వాక్షరాలు చదవగలదు, సంయుక్తాక్షరాలలో మరింత సాధన కావాలి.',
      createdAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString()
    }
  ];

  for (const std of sampleStudents) {
    await putInStore('students', std);
  }

  // 3. Sample Assessment History (for charting and trajectory demonstration)
  const sampleAssessments = [
    {
      id: 'assess_std03_01',
      studentId: 'std_03',
      classId: sampleClassId,
      passageId: 'passage_village_tank',
      passageTitle: 'మా పల్లె చెరువు',
      date: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
      metrics: {
        wcpm: 46,
        accuracyPercentage: 92,
        accurateCount: 34,
        skippedCount: 1,
        substitutedCount: 2,
        promptedCount: 0,
        wordsAttempted: 37,
        totalWordsInPassage: 37,
        secondsElapsed: 44,
        compScore: 2.5,
        totalCompQuestions: 3,
        compPercentage: 83,
        provisionalLevel: { levelId: 'level_4_ottulu', name_te: 'స్థాయి 4: ఒత్తుల పదాలు' }
      },
      observations: { expressive: true, self_correction: true },
      teacherOverrideLevel: null,
      teacherNotes: 'మంచి ఉత్సాహంతో చదివింది.',
      synced: true,
      createdAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'assess_std03_02',
      studentId: 'std_03',
      classId: sampleClassId,
      passageId: 'passage_school_garden',
      passageTitle: 'బడి తోట — తాజా కూరగాయలు',
      date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      metrics: {
        wcpm: 58,
        accuracyPercentage: 97,
        accurateCount: 42,
        skippedCount: 0,
        substitutedCount: 1,
        promptedCount: 0,
        wordsAttempted: 43,
        totalWordsInPassage: 43,
        secondsElapsed: 43,
        compScore: 3,
        totalCompQuestions: 3,
        compPercentage: 100,
        provisionalLevel: { levelId: 'level_5_passages', name_te: 'స్థాయి 5: స్వేచ్ఛా పఠనం & అవగాహన' }
      },
      observations: { expressive: true, self_correction: true },
      teacherOverrideLevel: null,
      teacherNotes: 'అద్భుతమైన ప్రగతి. స్వేచ్ఛా పఠన స్థాయికి చేరుకుంది.',
      synced: false,
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'assess_std01_01',
      studentId: 'std_01',
      classId: sampleClassId,
      passageId: 'passage_village_tank',
      passageTitle: 'మా పల్లె చెరువు',
      date: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      metrics: {
        wcpm: 24,
        accuracyPercentage: 70,
        accurateCount: 16,
        skippedCount: 3,
        substitutedCount: 4,
        promptedCount: 2,
        wordsAttempted: 25,
        totalWordsInPassage: 37,
        secondsElapsed: 60,
        compScore: 1,
        totalCompQuestions: 3,
        compPercentage: 33,
        provisionalLevel: { levelId: 'level_2_guninthalu', name_te: 'స్థాయి 2: గుణింతాల సాధన' }
      },
      observations: { vowel_sign_confusion: true, hesitation: true },
      teacherOverrideLevel: null,
      teacherNotes: 'గుణింతాల చక్రం సాధన అవసరం.',
      synced: false,
      createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
    }
  ];

  for (const as of sampleAssessments) {
    await putInStore('assessments', as);
  }
}
