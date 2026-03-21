import { Request, Response, NextFunction } from 'express';
import { isCustomError, SystemError } from '../errors/CustomErrors';
import logger from '../helpers/logger';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    return next(err);
  }

  const error = isCustomError(err) ? err : new SystemError('Internal server error');

  logger.error(error.message, { name: error.name, stack: err.stack });

  res.status(error.status).json({
    success: false,
    message: error.message,
    error: { code: error.code }
  });
};

export default errorHandler;
