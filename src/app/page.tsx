'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Container from '@/components/ui/container';
import ArticleCard from '@/components/ArticleCard';
import { steemitService } from '@/services/steemitService';
import { featuredArticlesService } from '@/services/featuredArticlesService';
import { ProcessedArticle } from '@/types/steemit';
import { ProcessedArticleWithTheme } from '@/types/featured';
import { categories, authors } from '@/data/categories';
import { ArrowRight, BookOpen, Users, Globe, AlertCircle } from 'lucide-react';

export default function HomePage() {
  const [featuredArticles, setFeaturedArticles] = useState<ProcessedArticleWithTheme[]>([]);
  const [recentArticles, setRecentArticles] = useState<ProcessedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setFeaturedLoading(true);
        setFeaturedError(null);
        setUsingFallback(false);
        
        // 주요글 불러오기
        let featuredArticlesData: ProcessedArticleWithTheme[] = [];
        try {
          featuredArticlesData = await featuredArticlesService.loadFeaturedArticles();
          
          // isFeatured: true가 없는 게시글을 사용하고 있는지 확인
          const hasExplicitlyFeatured = featuredArticlesData.some(article => article.isFeatured === true);
          if (!hasExplicitlyFeatured && featuredArticlesData.length > 0) {
            setUsingFallback(true);
          }
          
          setFeaturedArticles(featuredArticlesData);
        } catch (error) {
          console.error('Failed to load featured articles:', error);
          setFeaturedError(error instanceof Error ? error.message : 'Unknown error occurred');
          setUsingFallback(true);
          
          // 추천 기사 서비스가 완전히 실패할 경우 자동 선택으로 대체
          featuredArticlesData = [];
        } finally {
          setFeaturedLoading(false);
        }
        
        // 최근 글 조회
        const allPosts: any[] = [];
        
        // 각 작가별로 최신 글 가져오기
        for (const author of authors) {
          try {
            const posts = await steemitService.getPostsByAuthor({
              author: author.username,
              limit: 3 // 최근 글 조회 개수 (카테고리 별)
            });
            
            allPosts.push(...posts);
          } catch (error) {
            console.warn(`Failed to fetch posts for ${author.username}:`, error);
            // 개별 작가 오류는 무시하고 계속 진행
          }
        }
        
        // 날짜순으로 정렬
        allPosts.sort((a, b) => 
          new Date(b.created).getTime() - new Date(a.created).getTime()
        );

        // 처리된 아티클로 변환
        const processedArticles = allPosts.map((post) => {
          // 작가의 주요 카테고리 찾기
          const author = authors.find(a => a.username === post.author);
          const categoryName = author?.primaryCategory ? 
            categories.find(c => c.id === author.primaryCategory)?.name || '일반' : '일반';
          
          return steemitService.processArticle(post, categoryName);
        });

        // 주요글일 로드되지 않은 경우 3개의 기사 랜덤 
        if (featuredArticlesData.length === 0) {
          const fallbackFeatured = processedArticles.slice(0, 3).map((article, index) => ({
            ...article,
            isFeatured: false, // Mark as fallback, not explicitly featured
            featuredPriority: index + 1,
            visualTheme: undefined
          }));
          setFeaturedArticles(fallbackFeatured);
          setUsingFallback(true);
          setRecentArticles(processedArticles.slice(3, 9));
        } else {
          // 최근 글 6개 로드
          setRecentArticles(processedArticles.slice(0, 6));
        }
        
      } catch (error) {
        console.error('Failed to fetch articles:', error);
        setFeaturedError('글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              지정학과 세상읽기
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              대한민국의 바람직한 미래를 위한 고민을 찾아서
            </p>
            <div className="space-y-4 text-lg text-white/80">
              <p>무엇을 고민할 것인가?</p>
              <p>노태우의 공약은 작전권전환과 200만호 건설이었다.</p>
              <p>정주영의 공약은 토지공개념 이었다.</p>
              <p>그동안 우리는 무엇을 했는가? 전진했는가? 아니면 후퇴했는가?</p>
            </div>
            <div className="pt-8">
              <Button asChild size="lg" variant="secondary">
                <Link href="/category/domestic">
                  최신 글 읽기 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="flex justify-center">
                <BookOpen className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">정치 분석</h3>
              <p className="text-muted-foreground">
                깊이 있는 정치 상황 분석과 해석
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center">
                <Globe className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">국제 정세</h3>
              <p className="text-muted-foreground">
                변화하는 국제정치 동향과 전망
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">인민의 삶</h3>
              <p className="text-muted-foreground">
                서민과 노동자를 위한 정치적 관점
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Separator />

      {/* Featured Articles */}
      {!loading && featuredArticles.length > 0 && (
        <section>
          <Container>
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <h2 className="text-3xl font-bold">주요 글</h2>
                  {usingFallback && (
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4" />
                      <span>자동 선별</span>
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {usingFallback 
                    ? '설정된 주요 글이 없어 최신 글을 자동으로 선별했습니다'
                    : '최신 정치 분석과 국제 정세에 대한 깊이 있는 통찰'
                  }
                </p>
                {featuredError && (
                  <div className="flex items-center justify-center space-x-2 text-sm text-destructive bg-destructive/10 rounded-lg p-3 max-w-md mx-auto">
                    <AlertCircle className="h-4 w-4" />
                    <span>{featuredError}</span>
                  </div>
                )}
              </div>
              
              {featuredLoading ? (
                <div className="magazine-grid">
                  {[...Array(3)].map((_, i) => (
                    <ArticleCard key={i} article={{} as ProcessedArticle} loading />
                  ))}
                </div>
              ) : (
                <div className="magazine-grid">
                  {featuredArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} featured />
                  ))}
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      <Separator />

      {/* Recent Articles */}
      {!loading && recentArticles.length > 0 && (
        <section>
          <Container>
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">최근 글</h2>
                <Button asChild variant="outline">
                  <Link href="/articles">
                    모든 글 보기 <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="magazine-grid">
                {recentArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Categories */}
      <section className="bg-muted/50">
        <Container>
          <div className="py-16 space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">카테고리</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                관심 있는 주제별로 글을 찾아보세요
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="group p-6 bg-background rounded-lg border hover:shadow-lg transition-all duration-300"
                >
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {category.description}
                    </p>
                    <div className="flex items-center text-sm text-primary">
                      글 보기 <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Loading State */}
      {loading && (
        <section>
          <Container>
            <div className="space-y-8">
              <div className="text-center">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-muted rounded w-48 mx-auto"></div>
                  <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
                </div>
              </div>
              <div className="magazine-grid">
                {[...Array(6)].map((_, i) => (
                  <ArticleCard key={i} article={{} as ProcessedArticle} loading />
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}