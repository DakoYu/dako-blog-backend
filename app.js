const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const apiRouter = require('./routes/apiRouter');
const userRouter = require('./routes/userRouter');
const blogRouter = require('./routes/blogRouter');

app.use(cors());

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use('/api', apiRouter);
app.use('/api/user', userRouter);
app.use('/api/blog', blogRouter);

module.exports = app;