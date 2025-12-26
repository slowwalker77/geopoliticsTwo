'use client';
import ReactMarkdown from 'react-markdown'; // 마크다운을 HTML로 변환하는 라이브러리
import remarkGfm from 'remark-gfm'; //마크다운에 GitHub Flavored Markdown(GFM) 확장을 적용하는 플러그인
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; //코드 블록을 강조 표시하는 라이브러리
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; //코드 블록의 스타일을 지정하는 테마
import Image from 'next/image';
import { sanitizeContent, isValidImageUrl } from '@/utils/security';

export default function MarkDownViewer({ content }) {
  // 콘텐츠 새니타이징
  const sanitizedContent = sanitizeContent(content);

  return (
    <div>
      <ReactMarkdown
        className='prose max-w-none'
        remarkPlugins={[remarkGfm]}
        components={{
          code({ children, className, node, ...rest }) {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter
                {...rest}
                PreTag='div'
                language={match[1]}
                style={materialDark}>
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...rest}>
                {children}
              </code>
            );
          },
          img: (image) => {
            // 이미지 URL 검증
            const imageUrl = image.src || '';
            const imageAlt = image.alt || '';
            
            if (!isValidImageUrl(imageUrl)) {
              return (
                <div className="w-full max-h-60 bg-gray-200 flex items-center justify-center text-gray-500">
                  이미지를 로드할 수 없습니다
                </div>
              );
            }

            return (
              <Image
                className='w-full max-h-60 object-cover'
                src={imageUrl}
                alt={imageAlt.substring(0, 100)} // alt 텍스트 길이 제한
                width={500}
                height={350}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            );
          },
          a: ({ href, children, ...props }) => {
            // 링크 검증 및 보안 처리
            if (!href || typeof href !== 'string') {
              return <span>{children}</span>;
            }

            try {
              const url = new URL(href);
              if (!['http:', 'https:'].includes(url.protocol)) {
                return <span>{children}</span>;
              }
            } catch {
              return <span>{children}</span>;
            }

            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            );
          }
        }}
      >
        {sanitizedContent}
      </ReactMarkdown>
    </div>
  );
}
