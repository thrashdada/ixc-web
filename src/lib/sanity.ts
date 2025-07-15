import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production',
})

// Helper function to get hero data
export async function getHeroData() {
  return await client.fetch(`*[_type == "hero"][0]`)
}

// Helper function to get services
export async function getServices() {
  return await client.fetch(`*[_type == "service"] | order(order asc)`)
}

// Helper function to get testimonials
export async function getTestimonials() {
  return await client.fetch(`*[_type == "testimonial"] | order(_createdAt desc)`)
}

// Helper function to get blog posts
export async function getBlogPosts() {
  return await client.fetch(`*[_type == "blogPost"] | order(publishedAt desc)`)
}

// Helper function to get a single page
export async function getPage(slug: string) {
  return await client.fetch(`*[_type == "page" && slug.current == $slug][0]`, { slug })
}

// Helper function to get a single blog post
export async function getBlogPost(slug: string) {
  return await client.fetch(`*[_type == "blogPost" && slug.current == $slug][0]`, { slug })
}

// Image URL builder for Sanity images
const builder = imageUrlBuilder(client)

export function urlForImage(source: SanityImageSource) {
  return builder.image(source)
} 