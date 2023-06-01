const express = require('express');
const AuthController = require('../controllers/AuthController')
const AuthRouter = express.Router();

AuthRouter.post('/login', AuthController.loginUser)
AuthRouter.post('/registerUser', AuthController.registerUser)

module.exports = AuthRouter