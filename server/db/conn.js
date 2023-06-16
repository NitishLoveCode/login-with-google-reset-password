const mongoose=require("mongoose")

mongoose.connect(process.env.DBURL)
    .then(()=>{
        console.log("Database is connected")
    })
    .catch((err)=>{
        console.log(err)
    })