import { describe, it, expect } from 'vitest';
import {
  validateRegister,
  validateLogin,
  validateUpdateUser,
  validateCreatePatient,
  validateUpdatePatient,
  validateCreateCustomField,
  validateUpdateCustomField
} from '../validation';
import { ValidationError } from '../../errors/CustomErrors';

describe('validateRegister', () => {
  it('passes with valid data', () => {
    expect(() =>
      validateRegister({ name: 'Alice', email: 'alice@test.com', password: 'Password1!' })
    ).not.toThrow();
  });

  it('throws if email is invalid', () => {
    expect(() =>
      validateRegister({ name: 'Alice', email: 'bad-email', password: 'Password1!' })
    ).toThrow(ValidationError);
  });

  it('throws if password is too weak', () => {
    expect(() =>
      validateRegister({ name: 'Alice', email: 'a@b.com', password: 'weak' })
    ).toThrow(ValidationError);
  });

  it('throws if name is missing', () => {
    expect(() =>
      validateRegister({ email: 'a@b.com', password: 'Password1!' })
    ).toThrow(ValidationError);
  });
});

describe('validateLogin', () => {
  it('passes with valid credentials', () => {
    expect(() => validateLogin({ email: 'a@b.com', password: 'anything' })).not.toThrow();
  });

  it('throws if email is missing', () => {
    expect(() => validateLogin({ password: 'anything' })).toThrow(ValidationError);
  });
});

describe('validateUpdateUser', () => {
  it('passes with a partial update', () => {
    expect(() => validateUpdateUser({ name: 'Bob' })).not.toThrow();
  });

  it('throws if object is empty', () => {
    expect(() => validateUpdateUser({})).toThrow(ValidationError);
  });
});

describe('validateCreatePatient', () => {
  it('passes with just a name', () => {
    expect(() => validateCreatePatient({ name: 'John Doe' })).not.toThrow();
  });

  it('passes with all optional fields', () => {
    expect(() =>
      validateCreatePatient({
        name: 'John',
        dob: '1990-01-01',
        phone: '07700900000',
        prescriptions: ['Aspirin'],
        customValues: [{ fieldId: 'fid1', value: 'Penicillin' }]
      })
    ).not.toThrow();
  });

  it('throws if name is missing', () => {
    expect(() => validateCreatePatient({ phone: '123' })).toThrow(ValidationError);
  });

  it('throws if dob is not a valid ISO date', () => {
    expect(() => validateCreatePatient({ name: 'Jane', dob: 'not-a-date' })).toThrow(ValidationError);
  });
});

describe('validateUpdatePatient', () => {
  it('passes with a partial update', () => {
    expect(() => validateUpdatePatient({ notes: 'Updated notes' })).not.toThrow();
  });

  it('throws if object is empty', () => {
    expect(() => validateUpdatePatient({})).toThrow(ValidationError);
  });
});

describe('validateCreateCustomField', () => {
  it('passes with valid data', () => {
    expect(() =>
      validateCreateCustomField({ name: 'Allergies', type: 'text' })
    ).not.toThrow();
  });

  it('throws if type is invalid', () => {
    expect(() =>
      validateCreateCustomField({ name: 'x', type: 'video' })
    ).toThrow(ValidationError);
  });

  it('throws if name is missing', () => {
    expect(() => validateCreateCustomField({ type: 'text' })).toThrow(ValidationError);
  });
});

describe('validateUpdateCustomField', () => {
  it('passes with partial update', () => {
    expect(() => validateUpdateCustomField({ required: true })).not.toThrow();
  });

  it('throws if object is empty', () => {
    expect(() => validateUpdateCustomField({})).toThrow(ValidationError);
  });
});
