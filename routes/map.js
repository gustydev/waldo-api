const express = require('express');
const router = express.Router();

const Map = require('../models/map');
const Score = require('../models/score')

router.get('/list', async function(req, res, next) {
  const maps = await Map.find();

  res.json(maps);
});

router.get('/:mapId', async function(req, res, next) {
  const map = await Map.findById(req.params.mapId).populate('leaderboard characters.character')

  res.json(map)
})

router.post('/:mapId/score', async function (req, res, next) {
  const mapId = req.params.mapId;
  const { name, time } = req.body;

  const map = await Map.findById(mapId)

  const score = new Score({
    name: name.length ? name : undefined, // Set name passed by user, or undefined (default: anonymous)
    time: time,
    date: new Date(),
    map: map
  })

  await score.save();
  await Map.findByIdAndUpdate(mapId, {
    $push: { leaderboard: score }
  })

  res.json({msg: 'Score submitted!', score, map})
})

module.exports = router;