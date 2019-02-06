const express = require('express');
const router = express.Router();

router.use('/', require('./public'));
router.use('/auth', require('./auth'));
router.use('/inventory', require('./inventory'));
router.use('/orders', require('./orders'));

module.exports = router;
