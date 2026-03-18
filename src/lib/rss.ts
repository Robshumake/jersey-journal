import RSS from 'rss';

export interface FeedItem {
  title: string;
  description: string;
  url: string;
  guid: string;
  date: Date;
  author?: string;
  categories?: string[];
}

export function generateRSSFeed(params: {
  title: string;
  description: string;
  link: string;
  language?: string;
  items: FeedItem[];
}): string {
  const feed = new RSS({
    title: params.title,
    description: params.description,
    feed_url: `${params.link}/feed.xml`,
    site_url: params.link,
    language: params.language || 'en',
    pubDate: new Date(),
    copyright: `${new Date().getFullYear()} The Jersey Journal`,
    managingEditor: 'publisher@thejerseyjournal.news',
    webMaster: 'publisher@thejerseyjournal.news',
    ttl: 60, // Cache for 60 minutes
  });

  params.items.forEach((item) => {
    feed.item({
      title: item.title,
      description: item.description,
      url: item.url,
      guid: item.guid,
      date: item.date,
      author: item.author || 'The Jersey Journal',
      categories: item.categories || [],
    });
  });

  return feed.xml();
}

export interface NewsArticleItem extends FeedItem {
  imageUrl?: string;
  author?: string;
}

export function generateNewsXML(params: {
  title: string;
  link: string;
  items: NewsArticleItem[];
}): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:news="http://news.google.com/news" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(params.title)}</title>
    <link>${params.link}</link>
    <description>News from The Jersey Journal</description>
    <language>en</language>
    <atom:link href="${params.link}/feed.xml" rel="self" type="application/rss+xml" />`;

  params.items.forEach((item) => {
    xml += `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.url}</link>
      <guid>${item.guid}</guid>
      <pubDate>${item.date.toUTCString()}</pubDate>
      <description>${escapeXml(item.description)}</description>
      ${item.author ? `<author>${escapeXml(item.author)}</author>` : ''}
      ${item.imageUrl ? `<image><url>${escapeXml(item.imageUrl)}</url></image>` : ''}
      <news:news>
        <news:publication>
          <news:name>The Jersey Journal</news:name>
          <news:language>en</news:language>
        </news:publication>
        <news:publication_date>${item.date.toISOString()}</news:publication_date>
        <news:title>${escapeXml(item.title)}</news:title>
        ${item.categories?.map(cat => `<news:keywords>${escapeXml(cat)}</news:keywords>`).join('')}
      </news:news>
    </item>`;
  });

  xml += `
  </channel>
</rss>`;

  return xml;
}

function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateSitemap(params: {
  urls: Array<{
    url: string;
    lastmod?: Date;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
  }>;
}): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`;

  params.urls.forEach((item) => {
    xml += `
  <url>
    <loc>${escapeXml(item.url)}</loc>
    ${item.lastmod ? `<lastmod>${item.lastmod.toISOString().split('T')[0]}</lastmod>` : ''}
    ${item.changefreq ? `<changefreq>${item.changefreq}</changefreq>` : ''}
    ${item.priority ? `<priority>${item.priority}</priority>` : ''}
  </url>`;
  });

  xml += `
</urlset>`;

  return xml;
}
