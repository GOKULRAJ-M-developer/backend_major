import mongoose from 'mongoose';
//console.log("MONGO_URI:", process.env.MONGO_URI);
export const connectDB = async() =>{
    try{
           const conn = await mongoose.connect(process.env.MONGO_URI);
           console.log("Connected to MongoDB");

    }catch(err){
        console.error("Error connecting to MongoDB",err);
        process.exit(1);
    }
}