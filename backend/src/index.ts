import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { settings } from './core/config/application';
import { connectDB } from './core/config/database';
import { router } from './core/routes/index';
import { errorHandler } from './core/middleware/errorhandler';
import { logger } from './core/helpers/logger';

const app = express();

app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

app.use(errorHandler);

connectDB().then(() => {
    app.listen(settings.port, () => {
        logger.info('server_started', { port: settings.port });
    });
});
