import Link from 'next/link';
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Globe, Users, BookOpen, Target, Heart, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-8">
      <Container>
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <section className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              지정학과 세상읽기
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              한국의 입장에서 본 지정학과 인민의 삶을 위한 정치 분석 플랫폼
            </p>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </section>

          {/* Mission Statement */}
          <section className="bg-muted/50 rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-center">사이트의 목적</h2>
            <div className="prose prose-lg max-w-none text-center">
              <p className="text-lg leading-relaxed">
                대한민국의 바람직한 미래를 위한 고민을 찾아서
              </p>
              <p className="text-muted-foreground">
                우리는 복잡한 국제정치와 지정학적 변화 속에서 한국이 나아가야 할 방향을 모색합니다. 
                서민과 노동자, 그리고 대다수 인민을 위한 정치적 관점에서 세상을 바라보며, 
                진정한 민주주의와 평화로운 미래를 위한 통찰을 제공합니다.
              </p>
            </div>
          </section>

          {/* Core Values */}
          <section className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center space-y-4 p-6 rounded-lg border">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">지정학적 통찰</h3>
                <p className="text-muted-foreground">
                  변화하는 국제정세를 한국의 관점에서 분석하고, 
                  지정학적 변화가 우리 삶에 미치는 영향을 탐구합니다.
                </p>
              </div>

              <div className="text-center space-y-4 p-6 rounded-lg border">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">인민 중심</h3>
                <p className="text-muted-foreground">
                  우리 사회 대다수를 차지하는 인민대중을 위한 정치적 관점을 견지합니다.
                </p>
              </div>

              <div className="text-center space-y-4 p-6 rounded-lg border">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">평화 추구</h3>
                <p className="text-muted-foreground">
                  한반도 평화와 새로운 남북 관계, 그리고 동아시아의 
                  평화로운 공존을 위한 방안을 모색합니다.
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* What We Cover */}
          {/*
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-center">다루는 주제</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary" />
                  국내 정치 분석
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 한국 정치의 현재와 미래</li>
                  <li>• 사회 정책과 경제 정책 분석</li>
                  <li>• 민주주의와 시민 참여</li>
                  <li>• 노동 정책과 사회 복지</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-primary" />
                  국제 정세 분석
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 미중 패권 경쟁과 한국의 선택</li>
                  <li>• 동아시아 지정학적 변화</li>
                  <li>• 글로벌 경제와 한국 경제</li>
                  <li>• 국제 분쟁과 평화 구축</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary" />
                  남북 관계
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 한반도 평화 프로세스</li>
                  <li>• 북한 정세와 변화 전망</li>
                  <li>• 통일 정책과 미래 비전</li>
                  <li>• 동북아 안보와 협력</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  사회 분석
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 불평등과 사회 정의</li>
                  <li>• 청년 문제와 미래 세대</li>
                  <li>• 지역 갈등과 통합</li>
                  <li>• 문화와 이데올로기</li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />
          */}

          {/* Platform Features */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-center">플랫폼 특징</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">블록체인 기반 콘텐츠</h3>
                <p className="text-muted-foreground">
                  Steemit 블록체인을 통해 검열 저항성을 갖춘 콘텐츠를 제공합니다. 
                  탈중앙화된 플랫폼에서 자유로운 의견 표현과 토론이 가능합니다.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">발전적 논점</h3>
                <p className="text-muted-foreground">
                  인민대중을 위한 발전적 논점을 유지하며 여러 전문가와 작가들의 다양한 시각을 통해 균형 잡힌 
                  정보와 분석을 제공합니다.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">실시간 업데이트</h3>
                <p className="text-muted-foreground">
                  빠르게 변화하는 국제정세와 국내 정치 상황에 대한 
                  실시간 분석과 해석을 제공합니다.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">깊이 있는 분석</h3>
                <p className="text-muted-foreground">
                  단순한 뉴스 전달을 넘어서 역사적 맥락과 구조적 분석을 
                  통한 깊이 있는 통찰을 제공합니다.
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Historical Context */}
          <section className="bg-muted/50 rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-center">역사적 성찰</h2>
            <div className="prose prose-lg max-w-none">
              <blockquote className="text-lg italic border-l-4 border-primary pl-6">
                대한민국의 바람직한 미래를 위한 고민을 찾아서<br/>

                무엇을 고민할 것인가?<br/>
                노태우의 공약은 작전권전환과 200만호 건설이었다.<br/>
                정주영의 공약은 토지공개념 이었다.<br/>
                우리는 그동안 무엇을 했는가?<br/>
                전진했는가? 후퇴했는가?<br/>
                2030을 위한 100만호 임대주택 건설은 불가능한가<br/>
                남북 평화협정체결로 평화를 지킬 수 있다.<br/>
                한반도 안보의 한국화가 되어야 자주적인 된다.<br/>
                인문지리적 억제로 한반도에서 전쟁을 막을 수 있다.<br/>
                변화하는 국제정치에 능동적으로 대응하기 위한 노동과 자본의 동맹은 불가능한가?<br/>
                모두 다 같이 사는 공동체적 삶을 만들어 가자.
              </blockquote>
              <p className="text-muted-foreground text-center mt-4">
                과거의 약속과 현재의 현실을 비교하며, 진정한 발전의 방향을 모색합니다.
              </p>
            </div>
          </section>

          {/* Future Vision */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-center">미래 비전</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">2030을 위한 정책 제안</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 100만호 임대주택 건설 방안</li>
                  <li>• 남북 평화협정 체결 로드맵</li>
                  <li>• 하위 50% 소득 증대 정책</li>
                  <li>• 지속가능한 경제 발전 모델</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">변화하는 국제정치 대응</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 능동적 외교 정책 수립</li>
                  <li>• 자본과 대중의 상생 방안</li>
                  <li>• 동아시아 평화 체제 구축</li>
                  <li>• 글로벌 거버넌스 참여 확대</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center space-y-6 bg-primary/5 rounded-lg p-8">
            <h2 className="text-2xl font-bold">함께 만들어가는 미래</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              지정학과 세상읽기는 단순한 정보 제공을 넘어서, 
              더 나은 미래를 위한 집단 지성의 플랫폼이 되고자 합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/category/domestic">
                  최신 분석 읽기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="https://t.me/+y2DZV9wv1r5lNzU1" 
                    target="_blank" >
                  텔레그램 [우리 스스로 주인되는 세상] 가입
                </Link>
              </Button>
            </div>
          </section>

          {/* Contact Information */}
          <section className="text-center space-y-4">
            <p className="text-muted-foreground">
              의견이나 제안사항이 있으시면 언제든 연락해 주세요.
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild variant="outline">
                <a 
                  href="/contact" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  연락처
                </a>
              </Button>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}