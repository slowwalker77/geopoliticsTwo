import Link from 'next/link';
import Image from 'next/image';
import { ProcessedArticle } from '@/types/steemit';
import { ProcessedArticleWithTheme } from '@/types/featured';
import { formatDate } from '@/lib/utils';
import { Clock, User, MessageCircle, Heart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  article: ProcessedArticle | ProcessedArticleWithTheme;
  featured?: boolean;
  loading?: boolean;
  className?: string;
}

export default function ArticleCard({ article, featured = false, loading = false, className }: ArticleCardProps) {
  // Handle loading state
  if (loading) {
    return (
      <article 
        className={cn(
          "article-card bg-card rounded-lg border overflow-hidden animate-pulse",
          featured && "md:col-span-2 lg:col-span-1",
          className
        )}
      >
        {/* Loading skeleton for image */}
        <div className={cn(
          "bg-muted",
          featured ? "h-64" : "h-48"
        )} />
        
        {/* Loading skeleton for content */}
        <div className="p-6 space-y-4">
          {/* Category & Date skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-6 w-20 bg-muted rounded-full" />
            <div className="h-4 w-24 bg-muted rounded" />
          </div>
          
          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="h-6 bg-muted rounded w-full" />
            <div className="h-6 bg-muted rounded w-3/4" />
          </div>
          
          {/* Excerpt skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
          
          {/* Meta info skeleton */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4">
              <div className="h-4 w-16 bg-muted rounded" />
              <div className="h-4 w-12 bg-muted rounded" />
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-4 w-8 bg-muted rounded" />
              <div className="h-4 w-8 bg-muted rounded" />
            </div>
          </div>
        </div>
      </article>
    );
  }

  // visualTheme 체크 (ProcessedArticleWithTheme)
  const hasTheme = 'visualTheme' in article && article.visualTheme;
  const theme = hasTheme ? article.visualTheme : undefined;
  const isFeaturedArticle = 'isFeatured' in article ? article.isFeatured : featured;
  
  // 테마가 없는 경우 처리 
  const cardStyle = theme ? {
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
  } : {};

  const categoryBadgeStyle = theme ? {
    backgroundColor: theme.categoryBadgeColor || 'rgb(var(--primary) / 0.1)',
    color: theme.categoryBadgeTextColor || 'rgb(var(--primary))',
  } : {};

  // 주요글 테마 처리
  const featuredIndicatorStyle = theme ? {
    backgroundColor: theme.categoryBadgeColor || 'rgb(var(--primary))',
    color: theme.categoryBadgeTextColor || 'white',
  } : {};

  return (
    <article 
      className={cn(
        "article-card group bg-card rounded-lg border overflow-hidden transition-all duration-300 hover:shadow-lg",
        isFeaturedArticle && "ring-2 ring-primary/20 shadow-md",
        featured && "md:col-span-2 lg:col-span-1",
        className
      )}
      style={cardStyle}
    >
      <Link href={`/article/${article.author}/${article.slug}`}>
        {/* Image */}
        {article.imageUrl && (
          <div className={cn(
            "relative overflow-hidden",
            featured ? "h-64" : "h-48"
          )}>
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            {/* Featured overlay gradient for better text readability */}
            {isFeaturedArticle && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Category & Date */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              {/* Featured indicator - moved here to be inline with category */}
              {isFeaturedArticle && (
                <div 
                  className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium"
                  style={featuredIndicatorStyle}
                >
                  <Star className="h-3 w-3 fill-current" />
                  <span>주요글</span>
                </div>
              )}
              <span 
                className="px-2 py-1 rounded-full text-xs font-medium transition-colors"
                style={theme ? categoryBadgeStyle : { backgroundColor: 'rgb(var(--primary) / 0.1)', color: 'rgb(var(--primary))' }}
              >
                {article.categoryName}
              </span>
            </div>
            <time 
              dateTime={article.publishedAt}
              className={theme?.textColor ? '' : 'text-muted-foreground'}
              style={theme?.textColor ? { color: theme.textColor, opacity: 0.8 } : {}}
            >
              {formatDate(article.publishedAt)}
            </time>
          </div>

          {/* Title */}
          <h3 className={cn(
            "font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2",
            featured ? "text-xl" : "text-lg"
          )}>
            {article.title}
          </h3>

          {/* Excerpt */}
          <p 
            className="line-clamp-3 leading-relaxed transition-colors"
            style={theme?.textColor ? { color: theme.textColor, opacity: 0.8 } : {}}
          >
            {article.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{article.authorDisplayName || article.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{article.readTime}분</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex items-center space-x-1">
                <Heart className="h-3 w-3" />
                <span>{article.votes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-3 w-3" />
                <span>{article.comments}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}