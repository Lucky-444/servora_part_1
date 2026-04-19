import { Otp } from "../models/otp.model";
import { User } from "../models/user.model";
import { AppError } from "../utils/AppError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface ISignUpData {
    fullName:string;
    email:string;
    password:string;
    role:"User" | "Worker" | "Admin",
    otp:string;
}

interface ILoginData {
   email:string;
   password:string;
}

// signUp service
export const signUpService = async(data:ISignUpData) => {

    const {fullName,email,password,role,otp} = data;

    // check is user allreday registerd or not
    const isUserRegistered = await User.findOne({email:email});

    if(isUserRegistered){
        throw new AppError("Email allready registered",409);
    }

    // find latest otp
    const latestOtp = await Otp.findOne({email:email}).sort({createdAt:-1});

  // verify
  if(!latestOtp){
    throw new AppError("Otp not found",404);
  }

  if(latestOtp.otp !== otp){
    throw new AppError("Otp not matched",422);
  }

  // hash the password
  const hashedPassword = await bcrypt.hash(password,10);

 // create new user
 const newUser = await User.create({
    email:email,
    password:hashedPassword,
    role:role,
    fullName:fullName,
 });

 const paylod = {
    email:email,
    role:role,
    fullName:fullName,
    userId:newUser._id,
 }

 const JWT_SECRATE = process.env.JWT_SECRATE;
 
 if(!JWT_SECRATE){
  throw new AppError("Internal Server error",500)
 }


 const token = await jwt.sign(paylod,JWT_SECRATE,{
    expiresIn:"1y"
 });


const userObj : any = newUser.toObject();

userObj.token = token;
userObj.password = undefined;

return userObj;

}

// login service
export const loginService = async(data:ILoginData) => {

   const {email,password} = data;

   // check is this email registerd or not
   const isUserExist = await User.findOne({email:email});

   if(!isUserExist){
      throw new AppError("Email not registered",404);
   }

   // check password
   const isMatched = await bcrypt.compare(password,isUserExist.password);

   if(!isMatched){
      throw new AppError("Password not matched",422);
   }

   // generate token
 const paylod = {
    email:email,
    role:isUserExist.role,
    fullName:isUserExist.fullName,
    userId:isUserExist._id,
 }

  const JWT_SECRATE = process.env.JWT_SECRATE;
 
 if(!JWT_SECRATE){
  throw new AppError("Internal Server error",500)
 }

 const token = jwt.sign(paylod,JWT_SECRATE,{
   expiresIn:"1y"
 })

 const userObj : any = isUserExist.toObject();

userObj.token = token;
userObj.password = undefined;

return userObj;

}