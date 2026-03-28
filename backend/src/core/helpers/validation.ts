import Joi from 'joi';
import { ValidationError } from '../errors/CustomErrors';
import { logger } from './logger';
import { RegisterBody, LoginBody } from '../services/auth/interface';
import { CreatePatientBody, UpdatePatientBody } from '../services/patient/interface';
import { CreateCustomFieldBody, UpdateCustomFieldBody } from '../services/customField/interface';

const validate = (body: object, schema: Joi.ObjectSchema | Joi.Schema, context: string): void => {
    const { error } = schema.validate(body, { abortEarly: false });
    if (error) {
        logger.warn(`Validation failed: ${context}`, { error: error.details[0].message });
        throw new ValidationError(error.details.map((d) => d.message).join(', '));
    }
};

export const registerSchema = Joi.object({
    email:     Joi.string().email().required(),
    password:  Joi.string().min(8).required(),
    firstName: Joi.string().required(),
    lastName:  Joi.string().required(),
});

export const loginSchema = Joi.object({
    email:    Joi.string().email().required(),
    password: Joi.string().required(),
});

export const refreshSchema = Joi.object({
    token: Joi.string().required(),
});

export const idParamSchema = Joi.object({
    id: Joi.string().required(),
});

export const validateRegisterPayload = (body: RegisterBody): void => {
    validate(body, registerSchema, 'User Registration');
};

export const validateLoginPayload = (body: LoginBody): void => {
    validate(body, loginSchema, 'User Login');
};

const emergencyContactSchema = Joi.object({
    name:         Joi.string().required(),
    phone:        Joi.string().required(),
    relationship: Joi.string().required(),
});

export const createPatientSchema = Joi.object({
    firstName:        Joi.string().required(),
    lastName:         Joi.string().required(),
    dateOfBirth:      Joi.string().isoDate().required(),
    address:          Joi.string().required(),
    phone:            Joi.string().required(),
    emergencyContact: emergencyContactSchema.required(),
    prescriptions:    Joi.array().items(Joi.string()).optional(),
    appointmentDates: Joi.array().items(Joi.string().isoDate()).optional(),
    notes:            Joi.string().optional().allow(''),
    customFields:     Joi.object().unknown(true).optional(),
});

export const updatePatientSchema = Joi.object({
    firstName:        Joi.string().optional(),
    lastName:         Joi.string().optional(),
    dateOfBirth:      Joi.string().isoDate().optional(),
    address:          Joi.string().optional(),
    phone:            Joi.string().optional(),
    emergencyContact: emergencyContactSchema.optional(),
    prescriptions:    Joi.array().items(Joi.string()).optional(),
    appointmentDates: Joi.array().items(Joi.string().isoDate()).optional(),
    notes:            Joi.string().optional().allow(''),
    customFields:     Joi.object().unknown(true).optional(),
}).min(1);

export const validateCreatePatientPayload = (body: CreatePatientBody): void => {
    validate(body, createPatientSchema, 'Create Patient');
};

export const validateUpdatePatientPayload = (body: UpdatePatientBody): void => {
    validate(body, updatePatientSchema, 'Update Patient');
};

const customFieldTypeValues = ['text', 'number', 'date', 'boolean', 'file'] as const;

export const createCustomFieldSchema = Joi.object({
    name:        Joi.string().required(),
    label:       Joi.string().required(),
    type:        Joi.string().valid(...customFieldTypeValues).required(),
    required:    Joi.boolean().optional(),
    description: Joi.string().optional().allow(''),
});

export const updateCustomFieldSchema = Joi.object({
    label:       Joi.string().optional(),
    type:        Joi.string().valid(...customFieldTypeValues).optional(),
    required:    Joi.boolean().optional(),
    description: Joi.string().optional().allow(''),
}).min(1);

export const validateCreateCustomFieldPayload = (body: CreateCustomFieldBody): void => {
    validate(body, createCustomFieldSchema, 'Create Custom Field');
};

export const validateUpdateCustomFieldPayload = (body: UpdateCustomFieldBody): void => {
    validate(body, updateCustomFieldSchema, 'Update Custom Field');
};
