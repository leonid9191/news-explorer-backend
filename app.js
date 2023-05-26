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

const allowedOrigins = [
  "https://leo-news.mooo.com",
  "http://leo-news.mooo.com",
  "http://localhost:3000", // Use the port your frontend is served on
];
app.use(cors({ origin: allowedOrigins }));

// app.use(cors({origin: '*'}));
app.options('*', cors()); // enable requests for all routes


// app.use(helmet());

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
