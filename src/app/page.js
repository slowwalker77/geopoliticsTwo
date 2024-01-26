import { redirect } from 'next/navigation';

export default function Home() {
  <span className='sr-obly'>
    Home 페이지에 내용 넣기 전까지 국내문제로 redirect
  </span>;
  redirect('/blogs/section-1');
  return;
}
