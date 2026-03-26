import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import PageLayout from '../components/PageLayout';
import Loader from '../components/Loader';
import { generateBlogPostingSchema } from '../utils/schema';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const fallbackDescription = 'Read detailed innovation insights and updates from Vidya Innovation Club.';
  const postDescription =
    (post?.excerpt || post?.content || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 160) || fallbackDescription;
  const blogSchema = post ? generateBlogPostingSchema(post, slug) : null;

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/blog/' + slug);
        setPost(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  return (
    <PageLayout
      title={post?.title || 'Blog'}
      description={postDescription}
      canonicalPath={slug ? `/blog/${slug}` : '/blog'}
      schemaData={blogSchema}
    >
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        {loading ? <Loader text="Loading post..." /> : null}
        {!loading && !post ? <div className="border border-slate-300 bg-white py-20 text-center text-slate-600">Post not found</div> : null}

        {!loading && post ? (
          <article className="border border-slate-300 bg-white p-6 md:p-8">
            <img src={post.cover_image} alt={post.title} className="mb-8 h-72 w-full border border-slate-200 object-cover md:h-[420px]" />
            <div className="mb-3 text-sm text-slate-600">
              <span className="text-cyan">{post.category || 'General'}</span> • {new Date(post.published_at || post.created_at).toLocaleDateString('en-IN')} • {post.author_name || 'Team VIC Club'}
            </div>
            <h1 className="font-head text-4xl font-extrabold text-slate-800">{post.title}</h1>
            <div className="prose mt-8 max-w-none prose-headings:font-head prose-a:text-cyan" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
            <Link to="/blog" className="mt-10 inline-block text-sm font-semibold uppercase tracking-wide text-cyan hover:text-cyan/80">← Back to Blog</Link>
          </article>
        ) : null}
      </section>
    </PageLayout>
  );
}
