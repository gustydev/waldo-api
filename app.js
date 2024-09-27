require('dotenv').config();
const express = require('express');
const app = express();
const createError = require('http-errors');
const cors = require('cors');

const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use(limiter);

const mapRouter = require('./routes/map')
const gameRouter = require('./routes/game')

const mongoose = require('mongoose');
mongoose.set('strictQuery', 'false')

const mongoDB = process.env.MONGODB_URI;

main()
.then(async() => {
  // manual queries go here
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

const corsOptions = {
  // In production, use the front-end URL; in development, accept any
  origin: (process.env.NODE_ENV === 'production') ? process.env.FRONTEND_URL : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}

app.use(cors(corsOptions));

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
