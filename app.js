const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { limiter } = require('./middleware/limiter');
const routes = require('./routes');
const { errorLogger, requestLogger } = require('./middleware/logger');

const { PORT = 3000, NODE_ENV, DB_MONGO } = process.env;

const app = express();
mongoose.connect(
  NODE_ENV === 'production' ? DB_MONGO : 'mongodb://localhost:27017/news',
);

app.use(requestLogger);
// app.use(limiter);
app.use(cors());
app.options('*', cors()); // enable requests for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://localhost:3000');
  res.header(
    'Access-Control-Allow-Origin',
    'https://api.leo-news.mooo.com',
  );
  res.header(
    'Access-Control-Allow-Origin',
    'https://leo-news.mooo.com',
  );
  res.header('Access-Control-Request-Methods', 'GET,HEAD,PATCH,POST,DELETE');
  res.header(
    'Access-Content-Control-Request-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(routes);
app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, () => {
  console.log('Listening at PORT 3000');
});
