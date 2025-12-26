import Link from 'next/link';
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mail, MessageCircle, ExternalLink, ArrowLeft, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="py-8">
      <Container>
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Back Button */}
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              홈으로 돌아가기
            </Link>
          </Button>

          {/* Header */}
          <section className="text-center space-y-6">
            <h1 className="text-4xl font-bold">연락처</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              의견, 제안, 또는 협업 문의가 있으시면 언제든 연락해 주세요
            </p>
          </section>

          {/* Contact Methods */}
          <section className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Steemit Contact */}
              <div className="bg-card rounded-lg border p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Steemit</h3>
                    <p className="text-sm text-muted-foreground">블록체인 플랫폼에서 소통</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Steemit 플랫폼에서 직접 댓글을 남기거나 메시지를 보내실 수 있습니다.
                </p>
                <Button asChild className="w-full">
                  <a 
                    href="https://steemit.com/@section-0" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    @section-0 방문하기
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>

              {/* General Inquiry */}
              <div className="bg-card rounded-lg border p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Send className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">채널 가입</h3>
                    <p className="text-sm text-muted-foreground">같은 취지로 행동하고자 한다면</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  현재 한국이 직면한 위기를 극복하고자 하는 <a href='/article/section-0/25-10-30'>취지</a>에 동의하고 자그마한 행동이라도 함께 하고자 하시는 분들은 가입 신청해 주세요.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <a 
                    href="https://t.me/+y2DZV9wv1r5lNzU1" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    우리 스스로 주인되는 세상
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </section>

          <Separator />

          {/* Collaboration */}
          <section className="text-center space-y-6">
            <h2 className="text-2xl font-bold">협업 제안</h2>
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                정치 분석가, 지정학 전문가, 또는 관련 분야의 연구자이시라면 
                함께 협업할 수 있는 기회를 모색해보겠습니다.
              </p>
              <div className="space-y-3">
                <h4 className="font-semibold">협업 가능 분야:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 공동 연구 및 분석 프로젝트</li>
                  <li>• 게스트 기고 및 인터뷰</li>
                  <li>• 정책 제안서 공동 작성</li>
                  <li>• 세미나 및 토론회 기획</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Community Guidelines */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-center">커뮤니티 가이드라인</h2>
            <div className="bg-card rounded-lg border p-6 space-y-4">
              <h4 className="font-semibold">건전한 토론 문화를 위해:</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 상호 존중과 예의를 지켜주세요</li>
                <li>• 근거 있는 주장과 건설적인 비판을 환영합니다</li>
                <li>• 개인 공격이나 혐오 표현은 금지됩니다</li>
                <li>• 다양한 관점과 의견을 존중해 주세요</li>
                <li>• 팩트 체크와 신뢰할 수 있는 출처를 중시합니다</li>
              </ul>
            </div>
          </section>

          {/* Technical Information */}
          {/*
          <section className="bg-muted/50 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-center">기술 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">플랫폼</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Next.js 14 (React 기반)</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• Shadcn/ui</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">데이터 소스</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Steemit 블록체인</li>
                  <li>• 탈중앙화 콘텐츠</li>
                  <li>• 실시간 동기화</li>
                  <li>• 검열 저항성</li>
                </ul>
              </div>
            </div>
          </section>
          */}

        </div>
      </Container>
    </div>
  );
}