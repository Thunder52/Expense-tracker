import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js';
import {getHome,getTransaction,addTransaction,exportCsv} from '../controller/transactionController.js'

const router=express.Router();

router.get('/home',authMiddleware,getHome);
router.get('/transaction',authMiddleware,getTransaction)
router.post('/add-transaction',authMiddleware,addTransaction);
router.get('/export/csv',authMiddleware,exportCsv)

export default router