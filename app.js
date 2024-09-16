require('dotenv').config();
const express = require('express');
const app = express();
const indexRouter = require('./routes/index')

const Character = require('./models/character')
const Map = require('./models/map');

const mongoose = require('mongoose');
mongoose.set('strictQuery', 'false')

const mongoDB = process.env.MONGODB_URI;

main()
.then(async () => {
    await Map.deleteMany();

    const characters = [
        await Character.findOne({name: 'Waldo'}),
        await Character.findOne({name: 'Odlaw'}),
        await Character.findOne({name: 'Wizard Oldbeard'})
    ]

    const charArray = [
        {character: characters[0], coordinates: {x: 1204, y: 59}},
        {character: characters[1], coordinates: {x: 1152, y: 235}},
        {character: characters[2], coordinates: {x: 371, y: 338}},
    ]

    const newMap = new Map({
        name: 'Dodgeball',
        characters: charArray
    })

    const pog = await newMap.save();
    console.log(pog)
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

app.use('/', indexRouter)

const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`App listening on port ${port}`)})
