export class ValidationError extends Error {
  public status = 400;
  public code = 'VALIDATION_ERROR';

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  public status = 404;
  public code = 'NOT_FOUND';

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends Error {
  public status = 401;
  public code = 'UNAUTHORIZED';

  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ConflictError extends Error {
  public status = 409;
  public code = 'CONFLICT';

  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export class ForbiddenError extends Error {
  public status = 403;
  public code = 'FORBIDDEN';

  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class SystemError extends Error {
  public status = 500;
  public code = 'SYSTEM_ERROR';

  constructor(message: string = 'Internal server error') {
    super(message);
    this.name = 'SystemError';
  }
}

export type CustomError =
  | ValidationError
  | NotFoundError
  | UnauthorizedError
  | ConflictError
  | ForbiddenError
  | SystemError;

export const isCustomError = (error: unknown): error is CustomError => {
  return (
    error instanceof ValidationError ||
    error instanceof NotFoundError ||
    error instanceof UnauthorizedError ||
    error instanceof ConflictError ||
    error instanceof ForbiddenError ||
    error instanceof SystemError
  );
};
