const express = require("express");
const mongoose = require("mongoose");
const User = require('./models/user');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// design file
app.use(express.static("public"));
app.set("view engine", "ejs");

// routers
app.get("/", (req, res) => {
  res.render("index",{ title: 'Share Your Secret HAHA' });
});
app.get('/signup', (req, res) => {
  res.render('signup',{ title: 'Sign Up' });
});

app.post('/signup', async (req, res) => {
  const {firstName,lastName,email,password} = req.body;
  if(!firstName || !lastName || !email || !password){
    return res.status(400).send('All fields are required');
  }
  await User.create({
    firstName,
    lastName,
    email,
    password
  });

  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login',{ title: 'Login' });
});

app.post('/login', async (req, res) => {
  const {email,password} = req.body;
  if(!email || !password){
    return res.status(400).send('All fields are required');
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isValidPassword(password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).redirect('/');

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

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
