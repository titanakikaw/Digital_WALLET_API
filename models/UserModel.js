const db = require('../db');

const createAccount = async(params) => {
    const { email, name } = params;
    const sql = `INSERT INTO ${process.env.TBL_USER_ACCOUNT} (name, email) VALUES (?,?)`;
    try {
        const result = await new Promise((resolve, reject) => {
            db.query(sql, [name, email], (err, result) => {
                if(err){
                    reject(err);
                }
                resolve(result)
            })
        })
        return result.insertId;
    } catch (error) {
        throw error;
    }
}


const getUserById = async(id) => {
    try {
        const sql = `SELECT * from ${process.env.TBL_USER_ACCOUNT} where UserID = ?`;   
        const result = await new Promise((resolve,reject) => {
            db.query(sql, [id], (err, result) => {
                if(err){
                    reject(err)
                }
                resolve(result)
            })
        })
        if(result.length == 0){
            return null
        }
        return result[0];
    } catch (error) {
        
    }
}


module.exports = {
    createAccount,
    getUserById
}