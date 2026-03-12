import express from 'express';
import cookieParser from "cookie-parser";


const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send("Hello World");
});

import accountRoutes from "./routes/account.route.js";
import transactionRoutes from "./routes/transaction.route.js";
import authRoutes from "./routes/auth.route.js";
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/auth',authRoutes);

export default app;