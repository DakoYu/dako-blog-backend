const Blog = require('../models/blogSchema');
const catchAsync = require('../utils/catchAsync');



exports. createBlog = catchAsync(async(req, res) => {
    const { title, content, id } = req.body;

    const blog = await Blog.create({
        title: title,
        content: content,
        user: id
    });

    res.status(201).json({
        status: 'success',
        blog
    });
});

exports .deleteBlog = catchAsync(async(req, res) => {
    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: 'success'
    });
});

exports. getAllBlogs = catchAsync(async(req, res) => {
    const blogs = await Blog.find({}).sort({'date': -1});
    res.status(200).json({
        status: 'success',
        length: blogs.length,
        blogs
    });
});