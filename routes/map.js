const express = require('express');
const router = express.Router();

const Map = require('../models/map');

router.get('/list', async function(req, res, next) {
  const maps = await Map.find();

  res.json(maps);
});

router.get('/:mapId', async function(req, res, next) {
  const map = await Map.findById(req.params.mapId)

  res.json(map)
})

module.exports = router;