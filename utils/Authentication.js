const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { checkUserEmail } = require('../models/AuthModel');
const response = require('./response');
const secretKey = process.env.SECRET_KEY


const generateToken = (params) => {
    const { Email, Password } = params;
    if (!Email || !Password) {
        return null
    }
    const token = jwt.sign({Email, Password}, secretKey, { expiresIn : '6h'})
    return token;
}

const verifyToken = (req,res,next) => {
    try {
        const { userId } = req.params
        const { authorization } = req.headers
        if(!authorization){ 
            return response.error(res, "Authentication token is required to access the requested resource. Please provide a valid token.", 401)
        }
        const token = authorization.replace('Bearer ', '')
        // console.log(token)
        jwt.verify(token, secretKey, async(err, decoded) => {
            if(err){
                return response.error(res, "Invalid Token!", 401)
            }
            const { Email } = decoded;
            if(!Email){
                return response.error(res, "Missing important resources", 400)
            }
            const { AcctID } = await checkUserEmail({ email : Email})
            if(AcctID != userId){
                return response.error(res, "Access Denied", 403)
            }
           
            next();
        })
    } catch (error) {
            console.log(error)
    }

}

// const verifyToken = (req, res, next) => {
//     const { userId } = req.params;
//     const { authorization } = req.headers;
  
//     if (!authorization) {
//       return response.error(res, "Authentication token is required to access the requested resource. Please provide a valid token.", 401);
//     }
  
//     const token = authorization.replace('Bearer ', '');
  
//     try {
//       jwt.verify(token, secretKey, async (err, decoded) => {
//         if (err) {
//           return response.error(res, "Invalid Token!", 401);
//         }
  
//         const { Email } = decoded;
  
//         if (!Email) {
//           return response.error(res, "Missing important resources", 400);
//         }
  
//         const { AcctID } = await checkUserEmail({ email: Email });
  
//         if (AcctID !== userId) {
//           return response.error(res, "Access Denied", 403);
//         }
  
//         next();
//       });
//     } catch (error) {
//       // Handle any other errors here
//       console.error(error);
//       return response.error(res, "An error occurred", 500);
//     }
//   };
  

const hashPassword = async(password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword;
    } catch (error) {
        throw error
    }

}

const comparePassword = async(password, userPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, userPassword);
        return isMatch
    }catch(err){
        throw err
    }
}


module.exports = {
    generateToken,
    verifyToken,
    hashPassword,
    comparePassword
}