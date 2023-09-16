const express = require('express');
const { validate } = require('express-validation');
const controller = require('../controllers/client.controller');
const { validateClient } = require('../schemas/client.schema');

const router = express.Router();

router
  .route('/validate')
  .post(
    validate(validateClient),
    controller.validate
  );

module.exports = router;
