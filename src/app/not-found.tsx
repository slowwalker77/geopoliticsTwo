import Link from 'next/link';
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="py-16">
      <Container>
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* 404 Illustration */}
          <div className="space-y-4">
            <div className="text-8xl font-bold text-muted-foreground/20">404</div>
            <h1 className="text-4xl font-bold">페이지를 찾을 수 없습니다</h1>
            <p className="text-xl text-muted-foreground">
              요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            </p>
          </div>

          {/* Suggestions */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold">다음을 시도해보세요:</h2>
            <ul className="text-left space-y-2 text-muted-foreground">
              <li>• URL을 다시 확인해보세요</li>
              <li>• 홈페이지에서 원하는 글을 찾아보세요</li>
              <li>• 카테고리별로 글을 탐색해보세요</li>
              <li>• 작가별로 글을 찾아보세요</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                홈으로 가기
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/category/domestic">
                <Search className="mr-2 h-4 w-4" />
                글 둘러보기
              </Link>
            </Button>
          </div>

          {/* Popular Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">인기 카테고리</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link href="/category/domestic">국내문제</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/category/inter-korea">남북관계</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/category/international">국제정치</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/category/regional-conflicts">지역분쟁</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/authors">작가 소개</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}