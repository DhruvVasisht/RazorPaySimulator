import mongoose from 'mongoose';
const connectDb = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB');
    }
    catch(err){
        console.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1);
    }
}

export default connectDb;