'use client';
import ReactMarkdown from 'react-markdown'; // 마크다운을 HTML로 변환하는 라이브러리
import remarkGfm from 'remark-gfm'; //마크다운에 GitHub Flavored Markdown(GFM) 확장을 적용하는 플러그인
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; //코드 블록을 강조 표시하는 라이브러리
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; //코드 블록의 스타일을 지정하는 테마
import Image from 'next/image';

export default function MarkDownViewer({ content }) {
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
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                style={materialDark}
              />
            ) : (
              <code className={className} {...rest}>
                {children}
              </code>
            );
          },
          img: (image) => (
            <Image
              className='w-full max-h-60 object-cover'
              src={image.src || ''}
              alt={image.alt || ''}
              width={500}
              height={350}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
