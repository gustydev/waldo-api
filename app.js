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
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
      errors: {
          messages: [message],
          statusCode,
          stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`App listening on port ${port}`)})
