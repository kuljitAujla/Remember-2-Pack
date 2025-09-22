import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const connectDB = async () => {

    mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB");
    });
    mongoose.connection.on("error", (err) => {
        console.log("MongoDB connection error", err);
    });
    

    await mongoose.connect(`${process.env.MONGODB_URI}/remember-2-pack`);
};

export default connectDB;
