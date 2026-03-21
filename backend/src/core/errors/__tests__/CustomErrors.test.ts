import { describe, it, expect } from 'vitest';
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  ForbiddenError,
  SystemError,
  isCustomError
} from '../../errors/CustomErrors';

describe('CustomErrors', () => {
  describe('ValidationError', () => {
    it('has correct status and code', () => {
      const err = new ValidationError('bad input');
      expect(err.status).toBe(400);
      expect(err.code).toBe('VALIDATION_ERROR');
      expect(err.message).toBe('bad input');
      expect(err.name).toBe('ValidationError');
    });
  });

  describe('NotFoundError', () => {
    it('has correct status and code', () => {
      const err = new NotFoundError('not found');
      expect(err.status).toBe(404);
      expect(err.code).toBe('NOT_FOUND');
    });
  });

  describe('UnauthorizedError', () => {
    it('has correct status and code', () => {
      const err = new UnauthorizedError('unauthorized');
      expect(err.status).toBe(401);
      expect(err.code).toBe('UNAUTHORIZED');
    });
  });

  describe('ConflictError', () => {
    it('has correct status and code', () => {
      const err = new ConflictError('conflict');
      expect(err.status).toBe(409);
      expect(err.code).toBe('CONFLICT');
    });
  });

  describe('ForbiddenError', () => {
    it('has correct status and code', () => {
      const err = new ForbiddenError('forbidden');
      expect(err.status).toBe(403);
      expect(err.code).toBe('FORBIDDEN');
    });
  });

  describe('SystemError', () => {
    it('has correct status and code', () => {
      const err = new SystemError();
      expect(err.status).toBe(500);
      expect(err.code).toBe('SYSTEM_ERROR');
      expect(err.message).toBe('Internal server error');
    });

    it('accepts a custom message', () => {
      const err = new SystemError('db crashed');
      expect(err.message).toBe('db crashed');
    });
  });

  describe('isCustomError', () => {
    it('returns true for all custom error types', () => {
      expect(isCustomError(new ValidationError('x'))).toBe(true);
      expect(isCustomError(new NotFoundError('x'))).toBe(true);
      expect(isCustomError(new UnauthorizedError('x'))).toBe(true);
      expect(isCustomError(new ConflictError('x'))).toBe(true);
      expect(isCustomError(new ForbiddenError('x'))).toBe(true);
      expect(isCustomError(new SystemError())).toBe(true);
    });

    it('returns false for plain errors', () => {
      expect(isCustomError(new Error('plain'))).toBe(false);
      expect(isCustomError('string error')).toBe(false);
      expect(isCustomError(null)).toBe(false);
    });
  });
});
