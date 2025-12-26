'use client';

import Link from 'next/link';
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { authors } from '@/data/categories';
import { User, ExternalLink, ArrowRight } from 'lucide-react';

export default function AuthorsPage() {
  return (
    <div className="py-8">
      <Container>
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">작가 소개</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              지정학과 세상읽기에 기여하는 전문가들을 만나보세요
            </p>
          </div>

          {/* Authors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((author) => (
              <div
                key={author.username}
                className="bg-card rounded-lg border p-6 space-y-4 hover:shadow-lg transition-all duration-300"
              >
                {/* Avatar */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{author.displayName}</h3>
                    <p className="text-muted-foreground">@{author.username}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {author.description}
                </p>

                {/* Specialties */}
                {author.specialties && author.specialties.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      전문 분야
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {author.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/author/${author.username}`}>
                      글 보기
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a 
                      href={`https://steemit.com/@${author.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add More Authors CTA */}
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">더 많은 작가를 찾고 계신가요?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Steemit에서 다양한 정치 분석가와 지정학 전문가들의 글을 만나보실 수 있습니다.
            </p>
            <Button asChild size="lg">
              <a 
                href="https://steemit.com/trending/politics"
                target="_blank"
                rel="noopener noreferrer"
              >
                Steemit 정치 카테고리 보기
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}