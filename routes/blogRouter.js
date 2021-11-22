const express = require('express');
const blogController = require('../controllers/blogController');
const router = express.Router();

router.get('/', blogController.getAllBlogs);
router.delete('/:id', blogController.deleteBlog);
router.post('/create', blogController.createBlog);


module.exports = router;