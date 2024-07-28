const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');


const {checkForAuthentication} = require('./middlewares/authentication');

const staticRoute = require('./routes/staticRouter');
const authenticationRoute = require('./routes/authentication');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(checkForAuthentication('token'));

// design file
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use('/', staticRoute);
app.use('/', authenticationRoute);




mongoose.connect("mongodb://localhost:27017/blogify", {

}).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.log(err);
});

// server listening
app.listen(PORT, () => {
  console.log(`The app start on http://localhost:${PORT}`);
});
