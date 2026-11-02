// EduFree.AI - Supabase Real-time Database Service
// Replaces postgresService.js — uses Supabase JS SDK directly from the browser

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://ifvgzvmxewdccudafsmm.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_FD8KOrCv4fmgAqIJkMKOHA_KFmgzuNI';

// Singleton client
let _client = null;
function getClient() {
  if (!_client && SUPABASE_URL && SUPABASE_ANON_KEY) {
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _client;
}

/**
 * Check Supabase connectivity by counting rows in the students table.
 * @returns {{ connected: boolean, studentCount: number, error?: string }}
 */
export async function checkSupabaseStatus() {
  try {
    const sb = getClient();
    if (!sb) throw new Error('Supabase client not initialised (missing env vars)');

    const { count, error } = await sb
      .from('students')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return { connected: true, studentCount: count ?? 0 };
  } catch (err) {
    console.warn('[Supabase Status]', err.message);
    return { connected: false, studentCount: 0, error: err.message };
  }
}

/**
 * Upsert a single student record (camelCase → snake_case mapping).
 * Fire-and-forget safe — never throws to caller.
 */
export async function syncStudentRealtime(student) {
  try {
    const sb = getClient();
    if (!sb) return;

    const row = {
      id: student.id,
      class_id: student.classId ?? student.class_id ?? null,
      local_code: student.localCode ?? student.local_code ?? null,
      name: student.name ?? null,
      current_level_id: student.currentLevelId ?? student.current_level_id ?? null,
      current_level_name: student.currentLevelName ?? student.current_level_name ?? null,
      last_assessed_date: student.lastAssessedDate ?? student.last_assessed_date ?? null,
      notes: student.notes ?? null,
      metadata: student.metadata ?? null
    };

    const { error } = await sb.from('students').upsert(row, { onConflict: 'id' });
    if (error) throw error;
  } catch (err) {
    console.warn('[Supabase Sync] student upsert failed:', err.message);
  }
}

/**
 * Upsert a single assessment record (camelCase → snake_case mapping).
 * Fire-and-forget safe — never throws to caller.
 */
export async function syncAssessmentRealtime(assessment) {
  try {
    const sb = getClient();
    if (!sb) return;

    const row = {
      id: assessment.id,
      student_id: assessment.studentId ?? assessment.student_id ?? null,
      class_id: assessment.classId ?? assessment.class_id ?? null,
      passage_id: assessment.passageId ?? assessment.passage_id ?? null,
      date: assessment.date ?? null,
      wcpm: assessment.wcpm ?? null,
      accuracy: assessment.accuracy ?? null,
      errors: assessment.errors ?? null,
      provisional_level: assessment.provisionalLevel ?? assessment.provisional_level ?? null,
      time_spent_seconds: assessment.timeSpentSeconds ?? assessment.time_spent_seconds ?? null,
      synced: assessment.synced ?? false,
      synced_at: assessment.syncedAt ?? assessment.synced_at ?? null,
      details: assessment.details ?? null
    };

    const { error } = await sb.from('assessments').upsert(row, { onConflict: 'id' });
    if (error) throw error;
  } catch (err) {
    console.warn('[Supabase Sync] assessment upsert failed:', err.message);
  }
}

/**
 * Bulk-upsert students and assessments to Supabase in one batch.
 * @param {{ students: Array, assessments: Array }} param0
 * @returns {{ success: boolean, syncedStudents: number, syncedAssessments: number, error?: string }}
 */
export async function syncBatchToSupabase({ students = [], assessments = [] }) {
  try {
    const sb = getClient();
    if (!sb) throw new Error('Supabase client not initialised (missing env vars)');

    // Map students
    const studentRows = students.map(s => ({
      id: s.id,
      class_id: s.classId ?? s.class_id ?? null,
      local_code: s.localCode ?? s.local_code ?? null,
      name: s.name ?? null,
      current_level_id: s.currentLevelId ?? s.current_level_id ?? null,
      current_level_name: s.currentLevelName ?? s.current_level_name ?? null,
      last_assessed_date: s.lastAssessedDate ?? s.last_assessed_date ?? null,
      notes: s.notes ?? null,
      metadata: s.metadata ?? null
    }));

    // Map assessments
    const assessmentRows = assessments.map(a => ({
      id: a.id,
      student_id: a.studentId ?? a.student_id ?? null,
      class_id: a.classId ?? a.class_id ?? null,
      passage_id: a.passageId ?? a.passage_id ?? null,
      date: a.date ?? null,
      wcpm: a.wcpm ?? null,
      accuracy: a.accuracy ?? null,
      errors: a.errors ?? null,
      provisional_level: a.provisionalLevel ?? a.provisional_level ?? null,
      time_spent_seconds: a.timeSpentSeconds ?? a.time_spent_seconds ?? null,
      synced: a.synced ?? false,
      synced_at: a.syncedAt ?? a.synced_at ?? null,
      details: a.details ?? null
    }));

    let studentsError = null;
    let assessmentsError = null;

    if (studentRows.length > 0) {
      const res = await sb.from('students').upsert(studentRows, { onConflict: 'id' });
      studentsError = res.error;
    }

    if (assessmentRows.length > 0) {
      const res = await sb.from('assessments').upsert(assessmentRows, { onConflict: 'id' });
      assessmentsError = res.error;
    }

    if (studentsError) throw studentsError;
    if (assessmentsError) throw assessmentsError;

    return {
      success: true,
      syncedStudents: studentRows.length,
      syncedAssessments: assessmentRows.length
    };
  } catch (err) {
    console.warn('[Supabase Batch Sync]', err.message);
    return {
      success: false,
      syncedStudents: 0,
      syncedAssessments: 0,
      error: err.message,
      reason: err.message
    };
  }
}

