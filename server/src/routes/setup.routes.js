const express = require('express');
const validate = require('../middleware/validate');
const { setupBody } = require('../validators/setup.validators');
const ctrl = require('../controllers/setup.controller');

const router = express.Router();

router.get('/status', ctrl.status);
router.post('/', validate({ body: setupBody }), ctrl.create);

module.exports = router;