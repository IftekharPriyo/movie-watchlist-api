const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  addToWatchlist,
  deleteWatchlistItem,
  updateWatchlistItem,
  getWatchlist,
  getWatchlistItem,
} = require('../controllers/watchlistController');

const router = express.Router();

router.use(authMiddleware);

router.post('/add', addToWatchlist);

router.delete('/delete/:movieId', deleteWatchlistItem);

router.put('/update/:movieId', updateWatchlistItem);

router.get('/list', getWatchlist);

router.get('/movie/:movieId', getWatchlistItem);


module.exports = router;
