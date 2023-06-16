const express= require("express")
const app= express()
const dotenv=require("dotenv")
const bcrypt=require("bcrypt")
const cors=require("cors")
const cookieParser=require("cookie-parser")

dotenv.config({path:"./.env"})
app.use(cors({credentials:true, origin:"http://localhost:3000"}))
require("./db/conn")
const users=require("./schema/users")
app.use(express.json())
app.use(cookieParser())
const logAndReg=require('./auth/logAndReg')


app.post("/register",logAndReg,async(req,res)=>{
    const data=await req.body.userInfo
    console.log(data)
    if(data.name && data.email && data.password){
        try{
            const user_info=await users({
                name:data.name,
                email:data.email,
                password:data.password
            })
            const token= await user_info.generateAuthToken()
            console.log(token)
            const user_save=await user_info.save()
            console.log(user_save)
            if(user_save){
                res.cookie("itsToken",token,{expiresIn:"1m"})
                res.status(201).json("User created sucessfully.")
            }
        }catch(err){
            console.log(err.keyValue)
            if(err.keyValue){
                res.status(409).json("User already exest use another email.")
            }else(err)(
                console.log(err)
            )
        }
    }else(
        res.status(500).json("Please fill all field.")
    )
})

// ------------------------------------login functionlity here-----------------

app.post("/login",logAndReg,async(req,res)=>{
    const data= req.body.data
    console.log(data)
    try{
        if(data.email && data.password){
            const data_match=await users.findOne({email:data.email})
            if(data_match){
                const pass_match= await bcrypt.compare(data.password,data_match.password)
                if(pass_match){
                    const token= await data_match.generateAuthToken()
                    res.cookie("itsToken",token)
                    res.status(200).json(data_match)
                }else(
                    res.status(500).json("invilid credentials try again")
                )
            }else(
                
                res.status(500).json("invilid credentials")
            )
        }else(
            res.status(500).json("invilid credentials.")
        )
        
    }catch(err){
        console.log(err)
    }
})

// ------------------------------home page--------------
app.post("/home",async(req,res)=>{
    const token=req.cookies.itsToken
    console.log(token)
})






app.listen(process.env.PORT,()=>{
    console.log(`server is listning at ${process.env.PORT}`)
})