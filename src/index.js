const { port, env } = require('./config/vars');
const logger = require('./config/logger');
const app = require('./config/express');

app.listen(port, () => logger.info(`Server started on port ${port} (${env})`));

module.exports = app;
