'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import MarkDownViewer from '@/components/MarkDownViewer';
import { steemitService } from '@/services/steemitService';
import { ProcessedArticle } from '@/types/steemit';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Clock, User, MessageCircle, Heart, ExternalLink, Calendar } from 'lucide-react';

export default function ArticlePage() {
  const params = useParams();
  const author = params.author as string;
  const slug = params.slug as string;
  
  const [article, setArticle] = useState<ProcessedArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const post = await steemitService.getPost(author, slug);
        const processedArticle = steemitService.processArticle(post);
        
        setArticle(processedArticle);
      } catch (error) {
        console.error('Failed to fetch article:', error);
        setError('글을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (author && slug) {
      fetchArticle();
    }
  }, [author, slug]);

  if (loading) {
    return (
      <Container>
        <div className="py-8 space-y-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-12 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !article) {
    return (
      <Container>
        <div className="py-16 text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">
            {error || '글을 찾을 수 없습니다'}
          </h1>
          <p className="text-muted-foreground">
            요청하신 글이 존재하지 않거나 불러올 수 없습니다.
          </p>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              홈으로 돌아가기
            </Link>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <article className="py-8">
      <Container>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Button */}
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              뒤로 가기
            </Link>
          </Button>

          {/* Article Header */}
          <header className="space-y-6">
            {/* Category */}
            {article.categoryName && (
              <div>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {article.categoryName}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{article.authorDisplayName || article.author}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={article.publishedAt}>
                  {formatDate(article.publishedAt)}
                </time>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{article.readTime}분 읽기</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>{article.votes} 좋아요</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>{article.comments} 댓글</span>
              </div>
              <Button asChild variant="ghost" size="sm">
                <a 
                  href={article.steemitUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Steemit에서 보기</span>
                </a>
              </Button>
            </div>

            {/* Featured Image */}
            {article.imageUrl && (
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </header>

          <Separator />

          {/* Article Content */}
          <div className="prose prose-lg max-w-none article-content">
            <MarkDownViewer content={article.content} />
          </div>

          <Separator />

          {/* Article Footer */}
          <footer className="space-y-6">
            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  태그
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-muted px-3 py-1 rounded-full text-sm text-muted-foreground hover:bg-muted/80 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Info */}
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{article.authorDisplayName || article.author}</h3>
                  <p className="text-sm text-muted-foreground">작가</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/author/${article.author}`}>
                    작가의 다른 글 보기
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a 
                    href={`https://steemit.com/@${article.author}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Steemit 프로필
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button asChild variant="outline">
                <Link href={article.categoryName ? `/category/${article.category}` : '/'}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {article.categoryName || '홈'}으로 돌아가기
                </Link>
              </Button>
            </div>
          </footer>
        </div>
      </Container>
    </article>
  );
}