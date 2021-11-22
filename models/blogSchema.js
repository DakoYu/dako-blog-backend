const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'blog must have a title']
    },
    content: {
        type: String,
        required: [true, 'blog must have a content']
    },
    date: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Blog must belong to a user']
    },
},
    {
        toJSON: {virtuals:true},
        toObject: {virtuals:true}
    }
);

blogSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;