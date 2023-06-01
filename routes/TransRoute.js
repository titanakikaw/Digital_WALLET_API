const express = require('express');
const TransController = require('../controllers/TransContoller');
const { verifyToken } = require('../utils/Authentication');

const TransRoute = express.Router();
TransRoute.get('/history/:userId', verifyToken, TransController.getHistory)
TransRoute.get('/balance/:userId', verifyToken, TransController.checkBalance)
TransRoute.put('/deposit/:userId', verifyToken, TransController.depositBalance)
TransRoute.put('/debit/:userId', verifyToken, TransController.debitBalance)

module.exports = TransRoute