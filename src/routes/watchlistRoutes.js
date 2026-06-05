const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { addToWatchlist } = require('../controllers/watchlistController');

const router = express.Router();

router.use(authMiddleware);

router.post('/', addToWatchlist);

module.exports = router;