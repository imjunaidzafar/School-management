// import app from './app.js';
// import connectDB from './config/database.js';
// import dotenv from 'dotenv';

// dotenv.config();

// const PORT = process.env.PORT || 3000;

// // Connect to database
// connectDB();

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



import app from './app.js';
import connectDB from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.ENVIRONMENT || 'development';

(async () => {
  try {
    // Connect to the database
    await connectDB();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running in ${ENVIRONMENT} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error.message);
    process.exit(1);
  }
})();
