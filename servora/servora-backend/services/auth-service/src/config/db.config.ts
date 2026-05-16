import mongoose from "mongoose";

export const dbConnect = async() :Promise<void> => {

    try {

        const MONOGODB_URL = process.env.MONOGODB_URL;

        if(!MONOGODB_URL){
            console.log("Mongodb url not found");
            process.exit(1);
        }

        mongoose.connect(MONOGODB_URL);

        console.log("Auth service connected to db successfully");
        

    } catch (error) {

        if(error instanceof Error){
        console.log("Auth service db connection failed",error.message);
        process.exit(1);
       
        }
        else{
            console.log("Auth service db connection failed with some unknown error",error);
            process.exit(1);
        }
       
     
        
    }

}