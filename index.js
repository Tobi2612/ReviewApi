// Import express
const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const multer = require('multer')
const mongoose = require('mongoose')

const cors = require('cors');

//const cookieParser = require('cookie-parser');
require('dotenv').config();

mongoose.connect(process.env.DB_CONNECT,
    {useNewUrlParser: true,
    useUnifiedTopology: true},
    () => console.log('connected to db!')
);

// middlewares
app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


var port = process.env.PORT || 8080;

app.use('/api/user', require('./routes/index.js'));


app.listen(port, function () {
     console.log("Running ReviewApi on port " + port);
});