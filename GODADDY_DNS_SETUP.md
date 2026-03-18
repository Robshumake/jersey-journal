# GoDaddy DNS Setup for thejerseyjournal.news

This guide walks you through configuring DNS records for `thejerseyjournal.news` on GoDaddy.

## Prerequisites

- GoDaddy account with domain registered: `thejerseyjournal.news`
- Vercel deployment URL (from deployment confirmation)
- Email provider details (if using third-party email)

## Step 1: Access GoDaddy DNS Manager

1. Go to https://www.godaddy.com
2. Log in to your account
3. Click your profile → "My Products"
4. Under "Domains", click `thejerseyjournal.news`
5. Click "Manage" → "DNS" (or "Manage DNS")
6. You should see a list of current DNS records

## Step 2: Point Domain to Vercel

### Update Nameservers (Recommended)

If deploying on Vercel, you can update nameservers:

1. In Vercel dashboard for your project:
   - Go to Settings → Domains
   - Add domain: `thejerseyjournal.news`
   - Vercel will show you the nameservers to use

2. Back in GoDaddy DNS settings:
   - Look for "Nameservers" section
   - Click "Change"
   - Select "I'll use custom nameservers"
   - Enter Vercel's nameservers:
     ```
     ns1.vercel.com
     ns2.vercel.com
     ns3.vercel.com
     ns4.vercel.com
     ```
   - Click "Save"
   - Allow 24-48 hours for propagation

### OR Add CNAME Records (If keeping GoDaddy nameservers)

1. In GoDaddy DNS Manager, find existing A/AAAA records
2. Add a new CNAME record:
   - **Type**: CNAME
   - **Name**: `@` (or leave blank for root)
   - **Value**: `cname.vercel.com`
   - **TTL**: 3600 (or default)
   - Click "Add"

3. Add www subdomain:
   - **Type**: CNAME
   - **Name**: `www`
   - **Value**: `cname.vercel.com`
   - **TTL**: 3600
   - Click "Add"

4. Click "Save All DNS Records"

## Step 3: Configure Email (If Using Third-Party Provider)

### For Gmail with Custom Domain

1. Verify domain in Google Workspace:
   - Go to https://workspace.google.com
   - Add domain to Google Workspace
   - Google will provide verification TXT record

2. Add TXT record in GoDaddy:
   - **Type**: TXT
   - **Name**: `@`
   - **Value**: (Google's verification string)
   - Click "Add"

3. Add Gmail MX Records:
   - In GoDaddy DNS, click "Add Record"
   - **Type**: MX
   - **Name**: `@`
   - **Value**: `smtp.google.com` (Google will provide)
   - **Priority**: 10
   - Repeat for all Google MX records
   - Click "Save All"

### Alternative Email Providers

Different providers require different MX records. Contact your email provider for exact values.

**Common providers:**
- Google Workspace
- Microsoft 365
- Zoho Mail
- ProtonMail

Each will provide specific MX records to add.

## Step 4: Add SPF & DKIM Records (Email Authentication)

These ensure your emails don't get marked as spam.

### SPF Record

1. In GoDaddy DNS, click "Add Record"
   - **Type**: TXT
   - **Name**: `@`
   - **Value**: `v=spf1 include:sendgrid.net ~all` (adjust based on email provider)
   - Click "Add"

2. If using Gmail:
   ```
   v=spf1 include:gmail.com ~all
   ```

### DKIM Record

1. Your email provider will give you a DKIM public key
2. In GoDaddy DNS, add TXT record:
   - **Type**: TXT
   - **Name**: `selector._domainkey` (selector varies by provider)
   - **Value**: (DKIM public key from provider)
   - Click "Add"

## Step 5: Verify DNS Propagation

Check if DNS is properly configured:

```bash
# Check if domain resolves to Vercel
nslookup thejerseyjournal.news

# Should show Vercel's IP or CNAME
```

Or use online tool: https://mxtoolbox.com/

- Enter domain: `thejerseyjournal.news`
- Check: All records look correct
- If nameservers show GoDaddy, propagation may still be happening

## Final Checklist

- [ ] Domain points to Vercel (via CNAME or nameservers)
- [ ] `www.thejerseyjournal.news` resolves
- [ ] MX records configured (if using custom email)
- [ ] SPF record configured
- [ ] DKIM record configured (if applicable)
- [ ] DMARC record configured (optional but recommended)
- [ ] SSL certificate auto-generated (Vercel handles this)

## Common Issues

### Domain still showing GoDaddy default page

**Cause**: DNS not propagated yet or CNAME not set

**Fix**:
- Wait 24-48 hours for nameserver changes
- Verify CNAME points to `cname.vercel.com`
- Check DNS propagation: https://dnschecker.org

### Email not working

**Cause**: Incorrect MX records or SPF configuration

**Fix**:
- Verify MX records match your email provider's requirements
- Check SPF record syntax
- Test with: https://mxtoolbox.com

### SSL certificate not generating

**Cause**: Domain not properly connected to Vercel

**Fix**:
- Ensure CNAME is correct: `cname.vercel.com`
- Allow 5-10 minutes for Vercel to provision certificate
- Check Vercel project settings → Domains

### "Domain already taken" error in Vercel

**Cause**: Domain registered elsewhere or conflict

**Fix**:
- Ensure GoDaddy CNAME/nameservers are updated
- Wait for propagation
- Try removing and re-adding domain in Vercel

## DNS Records Summary

Here's what your final DNS should look like:

| Type | Name | Value | Priority | TTL |
|------|------|-------|----------|-----|
| CNAME | @ | cname.vercel.com | - | 3600 |
| CNAME | www | cname.vercel.com | - | 3600 |
| MX | @ | mail.google.com | 10 | 3600 |
| TXT | @ | v=spf1 include:gmail.com ~all | - | 3600 |
| TXT | selector._domainkey | (DKIM key) | - | 3600 |

## Support

- **Vercel DNS Docs**: https://vercel.com/docs/concepts/projects/custom-domains
- **GoDaddy DNS Help**: https://www.godaddy.com/help
- **Email Verification**: https://mxtoolbox.com

---

**Timeline**: DNS changes can take 24-48 hours to fully propagate globally. Be patient!
