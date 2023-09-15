const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, '../../.env'),
  example: path.join(__dirname, '../../.env.example'),
});

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};
