import PageHeader from '@/components/PageHeader'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Calendar, Clock, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/lib/sanity'
import { urlForImage } from '@/lib/sanity'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// TypeScript interfaces for Sanity data
interface Category {
  _id: string
  title: string
  description: string
  count: number
}

interface Author {
  name: string
}

interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  publishedAt: string
  author?: Author
  categories?: Category[]
  featuredImage?: SanityImageSource
  readTime: string
}

// Fetch blog posts from Sanity
async function getBlogPosts(): Promise<BlogPost[]> {
  const query = `*[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    author->{name},
    categories[]->{title},
    featuredImage,
    "readTime": "5 min read"
  }`
  
  return await client.fetch(query)
}

// Fetch categories from Sanity
async function getCategories(): Promise<Category[]> {
  const query = `*[_type == "category"] {
    _id,
    title,
    description,
    "count": count(*[_type == "blogPost" && references(^._id)])
  }`
  
  return await client.fetch(query)
}

export default async function NewsPage() {
  const [blogPosts, categories] = await Promise.all([
    getBlogPosts(),
    getCategories()
  ])

  const featuredPost = blogPosts[0]
  const recentPosts = blogPosts.slice(1, 7)

  return (
    <div>
      <PageHeader 
        title="News"
        subtitle="Stay up to date with the latest updates, announcements, and industry news."
        showButtons={false}
      />

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-12">
            {/* Sticky Left Sidebar for Categories */}
            <aside className="w-64 flex-shrink-0">
              <div className="sticky top-24">
                <h2 className="text-xl font-semibold mb-6 text-foreground">Browse by Category</h2>
                <div className="space-y-4">
                  {categories.length > 0 ? (
                    categories.map((category: Category) => (
                      <div key={category._id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <h3 className="font-semibold text-foreground mb-1">{category.title}</h3>
                        <p className="text-muted-foreground text-sm mb-2">{category.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{category.count} articles</span>
                          <Link href={`/news?category=${category.title.toLowerCase().replace(' ', '-')}`} className="text-primary hover:text-primary/80">
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 border border-border rounded-lg">
                      <p className="text-muted-foreground text-sm">No categories available</p>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              <div className="prose prose-foreground max-w-none">
                {featuredPost && (
                  <div className="mb-12 pb-8 border-b border-border">
                    {/* Featured Blog Post */}
                    <Link href={`/news/${featuredPost.slug.current}`} className="block">
                      <div className="aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity">
                        {featuredPost.featuredImage ? (
                          <Image 
                            src={urlForImage(featuredPost.featuredImage).url()} 
                            alt={featuredPost.title} 
                            width={800} 
                            height={450} 
                            className="object-cover w-full h-full" 
                          />
                        ) : (
                          <Image src="/blog-banner-default.jpg" alt="Blog Banner" width={800} height={450} className="object-cover w-full h-full" />
                        )}
                      </div>
                    </Link>
                    <h3 className="text-xl font-semibold mb-4 text-foreground">
                      {featuredPost.title}
                    </h3>
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      {featuredPost.categories && featuredPost.categories.length > 0 && (
                        <Link href={`/news?category=${featuredPost.categories[0].title.toLowerCase().replace(' ', '-')}`}>
                          <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
                            {featuredPost.categories[0].title}
                          </Badge>
                        </Link>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(featuredPost.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {featuredPost.readTime}
                      </span>
                      {featuredPost.author && (
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {featuredPost.author.name}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-6">
                      {featuredPost.excerpt}
                    </p>
                    <Link href={`/news/${featuredPost.slug.current}`} className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
                      Read Article
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </div>
                )}

                <h2 className="text-2xl font-semibold mb-8 text-foreground">Recent Articles</h2>
                <div className="space-y-8">
                  {recentPosts.length > 0 ? (
                    recentPosts.map((post: BlogPost) => (
                      <article key={post._id} className="pb-8 border-b border-border last:border-b-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Article Image */}
                          <Link href={`/news/${post.slug.current}`} className="block">
                            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity">
                              {post.featuredImage ? (
                                <Image 
                                  src={urlForImage(post.featuredImage).url()} 
                                  alt={post.title} 
                                  width={800} 
                                  height={450} 
                                  className="object-cover w-full h-full" 
                                />
                              ) : (
                                <Image src="/blog-banner-default.jpg" alt="Article Banner" width={800} height={450} className="object-cover w-full h-full" />
                              )}
                            </div>
                          </Link>
                          {/* Article Content */}
                          <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold mb-3 text-foreground">{post.title}</h3>
                            <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                              {post.categories && post.categories.length > 0 && (
                                <Link href={`/news?category=${post.categories[0].title.toLowerCase().replace(' ', '-')}`}> 
                                  <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
                                    {post.categories[0].title}
                                  </Badge>
                                </Link>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(post.publishedAt).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {post.readTime}
                              </span>
                              {post.author && (
                                <span className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {post.author.name}
                                </span>
                              )}
                            </div>
                            <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                            <Link href={`/news/${post.slug.current}`} className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
                              Read Article
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No blog posts available yet.</p>
                      <p className="text-sm text-muted-foreground mt-2">Create your first blog post in the Sanity Studio.</p>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </section>
    </div>
  )
} 