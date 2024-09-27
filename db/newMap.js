require('dotenv').config()
const mongoose = require('mongoose');
mongoose.set('strictQuery', 'false')

const mongoDB = process.env.MONGODB_URI;

const Map = require('../models/map');
const Character = require('../models/character')

async function newMap() {
    try {
        const characters = [
            {character: await Character.findOne({name: 'Waldo'}), coordinates: {x: 550, y: 600}}, // using existing character
            {character: await Character.findOne({name: 'Odlaw'}), coordinates: {x: 755, y: 760}},
            {character: await Character.findOne({name: 'Wizard'}), coordinates: {x: 840, y: 625}},
            {character: await Character.findOne({name: 'Wilma'}), coordinates: {x: 559, y: 485}},
            // {character: await new Character({name: 'Char Name'}).save(), coordinates: {x: 0, y: 0}} // Making new character
        ]

        const map = new Map({
            name: 'Town (Waldo)',
            characters: characters
        })

        // await map.save();
        // uncomment above to save it, comment to just preview
        return console.log(map)
        // after it's done, add images in public/images according to map or char id's
    } catch (error) {
        console.error(error)
    }
}

async function main() {
    await mongoose.connect(mongoDB);
    console.log('connected')
    await newMap()
    console.log('closing mongoose')
    mongoose.connection.close()
}

main()
.catch((err) => console.log(err))

