const { prisma } = require("../config/db.js");

const addToWatchList = async (req, res) => {
    const { movieId, status, rating, notes } = req.body;

    // Verify movie exists
    const movie = await prisma.movie.findUnique({
        where: { id: movieId },
    })

    if (!movie) {
        return res.status(404).json({ error: "Movie Not Found" });
    }

    // Check if it is already added
    const existingInWatchList = await prisma.watchListItem.findUnique({
        where: {
            userId_movieId: {
                userId: req.user.id,
                movieId: movieId,
            }
        },
    });

    if(existingInWatchList){
        return res.status(400).json({ error : "Movie already in the watchlist" });
    }

    const watchlistItem = await prisma.watchListItem.create({
        data: {
            userId: req.user.id,
            movieId,
            status : status || "PLANNED",
            rating,
            notes,
        },
    });

    res.status(201).json({
        status : "Success",
        data: {
            watchlistItem,
        },
    });
};

/**
 * Remove Movie From watchlist
 * Deletes the Watchlist Item
 * Ensures only the owner can perform the delete action
 * Requires the auth middleware
 */
const removeFromWatchList = async(req, res) => {
    const watchlistItem = await prisma.watchListItem.findUnique({
        where : { id : req.params.id},
    });

    if(!watchlistItem){
        return res.status(404).json({ error : "Watchlist item not found" });
    }

    if(watchlistItem.userId !== req.user.id){
        return res.status(403).json({ error : "Not allowed to delete this watchlist Item"});
    }

    await prisma.watchListItem.delete({
        where : { id : req.params.id },
    });

    res.status(200).json({
        status: "Success",
        message : "Movie removed from watchlist",
    });
}


/**
 * Updates a watchlistItem
 * Ensures only the owner can perform the update action
 * Requires the auth middleware
 */
const updateWatchListItem = async(req, res) => {
    const { status, rating, notes } = req.body;

    const watchlistitem = await prisma.watchListItem.findUnique({
        where : { id : req.params.id},
    })

    if(!watchlistitem){
        return res.status(400).json({ error : "Watchlist item not found" });
    }

    if(req.user.id !== watchlistitem.userId){
        return res.status(403).json({ error : "Not allowed to update this watchlist Item"});
    }

    const updatedData = {};
    if(status !== undefined) updatedData.status = status.toUpperCase();
    if(rating !== undefined) updatedData.rating = rating;
    if(notes !== undefined) updatedData.notes = notes;

    const updatedItem = await prisma.watchListItem.update({
        where : { id : req.params.id },
        data : updatedData,
    });

    return res.status(200).json({
        status : "Success",
        message : "WatchListItem updated successfully",
        data : updatedItem
    })
};

module.exports = { addToWatchList, removeFromWatchList, updateWatchListItem }
