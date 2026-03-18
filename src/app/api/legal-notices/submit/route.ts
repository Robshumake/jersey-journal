import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

const PRICE_IDS: Record<string, string> = {
  basic: 'price_basic_legal_notice',
  standard: 'price_standard_legal_notice',
  premium: 'price_premium_legal_notice',
  'attorney-annual': 'price_attorney_annual',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      businessName,
      businessAddress,
      noticeText,
      publicationDate,
      submitterName,
      submitterEmail,
      submitterPhone,
      tier,
    } = body

    // Validate required fields
    if (
      !businessName ||
      !businessAddress ||
      !noticeText ||
      !publicationDate ||
      !submitterEmail ||
      !submitterPhone ||
      !tier
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the price ID
    const priceId = PRICE_IDS[tier]
    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid tier selected' },
        { status: 400 }
      )
    }

    // Create a LegalNotice record in the database
    const notice = await prisma.legalNotice.create({
      data: {
        businessName,
        businessAddress,
        noticeText,
        publicationDate: new Date(publicationDate),
        issueNumber: '',
        volumeNumber: '',
        tier,
        submitterEmail,
        submitterPhone,
        status: 'pending',
      },
    })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/success?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/legal-notices?canceled=true`,
      customer_email: submitterEmail,
      metadata: {
        noticeId: notice.id,
        type: 'legal-notice',
      },
    })

    return NextResponse.json({
      checkoutUrl: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    console.error('Legal notice submission error:', error)
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    )
  }
}
