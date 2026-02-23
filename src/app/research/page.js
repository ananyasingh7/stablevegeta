import { getPostsByType } from '../../lib/content'
import PostCard from '../../components/PostCard'

export const metadata = {
  title: 'Research - stablevegeta',
  description: 'Research papers and publications',
}

export default function ResearchPage() {
  const posts = getPostsByType('research')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Research</h1>
        <p className="text-xl text-zinc-400">
          Papers, publications, and research findings
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-zinc-500">No research posts yet. Check back soon!</p>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} type="research" />
          ))}
        </div>
      )}
    </div>
  )
}
