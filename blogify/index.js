const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const  http = require('http');
const path = require('path');
const app = express();
const socketService = require('./service/socket');
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
// Serve Quill's CSS and JavaScript files from node_modules
app.use('/highlight', express.static(path.join(__dirname, 'node_modules/highlight.js')));

app.use('/quill', express.static(path.join(__dirname, 'node_modules/quill/dist')));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use('/blog',blogRoute);
app.use('/user', authenticationRoute);
app.use('/', staticRoute);

const io = socketService(server);


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