const TransModel = require('../models/TransModel');
const response = require('../utils/response')
const { createTransaction } = require('../utils/utils');

const checkBalance = async(req, res) => {
    const { userId } = req.params;
    if(!userId){
        response.error(res, "User undefined!Please try again", 400)
    }
    const balance = await TransModel.getBalance({userId})
    if(!balance){
        response.error(res, "Account not found! Please try again", 404)
    }

    try {
        const newParams = createTransaction({userId, description : "", transType: "Balance Inquiry" })
        TransModel.newTransaction(newParams)

        response.success(res, balance, `Your account balance is ${balance.AccountBalance.toLocaleString('en-ph', { style :'currency', currency: 'PHP'})}`)
    } catch (error) {
        response.error(res)
    }
    
}

const depositBalance = async(req,res) => {
    const { depositBal } = req.body
    const { userId } = req.params


    if(!userId || !depositBal ){
        response.error(res, "No data provided! Please try again", 401)
        // return res.status(401).json({error : "No data provided! Please try again"})
    }

    if (isNaN(depositBal) || parseFloat(depositBal) < 0 ) {
        response.error(res, "Invalid entry! Please try again", 422)
        // return res.status(401).json({ error: "Invalid deposit balance format! Please try again!" });
    }

    const prevBalance = await TransModel.getBalance({userId})
    if(prevBalance?.AccountBalance < 0 ){
        response.error(res, "Account not found! Please try again", 404)
        // return res.status(404).json({error : "Account not found! Please try again"})
    }

    try {
        const updatedBalance = parseFloat(depositBal) + parseFloat(prevBalance.AccountBalance);
        const newBalance = await TransModel.updateBalance({ userId, balance : updatedBalance })
        if(newBalance.affectedRows === 0){
            response.error(res)
            // return res.status(401).json({error : "Unable to update balance! Please try again"})
        }

        const newParams = createTransaction({userId, description : "", amount : depositBal, transType: "Deposit" })
        TransModel.newTransaction(newParams)

        response.success(res, {AccountBalance : updatedBalance}, `Successfuly updated! Your new balance is ${updatedBalance.toLocaleString('en-ph', { style: 'currency', currency: 'php'})}`)

       
    } catch (error) {
        response.error(res)
    }
   
}

const debitBalance = async(req,res) => {
    const { debitBal } = req.body
    const { userId } = req.params
    if(!userId || !debitBal ){
        response.error(res, "No data provided! Please try again", 401)
    }

    if (isNaN(debitBal)) {
        response.error(res, "Invalid entry! Please try again", 401)
        // return res.status(401).json({ error: "Invalid debit balance format!", details : "Invalid debit format! Please try again" });
    }

    const prevBalance = await TransModel.getBalance({userId})
    if(!prevBalance?.AccountBalance){
        response.error(res, "Account not found! Please try again", 404)
        // return res.status(404).json({error : "Account not found! Please try again"})
    }

    if(parseFloat(debitBal) > parseFloat(prevBalance.AccountBalance)){
        response.error(res, "Invalid entry! Please try again", 401)
        // return res.status(401).json({error: "Invalid transaction", details: "Debit balance cannot the greater than current account balance! Please try again."})
    }

    try {
        const updatedBalance =  parseFloat(prevBalance.AccountBalance) - parseFloat(debitBal);
        const newBalance = await TransModel.updateBalance({ userId, balance : updatedBalance })
        if(newBalance.affectedRows === 0){
            response.error(res)
            // return res.status(401).json({error : "Unable to update balance! Please try again"})
        }
        const newParams = createTransaction({userId, description : "", amount : debitBal, transType: "Debit" })
        TransModel.newTransaction(newParams)


        response.success(res, {AccountBalance : updatedBalance}, `Successfuly updated! Your new balance is ${updatedBalance.toLocaleString('en-ph', { style: 'currency', currency: 'php'})}`)

        // return res.status(200).json({ message : `Successfuly updated! Your new balance is ${updatedBalance.toLocaleString('en-ph', { style: 'currency', currency: 'php'})}`,})

    } catch (error) {
        response.error(res)
 
    }
   
}

const getHistory = async(req,res) => {
    const { userId } = req.params
   
    if(!userId){
        response.error(res, "Invalid entry! Please try again", 401)
    }


    try {
        const transactionHistory = await TransModel.getAllTransactions({userId});
        if(!transactionHistory){
            response.error(res, "No data was found! Please try again", 404)
            // return res.status(404).json({error : "Not Found", message: "No data was found! Please try again"})
        }
    
        response.success(res, {transactionHistory}, `Transaction History`)
        // return res.status(200).json({transactionHistory})
    } catch (error) {
        response.error(res)
    }
  

}

module.exports = {
    getHistory,
    checkBalance,
    depositBalance,
    debitBalance
}