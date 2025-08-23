-- CreateTable
CREATE TABLE "public"."Song" (
    "id" SERIAL NOT NULL,
    "originalLink" TEXT NOT NULL,
    "title" TEXT,
    "youtubeLink" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);
