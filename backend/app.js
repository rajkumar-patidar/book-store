const express = require('express');
const path = require('path');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const multer = require('multer');
const fileUpload = require('express-fileupload');
const app = express();

const errorMiddleware = require("./middleware/error");

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());
app.use(multer().any());

// Serve static files from the "public" directory
//app.use(express.static('uploads'));
app.use(express.static('public'));

//Routes Import 
const book = require('./routes/bookRoute');
const user = require("./routes/userRoute");

app.use("/", book);
app.use("/", user);

//app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Middleware for Errors
app.use(errorMiddleware);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

module.exports = app;
