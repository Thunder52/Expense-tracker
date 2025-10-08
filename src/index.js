import express from 'express'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path'
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'
import budgetRoutes from './routes/budgetRoutes.js'
import './cron/budgetReset.js'

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const app=express();
dotenv.config({path:path.resolve(__dirname,'../.env')});
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'..','views'));

app.use(authRoutes);
app.use(transactionRoutes);
app.use(budgetRoutes);


app.listen(5000,()=>{
    console.log('server is listening on port 5000');
})
