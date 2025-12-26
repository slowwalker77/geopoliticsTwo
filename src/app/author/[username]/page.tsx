'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Container from '@/components/ui/container';
import ArticleCard from '@/components/ArticleCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { steemitService } from '@/services/steemitService';
import { ProcessedArticle, SteemitAuthor } from '@/types/steemit';
import { ArrowLeft, User, ExternalLink, Loader2 } from 'lucide-react';

export default function AuthorPage() {
  const params = useParams();
  const username = params.username as string;
  
  const [author, setAuthor] = useState<SteemitAuthor | null>(null);
  const [articles, setArticles] = useState<ProcessedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  const lastPermlink = useRef<string>('');
  const targetRef = useRef<HTMLDivElement>(null);

  const loadAuthorInfo = useCallback(async () => {
    try {
      const authorInfo = await steemitService.getAuthor(username);
      setAuthor(authorInfo);
    } catch (error) {
      console.error('Failed to load author info:', error);
      // 작가 정보를 불러오지 못해도 글은 표시
      setAuthor({
        name: username,
        displayName: username,
      });
    }
  }, [username]);

  const loadArticles = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      const params: any = {
        author: username,
        limit: 10,
      };

      if (isLoadMore && lastPermlink.current) {
        params.start_permlink = lastPermlink.current;
      }

      const posts = await steemitService.getPostsByAuthor(params);
      
      if (posts.length === 0) {
        setHasMore(false);
        return;
      }

      const processedArticles = posts.map(post => {
        // 작가 정보를 가져와서 카테고리 이름 설정
        const { getAuthorInfo, getCategoryById } = require('@/data/categories');
        const authorInfo = getAuthorInfo(post.author);
        const categoryName = authorInfo?.primaryCategory ? 
          getCategoryById(authorInfo.primaryCategory)?.name || '' : '';
        
        return steemitService.processArticle(post, categoryName);
      });

      if (isLoadMore) {
        // 첫 번째 항목 제거 (중복 방지)
        const newArticles = processedArticles.slice(1);
        if (newArticles.length === 0) {
          setHasMore(false);
          return;
        }
        setArticles(prev => [...prev, ...newArticles]);
      } else {
        setArticles(processedArticles);
      }

      // 마지막 항목 정보 저장
      const lastPost = posts[posts.length - 1];
      lastPermlink.current = lastPost.permlink;

      if (posts.length < 10) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load articles:', error);
      setError('글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [username]);

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

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loading, loadArticles]);

  useEffect(() => {
    if (!username) return;

    // 상태 초기화
    setArticles([]);
    setHasMore(true);
    lastPermlink.current = '';

    // 함수들을 useEffect 내부에서 정의
    const loadAuthorInfo = async () => {
      try {
        const authorInfo = await steemitService.getAuthor(username);
        setAuthor(authorInfo);
      } catch (error) {
        console.error('Failed to load author info:', error);
        setAuthor({
          name: username,
          displayName: username,
        });
      }
    };

    const loadInitialArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: any = {
          author: username,
          limit: 10,
        };

        const posts = await steemitService.getPostsByAuthor(params);
        
        if (posts.length === 0) {
          setHasMore(false);
          return;
        }

        const processedArticles = posts.map(post => {
          // 작가 정보를 가져와서 카테고리 이름 설정
          const { getAuthorInfo, getCategoryById } = require('@/data/categories');
          const authorInfo = getAuthorInfo(post.author);
          const categoryName = authorInfo?.primaryCategory ? 
            getCategoryById(authorInfo.primaryCategory)?.name || '' : '';
          
          return steemitService.processArticle(post, categoryName);
        });

        setArticles(processedArticles);

        // 마지막 항목 정보 저장
        const lastPost = posts[posts.length - 1];
        lastPermlink.current = lastPost.permlink;

        if (posts.length < 10) {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Failed to load articles:', error);
        setError('글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    // 작가 정보와 글 목록을 동시에 로드
    loadAuthorInfo();
    loadInitialArticles();
  }, [username]);

  if (loading) {
    return (
      <Container>
        <div className="py-8 space-y-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-muted rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-muted rounded w-32"></div>
                  <div className="h-4 bg-muted rounded w-24"></div>
                </div>
              </div>
            </div>
            <div className="magazine-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="h-48 bg-muted rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <div className="py-8">
      <Container>
        <div className="space-y-8">
          {/* Back Button */}
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              뒤로 가기
            </Link>
          </Button>

          {/* Author Info */}
          {author && (
            <div className="bg-muted/50 rounded-lg p-6 space-y-6">
              <div className="flex items-start space-x-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold">{author.displayName || author.name}</h1>
                    <p className="text-muted-foreground">@{author.name}</p>
                  </div>
                  
                  {author.about && (
                    <p className="text-muted-foreground leading-relaxed">
                      {author.about}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {author.location && (
                      <span>📍 {author.location}</span>
                    )}
                    {author.post_count && (
                      <span>📝 {author.post_count} 글</span>
                    )}
                    {author.follower_count && (
                      <span>👥 {author.follower_count} 팔로워</span>
                    )}
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button asChild variant="outline" size="sm">
                      <a 
                        href={`https://steemit.com/@${author.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Steemit 프로필
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                    {author.website && (
                      <Button asChild variant="outline" size="sm">
                        <a 
                          href={author.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          웹사이트
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Articles Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              {author?.displayName || username}의 글
            </h2>

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-12">
                <p className="text-destructive text-lg">{error}</p>
                <Button 
                  onClick={() => loadArticles(false)} 
                  className="mt-4"
                  variant="outline"
                >
                  다시 시도
                </Button>
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
                    ref={targetRef}
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
                <h3 className="text-2xl font-bold text-muted-foreground">글이 없습니다</h3>
                <p className="text-muted-foreground mt-2">
                  이 작가가 작성한 글이 없습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}