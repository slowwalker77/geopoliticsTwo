import { ArticleCategory } from '@/types/steemit';

// 카테고리는 주제별 분류를 위한 것
export const categories: ArticleCategory[] = [
  {
    id: 'domestic',
    name: '국내문제',
    description: '대한민국 내정과 사회 이슈',
    tag: 'domestic-politics'
  },
  {
    id: 'inter-korea',
    name: '남북관계',
    description: '한반도 평화와 통일 관련 이슈',
    tag: 'korea-unification'
  },
  {
    id: 'international',
    name: '국제정치',
    description: '세계 정치와 외교 관계',
    tag: 'international-politics'
  },
  {
    id: 'regional-conflicts',
    name: '지역분쟁',
    description: '세계 각지의 분쟁과 갈등',
    tag: 'regional-conflicts'
  },
  {
    id: 'references',
    name: '참고자료',
    description: '정치 분석을 위한 참고 자료',
    tag: 'political-analysis'
  }
];

// Steemit 사용자명을 사용
export const authors = [
  {
    username: 'section-1', // Steemit 사용자명
    displayName: '한설',
    description: '예비역 장군, 전 육군역사연구소장',
    specialties: ['국제정치', '지정학', '한반도 문제'],
    primaryCategory: 'inter-korea' // 주요 카테고리 연결
  },
  {
    username: 'section-2', // Steemit 사용자명
    displayName: '한설',
    description: '예비역 장군, 전 육군역사연구소장',
    specialties: ['국제정치', '지정학', '한반도 문제'],
    primaryCategory: 'international' // 주요 카테고리 연결
  },
  {
    username: 'section-3', // Steemit 사용자명
    displayName: '한설',
    description: '예비역 장군, 전 육군역사연구소장',
    specialties: ['국제정치', '지정학', '한반도 문제'],
    primaryCategory: 'regional-conflicts' // 주요 카테고리 연결
  },
  {
    username: 'section-4', // Steemit 사용자명
    displayName: '한설',
    description: '예비역 장군, 전 육군역사연구소장',
    specialties: ['국제정치', '지정학', '한반도 문제'],
    primaryCategory: 'references' // 주요 카테고리 연결
  },
];

// 카테고리별로 주요 작가들을 매핑
export const categoryAuthors: Record<string, string[]> = {
  'domestic': ['section-0'], // 국내문제 전문 작가들
  'inter-korea': ['section-1'], // 남북관계 전문 작가들  
  'international': ['section-2'], // 국제정치 전문 작가들
  'regional-conflicts': ['section-3'], // 지역분쟁 전문 작가들
  'references': ['section-4'] // 참고자료 작가들
};

export function getCategoryByTag(tag: string): ArticleCategory | undefined {
  return categories.find(cat => cat.tag === tag);
}

export function getCategoryById(id: string): ArticleCategory | undefined {
  return categories.find(cat => cat.id === id);
}

export function getAuthorsByCategory(categoryId: string): string[] {
  return categoryAuthors[categoryId] || [];
}

export function getAuthorDisplayName(username: string): string {
  const author = authors.find(a => a.username === username);
  return author?.displayName || username;
}

export function getAuthorInfo(username: string) {
  return authors.find(a => a.username === username);
}