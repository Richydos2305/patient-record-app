import { Document } from 'mongoose';
import { Response } from 'express';
import { ResponseHandlerParams } from '../interfaces/helpers';
import { SanitizedUser } from '../services/auth/interface';

export { ResponseHandlerParams };

export const responseHandler = <T>(res: Response, params: ResponseHandlerParams<T>): void => {
    const success = params.status < 400;
    res.status(params.status).json(
        success
            ? { success: true, message: params.message, data: params.data }
            : { success: false, message: params.message, error: params.error },
    );
};

export const sanitizeUser = (user: Document): SanitizedUser => {
    const { password: _password, ...rest } = user.toObject();
    return rest as SanitizedUser;
};

export const sanitizePatient = (patient: { toObject(): Record<string, unknown> }): Record<string, unknown> => {
    return patient.toObject();
};
