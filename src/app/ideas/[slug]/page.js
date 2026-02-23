import { getPostBySlug, getPostsByType } from '../../../lib/content'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const posts = getPostsByType('ideas')
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug('ideas', params.slug)
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }
  return {
    title: `${post.frontmatter.title} - stablevegeta`,
    description: post.frontmatter.summary,
  }
}

export default async function IdeaPost({ params }) {
  const post = await getPostBySlug('ideas', params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          {post.frontmatter.title}
        </h1>
        {post.frontmatter.date && (
          <p className="text-zinc-500">{post.frontmatter.date}</p>
        )}
        {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm bg-zinc-800 text-zinc-300 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div
        className="prose prose-invert prose-zinc max-w-none"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  )
}
