import z from "zod"

export const createComicValidator = z.object({
  title: z.string("Title must be a valid string"),
  pageCount: z
    .number("Page count must be a number")
    .int("Page count must be an integer"),
  releaseYear: z
    .number("Release Year must be a number")
    .int("Release Year must be an integer")
    .min(1800, "A comic can't be that old")
    .max(new Date().getFullYear(), "A comic can't be from the future"),
  languageId: z
    .number("Language Id must be a number")
    .int("Language Id must be an integer")
});
