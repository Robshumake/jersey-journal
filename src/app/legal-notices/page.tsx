'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

interface LegalNoticeTier {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  priceId: string
}

const tiers: LegalNoticeTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 149,
    description: 'Perfect for small businesses',
    features: [
      'Single publication',
      'Online archival',
      'Email confirmation',
      'Basic formatting',
    ],
    priceId: 'price_basic_legal_notice',
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 299,
    description: 'Most popular choice',
    features: [
      'Two publications',
      'Online archival',
      'Email confirmation',
      'Professional formatting',
      'Affidavit of publication',
      'PDF delivery',
    ],
    priceId: 'price_standard_legal_notice',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 499,
    description: 'Maximum visibility',
    features: [
      'Four publications',
      'Online archival',
      'Email confirmation',
      'Professional formatting',
      'Affidavit of publication',
      'PDF delivery',
      'Featured placement',
      'Social media promotion',
    ],
    priceId: 'price_premium_legal_notice',
  },
  {
    id: 'attorney-annual',
    name: 'Attorney Annual Package',
    price: 997,
    description: 'Year-round coverage',
    features: [
      'Unlimited publications',
      'Premium placement',
      'Dedicated support',
      'Affidavits for all notices',
      'Monthly reporting',
      'Direct phone line',
      'Custom formatting',
      'Rush publication available',
    ],
    priceId: 'price_attorney_annual',
  },
]

interface FormData {
  businessName: string
  businessAddress: string
  noticeText: string
  publicationDate: string
  submitterName: string
  submitterEmail: string
  submitterPhone: string
  tier: string
}

export default function LegalNoticesPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      tier: 'standard',
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/legal-notices/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        window.location.href = result.checkoutUrl
      } else {
        alert('Error submitting form: ' + result.error)
      }
    } catch (error) {
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-jersey-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-jersey-navy to-jersey-navy/80 text-white py-12 md:py-20">
        <div className="container-wide text-center">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
            Legal Notice Publication
          </h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto">
            Trust Hudson County's most established newspaper for your legal notices.
            Published daily to a qualified audience.
          </p>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-jersey-gold py-6">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="font-bold text-jersey-navy">157+ Years</p>
              <p className="text-sm text-jersey-navy/80">Publishing</p>
            </div>
            <div>
              <p className="font-bold text-jersey-navy">NJ Qualified</p>
              <p className="text-sm text-jersey-navy/80">State Registered</p>
            </div>
            <div>
              <p className="font-bold text-jersey-navy">Legal Compliant</p>
              <p className="text-sm text-jersey-navy/80">Court Approved</p>
            </div>
            <div>
              <p className="font-bold text-jersey-navy">24/7 Support</p>
              <p className="text-sm text-jersey-navy/80">Expert Help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="container-wide py-16">
        <h2 className="font-playfair text-3xl font-bold text-center text-jersey-navy mb-12">
          Simple, Transparent Pricing
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`card cursor-pointer transition-all border-2 ${
                selectedTier === tier.id
                  ? 'border-jersey-gold shadow-lg'
                  : 'border-gray-200 hover:border-jersey-gold'
              }`}
              onClick={() => setSelectedTier(tier.id)}
            >
              <h3 className="font-playfair text-2xl font-bold text-jersey-navy mb-2">
                {tier.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
              <div className="mb-6 pb-6 border-b-2 border-gray-200">
                <span className="text-4xl font-bold text-jersey-navy">${tier.price}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-jersey-gold font-bold">✓</span>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full btn ${
                  selectedTier === tier.id ? 'btn-secondary' : 'btn-outline'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedTier(tier.id)
                }}
              >
                Select
              </button>
            </div>
          ))}
        </div>

        {/* Submission Form */}
        {selectedTier && (
          <div className="max-w-2xl mx-auto bg-jersey-gray p-8 rounded-lg">
            <h2 className="font-playfair text-2xl font-bold text-jersey-navy mb-6">
              {tiers.find((t) => t.id === selectedTier)?.name} - Submission Form
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <input type="hidden" {...register('tier')} value={selectedTier} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label>Business Name *</label>
                  <input
                    type="text"
                    {...register('businessName', { required: true })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Business Address *</label>
                  <input
                    type="text"
                    {...register('businessAddress', { required: true })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notice Text *</label>
                <textarea
                  {...register('noticeText', { required: true })}
                  rows={6}
                  required
                />
              </div>

              <div className="form-group">
                <label>Publication Date *</label>
                <input
                  type="date"
                  {...register('publicationDate', { required: true })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    {...register('submitterName', { required: true })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Your Email *</label>
                  <input
                    type="email"
                    {...register('submitterEmail', { required: true })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Your Phone *</label>
                <input
                  type="tel"
                  {...register('submitterPhone', { required: true })}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full"
              >
                {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>
        )}
      </section>

      {/* FAQ */}
      <section className="bg-jersey-gray py-16">
        <div className="container-narrow">
          <h2 className="font-playfair text-3xl font-bold text-center text-jersey-navy mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <details className="bg-white p-6 rounded-lg">
              <summary className="cursor-pointer font-bold text-jersey-navy">
                What is an affidavit of publication?
              </summary>
              <p className="mt-4 text-gray-700">
                An affidavit of publication is a legal document certifying that your notice was
                published. It's required for court filings and legal compliance.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg">
              <summary className="cursor-pointer font-bold text-jersey-navy">
                How quickly will my notice be published?
              </summary>
              <p className="mt-4 text-gray-700">
                We publish within 24 hours of payment processing. The Attorney Annual Package
                offers rush publication within 2 hours.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg">
              <summary className="cursor-pointer font-bold text-jersey-navy">
                Is The Jersey Journal legally qualified?
              </summary>
              <p className="mt-4 text-gray-700">
                Yes. We're registered with the New Jersey Secretary of State and meet all legal
                requirements for publishing notices.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg">
              <summary className="cursor-pointer font-bold text-jersey-navy">
                Do you offer bulk discounts?
              </summary>
              <p className="mt-4 text-gray-700">
                The Attorney Annual Package is designed for high-volume publishers. Contact us
                for custom rates.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  )
}
