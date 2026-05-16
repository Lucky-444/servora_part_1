import express , {Application, Express} from "express";
import router from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware";

const app : Application = express();

app.use(cookieParser());
app.use(express.json());


app.use("/",router);

// Error middleware
app.use(errorHandler)

export default app;