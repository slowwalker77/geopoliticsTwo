'use client';
import { useState, useEffect } from 'react';
import BlogContent from '@/components/BlogContent';
import BlogList from '@/components/BlogList';
import steem from 'steem';
import selectTitle from '@/services/selectTitle';

export default function BlogPage({ params: { slug } }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 입력 검증
        if (!slug || !Array.isArray(slug) || slug.length !== 2) {
          throw new Error('Invalid blog parameters');
        }

        const [author, permlink] = slug;
        
        // 파라미터 검증
        if (typeof author !== 'string' || typeof permlink !== 'string') {
          throw new Error('Invalid author or permlink');
        }

        // 기본적인 문자열 검증 (알파벳, 숫자, 하이픈, 언더스코어만 허용)
        const validPattern = /^[a-zA-Z0-9._-]+$/;
        if (!validPattern.test(author) || !validPattern.test(permlink)) {
          throw new Error('Invalid characters in parameters');
        }

        const result = await steem.api.getContentAsync(author, permlink);
        
        // 결과 검증
        if (!result || typeof result !== 'object') {
          throw new Error('Invalid blog content');
        }

        setBlog(result);
      } catch (error) {
        console.error('블로그 내용을 불러오는 중 오류 발생:', error);
        setError('블로그 내용을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (slug && Array.isArray(slug) && slug.length === 2) {
      fetchData();
    } else {
      // slug의 길이가 2가 아닌 경우 상태를 초기화합니다.
      setBlog(null);
      setError(null);
    }
  }, [slug]);

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <p>블로그 내용을 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (slug && Array.isArray(slug) && slug.length === 1) {
    const tag = slug[0];
    const titleInfo = selectTitle(tag);
    
    return (
      <section>
        <BlogList
          tag={tag}
          sectionTitle={titleInfo[0] || '블로그'}
          sectionDescription={titleInfo[1] || ''}
        />
      </section>
    );
  } else if (blog) {
    const tag = slug && slug[0] ? slug[0] : '';
    const titleInfo = selectTitle(tag);
    
    return (
      <article className='rounded-2xl overflow-hidden bg-gray-100 shadow-lg m-4'>
        <BlogContent 
          blog={blog} 
          sectionTitle={titleInfo[0] || '블로그'} 
        />
      </article>
    );
  } else {
    return (
      <div className="flex justify-center items-center min-h-64">
        <p>페이지를 찾을 수 없습니다.</p>
      </div>
    );
  }
}
