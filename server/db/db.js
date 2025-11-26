import mongoose from 'mongoose';

export const dbConnect = async () => {
    await mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Database connected successfully");
        
    }).catch((err)=>{
        console.error(err);
        
    })
}