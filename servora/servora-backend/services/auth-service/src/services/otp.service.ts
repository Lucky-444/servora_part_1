import axios from "axios";
import { User } from "../models/user.model";
import { AppError } from "../utils/AppError";
import otp from "otp-generator";
import { sendMailTemplate } from "../templetes/otp.template";
import { getRedisClient } from "../config/redis.config";

interface IUserData { 
    email:string;
}

export const sendEmailService = async (data:IUserData) =>{

    const {email} = data;
 
    const isExist = await User.findOne({email:email});

    if(isExist){
        throw new AppError("Email allready registered",409);       
    }

    const newOtp = otp.generate(4,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,     
    });

    // save otp in redis

    const client = getRedisClient();

    await client.set(`signup_otp:${email}`,newOtp,{
        EX:300
    })

    const mailData = {
        email:email,
        subject:"for otp verification",
        body:sendMailTemplate(Number(newOtp)),
        from:"Servora"
    }

    const mailServiceCall = await axios.post("http://localhost:5000/api/v1/send-mail",mailData)

 

}