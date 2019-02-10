import React from 'react';

import { CommentCount } from 'disqus-react';
import formatReadingTime from '../utils/formatReadingTime';

export default function BlogPostMetadata({
  date,
  timeToRead,
  disqusShortname,
  identifier,
}) {
  return (
    <small>
      {date} &bull; {formatReadingTime(timeToRead)} &bull;{' '}
      <CommentCount
        shortname={disqusShortname}
        config={{
          identifier: identifier,
        }}
      >
        0 comments
      </CommentCount>
    </small>
  );
}
