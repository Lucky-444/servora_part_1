import express , {Request,Response} from "express";
import { AppError } from "../utils/appError";
import { ApiResonse } from "../types/apiResponse";
import { sendMailService } from "../services/mail.services";

export interface IMailData {
    email:string;
    subject:string;
    body:string;
    from:string;
}


export const sendMailController = async(req : Request,res : Response) => {

    try {

   
        

        //  fetch data
        const {email,subject,body,from} = req.body;

    

        // validation
        if(!email || !subject || !body || !from){
            throw new AppError("data is not sufficient to send mail",400);
        }

        // mail service 

        const mailSend = await sendMailService({
            email,from,body,subject
        });

        res.status(200).json({
            success:true,
            message:"otp send successfully"
        } as ApiResonse<null>)
        
        
    } catch (error : any) {
       console.log(error);
       res.status(error.statusCode || 500).json({
        success:false,
        message:error.message || "Intrenal Server error"
       })
        
    }
    
}