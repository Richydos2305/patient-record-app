import dotenv from 'dotenv';
dotenv.config();

export const databaseSettings = {
  uri: process.env.MONGODB_URI as string
};
