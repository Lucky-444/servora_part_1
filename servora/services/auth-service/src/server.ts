import app from "./app";
import dotenv from "dotenv";
import { dbConnect } from "./config/db.config";

dotenv.config();

const PORT = process.env.PORT;


dbConnect();

app.listen(PORT,()=>{
    
 console.log(`Auth service is successfully running at port number ${PORT}`);  

});