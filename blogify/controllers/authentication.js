const User = require('../models/user');
const { createTokenForUser} = require('../service/authentication')

async function handleSignUp(req, res) {
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
  }

  async function handleLogin(req, res) {
    const {email,password} = req.body;
    if(!email || !password){
      return res.status(400).send('All fields are required');
    }
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).render('login',{
          title: 'Login',
          error: 'Incorrect Email '
        });
      }
  
      if (!user.isValidPassword(password)) {
        return res.status(401).render('login',{
          title: 'Login',
          error: 'Incorrect Password'
        });
      }
  
      const token = createTokenForUser(user);
      res.cookie('token',token);
  
      res.status(200).redirect('/');
  
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  function handleLogout(req,res){
    res.clearCookie('token').redirect('/');

  }

  module.exports = {
    handleLogin,
    handleSignUp,
    handleLogout,
  }