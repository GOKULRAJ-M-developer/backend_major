import express from 'express';
import authrouter from './routes/auth.route.js';
import cookieParser from "cookie-parser";


const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send("Hello World");
});

app.use('/api/auth',authrouter);



export default app;