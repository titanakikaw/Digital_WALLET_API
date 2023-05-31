const db = require('../db');

const checkUserEmail = async(params) => {
    const { email } = params;
    const sql = `SELECT * from ${process.env.TBL_USER_CREDENTIALS} where email = ?`;
    try {
        const result = await new Promise((resolve, reject) => {
            db.query(sql, [email], (err, result) => {
                if(err){
                    reject(err)
                }
                resolve(result)
            })
        })
        if(result.length === 0) {
            return null
        }
        return result[0];
    } catch (error) {
        throw error
    }

}

const createCredentials = async(params) => {
    const { email, hashedPassword, accntID } = params;
    const sql = `INSERT INTO ${process.env.TBL_USER_CREDENTIALS} (email, password,  AcctID) VALUES (?,?,?)`;

    try {
        const result = await new Promise((resolve, reject) => {
            db.query(sql, [email, hashedPassword, accntID], (err, result) => {
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

const getUser = async(params) => {
    const { email, password } = params;
    const sql = `SELECT * from ${process.env.TBL_USER_CREDENTIALS} where email = ?  AND password= ?`;
    try {
        const result = await new Promise((resolve, reject) => {
            db.query(sql,[email, password], (err, result) => {
                if(err){
                    reject(err);
                }
                resolve(result)
            })
        })
        if(result.length === 0) {
            return null
        }
        return result[0];
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getUser,
    createCredentials,
    checkUserEmail
}