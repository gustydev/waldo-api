const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler')

const Game = require('../models/game');
const Map = require('../models/map');
const Character = require('../models/character');
const { validationResult, body, param } = require('express-validator');

router.post('/new/:mapId', asyncHandler(async function (req, res, next) {
    const gameMap = await Map.findById(req.params.mapId).lean();
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

router.put('/:gameId/start', [
    param('gameId').custom(async (value) => {
        try {
            await Game.findById(value);
        } catch (error) {
            throw error || new Error("Game not found")
        }
        return true
    }),

    asyncHandler(async function(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({msg: errors.array()[0].msg, statusCode: 400})
        }

        // to prevent cheating when refresh page, set variable "started" to true so that player can't reset timer
        const game = await Game.findById(req.params.gameId);
        if (!game.started) {
            game.started = true;
            game.save();
    
            return res.json({msg: `Game started! Expires after 3 hours, or upon leaving/refreshing the page`})
        }
    })
]);

router.post('/:gameId/guess', [
    body('coordinates').isObject().withMessage('Coordinates must be in object format')
    .custom(coords => {
        if (typeof coords.x !== 'number' || typeof coords.y !== 'number') {
            throw new Error('Coordinates must be numeric')
        }
        return true;
    }),
    body('option').custom(async (value) => {
        try {
            const char = await Character.findById(value);
        } catch (err) {
            throw new Error('Character not found')
        }
        return true
    }),
    param('gameId').custom(async (value) => {
        try {
            const game = await Game.findById(value);
            if (game.finished) {
                throw new Error("Game already finished")
            }
        } catch (error) {
            throw new Error("Game not found")
        }

        return true
    }),

    asyncHandler(async function(req, res, next) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({msg: errors.array()[0].msg, statusCode: 400})
        }

        const { coordinates, option } = req.body;
    
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
            if (char.found) {
                return res.json({msg: `${char.character.name} already found.`})
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
    })
]);

router.delete('/:gameId', asyncHandler(async function (req, res, next) {
    try {
        await Game.findByIdAndDelete(req.params.gameId)
        res.json({msg: `Game session of id ${req.params.gameId} deleted`});
    } catch {
        throw new Error('Game not found')
    }
}))

module.exports = router;