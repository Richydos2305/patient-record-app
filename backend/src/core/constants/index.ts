export const HttpStatus = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL: 500,
} as const;

export const TokenConfig = {
    ACCESS_EXPIRY: '1h',
    REFRESH_EXPIRY: '7d',
} as const;

export const SecurityConfig = {
    BCRYPT_ROUNDS: 12,
} as const;
