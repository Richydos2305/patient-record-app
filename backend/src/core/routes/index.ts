import { Router } from 'express';
import { authRouter } from './auth';
import { usersRouter } from './users';
import { patientsRouter } from './patients';
import { customFieldsRouter } from './customFields';
import { filesRouter } from './files';

export const router = Router();

router.use('/api/auth', authRouter);
router.use('/api/users', usersRouter);
router.use('/api/patients', patientsRouter);
router.use('/api/custom-fields', customFieldsRouter);
router.use('/api/files', filesRouter);
