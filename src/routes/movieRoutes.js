const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Here are your movies!' });
});

module.exports = router;