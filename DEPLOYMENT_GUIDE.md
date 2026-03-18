# The Jersey Journal - Complete Deployment Guide

This guide walks you through deploying The Jersey Journal to production.

## 🚀 Pre-Deployment Checklist

### Local Development
- [ ] Code cloned locally
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env.local`)
- [ ] Database migrations run (`npx prisma db push`)
- [ ] Seed data loaded (`npx prisma db seed`)
- [ ] Development server tested (`npm run dev`)
- [ ] All pages accessible locally
- [ ] Payment flow tested with Stripe test cards
- [ ] Email sending tested

### Accounts & Services
- [ ] GitHub account & repository created
- [ ] Vercel account created
- [ ] PostgreSQL database provisioned
- [ ] Stripe account created & products set up
- [ ] Email service configured (Gmail/SMTP)
- [ ] Domain registered (thejerseyjournal.news)
- [ ] Admin user created in database

## 📝 Step-by-Step Deployment

### Step 1: Push to GitHub

```bash
# Initialize git repo
git init
git add .
git commit -m "Initial Jersey Journal commit"

# Add remote repository
git remote add origin https://github.com/yourusername/jersey-journal.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

#### Option A: Via Vercel Dashboard (Easiest)

1. Go to https://vercel.com
2. Click "New Project"
3. Click "Import Git Repository"
4. Select your GitHub account
5. Select the `jersey-journal` repository
6. Click "Import"

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Step 3: Configure Environment Variables

In Vercel Dashboard:
1. Project Settings → Environment Variables
2. Add all variables from `.env.local`:

```env
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://thejerseyjournal.news
NEXTAUTH_SECRET=<generate-with-openssl>
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=publisher@thejerseyjournal.news
SMTP_PASSWORD=<gmail-app-password>
EMAIL_FROM=The Jersey Journal <publisher@thejerseyjournal.news>
```

### Step 4: Setup PostgreSQL Database

#### Option A: Vercel Postgres (Recommended)

1. In Vercel Dashboard, go to Storage
2. Click "Create Database"
3. Select "Postgres"
4. Connect to project
5. Copy `DATABASE_URL` from environment variables
6. Add to `.env.local` and Vercel environment

#### Option B: External PostgreSQL

1. Get connection string from your provider
2. Add as `DATABASE_URL` in Vercel environment variables

### Step 5: Run Database Migrations

```bash
# Pull environment variables
vercel env pull

# Run migrations on production database
npx prisma migrate deploy

# Seed production database
npx prisma db seed --env-file=.env.local
```

### Step 6: Configure Domain

See `GODADDY_DNS_SETUP.md` for detailed instructions.

1. In Vercel Project Settings → Domains
2. Add domain: `thejerseyjournal.news`
3. Verify domain ownership
4. Update DNS records at GoDaddy (CNAME or nameservers)
5. Wait for SSL certificate to auto-generate (5-10 mins)

### Step 7: Setup Stripe Webhook

1. In Stripe Dashboard: https://dashboard.stripe.com/webhooks
2. Click "Add Endpoint"
3. Endpoint URL: `https://thejerseyjournal.news/api/webhooks/stripe`
4. Events to send:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
5. Copy webhook signing secret
6. Add to Vercel: `STRIPE_WEBHOOK_SECRET=whsec_live_...`

### Step 8: Verify Email Configuration

Test email sending:

```bash
# Create test script
cat > test-email.js << 'EOF'
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.sendMail({
  from: process.env.EMAIL_FROM,
  to: 'test@example.com',
  subject: 'Test Email',
  html: '<p>This is a test email</p>',
}, (err, info) => {
  if (err) console.error(err);
  else console.log('Email sent:', info);
});
EOF

# Run test
node test-email.js
```

### Step 9: Create Admin User (Production)

```bash
# Connect to production database
vercel env pull

# Create admin user (use your bcrypt hashed password)
node << 'EOF'
const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const password = await hash('securepassword123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@thejerseyjournal.news',
      name: 'Administrator',
      password,
      role: 'admin',
    },
  });
  console.log('Admin created:', admin.email);
}

createAdmin();
EOF
```

### Step 10: Test Production

1. Visit https://thejerseyjournal.news
2. Verify homepage loads
3. Test admin login: https://thejerseyjournal.news/admin/login
4. Test legal notices payment flow
5. Check email delivery
6. Verify RSS feed: https://thejerseyjournal.news/feed.xml
7. Check Google News sitemap: https://thejerseyjournal.news/news-sitemap.xml

## 🔍 Post-Deployment Checks

### Performance
- [ ] Lighthouse score > 80
- [ ] Page load time < 2 seconds
- [ ] Mobile responsive
- [ ] Images optimized

### Security
- [ ] SSL certificate valid
- [ ] No exposed API keys in code
- [ ] Admin routes protected
- [ ] CORS configured (if needed)
- [ ] Rate limiting enabled

### Functionality
- [ ] Payment processing works
- [ ] Emails send successfully
- [ ] PDFs generate correctly
- [ ] RSS feeds valid XML
- [ ] Database queries optimized

### SEO & Discovery
- [ ] Meta tags present
- [ ] Sitemap submitted to Google
- [ ] Google News submission started
- [ ] Social media meta tags configured

## 📊 Monitoring Setup

### Vercel Analytics
1. In Vercel Dashboard → Analytics
2. View:
   - Page load times
   - Core Web Vitals
   - Request count
   - Error rate

### Error Tracking
1. Setup Sentry (optional):
   ```bash
   npm install @sentry/nextjs
   ```
2. Configure in `next.config.js`
3. Monitor errors in real-time

### Database Monitoring
1. Login to PostgreSQL provider dashboard
2. Monitor:
   - Connection count
   - Query performance
   - Storage usage
   - Backup status

### Email Monitoring
1. Setup Gmail app password notifications
2. Monitor delivery rates
3. Check bounce/spam rates

## 🔄 Continuous Integration

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          production: true
```

## 🛠️ Troubleshooting

### Database Connection Issues
```bash
# Test connection
vercel env pull
npx prisma db execute --stdin < test-connection.sql
```

### Email Not Sending
- Verify SMTP credentials
- Check Gmail 2FA enabled
- Generate new app password
- Test with test-email.js script

### Stripe Payments Failing
- Verify price IDs in `stripe.ts`
- Check webhook endpoint in Stripe dashboard
- Review Stripe logs for errors
- Test with Stripe test cards

### Domain Not Resolving
- Verify DNS records in GoDaddy
- Wait for propagation (24-48 hours)
- Clear browser cache
- Test with: `nslookup thejerseyjournal.news`

### Performance Issues
- Check database query performance
- Review Vercel analytics
- Optimize images
- Enable caching headers

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **Stripe Docs**: https://stripe.com/docs
- **Next.js Docs**: https://nextjs.org/docs

## 🎉 Launch Checklist

Final steps before going live:

- [ ] All environment variables set
- [ ] Domain configured & SSL active
- [ ] Database migrations complete
- [ ] Stripe products created & prices set
- [ ] Webhook endpoint tested
- [ ] Email service verified
- [ ] Admin account created
- [ ] Homepage content added
- [ ] Social media meta tags configured
- [ ] Google Search Console verified
- [ ] Google News submission started
- [ ] Analytics configured
- [ ] Monitoring setup complete
- [ ] Backup strategy defined
- [ ] Team trained on admin dashboard
- [ ] Incident response plan ready

## 📈 Post-Launch

### Week 1-2
- Monitor for errors
- Check analytics
- Fix any bugs
- Optimize based on performance data

### Month 1
- Create initial content
- Submit to Google News
- Build initial audience
- Monitor revenue

### Ongoing
- Regular content updates
- Monitoring & maintenance
- Security updates
- Performance optimization

---

**Estimated Total Time**: 2-4 hours

**Questions?** Check the README.md or reach out to support.
