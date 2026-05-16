import express , {NextFunction, Request,Response} from "express"
import { IUser } from "../models/user.model"
import { AppError } from "../utils/AppError";
import { sendEmailService } from "../services/otp.service";
import { ApiResonse } from "../types/apiResponse.types";
import { loginService, logoutService, refreshTokenService, signUpService } from "../services/auth.service";
import { forgortPasswordVerifyOtpService, forgotPasswordService, resetPasswordService, updatePasswordService } from "../services/password.service";
import { getRedisClient } from "../config/redis.config";


export const sendEmailContller = async(req : Request,res : Response , next : NextFunction) =>{

    try {
        // fetch data
        const {fullName,email,password,role,confirmPassword} = req.body;

        // validation
        if(!fullName || !email || !password || !role || !confirmPassword){
            throw new AppError("Please fill all the input fields",400);
        }

        if(password !== confirmPassword){
            throw new AppError("password and confirmPassword not matched",422);
        }

        if(password.length < 8){
            throw new AppError("password is too short",422);
        }

        // service call
        const newOtp = await sendEmailService({email});



        res.status(201).json({
            success:true,
            message:"Otp send successfully",
        } as ApiResonse<null>)
      
    } catch (error : any) {
        next(error);
    }

}

export const signUpController = async(req : Request,res:Response , next: NextFunction) => {

    try {
        // fetch data
        const {fullName,email,password,role,confirmPassword,otp} = req.body;
        
        // validation
        if(!fullName || !email || !password || !role || !confirmPassword){
            throw new AppError("Something went wrong",400);
        }

        if(password !== confirmPassword){
            throw new AppError("password and confirmPassword not matched",422);
        }

        if(password.length < 8){
            throw new AppError("password is too short",422);
        }

        if(!otp){
            throw new AppError("Please fill the opt",400)
        }

        if(otp.length < 4){
            throw new AppError("Please fill the opt",400);
        }

        // call signUp service
        const newUser = await signUpService({fullName,email,password,role,otp});

        const options = {
            expires:new Date(Date.now() + 7*24*60*60*1000),
            httpOnly:true,
        }

        res.cookie("refreshToken",newUser.refreshToken,options).status(201).json({
              success:true,
              message:"Signup sucessfully",
              data:newUser.userObj,
        }as ApiResonse<typeof newUser>)
        
    } catch (error : any) {
      next(error)
        
    }

}

export const loginController = async(req : Request , res : Response , next:NextFunction) => {

    try {
        // fetch data
        const {email,password} = req.body;

        // validation
        if(!email || !password){
            throw new AppError("Please fill all the input fields",400);
        }

        // redis client
        const client = getRedisClient();

        // fetch user ip address
        const clienttIpAdrress = req.ip;

        const key = `${clienttIpAdrress}:request_count`;

        const requestCount = await client.incr(key);

        if(requestCount === 1){
            await client.expire(key,60);
        }

        if(requestCount > 10){
            throw new AppError("Too many requests",429);
        }
        
        // call login service
        const loginServiceCall = await loginService({email,password});

        
        const options = {
            expires:new Date(Date.now() + 7*24*60*60*1000),
            httpOnly:true,
        }

        // return response
        res.cookie("refreshToken",loginServiceCall.refreshToken,options).status(200).json({
            success:true,
            message:"Login Successfully",
            data:loginServiceCall.userObj,
        } as ApiResonse<typeof loginServiceCall>)
        
    } catch (error : any) {
       next(error)
        
    }

}

export const forgotPasswordController = async(req : Request , res : Response ,  next: NextFunction) => {

    try {
        // fetch data
        const {email} = req.body;

        // validation
        if(!email){
            throw new AppError("Please fill the input field",400)
        }

        // call the forgotPasswordService
        const forgotPasswordServiceCall = await forgotPasswordService({email});

        // return response
        res.status(201).json({
             success:true,
             message:"Otp send successfully for forgot password",
        } as ApiResonse<null>)


        
    } catch (error : any) {
         next(error)
        
    }

}

export const forgorPasswordVerifyOtpController = async(req : Request , res : Response ,  next: NextFunction) => {

    try {
        // fetch data
        const {email,otp} = req.body;

        // validation
        if(!email || !otp){
            throw new AppError("Please fill the otp",400)
        }

        if(otp.length < 4){
           throw new AppError("Please fill the otp",400)
        }

        // call the service
        const updateUser = await forgortPasswordVerifyOtpService({email,otp});

        // return response
        res.status(200).json({
            success:true,
            message:"Otp verified successfully",
            data:updateUser,
        } as ApiResonse<typeof updateUser>)
        
    } catch (error : any) {
            next(error)
    }

}

export const resetPasswordController = async (req : Request , res : Response ,  next: NextFunction) => {

    try {
        // fetch data
        const {token,password,confirmPassword} = req.body;

        // validation
        if(!password || !confirmPassword){
           throw new AppError("Please fill all the input fields",400);
        }

        if(!token){
            throw new AppError("Something went wrong during fetching token",400);
        }

        if(password !== confirmPassword){
            throw new AppError("Password and confirmPassword not matched",422)
        }

        if(password.length < 8){
             throw new AppError("password is too short",422);
        }

        // call the reset password service
        const resetPasswordServiceCall = await resetPasswordService({token,password});

        // return response
        res.status(200).json({
           success:true,
           message:"Password reset successfully",  
        } as ApiResonse<null>)
        
    } catch (error : any) {
       next(error)
        
    }

}

export const updatePasswordController = async (req : Request , res : Response ,  next: NextFunction) => {

    try {

        const userData= JSON.parse(req.headers["user_id"] as any) ;

        const userId = userData.userId;


        // fetch data
        const {password,oldPassword,confirmPassword} = req.body;

        // validation
        if(!userId){
            throw new AppError("Something went wrong during fetching userId",400);
        }

        if(!password || !oldPassword || !confirmPassword){
            throw new AppError("Please fill all the input fields",400);
        }

        if(password !== confirmPassword){
            throw new AppError("password and confirmPassword not matched",422);
        }

        if(password.length < 8){
            throw new AppError("password is too short",422);
        }

         if(password === oldPassword){
            throw new AppError("New and old password is same",409);
        }

        // call the service
        const updatePasswordServiceCall  = await updatePasswordService({userId,password,oldPassword});

        // return response
        res.status(200).json({
             success:true,
             message:"Password Updated Successfully",
             data:updatePasswordServiceCall,
        } as ApiResonse<typeof updatePasswordServiceCall>)
        
    } catch (error : any) {
    next(error)
        
    }

}

export const refreshTokenController = async (req:Request , res : Response ,  next: NextFunction) => {

    try {
        
        // get refreshToken from cookie
        const refreshToken = req.cookies.refreshToken;

        // validation
        if(!refreshToken){
            throw new AppError("Refresh token missing",401);
        }

        const refreshTokenServiceCall = await refreshTokenService({refreshToken});

        res.cookie("refreshToken", refreshTokenServiceCall.newRefreshToken,{
            httpOnly:true,
            secure:false,
            maxAge:7 * 24 * 60 * 60 * 1000,
        }).status(200).json({
            success:true,
            message:"New access token send successfully",
            data:refreshTokenServiceCall.accessToken,
        } as ApiResonse<typeof refreshTokenServiceCall.accessToken>)

        
    } catch (error : any) {
       next(error) 
    }

}

export const logoutController = async (req : Request , res : Response ,  next: NextFunction) => {

    try {
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
        res.status(200).json({
        success:true,
        message:"Logout successfully"
      } as ApiResonse<null>) 
      return ;
        }

      const logoutServiceCall = await logoutService({refreshToken});

      res.clearCookie("refreshToken");

      res.status(200).json({
        success:true,
        message:"Logout successfully"
      } as ApiResonse<null>)
        
    } catch (error : any) {
       next(error)
    }

}