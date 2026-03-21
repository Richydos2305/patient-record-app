import { Request, Response, NextFunction } from 'express';
import { ResponseHandlerParams } from '../interfaces/helpers';
import { responseHandler } from '../helpers';

export const asyncHandler = (
  controller: (req: Request, res: Response) => Promise<ResponseHandlerParams>
) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await controller(req, res);
      responseHandler(res, result);
    } catch (error) {
      next(error);
    }
  };
