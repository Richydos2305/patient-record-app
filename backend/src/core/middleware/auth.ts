import { Request, Response, NextFunction } from 'express';
import { verify, Secret } from 'jsonwebtoken';
import { settings } from '../config/application';
import { UnauthorizedError } from '../errors/CustomErrors';
import logger from '../helpers/logger';

export interface UserPayload {
  userDetails: {
    id: string;
    name: string;
    email: string;
  };
}

declare global {
  namespace Express {
    interface Locals {
      userDetails: {
        id: string;
        name: string;
        email: string;
      };
    }
  }
}

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.header('Authorization');
  const prefix = 'Bearer ';

  if (!authHeader || !authHeader.startsWith(prefix)) {
    return next(new UnauthorizedError('Unauthorized'));
  }

  const token = authHeader.slice(prefix.length);

  try {
    const secret = (process.env.ACCESSTOKENSECRET || settings.secretKey) as Secret;
    const payload = verify(token, secret) as UserPayload;
    res.locals.userDetails = payload.userDetails;
    next();
  } catch (error) {
    logger.warn('JWT verification failed', { error });
    next(new UnauthorizedError('Unauthorized'));
  }
};
