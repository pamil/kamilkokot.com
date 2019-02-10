import React from 'react';

import { CommentCount } from 'disqus-react';
import formatReadingTime from '../utils/formatReadingTime';

export default function BlogPostMetadata({
  date,
  timeToRead,
  disqusShortname,
  identifier,
  editUrl = null,
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
      {editUrl && (
        <span>
          {' '}
          &bull;{' '}
          <a
            href={editUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', boxShadow: 'none' }}
          >
            Edit on GitHub
          </a>
        </span>
      )}
    </small>
  );
}
