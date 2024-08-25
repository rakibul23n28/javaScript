const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const  http = require('http');
const path = require('path');
const session = require('express-session');
const app = express();
const socketService = require('./service/socket');
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);


const {checkForAuthentication,checkAuthenticate,restrictTo} = require('./middlewares/authentication');

const staticRoute = require('./routes/staticRouter');
const authenticationRoute = require('./routes/authentication');
const blogRoute = require('./routes/blog');
const ApiRoute = require('./routes/api');
const AdminRoute = require('./routes/admin');
const activityRouter = require('./routes/activity');


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(checkForAuthentication('token'));
// Session setup
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// design file
// Serve Quill's CSS and JavaScript files from node_modules
app.use('/highlight', express.static(path.join(__dirname, 'node_modules/highlight.js')));

app.use('/quill', express.static(path.join(__dirname, 'node_modules/quill/dist')));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use('/activity',checkAuthenticate, activityRouter);
app.use('/admin',checkAuthenticate,restrictTo('admin'), AdminRoute);
app.use('/blog',blogRoute);
app.use('/user', authenticationRoute);
app.use('/api', ApiRoute);
app.use('/', staticRoute);

const io = socketService(server);


mongoose.connect("mongodb://localhost:27017/blogify", {

}).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.log(err);
});

// server listening
server.listen(PORT,() => {
  console.log(`The app start on http://localhost:${PORT}`);
});