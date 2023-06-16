const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const new_user= new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true,
    },
    email:{
        type:String,
        require:true,
        trim:true,
        unique:true,
    },
    password:{
        type:String,
        require:true,
        trim:true
    },
    date:{
        type:Date,
        require:true,
        default:Date.now
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }]
})

new_user.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10)
    }
    next()
})

new_user.methods.generateAuthToken=async function(){
    try{
        const token=jwt.sign({name:this.name, email:this.email,id:this._id},process.env.SECRET)
        this.tokens=this.tokens.concat({token:token})
        await this.save()
        return token
    }catch(err){
        console.log(err)
    }
}

const user_Schema= new mongoose.model("User",new_user)

module.exports=user_Schema