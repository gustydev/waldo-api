require('dotenv').config();
const express = require('express');
const app = express();
const createError = require('http-errors');
const cors = require('cors');

const mapRouter = require('./routes/map')
const gameRouter = require('./routes/game')

const mongoose = require('mongoose');
mongoose.set('strictQuery', 'false')

const mongoDB = process.env.MONGODB_URI;

main()
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

const corsOptions = {
  origin: (process.env.NODE_ENV === 'production') ? process.env.FRONTEND_URL : '*'
  // In production, use the front-end URL; in development, accept any
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
