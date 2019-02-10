import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

function Footer() {
  return (
    <StaticQuery
      query={footerQuery}
      render={data => {
        const { email, social, githubRepository } = data.site.siteMetadata;
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
            <a
              href={`mailto:${email}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Email
            </a>{' '}
            &bull;{' '}
            <a
              href={`https://github.com/${githubRepository}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Source code
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
        email
        githubRepository
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
