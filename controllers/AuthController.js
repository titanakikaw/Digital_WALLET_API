const AuthUtil = require('../utils/Authentication');
const AuthModel = require('../models/AuthModel')
const UserModel = require('../models/UserModel');
const response = require('../utils/response');


const loginUser = async(req, res) => {
    const { email, password} = req.body;
    const currentDate = new Date();

    if(!email || !password){
        response.error(res, "Email and password are required!", 400)
        // return res.status(401).json({error : "Email and password are required!"})
    }
    const credentials = await AuthModel.checkUserEmail({email})
    if(!credentials){
        response.error(res, "User does not exist!Please try again", 404)
        // return res.status(409).json({error: "User does not exist!Please try again"})
    }

    if(!AuthUtil.comparePassword(password, credentials.Password)){
        response.error(res, "Invalid password! Please try again!", 401)
        // return res.status(404).json({error : "Invalid password! Please try again!"})
    }

    try {
        const accessToken = AuthUtil.generateToken(credentials);
        if(!accessToken){
            response.error(res, "Invalid password! Please try again!", 401)
            // return res.status(401).json({error : "Token not created, Please try again!"})
        }

        await UserModel.updateLoginDate({ date : currentDate.toISOString(), userId : credentials.AcctID})
        console.log('here')
        const user = await UserModel.getUserById(credentials.AcctID);
        response.success(res, { ...user,accessToken }, `Logged In!`)
        // return res.status(200).json({ ...user,accessToken })
    } catch (error) {
        response.error(res)
    }
  
}

const registerUser = async(req, res) => {
    const { email, password, name } = req.body
    try {
        if(!email || !password || !name ) {
            response.error(res, "Email, password and fullname are required!", 400)
        }
    
        const isExist = await AuthModel.checkUserEmail({email})
        if(isExist){
            response.error(res, "Email already exist! Please try again", 409)
            // return res.status(409).json({error: "Email already exist! Please try again"})
        }
        const accntID = await UserModel.createAccount({email, name});
        if(!accntID){
            response.error(res, "Unprocessable Entity", 422)
            // return res.status(422).json({error: "Unprocessable Entity"})
        }
    
        const hashedPassword = await AuthUtil.hashPassword(password);
        const newUser = await AuthModel.createCredentials({email, hashedPassword, accntID});
        if(newUser === 0) {
            response.error(res, "Unprocessable Entity", 422)
        }
        response.success(res, { email, password }, `Account created successfully`)
    
    } catch (error) {
        response.error(res)
    }
   
}

module.exports = {
    loginUser,
    registerUser
}
