import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'

async function getArticles(category?: string, page: number = 1) {
  const pageSize = 12
  const skip = (page - 1) * pageSize

  const articles = await prisma.article.findMany({
    where: {
      published: true,
      ...(category && { category }),
    },
    orderBy: { publishedAt: 'desc' },
    skip,
    take: pageSize,
    include: { author: true },
  })

  const total = await prisma.article.count({
    where: {
      published: true,
      ...(category && { category }),
    },
  })

  return { articles, total, pageSize }
}

const categories = [
  { id: 'all', label: 'All News' },
  { id: 'news', label: 'News' },
  { id: 'legal-notices', label: 'Legal Notices' },
  { id: 'obituaries', label: 'Obituaries' },
  { id: 'features', label: 'Features' },
]

export default async function NewsPage({
  searchParams,
}: {
  searchParams: { category?: string; page?: string }
}) {
  const category = searchParams.category === 'all' ? undefined : searchParams.category
  const page = parseInt(searchParams.page || '1')
  const { articles, total, pageSize } = await getArticles(category, page)
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="min-h-screen bg-jersey-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-jersey-navy to-jersey-navy/80 text-white py-12 md:py-16">
        <div className="container-wide text-center">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
            Hudson County News
          </h1>
          <p className="text-lg md:text-xl text-gray-100">
            Breaking news and updates from our community
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-jersey-gray border-b-2 border-jersey-gold py-6 sticky top-0 z-40">
        <div className="container-wide">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/news?category=${cat.id}`}
                className={`px-6 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
                  (!category && cat.id === 'all') || category === cat.id
                    ? 'bg-jersey-navy text-white'
                    : 'bg-white text-jersey-navy border-2 border-jersey-navy hover:bg-jersey-navy hover:text-white'
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="container-wide py-12 md:py-16">
        {articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="card bg-white border border-gray-200 hover:shadow-lg transition-all overflow-hidden flex flex-col"
                >
                  {article.imageUrl && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col p-6">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold text-white bg-jersey-navy px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                      {article.featured && (
                        <span className="text-sm">⭐ Featured</span>
                      )}
                    </div>
                    <h3 className="font-playfair text-lg font-bold text-jersey-navy mb-3 hover:text-jersey-gold transition-colors line-clamp-2">
                      <Link href={`/news/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-200">
                      <span>{article.author?.name || 'The Jersey Journal'}</span>
                      <span>
                        {article.publishedAt?.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                {page > 1 && (
                  <Link
                    href={`/news?category=${category || 'all'}&page=${page - 1}`}
                    className="btn btn-outline"
                  >
                    ← Previous
                  </Link>
                )}
                <span className="text-sm font-semibold text-jersey-navy">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/news?category=${category || 'all'}&page=${page + 1}`}
                    className="btn btn-outline"
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">
              No articles found in this category.
            </p>
            <Link href="/news" className="btn btn-primary">
              View All News
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
