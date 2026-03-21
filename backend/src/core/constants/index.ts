export const TokenConfig = {
  AccessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || '15m',
  AccessTokenExpirySeconds: parseInt(process.env.ACCESS_TOKEN_EXPIRY_SECONDS || '900'),
  RefreshTokenExpiryMs: parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || '30') * 24 * 60 * 60 * 1000,
  RefreshTokenExpiryDays: parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || '30'),
  BcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12')
} as const;

export const SecurityConfig = {
  MaxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5'),
  RateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000')
} as const;
