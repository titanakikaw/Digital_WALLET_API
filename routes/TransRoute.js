const express = require('express');
// const AuthController = require('../controllers/AuthController')
const TransController = require('../controllers/TransContoller');
const { verifyToken } = require('../utils/Authentication');

const TransRoute = express.Router();
TransRoute.get('/history/:userId', verifyToken, TransController.getHistory)
TransRoute.get('/balance', verifyToken, TransController.checkBalance)
TransRoute.put('/deposit', verifyToken, TransController.depositBalance)
TransRoute.put('/debit', verifyToken, TransController.debitBalance)

module.exports = TransRoute