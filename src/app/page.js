import Link from 'next/link'
import { FaTwitter } from 'react-icons/fa'
import { getPostsByType } from '../lib/content'
import PostCard from '../components/PostCard'

export default function Home() {
  const blogs = getPostsByType('blog').slice(0, 3)
  const research = getPostsByType('research').slice(0, 3)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="mb-20">
        <h1 className="text-5xl font-bold text-white mb-4">Ananya Singh</h1>
        <p className="text-xl text-zinc-400 mb-6">
          Developer, researcher, and builder exploring AI, trading systems, and prediction markets.
        </p>
        <div className="flex items-center space-x-4">
          <a
            href="https://x.com/TheStableVegeta"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-zinc-300 hover:text-white transition-colors"
          >
            <FaTwitter size={20} />
            <span>@TheStableVegeta</span>
          </a>
        </div>
      </div>

      {/* Latest Blog Posts */}
      {blogs.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Latest Posts</h2>
            <Link
              href="/blog"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-1">
            {blogs.map((post) => (
              <PostCard key={post.slug} post={post} type="blog" />
            ))}
          </div>
        </section>
      )}

      {/* Latest Research */}
      {research.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Research</h2>
            <Link
              href="/research"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-1">
            {research.map((post) => (
              <PostCard key={post.slug} post={post} type="research" />
            ))}
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold text-white mb-4">
          Explore My Work
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/projects"
            className="px-6 py-3 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors font-medium"
          >
            View Projects
          </Link>
          <Link
            href="/blog"
            className="px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors font-medium"
          >
            Read Blog
          </Link>
        </div>
      </section>
    </div>
  )
}
