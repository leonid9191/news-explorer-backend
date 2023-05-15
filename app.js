const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const { errorLogger, requestLogger } = require('./middleware/logger');

const { PORT = 3000, NODE_ENV, DB_MONGO } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 100000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const app = express();
mongoose.connect(
  NODE_ENV === 'production' ? DB_MONGO : 'mongodb://localhost:27017/news',
);

app.use(requestLogger);
app.use(limiter);
app.use(cors());
app.options('*', cors()); // enable requests for all routes
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
