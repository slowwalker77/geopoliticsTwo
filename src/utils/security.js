import DOMPurify from 'dompurify';

/**
 * 콘텐츠를 안전하게 새니타이징합니다
 * @param {string} content - 새니타이징할 콘텐츠
 * @returns {string} - 새니타이징된 콘텐츠
 */
export const sanitizeContent = (content) => {
  if (typeof content !== 'string') {
    return '';
  }

  // 브라우저 환경에서만 DOMPurify 사용
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img'
      ],
      ALLOWED_ATTR: {
        'a': ['href', 'title'],
        'img': ['src', 'alt', 'title', 'width', 'height'],
        'code': ['class'],
        'pre': ['class']
      },
      ALLOWED_URI_REGEXP: /^(?:(?:https?|ftp):\/\/|data:image\/)/i
    });
  }
  
  // 서버 사이드에서는 기본적인 HTML 태그 제거
  return content.replace(/<[^>]*>/g, '');
};

/**
 * 이미지 URL이 안전한지 검증합니다
 * @param {string} url - 검증할 URL
 * @returns {boolean} - 안전한 URL인지 여부
 */
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const urlObj = new URL(url);
    
    // HTTPS 또는 HTTP 프로토콜만 허용
    if (!['https:', 'http:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // 이미지 확장자 검증
    const validExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    if (!validExtensions.test(urlObj.pathname)) {
      return false;
    }
    
    // 신뢰할 수 있는 도메인 목록 (필요시 확장)
    const trustedDomains = [
      'steemitimages.com',
      'images.hive.blog',
      'cdn.steemitimages.com',
      'i.imgur.com'
    ];
    
    return trustedDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
    );
  } catch (error) {
    console.warn('Invalid URL:', url, error);
    return false;
  }
};

/**
 * 텍스트를 안전하게 이스케이프합니다
 * @param {string} text - 이스케이프할 텍스트
 * @returns {string} - 이스케이프된 텍스트
 */
export const escapeHtml = (text) => {
  if (typeof text !== 'string') {
    return '';
  }
  
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * 제목을 안전하게 정리합니다
 * @param {string} title - 정리할 제목
 * @returns {string} - 정리된 제목
 */
export const sanitizeTitle = (title) => {
  if (typeof title !== 'string') {
    return '';
  }
  
  // 기본적인 HTML 태그 제거 및 특수문자 처리
  return title
    .replace(/<[^>]*>/g, '') // HTML 태그 제거
    .replace(/^[^ ]* /, '') // 첫 번째 단어 제거 (기존 로직 유지)
    .trim()
    .substring(0, 200); // 길이 제한
};