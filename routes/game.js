const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler')

const Game = require('../models/game');
const Map = require('../models/map');

router.post('/new/:mapId', asyncHandler(async function (req, res, next) {
    const gameMap = await Map.findById(req.params.mapId)
    const newGame = await new Game({map: gameMap}).save()

    res.json(newGame)
}))

router.get('/:gameId', asyncHandler(async function(req, res, next) {
    try {
        const game = await Game.findById(req.params.gameId)
        .populate({path: 'characters.character', options: {virtuals: true}}); // need to include char images in game as well
        if (game.started) {
            return res.status(400).json({msg: 'Game session expired! Please start a new game.'})
        }

        res.json(game);
    } catch (err) {
        res.status(404).json({msg: 'Game not found', statusCode: 404})
    }
}))

router.get('/:gameId/start', asyncHandler(async function(req, res, next) {
    // to prevent cheating when refresh page, set variable "started" to true so that player can't reset timer
    const game = await Game.findById(req.params.gameId);
    if (game.finished || game.started) {
        return;
    }

    game.started = true;
    game.save();
    res.json({msg: `Game started! Expires after 3 hours, or upon leaving/refreshing the page`})
}))

router.post('/:gameId', asyncHandler(async function(req, res, next) {
    const { coordinates, option } = req.body;

    try {
        const game = await Game.findById(req.params.gameId).populate('characters.character');

        const map = await Map.findById(game.map._id, 
            { characters: { $elemMatch: { character: option } } }
        )
        const charCoords = map.characters[0].coordinates;
    
        const char = game.characters.find(c => c.character._id.toString() === option);
    
        if ( 
            (coordinates.x >= charCoords.x - 50 && coordinates.x <= charCoords.x + 50) && 
            (coordinates.y >= charCoords.y - 50 && coordinates.y <= charCoords.y + 50) 
        ) {
            if (char.found || game.finished) {
                return res.json({msg: `${char.character.name} already found, or game finished.`})
            }
    
            char.found = true;
    
            if (!game.characters.find(c => c.found !== true)) {
                game.finished = true;
            }
    
            game.save();
            res.json({msg: `Found ${char.character.name}! ${game.finished ? 'All characters found!' : ''}`, found: true, game});
        } else {
            res.json({msg: `${char.character.name} is not there! Try again.`, found: false})
        }
    } catch (err) {
        return res.status(400).json({msg: 'Game session expired! Please start a new game.', statusCode: 400})
    }
}))

router.delete('/:gameId', asyncHandler(async function (req, res, next) {
    await Game.findByIdAndDelete(req.params.gameId)

    res.json({msg: `Game session of id ${req.params.gameId} deleted`});
}))

module.exports = router;