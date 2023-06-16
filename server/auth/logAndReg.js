const jwt=require("jsonwebtoken")


const logAndReg=async(req,res,next)=>{
    try{
        if(req.cookies.itsToken){
            const token=req.cookies.itsToken
            const user_info=await jwt.verify(token,process.env.SECRET)
            res.status(200).json(user_info)

        }else(
            next()
        )

    }catch{
       next()
    }
}
module.exports=logAndReg