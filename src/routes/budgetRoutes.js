import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import {getBudget,addBudget} from '../controller/budgetController.js'

const router=express.Router();
router.get('/budget',authMiddleware,getBudget);
router.post('/budget',authMiddleware,addBudget);

export default router;