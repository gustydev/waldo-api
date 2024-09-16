const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MapSchema = new Schema({
    name: {type: String, required: true, min: 3, max: 50},
    characters: [{
        character: {type: Schema.Types.ObjectId, required: true, ref: 'Character'},
        coordinates: {
            x: {type: Number, required: true},
            y: {type: Number, required: true}
        }
    }],
    leaderboard: [{type: Schema.Types.ObjectId, ref: 'Record'}]
})

MapSchema.virtual('imageUrl').get(function() {
    return `images/maps/${this._id}`;
})

module.exports = mongoose.model('Map', MapSchema)