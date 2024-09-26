const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    map: { type: Schema.Types.ObjectId, required: true, ref: 'Map' },
    characters: [{
        character: { type: Schema.Types.ObjectId, ref: 'Character' },
        found: { type: Boolean, default: false }
    }],
    started: {type: Boolean, default: false},
    finished: { type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now, expires: '3h' } // game session is deleted after 3 hours 
});

GameSchema.pre('save', async function(next) {
    if (this.characters && this.characters.length > 0) {
        return next();
    }

    const map = await mongoose.model('Map').findById(this.map).populate('characters.character');

    this.characters = map.characters.map(c => ({
        character: c.character._id,
        found: false
    }));

    next();
});

module.exports = mongoose.model('Game', GameSchema);