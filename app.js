const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
const apiRouter = require('./routes/apiRouter');
const userRouter = require('./routes/userRouter');
const blogRouter = require('./routes/blogRouter');

app.use(morgan('dev'));

app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    console.log('test');
    next();
});

app.use('/api', apiRouter);
app.use('/api/user', userRouter);
app.use('/api/blog', blogRouter);

module.exports = app;
