import cron from 'node-cron'
import Budget from '../models/budgetModels.js'
import { errorHelper } from '../helper/errorHelper.js';

cron.schedule('0 0 * * *',async()=>{
    try {
        const budgets=await Budget.find();
        for(const bud of budgets){
            const now=Date.now();
            const createdAt=new Date(bud.createdAt);
            let reset=false;
            if(bud.timeFrame==="monthly"){
                reset=now-createdAt>=30*24*60*60*1000;
            }else if(bud.timeFrame==="weekly"){
                reset=now-createdAt>=7*24*60*60*1000;
            }else if(bud.timeFrame==="yearly"){
                reset=now-createdAt>=365*24*60*60*1000;
            }
            if(reset){
                bud.spend=0;
                bud.createdAt=now;
                await bud.save();
            }
        }
    } catch (error) {
        return errorHelper(res, error);
    }
})