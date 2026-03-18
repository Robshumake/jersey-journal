'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()

  const navItems = [
    { label: 'News', href: '/news' },
    { label: 'Legal Notices', href: '/legal-notices' },
    { label: 'Obituaries', href: '/obituaries' },
    { label: 'You\'ve Been Selected', href: '/youve-been-selected' },
    { label: 'Digital Edition', href: '/edition' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-jersey-white shadow-header">
      {/* Breaking News Ticker */}
      <div className="bg-jersey-navy text-white px-4 py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap inline-block">
          <span className="mr-12">🔴 BREAKING NEWS</span>
          <span className="mr-12">Stay tuned for the latest from Hudson County</span>
          <span className="mr-12">📰 Subscribe to our newsletter for updates</span>
        </div>
      </div>

      {/* Masthead */}
      <div className="border-b-4 border-jersey-gold">
        <div className="container-wide py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex flex-col items-center">
              <h1 className="font-playfair font-bold text-3xl md:text-4xl text-jersey-navy text-center">
                THE JERSEY JOURNAL
              </h1>
              <p className="text-sm md:text-base text-jersey-navy font-semibold">
                Hudson County's Voice Since 1867
              </p>
            </Link>

            {/* Desktop Navigation */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex flex-col gap-1"
            >
              <div className="w-6 h-0.5 bg-jersey-navy"></div>
              <div className="w-6 h-0.5 bg-jersey-navy"></div>
              <div className="w-6 h-0.5 bg-jersey-navy"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block bg-white md:bg-transparent`}>
        <div className="container-wide">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4">
            <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-jersey-navy font-semibold hover:text-jersey-gold transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              {session?.user ? (
                <>
                  <Link
                    href="/admin"
                    className="text-jersey-navy font-semibold hover:text-jersey-gold transition-colors"
                  >
                    Admin
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-jersey-navy font-semibold hover:text-jersey-gold transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/admin/login"
                  className="btn btn-primary btn-small"
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
