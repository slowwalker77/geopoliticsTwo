'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import 'intersection-observer';
import getDiscussionsByBlog from '@/services/getDiscussionByBlog';
import BlogCard from './BlogCard';

async function initialfetchBlogs(
  tag,
  lastAuthor,
  lastPermlink,
  blogStart,
  setLoading,
  setBlogs,
  setError
) {
  try {
    blogStart.current = true;
    setLoading(true);
    setError(null);
    
    const result = await getDiscussionsByBlog({
      tag: tag,
      limit: 5,
    });
    
    setBlogs(result);
    if (result.length > 0) {
      const lastBlog = result[result.length - 1];
      const { author, permlink } = lastBlog;

      lastAuthor.current = author;
      lastPermlink.current = permlink;
    }
  } catch (error) {
    console.error('Error fetching blogs:', error);
    setError('블로그를 불러오는 중 오류가 발생했습니다.');
  } finally {
    setLoading(false);
    blogStart.current = false;
  }
}

async function loadMoreBlogs(
  tag,
  lastAuthor,
  lastPermlink,
  oldPermlink,
  showMore,
  setBlogs,
  setError
) {
  try {
    setError(null);
    
    const result = await getDiscussionsByBlog({
      tag: tag,
      start_author: lastAuthor.current,
      start_permlink: lastPermlink.current,
      limit: 5,
    });
    
    if (result.length > 1) {
      const extendLastBlog = result[result.length - 1];
      result.shift(); // 첫 번째 요소 제거 (중복 방지)
      
      if (oldPermlink.current !== extendLastBlog.permlink) {
        setBlogs((prev) => [...prev, ...result]);
        const lastBlog = result[result.length - 1];
        const { author, permlink } = lastBlog;
        lastAuthor.current = author;
        lastPermlink.current = permlink;
        showMore.current = true;
        oldPermlink.current = permlink;
      } else {
        showMore.current = false;
      }
    } else {
      showMore.current = false;
      setError('더 이상 불러올 블로그가 없습니다.');
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    setError('추가 블로그를 불러오는 중 오류가 발생했습니다.');
  }
}

export default function BlogList({ tag, sectionTitle, sectionDescription }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const lastAuthor = useRef('');
  const lastPermlink = useRef('');
  const oldPermlink = useRef('');
  const showMore = useRef(true);
  const targetRef = useRef(null);
  const blogStart = useRef(false);

  useEffect(() => {
    initialfetchBlogs(
      tag,
      lastAuthor,
      lastPermlink,
      blogStart,
      setLoading,
      setBlogs,
      setError
    );
  }, [tag]);

  const handleIntersect = useCallback(
    ([entry]) => {
      if (entry.isIntersecting && showMore.current && !loading) {
        loadMoreBlogs(
          tag,
          lastAuthor,
          lastPermlink,
          oldPermlink,
          showMore,
          setBlogs,
          setError
        );
      }
    },
    [tag, loading] // tag 의존성 추가
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.9,
      root: null,
    });
    
    const target = document.querySelector('.load-more-trigger');
    if (target) {
      observer.observe(target);
    }

    return () => {
      observer.disconnect();
    };
  }, [handleIntersect]);

  // 에러 상태 렌더링
  if (error && blogs.length === 0) {
    return (
      <section>
        <div className='bg-white py-16 sm:py-8'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl lg:mx-0'>
              <h2 className='text-2xl font-bold tracking-tight text-gray-900 sm:text-2xl'>
                {sectionTitle}
              </h2>
              <p className='text-red-600 mt-4'>{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div>
        <div className='bg-white py-16 sm:py-8'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl lg:mx-0'>
              <h2 className='text-2xl font-bold tracking-tight text-gray-900 sm:text-2xl'>
                {sectionTitle}
              </h2>
            </div>
            <div className='mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-8 border-t border-gray-200 pt-10 sm:mt-8 sm:pt-8 lg:mx-0 lg:max-w-none lg:grid-cols-3'>
              {blogs?.map((blog) => (
                <Link
                  key={blog.post_id}
                  href={`/blogs/${blog.author}/${blog.permlink}`}
                >
                  <BlogCard blog={blog} sectionTitle={sectionTitle} />
                </Link>
              ))}
            </div>
            {error && blogs.length > 0 && (
              <p className='text-red-600 mt-4 text-center'>{error}</p>
            )}
          </div>
        </div>
        {loading && <p className='text-center'>Loading…</p>}
        {!loading && showMore.current && (
          <p className='load-more-trigger text-center' ref={targetRef}>
            {blogStart.current ? null : 'continue…'}
          </p>
        )}
      </div>
    </section>
  );
}
