import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export const STRIPE_PRODUCTS = {
  'basic-legal-notice': 'price_basic_legal_notice',
  'standard-legal-notice': 'price_standard_legal_notice',
  'premium-legal-notice': 'price_premium_legal_notice',
  'attorney-annual-package': 'price_attorney_annual',
  'basic-obituary': 'price_basic_obituary',
  'standard-obituary': 'price_standard_obituary',
  'premium-obituary': 'price_premium_obituary',
  'youve-been-selected': 'price_youve_been_selected',
  'digital-subscription': 'price_digital_subscription',
};

export async function createCheckoutSession(params: {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: params.priceId.includes('digital-subscription') ? 'subscription' : 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: params.customerEmail,
    metadata: params.metadata,
  });

  return session;
}

export async function getPrice(priceId: string) {
  const price = await stripe.prices.retrieve(priceId);
  return price;
}
