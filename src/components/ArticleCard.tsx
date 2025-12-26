import Link from 'next/link';
import Image from 'next/image';
import { ProcessedArticle } from '@/types/steemit';
import { formatDate } from '@/lib/utils';
import { Clock, User, MessageCircle, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  article: ProcessedArticle;
  featured?: boolean;
  className?: string;
}

export default function ArticleCard({ article, featured = false, className }: ArticleCardProps) {
  return (
    <article className={cn(
      "article-card group bg-card rounded-lg border overflow-hidden",
      featured && "md:col-span-2 lg:col-span-1",
      className
    )}>
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
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Category & Date */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
              {article.categoryName}
            </span>
            <time dateTime={article.publishedAt}>
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
          <p className="text-muted-foreground line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{article.authorDisplayName || article.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{article.readTime}분</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
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