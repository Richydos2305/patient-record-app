import { Request, Response, NextFunction } from 'express';
import { ServiceFactory } from '../factories/ServiceFactory';
import { HttpStatus } from '../constants';
import { ResponseHandlerParams } from '../interfaces/helpers';
import { ValidationError } from '../errors/CustomErrors';

export const uploadFile = async (
    req: Request,
    _res: Response,
    _next: NextFunction,
): Promise<ResponseHandlerParams> => {
    if (!req.file) throw new ValidationError('No file provided');
    const fileService = ServiceFactory.createFileService();
    const file = await fileService.upload(req.file, req.params.patientId);
    return { status: HttpStatus.CREATED, message: 'File uploaded successfully', data: file };
};

export const listFiles = async (
    req: Request,
    _res: Response,
    _next: NextFunction,
): Promise<ResponseHandlerParams> => {
    const fileService = ServiceFactory.createFileService();
    const files = await fileService.listByPatient(req.params.patientId);
    return { status: HttpStatus.OK, message: 'Files retrieved successfully', data: files };
};

export const deleteFile = async (
    req: Request,
    _res: Response,
    _next: NextFunction,
): Promise<ResponseHandlerParams> => {
    const fileService = ServiceFactory.createFileService();
    await fileService.delete(req.params.filename);
    return { status: HttpStatus.OK, message: 'File deleted successfully' };
};
