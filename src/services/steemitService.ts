import steem from 'steem';
import { SteemitPost, SteemitAuthor, ProcessedArticle } from '@/types/steemit';
import { sanitizeContent, sanitizeTitle } from '@/utils/security';

export class SteemitService {
  private static instance: SteemitService;
  
  public static getInstance(): SteemitService {
    if (!SteemitService.instance) {
      SteemitService.instance = new SteemitService();
    }
    return SteemitService.instance;
  }

  /**
   * 특정 태그의 블로그 포스트들을 가져옵니다
   */
  async getDiscussionsByTag(params: {
    tag: string;
    limit?: number;
    start_author?: string;
    start_permlink?: string;
  }): Promise<SteemitPost[]> {
    return new Promise((resolve, reject) => {
      const query = {
        tag: params.tag,
        limit: params.limit || 10,
        ...(params.start_author && { start_author: params.start_author }),
        ...(params.start_permlink && { start_permlink: params.start_permlink }),
      };

      const timeout = setTimeout(() => {
        reject(new Error('API request timeout'));
      }, 30000);

      steem.api.getDiscussionsByBlog(query, (err: any, result: SteemitPost[]) => {
        clearTimeout(timeout);
        
        if (err) {
          console.error('Steemit API Error:', err);
          reject(new Error(`Failed to fetch discussions: ${err.message || 'Unknown error'}`));
          return;
        }

        if (!Array.isArray(result)) {
          reject(new Error('Invalid API response format'));
          return;
        }

        const sanitizedResult = result.map(post => this.sanitizePost(post)).filter(Boolean);
        resolve(sanitizedResult);
      });
    });
  }

  /**
   * 특정 작가의 블로그 포스트들을 가져옵니다
   */
  async getPostsByAuthor(params: {
    author: string;
    limit?: number;
    start_permlink?: string;
  }): Promise<SteemitPost[]> {
    return new Promise((resolve, reject) => {
      const query = {
        tag: params.author,
        limit: params.limit || 10,
        ...(params.start_permlink && { 
          start_author: params.author,
          start_permlink: params.start_permlink 
        }),
      };

      const timeout = setTimeout(() => {
        reject(new Error('API request timeout'));
      }, 30000);

      steem.api.getDiscussionsByBlog(query, (err: any, result: SteemitPost[]) => {
        clearTimeout(timeout);
        
        if (err) {
          console.error('Steemit API Error:', err);
          reject(new Error(`Failed to fetch author posts: ${err.message || 'Unknown error'}`));
          return;
        }

        if (!Array.isArray(result)) {
          reject(new Error('Invalid API response format'));
          return;
        }

        const sanitizedResult = result.map(post => this.sanitizePost(post)).filter(Boolean);
        resolve(sanitizedResult);
      });
    });
  }

  /**
   * 특정 포스트의 상세 내용을 가져옵니다
   */
  async getPost(author: string, permlink: string): Promise<SteemitPost> {
    return new Promise((resolve, reject) => {
      // 입력 검증
      if (!author || !permlink || typeof author !== 'string' || typeof permlink !== 'string') {
        reject(new Error('Invalid author or permlink'));
        return;
      }

      // 기본적인 문자열 검증
      const validPattern = /^[a-zA-Z0-9._-]+$/;
      if (!validPattern.test(author) || !validPattern.test(permlink)) {
        reject(new Error('Invalid characters in parameters'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('API request timeout'));
      }, 30000);

      steem.api.getContent(author, permlink, (err: any, result: SteemitPost) => {
        clearTimeout(timeout);
        
        if (err) {
          console.error('Steemit API Error:', err);
          reject(new Error(`Failed to fetch post: ${err.message || 'Unknown error'}`));
          return;
        }

        if (!result || typeof result !== 'object') {
          reject(new Error('Post not found'));
          return;
        }

        const sanitizedPost = this.sanitizePost(result);
        if (!sanitizedPost) {
          reject(new Error('Invalid post data'));
          return;
        }

        resolve(sanitizedPost);
      });
    });
  }

  /**
   * 작가 정보를 가져옵니다
   */
  async getAuthor(username: string): Promise<SteemitAuthor> {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        reject(new Error('Invalid username'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('API request timeout'));
      }, 30000);

      steem.api.getAccounts([username], (err: any, result: any[]) => {
        clearTimeout(timeout);
        
        if (err) {
          console.error('Steemit API Error:', err);
          reject(new Error(`Failed to fetch author: ${err.message || 'Unknown error'}`));
          return;
        }

        if (!Array.isArray(result) || result.length === 0) {
          reject(new Error('Author not found'));
          return;
        }

        const account = result[0];
        const author: SteemitAuthor = {
          name: account.name || username,
          displayName: account.display_name || account.name || username,
          about: account.about || '',
          location: account.location || '',
          website: account.website || '',
          profile_image: account.profile_image || '',
          cover_image: account.cover_image || '',
          reputation: account.reputation || '0',
          post_count: account.post_count || 0,
          follower_count: account.follower_count || 0,
          following_count: account.following_count || 0,
        };

        resolve(author);
      });
    });
  }

  /**
   * Steemit 포스트를 ProcessedArticle로 변환합니다
   */
  processArticle(post: SteemitPost, categoryName: string = ''): ProcessedArticle {
    const metadata = this.parseJsonMetadata(post.json_metadata);
    const tags = metadata.tags || [];
    const imageUrl = this.extractImageUrl(post.body, metadata);
    
    // 작가 정보 가져오기
    const { getAuthorDisplayName, getAuthorInfo } = require('@/data/categories');
    const authorInfo = getAuthorInfo(post.author);
    const authorDisplayName = getAuthorDisplayName(post.author);
    
    return {
      id: post.post_id.toString(),
      title: sanitizeTitle(post.title || ''),
      excerpt: this.generateExcerpt(post.body),
      content: sanitizeContent(post.body || ''),
      author: post.author || '',
      authorDisplayName: authorDisplayName,
      publishedAt: post.created || '',
      updatedAt: post.updated,
      category: authorInfo?.primaryCategory || '',
      categoryName: categoryName || (authorInfo?.primaryCategory ? 
        require('@/data/categories').getCategoryById(authorInfo.primaryCategory)?.name || '' : ''),
      tags: tags,
      readTime: this.calculateReadTime(post.body || ''),
      imageUrl: imageUrl,
      slug: post.permlink || '',
      votes: post.net_votes || 0,
      comments: post.children || 0,
      steemitUrl: `https://steemit.com/@${post.author}/${post.permlink}`,
    };
  }

  /**
   * 포스트 데이터를 새니타이징합니다
   */
  private sanitizePost(post: any): SteemitPost | null {
    if (!post || typeof post !== 'object') {
      return null;
    }

    return {
      ...post,
      title: typeof post.title === 'string' ? post.title : '',
      body: typeof post.body === 'string' ? post.body : '',
      author: typeof post.author === 'string' ? post.author : '',
      permlink: typeof post.permlink === 'string' ? post.permlink : '',
      created: typeof post.created === 'string' ? post.created : '',
      post_id: post.post_id || 0,
      category: typeof post.category === 'string' ? post.category : '',
      json_metadata: post.json_metadata || '{}',
      net_votes: post.net_votes || 0,
      children: post.children || 0,
    } as SteemitPost;
  }

  /**
   * JSON 메타데이터를 파싱합니다
   */
  private parseJsonMetadata(metadata: string | object): any {
    try {
      if (typeof metadata === 'string') {
        return JSON.parse(metadata);
      }
      return metadata || {};
    } catch (error) {
      console.warn('Failed to parse JSON metadata:', error);
      return {};
    }
  }

  /**
   * 포스트에서 이미지 URL을 추출합니다
   */
  private extractImageUrl(body: string, metadata: any): string | undefined {
    // 메타데이터에서 이미지 확인
    if (metadata.image && Array.isArray(metadata.image) && metadata.image.length > 0) {
      return metadata.image[0];
    }

    // 본문에서 첫 번째 이미지 추출
    const imageRegex = /!\[.*?\]\((.*?)\)/;
    const match = body.match(imageRegex);
    if (match && match[1]) {
      return match[1];
    }

    return undefined;
  }

  /**
   * 포스트 본문에서 요약을 생성합니다
   */
  private generateExcerpt(body: string, maxLength: number = 200): string {
    // 마크다운 제거
    const plainText = body
      .replace(/!\[.*?\]\(.*?\)/g, '') // 이미지 제거
      .replace(/\[.*?\]\(.*?\)/g, '') // 링크 제거
      .replace(/[#*`]/g, '') // 마크다운 문법 제거
      .replace(/\n+/g, ' ') // 줄바꿈을 공백으로
      .trim();

    if (plainText.length <= maxLength) {
      return plainText;
    }

    return plainText.substring(0, maxLength) + '...';
  }

  /**
   * 읽기 시간을 계산합니다 (분 단위)
   */
  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200; // 평균 읽기 속도
    const words = content.split(/\s+/).length;
    const readTime = Math.ceil(words / wordsPerMinute);
    return Math.max(1, readTime); // 최소 1분
  }
}

export const steemitService = SteemitService.getInstance();