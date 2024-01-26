export default function selectTitle(tag) {
  let sectionTitle = '';
  let sectionDescription = '';
  switch (tag) {
    case 'section-2':
      sectionTitle = '국제문제';
      sectionDescription = '국제문제 타이틀에 대한 개요를 써주세요';
      break;
    case 'section-3':
      sectionTitle = '분쟁지역';
      sectionDescription = '분쟁지역 타이틀에 대한 개요를 써주세요';
      break;
    case 'section-4':
      sectionTitle = '참고자료';
      sectionDescription = '참고자료 타이틀에 대한 개요를 써주세요';
      break;
    default:
      sectionTitle = '국내문제';
      sectionDescription = '국내문제 타이틀에 대한 개요를 써주세요';
      break;
  }
  return [sectionTitle, sectionDescription];
}
