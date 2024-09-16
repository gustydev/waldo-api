const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MapSchema = new Schema({
    name: {type: String, required: true, min: 3, max: 50},
    characters: [{
        character: {type: Schema.Types.ObjectId, required: true, min: 1, ref: 'Character'},
        coordinates: {
            x: {type: Number, required: true},
            y: {type: Number, required: true}
        }
    }],
    // records: {type: Schema.Types.ObjectId, required: true, ref: 'Records'}
})

MapSchema.virtual('mapUrl').get(function() {
    return `./public/images/maps/${this._id}`;
})

module.exports = mongoose.model('Map', MapSchema)