import mongoose from "mongoose";

let cached = global.mongoose

if(!cached){
    cached = global.mongoose = {conn: null, promise: null}
}

async function connectDB() {
    if(cached.conn){
        return cached.conn
    }

    if(!cached.promise){
        const opts = {
            bufferCommands: false,
        }

        cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
            return mongoose
        })
    }

    cached.conn = await cached.promise

    if (typeof window !== 'undefined') {
        document.body.removeAttribute('cz-shortcut-listen');
    }

    console.log("MONGODB_URI:", process.env.MONGODB_URI);
    return cached.conn
}

export default connectDB
