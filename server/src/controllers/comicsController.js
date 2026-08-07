import { prisma } from "../config/database.js";

export const getAllComics = async (req, res) => {
    let {currentPage, itemsPerPage, titleSearch, sortByReleaseYear} = req.query; 

    if (!currentPage)
    {
        currentPage  = 1;
    }        
    if (!itemsPerPage)
    {
        itemsPerPage = 10;
    }

    const skip = (currentPage-1) * itemsPerPage;

    const query = {
      skip,
      take: Number(itemsPerPage),
      where: { AND: [{ deleted: false }] },
    };

    if (sortByReleaseYear)
    {
        query.orderBy = { release_year: sortByReleaseYear };
    }
    if (titleSearch)
    {
        query.where.AND.push({
          title: { contains: titleSearch, mode: "insensitive" },
        });
    }
    
    const comics = await prisma.comics.findMany(query);
    if (!comics)
    {
        res.status(404).json({error: "no comics found."});
    }

    res.status(200).json({status: "success", data: comics});
}