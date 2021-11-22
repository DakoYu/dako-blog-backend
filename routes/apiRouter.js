const express = require('express');
const apiController = require('../controllers/apiController');
const router = express.Router();

router.post('/login', apiController.login);
router.post('/signup', apiController.signup);
router.post('/validate', apiController.protect);

module.exports = router;