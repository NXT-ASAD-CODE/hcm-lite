const express = require('express');

const router = express.Router();

router.use('/health', require('./health.routes'));
router.use('/setup', require('./setup.routes'));
router.use('/auth', require('./auth.routes'));

module.exports = router;