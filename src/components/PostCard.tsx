import Link from 'next/link';

interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  uploaded?: boolean;
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/study/${post.slug}`} className="post-card">
      <div className="post-card-header">
        <span className="post-card-date">{post.date}</span>
      </div>
      <h2 className="post-card-title">{post.title}</h2>
      {post.summary && <p className="post-card-summary">{post.summary}</p>}
      {post.tags.length > 0 && (
        <div className="post-card-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="post-card-tag">{tag}</span>
          ))}
        </div>
      )}
    </Link>
  );
}
