import { pageProps } from '../types/pageTypes';

const pictures = [
  'DSC00680',
  'DSC00933',
  'DSC00966',
  'DSC00983',
  'DSC01011',
  'DSC01040',
  'DSC01064',
  'DSC01071',
  'DSC01103',
  'DSC01145',
  'DSC01420',
  'DSC01461',
  'DSC01489',
  'DSC02031',
  'DSC02064',
  'DSC02069',
];
const urls = [
  'https://issuetown.co.kr',
  'google',
  'https://naver.com',
  'https://google.com',
  'https://naver.com',
  'https://google.com',
  'https://naver.com',
  'https://google.com',
  'https://naver.com',
  'https://google.com',
  'https://naver.com',
  'https://google.com',
  'https://naver.com',
  'https://google.com',
  'https://naver.com',
  'https://google.com',
];
export const pageTitle = [
  'DSC00680',
  'DSC00933',
  'DSC00966',
  'DSC00983',
  'DSC01011',
  'DSC01040',
  'DSC01064',
  'DSC01071',
  'DSC01103',
  'DSC01145',
  'DSC01420',
  'DSC01461',
  'DSC01489',
  'DSC02031',
  'DSC02064',
  'DSC02069',
];
// 커버
export const pages: pageProps[] = [
  {
    id: 0,
    front: 'book-cover',
    back: pictures[0],
    backUrl: urls[0],
  },
];

// 페이지들
for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    id: i,
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
    frontUrl: urls[i % urls.length],
    backUrl: urls[(i + 1) % urls.length],
  });
}
// back 커버
pages.push({
  id: pictures.length + 1,
  front: pictures[pictures.length - 1],
  frontUrl: urls[urls.length - 1],
  back: 'book-back',
});
