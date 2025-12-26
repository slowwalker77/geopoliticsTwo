'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Container from '@/components/ui/container';
import ArticleCard from '@/components/ArticleCard';
import { Button } from '@/components/ui/button';
import { steemitService } from '@/services/steemitService';
import { ProcessedArticle, SteemitPost } from '@/types/steemit';
import { getCategoryById, getAuthorsByCategory } from '@/data/categories';
import { Loader2 } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;
  
  const [articles, setArticles] = useState<ProcessedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  // 각 작가별 페이지네이션 상태
  const [authorStates, setAuthorStates] = useState<Record<string, {
    lastPermlink: string;
    hasMore: boolean;
  }>>({});
  
  const observerRef = useRef<HTMLDivElement>(null);
  
  const category = getCategoryById(categoryId);
  const categoryAuthors = getAuthorsByCategory(category?.id || '');

  const loadArticles = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      if (categoryAuthors.length === 0) {
        setArticles([]);
        setHasMore(false);
        return;
      }

      const allPosts: SteemitPost[] = [];
      const newAuthorStates = { ...authorStates };
      let anyAuthorHasMore = false;

      // 각 작가별로 글을 가져오기
      for (const authorUsername of categoryAuthors) {
        try {
          const authorState = newAuthorStates[authorUsername] || { 
            lastPermlink: '', 
            hasMore: true 
          };

          // 이미 더 이상 글이 없는 작가는 스킵
          if (!authorState.hasMore && isLoadMore) {
            continue;
          }

          const params: any = {
            author: authorUsername,
            limit: isLoadMore ? 5 : 10, // 첫 로드시 더 많이, 추가 로드시 적게
          };

          if (isLoadMore && authorState.lastPermlink) {
            params.start_permlink = authorState.lastPermlink;
          }

          const posts = await steemitService.getPostsByAuthor(params);
          
          if (posts.length > 0) {
            // 첫 번째 글이 중복일 수 있으므로 제거 (페이지네이션)
            const newPosts = isLoadMore && authorState.lastPermlink ? posts.slice(1) : posts;
            allPosts.push(...newPosts);

            // 작가별 상태 업데이트
            if (newPosts.length > 0) {
              const lastPost = newPosts[newPosts.length - 1];
              newAuthorStates[authorUsername] = {
                lastPermlink: lastPost.permlink,
                hasMore: posts.length >= params.limit
              };
              
              if (newAuthorStates[authorUsername].hasMore) {
                anyAuthorHasMore = true;
              }
            } else {
              newAuthorStates[authorUsername].hasMore = false;
            }
          } else {
            newAuthorStates[authorUsername].hasMore = false;
          }
        } catch (error) {
          console.warn(`Failed to fetch posts for author ${authorUsername}:`, error);
          newAuthorStates[authorUsername] = { lastPermlink: '', hasMore: false };
        }
      }

      setAuthorStates(newAuthorStates);
      setHasMore(anyAuthorHasMore);

      if (allPosts.length === 0) {
        if (!isLoadMore) {
          setArticles([]);
        }
        return;
      }

      // 날짜순으로 정렬
      allPosts.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

      const processedArticles = allPosts.map(post => 
        steemitService.processArticle(post, category?.name || '')
      );

      if (isLoadMore) {
        // 중복 제거 - articles 상태를 직접 참조하지 않고 함수형 업데이트 사용
        setArticles(prevArticles => {
          const existingIds = new Set(prevArticles.map(a => `${a.author}-${a.slug}`));
          const newArticles = processedArticles.filter(a => 
            !existingIds.has(`${a.author}-${a.slug}`)
          );
          
          return newArticles.length > 0 ? [...prevArticles, ...newArticles] : prevArticles;
        });
      } else {
        setArticles(processedArticles);
      }

    } catch (error) {
      console.error('Failed to load articles:', error);
      setError('글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [categoryAuthors, authorStates, category]);

  // Intersection Observer를 사용한 무한 스크롤
  useEffect(() => {
    if (!hasMore || loadingMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          loadArticles(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [hasMore, loadingMore, loading, loadArticles]);

  useEffect(() => {
    if (!categoryId) return;

    // 상태 초기화
    setArticles([]);
    setHasMore(true);
    setAuthorStates({});

    // loadArticles 함수를 useEffect 내부에서 정의
    const loadInitialArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        if (categoryAuthors.length === 0) {
          setArticles([]);
          setHasMore(false);
          return;
        }

        const allPosts: SteemitPost[] = [];
        const newAuthorStates: Record<string, { lastPermlink: string; hasMore: boolean }> = {};
        let anyAuthorHasMore = false;

        // 각 작가별로 글을 가져오기
        for (const authorUsername of categoryAuthors) {
          try {
            const params: any = {
              author: authorUsername,
              limit: 10,
            };

            const posts = await steemitService.getPostsByAuthor(params);
            
            if (posts.length > 0) {
              allPosts.push(...posts);

              // 작가별 상태 업데이트
              const lastPost = posts[posts.length - 1];
              newAuthorStates[authorUsername] = {
                lastPermlink: lastPost.permlink,
                hasMore: posts.length >= params.limit
              };
              
              if (newAuthorStates[authorUsername].hasMore) {
                anyAuthorHasMore = true;
              }
            } else {
              newAuthorStates[authorUsername] = { lastPermlink: '', hasMore: false };
            }
          } catch (error) {
            console.warn(`Failed to fetch posts for author ${authorUsername}:`, error);
            newAuthorStates[authorUsername] = { lastPermlink: '', hasMore: false };
          }
        }

        setAuthorStates(newAuthorStates);
        setHasMore(anyAuthorHasMore);

        if (allPosts.length > 0) {
          // 날짜순으로 정렬
          allPosts.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

          const processedArticles = allPosts.map(post => 
            steemitService.processArticle(post, category?.name || '')
          );

          setArticles(processedArticles);
        }
      } catch (error) {
        console.error('Failed to load articles:', error);
        setError('글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialArticles();
  }, [categoryId, categoryAuthors, category]);

  if (!category) {
    return (
      <Container>
        <div className="py-16 text-center">
          <h1 className="text-2xl font-bold text-destructive">카테고리를 찾을 수 없습니다</h1>
          <p className="text-muted-foreground mt-2">요청하신 카테고리가 존재하지 않습니다.</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="py-8">
      <Container>
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">{category.name}</h1>
            {category.description && (
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {category.description}
              </p>
            )}
          </div>

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-destructive text-lg">{error}</p>
              <Button 
                onClick={() => {
                  setAuthorStates({});
                  loadArticles(false);
                }} 
                className="mt-4"
                variant="outline"
              >
                다시 시도
              </Button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="space-y-8">
              <div className="magazine-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse space-y-4">
                    <div className="h-48 bg-muted rounded"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Articles Grid */}
          {!loading && articles.length > 0 && (
            <div className="space-y-8">
              <div className="magazine-grid">
                {articles.map((article, index) => (
                  <ArticleCard 
                    key={`${article.author}-${article.slug}-${index}`} 
                    article={article} 
                  />
                ))}
              </div>

              {/* Infinite Scroll Trigger */}
              {hasMore && (
                <div 
                  ref={observerRef}
                  className="flex justify-center py-8"
                >
                  {loadingMore ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="text-muted-foreground">더 많은 글을 불러오는 중...</span>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => loadArticles(true)}
                      variant="outline"
                      size="lg"
                    >
                      더 보기
                    </Button>
                  )}
                </div>
              )}

              {/* End of Content */}
              {!hasMore && articles.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">모든 글을 불러왔습니다.</p>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && articles.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-muted-foreground">글이 없습니다</h2>
              <p className="text-muted-foreground mt-2">
                이 카테고리에는 아직 게시된 글이 없습니다.
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}