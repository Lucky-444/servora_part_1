import express , {Application, Express} from "express";
import router from "./routes/auth.routes";

const app : Application = express();

app.use(express.json());


app.use("/",router);


export default app;