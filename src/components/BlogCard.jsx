import { sanitizeTitle } from '@/utils/security';

export default function BlogCard({
  blog: { title, created, body, author, json_metadata },
  sectionTitle,
}) {
  // 안전한 데이터 처리
  const safeTitle = sanitizeTitle(title || '');
  const safeBody = typeof body === 'string' ? body.substring(0, 200) : '';
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
    <article className='flex max-w-xl flex-col items-start justify-between overflow-hidden'>
      <div className='flex flex-row justify-between items-center text-xs'>
        <p className='text-gray-500 flex-grow'>
          {formattedDate}
        </p>
        <p className=' object-fill rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600'>
          {sectionTitle}
        </p>
      </div>
      <div className='group relative'>
        <div>
          <h3 className='mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600 '>
            <span className='absolute inset-0' />
            {safeTitle}
          </h3>
        </div>

        <p className='mt-5 line-clamp-3 text-sm leading-6 text-gray-600'>
          {safeBody.replace(/<[^>]*>/g, '')} {/* HTML 태그 제거 */}
        </p>
      </div>
    </article>
  );
}
