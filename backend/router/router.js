const express = require('express');
const router  = express.Router();

const { getArtworks } = require('../controller/controller');
const { getArtiste } = require('../controller/controller');

router.get("/artworks", getArtworks);
router.get("/artiste", getArtiste);

module.exports = router;