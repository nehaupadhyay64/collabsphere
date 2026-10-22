import mongoose from "mongoose";
import config from "./index.js";
const connectDB = async () => {
    try{
        await mongoose.connect(config.mongoUri);
        console.log("MongoDB connected  ✅")
    }catch(error){
        console.error("DB error:",error.message);
    }
};
export default connectDB;
