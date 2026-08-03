-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "date_of_birth" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comics" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "page_count" INTEGER NOT NULL,
    "release_year" INTEGER NOT NULL DEFAULT 2026,
    "language_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_ratings" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "comic_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_ratings_user_id_comic_id_key" ON "user_ratings"("user_id", "comic_id");

-- AddForeignKey
ALTER TABLE "comics" ADD CONSTRAINT "comics_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_ratings" ADD CONSTRAINT "user_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_ratings" ADD CONSTRAINT "user_ratings_comic_id_fkey" FOREIGN KEY ("comic_id") REFERENCES "comics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
