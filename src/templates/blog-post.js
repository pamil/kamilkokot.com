import React from 'react';
import { Link, graphql } from 'gatsby';
import { DiscussionEmbed } from 'disqus-react';

import Bio from '../components/Bio';
import BlogPostMetadata from '../components/BlogPostMetadata';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import Signup from '../components/Signup';
import { rhythm } from '../utils/typography';

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark;
    const siteTitle = this.props.data.site.siteMetadata.title;
    const disqusShortname = this.props.data.site.siteMetadata.disqusShortname;
    const disqusConfig = {
      identifier: post.id,
      title: post.frontmatter.title,
    };
    const { previous, next } = this.props.pageContext;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.spoiler}
        />
        <h1>{post.frontmatter.title}</h1>
        <p
          style={{
            display: `block`,
            marginBottom: rhythm(1),
            marginTop: rhythm(-1),
          }}
        >
          <BlogPostMetadata
            date={post.frontmatter.date}
            timeToRead={post.timeToRead}
            identifier={post.id}
            slug={this.props.pageContext.slug}
          />
        </p>
        <div
          dangerouslySetInnerHTML={{ __html: post.html }}
          style={{
            marginBottom: rhythm(1.5),
          }}
        />

        <div style={{ marginBottom: rhythm(1.5) }}>
          <Signup source={this.props.location.pathname} />
        </div>

        <Bio />

        <nav>
          <ul
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              listStyle: 'none',
              padding: 0,
            }}
          >
            <li>
              {previous && (
                <Link
                  to={previous.fields.slug}
                  rel="prev"
                  style={{ marginRight: 20 }}
                >
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li>
          </ul>
        </nav>

        <div
          dangerouslySetInnerHTML={{ __html: post.frontmatter.tweet }}
          style={{ marginBottom: rhythm(1.5) }}
        />

        <p>
          <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
        </p>
      </Layout>
    );
  }
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        disqusShortname
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      timeToRead
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        spoiler
        tweet
      }
    }
  }
`;
