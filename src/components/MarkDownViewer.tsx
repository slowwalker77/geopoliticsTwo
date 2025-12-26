'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Image from 'next/image';
import { sanitizeContent, isValidImageUrl } from '@/utils/security';

interface MarkDownViewerProps {
  content: string;
}

export default function MarkDownViewer({ content }: MarkDownViewerProps) {
  // 콘텐츠 새니타이징
  const sanitizedContent = sanitizeContent(content);

  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ children, className, ...rest }) {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter
                {...rest}
                PreTag='div'
                language={match[1]}
                style={materialDark}
                className="rounded-lg"
              >
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
                <div className="w-full h-60 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                  이미지를 로드할 수 없습니다
                </div>
              );
            }

            return (
              <div className="relative w-full h-auto my-6">
                <Image
                  src={imageUrl}
                  alt={imageAlt.substring(0, 100)}
                  width={800}
                  height={400}
                  className="rounded-lg shadow-md w-full h-auto"
                  onError={() => {
                    console.warn('Failed to load image:', imageUrl);
                  }}
                />
              </div>
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
                className="text-primary hover:underline"
                {...props}
              >
                {children}
              </a>
            );
          },
          blockquote: ({ children, ...props }) => (
            <blockquote 
              className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground"
              {...props}
            >
              {children}
            </blockquote>
          ),
          h1: ({ children, ...props }) => (
            <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-2xl font-bold mt-6 mb-3 text-foreground" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-xl font-bold mt-4 mb-2 text-foreground" {...props}>
              {children}
            </h3>
          ),
          p: ({ children, ...props }) => (
            <p className="leading-relaxed mb-4 text-foreground" {...props}>
              {children}
            </p>
          ),
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside mb-4 space-y-2" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2" {...props}>
              {children}
            </ol>
          ),
        }}
      >
        {sanitizedContent}
      </ReactMarkdown>
    </div>
  );
}
