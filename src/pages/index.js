import React from 'react';
import { Link, graphql } from 'gatsby';

import Bio from '../components/Bio';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import BlogPostMetadata from '../components/BlogPostMetadata';
import { rhythm } from '../utils/typography';
import Signup from '../components/Signup';

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title;
    const disqusShortname = data.site.siteMetadata.disqusShortname;
    const posts = data.allMarkdownRemark.edges;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="" keywords={[`testing`, `php`, `symfony`, `tdd`, `bdd`]} />
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug;
          return (
            <div key={node.fields.slug}>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link
                  className="Link-article"
                  style={{ boxShadow: `none` }}
                  to={node.fields.slug}
                >
                  {title}
                </Link>
              </h3>
              <BlogPostMetadata
                date={node.frontmatter.date}
                timeToRead={node.timeToRead}
                identifier={node.id}
              />
              <p
                dangerouslySetInnerHTML={{ __html: node.frontmatter.spoiler }}
              />
            </div>
          );
        })}
        <div
          style={{
            marginBottom: rhythm(1),
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Signup source={this.props.location.pathname} />
        </div>
        <Bio />
      </Layout>
    );
  }
}

export default BlogIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        disqusShortname
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          id
          timeToRead
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            spoiler
          }
        }
      }
    }
  }
`;
