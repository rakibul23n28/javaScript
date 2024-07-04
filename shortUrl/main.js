const express = require("express");

const urlRouter = require("./routes/url");
const homeRouter = require("./routes/staticRoute");
const {connectToMongoDB} = require("./connection");

const app = express();
const port = 3000;
const host = '192.168.0.112';

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use('/url', urlRouter);
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