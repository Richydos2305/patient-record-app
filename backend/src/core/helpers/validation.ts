import Joi from 'joi';
import { ValidationError } from '../errors/CustomErrors';
import logger from './logger';

export const validate = (
  request: Record<string, unknown>,
  schema: Joi.ObjectSchema | Joi.Schema,
  context?: string
): void => {
  const { error } = schema.validate(request, { abortEarly: false, allowUnknown: false });
  if (error) {
    if (context) {
      logger.warn(`Validation failed: ${context}`, { error: error.details[0].message });
    }
    throw new ValidationError(error.details[0].message);
  }
};

const passwordSchema = Joi.string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
  .message(
    'Password must be at least 8 characters and include uppercase, lowercase, number and special character'
  )
  .required();

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().trim().required(),
  password: passwordSchema
});

export const loginSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().required()
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().trim().optional(),
  password: passwordSchema.optional()
}).min(1);

export const createPatientSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  dob: Joi.string().isoDate().optional(),
  address: Joi.string().max(500).optional(),
  phone: Joi.string().max(30).optional(),
  emergencyContact: Joi.string().max(200).optional(),
  prescriptions: Joi.array().items(Joi.string()).optional(),
  appointmentDates: Joi.array().items(Joi.string().isoDate()).optional(),
  notes: Joi.string().max(5000).optional(),
  customValues: Joi.array()
    .items(
      Joi.object({
        fieldId: Joi.string().required(),
        value: Joi.alternatives()
          .try(Joi.string(), Joi.number(), Joi.boolean())
          .required()
      })
    )
    .optional()
});

export const updatePatientSchema = Joi.object({
  name: Joi.string().min(1).max(200).optional(),
  dob: Joi.string().isoDate().optional(),
  address: Joi.string().max(500).optional(),
  phone: Joi.string().max(30).optional(),
  emergencyContact: Joi.string().max(200).optional(),
  prescriptions: Joi.array().items(Joi.string()).optional(),
  appointmentDates: Joi.array().items(Joi.string().isoDate()).optional(),
  notes: Joi.string().max(5000).optional(),
  customValues: Joi.array()
    .items(
      Joi.object({
        fieldId: Joi.string().required(),
        value: Joi.alternatives()
          .try(Joi.string(), Joi.number(), Joi.boolean())
          .required()
      })
    )
    .optional()
}).min(1);

export const createCustomFieldSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  type: Joi.string().valid('text', 'number', 'date', 'boolean', 'file').required(),
  description: Joi.string().max(500).optional(),
  required: Joi.boolean().optional()
});

export const updateCustomFieldSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional(),
  type: Joi.string().valid('text', 'number', 'date', 'boolean', 'file').optional(),
  description: Joi.string().max(500).optional(),
  required: Joi.boolean().optional()
}).min(1);

export const validateRegister = (data: Record<string, unknown>): void =>
  validate(data, registerSchema, 'Register');

export const validateLogin = (data: Record<string, unknown>): void =>
  validate(data, loginSchema, 'Login');

export const validateUpdateUser = (data: Record<string, unknown>): void =>
  validate(data, updateUserSchema, 'Update User');

export const validateCreatePatient = (data: Record<string, unknown>): void =>
  validate(data, createPatientSchema, 'Create Patient');

export const validateUpdatePatient = (data: Record<string, unknown>): void =>
  validate(data, updatePatientSchema, 'Update Patient');

export const validateCreateCustomField = (data: Record<string, unknown>): void =>
  validate(data, createCustomFieldSchema, 'Create Custom Field');

export const validateUpdateCustomField = (data: Record<string, unknown>): void =>
  validate(data, updateCustomFieldSchema, 'Update Custom Field');
