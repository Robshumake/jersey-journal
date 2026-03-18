# 🛠️ Essential Commands Reference

Quick command reference for The Jersey Journal development and deployment.

## 🏃 Getting Started

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Setup database
npx prisma db push
npx prisma db seed

# Start development server
npm run dev
# Visit http://localhost:3000
```

## 📁 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 🗄️ Database Commands

```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma db push

# Reset database (⚠️ deletes data)
npx prisma migrate reset

# Seed database with sample data
npx prisma db seed

# Open database GUI
npx prisma studio

# View schema
npx prisma format
```

## 🔑 Environment Setup

```bash
# Generate NextAuth secret
openssl rand -base64 32

# Export environment variables for local testing
export $(cat .env.local | xargs)

# Pull Vercel environment variables
vercel env pull
```

## 🌐 Deployment Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to staging
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel list

# View logs
vercel logs
```

## 💳 Stripe Setup Commands

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Start webhook forwarding
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# List Stripe events
stripe events list

# Create product
stripe products create --name="Product Name" --type=service

# Create price
stripe prices create --product=prod_xxx --unit_amount=9999 --currency=usd
```

## 📧 Email Testing

```bash
# Test SMTP connection
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
  subject: 'Test',
  html: '<p>Test email</p>',
}, (err, info) => {
  if (err) console.error(err);
  else console.log('Sent:', info);
});
EOF

node test-email.js
```

## 🔍 Database Inspection

```bash
# Connect to PostgreSQL directly
psql postgresql://user:password@localhost:5432/jersey_journal

# Once connected:
\dt                  # List tables
\d articles          # Describe table
SELECT COUNT(*) FROM articles;
\q                   # Quit
```

## 🐛 Debugging

```bash
# Enable debug logging
DEBUG=* npm run dev

# Check Next.js build
npm run build --debug

# Analyze bundle size
npm install -D @next/bundle-analyzer
```

## 📦 Package Management

```bash
# Update all dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check outdated packages
npm outdated

# Install specific version
npm install package@version

# Uninstall package
npm uninstall package-name
```

## 🔄 Git Commands

```bash
# Initialize repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push origin main

# Check status
git status

# View logs
git log --oneline

# Revert last commit
git revert HEAD

# Undo uncommitted changes
git checkout -- .
```

## 🧹 Cleanup & Maintenance

```bash
# Clean Next.js cache
rm -rf .next

# Clean node_modules
rm -rf node_modules
npm install

# Clear npm cache
npm cache clean --force

# Prune database (remove unused data)
npx prisma db seed --env-file=.env.local

# Format code
npx prettier --write .

# Lint and fix
npm run lint -- --fix
```

## 📱 Testing Stripe

```bash
# Valid test cards:
4242 4242 4242 4242  # Visa - succeeds
4000 0000 0000 0002  # Visa - declines
5555 5555 5555 4444  # Mastercard - succeeds

# Use any future date for expiry
# Use any 3-digit number for CVC
```

## 🌍 DNS Verification

```bash
# Check DNS propagation
nslookup thejerseyjournal.news

# Detailed DNS check
dig thejerseyjournal.news

# MX records
dig thejerseyjournal.news MX

# TXT records (SPF/DKIM)
dig thejerseyjournal.news TXT

# Online tool
# https://mxtoolbox.com/
```

## 📊 Performance Testing

```bash
# Lighthouse audit
npm install -g lighthouse
lighthouse https://localhost:3000

# Bundle analysis
npm run build
npm run analyze

# Check Core Web Vitals
npm install -D @next/bundle-analyzer
```

## 🔐 Security Checks

```bash
# Check for vulnerabilities
npm audit

# Scan for hardcoded secrets
npm install -g detect-secrets
detect-secrets scan

# Check dependencies
npm ls

# Security headers check
curl -I https://thejerseyjournal.news
```

## 📲 Mobile Testing

```bash
# Test on local network
npm run dev

# From phone/tablet on same network:
# http://YOUR_IP_ADDRESS:3000

# Or use ngrok for external access
npm install -g ngrok
ngrok http 3000
```

## 🚀 Production Checklist Commands

```bash
# Verify no console errors in build
npm run build

# Type check
npx tsc --noEmit

# Run linter
npm run lint

# Check security
npm audit

# Verify environment variables
vercel env pull
cat .env.local | grep -v "^#" | sort

# Test database connection
npx prisma db execute --stdin < connection-test.sql

# Verify all migrations applied
npx prisma migrate status
```

## 📈 Monitoring Commands

```bash
# View application logs
vercel logs

# Stream logs
vercel logs --follow

# Check error logs
tail -f logs/error.log

# Monitor database connections
psql ... -c "SELECT * FROM pg_stat_activity;"

# Check Vercel status
curl https://www.vercelstatus.com/api/v2/status.json
```

## 💡 Useful Aliases

Add to your `.bashrc` or `.zshrc`:

```bash
# Jersey Journal shortcuts
alias jj-dev="cd ~/jersey-journal && npm run dev"
alias jj-build="cd ~/jersey-journal && npm run build"
alias jj-db="cd ~/jersey-journal && npx prisma studio"
alias jj-seed="cd ~/jersey-journal && npx prisma db seed"
alias jj-deploy="cd ~/jersey-journal && vercel --prod"
alias jj-logs="vercel logs --follow"
```

## 📝 Common Tasks

```bash
# Create new article via database
npx prisma db execute --stdin << EOF
INSERT INTO articles (...) VALUES (...)
EOF

# Generate new migration
npx prisma migrate dev --name add_column

# Backup database
pg_dump jersey_journal > backup.sql

# Restore database
psql jersey_journal < backup.sql

# Export data to CSV
psql -c "COPY articles TO STDOUT WITH CSV" > articles.csv
```

## 🎯 Troubleshooting Commands

```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process on port 3000
kill -9 $(lsof -t -i:3000)

# Check Node version
node --version

# Check npm version
npm --version

# Check PostgreSQL status
brew services list | grep postgres

# Restart PostgreSQL
brew services restart postgresql@15

# Check environment variables
env | grep DATABASE_URL
env | grep STRIPE
```

## 📚 Help Commands

```bash
# Next.js help
npx next --help

# Prisma help
npx prisma --help

# npm help
npm help

# List available npm scripts
npm run

# Check TypeScript version
npx tsc --version
```

---

## 🔗 Quick Links

- Local dev: http://localhost:3000
- Admin login: http://localhost:3000/admin/login
- Vercel dashboard: https://vercel.com/dashboard
- Stripe dashboard: https://dashboard.stripe.com
- Prisma docs: https://www.prisma.io/docs
- Next.js docs: https://nextjs.org/docs

---

**Pro Tips:**
- Use `npm run dev` for active development
- Use `npm run build` before committing to catch errors
- Use `vercel env pull` before database commands in production
- Always test Stripe webhooks locally before deploying
- Use `npx prisma studio` to inspect database visually

**Remember:** 
- Never commit `.env.local` to git
- Always backup database before migrations
- Test payments with test cards first
- Monitor logs after each deployment
