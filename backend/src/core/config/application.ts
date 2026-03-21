import dotenv from 'dotenv';
dotenv.config();

export const settings = {
  port: process.env.PORT || 3000,
  environment: process.env.ENVIRONMENT || 'development',
  secretKey: process.env.ACCESSTOKENSECRET as string
};
