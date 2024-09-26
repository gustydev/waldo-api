require('dotenv').config();
const express = require('express');
const app = express();
const createError = require('http-errors');
const cors = require('cors');

const mapRouter = require('./routes/map')
const gameRouter = require('./routes/game')

const Character = require('./models/character')
const Map = require('./models/map');
const Game = require('./models/game')
const Score = require('./models/score')

const mongoose = require('mongoose');
mongoose.set('strictQuery', 'false')

const mongoDB = process.env.MONGODB_URI;

main()
.then(async () => {
  // await Game.deleteMany();
  // await Score.deleteMany();
  // await Map.deleteOne({name: 'PXLCON (Jimmy Something)'});

  // const chars = [
  //   {character: await Character.findOne({name: 'Waldo'}), coordinates: {x: 760, y: 200}},
  //   {character: await new Character({name: 'Magikarp'}).save(), coordinates: {x: 910, y: 694}},
  //   {character: await new Character({name: 'Goku'}).save(), coordinates: {x: 171, y: 143}},
  //   {character: await new Character({name: 'Meat Boy'}).save(), coordinates: {x: 1100, y: 120}},
  //   {character: await new Character({name: 'Sonic'}).save(), coordinates: {x: 931, y: 834}},
  //   {character: await new Character({name: 'Sniper'}).save(), coordinates: {x: 1113, y: 284}},
  // ]

  // const map = new Map({
  //   name: 'PXLCON (Jimmy Something)',
  //   characters: chars
  // })
  // map.save();
  // console.log(map)
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

app.use(cors()); // Later change to only allow the game website!!

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

app.use('/api/map', mapRouter)
app.use('/api/game', gameRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Global error handler
app.use((err, req, res, next) => {
  console.log(err)
  const statusCode = err.statusCode || 500;
  const msg = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    msg,
    statusCode
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`App listening on port ${port}`)})
