-- CreateTable
CREATE TABLE "PostSummary" (
    "postSlug" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostSummary_pkey" PRIMARY KEY ("postSlug")
);

-- CreateTable
CREATE TABLE "PostEmbedding" (
    "postSlug" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "embedding" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostEmbedding_pkey" PRIMARY KEY ("postSlug")
);
