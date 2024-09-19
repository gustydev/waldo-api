const express = require('express');
const router = express.Router();

const Game = require('../models/game');
const Map = require('../models/map');

router.post('/new/:mapId', async function (req, res, next) {
    const gameMap = await Map.findById(req.params.mapId)
    const newGame = await new Game({map: gameMap}).save()

    res.json(newGame)
})

router.get('/:gameId', async function(req, res, next) {
    const game = await Game.findById(req.params.gameId)

    res.json(game);
})

router.get('/:gameId/start', async function(req, res, next) {
    // to prevent cheating when refresh page, set variable "started" to true so that player can't reset timer
    const game = await Game.findById(req.params.gameId);
    if (game.finished) {
        return;
    }

    game.started = true;
    game.save();
    res.json({msg: `Game started!`})
})

router.post('/:gameId', async function(req, res, next) {
    const { coordinates, option, time } = req.body;

    const game = await Game.findById(req.params.gameId);

    if (game.finished) {
        res.json({msg: 'Game already finished.'})
        return;
    }

    const map = await Map.findById(game.map._id, 
        { characters: { $elemMatch: { character: option } } }
    )
    const charCoords = map.characters[0].coordinates;

    const char = game.characters.find(c => c.character.toString() === option);

    if ( 
        (coordinates.x >= charCoords.x - 50 && coordinates.x <= charCoords.x + 50) && 
        (coordinates.y >= charCoords.y - 50 && coordinates.y <= charCoords.y + 50) 
    ) {
        if (char.found) {
            res.json({msg: `${char.name} was already found.`})
            return;
        }

        char.found = true;

        if (!game.characters.find(c => c.found !== true)) {
            game.finished = true;
            game.time = time;
        }

        game.save();
        res.json({msg: `Found ${char.name}!`, game});
    } else {
        res.json({msg: `${char.name} is not there! Try again.`})
    }
})

module.exports = router;