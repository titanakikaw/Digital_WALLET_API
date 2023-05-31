const db = require('../db');

const getBalance = async(params) => {
    const { userId } = params;

    try {
        const sql = `SELECT AccountBalance from ${process.env.TBL_USER_ACCOUNT} where UserID = ? AND Activated = true`;
  
        const result = await new Promise((resolve, reject) => {
            db.query(sql, [userId], (err, result) => {
                if(err){
                    reject(err)
                }
                resolve(result);
            })
        })

        if(result.length === 0 ){
            return null
        }
        return result[0]

    } catch (error) {
        console.log(error)
        return null;
    }
}

const updateBalance = async(params) => {
    const { userId, balance } = params;
    try {
        const sql = `UPDATE ${process.env.TBL_USER_ACCOUNT} SET AccountBalance = ? where userID = ?`;
        const result = await new Promise((resolve, reject) => {
            db.query(sql, [balance, userId], (err, result) => {
                if(err){
                    reject(err)
                }
                resolve(result)
            })
        })
        if(!result){
            return null
        }
        return result;
    } catch (error) {
        console.log(error)
        return null
    }

}


const newTransaction = async(params) => {
    const { userId, date, description, amount, transType } = params
    const sql = `INSERT INTO ${process.env.TBL_TRANSACTION} (UserID, TransDate, Description, Amount, TransactionType) VALUES (?, ?, ?, ?, ?)`;
    try {
        const result = await new Promise((resolve, reject) => {
            db.query(sql, [ userId, date, description, amount, transType], (err, result) => {
                if(err){
                    reject(err)
                }
                resolve(result)
            })
        })
        return result.insertId;
    } catch (error) {
        console.log(error)
        return error;
    }
}

const getAllTransactions = async(params) => {
    const { userId } = params;
    const sql = `SELECT * from ${process.env.TBL_TRANSACTION} where UserID=?`;
    try {
        const result = await new Promise((resolve, reject) => {
            db.query(sql, [userId], (err, result) => {
                if(err){
                    reject(err)
                }
                resolve(result)
            })
        })

        if(result.length === 0){
            return null
        }

        return result;

    } catch (error) {
        
    }
}

module.exports = {
    getBalance,
    updateBalance,
    newTransaction,
    getAllTransactions
}