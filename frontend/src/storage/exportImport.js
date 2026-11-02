// EduFree.AI Data Export, Backup & Offline Report Generation
import { getAllFromStore, putInStore, clearStore } from './db.js';

/**
 * Generate CSV string and trigger download for Excel / Google Sheets
 */
export async function exportClassDataToCSV(classId) {
  const students = await getAllFromStore('students');
  const classStudents = students.filter((s) => !classId || s.classId === classId);
  const assessments = await getAllFromStore('assessments');

  // Build CSV Headers
  const headers = [
    'Student Code (కోడ్)',
    'Name (పేరు)',
    'Roll No (రోల్ నం)',
    'Grade (తరగతి)',
    'Gender (లింగం)',
    'Current Level (ప్రస్తుత స్థాయి)',
    'Last Assessment Date (చివరి మూల్యాంకనం)',
    'Passage Title (పేరా)',
    'WCPM (పఠన వేగం)',
    'Accuracy % (ఖచ్చితత్వం)',
    'Errors (తప్పులు)',
    'Comprehension Score (అవగాహన)',
    'Teacher Notes (వ్యాఖ్యలు)',
    'Synced Status (సింక్ స్థితి)'
  ];

  const rows = [];

  classStudents.forEach((std) => {
    // Find latest assessment
    const studentAssessments = assessments
      .filter((a) => a.studentId === std.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const latest = studentAssessments[0];

    rows.push([
      `"${std.localCode || ''}"`,
      `"${(std.name || '').replace(/"/g, '""')}"`,
      `"${std.rollNo || ''}"`,
      `"${std.grade || ''}"`,
      `"${std.gender || ''}"`,
      `"${(std.currentLevelName || '').replace(/"/g, '""')}"`,
      `"${latest ? new Date(latest.date).toLocaleDateString('te-IN') : 'నమోదు కాలేదు'}"`,
      `"${latest ? (latest.passageTitle || '').replace(/"/g, '""') : '-'}"`,
      `"${latest ? latest.metrics?.wcpm || 0 : '-'}"`,
      `"${latest ? `${latest.metrics?.accuracyPercentage || 0}%` : '-'}"`,
      `"${latest ? latest.metrics?.totalErrors || 0 : '-'}"`,
      `"${latest ? `${latest.metrics?.compPercentage || 0}%` : '-'}"`,
      `"${latest ? (latest.teacherNotes || '').replace(/"/g, '""') : (std.notes || '').replace(/"/g, '""')}"`,
      `"${latest ? (latest.synced ? 'Synced' : 'Local') : '-'}"`
    ].join(','));
  });

  const csvContent = '\uFEFF' + headers.join(',') + '\n' + rows.join('\n'); // UTF-8 BOM for Telugu characters in Excel
  downloadBlob(csvContent, `EduFree_Class_Report_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export complete database as JSON backup file (Offline SD Card / WhatsApp transfer)
 */
export async function exportFullDatabaseJSON() {
  const classes = await getAllFromStore('classes');
  const students = await getAllFromStore('students');
  const assessments = await getAllFromStore('assessments');
  const practiceLogs = await getAllFromStore('practiceLogs');
  const settings = await getAllFromStore('settings');

  const backupData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    platform: 'EduFree.AI Rural Pilot',
    data: {
      classes,
      students,
      assessments,
      practiceLogs,
      settings
    }
  };

  const jsonString = JSON.stringify(backupData, null, 2);
  downloadBlob(jsonString, `EduFree_Offline_Backup_${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
}

/**
 * Restore database from a validated JSON backup file
 */
export async function importDatabaseJSON(fileContent) {
  try {
    const parsed = JSON.parse(fileContent);
    if (!parsed.data || (!parsed.data.students && !parsed.data.classes)) {
      throw new Error('చెల్లని బ్యాకప్ ఫైల్ ఫార్మాట్. (Invalid EduFree backup file)');
    }

    const { classes = [], students = [], assessments = [], practiceLogs = [] } = parsed.data;

    // Merge or restore records
    for (const cls of classes) {
      await putInStore('classes', cls);
    }
    for (const std of students) {
      await putInStore('students', std);
    }
    for (const assess of assessments) {
      await putInStore('assessments', assess);
    }
    for (const log of practiceLogs) {
      await putInStore('practiceLogs', log);
    }

    return {
      success: true,
      message_te: `విజయవంతంగా పునరుద్ధరించబడింది: ${classes.length} తరగతులు, ${students.length} విద్యార్థులు, ${assessments.length} మూల్యాంకనాలు.`,
      message_en: `Successfully restored: ${classes.length} classes, ${students.length} students, ${assessments.length} assessments.`
    };
  } catch (err) {
    console.error('Import error:', err);
    return {
      success: false,
      message_te: 'ఫైల్ దిగుమతిలో లోపం: ' + err.message,
      message_en: 'Import failed: ' + err.message
    };
  }
}

/**
 * Browser download trigger
 */
function downloadBlob(content, filename, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
