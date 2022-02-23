import mongoose, { ConnectOptions } from "mongoose";

const dbUrl: string = process.env.MONGO_DB_URL as string;

async function connectToDB() {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    console.log("Database connected successfully");
  } catch (err) {
    console.log(err);
    console.log("Database connection failed");
  }
}

export { connectToDB };
