import { getRedisClient } from "../config/redis.config";
import { User } from "../models/user.model";
import { AppError } from "../utils/AppError";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

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

interface IRefreshToken {
   refreshToken : string;
}

interface ILogout {
   refreshToken : string;
}

// signUp service
export const signUpService = async(data:ISignUpData) => {

    const {fullName,email,password,role,otp} = data;

    // check is user allreday registerd or not
    const isUserRegistered = await User.findOne({email:email});

    if(isUserRegistered){
        throw new AppError("Email allready registered",409);
    }

    // redis client
    const client = getRedisClient();

    // find latest otp
    const latestOtp = await client.get(`signup_otp:${email}`)

  // verify
  if(!latestOtp){
    throw new AppError("Otp not found",404);
  }

  if(latestOtp !== otp){
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

 const refreshTokenPayload = {
   userId:newUser._id,
 }

 const ACCESS_TOKEN_JWT_SECRATE = process.env.ACCESS_TOKEN_JWT_SECRATE;
 
 if(!ACCESS_TOKEN_JWT_SECRATE){
  throw new AppError("Internal Server error",500)
 }

  const REFRESH_TOKEN_JWT_SECRATE = process.env.REFRESH_TOKEN_JWT_SECRATE;
 
 if(!REFRESH_TOKEN_JWT_SECRATE){
  throw new AppError("Internal Server error",500)
 }



 const accessToken =  jwt.sign(paylod,ACCESS_TOKEN_JWT_SECRATE,{
    expiresIn:"15min"
 });

const refreshToken = jwt.sign(refreshTokenPayload,REFRESH_TOKEN_JWT_SECRATE,{
   expiresIn:"7d"
 })

 // save refresh token in redis
 await client.set(`session:${newUser._id}`,refreshToken,{
    EX:604800
 })

const userObj : any = newUser.toObject();

userObj.accessToken = accessToken;
// userObj.refreshToken = refreshToken;
userObj.password = undefined;

return {userObj,refreshToken};

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

 
 const ACCESS_TOKEN_JWT_SECRATE = process.env.ACCESS_TOKEN_JWT_SECRATE;
 
 if(!ACCESS_TOKEN_JWT_SECRATE){
  throw new AppError("Internal Server error",500)
 }

  const REFRESH_TOKEN_JWT_SECRATE = process.env.REFRESH_TOKEN_JWT_SECRATE;
 
 if(!REFRESH_TOKEN_JWT_SECRATE){
  throw new AppError("Internal Server error",500)
 }



 const accessToken =  jwt.sign(paylod,ACCESS_TOKEN_JWT_SECRATE,{
    expiresIn:"15min"
 });

 const refreshTokenPayload = {
   userId:isUserExist._id,
 };

const refreshToken = jwt.sign(refreshTokenPayload,REFRESH_TOKEN_JWT_SECRATE,{
   expiresIn:"7d"
 })

//  redis client
const client = getRedisClient();

await client.set(`session:${isUserExist._id}`,refreshToken,{
   EX:604800
})

 const userObj : any = isUserExist.toObject();

userObj.accessToken = accessToken;
userObj.password = undefined;

return {userObj,refreshToken};

}

export const refreshTokenService = async(data : IRefreshToken) => {

   const refreshToken = data.refreshToken;

   // verify the refreshToken
   const decoded : any = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_JWT_SECRATE!);

   const userId  = decoded.userId;

   // redis client
   const client = getRedisClient();

   // check redis session
   const storedToken = await client.get(`session:${userId}`);

   if(!storedToken || storedToken !== refreshToken){
      throw new AppError("Session expired or invalid",403);
   }

   // fetch user from DB
   const user = await User.findById(userId);

   if(!user){
      throw new AppError("User not found",404);
   }

    const paylod = {
    email:user?.email,
    role:user?.role,
    fullName:user?.fullName,
    userId:userId,
 }

 // generate new accessToken
 const accessToken = jwt.sign(paylod,process.env.ACCESS_TOKEN_JWT_SECRATE!,{
   expiresIn:"15min"
 });

 const refreshTokenPayload = {
   userId:userId,
 }

 // rotate refreshToken
 const newRefreshToken = jwt.sign(refreshTokenPayload,process.env.REFRESH_TOKEN_JWT_SECRATE!,{
   expiresIn:"7d"
 });

 await client.set(`session:${userId}`,newRefreshToken,{
   EX:604800
})

return {accessToken,newRefreshToken};

}

export const logoutService = async (data : ILogout) => {

      const refreshToken = data.refreshToken;

         // verify the refreshToken
   const decoded : any = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_JWT_SECRATE!);

   const userId  = decoded.userId;

   
   // redis client
   const client = getRedisClient();

   await client.del(`session:${userId}`);

   await client.set(`blacklist:${userId}`,"true",{
      EX:604800
   });

   

}