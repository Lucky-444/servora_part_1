import express from "express";
import { User } from "../models/user.model";
import { AppError } from "../utils/AppError";
import otpGenerator from "otp-generator";
import { Otp } from "../models/otp.model";
import { sendMailTemplate } from "../templetes/otp.template";
import axios from "axios";
import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { passwordResetTemplate } from "../templetes/passwordReset.template";
import { passwordUpdateTemplate } from "../templetes/passwordUpdate.template";

interface IForgotPasswordData {
    email:string;
}

interface IForgorPasswordVerifyOtpData {
    email:string;
    otp:string;
}

interface IResetPasswordData {
    token:string;
    password:string;
}

interface IUpdatePasswordData {
    userId:string;
    password:string;
    oldPassword:string;
}

export const forgotPasswordService = async (data:IForgotPasswordData) => {

    const {email} = data;

    // check user exists or not
    const isUserExist = await User.findOne({email:email});

    // validation
    if(!isUserExist){
        throw new AppError("Email not registerd",404);
    }

    // generate new otp
    const otp = await otpGenerator.generate(4,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });

    // save this otp in db
    const newOtp = await Otp.create({
        otp:otp,
        email:email,
    });

    const mailData = {
        email:email,
        subject:"for otp verification",
        body:sendMailTemplate(Number(otp)),
        from:"Servora"
    }

    const mailServiceCall = await axios.post("http://localhost:5000/api/v1/send-mail",mailData);
    
    return newOtp;

}

export const forgortPasswordVerifyOtpService = async(data : IForgorPasswordVerifyOtpData) => {

    const {email,otp} = data;

    // find latest otp
    const latestOtp = await Otp.findOne({email:email}).sort({createdAt:-1});

    // validation
    if(!latestOtp){
        throw new AppError("Otp not found or expired",404)
    }

    if(latestOtp.otp !== otp){
        throw new AppError("Otp not matched",422);
    }

    // generate token
    const token = crypto.randomBytes(32).toString("hex");

   const updatedUser =  await User.findOneAndUpdate({email:email},{
        resetToken:token,
        resetTokenExpiry: Date.now() + 10 * 60 * 1000
    },{returnDocument:"after"}).select("-password");

    return updatedUser;

}

export const resetPasswordService = async(data : IResetPasswordData) => {

    const {token,password} = data;

    // find the user with the help of token
    const userDetails = await User.findOne({resetToken:token});

    // validation
    if(!userDetails){
        throw new AppError("Session expired",404);
    }

    if(userDetails.resetTokenExpiry < String(Date.now())){
       throw new AppError("Session expired",400);
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password,10);

    // update the user
    const updatedUser = await User.findOneAndUpdate({resetToken:token},{
        password:hashedPassword,
        resetToken:"",
        resetTokenExpiry:"" 
    },{returnDocument:"after"});

     const mailData = {
        email:userDetails.email,
        subject:"Password Reset Successfully – Servora Account Secured",
        body:passwordResetTemplate(userDetails.fullName,userDetails.email),
        from:"Servora"
    }

    const mailServiceCall = await axios.post("http://localhost:5000/api/v1/send-mail",mailData);

    return updatedUser;
    
}

export const updatePasswordService = async(data : IUpdatePasswordData) => {

    const {userId,password,oldPassword} = data;

    // find userDetails
    const userDetails = await User.findById(userId);

    if(!userDetails){
        throw new AppError("User not found",404);
    }

    // match old password
    const isOldPasswordMatched = await bcrypt.compare(oldPassword,userDetails.password);

    if(!isOldPasswordMatched){
        throw new AppError("Old password not matched",422)
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password,10);

    // update the user password
    const updatedUser = await User.findByIdAndUpdate(userId,{
        password:hashedPassword,
    },{returnDocument:"after"}).select("-password");

    
     const mailData = {
        email:userDetails.email,
        subject:"Password Reset Successfully – Servora Account Secured",
        body:passwordUpdateTemplate(userDetails.fullName,userDetails.email),
        from:"Servora"
    }

    const mailServiceCall = await axios.post("http://localhost:5000/api/v1/send-mail",mailData);

    return updatedUser;


}