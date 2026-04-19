import jwt from "jsonwebtoken";
import express , {Request,Response,NextFunction, request} from "express";
import { AppError } from "../utils/AppError";


export const loginValidation = async(req : Request , res : Response , next : NextFunction) => {

try {
    const token = req.headers.authorization;

    if(!token || !token.startsWith("Bearer ")){
        throw new AppError("Token is missing or malformed",401)     
    }

    const actualToken = token.split(" ")[1];

    const verifyToken = jwt.verify(actualToken,process.env.JWT_SECRATE!)

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