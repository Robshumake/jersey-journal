# The Jersey Journal - Quick Start Guide

Get up and running in 5 minutes.

## 🚀 Installation (5 minutes)

```bash
# 1. Clone/download the project
cd jersey-journal

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local with your values (see DETAILED INSTRUCTIONS below)

# 4. Setup database
npx prisma db push
npx prisma db seed

# 5. Run development server
npm run dev

# 6. Open browser
# http://localhost:3000
```

## 📋 Essential Environment Variables

Minimum required to get started:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/jersey_journal"

# NextAuth (generate with: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret"

# Stripe (get from dashboard.stripe.com)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_test_..."

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="publisher@thejerseyjournal.news"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="The Jersey Journal <publisher@thejerseyjournal.news>"
```

## 🔑 Getting Credentials

### PostgreSQL (Local)
```bash
# Install PostgreSQL locally (macOS)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb jersey_journal

# Get connection string
DATABASE_URL="postgresql://$(whoami):@localhost:5432/jersey_journal"
```

### Stripe
1. Go to https://dashboard.stripe.com
2. Get API keys from Settings → API Keys
3. Create products (see STRIPE_SETUP.md)

### Gmail
1. Enable 2FA: https://myaccount.google.com/security
2. Generate app password: https://myaccount.google.com/apppasswords
3. Use 16-character password in SMTP_PASSWORD

## 👨‍💼 Create Admin User

```bash
npm run db:seed
# Creates admin@thejerseyjournal.news / admin123

# Or login at:
# http://localhost:3000/admin/login
```

## 📱 Test the Site

| Page | URL |
|------|-----|
| Homepage | http://localhost:3000 |
| Legal Notices | http://localhost:3000/legal-notices |
| Obituaries | http://localhost:3000/obituaries |
| News | http://localhost:3000/news |
| Admin Dashboard | http://localhost:3000/admin |
| Admin Login | http://localhost:3000/admin/login |

## 💳 Test Payment

1. Go to http://localhost:3000/legal-notices
2. Select a tier
3. Fill out form
4. Use test card: `4242 4242 4242 4242`
5. Any future date + any CVC
6. Confirm payment succeeds

## 📧 Test Email

Update `.env.local` with real email credentials, then check admin dashboard for confirmation emails.

## 🚀 Deploy to Production

See DEPLOYMENT_GUIDE.md for complete instructions.

Quick version:
```bash
# 1. Push to GitHub
git add .
git commit -m "Initial commit"
git push

# 2. Connect Vercel
# - Go to vercel.com
# - Import GitHub repo
# - Add environment variables
# - Deploy

# 3. Setup domain & Stripe
# - Update DNS (GODADDY_DNS_SETUP.md)
# - Setup webhook (STRIPE_SETUP.md)
# - Run migrations

# 4. Launch!
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| README.md | Full documentation |
| STRIPE_SETUP.md | Stripe configuration |
| GODADDY_DNS_SETUP.md | Domain setup |
| DEPLOYMENT_GUIDE.md | Production deployment |
| GOOGLE_NEWS_SETUP.md | Google News setup |

## 🆘 Common Issues

**Port 3000 already in use:**
```bash
npm run dev -- -p 3001
```

**Database connection error:**
```bash
# Check PostgreSQL is running
brew services list

# Check connection string
echo $DATABASE_URL
```

**Stripe API error:**
```bash
# Verify price IDs in src/lib/stripe.ts
# Match with actual Stripe prices
```

**Email not sending:**
```bash
# Test SMTP credentials
node test-email.js
```

## 📞 Next Steps

1. **Setup Stripe**: STRIPE_SETUP.md
2. **Configure Email**: Update SMTP credentials
3. **Add Content**: Create first article in admin
4. **Setup Domain**: GODADDY_DNS_SETUP.md
5. **Deploy**: DEPLOYMENT_GUIDE.md

## ✅ Checklist

- [ ] Code cloned
- [ ] Dependencies installed
- [ ] Environment variables set
- [ ] Database configured
- [ ] npm run dev works
- [ ] Homepage loads at http://localhost:3000
- [ ] Admin login works
- [ ] Payment flow tested
- [ ] Email credentials working
- [ ] Ready to deploy

---

**Questions?** Check README.md or the specific setup guides above.

**Time to production**: ~2-4 hours (plus domain propagation)
