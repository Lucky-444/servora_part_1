import express, { NextFunction ,Response,Request} from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import { loginValidation } from "./middlewares/auth.middleware";
import cookieParser from "cookie-parser";
import cors from "cors"

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(cookieParser());
app.use(cors());

// Logger
app.use((req : Request,res : Response,next : NextFunction)=>{
    console.log(`${req.method} ${req.url} `);
    next();
})

const authProxy = proxy("http://localhost:3001",{
    
    proxyReqPathResolver:(req)=>{
        return req.originalUrl.replace("/api/v1/auth","")
    },

    proxyReqOptDecorator:(proxyReqOtps,srcReq)=>{

        if(srcReq.user){

            proxyReqOtps.headers["user_id"] = JSON.stringify(srcReq.user);
            
        }
        return proxyReqOtps;

    },
    proxyErrorHandler:(err : any ,res : Response, next : NextFunction) => {
        console.log("Proxy Error :",err.message);
        res.status(500).json({
            success:false,
            message:"Auth Service unavaliable"
        })
        
    }
})


// Protected Route
app.use("/api/v1/auth/update-password",loginValidation,authProxy);

// Public Routes
app.use("/api/v1/auth",authProxy);





app.listen(PORT,()=>{

    console.log(`gateway service is successfully running at port number ${PORT}`);
    
})