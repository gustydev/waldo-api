const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator');

const Map = require('../models/map');
const Score = require('../models/score')
const Character = require('../models/character')

router.get('/list', asyncHandler(async function(req, res, next) {
  const maps = await Map.find();

  res.json(maps);
}));

router.get('/:mapId', asyncHandler(async function(req, res, next) {
  const { leaderboard = false} = req.query; // By default don't return leaderboard

  const populate = (leaderboard === 'true' ? 'leaderboard ' : '') + 'characters.character';
  const select = (!(leaderboard === 'true') ? '-leaderboard': '');

  try {
    const map = await Map.findById(req.params.mapId).populate({
      path: populate, options: {virtuals: true} // include char images
    }).select(select)

    res.json(map)
  } catch (error) {
    return res.status(404).json({msg: 'Map not found', statusCode: 404})
  }
}))

router.post('/:mapId/score', [
  body('name').optional().trim().isLength({min: 2, max: 30}).withMessage('Name must be between 2 and 30 characters'),
  body('time').isNumeric().withMessage('Time must be numeric'),
  body('password').equals(process.env.SECRET_PASS).withMessage('Unauthorized'),

  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({msg: errors.array()[0].msg, statusCode: 400})
    }

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
  
    res.json({msg: 'Score submitted!'})
  })
]);


module.exports = router;