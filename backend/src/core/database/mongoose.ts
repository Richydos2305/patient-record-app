import mongoose from 'mongoose';
import { databaseSettings } from '../config/database';
import logger from '../helpers/logger';

export const connectDatabase = async (): Promise<void> => {
  await mongoose.connect(databaseSettings.uri);
  logger.info(`Connected to MongoDB: ${mongoose.connection.name}`);
};

export default mongoose;
