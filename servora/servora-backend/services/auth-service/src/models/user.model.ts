import mongoose from "mongoose";

export interface IUser {

    fullName:string;
    email:string;
    password:string;
    role:"User" | "Worker" | "Admin";
    resetToken:string;
    resetTokenExpiry:string;


}

const userSchema = new mongoose.Schema<IUser>({

    fullName:{
        type:String,
        trim:true,
        required:[true,"fullname field is missing"]
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        required:[true,"email field is missing"]
    },
    password:{
       type:String,
       required:[true,"password filed is missing"],
    },
    role:{
        type:String,
        enum:["User","Worker","Admin"],
        default:"User",

    },
    resetToken:{
        type:String,
    },
    resetTokenExpiry:{
        type:String,
    }
    

},{timestamps:true});

export const User = mongoose.model<IUser>("User",userSchema);