const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  addToWatchlist,
  deleteWatchlistItem,
  updateWatchlistItem
} = require('../controllers/watchlistController');

const router = express.Router();

router.use(authMiddleware);

router.post('/', addToWatchlist);

router.delete('/delete/:movieId', deleteWatchlistItem);

router.put('/update/:movieId', updateWatchlistItem);

module.exports = router;
