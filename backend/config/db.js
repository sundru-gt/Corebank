const mongoose= require('mongoose');

function connectDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Server connected to DB");
    })
    .catch(()=>{
        console.log("Error connecting to DB");
        //closes the server
        process.exit(1)
    })
}

module.exports=connectDB