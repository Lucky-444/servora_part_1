import jwt from "jsonwebtoken";
import express , {Request,Response,NextFunction, request} from "express";
import { AppError } from "../utils/AppError";


export const loginValidation = async(req : Request , res : Response , next : NextFunction) => {

try {

    const token = req.headers.authorization?.startsWith("Bearer ") ? 
    req.headers.authorization.split(" ")[1] : req.cookies?.accessToken || req.body?.token;


    const verifyToken = jwt.verify(token,process.env.JWT_SECRATE!)

    req.user = verifyToken;

    next();
    
} catch (error : any) {
  console.log(error);
  res.status(error.statusCode || 403).json({
    success:false,
    message:error.message || "Invalid or expired token",
  })
   
}

}