const AuthUtil = require('../utils/Authentication');
const AuthModel = require('../models/AuthModel')
const UserModel = require('../models/UserModel')


const loginUser = async(req, res) => {
    const { email, password} = req.body;
    if(!email || !password){
        return res.status(401).json({error : "Email and password are required!"})
    }
    const credentials = await AuthModel.checkUserEmail({email})
    if(!credentials){
        return res.status(409).json({error: "User does not exist!Please try again"})
    }

    if(!AuthUtil.comparePassword(password, credentials.Password)){
        return res.status(404).json({error : "Invalid password! Please try again!"})
    }

    const user = await UserModel.getUserById(credentials.AcctID);

    const accessToken = AuthUtil.generateToken(credentials);
    if(!accessToken){
        return res.status(401).json({error : "Token not created, Please try again!"})
    }
    return res.status(200).json({ ...user,accessToken })
}

const registerUser = async(req, res) => {
    const { email, password, name } = req.body
    if(!email || !password || !name ) {
        return res.status(401).json({error : "Email, password and fullname are required!"})
    }
    const isExist = await AuthModel.checkUserEmail({email})

    if(isExist){
        return res.status(409).json({error: "Email already exist! Please try again"})
    }

    const accntID = await UserModel.createAccount({email, name});
    if(!accntID){
        return res.status(409).json({error: "Unable to register!Please try again"})
    }

    const hashedPassword = await AuthUtil.hashPassword(password);
    const newUser = await AuthModel.createCredentials({email, hashedPassword, accntID});
    if(newUser > 0) {
        return res.status(200).json({ message: "Registration Successful"})
    }

}

module.exports = {
    loginUser,
    registerUser
}
