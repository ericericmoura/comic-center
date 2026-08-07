import "../env.js";
import { prisma } from "../database.js";
import { faker } from "@faker-js/faker";

const createRandomComic = () => {
    return {
        title       : faker.book.title(),
        page_count  : faker.number.int({min: 20, max: 400}),
        release_year: faker.number.int({min: 1925, max: 2026}),
        language_id: 0
    }
}

const seedingCount = 2000;

const createComics = async () => {
    console.log("\nSeeding comics...");
    const languages    = await prisma.languages.findMany();
    const languagesIds = languages.map((l) => l.id);
    
    for (let i = 0; i < seedingCount; i++)
    {
        const comic = createRandomComic();
        const randomLanguageId = languagesIds.at(Math.random() * languagesIds.length);

        comic.language_id = randomLanguageId;
        await prisma.comics.create({ data: comic });
    }
    console.log("\nFinish seeding comics.");

    process.exit(0);
}

createComics();