# Google News Submission Checklist for The Jersey Journal

This guide helps you submit and optimize The Jersey Journal for Google News.

## 📋 Pre-Submission Checklist

Before submitting to Google News, ensure:

- [ ] Website is live and accessible at https://thejerseyjournal.news
- [ ] Domain verified in Google Search Console
- [ ] SSL certificate installed (HTTPS only)
- [ ] Robots.txt configured correctly
- [ ] News sitemap generated at `/news-sitemap.xml`
- [ ] NewsArticle schema markup on all articles
- [ ] Original news content (not aggregated)
- [ ] Regular publishing schedule
- [ ] Clear publication dates
- [ ] Author attribution on articles

## 🔧 Technical Setup

### 1. Verify in Google Search Console

1. Go to: https://search.google.com/search-console
2. Click "Start now" or add property
3. Enter domain: `https://thejerseyjournal.news`
4. Verify ownership:
   - DNS record, HTML file, Meta tag, or Google Analytics
5. Once verified, you can submit news sitemap

### 2. Check Robots.txt

Create `public/robots.txt`:

```text
User-agent: *
Allow: /
Allow: /news
Allow: /feed.xml
Allow: /news-sitemap.xml
Disallow: /admin
Disallow: /api
Sitemap: https://thejerseyjournal.news/sitemap.xml
Sitemap: https://thejerseyjournal.news/news-sitemap.xml
```

### 3. News Sitemap

Your sitemap is auto-generated at `/api/news-sitemap`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>https://thejerseyjournal.news/news/article-slug</loc>
    <news:news>
      <news:publication>
        <news:name>The Jersey Journal</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>2024-01-15T12:30:00Z</news:publication_date>
      <news:title>Article Title</news:title>
      <news:keywords>Hudson County, News</news:keywords>
    </news:news>
  </url>
  <!-- More articles... -->
</urlset>
```

This is already configured in `src/app/api/feed/route.ts`.

### 4. NewsArticle Schema Markup

Each article page includes structured data:

```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Article Title",
  "description": "Article excerpt",
  "image": "https://...",
  "datePublished": "2024-01-15T12:30:00Z",
  "dateModified": "2024-01-15T12:30:00Z",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "The Jersey Journal",
    "logo": {
      "@type": "ImageObject",
      "url": "https://thejerseyjournal.news/logo.png"
    }
  }
}
```

This is automatically included in article pages. Add to `src/app/news/[slug]/page.tsx`:

```typescript
export const metadata = {
  // ... standard metadata
  other: {
    'schema:NewsArticle': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: article.title,
      // ... etc
    }),
  },
}
```

## 📝 Content Requirements for Google News

### Essential
- **Original Content**: Minimum 80% original content (not copied from wire services)
- **Publication Date**: Clear date on every article
- **Author**: Byline or publication name
- **Update Time**: When content was last modified
- **Headline**: Clear, descriptive title

### Recommended
- **Thumbnail Image**: 200x200px minimum
- **Article Category**: News, Business, World, etc.
- **Keywords**: 3-5 relevant keywords
- **Location Tags**: "Hudson County", "New Jersey", etc.

### What NOT to Do
- ❌ Don't copy content from AP News, Reuters, etc. without major additions
- ❌ Don't spam keywords
- ❌ Don't hide text with same color as background
- ❌ Don't have excessive ads/pop-ups
- ❌ Don't use generic stock photos
- ❌ Don't backdate articles

## 🚀 Submission Steps

### Step 1: Verify Domain

1. Go to Google Search Console: https://search.google.com/search-console
2. Select property: `https://thejerseyjournal.news`
3. Verify ownership (if not already done)

### Step 2: Submit News Sitemap

1. In Search Console, left menu → "Sitemaps"
2. Click "Add/Test Sitemap"
3. Enter: `https://thejerseyjournal.news/news-sitemap.xml`
4. Click "Submit"
5. Google will crawl and validate

### Step 3: Apply for Google News

1. Go to: https://news.google.com/news/sitemap
2. Sign in with Google account
3. Click "Apply for Google News"
4. Select: "Add your website"
5. Enter domain: `thejerseyjournal.news`
6. Select country: **United States**
7. Select language: **English**
8. Fill out form:
   - Publication name: **The Jersey Journal**
   - Country: **United States**
   - Languages: **English**
   - Focus: **Local News (Hudson County)**
   - Website category: **News** (check all that apply)

### Step 4: Verification

1. Google will verify domain ownership via Search Console
2. Confirm you have original news content
3. Submit form

### Step 5: Wait for Approval

- **Timeline**: 2-4 weeks typically
- **Email**: Google will notify you of approval status
- **Initial**: Your site may appear in limited capacity first

## 📊 Monitoring Google News Presence

### After Approval

1. **Search Console**:
   - Monitor article impressions
   - Track clicks
   - Check for indexing issues
   - Review Search Analytics for news queries

2. **Google News**:
   - Search for "Hudson County news"
   - Look for your articles
   - Check if featured in top stories

3. **Regular Checks**:
   - Ensure articles have proper dates
   - Verify schema markup is correct
   - Monitor for any manual actions

### Optimize for Google News

**To improve visibility:**
- Publish breaking news immediately (don't delay)
- Use clear, descriptive headlines (50-60 chars)
- Include relevant keywords naturally
- Add high-quality images
- Include byline and publication date
- Link to related articles
- Use newsy language (not promotional)

## 🎯 Content Strategy for Google News

### To Get Featured

1. **Breaking News**: Cover stories before competitors
2. **Local Angle**: Focus on Hudson County angle
3. **Timeliness**: Publish same day as events
4. **Uniqueness**: Add reporting not found elsewhere
5. **Visual**: High-quality images/videos
6. **Updates**: Update stories as news develops

### Categories to Focus On

- Local Government & Politics (Hudson County)
- Public Safety & Crime
- Education (Local schools)
- Business & Development
- Community Events
- Court News

### Article Types Google News Likes

- Breaking News
- Investigative Reports
- Expert Commentary
- Feature Stories
- Photo Essays
- Video News

## ⚠️ Common Issues & Fixes

### "Site not eligible"
- **Cause**: Not original content or thin content
- **Fix**: Ensure 80%+ original content, add depth

### Low impressions
- **Cause**: Limited traffic or visibility
- **Fix**: Improve headlines, update regularly, get backlinks

### Articles not appearing
- **Cause**: Schema markup wrong or missing dates
- **Fix**: Validate schema with https://schema.org/validate
- **Fix**: Ensure clear publication dates

### Dropped from Google News
- **Cause**: Duplicate content or policy violations
- **Fix**: Remove duplicates, check robots.txt

## 📚 Resources

- **Google News Publisher Center**: https://news.google.com/news/sitemap
- **Search Console Help**: https://support.google.com/webmasters
- **Structured Data Guide**: https://developers.google.com/search/docs/advanced/structured-data/news-article
- **News Guidelines**: https://support.google.com/news/publisher-center/answer/6204050

## 🏆 Success Metrics

Track these metrics in Google Search Console:

- **Impressions**: How many times your articles appear in Google News
- **Clicks**: How many users click to visit
- **CTR** (Click-through rate): Percentage of impressions that get clicked
- **Position**: Average ranking position for news queries

**Healthy metrics:**
- 100+ impressions per day after first month
- 3-5% CTR
- Top 20 positioning for local news queries

## ✅ Final Verification

Before declaring victory:

- [ ] Domain verified in Google Search Console
- [ ] News sitemap submitted and crawled
- [ ] Articles appearing in Google News search
- [ ] Schema markup validated
- [ ] Google News traffic visible in Analytics
- [ ] Regular publishing schedule established (daily or more)
- [ ] Original content standards met

---

**Timeline**: Expect 2-4 weeks from submission to first appearance in Google News. Initial traffic may be low—consistency and quality will build visibility over time.

**Support**: Contact Google News support: https://support.google.com/news/answer/9107868
