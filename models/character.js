const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CharacterSchema = new Schema({
    name: {type: String, required: true}
})

CharacterSchema.virtual('imageUrl').get(function() {
    return `./public/images/characters/${this._id}`;
})

module.exports = mongoose.model('Character', CharacterSchema);