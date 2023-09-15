const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('../api/routes/v1');
const error = require('../api/middlewares/error');
const { logs } = require('./vars');

const app = express();

app.use(morgan(logs));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use(cors());

app.use(routes);

app.use(error.converter);

app.use(error.notFound);

app.use(error.handler);

module.exports = app;
