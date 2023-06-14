const AuthUtil = require('../utils/Authentication');
const AuthModel = require('../models/AuthModel')
const UserModel = require('../models/UserModel');
const response = require('../utils/response');


const loginUser = async(req, res) => {
    const { email, password} = req.body;
    const currentDate = new Date();

    if(!email || !password){
        return response.error(res, "Email and password are required!", 400)
    }
    const credentials = await AuthModel.checkUserEmail({email})
    if(credentials == null || !credentials){
        return response.error(res, "User does not exist!Please try again", 404)     
    }
    if(! await AuthUtil.comparePassword(password, credentials.Password)){
        return response.error(res, "Invalid password! Please try again!", 401)
    }
    try {
        // console.log(await AuthUtil.comparePassword(password, credentials.Password))
        const accessToken = AuthUtil.generateToken(credentials);
        if(!accessToken){
            return response.error(res)
        }
        await UserModel.updateLoginDate({ date : currentDate.toISOString(), userId : credentials.AcctID})
        const user = await UserModel.getUserById(credentials.AcctID);
        response.success(res, { ...user,accessToken }, `Logged In!`)
    } catch (error) {
        response.error(res)
    }
  
}

const registerUser = async(req, res) => {
    const { email, password, name } = req.body
    try {
        if(!email || !password || !name ) {
            return response.error(res, "Email, password and fullname are required!", 400)
        }
    
        const isExist = await AuthModel.checkUserEmail({email})
        if(isExist){
            return response.error(res, "Email already exist! Please try again", 409)
            // return res.status(409).json({error: "Email already exist! Please try again"})
        }
        const accntID = await UserModel.createAccount({email, name});
        if(!accntID){
            return response.error(res, "Server could not process request! Please try again")
        }
    
        const hashedPassword = await AuthUtil.hashPassword(password);
        const newUser = await AuthModel.createCredentials({email, hashedPassword, accntID});
        if(newUser === 0) {
            return response.error(res, "Server could not process request! Please try again")
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
