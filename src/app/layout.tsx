import type { Metadata } from 'next'
import './globals.css'
import { Playfair_Display, Source_Sans_3 } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SessionProvider } from 'next-auth/react'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'The Jersey Journal | Hudson County\'s Voice Since 1867',
  description: 'Breaking news, legal notices, obituaries, and in-depth coverage of Hudson County, New Jersey.',
  keywords: 'news, Hudson County, New Jersey, legal notices, obituaries, Jersey City, Hoboken',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://thejerseyjournal.news',
    siteName: 'The Jersey Journal',
    title: 'The Jersey Journal | Hudson County\'s Voice Since 1867',
    description: 'Breaking news, legal notices, obituaries, and in-depth coverage of Hudson County, New Jersey.',
    images: [{
      url: 'https://thejerseyjournal.news/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'The Jersey Journal',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@JerseyJournal',
    title: 'The Jersey Journal',
    description: 'Hudson County\'s Voice Since 1867',
  },
  robots: 'index, follow',
  alternates: {
    canonical: 'https://thejerseyjournal.news',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="alternate" type="application/rss+xml" title="The Jersey Journal" href="/feed.xml" />
      </head>
      <body className="bg-jersey-white text-jersey-text font-sans">
        <SessionProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}
