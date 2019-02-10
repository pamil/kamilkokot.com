import React from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';

import { rhythm } from '../utils/typography';

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author } = data.site.siteMetadata;
        return (
          <div
            style={{
              display: `flex`,
            }}
          >
            <Image
              fixed={data.avatar.childImageSharp.fixed}
              alt={author}
              style={{
                marginRight: rhythm(1 / 2),
                marginTop: rhythm(1 / 4),
                marginBottom: 0,
                minWidth: 50,
                borderRadius: `100%`,
              }}
              imgStyle={{
                borderRadius: `50%`,
              }}
            />
            <p style={{ paddingRight: rhythm(2) }}>
              I'm{' '}
              <Link
                to="contact"
                style={{
                  textDecoration: 'none',
                  boxShadow: 'none',
                  color: '#002b57',
                }}
              >
                <strong>{author}</strong>
              </Link>
              . My goal is to make software testing as effortless as possible so
              that you can develop with confidence. I&nbsp;work on{' '}
              <a href="https://app.holaspirit.com/public/sylius/member/k5Ohs7-kamil-kokot/governance">
                Sylius
              </a>{' '}
              and <a href="https://github.com/FriendsOfBehat">FriendsOfBehat</a>
              .
            </p>
          </div>
        );
      }}
    />
  );
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
      }
    }
  }
`;

export default Bio;
