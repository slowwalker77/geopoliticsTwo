# 지정학과 세상읽기

한국의 입장에서 본 지정학과 인민의 삶을 위한 정치 분석 매거진

## 🌟 특징

- **Steemit 연동**: Steemit 블록체인에서 콘텐츠를 실시간으로 가져옴
- **매거진 디자인**: Fyrre Magazine 기반의 현대적이고 세련된 UI/UX
- **다중 작가 지원**: 여러 작가의 글을 카테고리별로 분류하여 제공
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기에서 최적화된 경험
- **보안 강화**: XSS 방지, 콘텐츠 새니타이징, CSP 헤더 적용
- **TypeScript**: 타입 안전성과 개발 생산성 향상

## 🛠 기술 스택

### Frontend
- **Next.js 14** - React 기반 풀스택 프레임워크
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 기반 CSS 프레임워크
- **Shadcn/ui** - 고품질 UI 컴포넌트 라이브러리
- **Lucide React** - 아이콘 라이브러리

### Backend & Data
- **Steemit API** - 블록체인 기반 콘텐츠 소싱
- **React Hook Form + Zod** - 폼 검증
- **DOMPurify** - XSS 방지 및 콘텐츠 새니타이징

### Development
- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **GSAP** - 고급 애니메이션 (향후 추가 예정)

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.0 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 저장소 클론
git clone [repository-url]
cd geopoliticsTwo

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

개발 서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── article/           # 개별 글 페이지
│   ├── author/            # 작가 페이지
│   ├── authors/           # 작가 목록 페이지
│   ├── category/          # 카테고리 페이지
│   └── globals.css        # 전역 스타일
├── components/            # React 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   ├── ArticleCard.tsx   # 글 카드 컴포넌트
│   ├── Header.tsx        # 헤더
│   ├── Footer.tsx        # 푸터
│   └── MarkDownViewer.tsx # 마크다운 렌더러
├── data/                 # 정적 데이터
│   └── categories.ts     # 카테고리 및 작가 정보
├── lib/                  # 유틸리티 함수
│   └── utils.ts          # 공통 유틸리티
├── services/             # API 서비스
│   └── steemitService.ts # Steemit API 연동
├── types/                # TypeScript 타입 정의
│   └── steemit.ts        # Steemit 관련 타입
└── utils/                # 보안 및 기타 유틸리티
    └── security.js       # 보안 관련 함수
```

## 🎨 주요 기능

### 1. 카테고리별 글 분류
- 국내문제
- 남북관계
- 국제정치
- 지역분쟁
- 참고자료

### 2. 작가 시스템
- 다중 작가 지원
- 작가별 프로필 페이지
- 작가별 글 목록

### 3. 보안 기능
- XSS 공격 방지
- 콘텐츠 새니타이징
- 이미지 URL 검증
- CSP (Content Security Policy) 헤더

### 4. 사용자 경험
- 무한 스크롤
- 반응형 디자인
- 로딩 상태 관리
- 에러 처리

## 🔧 설정

### 환경 변수
현재 프로젝트는 환경 변수가 필요하지 않습니다. Steemit API는 공개 API를 사용합니다.

### 새로운 작가 추가
`src/data/categories.ts` 파일의 `authors` 배열에 새로운 작가 정보를 추가할 수 있습니다:

```typescript
{
  username: 'steemit-username',
  displayName: '표시될 이름',
  description: '작가 소개',
  specialties: ['전문분야1', '전문분야2']
}
```

## 🛡 보안

이 프로젝트는 다음과 같은 보안 조치를 적용합니다:

- **콘텐츠 새니타이징**: DOMPurify를 사용하여 XSS 공격 방지
- **이미지 URL 검증**: 신뢰할 수 있는 도메인만 허용
- **CSP 헤더**: 콘텐츠 보안 정책 적용
- **입력 검증**: 모든 사용자 입력과 API 응답 검증


## 🤝 기여

프로젝트에 기여하고 싶으시다면:

1. 이 저장소를 포크하세요
2. 새로운 기능 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

## 📞 연락처

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

