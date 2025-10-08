import express from 'express'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js'
import transactionRoutes from './src/routes/transactionRoutes.js'
import budgetRoutes from './src/routes/budgetRoutes.js'
import './src/cron/budgetReset.js'

const app=express();
dotenv.config();
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.set('views','views');

app.use(authRoutes);
app.use(transactionRoutes);
app.use(budgetRoutes);


app.listen(5000,()=>{
    console.log('server is listening on port 5000');
})
