// ============================================================
// EduFree.AI - Client-Side PostgreSQL Realtime Sync Service
// Connects browser state directly to PostgreSQL database
// ============================================================

const PG_CONFIG_STORAGE_KEY = 'edufree_pg_config';

const DEFAULT_CONFIG = {
  enabled: true,
  serverUrl: 'http://localhost:5000',
  autoSync: true,
  lastSyncTime: null
};

let cachedConfig = null;
let lastConnectionStatus = { connected: false, checkedAt: null };
const statusListeners = new Set();

/**
 * Retrieve PostgreSQL configuration
 */
export function getPostgresConfig() {
  if (cachedConfig) return cachedConfig;

  try {
    const raw = localStorage.getItem(PG_CONFIG_STORAGE_KEY);
    if (raw) {
      cachedConfig = { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
      return cachedConfig;
    }
  } catch (e) {
    console.warn('[PostgresService] Failed to read config from localStorage:', e);
  }

  cachedConfig = { ...DEFAULT_CONFIG };
  return cachedConfig;
}

/**
 * Save PostgreSQL configuration
 */
export function savePostgresConfig(newConfig) {
  cachedConfig = { ...getPostgresConfig(), ...newConfig };
  try {
    localStorage.setItem(PG_CONFIG_STORAGE_KEY, JSON.stringify(cachedConfig));
    notifyStatusListeners({ type: 'config_updated', config: cachedConfig });
  } catch (e) {
    console.error('[PostgresService] Failed to save config to localStorage:', e);
  }
  return cachedConfig;
}

export function isPostgresEnabled() {
  return getPostgresConfig().enabled;
}

/**
 * Subscribe to PostgreSQL sync and connection status events
 */
export function subscribePostgresStatus(fn) {
  statusListeners.add(fn);
  return () => statusListeners.delete(fn);
}

function notifyStatusListeners(data) {
  statusListeners.forEach(fn => {
    try { fn(data); } catch (e) { console.error('Status listener error:', e); }
  });
}

/**
 * Check connectivity to PostgreSQL server
 */
export async function checkPostgresStatus() {
  const config = getPostgresConfig();
  if (!config.enabled) {
    lastConnectionStatus = { connected: false, reason: 'disabled', checkedAt: new Date().toISOString() };
    return lastConnectionStatus;
  }

  const url = `${config.serverUrl.replace(/\/+$/, '')}/api/postgres/status`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      lastConnectionStatus = {
        connected: true,
        database: data.database || 'PostgreSQL',
        studentCount: data.studentCount || 0,
        checkedAt: new Date().toISOString()
      };
      notifyStatusListeners({ type: 'connection_status', ...lastConnectionStatus });
      return lastConnectionStatus;
    } else {
      lastConnectionStatus = {
        connected: false,
        status: res.status,
        error: `Server returned ${res.status}`,
        checkedAt: new Date().toISOString()
      };
      notifyStatusListeners({ type: 'connection_status', ...lastConnectionStatus });
      return lastConnectionStatus;
    }
  } catch (err) {
    lastConnectionStatus = {
      connected: false,
      error: err.name === 'AbortError' ? 'Connection timed out' : err.message,
      checkedAt: new Date().toISOString()
    };
    notifyStatusListeners({ type: 'connection_status', ...lastConnectionStatus });
    return lastConnectionStatus;
  }
}

/**
 * Initialize PostgreSQL tables on the server
 */
export async function initRemotePostgresTables() {
  const config = getPostgresConfig();
  const url = `${config.serverUrl.replace(/\/+$/, '')}/api/postgres/init`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Realtime Student Sync: Push a single student to PostgreSQL
 * Fire-and-forget safe: never blocks user interaction or throws in caller
 */
export async function syncStudentRealtime(student) {
  const config = getPostgresConfig();
  if (!config.enabled || !student || !student.id) return null;

  const url = `${config.serverUrl.replace(/\/+$/, '')}/api/postgres/students/sync`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });

    if (res.ok) {
      const data = await res.json();
      notifyStatusListeners({ type: 'student_synced', studentId: student.id });
      return data;
    }
  } catch (e) {
    // If server unreachable, log gently — offline sync queue will pick it up
    console.warn('[PostgresService] Realtime student sync deferred (server unreachable):', e.message);
  }
  return null;
}

/**
 * Realtime Assessment Sync: Push a single assessment to PostgreSQL
 */
export async function syncAssessmentRealtime(assessment) {
  const config = getPostgresConfig();
  if (!config.enabled || !assessment || !assessment.id) return null;

  const url = `${config.serverUrl.replace(/\/+$/, '')}/api/postgres/assessments/sync`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assessment)
    });

    if (res.ok) {
      const data = await res.json();
      notifyStatusListeners({ type: 'assessment_synced', assessmentId: assessment.id });
      return data;
    }
  } catch (e) {
    console.warn('[PostgresService] Realtime assessment sync deferred:', e.message);
  }
  return null;
}

/**
 * Batch Sync: Push all students and assessments to PostgreSQL
 */
export async function syncBatchToPostgres({ students, assessments }) {
  const config = getPostgresConfig();
  if (!config.enabled) {
    return { success: false, reason: 'PostgreSQL sync is disabled in settings' };
  }

  const url = `${config.serverUrl.replace(/\/+$/, '')}/api/postgres/batch`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ students, assessments })
    });

    if (res.ok) {
      const result = await res.json();
      savePostgresConfig({ lastSyncTime: new Date().toISOString() });
      notifyStatusListeners({ type: 'batch_synced', result });
      return result;
    } else {
      return { success: false, error: `Server returned status ${res.status}` };
    }
  } catch (e) {
    return { success: false, error: e.message };
  }
}

