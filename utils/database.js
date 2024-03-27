import mongoose from 'mongoose';

let isConnected = false;

export const connectToDb = async () => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    console.log('Already connected to database');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "share_prompt",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    isConnected = true;
    console.log('Connected to database');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}