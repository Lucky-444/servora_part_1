import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import { loginValidation } from "./middlewares/auth.middleware";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

const authProxy = proxy("http://localhost:3001",{
    proxyReqPathResolver:(req)=>{
        return req.originalUrl.replace("/api/v1/auth","")
    },

    proxyReqOptDecorator:(proxyReqOtps,srcReq)=>{

        if(srcReq.user){

            proxyReqOtps.headers["user_id"] = JSON.stringify(srcReq.user);
            
        }
        return proxyReqOtps;

    }
})


// Public Routes
app.use("/api/v1/auth/send-mail-auth",authProxy);
app.use("/api/v1/auth/signUp",authProxy);
app.use("/api/v1/auth/login",authProxy);
app.use("/api/v1/auth/forgot-password",authProxy);
app.use("/api/v1/auth/reset-password",authProxy);
app.use("/api/v1/auth/forgot-password-verify-otp",authProxy);

// Protected Route
app.use("/api/v1/auth/update-password",loginValidation,authProxy);



app.listen(PORT,()=>{

    console.log(`gateway service is successfully running at port number ${PORT}`);
    
})