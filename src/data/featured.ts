import { FeaturedArticleConfig } from '@/types/featured';

/**
 * 주요글 설정
 * 
 * 주요글 게시글을 정의합니다.
 * 최대 6개의 추천 게시글을 지원합니다.
 * 
 * 설정 가이드라인:
 * - author: 유효한 Steemit username 이어야 합니다.
 * - title: 선택 사항 - 지정하지 않으면 작성자의 최신 게시글 제목이 사용됩니다.
 * - permlink: 선택 사항 - 게시글을 정확하게 식별하기 위한 링크입니다.
 * - category: 선택 사항 - 작성자의 기본 카테고리를 재정의합니다.
 * - visualTheme: 선택 사항 - 게시글 카드에 대한 사용자 지정 스타일
 * - priority: 선택 사항 - 표시 순서 (1-6, 숫자가 낮을수록 먼저 표시됨)
 * 
 * 비주얼 테마 색상 형식:
 * Visual Theme Color Formats:
 * - Hex: #ffffff, #fff
 * - RGB: rgb(255, 255, 255)
 * - RGBA: rgba(255, 255, 255, 0.8)
 * - HSL: hsl(0, 0%, 100%)
 * - HSLA: hsla(0, 0%, 100%, 0.8)
 */
export const featuredArticles: FeaturedArticleConfig[] = [
  {
    author: 'section-0',
    permlink: '25-10-30',
    category: 'domestic',
    // visualTheme: {
    //   backgroundColor: '#ffffffff',
    //   textColor: '#1e40af',
    //   categoryBadgeColor: '#3b82f6',
    //   categoryBadgeTextColor: '#ffffff'
    // },
    priority: 1
  }
];

/**
 * 모듈 로드 시 추천 기사 구성의 유효성을 검사합니다.
 * 이를 통해 타입 안정성을 확보하고 구성 오류를 조기에 감지할 수 있습니다.
 */
import { validateFeaturedArticlesConfig } from '@/types/featured';

// 런타임에 설정값에 대해 유효성을 체크합니다.
try {
  validateFeaturedArticlesConfig(featuredArticles);
  console.log('✅ Featured articles configuration validated successfully');
} catch (error) {
  console.error('❌ Featured articles configuration validation failed:', error);
  throw new Error('Invalid featured articles configuration. Please check the data structure and types.');
}

export default featuredArticles;