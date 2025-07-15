import { notFound } from 'next/navigation'
import { client, urlForImage } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

// Fetch blog post by slug
async function getBlogPost(slug: string) {
  const query = `*[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
    publishedAt,
    author->{name, image, bio},
    categories[]->{title, description},
    featuredImage,
    tags,
    "readTime": "5 min read"
  }`
  
  return await client.fetch(query, { slug })
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const query = `*[_type == "blogPost" && defined(slug.current)] {
    "slug": slug.current
  }`
  
  const posts = await client.fetch(query)
  
  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div>
      {/* Back to News */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link 
          href="/news" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to News
        </Link>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
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
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-6">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8">
            <Image
              src={urlForImage(post.featuredImage).url()}
              alt={post.title}
              width={1200}
              height={600}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}

        {/* Author Info */}
        {post.author && (
          <div className="flex items-center gap-4 mb-8 p-6 bg-muted/50 rounded-lg">
            {post.author.image && (
              <Image
                src={urlForImage(post.author.image).url()}
                alt={post.author.name}
                width={60}
                height={60}
                className="rounded-full"
              />
            )}
            <div>
              <h3 className="font-semibold text-foreground">{post.author.name}</h3>
              {post.author.bio && (
                <p className="text-muted-foreground text-sm">{post.author.bio}</p>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg prose-foreground max-w-none">
          {post.content && <PortableText value={post.content} />}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
} 