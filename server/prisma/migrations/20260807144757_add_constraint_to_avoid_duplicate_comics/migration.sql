/*
  Warnings:

  - A unique constraint covering the columns `[language_id,title,release_year,page_count]` on the table `comics` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "comics_language_id_title_release_year_page_count_key" ON "comics"("language_id", "title", "release_year", "page_count");
