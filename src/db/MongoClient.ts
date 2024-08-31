import mongoose, { ConnectOptions } from 'mongoose';

const mongoUrlDocker = "mongodb://admin:pass@mongodb:27017/measurement_record";

export default async function connectDb(): Promise<void> {
  try {
    const mongoClientOptions: ConnectOptions = {
      authSource: "admin",
      user: "admin",
      pass: "pass",
      dbName: "measurement_record",
      serverSelectionTimeoutMS: 60000, 
      connectTimeoutMS: 60000,  
    };

    await mongoose.connect(mongoUrlDocker, mongoClientOptions);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}
