import React from 'react';

import { CommentCount } from 'disqus-react';
import formatReadingTime from '../utils/formatReadingTime';
import { graphql, StaticQuery } from 'gatsby';

function BlogPostMetadata({ date, timeToRead, identifier, slug = null }) {
  return (
    <StaticQuery
      query={blogPostMetadataQuery}
      render={data => {
        const { disqusShortname, githubRepository } = data.site.siteMetadata;
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
            {slug && (
              <span>
                {' '}
                &bull;{' '}
                <a
                  href={`https://github.com/${githubRepository}/edit/master/content/blog${slug}index.md`}
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
      }}
    />
  );
}

const blogPostMetadataQuery = graphql`
  query BlogPostMetadataQuery {
    site {
      siteMetadata {
        disqusShortname
        githubRepository
      }
    }
  }
`;

export default BlogPostMetadata;
