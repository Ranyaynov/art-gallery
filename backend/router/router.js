const express = require('express');
const router  = express.Router();

const { getArtworks } = require("../controller/controller.js")

router.get("artworks", getArtworks)