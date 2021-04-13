const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const { genre } = req.query;
    console.log('Genre: ', genre);
    res.send("You won't get products just yet");
});

module.exports = router;
