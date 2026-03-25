import { Link } from 'react-router-dom';

function categoryEmoji(category) {
  const map = {
    'AI & ML': '🤖',
    IoT: '📡',
    Robotics: '🦾',
    Startups: '🚀',
    Research: '🧪',
    General: '💡'
  };
  return map[category] || '💡';
}

export default function BlogCard({ post }) {
  const date = post?.published_at ? new Date(post.published_at).toLocaleDateString('en-IN') : 'Draft';

  return (
    <article className="card-shell overflow-hidden">
      <div className="h-48 overflow-hidden rounded-t-2xl">
        {post.cover_image ? (
          <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-cyan/10 to-slate-200 text-5xl">
            {categoryEmoji(post.category)}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span className="chip border-cyan/30 bg-cyan/8 text-cyan">{post.category || 'General'}</span>
          <span>{date}</span>
        </div>
        <h3 className="line-clamp-2 font-head text-xl font-extrabold text-slate-800">{post.title}</h3>
        <p className="mt-2 line-clamp-3 text-slate-600">{post.excerpt}</p>
        <Link to={`/blog/${post.slug}`} className="mt-4 inline-block text-sm font-semibold uppercase tracking-wide text-cyan hover:text-cyan/80">
          Read More →
        </Link>
      </div>
    </article>
  );
}
