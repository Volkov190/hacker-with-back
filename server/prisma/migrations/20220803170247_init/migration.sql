-- CreateEnum
CREATE TYPE "Type" AS ENUM ('link', 'comment');

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "user" TEXT,
    "time_ago" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "comments_count" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "points" INTEGER,
    "type" "Type" NOT NULL DEFAULT 'comment',
    "postId" INTEGER,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
