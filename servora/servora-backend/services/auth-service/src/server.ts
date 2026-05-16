import app from "./app";
import dotenv from "dotenv";
import { dbConnect } from "./config/db.config";
import { redisConnect } from "./config/redis.config";

dotenv.config();

const PORT = process.env.PORT;


dbConnect();
redisConnect();

app.listen(PORT,()=>{
    
 console.log(`Auth service is successfully running at port number ${PORT}`);  

});