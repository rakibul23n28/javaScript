const express = require("express")
const {handleRegister,handleLogin} = require("../controllers/users");
const router = express.Router();

router.post("/",handleRegister);
router.post("/login",handleLogin);

module.exports = router