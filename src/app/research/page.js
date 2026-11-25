import { getPostsByType } from '../../lib/content'
import Link from 'next/link'
import { FaExternalLinkAlt } from 'react-icons/fa'

export const metadata = {
  title: 'Research - stablevegeta',
  description: 'Research papers and publications',
}

export default function ResearchPage() {
  const posts = getPostsByType('research')

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-6 py-14">
        <h1 className="text-4xl font-bold mb-12">Research</h1>

        {posts.length === 0 ? (
          <p className="text-zinc-500 text-lg">No research posts yet.</p>
        ) : (
          <div>
            {posts.map((post, i) => (
              <div key={post.slug}>
                <Link href={`/research/${post.slug}`} className="block py-6 hover:opacity-80 transition-opacity">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                    <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                      {post.title}
                    </h3>
                    <span className="text-zinc-500 text-base shrink-0">{post.date}</span>
                  </div>
                  <p className="text-zinc-400 text-lg mt-2 leading-8">{post.summary}</p>
                </Link>
                {i < posts.length - 1 && <div className="border-b border-zinc-800" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
