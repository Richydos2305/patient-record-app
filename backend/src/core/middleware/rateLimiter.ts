import rateLimit from 'express-rate-limit';
import { SecurityConfig } from '../constants';

const rateLimitResponse = (type: string) => ({
  success: false,
  message: `Too many ${type} attempts. Please try again later.`,
  error: { code: 'RATE_LIMIT_EXCEEDED' }
});

export const registerRateLimit = rateLimit({
  windowMs: SecurityConfig.RateLimitWindow,
  max: SecurityConfig.MaxLoginAttempts,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => res.status(429).json(rateLimitResponse('registration'))
});

export const loginRateLimit = rateLimit({
  windowMs: SecurityConfig.RateLimitWindow,
  max: SecurityConfig.MaxLoginAttempts * 2,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => res.status(429).json(rateLimitResponse('login'))
});

export const generalRateLimit = rateLimit({
  windowMs: SecurityConfig.RateLimitWindow,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => res.status(429).json(rateLimitResponse(''))
});
