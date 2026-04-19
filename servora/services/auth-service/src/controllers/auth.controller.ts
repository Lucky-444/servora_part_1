import express , {Request,Response} from "express"
import { IUser } from "../models/user.model"
import { AppError } from "../utils/AppError";
import { sendEmailService } from "../services/otp.service";
import { ApiResonse } from "../types/apiResponse.types";
import { loginService, signUpService } from "../services/auth.service";
import { forgortPasswordVerifyOtpService, forgotPasswordService, resetPasswordService, updatePasswordService } from "../services/password.service";


export const sendEmailContller = async(req : Request,res : Response) =>{

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
            data:newOtp,

        } as ApiResonse<typeof newOtp>)




        
    } catch (error : any) {
       console.log(error);
       res.status(error.statusCode || 500).json({
        success:false,
        message:error.message || "Internal server error",
       })
        
    }

}

export const signUpController = async(req : Request,res:Response) => {

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
            expires:new Date(Date.now() + 3*24*60*60*1000),
            httpOnly:true,
        }

        res.cookie("token",newUser.token,options).status(201).json({
              success:true,
              message:"Signup sucessfully",
              data:newUser,
        }as ApiResonse<typeof newUser>)
        
    } catch (error : any) {
      console.log(error);
      res.status(error.statusCode || 500).json({
        success:false,
        message:error.message || "Internal Server error",
      })
        
    }

}

export const loginController = async(req : Request , res : Response) => {

    try {
        // fetch data
        const {email,password} = req.body;

        // validation
        if(!email || !password){
            throw new AppError("Please fill all the input fields",400);
        }

        // call login service
        const loginServiceCall = await loginService({email,password});

        
        const options = {
            expires:new Date(Date.now() + 3*24*60*60*1000),
            httpOnly:true,
        }

        // return response
        res.cookie("token",loginServiceCall.token,options).status(200).json({
            success:true,
            message:"Login Successfully",
            data:loginServiceCall,
        } as ApiResonse<typeof loginServiceCall>)
        
    } catch (error : any) {
      console.log(error);
      res.status(error.statusCode || 500).json({
        success:false,
        message:error.message || "Internal Server error",
      })
        
    }

}

export const forgotPasswordController = async(req : Request , res : Response) => {

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
             data:forgotPasswordServiceCall,
        } as ApiResonse<typeof forgotPasswordServiceCall>)


        
    } catch (error : any) {
      console.log(error);
      res.status(error.statusCode || 500).json({
        success:false,
        message:error.message || "Internal Server error",
      })
        
    }

}

export const forgorPasswordVerifyOtpController = async(req : Request , res : Response) => {

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
      console.log(error);
      res.status(error.statusCode || 500).json({
        success:false,
        message:error.message || "Internal Server error",
      })
        
    }

}

export const resetPasswordController = async (req : Request , res : Response) => {

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
      console.log(error);
      res.status(error.statusCode || 500).json({
        message:error.message || "Internal Server error",
      })
        
    }

}

export const updatePasswordController = async (req : Request , res : Response) => {

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
      console.log(error);
      res.status(error.statusCode || 500).json({
        success:false,
        message:error.message || "Internal Server error",
      })
        
    }

}