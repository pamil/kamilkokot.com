import React from 'react';
import { Link, graphql } from 'gatsby';
import { DiscussionEmbed } from 'disqus-react';

import Bio from '../components/Bio';
import BlogPostMetadata from '../components/BlogPostMetadata';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
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
        <SEO title={post.frontmatter.title} description={post.excerpt} />
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
            disqusShortname={disqusShortname}
            identifier={post.id}
            editUrl={`https://github.com/pamil/kamilkokot.com/edit/master/content/blog${
              this.props.pageContext.slug
            }index.md`}
          />
        </p>
        <div
          dangerouslySetInnerHTML={{ __html: post.html }}
          style={{
            marginBottom: rhythm(1.5),
          }}
        />
        <Bio />

        {/*<nav>*/}
        {/*<ul*/}
        {/*style={{*/}
        {/*display: `flex`,*/}
        {/*flexWrap: `wrap`,*/}
        {/*justifyContent: `space-between`,*/}
        {/*listStyle: `none`,*/}
        {/*padding: 0,*/}
        {/*margin: 0,*/}
        {/*}}*/}
        {/*>*/}
        {/*<li>*/}
        {/*{previous && (*/}
        {/*<Link to={previous.fields.slug} rel="prev">*/}
        {/*← {previous.frontmatter.title}*/}
        {/*</Link>*/}
        {/*)}*/}
        {/*</li>*/}
        {/*<li>*/}
        {/*{next && (*/}
        {/*<Link to={next.fields.slug} rel="next">*/}
        {/*{next.frontmatter.title} →*/}
        {/*</Link>*/}
        {/*)}*/}
        {/*</li>*/}
        {/*</ul>*/}
        {/*</nav>*/}
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
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`;
