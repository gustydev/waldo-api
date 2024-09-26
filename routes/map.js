const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler')

const Map = require('../models/map');
const Score = require('../models/score')
const Character = require('../models/character')

router.get('/list', asyncHandler(async function(req, res, next) {
  const maps = await Map.find();

  res.json(maps);
}));

router.get('/:mapId', asyncHandler(async function(req, res, next) {
  const { leaderboard = false} = req.query; // By default don't return leaderboard

  const populate = (leaderboard ? 'leaderboard ' : '') + 'characters.character';
  const select = (!leaderboard ? '-leaderboard': '');

  try {
    const map = await Map.findById(req.params.mapId).populate({
      path: populate, options: {virtuals: true} // include char images
    }).select(select)

    res.json(map)
  } catch (error) {
    return res.status(404).json({msg: 'Map not found', statusCode: 404})
  }
}))

router.post('/:mapId/score', asyncHandler(async function (req, res, next) {
  const mapId = req.params.mapId;
  const { name, time } = req.body;

  const map = await Map.findById(mapId)

  const score = new Score({
    name: name.length ? name : undefined, // Set name passed by user, or undefined (defaults to anonymous in such case)
    time: time,
    date: new Date(),
    map: map
  })

  await score.save();
  await Map.findByIdAndUpdate(mapId, {
    $push: { leaderboard: score }
  })

  res.json({msg: 'Score submitted!', score, map})
}))

module.exports = router;