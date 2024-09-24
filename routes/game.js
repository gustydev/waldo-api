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
    const game = await Game.findById(req.params.gameId).populate('characters.character');
    if (!game || game.started) {
        res.status(400).json({msg: 'Game session not found or expired! Please start a new game.'})
        return;
    }

    res.json(game);
}))

router.get('/:gameId/start', asyncHandler(async function(req, res, next) {
    // to prevent cheating when refresh page, set variable "started" to true so that player can't reset timer
    const game = await Game.findById(req.params.gameId);
    if (game.finished) {
        return;
    }

    game.started = true;
    game.save();
    res.json({msg: `Game started!`})
}))

router.post('/:gameId', asyncHandler(async function(req, res, next) {
    const { coordinates, option, time } = req.body;

    const game = await Game.findById(req.params.gameId).populate('characters.character');

    if (game.finished) {
        res.json({msg: 'Game already finished.'})
        return;
    }

    const map = await Map.findById(game.map._id, 
        { characters: { $elemMatch: { character: option } } }
    )
    const charCoords = map.characters[0].coordinates;

    const char = game.characters.find(c => c.character._id.toString() === option);

    if ( 
        (coordinates.x >= charCoords.x - 50 && coordinates.x <= charCoords.x + 50) && 
        (coordinates.y >= charCoords.y - 50 && coordinates.y <= charCoords.y + 50) 
    ) {
        if (char.found) {
            res.json({msg: `${char.character.name} was already found.`})
            return;
        }

        char.found = true;

        if (!game.characters.find(c => c.found !== true)) {
            game.finished = true;
            game.time = time;
        }

        game.save();
        res.json({msg: `Found ${char.character.name}!`, game});
    } else {
        res.json({msg: `${char.character.name} is not there! Try again.`})
    }
}))

router.delete('/:gameId', asyncHandler(async function (req, res, next) {
    await Game.findByIdAndDelete(req.params.gameId)

    res.json({msg: `Game session #${req.params.gameId} deleted`});
}))

module.exports = router;