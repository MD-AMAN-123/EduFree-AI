-- ============================================================
-- EduFree.AI - PostgreSQL Realtime Student Database Schema
-- Schema for storing classes, students, and assessment records
-- ============================================================

-- 1. Classes Table
CREATE TABLE IF NOT EXISTS classes (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    grade INT DEFAULT 3,
    academic_year VARCHAR(32) DEFAULT '2024-25',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Students Table
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(64) PRIMARY KEY,
    class_id VARCHAR(64) REFERENCES classes(id) ON DELETE SET NULL,
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

-- 3. Assessments Table
CREATE TABLE IF NOT EXISTS assessments (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id VARCHAR(64) REFERENCES classes(id) ON DELETE SET NULL,
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

-- 4. Practice Logs Table
CREATE TABLE IF NOT EXISTS practice_logs (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    level_id VARCHAR(64),
    letters_completed INT DEFAULT 0,
    gunintham_count INT DEFAULT 0,
    words_read INT DEFAULT 0,
    duration_seconds INT DEFAULT 0,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_level ON students(current_level_id);
CREATE INDEX IF NOT EXISTS idx_assessments_student ON assessments(student_id);
CREATE INDEX IF NOT EXISTS idx_assessments_date ON assessments(date);
CREATE INDEX IF NOT EXISTS idx_practice_student ON practice_logs(student_id);

-- Real-time notification function & trigger on student updates
CREATE OR REPLACE FUNCTION notify_student_realtime_change()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('students_realtime', json_build_object(
        'action', TG_OP,
        'student', row_to_json(NEW),
        'timestamp', CURRENT_TIMESTAMP
    )::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_student_realtime ON students;
CREATE TRIGGER trg_student_realtime
AFTER INSERT OR UPDATE ON students
FOR EACH ROW
EXECUTE FUNCTION notify_student_realtime_change();

