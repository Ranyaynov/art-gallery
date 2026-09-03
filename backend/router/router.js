const express = require('express');
const router  = express.Router();

const { getArtworks } = require('../controller/controller');
const { getArtist } = require('../controller/controller');

router.get("/artworks", getArtworks);
router.get("/artiste", getArtist);

module.exports = router;