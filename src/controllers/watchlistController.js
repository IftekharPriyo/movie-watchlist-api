const prisma = require("../config/db").prisma;

const addToWatchlist = async (req, res) => {
  const { movieId, status, rating, notes } = req.body;
  // verify if movie exits in the database
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  // check if already added to the watchlist
  const existingInWatchlist = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId: movieId,
      },
    },
  });

  if (existingInWatchlist) {
    return res.status(400).json({ error: "Movie already in watchlist" });
  }

  const watchlistEntry = await prisma.watchlistItem.create({
    data: {
      userId: req.user.id,
      movieId,
      status: status || "PLANNED",
      rating,
      notes,
    },
  });

  res.status(201).json({
    status: "success",
    data: watchlistEntry,
  });
};

const deleteWatchlistItem = async (req, res) => {
  const { movieId } = req.params;

  console.log("Deleting movieId:", movieId, "for userId:", req.user.id);

  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId: movieId,
      },
    },
  });

  if (!watchlistItem) {
    return res.status(404).json({ error: "Item not found in watchlist" });
  }

  await prisma.watchlistItem.delete({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId: movieId,
      },
    },
  });

  res.status(200).json({
    status: "success",
    message: "Item removed from watchlist",
  });
};

const updateWatchlistItem = async (req, res) => {
  const { movieId } = req.params;
  const { status, rating, notes } = req.body;
  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: { userId: req.user.id, movieId: movieId },    
    },
  }); 
    if (!watchlistItem) {
    return res.status(404).json({ error: "Item not found in watchlist" });
  }
  // update
  // make it optional to update only one field at a time
  const updatedItem = await prisma.watchlistItem.update({
    where: {
      userId_movieId: { userId: req.user.id, movieId: movieId },  
    },
    data: {
      status: status || watchlistItem.status,
      rating: rating || watchlistItem.rating,
      notes: notes || watchlistItem.notes,
    },
  }); 

  res.status(200).json({
    status: "success",
    data: updatedItem,
  });
}

exports.addToWatchlist = addToWatchlist;
exports.deleteWatchlistItem = deleteWatchlistItem;
exports.updateWatchlistItem = updateWatchlistItem;
