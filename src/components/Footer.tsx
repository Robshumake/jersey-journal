import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-jersey-navy text-white mt-16">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-playfair text-xl font-bold mb-4 text-jersey-gold">
              About Us
            </h3>
            <p className="text-sm leading-relaxed">
              The Jersey Journal has been Hudson County's trusted news source since 1867, delivering breaking news, legal notices, and community coverage.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-playfair text-xl font-bold mb-4 text-jersey-gold">
              Quick Links
            </h3>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/news" className="hover:text-jersey-gold transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link href="/legal-notices" className="hover:text-jersey-gold transition-colors">
                  Legal Notices
                </Link>
              </li>
              <li>
                <Link href="/obituaries" className="hover:text-jersey-gold transition-colors">
                  Obituaries
                </Link>
              </li>
              <li>
                <Link href="/edition" className="hover:text-jersey-gold transition-colors">
                  Digital Edition
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-playfair text-xl font-bold mb-4 text-jersey-gold">
              Services
            </h3>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/youve-been-selected" className="hover:text-jersey-gold transition-colors">
                  You've Been Selected
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-jersey-gold transition-colors">
                  About The Journal
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-jersey-gold transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-playfair text-xl font-bold mb-4 text-jersey-gold">
              Contact
            </h3>
            <div className="text-sm space-y-2">
              <p>
                <strong>Email:</strong>
                <a href="mailto:publisher@thejerseyjournal.news" className="hover:text-jersey-gold transition-colors">
                  publisher@thejerseyjournal.news
                </a>
              </p>
              <p>
                <strong>Phone:</strong>
                <a href="tel:+1234567890" className="hover:text-jersey-gold transition-colors">
                  (201) 555-0123
                </a>
              </p>
              <p className="text-xs">
                Hudson County, New Jersey
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-jersey-gold/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
            <p>
              &copy; {currentYear} The Jersey Journal. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-jersey-gold transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-jersey-gold transition-colors">
                Terms of Service
              </Link>
              <a href="/feed.xml" className="hover:text-jersey-gold transition-colors">
                RSS Feed
              </a>
            </div>
          </div>
        </div>

        {/* NJ Qualification Statement */}
        <div className="mt-8 pt-8 border-t border-jersey-gold/30 text-center text-xs text-gray-400">
          <p>
            The Jersey Journal is a newspaper of general circulation qualified under New Jersey law.
            This publication is entered in the office of the Secretary of State and meets all
            requirements for publishing legal notices.
          </p>
        </div>
      </div>
    </footer>
  )
}
