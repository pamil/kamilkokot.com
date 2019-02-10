import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';

import { rhythm } from '../utils/typography';

function Footer() {
  return (
    <StaticQuery
      query={footerQuery}
      render={data => {
        const { social } = data.site.siteMetadata;
        return (
          <footer>
            <a
              href={`https://twitter.com/${social.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>{' '}
            &bull;{' '}
            <a
              href={`https://github.com/${social.github}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>{' '}
            &bull;{' '}
            <a
              href={`https://linkedin.com/in/${social.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>{' '}
            &bull;{' '}
            <a href="/rss.xml" target="_blank" rel="noopener noreferrer">
              RSS
            </a>
          </footer>
        );
      }}
    />
  );
}

const footerQuery = graphql`
  query FooterQuery {
    site {
      siteMetadata {
        social {
          twitter
          github
          linkedin
        }
      }
    }
  }
`;

export default Footer;
