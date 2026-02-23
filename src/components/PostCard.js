import Link from 'next/link'

export default function PostCard({ post, type }) {
  return (
    <Link href={`/${type}/${post.slug}`}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors cursor-pointer">
        <h3 className="text-xl font-semibold text-white mb-2">{post.title}</h3>
        {post.date && (
          <p className="text-sm text-zinc-500 mb-3">{post.date}</p>
        )}
        {post.summary && (
          <p className="text-zinc-400 text-sm line-clamp-3">{post.summary}</p>
        )}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-zinc-800 text-zinc-300 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
