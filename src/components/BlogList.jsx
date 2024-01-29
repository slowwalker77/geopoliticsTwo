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
  setBlogs
) {
  try {
    blogStart.current = true;
    setLoading(true);
    getDiscussionsByBlog({
      tag: tag,
      limit: 5,
    }).then((result) => {
      setBlogs(result);
      const lastBlog = result[result.length - 1];
      const { author, permlink } = lastBlog;

      lastAuthor.current = author;
      lastPermlink.current = permlink;
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
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
  setBlogs
) {
  try {
    getDiscussionsByBlog({
      tag: tag,
      start_author: lastAuthor.current,
      start_permlink: lastPermlink.current,
      limit: 5,
    }).then((result) => {
      const extendLastBlog = result[result.length - 1];
      if (result.length > 1) {
        const resultFirstBlog = result.shift();
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
        alert('더이상의 Blog가 없습니다.');
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

export default function BlogList({ tag, sectionTitle, sectionDescription }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setBlogs
    );
  }, [tag]);

  const handleIntersect = useCallback(
    ([entry]) => {
      if (entry.isIntersecting) {
        loadMoreBlogs(
          tag,
          lastAuthor,
          lastPermlink,
          oldPermlink,
          showMore,
          setBlogs
        );
      }
    },
    [tag]
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

  return (
    <section>
      <div>
        <div className='bg-white py-24 sm:py-32'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl lg:mx-0'>
              <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
                {sectionTitle}
              </h2>
              <p className='mt-2 text-lg leading-8 text-gray-600'>
                {sectionDescription}
              </p>
            </div>
            <div className='mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3'>
              {blogs?.map((blog) => (
                <Link
                  key={blog.post_id}
                  href={`/blogs/${blog.author}/${blog.permlink}`}
                >
                  <BlogCard blog={blog} sectionTitle={sectionTitle} />
                </Link>
              ))}
            </div>
          </div>
        </div>
        {loading && <p>Loading…</p>}
        {!loading && (
          <p className='load-more-trigger' ref={targetRef}>
            {blogStart.current ? null : 'continue…'}
          </p>
        )}
      </div>
    </section>
  );
}
