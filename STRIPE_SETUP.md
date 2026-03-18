# Stripe Setup Guide for The Jersey Journal

This guide walks you through creating all Stripe products and price IDs needed for the Jersey Journal website.

## Prerequisites

- Active Stripe account (https://stripe.com)
- Stripe CLI installed: https://stripe.com/docs/stripe-cli
- Or access to Stripe Dashboard: https://dashboard.stripe.com

## Option 1: Using Stripe Dashboard (Easiest)

### 1. Navigate to Products

Go to: https://dashboard.stripe.com/products

### 2. Create Legal Notice Products

**Basic Legal Notice**
- Click "Create Product"
- Name: `Basic Legal Notice`
- Type: Service
- Price: $149.00 (USD)
- Billing period: One-time
- Click "Create Product"
- Copy the Price ID (starts with `price_`)

**Standard Legal Notice**
- Repeat steps above
- Name: `Standard Legal Notice`
- Price: $299.00
- Save the Price ID

**Premium Legal Notice**
- Name: `Premium Legal Notice`
- Price: $499.00
- Save the Price ID

**Attorney Annual Package**
- Name: `Attorney Annual Package`
- Price: $997.00
- Save the Price ID

### 3. Create Obituary Products

**Basic Obituary**
- Price: $149.00
- Save Price ID

**Standard Obituary**
- Price: $249.00
- Save Price ID

**Premium Obituary**
- Price: $449.00
- Save Price ID

### 4. Create Feature Product

**You've Been Selected**
- Price: $997.00
- Save Price ID

### 5. Create Subscription Product

**Digital Edition Subscription**
- Name: `Digital Edition Subscription`
- Type: Service
- Price: $9.99 (USD)
- **Billing period: Monthly (recurring)**
- Click "Create Product"
- Save the Price ID

## Option 2: Using Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to your Stripe account
stripe login

# Create products
stripe products create --name="Basic Legal Notice" --type=service
# Copy the product ID (starts with prod_)

stripe prices create --product=prod_xxx --unit_amount=14900 --currency=usd

# Repeat for all products above
```

## Update Your Configuration

Once you have all Price IDs, update `src/lib/stripe.ts`:

```typescript
export const STRIPE_PRODUCTS = {
  'basic-legal-notice': 'price_1234567890abcdef',
  'standard-legal-notice': 'price_0987654321fedcba',
  'premium-legal-notice': 'price_abcdefghijklmnop',
  'attorney-annual-package': 'price_qrstuvwxyz123456',
  'basic-obituary': 'price_123456789abcdefg',
  'standard-obituary': 'price_hij789klmnopqrst',
  'premium-obituary': 'price_uvwxyz987654321',
  'youve-been-selected': 'price_abc123def456ghi',
  'digital-subscription': 'price_jkl789mno123pqr',
}
```

## Setup Webhook

The platform needs a webhook endpoint to handle successful payments.

### Development (Local Testing)

```bash
# Terminal 1: Start your dev server
npm run dev

# Terminal 2: Setup local webhook forwarding
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

You'll see:
```
Ready! Your webhook signing secret is: whsec_test_1234567890abcdef
```

Copy this and add to `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_test_1234567890abcdef
```

### Production (Vercel)

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://thejerseyjournal.news/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. Copy the signing secret
7. Add to Vercel environment variables:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_prod_1234567890abcdef
   ```

## Get Your API Keys

1. Go to: https://dashboard.stripe.com/apikeys
2. Under "Publishable key", copy `pk_test_...` or `pk_live_...`
3. Under "Secret key", copy `sk_test_...` or `sk_live_...`

Add to `.env.local`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_1234567890abcdef
STRIPE_SECRET_KEY=sk_test_0987654321fedcba
```

## Test the Integration

### Test Card Numbers

Use these in the checkout form:

| Card Type | Number | Result |
|-----------|--------|--------|
| Visa | 4242 4242 4242 4242 | Successful |
| Visa (decline) | 4000 0000 0000 0002 | Declined |
| Mastercard | 5555 5555 5555 4444 | Successful |

- Use any future date for expiry
- Use any 3-digit CVC

### Test Flow

1. Go to http://localhost:3000/legal-notices
2. Select a tier
3. Fill in the form
4. Click "Proceed to Payment"
5. Enter test card details above
6. Click "Pay"
7. Check that:
   - Payment succeeds
   - Email is sent
   - Record appears in `/admin` dashboard
   - Affidavit is generated (for non-basic tiers)

## Verify Webhooks

Check that webhooks are being received:

```bash
# List recent webhook events
stripe events list

# Get details of a specific event
stripe events retrieve evt_1234567890
```

## Switch to Live Mode

When ready for production:

1. In Stripe Dashboard, toggle to "Live Mode" (top left)
2. Get your live API keys (start with `pk_live_` and `sk_live_`)
3. Update `.env.local` on Vercel with live keys
4. Re-run webhook setup with live endpoint

## Troubleshooting

### Webhook not receiving events
- Verify endpoint URL is correct
- Check that webhook secret matches
- Review Stripe webhook logs for errors

### Payment fails silently
- Check browser console for JavaScript errors
- Verify price IDs are correct in `stripe.ts`
- Ensure Stripe keys are loaded (check Network tab)

### Affidavit not generating
- Check server logs for PDF generation errors
- Verify PDF libraries are installed (`pdfkit`)
- Test with basic tier first (no PDF)

### Email not sending
- Verify SMTP credentials are correct
- Check spam/junk folder
- Review email service logs

## Additional Resources

- Stripe Docs: https://stripe.com/docs
- Stripe API Reference: https://stripe.com/docs/api
- Webhook Events: https://stripe.com/docs/api/events/types
- Testing: https://stripe.com/docs/testing

---

**Support**: If you encounter issues, contact your Stripe support representative or check the Stripe dashboard logs.
