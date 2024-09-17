const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecordSchema = new Schema({
    name: {type: String, required: true, min: 2, max: 30, default: 'Anonymous'},
    time: {type: Number, required: true},
    date: {type: Date, required: true},
    map: {type: Schema.Types.ObjectId, required: true, ref: 'Map'}
})

module.exports = mongoose.model('Record', RecordSchema);