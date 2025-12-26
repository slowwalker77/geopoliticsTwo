// Mock implementation for security utilities
export const sanitizeContent = (content) => {
  if (typeof content !== 'string') {
    return '';
  }
  // Simple mock - just remove HTML tags
  return content.replace(/<[^>]*>/g, '');
};

export const sanitizeTitle = (title) => {
  if (typeof title !== 'string') {
    return '';
  }
  // Simple mock - just remove HTML tags and trim
  return title
    .replace(/<[^>]*>/g, '')
    .trim()
    .substring(0, 200);
};

export const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  // Simple mock - just check if it looks like a URL
  return url.startsWith('http://') || url.startsWith('https://');
};

export const escapeHtml = (text) => {
  if (typeof text !== 'string') {
    return '';
  }
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};