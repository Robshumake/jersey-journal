import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendEmail, generatePaymentConfirmationEmail, generateAffidavitEmail } from '@/lib/email'
import { generateAffidavitPDF } from '@/lib/affidavit'
import Stripe from 'stripe'

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  if (!session.metadata?.noticeId || !session.customer_email) {
    return
  }

  const { noticeId, type } = session.metadata

  if (type === 'legal-notice') {
    // Update the legal notice with payment info
    const notice = await prisma.legalNotice.update({
      where: { id: noticeId },
      data: {
        stripePaymentId: session.payment_intent as string,
        status: 'published',
      },
    })

    // Create payment record
    const lineItem = (await stripe.checkout.sessions.listLineItems(session.id)).data[0]
    const amount = (lineItem.price?.unit_amount || 0) / 100

    await prisma.paymentRecord.create({
      data: {
        amount,
        currency: 'USD',
        type: 'legal-notice',
        stripePaymentId: session.payment_intent as string,
        status: 'completed',
        legalNoticeId: noticeId,
      },
    })

    // Send payment confirmation email
    const confirmationEmail = generatePaymentConfirmationEmail({
      recipientName: notice.businessName,
      recipientEmail: session.customer_email,
      type: 'legal-notice',
      amount: Math.round(amount * 100),
      reference: session.id,
    })

    await sendEmail(confirmationEmail)

    // Generate affidavit if applicable
    if (notice.tier !== 'basic') {
      const affidavitBuffer = await generateAffidavitPDF({
        businessName: notice.businessName,
        businessAddress: notice.businessAddress,
        noticeText: notice.noticeText,
        publicationDate: notice.publicationDate,
        issueNumber: notice.issueNumber || new Date().toISOString().split('T')[0],
        volumeNumber: notice.volumeNumber || '157',
      })

      // In production, upload to S3 or similar
      const affidavitPath = `/affidavits/${noticeId}-${Date.now()}.pdf`

      // Update notice with affidavit path
      await prisma.legalNotice.update({
        where: { id: noticeId },
        data: { affidavitPath },
      })

      // Send affidavit email
      const affidavitEmail = generateAffidavitEmail({
        recipientName: notice.businessName,
        recipientEmail: session.customer_email,
        businessName: notice.businessName,
        affidavitUrl: `${process.env.NEXTAUTH_URL}${affidavitPath}`,
      })

      await sendEmail(affidavitEmail)
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')

    if (!sig) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'invoice.payment_succeeded':
        // Handle subscription payments
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          )

          if (subscription.metadata?.subscriptionId) {
            await prisma.subscription.update({
              where: { id: subscription.metadata.subscriptionId },
              data: { status: 'active' },
            })
          }
        }
        break

      case 'customer.subscription.deleted':
        const deletedSub = event.data.object as Stripe.Subscription
        if (deletedSub.metadata?.subscriptionId) {
          await prisma.subscription.update({
            where: { id: deletedSub.metadata.subscriptionId },
            data: { status: 'canceled' },
          })
        }
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
