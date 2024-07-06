const express = require("express");
const cookieParser = require('cookie-parser');

const urlRouter = require("./routes/url");
const homeRouter = require("./routes/staticRoute");
const userRouter = require("./routes/users");
const {connectToMongoDB} = require("./connection");
const {checkForAuthentication,restrictTo} = require("./middlewares/auth");

const app = express();
const port = 3000;
const host = 'localhost';

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.json());
app.use(checkForAuthentication);

app.use('/user', userRouter);
app.use('/url',restrictTo(['NORMAL','ADMIN']), urlRouter);
app.use('/', homeRouter);

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