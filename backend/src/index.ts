import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { settings } from './core/config/application';
import { connectDatabase } from './core/database/mongoose';
import routes from './core/routes';
import errorHandler from './core/middleware/errorhandler';
import logger from './core/helpers/logger';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDatabase();
    app.listen(settings.port, () => {
      logger.info(`Server running on port ${settings.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

start();

export { app };
