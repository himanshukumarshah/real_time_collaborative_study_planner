import mongoose from 'mongoose';

const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URL)
    .then(() => {console.log("Mongo DB connected successfully.")})
    .catch((error) => {console.error("Error connecting MongoDB", error)});
};
export default connectDB;