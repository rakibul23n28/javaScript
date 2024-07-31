const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const  http = require('http');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);


const {checkForAuthentication} = require('./middlewares/authentication');

const staticRoute = require('./routes/staticRouter');
const authenticationRoute = require('./routes/authentication');
const blogRoute = require('./routes/blog');


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(checkForAuthentication('token'));

// design file
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use('/blog',blogRoute);
app.use('/user', authenticationRoute);
app.use('/', staticRoute);


mongoose.connect("mongodb://localhost:27017/blogify", {

}).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.log(err);
});

// server listening
server.listen(PORT, () => {
  console.log(`The app start on http://localhost:${PORT}`);
});