import jwt from 'jsonwebtoken'
import { errorHelper } from '../helper/errorHelper.js';

const authMiddleware=(req,res,next)=>{
    try {
        const token=req.cookies.token;
        if(!token){
            return res.send('please login first');
        }
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        if(!decode){
            return res.send('please login again');
        }
        req.id=decode.id;
        next();
    } catch (error) {
        return errorHelper(res,error);
    }
}

export default authMiddleware;