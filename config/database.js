// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// dotenv.config();

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('MongoDB connected successfully');
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     process.exit(1);
//   }
// };

// export default connectDB;



import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Choose the appropriate database URI based on ENVIRONMENT
    const dbURI =
      process.env.ENVIRONMENT === 'test'
        ? process.env.MONGODB_URI_TEST
        : process.env.MONGODB_URI;

    await mongoose.connect(dbURI);

    console.log(`MongoDB connected successfully (${process.env.ENVIRONMENT || 'development'})`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
