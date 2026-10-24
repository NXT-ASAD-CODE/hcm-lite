const express = require('express');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const { loginLimiter } = require('../middleware/rateLimiters');
const { loginBody, changePasswordBody } = require('../validators/auth.validators');
const ctrl = require('../controllers/auth.controller');

const router = express.Router();

router.post('/login', loginLimiter, validate({ body: loginBody }), ctrl.login);
router.get('/me', authenticate, ctrl.me);
router.post('/change-password', authenticate, validate({ body: changePasswordBody }), ctrl.changePassword);

module.exports = router;