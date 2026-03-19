export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

async function getFeaturedArticles() {
  return await prisma.article.findMany({
    where: {
      published: true,
      featured: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: 1,
  })
}

async function getLatestArticles(category?: string) {
  return await prisma.article.findMany({
    where: {
      published: true,
      ...(category && { category }),
    },
    orderBy: { publishedAt: 'desc' },
    take: 9,
    include: {
      author: true,
    },
  })
}

async function getNewsletterCount() {
  return await prisma.newsletterSubscriber.count({
    where: { active: true },
  })
}

export default async function HomePage() {
  const [featured, articles, newsletterCount] = await Promise.all([
    getFeaturedArticles(),
    getLatestArticles(),
    getNewsletterCount(),
  ])

  const featuredArticle = featured[0]

  return (
    <div className="min-h-screen bg-jersey-white">
      {/* Hero Section with Featured Story */}
      {featuredArticle ? (
        <section className="bg-gradient-to-r from-jersey-navy to-jersey-navy/80 text-white py-12 md:py-20">
          <div className="container-wide">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {featuredArticle.imageUrl && (
                <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
                  <Image
                    src={featuredArticle.imageUrl}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <span className="inline-block bg-jersey-gold text-jersey-navy px-3 py-1 rounded-full text-sm font-bold mb-4">
                  FEATURED STORY
                </span>
                <h1 className="font-playfair text-3xl md:text-5xl font-bold mb-4 text-white">
                  {featuredArticle.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-100 mb-6 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                <Link
                  href={`/news/${featuredArticle.slug}`}
                  className="btn btn-secondary inline-flex"
                >
                  Read Full Story →
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-gradient-to-r from-jersey-navy to-jersey-navy/80 text-white py-12 md:py-20">
          <div className="container-wide text-center">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
              Hudson County's Voice Since 1867
            </h2>
            <p className="text-lg md:text-xl text-gray-100">
              Breaking news, legal notices, and in-depth community coverage
            </p>
          </div>
        </section>
      )}

      {/* Main Content Grid */}
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column - Articles */}
          <div className="lg:col-span-2">
            <h2 className="font-playfair text-3xl font-bold text-jersey-navy mb-8 pb-4 border-b-4 border-jersey-gold">
              Latest News
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="card bg-white border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  {article.imageUrl && (
                    <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-jersey-gold uppercase">
                      {article.category}
                    </span>
                    {article.featured && (
                      <span className="text-xs font-bold text-jersey-navy bg-jersey-gold px-2 py-1 rounded">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-jersey-navy mb-3 line-clamp-2 hover:text-jersey-gold transition-colors">
                    <Link href={`/news/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{article.author?.name || 'The Jersey Journal'}</span>
                    <span>
                      {article.publishedAt?.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link href="/news" className="btn btn-outline">
                View All News →
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-8">
            {/* Newsletter Signup */}
            <div className="card bg-gradient-to-br from-jersey-navy to-jersey-navy/90 text-white border-0">
              <h3 className="font-playfair text-2xl font-bold mb-4 text-jersey-gold">
                Stay Informed
              </h3>
              <p className="text-sm mb-4">
                Get the latest Hudson County news delivered to your inbox daily.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-jersey-gold"
                  required
                />
                <button
                  type="submit"
                  className="btn btn-secondary w-full"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs mt-3 text-gray-200">
                {newsletterCount.toLocaleString()} subscribers
              </p>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-playfair text-xl font-bold text-jersey-navy mb-4 pb-3 border-b-4 border-jersey-gold">
                Services
              </h3>
              <div className="space-y-3">
                <Link
                  href="/legal-notices"
                  className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-jersey-gold hover:bg-gray-50 transition-all"
                >
                  <h4 className="font-bold text-jersey-navy mb-1">Legal Notices</h4>
                  <p className="text-xs text-gray-600">Publish notices from $149</p>
                </Link>
                <Link
                  href="/obituaries"
                  className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-jersey-gold hover:bg-gray-50 transition-all"
                >
                  <h4 className="font-bold text-jersey-navy mb-1">Obituaries</h4>
                  <p className="text-xs text-gray-600">Honor your loved ones</p>
                </Link>
                <Link
                  href="/youve-been-selected"
                  className="block p-4 bg-gradient-to-br from-jersey-gold to-amber-500 rounded-lg hover:shadow-lg transition-all"
                >
                  <h4 className="font-bold text-jersey-navy mb-1">You've Been Selected</h4>
                  <p className="text-xs text-jersey-navy">Premium feature - $997</p>
                </Link>
                <Link
                  href="/edition"
                  className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-jersey-gold hover:bg-gray-50 transition-all"
                >
                  <h4 className="font-bold text-jersey-navy mb-1">Digital Edition</h4>
                  <p className="text-xs text-gray-600">$9.99/month</p>
                </Link>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-jersey-gray p-6 rounded-lg border border-gray-300">
              <h4 className="font-bold text-jersey-navy mb-4 text-center">NJ Qualified</h4>
              <div className="space-y-3 text-xs text-center text-gray-600">
                <p>✓ State Registered</p>
                <p>✓ Legally Compliant</p>
                <p>✓ Court Approved</p>
                <p>✓ Publishing Since 1867</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Call to Action */}
      <section className="bg-jersey-navy text-white py-12 md:py-16">
        <div className="container-narrow text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
            Support Local Journalism
          </h2>
          <p className="text-lg mb-8">
            The Jersey Journal has been reporting on Hudson County for over 150 years.
            Subscribe to our digital edition to support quality local news.
          </p>
          <Link href="/edition" className="btn btn-secondary inline-block">
            Subscribe Now
          </Link>
        </div>
      </section>
    </div>
  )
}
