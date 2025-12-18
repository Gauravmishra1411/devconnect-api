 const mongoose = require('mongoose');
 require("dotenv").config()
 
 const connectDB=async()=>{
 
await mongoose.connect(process.env.DB_URL);
console.log("Database connected successfully");
}
//  connectDB().then(()=>{
//     console.log("Database connected successfully");
//  }).catch((err)=>{ console.log(err);
//   console.log("Database connection failed");
//       })  
module.exports=connectDB;