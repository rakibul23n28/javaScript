const express = require("express");
const cookieParser = require('cookie-parser');

const urlRouter = require("./routes/url");
const homeRouter = require("./routes/staticRoute");
const userRouter = require("./routes/users");
const {connectToMongoDB} = require("./connection");
const {restrictToLoggedInUserOnly,checkAuth} = require("./middlewares/auth");

const app = express();
const port = 3000;
const host = '192.168.0.112';

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.json());

app.use('/user', userRouter);
app.use('/url',restrictToLoggedInUserOnly, urlRouter);
app.use('/',checkAuth, homeRouter);

connectToMongoDB("mongodb://localhost:27017/shortUrl")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    })



app.listen(port,host, () => {
    console.log(`Server is running on http://${host}:${port}`);
})