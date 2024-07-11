const express = require("express")
const {handleRegister,handleLogin,handleLogout} = require("../controllers/users");
const router = express.Router();

router.post("/signup",handleRegister);
router.post("/login",handleLogin);

router.get('/logout', handleLogout );

module.exports = router