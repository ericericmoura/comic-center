/*
  Warnings:

  - You are about to drop the `user_ratings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_ratings" DROP CONSTRAINT "user_ratings_comic_id_fkey";

-- DropForeignKey
ALTER TABLE "user_ratings" DROP CONSTRAINT "user_ratings_user_id_fkey";

-- DropTable
DROP TABLE "user_ratings";

-- CreateTable
CREATE TABLE "comic_ratings" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "comic_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comic_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "comic_ratings_user_id_comic_id_key" ON "comic_ratings"("user_id", "comic_id");

-- AddForeignKey
ALTER TABLE "comic_ratings" ADD CONSTRAINT "comic_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comic_ratings" ADD CONSTRAINT "comic_ratings_comic_id_fkey" FOREIGN KEY ("comic_id") REFERENCES "comics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
