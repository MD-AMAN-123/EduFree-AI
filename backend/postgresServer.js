// ============================================================
// EduFree.AI - PostgreSQL Realtime Backend Server
// Bridges browser clients to PostgreSQL for real-time student data
// ============================================================

import http from 'http';
import url from 'url';
import pg from 'pg';

const { Pool } = pg;

const PORT = process.env.PG_SERVER_PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL || process.env.PG_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/edufree_students';

// Initialize PostgreSQL Pool
let pool = null;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 5000
    });

    pool.on('error', (err) => {
      console.error('[PostgreSQL Error]', err.message);
    });
  }
  return pool;
}

// Ensure database tables exist
export async function initPostgresTables() {
  const p = getPool();
  const query = `
    CREATE TABLE IF NOT EXISTS classes (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      grade INT DEFAULT 3,
      academic_year VARCHAR(32) DEFAULT '2024-25',
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS students (
      id VARCHAR(64) PRIMARY KEY,
      class_id VARCHAR(64),
      local_code VARCHAR(32),
      name VARCHAR(255) NOT NULL,
      current_level_id VARCHAR(64) DEFAULT 'level_1_letters',
      current_level_name VARCHAR(255) DEFAULT 'స్థాయి 1: అక్షరాలు & ధ్వనులు',
      last_assessed_date TIMESTAMPTZ,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      metadata JSONB DEFAULT '{}'::jsonb
    );

    CREATE TABLE IF NOT EXISTS assessments (
      id VARCHAR(64) PRIMARY KEY,
      student_id VARCHAR(64) NOT NULL,
      class_id VARCHAR(64),
      passage_id VARCHAR(64),
      date TIMESTAMPTZ NOT NULL,
      wcpm INT DEFAULT 0,
      accuracy INT DEFAULT 0,
      errors INT DEFAULT 0,
      provisional_level VARCHAR(64),
      time_spent_seconds INT DEFAULT 60,
      synced BOOLEAN DEFAULT TRUE,
      synced_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      details JSONB DEFAULT '{}'::jsonb
    );

    CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id);
    CREATE INDEX IF NOT EXISTS idx_assessments_student ON assessments(student_id);
  `;

  await p.query(query);
  console.log('[PostgreSQL] Database tables initialized successfully.');
}

// Upsert a student record
export async function upsertStudent(student) {
  const p = getPool();
  const text = `
    INSERT INTO students (
      id, class_id, local_code, name, current_level_id, 
      current_level_name, last_assessed_date, notes, updated_at, metadata
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, $9)
    ON CONFLICT (id) DO UPDATE SET
      class_id = EXCLUDED.class_id,
      local_code = EXCLUDED.local_code,
      name = EXCLUDED.name,
      current_level_id = EXCLUDED.current_level_id,
      current_level_name = EXCLUDED.current_level_name,
      last_assessed_date = EXCLUDED.last_assessed_date,
      notes = EXCLUDED.notes,
      updated_at = CURRENT_TIMESTAMP,
      metadata = EXCLUDED.metadata
    RETURNING *;
  `;

  const values = [
    student.id,
    student.classId || student.class_id || null,
    student.localCode || student.local_code || null,
    student.name,
    student.currentLevelId || student.current_level_id || 'level_1_letters',
    student.currentLevelName || student.current_level_name || 'స్థాయి 1',
    student.lastAssessedDate || student.last_assessed_date || null,
    student.notes || '',
    JSON.stringify(student.metadata || {})
  ];

  const res = await p.query(text, values);
  return res.rows[0];
}

// Upsert an assessment record
export async function upsertAssessment(assessment) {
  const p = getPool();
  const text = `
    INSERT INTO assessments (
      id, student_id, class_id, passage_id, date,
      wcpm, accuracy, errors, provisional_level, time_spent_seconds, synced, synced_at, details
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, TRUE, CURRENT_TIMESTAMP, $11)
    ON CONFLICT (id) DO UPDATE SET
      wcpm = EXCLUDED.wcpm,
      accuracy = EXCLUDED.accuracy,
      errors = EXCLUDED.errors,
      provisional_level = EXCLUDED.provisional_level,
      synced = TRUE,
      synced_at = CURRENT_TIMESTAMP,
      details = EXCLUDED.details
    RETURNING *;
  `;

  const values = [
    assessment.id,
    assessment.studentId || assessment.student_id,
    assessment.classId || assessment.class_id || null,
    assessment.passageId || assessment.passage_id || null,
    assessment.date || new Date().toISOString(),
    assessment.wcpm || 0,
    assessment.accuracy || 0,
    assessment.errors || 0,
    assessment.provisionalLevel || assessment.provisional_level || '',
    assessment.timeSpentSeconds || assessment.time_spent_seconds || 60,
    JSON.stringify(assessment.details || {})
  ];

  const res = await p.query(text, values);
  return res.rows[0];
}

// HTTP Server handling REST API requests
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

export function createServer() {
  return http.createServer(async (req, res) => {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    try {
      // 1. Health & Connection Status
      if (pathname === '/api/postgres/status' || pathname === '/health') {
        const p = getPool();
        const client = await p.connect();
        try {
          const result = await client.query('SELECT COUNT(*) as student_count FROM students');
          const count = result.rows[0].student_count;
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            status: 'online',
            connected: true,
            database: 'PostgreSQL',
            studentCount: parseInt(count, 10),
            timestamp: new Date().toISOString()
          }));
        } finally {
          client.release();
        }
        return;
      }

      // 2. Initialize Database Tables
      if (pathname === '/api/postgres/init' && req.method === 'POST') {
        await initPostgresTables();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'PostgreSQL tables initialized' }));
        return;
      }

      // 3. Realtime Student Sync (Single Upsert)
      if (pathname === '/api/postgres/students/sync' && req.method === 'POST') {
        const student = await parseBody(req);
        if (!student.id || !student.name) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Student id and name are required' }));
          return;
        }

        const saved = await upsertStudent(student);
        console.log(`[PostgreSQL Realtime] Upserted student: ${saved.name} (${saved.id})`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, student: saved }));
        return;
      }

      // 4. Realtime Assessment Sync (Single Upsert)
      if (pathname === '/api/postgres/assessments/sync' && req.method === 'POST') {
        const assessment = await parseBody(req);
        if (!assessment.id || !assessment.studentId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Assessment id and studentId are required' }));
          return;
        }

        const saved = await upsertAssessment(assessment);
        console.log(`[PostgreSQL Realtime] Upserted assessment: ${saved.id} for student ${saved.student_id}`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, assessment: saved }));
        return;
      }

      // 5. Batch Sync (All Students & Assessments from Client)
      if (pathname === '/api/postgres/batch' && req.method === 'POST') {
        const payload = await parseBody(req);
        const students = payload.students || [];
        const assessments = payload.assessments || [];

        let syncedStudents = 0;
        for (const st of students) {
          await upsertStudent(st);
          syncedStudents++;
        }

        let syncedAssessments = 0;
        for (const as of assessments) {
          await upsertAssessment(as);
          syncedAssessments++;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          syncedStudents,
          syncedAssessments,
          timestamp: new Date().toISOString()
        }));
        return;
      }

      // 6. Fetch All Students from PostgreSQL
      if (pathname === '/api/postgres/students' && req.method === 'GET') {
        const p = getPool();
        const result = await p.query('SELECT * FROM students ORDER BY name ASC');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          count: result.rows.length,
          students: result.rows
        }));
        return;
      }

      // 404 Fallback
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Endpoint not found' }));
    } catch (err) {
      console.error('[PostgreSQL API Error]', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: err.message,
        code: err.code || 'PG_ERROR'
      }));
    }
  });
}

// Direct Execution Entrypoint
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 EduFree.AI PostgreSQL Sync Server running on port ${PORT}`);
    console.log(`🔗 Database URL: ${DATABASE_URL.replace(/:[^:]*@/, ':****@')}`);
    console.log(`=======================================================`);
  });
}

