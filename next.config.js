/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'thejerseyjournal.news',
      'localhost',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.thejerseyjournal.news',
      },
    ],
  },
  headers: async () => {
    return [
      {
        source: '/feed.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/rss+xml',
          },
        ],
      },
      {
        source: '/feed/:category.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/rss+xml',
          },
        ],
      },
      {
        source: '/news-sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
        ],
      },
    ];
  },
  redirects: async () => {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
