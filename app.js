require('dotenv').config();
const express = require('express');
const app = express();
const mapRouter = require('./routes/map')
const gameRouter = require('./routes/game')

const Character = require('./models/character')
const Map = require('./models/map');
const Game = require('./models/game')

const mongoose = require('mongoose');
mongoose.set('strictQuery', 'false')

const mongoDB = process.env.MONGODB_URI;

main()
.then(async () => {
    // await Game.deleteMany();

    // const mappy = await Map.findOne();
    // const gayme = new Game({map: mappy})
    // const saved = await gayme.save();

    // console.log(saved);
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

app.use('/api/map', mapRouter)
app.use('/api/game', gameRouter)

const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`App listening on port ${port}`)})
