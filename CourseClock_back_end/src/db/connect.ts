import mongoose, { ConnectOptions } from 'mongoose';

const connectDB = (url: string) => {
  return mongoose.connect(url, { 
  } as ConnectOptions);
};

export default connectDB;
