const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, '../../.env'),
  example: path.join(__dirname, '../../.env.example'),
});

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  clientRules: {
    connections: {
      monofasico: process.env.MONOFASICO_CONNECTION_VALUE || 400,
      bifasico: process.env.BIFASICO_CONNECTION_VALUE || 500,
      trifasico: process.env.TRIFASICO_CONNECTION_VALUE || 750,
    },
    co2Fare: process.env.CO2_FARE || 84,
  }
};
