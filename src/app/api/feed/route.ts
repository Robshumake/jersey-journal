import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateRSSFeed, generateNewsXML } from '@/lib/rss'

export async function GET(req: NextRequest) {
  try {
    const articles = await prisma.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 50,
      include: { author: true },
    })

    const feedItems = articles.map((article) => ({
      title: article.title,
      description: article.excerpt,
      url: `https://thejerseyjournal.news/news/${article.slug}`,
      guid: `https://thejerseyjournal.news/news/${article.slug}`,
      date: article.publishedAt || new Date(),
      author: article.author?.name,
      categories: [article.category],
      imageUrl: article.imageUrl ?? undefined,
    }))

    const rssXml = generateNewsXML({
      title: 'The Jersey Journal - Latest News',
      link: 'https://thejerseyjournal.news',
      items: feedItems,
    })

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Feed generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate feed' },
      { status: 500 }
    )
  }
}
