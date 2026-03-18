# The Jersey Journal - Production-Ready Next.js Website

A complete, production-ready newspaper website for **The Jersey Journal** - Hudson County's Voice Since 1867.

## 🎯 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Stripe account (for payments)
- Gmail/SMTP server (for emails)

### Installation

1. **Clone and setup:**
```bash
git clone <repository>
cd jersey-journal
npm install
```

2. **Environment Setup:**
```bash
cp .env.example .env.local
# Edit .env.local with your values (see below)
```

3. **Database Setup:**
```bash
npx prisma db push
npx prisma db seed
```

4. **Development Server:**
```bash
npm run dev
# Open http://localhost:3000
```

## 📋 Environment Variables

Create a `.env.local` file with:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/jersey_journal"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_test_..."

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="publisher@thejerseyjournal.news"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="The Jersey Journal <publisher@thejerseyjournal.news>"

# Vercel (production)
VERCEL_URL="https://thejerseyjournal.news"
```

## 🛠️ Stripe Setup

### 1. Create Products in Stripe Dashboard

```bash
# Run these commands via Stripe CLI or dashboard API:

# Legal Notices
stripe products create --name="Basic Legal Notice" --type=service
stripe prices create --product=prod_xxx --unit_amount=14900 --currency=usd

stripe products create --name="Standard Legal Notice" --type=service
stripe prices create --product=prod_xxx --unit_amount=29900 --currency=usd

stripe products create --name="Premium Legal Notice" --type=service
stripe prices create --product=prod_xxx --unit_amount=49900 --currency=usd

stripe products create --name="Attorney Annual Package" --type=service
stripe prices create --product=prod_xxx --unit_amount=99700 --currency=usd

# Obituaries
stripe products create --name="Basic Obituary" --type=service
stripe prices create --product=prod_xxx --unit_amount=14900 --currency=usd

stripe products create --name="Standard Obituary" --type=service
stripe prices create --product=prod_xxx --unit_amount=24900 --currency=usd

stripe products create --name="Premium Obituary" --type=service
stripe prices create --product=prod_xxx --unit_amount=44900 --currency=usd

# Features
stripe products create --name="You've Been Selected" --type=service
stripe prices create --product=prod_xxx --unit_amount=99700 --currency=usd

# Subscriptions
stripe products create --name="Digital Edition Subscription" --type=service
stripe prices create --product=prod_xxx --unit_amount=999 --currency=usd --recurring='{"interval":"month"}'
```

### 2. Update Price IDs

Update `src/lib/stripe.ts` with your actual price IDs:

```typescript
export const STRIPE_PRODUCTS = {
  'basic-legal-notice': 'price_xxx',
  'standard-legal-notice': 'price_xxx',
  // ... etc
}
```

### 3. Setup Webhook

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

For production, configure webhook in Stripe Dashboard:
- Endpoint URL: `https://thejerseyjournal.news/api/webhooks/stripe`
- Events: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`

## 📧 Email Configuration

### Gmail Setup
1. Enable 2FA on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character password in `SMTP_PASSWORD`

### Alternative SMTP
Update `src/lib/email.ts` with your provider's settings.

## 📚 Project Structure

```
jersey-journal/
├── src/
│   ├── app/
│   │   ├── (pages)
│   │   │   ├── page.tsx           # Homepage
│   │   │   ├── news/              # News listing
│   │   │   ├── legal-notices/     # Legal notices page with payment
│   │   │   ├── obituaries/        # Obituaries page
│   │   │   ├── youve-been-selected/
│   │   │   ├── edition/           # Digital edition
│   │   │   ├── about/             # About page
│   │   │   └── contact/           # Contact page
│   │   ├── admin/
│   │   │   ├── page.tsx           # Main dashboard
│   │   │   ├── login/             # Admin login
│   │   │   ├── articles/          # Article management
│   │   │   ├── notices/           # Legal notice dashboard
│   │   │   ├── obituaries/        # Obituary management
│   │   │   ├── features/          # Feature applications
│   │   │   └── revenue/           # Revenue reporting
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/ # NextAuth routes
│   │   │   ├── legal-notices/     # Legal notice API
│   │   │   ├── feed/              # RSS feed
│   │   │   └── webhooks/stripe/   # Stripe webhooks
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── [other components]
│   │
│   └── lib/
│       ├── auth.ts               # NextAuth config
│       ├── prisma.ts             # Prisma client
│       ├── stripe.ts             # Stripe utilities
│       ├── email.ts              # Email templates
│       ├── affidavit.ts          # PDF generation
│       └── rss.ts                # RSS feed generation
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed data
│
├── package.json
├── next.config.js
├── tailwind.config.ts
└── .env.example
```

## 🎨 Brand Colors

- **Navy**: `#003087` (Primary)
- **Gold**: `#C9A84C` (Accent)
- **White**: `#FFFFFF`
- **Light Gray**: `#F5F5F5`

## 🔐 Admin Setup

### Create Admin User

```bash
node scripts/create-admin.js
```

Or via database:
```sql
INSERT INTO users (id, email, name, password, role) 
VALUES (cuid(), 'admin@thejerseyjournal.news', 'Admin', '[BCRYPT_HASH]', 'admin');
```

Default login: `/admin/login`

## 📄 Pages & Features

### Public Pages
- ✅ **Homepage** (`/`) - Breaking news, featured stories, newsletter signup
- ✅ **News** (`/news`) - Article grid with category filters
- ✅ **Legal Notices** (`/legal-notices`) - Pricing tiers, submission form, Stripe integration
- ✅ **Obituaries** (`/obituaries`) - Pricing tiers, submission form
- ✅ **You've Been Selected** (`/youve-been-selected`) - Premium feature
- ✅ **Digital Edition** (`/edition`) - Subscription management
- ✅ **About** (`/about`) - 157-year history, mission
- ✅ **Contact** (`/contact`) - Contact form with departments

### Admin Pages
- ✅ **Dashboard** (`/admin`) - Overview & stats
- ✅ **Articles** (`/admin/articles`) - Create, edit, publish, schedule
- ✅ **Legal Notices** (`/admin/notices`) - Review, approve, generate affidavits
- ✅ **Obituaries** (`/admin/obituaries`) - Review & publish
- ✅ **Features** (`/admin/features`) - Application management
- ✅ **Revenue** (`/admin/revenue`) - Payment tracking & reports

## 🔄 API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/[...nextauth]` | - | NextAuth endpoints |
| `/api/legal-notices/submit` | POST | Submit legal notice with payment |
| `/api/feed` | GET | RSS feed (main) |
| `/api/feed/[category]` | GET | Category RSS feeds |
| `/api/sitemap` | GET | XML sitemap for Google News |
| `/api/webhooks/stripe` | POST | Stripe webhook handler |

## 📊 Database Schema

**Key Tables:**
- `users` - Admin accounts
- `articles` - News content
- `legal_notices` - Legal notice submissions
- `obituaries` - Obituary submissions
- `features` - "You've Been Selected" applications
- `subscriptions` - Digital edition subscribers
- `newsletter_subscribers` - Newsletter signups
- `payment_records` - Stripe payment tracking

## 🚀 Deployment (Vercel)

### 1. Push to GitHub
```bash
git remote add origin https://github.com/yourusername/jersey-journal.git
git push -u origin main
```

### 2. Connect to Vercel
```bash
npm i -g vercel
vercel
```

### 3. Configure Environment Variables
In Vercel Dashboard → Settings → Environment Variables, add all `.env.local` values.

### 4. Setup PostgreSQL
- Use Vercel Postgres (recommended) or connect existing database
- Vercel will provide `DATABASE_URL`

### 5. Run Migrations
```bash
vercel env pull
npx prisma db push
```

### 6. Deploy
```bash
vercel --prod
```

## 🌐 Domain Setup (GoDaddy)

### DNS Records for `thejerseyjournal.news`:

```
Type    Name                Value
CNAME   www                 cname.vercel.com
CNAME   mail                (mail provider CNAME)
TXT     @                   v=spf1 include:mailprovider.com ~all
CNAME   selector._domainkey (mail provider CNAME)
```

### Email Configuration:
- Update MX records for your email provider
- Verify domain ownership via TXT record

## 📱 SEO & Optimization

### Implemented:
- ✅ Meta tags (title, description, keywords)
- ✅ OpenGraph tags (social sharing)
- ✅ Twitter Card support
- ✅ Google News tags & schema
- ✅ XML sitemap (`/sitemap.xml`)
- ✅ RSS feeds (main + categories)
- ✅ Mobile responsive design
- ✅ Image optimization
- ✅ <2 second page load (optimized)

### Google News Submission:
1. Submit sitemap at `/news-sitemap.xml`
2. Apply at: https://news.google.com/news/sitemap
3. Verify domain ownership
4. Monitor coverage in Google News Console

## 🧪 Testing

```bash
# Run tests
npm test

# Build check
npm run build

# Type checking
npx tsc --noEmit
```

## 📝 Stripe Affidavit Features

The platform automatically generates PDF affidavits including:
- Jersey Journal masthead
- Notice text & publication details
- Publication date(s)
- Issue/volume numbers
- Publisher signature block
- Notary block
- NJ qualification statement

Affidavits are:
- Generated immediately after payment
- Sent via email
- Available in admin dashboard
- Downloadable as PDF

## 💰 Revenue Tracking

Dashboard tracks:
- Daily/monthly revenue totals
- Revenue by type (legal, obituary, feature, subscription)
- Individual transaction history
- Stripe payment status
- Subscription status

## 📞 Support

- **Publisher Email**: publisher@thejerseyjournal.news
- **Tech Support**: Contact deployment support (Vercel)
- **Database Issues**: PostgreSQL documentation
- **Stripe Issues**: https://support.stripe.com

## 📄 License

Proprietary. All rights reserved.

---

**Built with** ❤️ **for The Jersey Journal** - Hudson County's Voice Since 1867
