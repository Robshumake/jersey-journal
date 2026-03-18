-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'editor', 'viewer');

-- CreateTable users
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'editor',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable accounts
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable sessions
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable articles
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "category" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "scheduledFor" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable related_articles
CREATE TABLE "related_articles" (
    "id" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,

    CONSTRAINT "related_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable legal_notices
CREATE TABLE "legal_notices" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessAddress" TEXT NOT NULL,
    "noticeText" TEXT NOT NULL,
    "publicationDate" TIMESTAMP(3) NOT NULL,
    "issueNumber" TEXT NOT NULL,
    "volumeNumber" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "stripePaymentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "submitterEmail" TEXT NOT NULL,
    "submitterPhone" TEXT NOT NULL,
    "affidavitPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "legal_notices_pkey" PRIMARY KEY ("id")
);

-- CreateTable obituaries
CREATE TABLE "obituaries" (
    "id" TEXT NOT NULL,
    "deceasedName" TEXT NOT NULL,
    "deceasedAge" INTEGER,
    "deceasedPhoto" TEXT,
    "serviceDetails" TEXT NOT NULL,
    "obituaryText" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "stripePaymentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "submitterName" TEXT NOT NULL,
    "submitterEmail" TEXT NOT NULL,
    "submitterPhone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "obituaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable features
CREATE TABLE "features" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "businessName" TEXT,
    "businessType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photo" TEXT,
    "website" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "stripePaymentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- CreateTable subscriptions
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubId" TEXT,
    "tier" TEXT NOT NULL DEFAULT 'free',
    "status" TEXT NOT NULL DEFAULT 'active',
    "currentPeriodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable newsletter_subscribers
CREATE TABLE "newsletter_subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable payment_records
CREATE TABLE "payment_records" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "type" TEXT NOT NULL,
    "stripePaymentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "legalNoticeId" TEXT,
    "obituaryId" TEXT,
    "featureId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable verification_tokens
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_category_idx" ON "articles"("category");

-- CreateIndex
CREATE INDEX "articles_published_idx" ON "articles"("published");

-- CreateIndex
CREATE INDEX "articles_publishedAt_idx" ON "articles"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "related_articles_fromId_toId_key" ON "related_articles"("fromId", "toId");

-- CreateIndex
CREATE UNIQUE INDEX "legal_notices_stripePaymentId_key" ON "legal_notices"("stripePaymentId");

-- CreateIndex
CREATE INDEX "legal_notices_status_idx" ON "legal_notices"("status");

-- CreateIndex
CREATE INDEX "legal_notices_publicationDate_idx" ON "legal_notices"("publicationDate");

-- CreateIndex
CREATE UNIQUE INDEX "obituaries_stripePaymentId_key" ON "obituaries"("stripePaymentId");

-- CreateIndex
CREATE INDEX "obituaries_status_idx" ON "obituaries"("status");

-- CreateIndex
CREATE INDEX "obituaries_deceasedName_idx" ON "obituaries"("deceasedName");

-- CreateIndex
CREATE UNIQUE INDEX "features_stripePaymentId_key" ON "features"("stripePaymentId");

-- CreateIndex
CREATE INDEX "features_status_idx" ON "features"("status");

-- CreateIndex
CREATE INDEX "features_businessName_idx" ON "features"("businessName");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_email_key" ON "subscriptions"("email");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeSubId_key" ON "subscriptions"("stripeSubId");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "newsletter_subscribers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "payment_records_stripePaymentId_key" ON "payment_records"("stripePaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_records_legalNoticeId_key" ON "payment_records"("legalNoticeId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_records_obituaryId_key" ON "payment_records"("obituaryId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_records_featureId_key" ON "payment_records"("featureId");

-- CreateIndex
CREATE INDEX "payment_records_type_idx" ON "payment_records"("type");

-- CreateIndex
CREATE INDEX "payment_records_status_idx" ON "payment_records"("status");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "related_articles" ADD CONSTRAINT "related_articles_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "related_articles" ADD CONSTRAINT "related_articles_toId_fkey" FOREIGN KEY ("toId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_records" ADD CONSTRAINT "payment_records_legalNoticeId_fkey" FOREIGN KEY ("legalNoticeId") REFERENCES "legal_notices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_records" ADD CONSTRAINT "payment_records_obituaryId_fkey" FOREIGN KEY ("obituaryId") REFERENCES "obituaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_records" ADD CONSTRAINT "payment_records_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE CASCADE;
