const express = require('express');
const apiController = require('../controllers/apiController');
const router = express.Router();

router.get('/:user', apiController.user);
router.get('/:user/img', apiController.userImage);
router.patch('/updatepassword', apiController.updatePassword);
router.patch('/updateme', apiController.uploadUserPhoto, apiController.resizeUserPhoto, apiController.updateMe);

module.exports = router;