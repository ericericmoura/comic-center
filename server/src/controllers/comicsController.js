import { prisma } from "../config/database.js";

export const getAllComics = async (req, res) => {
    let {currentPage, itemsPerPage} = req.query;    

    if (!currentPage)
    {
        currentPage  = 1;
    }        
    if (!itemsPerPage)
    {
        itemsPerPage = 10;
    }

    const skip = (currentPage-1) * itemsPerPage;
    
    const comics = await prisma.comics.findMany({
        skip,
        take: itemsPerPage
    })
    if (!comics)
    {
        res.status(404).json({error: "no comics found."});
    }

    res.status(200).json({status: "success", data: comics});
}