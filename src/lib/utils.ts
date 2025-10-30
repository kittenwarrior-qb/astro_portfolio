import type { CollectionEntry } from 'astro:content'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes))
}

export function postsSort(posts: CollectionEntry<'posts'>[]) {
  return posts.slice().sort((a, b) => {
    const dateA = a.data.updatedDate ?? a.data.pubDate
    const dateB = b.data.updatedDate ?? b.data.pubDate
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  })
}

export type DateFormat = 'default' | 'dot' | 'short' | 'iso'

export const formatDate = (date: Date, format: DateFormat = 'default'): string => {
  switch (format) {
    case 'dot':
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}.${month}.${day}`

    case 'short':
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })

    case 'iso':
      return date.toISOString().split('T')[0]

    case 'default':
    default:
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
  }
}
