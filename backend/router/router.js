const express = require('express');
const router  = express.Router();

const { getArtworks } = require('../controller/controller');

router.get("/artworks", getArtworks);

module.exports = router;