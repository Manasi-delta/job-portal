import mongoose from "mongoose";

//function to connect to the MongoDB database
const connectDB=async ()=>{
    mongoose.connection.on('connected',()=> console.log('Database Connected'))
    //await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`)
    await mongoose.connect(process.env.MONGODB_URI)
}

export default connectDB