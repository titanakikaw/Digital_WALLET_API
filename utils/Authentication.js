const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = "12345678"


const generateToken = (params) => {
    const { Email, Password } = params;
    if (!Email || !Password) {
        return null
    }
    const token = jwt.sign({Email, Password}, secretKey, { expiresIn : '6h'})
    return token;
}

const verifyToken = (req,res,next) => {
    const { authorization } = req.headers
    if(!authorization){
        return res.status(401).json({ error : "Authentication token is required to access the requested resource. Please provide a valid token."})
    }
    const token = authorization.replace('Bearer ', '')
    jwt.verify(token, secretKey, (err, decoded) => {
        if(err){
            return res.status(401).json({ error : "Invalid token or Token has already expired! Please try again"})
        }
        next();
    })

}

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