const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
    name: {type: String, min: 2, max: 30, default: 'Anonymous'},
    time: {type: Number, required: true},
    date: {type: Date, required: true},
    map: {type: Schema.Types.ObjectId, required: true, ref: 'Map'}
})

module.exports = mongoose.model('Score', ScoreSchema);