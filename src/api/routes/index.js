const express = require('express');
const clientRoutes = require('./client.route');

const router = express.Router();

router.get('/status', (req, res) => res.send('OK'));

router.use('/clients', clientRoutes);

module.exports = router;
