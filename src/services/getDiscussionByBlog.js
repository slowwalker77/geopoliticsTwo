import steem from 'steem';

export default function getDiscussionsByBlog(query) {
  return new Promise((resolve, reject) => {
    // 입력 검증
    if (!query || typeof query !== 'object') {
      reject(new Error('Invalid query parameter'));
      return;
    }

    // API 호출 타임아웃 설정 (30초)
    const timeout = setTimeout(() => {
      reject(new Error('API request timeout'));
    }, 30000);

    steem.api.getDiscussionsByBlog(query, (err, result) => {
      clearTimeout(timeout);
      
      if (err) {
        console.error('Steemit API Error:', err);
        reject(new Error(`Failed to fetch discussions: ${err.message || 'Unknown error'}`));
        return;
      }

      // 결과 검증
      if (!Array.isArray(result)) {
        reject(new Error('Invalid API response format'));
        return;
      }

      // 각 블로그 포스트 데이터 검증 및 새니타이징
      const sanitizedResult = result.map(post => {
        if (!post || typeof post !== 'object') {
          return null;
        }

        return {
          ...post,
          title: typeof post.title === 'string' ? post.title : '',
          body: typeof post.body === 'string' ? post.body : '',
          author: typeof post.author === 'string' ? post.author : '',
          permlink: typeof post.permlink === 'string' ? post.permlink : '',
          created: typeof post.created === 'string' ? post.created : '',
          post_id: post.post_id || 0
        };
      }).filter(Boolean); // null 값 제거

      resolve(sanitizedResult);
    });
  });
}
