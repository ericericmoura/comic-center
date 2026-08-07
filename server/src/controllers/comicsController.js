import { prisma } from "../config/database.js";

export const getAllComics = async (req, res) => {
  let { currentPage, itemsPerPage, titleSearch, sortByReleaseYear } = req.query;

  if (!currentPage) {
    currentPage = 1;
  }
  if (!itemsPerPage) {
    itemsPerPage = 10;
  }

  const skip = (currentPage - 1) * itemsPerPage;

  const query = {
    skip,
    take: Number(itemsPerPage),
    where: { AND: [{ deleted: false }] },
  };

  if (sortByReleaseYear) {
    query.orderBy = { release_year: sortByReleaseYear };
  }
  if (titleSearch) {
    query.where.AND.push({
      title: { contains: titleSearch, mode: "insensitive" },
    });
  }

  const comics = await prisma.comics.findMany(query);
  if (!comics) {
    return res.status(404).json({ error: "no comics found." });
  }

  res.status(200).json({ status: "success", data: comics });
};

export const createComic = async (req, res) => {
  const { title, pageCount, releaseYear, languageId } = req.body;
  const { id } = req.auth;

  const user = await prisma.users.findUnique({ where: { id } });
  if (!user) {
    return res.status(404).json({ error: "user by that id not found." });
  }

  const language = await prisma.languages.findUnique({
    where: { id: languageId },
  });
  if (!language) {
    return res.status(404).json({ error: "language by that id not found." });
  }

  const comic = {
    title,
    page_count: pageCount,
    release_year: releaseYear,
    language_id: languageId,
  };

  const createdComic = await prisma.comics.create({ data: comic });
  res.status(201).json({ data: createdComic });
};

export const updateComic = async (req, res) => {
  const id = Number(req.params.id);
  const { title, pageCount, releaseYear, languageId, deleted } = req.body;

  if (!id) {
    return res.status(400).json({ error: "invalid id provided." });
  }

  if (!title && !pageCount && !releaseYear && !languageId && deleted === undefined) {
    return res
      .status(400)
      .json({ error: "no field provided for updating the comic." });
  }

  const comicExists = await prisma.comics.findUnique({ where: { id } });
  if (!comicExists) {
    return res.status(404).json({ error: "comic not found." });
  }

  const comicUpdate = {};
  if (title) comicUpdate.title = title;
  if (pageCount) comicUpdate.page_count = pageCount;
  if (releaseYear) comicUpdate.release_year = releaseYear;
  if (languageId) comicUpdate.language_id = languageId;
  if (deleted !== undefined) comicUpdate.deleted = deleted;

  const updatedComic = await prisma.comics.update({
    where: { id },
    data: comicUpdate,
  });

  res
    .status(200)
    .json({ message: "successfully updated comic.", data: updatedComic });
};