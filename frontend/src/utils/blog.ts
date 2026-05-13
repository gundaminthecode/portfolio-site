// src/utils/blog.ts
import matter from 'gray-matter'

type Post = {
  date: string
  published: boolean
  content: string
  [key: string]: unknown
}

const files = import.meta.glob('../content/blog/*.md', { eager: true, query: '?raw', import: 'default' })

export function getAllPosts(): Post[] {
  return Object.entries(files)
    .map(([, raw]) => {
      const { data, content } = matter(raw as string)
      return { ...data, content } as Post
    })
    .filter(post => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post | null {
  const file = files[`../content/blog/${slug}.md`]
  if (!file) return null
  const { data, content } = matter(file as string)
  return { ...data, content } as Post
}