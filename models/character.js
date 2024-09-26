const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CharacterSchema = new Schema({
    name: {type: String, required: true}
})

CharacterSchema.virtual('imageUrl').get(function() {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/images/characters/${this._id}.jpeg`;
})

CharacterSchema.set('toJSON', { virtuals: true})

module.exports = mongoose.model('Character', CharacterSchema);