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

router.post('/:gameId', async function(req, res, next) {
    const { coordinates, option } = req.body;

    const game = await Game.findById(req.params.gameId)

    if (game.finished) {
        res.json({error: 'Game already finished.'})
    }

    const map = await Map.findById(game.map._id, 
        { characters: { $elemMatch: { _id: option } } }
    )
    const charCoords = map.characters[0].coordinates;

    if ( 
        (coordinates.x >= charCoords.x - 50 && coordinates.x <= charCoords.x + 50) && 
        (coordinates.y >= charCoords.y - 50 && coordinates.y <= charCoords.y + 50) 
    ) {
        const char = game.characters.find(c => c.character.toString() === option);
        char.found = true;

        if (!game.characters.find(c => c.found !== true)) {
            game.finished = true;
        }

        game.save();
        res.json(game);
    } else {
        res.json({error: 'Invalid position! Please try again'})
    }
})

module.exports = router;