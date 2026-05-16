
import dotenv from "dotenv";

dotenv.config();

import app from "./app";


const PORT = 5000;


app.listen(PORT,()=>{

    console.log(`Mail service is successfully running at port number ${PORT}`);
    
})
