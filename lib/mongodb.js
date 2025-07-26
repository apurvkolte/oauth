import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
    throw new Error("Please define the MONGODB_URL in .env");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    if (cached.conn) {
        console.log(" MongoDB already connected.");
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URL, {
                bufferCommands: false,
            })
            .then((mongooseInstance) => {
                console.log("MongoDB connected successfully!");
                return mongooseInstance;
            })
            .catch((err) => {
                console.error(" MongoDB connection error:", err.message);
                throw err;
            });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err.message);
        throw err;
    }
}
