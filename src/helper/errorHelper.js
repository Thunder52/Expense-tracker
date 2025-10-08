export const errorHelper=(res,error)=>{
    console.log(error);
    return res.status(500).send("Something wents wrong");
}