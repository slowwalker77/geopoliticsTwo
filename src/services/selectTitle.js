export default function selectTitle(tag) {
  let sectionTitle = '';
  let sectionDescription = '';
  switch (tag) {
    case 'section-0':
      sectionTitle = '국내문제';
      break;
    case 'section-1':
      sectionTitle = '남북관계';
      break;
    case 'section-2':
      sectionTitle = '국제정치';
      break;
    case 'section-3':
      sectionTitle = '지역분쟁';
      break;
    case 'section-4':
      sectionTitle = '참고자료';
      break;
  }
  return [sectionTitle];
}
