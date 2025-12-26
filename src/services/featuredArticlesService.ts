import { 
  FeaturedArticleConfig, 
  ProcessedArticleWithTheme, 
  VisualTheme,
  validateFeaturedArticlesConfig,
  safeParseFeaturedArticlesConfig 
} from '../types/featured';
import { ProcessedArticle } from '../types/steemit';
import { SteemitService } from './steemitService';
import { getCategoryById } from '../data/categories';

/**
 * 추천 게시글 설정 및 처리를 관리하는 서비스 설정 불러오기, 
 * Steemit API에서 게시글 가져오기, 
 * 시각적 테마 적용 등을 처리합니다.
 */
export class FeaturedArticlesService {
  private static instance: FeaturedArticlesService;
  private steemitService: SteemitService;
  private logger: Console;

  private constructor() {
    this.steemitService = SteemitService.getInstance();
    this.logger = console;
  }

  public static getInstance(): FeaturedArticlesService {
    if (!FeaturedArticlesService.instance) {
      FeaturedArticlesService.instance = new FeaturedArticlesService();
    }
    return FeaturedArticlesService.instance;
  }

  /**
   * 설정에 따라 추천 기사를 불러오고 처리합니다.
   * 오류 발생 시 자동 기사 선택 기능으로 대체합니다.
   * 
   * @returns Promise<ProcessedArticleWithTheme[]> 주요글 게시글 목록
   */
  async loadFeaturedArticles(): Promise<ProcessedArticleWithTheme[]> {
    try {
      this.logger.info('Starting to load featured articles...');
      const config = await this.getFeaturedConfig();
      
      this.logger.info(`Loaded featured articles config:`, config);
      
      if (!config || config.length === 0) {
        this.logger.info('No featured articles configuration found, using fallback');
        return this.handleFallback();
      }

      const processedArticles: ProcessedArticleWithTheme[] = [];
      
      // 각 주요글 설정 처리
      for (const articleConfig of config) {
        try {
          this.logger.info(`Processing article config for author: ${articleConfig.author}`);
          const processedArticle = await this.processArticleWithTheme(articleConfig);
          if (processedArticle) {
            this.logger.info(`Successfully processed article: ${processedArticle.title}`);
            processedArticles.push(processedArticle);
          } else {
            this.logger.warn(`Failed to process article for author: ${articleConfig.author}`);
          }
        } catch (error) {
          this.logger.error(`Failed to process article for author ${articleConfig.author}:`, error);
          // Continue processing other articles (partial failure resilience)
        }
      }

      this.logger.info(`Processed ${processedArticles.length} featured articles successfully`);

      // 주요글 없는 경우 처리
      if (processedArticles.length === 0) {
        this.logger.warn('No featured articles could be processed, using fallback');
        return this.handleFallback();
      }

      // 우선 순위에 따라 정렬
      processedArticles.sort((a, b) => {
        const priorityA = a.featuredPriority || 999;
        const priorityB = b.featuredPriority || 999;
        return priorityA - priorityB;
      });

      return processedArticles;

    } catch (error) {
      this.logger.error('Failed to load featured articles:', error);
      return this.handleFallback();
    }
  }

  /**
   * 주요글 구성을 불러오고 유효성을 검사합니다.
   * 
   * @returns Promise<FeaturedArticleConfig[]> Validated configuration array
   */
  async getFeaturedConfig(): Promise<FeaturedArticleConfig[]> {
    try {
      // 순환 참조를 피하기 위한 동적 import
      const featuredModule = await import('../data/featured');
      const config = featuredModule.featuredArticles || featuredModule.default;
      
      if (!config) {
        throw new Error('No featured articles configuration found');
      }

      // Zod 를 사용한 유효성 검사
      const validationResult = safeParseFeaturedArticlesConfig(config);
      
      if (!validationResult.success) {
        const errorMessages = 'error' in validationResult ? 
          validationResult.error.issues.map(i => i.message).join(', ') : 
          'Unknown validation error';
        this.logger.error('Featured articles configuration validation failed:', errorMessages);
        throw new Error(`Invalid configuration: ${errorMessages}`);
      }

      // 최대 6개의 글 조회 제한
      const limitedConfig = validationResult.data.slice(0, 6);
      
      if (limitedConfig.length < validationResult.data.length) {
        this.logger.warn(`Configuration contains more than 6 articles, using first 6`);
      }

      return limitedConfig;

    } catch (error) {
      if (error instanceof Error && error.message.includes('Cannot resolve module')) {
        this.logger.info('Featured articles configuration file not found');
        return [];
      }
      
      this.logger.error('Error loading featured articles configuration:', error);
      throw error;
    }
  }

  /**
   * 카테고리 ID를 카테고리 명으로 변경
   * @param categoryId - Category ID (예: 'domestic')
   * @returns 카테고리명(예: '국내문제')
   */
  private getCategoryName(categoryId?: string): string | undefined {
    if (!categoryId) return undefined;
    
    const category = getCategoryById(categoryId);
    return category ? category.name : categoryId;
  }

  /**
   * 테마 적용을 통해 단일 게시물 구성을 처리
   * 네트워크 오류 시 재시도
   * 
   * @param config - 주요글 설정
   * @returns Promise<ProcessedArticleWithTheme | null> 처리된 게시글
   */
  async processArticleWithTheme(config: FeaturedArticleConfig): Promise<ProcessedArticleWithTheme | null> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    this.logger.info(`Processing article with config:`, {
      author: config.author,
      permlink: config.permlink,
      title: config.title,
      category: config.category
    });

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        let article: ProcessedArticle;

        // 설정된 글 조회 
        if (config.permlink) {
          // permlink 조회
          this.logger.info(`Fetching article by permlink: ${config.author}/${config.permlink}`);
          
          try {
            const steemitPost = await this.steemitService.getPost(config.author, config.permlink);
            this.logger.info(`Successfully fetched article:`, { title: steemitPost.title, author: steemitPost.author });
            article = this.steemitService.processArticle(steemitPost, this.getCategoryName(config.category));
          } catch (getPostError) {
            this.logger.warn(`Failed to get post by permlink, trying to find in recent posts:`, getPostError);
            
            // 폴백: 최근 글 조회
            const posts = await this.steemitService.getPostsByAuthor({
              author: config.author,
              limit: 20
            });
            
            const matchingPost = posts.find(post => post.permlink === config.permlink);
            
            if (!matchingPost) {
              this.logger.error(`Article with permlink "${config.permlink}" not found for author ${config.author}`);
              return null;
            }
            
            this.logger.info(`Found article in recent posts:`, { title: matchingPost.title, permlink: matchingPost.permlink });
            article = this.steemitService.processArticle(matchingPost, this.getCategoryName(config.category));
          }
        } else if (config.title) {
          // permlink 없는 경우 title로 설절 글 조회
          this.logger.info(`Searching for article by title: "${config.title}" from author: ${config.author}`);
          const posts = await this.steemitService.getPostsByAuthor({
            author: config.author,
            limit: 20
          });
          
          const matchingPost = posts.find(post => 
            post.title.toLowerCase().includes(config.title!.toLowerCase()) ||
            config.title!.toLowerCase().includes(post.title.toLowerCase())
          );
          
          if (!matchingPost) {
            this.logger.warn(`Article with title "${config.title}" not found for author ${config.author}`);
            return null;
          }
          
          article = this.steemitService.processArticle(matchingPost, this.getCategoryName(config.category));
        } else {
          // 가장 최근 글 조회 
          this.logger.info(`Fetching latest article from author: ${config.author}`);
          const posts = await this.steemitService.getPostsByAuthor({
            author: config.author,
            limit: 1
          });
          
          if (posts.length === 0) {
            this.logger.warn(`No articles found for author ${config.author}`);
            return null;
          }
          
          article = this.steemitService.processArticle(posts[0], this.getCategoryName(config.category));
        }

        // 주요글 테마 적용 
        const processedArticle = this.applyVisualTheme(article, config.visualTheme);
        
        return {
          ...processedArticle,
          isFeatured: true,
          featuredPriority: config.priority,
          category: config.category || processedArticle.category,
          categoryName: this.getCategoryName(config.category) || processedArticle.categoryName
        };

      } catch (error) {
        lastError = error as Error;
        
        this.logger.error(`Attempt ${attempt}/${maxRetries} failed for article processing:`, {
          author: config.author,
          title: config.title,
          permlink: config.permlink,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        });

        // 마지막 시도
        if (attempt === maxRetries) {
          break;
        }

        // 순차적 재시도: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // 모든 재시도 실패 
    this.logger.error(`Failed to process article after ${maxRetries} attempts:`, {
      author: config.author,
      finalError: lastError?.message
    });
    
    return null;
  }

  /**
   * 각 테마 설정
   */
  public applyVisualTheme(article: ProcessedArticle, theme?: VisualTheme): ProcessedArticleWithTheme {
    // Default theme values
    const defaultTheme: VisualTheme = {
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      categoryBadgeColor: '#3b82f6',
      categoryBadgeTextColor: '#ffffff'
    };

    // Merge provided theme with defaults
    const appliedTheme: VisualTheme = {
      backgroundColor: theme?.backgroundColor || defaultTheme.backgroundColor,
      textColor: theme?.textColor || defaultTheme.textColor,
      categoryBadgeColor: theme?.categoryBadgeColor || defaultTheme.categoryBadgeColor,
      categoryBadgeTextColor: theme?.categoryBadgeTextColor || defaultTheme.categoryBadgeTextColor
    };

    return {
      ...article,
      visualTheme: appliedTheme,
      isFeatured: true
    };
  }

  /**
   * 주요글이 로드되지 않은 경우 처리 
   */
  private async handleFallback(): Promise<ProcessedArticleWithTheme[]> {
    try {
      this.logger.info('Using automatic article selection fallback');
      
      const fallbackAuthors = ['section-1', 'section-2', 'section-3', 'section-4'];
      const fallbackArticles: ProcessedArticleWithTheme[] = [];

      for (const author of fallbackAuthors) {
        try {
          const posts = await this.steemitService.getPostsByAuthor({
            author,
            limit: 1
          });
          
          if (posts.length > 0) {
            const article = this.steemitService.processArticle(posts[0]);
            const themedArticle = this.applyVisualTheme(article);
            
            fallbackArticles.push({
              ...themedArticle,
              isFeatured: false,
              featuredPriority: fallbackArticles.length + 1
            });
          }
        } catch (error) {
          this.logger.warn(`Failed to fetch fallback article from ${author}:`, error);
        }
      }

      return fallbackArticles.slice(0, 6); // 최대 6개의 글 

    } catch (error) {
      this.logger.error('Fallback system failed:', error);
      return [];
    }
  }

  /**
   * 설정값 유효성 체크
   */
  private validateConfig(config: FeaturedArticleConfig[]): boolean {
    try {
      validateFeaturedArticlesConfig(config);
      return true;
    } catch (error) {
      this.logger.error('Configuration validation failed:', error);
      return false;
    }
  }
}

export const featuredArticlesService = FeaturedArticlesService.getInstance();