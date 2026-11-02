// EduFree.AI Utility Helpers

export function formatDate(isoString, lang = 'te') {
  if (!isoString) return lang === 'te' ? 'నమోదు కాలేదు' : 'Never';
  const d = new Date(isoString);
  return d.toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

export function sanitizeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function getDaysAgo(isoString) {
  if (!isoString) return Infinity;
  const diffMs = Date.now() - new Date(isoString).getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}
