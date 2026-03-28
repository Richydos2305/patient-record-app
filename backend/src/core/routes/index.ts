import { Router } from 'express';
import { authRouter } from './auth';
import { patientsRouter } from './patients';
import { customFieldsRouter } from './customFields';
import { filesRouter } from './files';

export const router = Router();

router.use('/api/auth', authRouter);
router.use('/api/patients', patientsRouter);
router.use('/api/custom-fields', customFieldsRouter);
router.use('/api/files', filesRouter);
