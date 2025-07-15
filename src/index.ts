import express,{Request, Response} from 'express';
import {connectDB} from "./db";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";

dotenv.config();

const app=express();

const PORT=process.env.PORT||300;

app.use(express.json());
app.use("/api/v1",authRoutes);

app.get('/',(req: Request,res: Response)=>{
    res.send("API is running..");
});

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`);
    }); 
});