'use client';
import { useRef, useEffect } from 'react';
import MarkDownViewer from '@/components/MarkDownViewer';
import { AiTwotoneCalendar } from 'react-icons/ai';
import selectTitle from '@/services/selectTitle';

export default function BlogContent({
  blog: { title, created, body, author },
  sectionTitle,
}) {
  console.log('BlogContent sectionTitle:', sectionTitle);

  return (
    <section className='flex flex-col p-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
      <div className='flex items-center self-end text-sky-600 pb-4'>
        <AiTwotoneCalendar />
        <p className='font-semibold ml-2'>
          {new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(Date.parse(created))}
        </p>
      </div>
      <h1 className='text-lg font-bold pb-4'>
        {title.replace(/^[^ ]* /, '')}
      </h1>
      <p className='text-xl font-bold'>{sectionTitle}</p>
      <div className='w-44 border-2 border-sky-600 mt-4 mb-8' />
      <MarkDownViewer content={body} />
    </section>
  );
}
