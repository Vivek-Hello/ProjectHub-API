import mongoose from 'mongoose';

export const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB", conn.connection.host);
        return conn;
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
        process.exit(1);
    }
}