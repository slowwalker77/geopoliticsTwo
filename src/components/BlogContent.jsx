'use client';
import { useRef, useEffect } from 'react';
import MarkDownViewer from '@/components/MarkDownViewer';
import { AiTwotoneCalendar } from 'react-icons/ai';
import selectTitle from '@/services/selectTitle';
import { sanitizeTitle } from '@/utils/security';
import '@/app/globals.css';

export default function BlogContent({
  blog: { title, created, body, author },
  sectionTitle,
}) {
  // 안전한 데이터 처리
  const safeTitle = sanitizeTitle(title || '');
  const safeBody = typeof body === 'string' ? body : '';
  const safeAuthor = typeof author === 'string' ? author : '';
  const safeCreated = typeof created === 'string' ? created : '';
  
  // 날짜 파싱 안전성 검증
  let formattedDate = '';
  try {
    const parsedDate = Date.parse(safeCreated);
    if (!isNaN(parsedDate)) {
      formattedDate = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(parsedDate);
    }
  } catch (error) {
    console.warn('Date parsing error:', error);
    formattedDate = '날짜 없음';
  }

  return (
    <section className='flex flex-col p-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
      <div className='flex items-center self-end text-sky-600 pb-2'>
        <p className='text-lg font-bold'>{sectionTitle}</p>
        <AiTwotoneCalendar />
        <p className='font-semibold ml-2'>
          {formattedDate}
        </p>
      </div>
      <h1 className='text-2xl font-bold pb-2'>
        {safeTitle}
      </h1>
      <div className='w-44 border-2 border-sky-600 mt-4 mb-4' />
      <MarkDownViewer content={safeBody}/>
    </section>
  );
}
