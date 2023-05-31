const TransModel = require('../models/TransModel');
const { createTransaction } = require('../utils/utils');

const checkBalance = async(req, res) => {
    const { userId } = req.query;
    
    if(!userId){
        return res.status(401).json({error : "User undefined!Please try again"})
    }
    
    const balance = await TransModel.getBalance({userId})
    if(!balance){
        return res.status(404).json({error : "Account not found! Please try again"})
    }

    const newParams = createTransaction({userId, description : "", transType: "Balance Inquiry" })
    TransModel.newTransaction(newParams)

    return res.status(200).json(balance)
}

const depositBalance = async(req,res) => {
    const { userId, depositBal } = req.body
    if(!userId || !depositBal ){
        return res.status(401).json({error : "No data provided! Please try again"})
    }

    if (isNaN(depositBal)) {
        return res.status(401).json({ error: "Invalid deposit balance format! Please try again!" });
    }

    const prevBalance = await TransModel.getBalance({userId : 7})
    if(prevBalance?.AccountBalance < 0 ){
        return res.status(404).json({error : "Account not found! Please try again"})
    }

    try {
        const updatedBalance = parseFloat(depositBal) + parseFloat(prevBalance.AccountBalance);
        const newBalance = await TransModel.updateBalance({ userId, balance : updatedBalance })
        if(newBalance.affectedRows > 0){
            return res.status(200).json({ message : `Successfuly updated! Your new balance is ${updatedBalance.toLocaleString('en-ph', { style: 'currency', currency: 'php'})}`,})
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
   
}

const debitBalance = async(req,res) => {
    const { userId, debitBal } = req.body
    if(!userId || !debitBal ){
        return res.status(401).json({error : "No data provided! Please try again"})
    }

    if (isNaN(debitBal)) {
        return res.status(401).json({ error: "Invalid debit balance format!", details : "Invalid debit format! Please try again" });
    }

    const prevBalance = await TransModel.getBalance({userId})
    if(!prevBalance?.AccountBalance){
        return res.status(404).json({error : "Account not found! Please try again"})
    }

    if(parseFloat(debitBal) > parseFloat(prevBalance.AccountBalance)){
        return res.status(401).json({error: "Invalid transaction", details: "Debit balance cannot the greater than current account balance! Please try again."})
    }

    try {
        const updatedBalance =  parseFloat(prevBalance.AccountBalance) - parseFloat(debitBal);
        const newBalance = await TransModel.updateBalance({ userId, balance : updatedBalance })
        if(newBalance.affectedRows > 0){
            return res.status(200).json({ message : `Successfuly updated! Your new balance is ${updatedBalance.toLocaleString('en-ph', { style: 'currency', currency: 'php'})}`,})
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
   
}

const getHistory = async(req,res) => {
    const { userId } = req.params
   
    if(!userId){
        return res.status(401).json({error : "Invalid request", message: "Missing user parameter"})
    }
    const transactionHistory = await TransModel.getAllTransactions({userId});
    console.log(transactionHistory)
    if(!transactionHistory){
        return res.status(404).json({error : "Not Found", message: "No data was found! Please try again"})
    }

    return res.status(200).json({transactionHistory})

}

module.exports = {
    getHistory,
    checkBalance,
    depositBalance,
    debitBalance
}