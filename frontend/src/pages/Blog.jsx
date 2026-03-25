import { useMemo, useState } from 'react';
import PageLayout from '../components/PageLayout';
import SectionTag from '../components/SectionTag';
import BlogCard from '../components/BlogCard';
import Loader from '../components/Loader';
import { useBlog } from '../hooks/useData';

export default function Blog() {
  const { data: posts, loading } = useBlog(12);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => ['All', ...new Set(posts.map((p) => p.category).filter(Boolean))], [posts]);

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [posts, activeCategory]);

  return (
    <PageLayout title="Blog">
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <SectionTag
          tag="Blog"
          title={<>Latest <span className="text-cyan">Articles</span></>}
          subtitle="Stories, insights, and updates from the Vidya Innovation Club."
        />

        <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-300 pb-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-1 text-sm font-semibold uppercase tracking-wide ${activeCategory === category ? 'border-b-2 border-cyan text-cyan' : 'text-slate-600'}`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? <Loader text="Loading blog posts..." /> : null}

        {!loading && !filtered.length ? <div className="border border-slate-300 bg-white py-14 text-center text-slate-600">📰 No posts found</div> : null}

        {!loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : null}
      </section>
    </PageLayout>
  );
}
