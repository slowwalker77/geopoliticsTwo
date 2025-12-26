import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gradient">
              지정학과 세상읽기
            </h3>
            <p className="text-sm text-muted-foreground">
              한국의 입장에서 본 지정학과 인민의 삶을 위한 정치 분석
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">카테고리</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/domestic" className="text-muted-foreground hover:text-foreground transition-colors">
                  국내문제
                </Link>
              </li>
              <li>
                <Link href="/category/inter-korea" className="text-muted-foreground hover:text-foreground transition-colors">
                  남북관계
                </Link>
              </li>
              <li>
                <Link href="/category/international" className="text-muted-foreground hover:text-foreground transition-colors">
                  국제정치
                </Link>
              </li>
              <li>
                <Link href="/category/regional-conflicts" className="text-muted-foreground hover:text-foreground transition-colors">
                  지역분쟁
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">소개</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  사이트 소개
                </Link>
              </li>
              <li>
                <Link href="/authors" className="text-muted-foreground hover:text-foreground transition-colors">
                  작가 소개
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  연락처
                </Link>
              </li>
            </ul>
          </div>

          {/* External Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">외부 링크</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://steemit.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Steemit
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2024 지정학과 세상읽기. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
          </p>
        </div>
      </div>
    </footer>
  );
}