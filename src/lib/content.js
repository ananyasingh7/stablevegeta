import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const contentDirectory = path.join(process.cwd(), 'content')

export function getPostsByType(type) {
  const typeDirectory = path.join(contentDirectory, type)

  // Check if directory exists
  if (!fs.existsSync(typeDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(typeDirectory)
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(typeDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        summary: data.summary || '',
        tags: data.tags || [],
      }
    })

  // Sort by date (most recent first)
  return posts.sort((a, b) => {
    if (a.date < b.date) return 1
    if (a.date > b.date) return -1
    return 0
  })
}

export async function getPostBySlug(type, slug) {
  const fullPath = path.join(contentDirectory, type, `${slug}.md`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  // Convert markdown to HTML
  const processedContent = await remark().use(html).process(content)
  const contentHtml = processedContent.toString()

  return {
    slug,
    frontmatter: {
      title: data.title || slug,
      date: data.date || '',
      summary: data.summary || '',
      tags: data.tags || [],
    },
    contentHtml,
  }
}
