const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
dotenv.config({path: './config.env'});

const DB = 'mongodb+srv://dako:csolyyj355@cluster0.rqerh.mongodb.net/instagram?retryWrites=true&w=majority';

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('DB connection success!');
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});
