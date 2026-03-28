import { Request, Response, NextFunction } from 'express';
import { ServiceFactory } from '../factories/ServiceFactory';
import { HttpStatus } from '../constants';
import { ResponseHandlerParams } from '../interfaces/helpers';
import { IPatientDocument } from '../models/Patient';

export const listPatients = async (
    req: Request,
    _res: Response,
    _next: NextFunction,
): Promise<ResponseHandlerParams<IPatientDocument[]>> => {
    const patientService = ServiceFactory.createPatientService();
    const patients = await patientService.list(req.query);
    return { status: HttpStatus.OK, message: 'Patients retrieved successfully', data: patients };
};

export const getPatient = async (
    req: Request,
    _res: Response,
    _next: NextFunction,
): Promise<ResponseHandlerParams<IPatientDocument>> => {
    const patientService = ServiceFactory.createPatientService();
    const patient = await patientService.getById(req.params.id);
    return { status: HttpStatus.OK, message: 'Patient retrieved successfully', data: patient };
};

export const createPatient = async (
    req: Request,
    _res: Response,
    _next: NextFunction,
): Promise<ResponseHandlerParams<IPatientDocument>> => {
    const patientService = ServiceFactory.createPatientService();
    const patient = await patientService.create(req.body);
    return { status: HttpStatus.CREATED, message: 'Patient created successfully', data: patient };
};

export const updatePatient = async (
    req: Request,
    _res: Response,
    _next: NextFunction,
): Promise<ResponseHandlerParams<IPatientDocument>> => {
    const patientService = ServiceFactory.createPatientService();
    const patient = await patientService.update(req.params.id, req.body);
    return { status: HttpStatus.OK, message: 'Patient updated successfully', data: patient };
};

export const deletePatient = async (
    req: Request,
    _res: Response,
    _next: NextFunction,
): Promise<ResponseHandlerParams> => {
    const patientService = ServiceFactory.createPatientService();
    await patientService.delete(req.params.id);
    return { status: HttpStatus.OK, message: 'Patient deleted successfully' };
};
