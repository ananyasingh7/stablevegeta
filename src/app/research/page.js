import { getPostsByType } from '../../lib/content'
import Link from 'next/link'

export const metadata = {
  title: 'Research - stablevegeta',
  description: 'Research papers and publications',
}

export default function ResearchPage() {
  const posts = getPostsByType('research')

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold font-mono mb-12">Research &amp; Publications</h1>

      {posts.length === 0 ? (
        <p className="text-zinc-500">No research posts yet.</p>
      ) : (
        <div>
          {posts.map((post, i) => (
            <div key={post.slug}>
              <Link href={`/research/${post.slug}`} className="block py-5 hover:opacity-80 transition-opacity">
                <div className="flex items-start justify-between gap-8">
                  <h3 className="text-white font-medium text-sm">{post.title}</h3>
                  <span className="text-zinc-500 text-sm shrink-0">{post.date}</span>
                </div>
                <p className="text-zinc-400 text-sm mt-2 leading-relaxed">{post.summary}</p>
              </Link>
              {i < posts.length - 1 && <div className="border-b border-zinc-800" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
