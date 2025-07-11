const express = require('express')
const { signup, login } = require('../controllers/authcon')
const arouter = express.Router()

arouter.post("/signup",signup)
arouter.post("/login",login)


module.exports=arouter